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
  hoverIntensity: number;
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

type Ripple = {
  x: number;
  y: number;
  t: number;
  life: number;
};

export default function NeuralDish({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let centerX = 0;
    let centerY = 0;
    let radius = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const NODE_COUNT = 45;
    const MAX_CONN = 4;

    let nodes: Node[] = [];
    let connections: Connection[] = [];
    let pulses: Pulse[] = [];
    let ripples: Ripple[] = [];
    let time = 0;
    let lastBurst = 0;
    let mouseX = -9999;
    let mouseY = -9999;
    let mouseActive = false;
    let lastMouseFire = 0;

    function init() {
      nodes = [];
      const minDist = radius * 0.17;
      let tries = 0;
      while (nodes.length < NODE_COUNT && tries < NODE_COUNT * 30) {
        tries++;
        const a = Math.random() * Math.PI * 2;
        const r = Math.sqrt(Math.random()) * radius * 0.92;
        const x = centerX + Math.cos(a) * r;
        const y = centerY + Math.sin(a) * r;
        let ok = true;
        for (const n of nodes) {
          const dx = n.x - x, dy = n.y - y;
          if (dx * dx + dy * dy < minDist * minDist) { ok = false; break; }
        }
        if (ok) nodes.push({
          x, y, baseX: x, baseY: y,
          phase: Math.random() * Math.PI * 2,
          driftAmp: 0.6 + Math.random() * 1.2,
          pulseIntensity: 0,
          hoverIntensity: 0,
          radius: 1.6 + Math.random() * 0.9,
        });
      }
      connections = [];
      const maxConnDist = radius * 0.9;
      const seen = new Set<string>();
      for (let i = 0; i < nodes.length; i++) {
        const dists: { j: number; d: number }[] = [];
        for (let j = 0; j < nodes.length; j++) {
          if (i === j) continue;
          const dx = nodes[i].x - nodes[j].x, dy = nodes[i].y - nodes[j].y;
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
            connections.push({ a: i, b: j, strength: 0.15 + Math.random() * 0.2 });
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
      init();
    }

    function spawnPulse(fromIdx: number, depth = 0) {
      if (depth > 3) return;
      const cands = connections.filter(c => c.a === fromIdx || c.b === fromIdx);
      if (!cands.length) return;
      const fireCount = Math.min(cands.length, 1 + Math.floor(Math.random() * 3));
      const shuffled = cands.slice().sort(() => Math.random() - 0.5).slice(0, fireCount);
      for (const conn of shuffled) {
        const target = conn.a === fromIdx ? conn.b : conn.a;
        pulses.push({ from: fromIdx, to: target, t: 0, speed: 0.014 + Math.random() * 0.008, depth });
        nodes[fromIdx].pulseIntensity = 1;
      }
      ripples.push({ x: nodes[fromIdx].x, y: nodes[fromIdx].y, t: 0, life: 60 });
    }

    function draw() {
      time++;
      ctx!.clearRect(0, 0, width, height);

      // Dish halo
      const dg = ctx!.createRadialGradient(centerX, centerY, radius * 0.3, centerX, centerY, radius * 1.15);
      dg.addColorStop(0, "rgba(111,168,255,0.08)");
      dg.addColorStop(0.6, "rgba(111,168,255,0.03)");
      dg.addColorStop(1, "rgba(111,168,255,0)");
      ctx!.fillStyle = dg;
      ctx!.beginPath(); ctx!.arc(centerX, centerY, radius * 1.15, 0, Math.PI * 2); ctx!.fill();

      // Rim
      ctx!.strokeStyle = "rgba(111,168,255,0.12)"; ctx!.lineWidth = 1;
      ctx!.beginPath(); ctx!.arc(centerX, centerY, radius, 0, Math.PI * 2); ctx!.stroke();
      ctx!.strokeStyle = "rgba(111,168,255,0.05)";
      ctx!.beginPath(); ctx!.arc(centerX, centerY, radius * 1.04, 0, Math.PI * 2); ctx!.stroke();

      // Meniscus
      const men = ctx!.createRadialGradient(centerX, centerY - radius * 0.3, 0, centerX, centerY, radius);
      men.addColorStop(0, "rgba(111,168,255,0.025)");
      men.addColorStop(1, "rgba(111,168,255,0)");
      ctx!.fillStyle = men;
      ctx!.beginPath(); ctx!.arc(centerX, centerY, radius, 0, Math.PI * 2); ctx!.fill();

      // Ripples
      for (let i = ripples.length - 1; i >= 0; i--) {
        const r = ripples[i];
        r.t++;
        const prog = r.t / r.life;
        const rad = prog * radius * 0.8;
        const alpha = (1 - prog) * 0.5;
        ctx!.strokeStyle = `rgba(160, 200, 255, ${alpha})`;
        ctx!.lineWidth = 1.2 * (1 - prog * 0.5);
        ctx!.beginPath();
        ctx!.arc(r.x, r.y, rad, 0, Math.PI * 2);
        ctx!.stroke();
        if (r.t >= r.life) ripples.splice(i, 1);
      }

      // Hover influence
      const hoverRadius = radius * 0.25;
      for (const n of nodes) {
        n.phase += 0.005;
        n.x = n.baseX + Math.cos(n.phase) * n.driftAmp;
        n.y = n.baseY + Math.sin(n.phase * 0.7) * n.driftAmp;
        n.pulseIntensity *= 0.94;

        if (mouseActive) {
          const dx = n.x - mouseX, dy = n.y - mouseY;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < hoverRadius) {
            const influence = 1 - d / hoverRadius;
            n.hoverIntensity = Math.max(n.hoverIntensity, influence * 0.7);
          }
        }
        n.hoverIntensity *= 0.92;
      }

      // Cursor fires nearest neuron
      if (mouseActive && time - lastMouseFire > 12) {
        let closest = -1, closestD = Infinity;
        for (let i = 0; i < nodes.length; i++) {
          const dx = nodes[i].x - mouseX, dy = nodes[i].y - mouseY;
          const d = dx * dx + dy * dy;
          if (d < closestD && d < hoverRadius * hoverRadius) {
            closestD = d; closest = i;
          }
        }
        if (closest >= 0) {
          spawnPulse(closest);
          lastMouseFire = time;
        }
      }

      // Connections
      for (const c of connections) {
        const a = nodes[c.a], b = nodes[c.b];
        let boost = 0;
        if (mouseActive) {
          const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
          const dx = mx - mouseX, dy = my - mouseY;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < hoverRadius * 1.3) boost = (1 - d / (hoverRadius * 1.3)) * 0.4;
        }
        ctx!.strokeStyle = `rgba(111,168,255,${c.strength * 0.35 + boost})`;
        ctx!.lineWidth = 0.6 + boost;
        ctx!.beginPath(); ctx!.moveTo(a.x, a.y); ctx!.lineTo(b.x, b.y); ctx!.stroke();
      }

      // Pulses
      for (let i = pulses.length - 1; i >= 0; i--) {
        const p = pulses[i];
        p.t += p.speed;
        const a = nodes[p.from], b = nodes[p.to];
        const segLen = 0.35;
        const tailT = Math.max(0, p.t - segLen);
        const headT = Math.min(1, p.t);
        const x1 = a.x + (b.x - a.x) * tailT, y1 = a.y + (b.y - a.y) * tailT;
        const x2 = a.x + (b.x - a.x) * headT, y2 = a.y + (b.y - a.y) * headT;
        const g = ctx!.createLinearGradient(x1, y1, x2, y2);
        g.addColorStop(0, "rgba(111,168,255,0)");
        g.addColorStop(1, "rgba(180,215,255,0.95)");
        ctx!.strokeStyle = g; ctx!.lineWidth = 1.5;
        ctx!.beginPath(); ctx!.moveTo(x1, y1); ctx!.lineTo(x2, y2); ctx!.stroke();

        const hx = a.x + (b.x - a.x) * p.t, hy = a.y + (b.y - a.y) * p.t;
        const gg = ctx!.createRadialGradient(hx, hy, 0, hx, hy, 11);
        gg.addColorStop(0, "rgba(220,235,255,0.95)");
        gg.addColorStop(0.4, "rgba(140,185,255,0.4)");
        gg.addColorStop(1, "rgba(111,168,255,0)");
        ctx!.fillStyle = gg;
        ctx!.beginPath(); ctx!.arc(hx, hy, 11, 0, Math.PI * 2); ctx!.fill();

        ctx!.fillStyle = "rgba(230,240,255,1)";
        ctx!.beginPath(); ctx!.arc(hx, hy, 1.9, 0, Math.PI * 2); ctx!.fill();

        if (p.t >= 1) {
          nodes[p.to].pulseIntensity = 1;
          if (Math.random() < 0.65) spawnPulse(p.to, p.depth + 1);
          pulses.splice(i, 1);
        }
      }

      // Nodes
      for (const n of nodes) {
        const it = Math.max(n.pulseIntensity, n.hoverIntensity * 0.8);
        const br = n.radius;
        if (it > 0.05) {
          const gr = br + 15 * it;
          const g = ctx!.createRadialGradient(n.x, n.y, 0, n.x, n.y, gr);
          g.addColorStop(0, `rgba(190,215,255,${0.5 * it})`);
          g.addColorStop(0.5, `rgba(111,168,255,${0.25 * it})`);
          g.addColorStop(1, "rgba(111,168,255,0)");
          ctx!.fillStyle = g;
          ctx!.beginPath(); ctx!.arc(n.x, n.y, gr, 0, Math.PI * 2); ctx!.fill();
        }
        ctx!.fillStyle = it > 0.15 ? "rgba(220,235,255,1)" : "rgba(111,168,255,0.75)";
        ctx!.beginPath(); ctx!.arc(n.x, n.y, br + it * 1.2, 0, Math.PI * 2); ctx!.fill();
        ctx!.strokeStyle = `rgba(111,168,255,${0.15 + it * 0.5})`;
        ctx!.lineWidth = 0.8;
        ctx!.beginPath(); ctx!.arc(n.x, n.y, br + 2.5, 0, Math.PI * 2); ctx!.stroke();
      }

      // Cursor glow
      if (mouseActive) {
        const cg = ctx!.createRadialGradient(mouseX, mouseY, 0, mouseX, mouseY, 40);
        cg.addColorStop(0, "rgba(160, 200, 255, 0.08)");
        cg.addColorStop(1, "rgba(160, 200, 255, 0)");
        ctx!.fillStyle = cg;
        ctx!.beginPath(); ctx!.arc(mouseX, mouseY, 40, 0, Math.PI * 2); ctx!.fill();
      }

      // Ambient bursts
      if (time - lastBurst > 120 + Math.random() * 180) {
        lastBurst = time;
        if (nodes.length > 0) {
          spawnPulse(Math.floor(Math.random() * nodes.length), 0);
        }
      }

      rafRef.current = requestAnimationFrame(draw);
    }

    // Mouse tracking
    const card = canvas.parentElement!;
    const onMouseMove = (e: MouseEvent) => {
      const r = card.getBoundingClientRect();
      mouseX = e.clientX - r.left;
      mouseY = e.clientY - r.top;
      mouseActive = true;
    };
    const onMouseLeave = () => {
      mouseActive = false;
      mouseX = -9999;
      mouseY = -9999;
    };
    card.addEventListener("mousemove", onMouseMove);
    card.addEventListener("mouseleave", onMouseLeave);

    const ro = new ResizeObserver(() => resize());
    ro.observe(canvas.parentElement!);
    resize();

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
      card.removeEventListener("mousemove", onMouseMove);
      card.removeEventListener("mouseleave", onMouseLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`neural-dish ${className}`}
      aria-hidden="true"
    />
  );
}
