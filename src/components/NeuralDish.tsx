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
};

type Pulse = {
  from: number;
  to: number;
  t: number;
  speed: number;
  depth: number;
};

type Props = {
  /** CSS color for nodes, lines, and glow. Defaults to the site accent. */
  accent?: string;
  /** Approximate node count. Rejection-sampled, so actual count may be slightly lower. */
  nodeCount?: number;
  /** Seconds between spontaneous firing bursts (range). */
  burstIntervalFrames?: [number, number];
  /** Optional className for the canvas element. */
  className?: string;
};

export default function NeuralDish({
  accent = "#6fa8ff",
  nodeCount = 42,
  burstIntervalFrames = [60, 200],
  className = "",
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Parse accent hex into RGB for building rgba strings
    const hex = accent.replace("#", "");
    const ar = parseInt(hex.substring(0, 2), 16);
    const ag = parseInt(hex.substring(2, 4), 16);
    const ab = parseInt(hex.substring(4, 6), 16);
    const rgba = (a: number) => `rgba(${ar}, ${ag}, ${ab}, ${a})`;
    // Brighter tint for pulse heads / fired nodes
    const brightR = Math.min(255, ar + 70);
    const brightG = Math.min(255, ag + 50);
    const brightB = Math.min(255, ab + 30);
    const brightRgba = (a: number) =>
      `rgba(${brightR}, ${brightG}, ${brightB}, ${a})`;

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

    const MAX_CONNECTIONS_PER_NODE = 4;
    const CONNECTION_DISTANCE_FACTOR = 0.45;

    function initNetwork() {
      nodes = [];
      const attempts = nodeCount * 30;
      const minDist = radius * 0.18;
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
            driftAmp: 0.6 + Math.random() * 1.2,
            pulseIntensity: 0,
            radius: 1.6 + Math.random() * 0.8,
          });
        }
      }

      connections = [];
      const maxConnDist = radius * CONNECTION_DISTANCE_FACTOR * 2;
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
        const count = Math.min(MAX_CONNECTIONS_PER_NODE, dists.length);
        for (let k = 0; k < count; k++) {
          const j = dists[k].j;
          const key = i < j ? `${i}-${j}` : `${j}-${i}`;
          if (!seen.has(key)) {
            seen.add(key);
            connections.push({
              a: i,
              b: j,
              strength: 0.15 + Math.random() * 0.2,
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
      if (depth > 3) return;
      const candidates = connections.filter(
        (c) => c.a === fromIdx || c.b === fromIdx
      );
      if (candidates.length === 0) return;
      const fireCount = Math.min(
        candidates.length,
        1 + Math.floor(Math.random() * 3)
      );
      const shuffled = candidates
        .slice()
        .sort(() => Math.random() - 0.5)
        .slice(0, fireCount);
      for (const conn of shuffled) {
        const target = conn.a === fromIdx ? conn.b : conn.a;
        pulses.push({
          from: fromIdx,
          to: target,
          t: 0,
          speed: 0.012 + Math.random() * 0.008,
          depth,
        });
        nodes[fromIdx].pulseIntensity = 1;
      }
    }

    function draw() {
      time += 1;
      ctx!.clearRect(0, 0, width, height);

      // Dish — outer halo
      const dishGrad = ctx!.createRadialGradient(
        centerX,
        centerY,
        radius * 0.3,
        centerX,
        centerY,
        radius * 1.15
      );
      dishGrad.addColorStop(0, rgba(0.08));
      dishGrad.addColorStop(0.6, rgba(0.03));
      dishGrad.addColorStop(1, rgba(0));
      ctx!.fillStyle = dishGrad;
      ctx!.beginPath();
      ctx!.arc(centerX, centerY, radius * 1.15, 0, Math.PI * 2);
      ctx!.fill();

      // Dish rim — faint double ring
      ctx!.strokeStyle = rgba(0.12);
      ctx!.lineWidth = 1;
      ctx!.beginPath();
      ctx!.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx!.stroke();

      ctx!.strokeStyle = rgba(0.05);
      ctx!.beginPath();
      ctx!.arc(centerX, centerY, radius * 1.04, 0, Math.PI * 2);
      ctx!.stroke();

      // Meniscus highlight
      const meniscus = ctx!.createRadialGradient(
        centerX,
        centerY - radius * 0.3,
        0,
        centerX,
        centerY,
        radius
      );
      meniscus.addColorStop(0, rgba(0.025));
      meniscus.addColorStop(1, rgba(0));
      ctx!.fillStyle = meniscus;
      ctx!.beginPath();
      ctx!.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx!.fill();

      // Node drift
      for (const n of nodes) {
        n.phase += 0.005;
        n.x = n.baseX + Math.cos(n.phase) * n.driftAmp;
        n.y = n.baseY + Math.sin(n.phase * 0.7) * n.driftAmp;
        n.pulseIntensity *= 0.94;
      }

      // Baseline connections
      for (const c of connections) {
        const a = nodes[c.a];
        const b = nodes[c.b];
        ctx!.strokeStyle = rgba(c.strength * 0.35);
        ctx!.lineWidth = 0.6;
        ctx!.beginPath();
        ctx!.moveTo(a.x, a.y);
        ctx!.lineTo(b.x, b.y);
        ctx!.stroke();
      }

      // Pulses
      for (let i = pulses.length - 1; i >= 0; i--) {
        const p = pulses[i];
        p.t += p.speed;
        const a = nodes[p.from];
        const b = nodes[p.to];

        const segLen = 0.35;
        const tailT = Math.max(0, p.t - segLen);
        const headT = Math.min(1, p.t);

        const x1 = a.x + (b.x - a.x) * tailT;
        const y1 = a.y + (b.y - a.y) * tailT;
        const x2 = a.x + (b.x - a.x) * headT;
        const y2 = a.y + (b.y - a.y) * headT;

        const grad = ctx!.createLinearGradient(x1, y1, x2, y2);
        grad.addColorStop(0, rgba(0));
        grad.addColorStop(1, brightRgba(0.9));
        ctx!.strokeStyle = grad;
        ctx!.lineWidth = 1.4;
        ctx!.beginPath();
        ctx!.moveTo(x1, y1);
        ctx!.lineTo(x2, y2);
        ctx!.stroke();

        const hx = a.x + (b.x - a.x) * p.t;
        const hy = a.y + (b.y - a.y) * p.t;
        const glowGrad = ctx!.createRadialGradient(hx, hy, 0, hx, hy, 10);
        glowGrad.addColorStop(0, brightRgba(0.9));
        glowGrad.addColorStop(0.4, rgba(0.4));
        glowGrad.addColorStop(1, rgba(0));
        ctx!.fillStyle = glowGrad;
        ctx!.beginPath();
        ctx!.arc(hx, hy, 10, 0, Math.PI * 2);
        ctx!.fill();

        ctx!.fillStyle = brightRgba(1);
        ctx!.beginPath();
        ctx!.arc(hx, hy, 1.8, 0, Math.PI * 2);
        ctx!.fill();

        if (p.t >= 1) {
          nodes[p.to].pulseIntensity = 1;
          if (Math.random() < 0.7) {
            spawnPulse(p.to, p.depth + 1);
          }
          pulses.splice(i, 1);
        }
      }

      // Nodes
      for (const n of nodes) {
        const intensity = n.pulseIntensity;
        const baseR = n.radius;

        if (intensity > 0.05) {
          const glowR = baseR + 14 * intensity;
          const g = ctx!.createRadialGradient(n.x, n.y, 0, n.x, n.y, glowR);
          g.addColorStop(0, brightRgba(0.5 * intensity));
          g.addColorStop(0.5, rgba(0.25 * intensity));
          g.addColorStop(1, rgba(0));
          ctx!.fillStyle = g;
          ctx!.beginPath();
          ctx!.arc(n.x, n.y, glowR, 0, Math.PI * 2);
          ctx!.fill();
        }

        ctx!.fillStyle =
          intensity > 0.1 ? brightRgba(1) : rgba(0.75);
        ctx!.beginPath();
        ctx!.arc(n.x, n.y, baseR + intensity * 1.2, 0, Math.PI * 2);
        ctx!.fill();

        ctx!.strokeStyle = rgba(0.15 + intensity * 0.5);
        ctx!.lineWidth = 0.8;
        ctx!.beginPath();
        ctx!.arc(n.x, n.y, baseR + 2.5, 0, Math.PI * 2);
        ctx!.stroke();
      }

      // Periodic bursts
      if (time - lastBurst > nextBurstIn) {
        lastBurst = time;
        nextBurstIn =
          burstIntervalFrames[0] +
          Math.random() * (burstIntervalFrames[1] - burstIntervalFrames[0]);
        const origin = Math.floor(Math.random() * nodes.length);
        spawnPulse(origin, 0);
        if (Math.random() < 0.35) {
          const delayTimeout = setTimeout(() => {
            if (nodes.length === 0) return;
            spawnPulse(Math.floor(Math.random() * nodes.length), 0);
          }, 180);
          // Note: this timeout is intentionally fire-and-forget; it will no-op
          // after unmount because nodes array is captured by closure of a
          // replaced effect run. For strict cleanup, track timeouts in a ref.
          void delayTimeout;
        }
      }

      rafRef.current = requestAnimationFrame(draw);
    }

    const ro = new ResizeObserver(() => resize());
    ro.observe(canvas.parentElement!);
    resize();
    // Kickoff pulse
    const kickoff = window.setTimeout(() => {
      if (nodes.length > 0) {
        spawnPulse(Math.floor(Math.random() * nodes.length));
      }
    }, 500);

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
