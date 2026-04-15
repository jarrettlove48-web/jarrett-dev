"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  radius: number;
  pulse: number;
  pulseSpeed: number;
}

export function Particles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let W = (canvas.width = window.innerWidth);
    let H = (canvas.height = window.innerHeight);

    const onResize = () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", onResize);

    const particles: Particle[] = [];
    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * W,
        y: Math.random() * H,
        z: Math.random(),
        vx: (Math.random() - 0.5) * 0.15,
        vy: -Math.random() * 0.2 - 0.05,
        radius: Math.random() * 1.8 + 0.4,
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: Math.random() * 0.008 + 0.003,
      });
    }

    let animId: number;
    function draw() {
      ctx!.clearRect(0, 0, W, H);
      for (const p of particles) {
        p.x += p.vx + p.z * 0.05;
        p.y += p.vy;
        p.pulse += p.pulseSpeed;

        if (p.y < -10) { p.y = H + 10; p.x = Math.random() * W; }
        if (p.x > W + 10) p.x = -10;
        if (p.x < -10) p.x = W + 10;

        const twinkle = 0.3 + 0.7 * ((Math.sin(p.pulse) + 1) / 2);
        const alpha = (0.15 + p.z * 0.5) * twinkle;
        const r = p.radius * (0.6 + p.z * 0.4);

        const grad = ctx!.createRadialGradient(p.x, p.y, 0, p.x, p.y, r * 3);
        grad.addColorStop(0, `rgba(140, 190, 255, ${alpha * 0.5})`);
        grad.addColorStop(1, "rgba(140, 190, 255, 0)");
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, r * 3, 0, Math.PI * 2);
        ctx!.fillStyle = grad;
        ctx!.fill();

        ctx!.beginPath();
        ctx!.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(200, 220, 255, ${alpha})`;
        ctx!.fill();
      }
      animId = requestAnimationFrame(draw);
    }
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="particles-canvas" />;
}
