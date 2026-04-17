"use client";

import { useEffect, useRef } from "react";

type Node = {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  phase: number;
  driftAmp: number;
  pulseIntensity: number;
  radius: number;
};

type Connection = {
  a: number;
  b: number;
  strength: number;
  cx: number;
  cy: number;
};

type Pulse = {
  connRef: Connection;
  forward: boolean;
  t: number;
  speed: number;
  depth: number;
};

type Props = {
  /** CSS color for nodes, lines, and glow. Defaults to the site accent. */
  accent?: string;
  /** Approximate node count. Rejection-sampled, so actual count may be slightly lower. */
  nodeCount?: number;
  /** Frame range between spontaneous firing bursts. */
  burstIntervalFrames?: [number, number];
  /** Optional className for the canvas element. */
  className?: string;
};

function bezPt(
  ax: number, ay: number,
  cx: number, cy: number,
  bx: number, by: number,
  t: number
) {
  const it = 1 - t;
  return {
    x: it * it * ax + 2 * it * t * cx + t * t * bx,
    y: it * it * ay + 2 * it * t * cy + t * t * by,
  };
}

export default function NeuralDish({
  accent = "#6fa8ff",
  nodeCount = 28,
  burstIntervalFrames = [180, 420],
  className = "",
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const hex = accent.replace("#", "");
    const ar = parseInt(hex.substring(0, 2), 16);
    const ag = parseInt(hex.substring(2, 4), 16);
    const ab = parseInt(hex.substring(4, 6), 16);
    const rgba = (a: number) => `rgba(${ar}, ${ag}, ${ab}, ${a})`;
    const brightR = Math.min(255, ar + 70);
    const brightG = Math.min(255, ag + 50);
    const brightB = Math.min(255, ab + 30);
    const brightRgba = (a: number) =>
      `rgba(${brightR}, ${brightG}, ${brightB}, ${a})`;
    // Softer resting node color — less saturated, slightly warmer
    const softR = Math.min(255, ar + 40);
    const softG = Math.min(255, ag + 17);
    const softB = Math.min(255, ab - 15);
    const softRgba = (a: number) =>
      `rgba(${softR}, ${softG}, ${softB}, ${a})`;

    let width = 0;
    let height = 0;
    let centerX = 0;
    let centerY = 0;
    let radius = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    let nodes: Node[] = [];
    let connections: Connection[] = [];
    let pulses: Pulse[] = [];
    let time = 0;
    let lastBurst = 0;
    let nextBurstIn =
      burstIntervalFrames[0] +
      Math.random() * (burstIntervalFrames[1] - burstIntervalFrames[0]);

    const MAX_CONN = 3;

    function initNetwork() {
      nodes = [];
      const attempts = nodeCount * 40;
      const minDist = radius * 0.24;
      let tries = 0;
      while (nodes.length < nodeCount && tries < attempts) {
        tries++;
        const a = Math.random() * Math.PI * 2;
        const r = Math.sqrt(Math.random()) * radius * 0.92;
        const x = centerX + Math.cos(a) * r;
        const y = centerY + Math.sin(a) * r;
        let ok = true;
        for (const n of nodes) {
          const dx = n.x - x;
          const dy = n.y - y;
          if (dx * dx + dy * dy < minDist * minDist) {
            ok = false;
            break;
          }
        }
        if (ok) {
          nodes.push({
            x,
            y,
            baseX: x,
            baseY: y,
            phase: Math.random() * Math.PI * 2,
            driftAmp: 0.4 + Math.random() * 0.8,
            pulseIntensity: 0,
            radius: 1.8 + Math.random() * 1,
          });
        }
      }

      connections = [];
      const maxConnDist = radius * 1.1;
      const seen = new Set<string>();
      for (let i = 0; i < nodes.length; i++) {
        const dists: { j: number; d: number }[] = [];
        for (let j = 0; j < nodes.length; j++) {
          if (i === j) continue;
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < maxConnDist) dists.push({ j, d });
        }
        dists.sort((a, b) => a.d - b.d);
        const count = Math.min(MAX_CONN, dists.length);
        for (let k = 0; k < count; k++) {
          const j = dists[k].j;
          const key = i < j ? `${i}-${j}` : `${j}-${i}`;
          if (!seen.has(key)) {
            seen.add(key);
            const na = nodes[i],
              nb = nodes[j];
            const mx = (na.x + nb.x) / 2,
              my = (na.y + nb.y) / 2;
            const dx = nb.x - na.x,
              dy = nb.y - na.y;
            const perpX = -dy,
              perpY = dx;
            const len = Math.sqrt(perpX * perpX + perpY * perpY) || 1;
            const toCenterX = centerX - mx,
              toCenterY = centerY - my;
            const dot = (perpX / len) * toCenterX + (perpY / len) * toCenterY;
            const sign = dot > 0 ? -1 : 1;
            const bend =
              (0.08 + Math.random() * 0.15) * dists[k].d * sign;
            connections.push({
              a: i,
              b: j,
              strength: 0.1 + Math.random() * 0.15,
              cx: mx + (perpX / len) * bend,
              cy: my + (perpY / len) * bend,
            });
          }
        }
      }
    }

    function resize() {
      if (!canvas) return;
      const rect = canvas.parentElement!.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      centerX = width / 2;
      centerY = height / 2;
      radius = Math.min(width, height) * 0.42;
      initNetwork();
    }

    function spawnPulse(fromIdx: number, depth = 0) {
      if (depth > 2) return;
      const cands = connections.filter(
        (c) => c.a === fromIdx || c.b === fromIdx
      );
      if (!cands.length) return;
      const conn = cands[Math.floor(Math.random() * cands.length)];
      const forward = conn.a === fromIdx;
      pulses.push({
        connRef: conn,
        forward,
        t: 0,
        speed: 0.004 + Math.random() * 0.003,
        depth,
      });
      nodes[fromIdx].pulseIntensity = 1;
    }

    function draw() {
      time += 1;
      ctx!.clearRect(0, 0, width, height);

      // Liquid shimmer — subtle rotating sheen
      ctx!.save();
      ctx!.beginPath();
      ctx!.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx!.clip();
      const shimmerAngle = time * 0.002;
      const sx = centerX + Math.cos(shimmerAngle) * radius * 0.3;
      const sy = centerY + Math.sin(shimmerAngle) * radius * 0.3;
      const shimmer = ctx!.createRadialGradient(sx, sy, 0, sx, sy, radius * 0.7);
      shimmer.addColorStop(0, rgba(0.05));
      shimmer.addColorStop(0.5, rgba(0.02));
      shimmer.addColorStop(1, rgba(0));
      ctx!.fillStyle = shimmer;
      ctx!.fillRect(centerX - radius, centerY - radius, radius * 2, radius * 2);
      ctx!.restore();

      // Dish halo with breathing
      const breathe = 1 + Math.sin(time * 0.008) * 0.04;
      const dg = ctx!.createRadialGradient(
        centerX, centerY, radius * 0.3,
        centerX, centerY, radius * 1.2 * breathe
      );
      dg.addColorStop(0, rgba(0.1));
      dg.addColorStop(0.6, rgba(0.03));
      dg.addColorStop(1, rgba(0));
      ctx!.fillStyle = dg;
      ctx!.beginPath();
      ctx!.arc(centerX, centerY, radius * 1.2 * breathe, 0, Math.PI * 2);
      ctx!.fill();

      // Rim
      ctx!.strokeStyle = rgba(0.1);
      ctx!.lineWidth = 0.8;
      ctx!.beginPath();
      ctx!.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx!.stroke();

      ctx!.strokeStyle = rgba(0.04);
      ctx!.beginPath();
      ctx!.arc(centerX, centerY, radius * 1.05, 0, Math.PI * 2);
      ctx!.stroke();

      // Meniscus
      const men = ctx!.createRadialGradient(
        centerX, centerY - radius * 0.3, 0,
        centerX, centerY, radius
      );
      men.addColorStop(0, rgba(0.04));
      men.addColorStop(1, rgba(0));
      ctx!.fillStyle = men;
      ctx!.beginPath();
      ctx!.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx!.fill();

      // Node drift
      for (const n of nodes) {
        n.phase += 0.003;
        n.x = n.baseX + Math.cos(n.phase) * n.driftAmp;
        n.y = n.baseY + Math.sin(n.phase * 0.7) * n.driftAmp;
        n.pulseIntensity *= 0.97;
      }

      // Curved connections
      for (const c of connections) {
        const a = nodes[c.a];
        const b = nodes[c.b];
        ctx!.strokeStyle = rgba(c.strength * 0.4);
        ctx!.lineWidth = 0.5;
        ctx!.beginPath();
        ctx!.moveTo(a.x, a.y);
        ctx!.quadraticCurveTo(c.cx, c.cy, b.x, b.y);
        ctx!.stroke();
      }

      // Pulses along curves with fading trail
      for (let i = pulses.length - 1; i >= 0; i--) {
        const p = pulses[i];
        p.t += p.speed;
        const c = p.connRef;
        const na = nodes[c.a];
        const nb = nodes[c.b];
        const ax = p.forward ? na.x : nb.x;
        const ay = p.forward ? na.y : nb.y;
        const bx = p.forward ? nb.x : na.x;
        const by = p.forward ? nb.y : na.y;

        // Fading trail segments
        const tailStart = Math.max(0, p.t - 0.4);
        const steps = 16;
        for (let s = 0; s < steps; s++) {
          const t1 = tailStart + (p.t - tailStart) * (s / steps);
          const t2 = tailStart + (p.t - tailStart) * ((s + 1) / steps);
          const alpha = (s / steps) * 0.7;
          const pt1 = bezPt(ax, ay, c.cx, c.cy, bx, by, t1);
          const pt2 = bezPt(ax, ay, c.cx, c.cy, bx, by, t2);
          ctx!.strokeStyle = brightRgba(alpha);
          ctx!.lineWidth = 1.2;
          ctx!.beginPath();
          ctx!.moveTo(pt1.x, pt1.y);
          ctx!.lineTo(pt2.x, pt2.y);
          ctx!.stroke();
        }

        // Pulse head
        const head = bezPt(ax, ay, c.cx, c.cy, bx, by, Math.min(1, p.t));
        const gg = ctx!.createRadialGradient(head.x, head.y, 0, head.x, head.y, 14);
        gg.addColorStop(0, brightRgba(0.9));
        gg.addColorStop(0.4, rgba(0.4));
        gg.addColorStop(1, rgba(0));
        ctx!.fillStyle = gg;
        ctx!.beginPath();
        ctx!.arc(head.x, head.y, 14, 0, Math.PI * 2);
        ctx!.fill();

        ctx!.fillStyle = brightRgba(1);
        ctx!.beginPath();
        ctx!.arc(head.x, head.y, 1.6, 0, Math.PI * 2);
        ctx!.fill();

        if (p.t >= 1) {
          const target = p.forward ? c.b : c.a;
          nodes[target].pulseIntensity = 1;
          if (Math.random() < 0.5) {
            spawnPulse(target, p.depth + 1);
          }
          pulses.splice(i, 1);
        }
      }

      // Nodes — ambient glow + breathing
      for (const n of nodes) {
        const it = n.pulseIntensity;
        const nodeBreath = 1 + Math.sin(time * 0.01 + n.phase) * 0.1;
        const br = n.radius * nodeBreath;

        // Always-on ambient glow
        const ambientG = ctx!.createRadialGradient(n.x, n.y, 0, n.x, n.y, br + 6);
        ambientG.addColorStop(0, rgba(0.3));
        ambientG.addColorStop(1, rgba(0));
        ctx!.fillStyle = ambientG;
        ctx!.beginPath();
        ctx!.arc(n.x, n.y, br + 6, 0, Math.PI * 2);
        ctx!.fill();

        // Fired glow
        if (it > 0.05) {
          const gr = br + 22 * it;
          const g = ctx!.createRadialGradient(n.x, n.y, 0, n.x, n.y, gr);
          g.addColorStop(0, brightRgba(0.5 * it));
          g.addColorStop(0.5, rgba(0.25 * it));
          g.addColorStop(1, rgba(0));
          ctx!.fillStyle = g;
          ctx!.beginPath();
          ctx!.arc(n.x, n.y, gr, 0, Math.PI * 2);
          ctx!.fill();
        }

        // Core node
        ctx!.fillStyle = it > 0.1 ? brightRgba(1) : softRgba(0.85);
        ctx!.beginPath();
        ctx!.arc(n.x, n.y, br + it * 1.5, 0, Math.PI * 2);
        ctx!.fill();
      }

      // Slow, deliberate firing
      if (time - lastBurst > nextBurstIn) {
        lastBurst = time;
        nextBurstIn =
          burstIntervalFrames[0] +
          Math.random() * (burstIntervalFrames[1] - burstIntervalFrames[0]);
        if (nodes.length > 0) {
          spawnPulse(Math.floor(Math.random() * nodes.length), 0);
        }
      }

      rafRef.current = requestAnimationFrame(draw);
    }

    const ro = new ResizeObserver(() => resize());
    ro.observe(canvas.parentElement!);
    resize();

    const kickoff = window.setTimeout(() => {
      if (nodes.length > 0) {
        spawnPulse(Math.floor(Math.random() * nodes.length));
      }
    }, 800);

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      window.clearTimeout(kickoff);
      ro.disconnect();
    };
  }, [accent, nodeCount, burstIntervalFrames]);

  return (
    <canvas
      ref={canvasRef}
      className={`neural-dish ${className}`}
      aria-hidden="true"
    />
  );
}
