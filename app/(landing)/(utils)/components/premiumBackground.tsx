"use client";

import { useEffect, useRef } from "react";

type PremiumBackgroundProps = {
  className?: string;
};

/**
 * Interactive premium hero background:
 * - a dot-constellation canvas that repels from the cursor and draws warm
 *   connecting lines to it
 * - a soft spotlight that follows the pointer
 * - animated aurora blobs, a fine grid, vignette and film grain
 * - honors `prefers-reduced-motion`
 */
export default function PremiumBackground({
  className = "",
}: PremiumBackgroundProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const canvas = canvasRef.current;
    if (!root || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let width = 0;
    let height = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let raf = 0;

    type Point = {
      x: number;
      y: number;
      vx: number;
      vy: number;
      r: number;
    };

    let points: Point[] = [];
    const pointer = { x: -9999, y: -9999, active: false };
    const linkDistance = 130;
    const pointerDistance = 190;

    const buildPoints = () => {
      const count = Math.max(
        40,
        Math.min(150, Math.floor((width * height) / 15000))
      );

      points = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.28,
        vy: (Math.random() - 0.5) * 0.28,
        r: Math.random() * 1.5 + 0.4,
      }));
    };

    const drawFrame = () => {
      ctx.clearRect(0, 0, width, height);

      for (const p of points) {
        if (!reduceMotion) {
          p.x += p.vx;
          p.y += p.vy;

          if (p.x <= 0 || p.x >= width) p.vx *= -1;
          if (p.y <= 0 || p.y >= height) p.vy *= -1;
        }

        // Gently repel points away from the cursor.
        if (pointer.active) {
          const dx = p.x - pointer.x;
          const dy = p.y - pointer.y;
          const distSq = dx * dx + dy * dy;

          if (distSq < pointerDistance * pointerDistance && distSq > 0.01) {
            const dist = Math.sqrt(distSq);
            const force = ((pointerDistance - dist) / pointerDistance) * 0.9;
            p.x += (dx / dist) * force;
            p.y += (dy / dist) * force;
          }
        }
      }

      // Constellation lines between neighbours.
      for (let i = 0; i < points.length; i++) {
        const a = points[i];

        for (let j = i + 1; j < points.length; j++) {
          const b = points[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.hypot(dx, dy);

          if (dist < linkDistance) {
            const alpha = (1 - dist / linkDistance) * 0.16;
            ctx.strokeStyle = `rgba(125, 175, 255, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }

        // Warm lines connecting dots to the cursor.
        if (pointer.active) {
          const dx = a.x - pointer.x;
          const dy = a.y - pointer.y;
          const dist = Math.hypot(dx, dy);

          if (dist < pointerDistance) {
            const alpha = (1 - dist / pointerDistance) * 0.4;
            ctx.strokeStyle = `rgba(255, 172, 92, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(pointer.x, pointer.y);
            ctx.stroke();
          }
        }

        ctx.fillStyle = "rgba(166, 199, 255, 0.55)";
        ctx.beginPath();
        ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2);
        ctx.fill();
      }

      if (!reduceMotion) raf = requestAnimationFrame(drawFrame);
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;

      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildPoints();

      if (reduceMotion) drawFrame();
    };

    const handlePointerMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      pointer.x = x;
      pointer.y = y;
      pointer.active = x >= 0 && x <= rect.width && y >= 0 && y <= rect.height;

      root.style.setProperty("--mx", `${x}px`);
      root.style.setProperty("--my", `${y}px`);
      if (glowRef.current) glowRef.current.style.opacity = "1";
    };

    const handlePointerLeave = () => {
      pointer.active = false;
      if (glowRef.current) glowRef.current.style.opacity = "0";
    };

    resize();
    if (!reduceMotion) raf = requestAnimationFrame(drawFrame);

    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", handlePointerMove, {
      passive: true,
    });
    window.addEventListener("pointerleave", handlePointerLeave);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerleave", handlePointerLeave);
    };
  }, []);

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      {/* Aurora blobs */}
      <div className="absolute -left-40 -top-48 h-[42rem] w-[42rem] rounded-full bg-[#3e7cb1]/45 blur-[130px] animate-aurora-slow" />
      <div className="absolute -right-40 top-10 h-[36rem] w-[36rem] rounded-full bg-[#8fc0ea]/25 blur-[120px] animate-aurora-slower" />
      <div className="absolute bottom-[-14rem] left-1/3 h-[34rem] w-[34rem] rounded-full bg-[#ff7a00]/25 blur-[140px] animate-aurora-slow" />

      {/* Fine grid */}
      <div className="premium-grid absolute inset-0 opacity-70" />

      {/* Interactive dot constellation */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full opacity-60"
      />

      {/* Cursor spotlight */}
      <div
        ref={glowRef}
        className="premium-spotlight absolute inset-0 opacity-0 transition-opacity duration-500"
      />

      {/* Vignette + film grain */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(13,42,80,0.32)_100%)]" />
      <div className="premium-grain absolute inset-0 opacity-[0.04] mix-blend-soft-light" />
    </div>
  );
}
