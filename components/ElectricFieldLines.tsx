"use client";

import { useEffect, useRef } from "react";

type Charge = { x: number; y: number; q: number };

/**
 * A real electric field-line diagram, not a decorative approximation: two
 * fixed point charges (a classic dipole) plus the cursor as a third, weaker
 * charge, and every line on screen is an actual numerically-integrated
 * field-line streamline through the combined field — same technique (and
 * same 1/r² falloff) as a textbook dipole diagram, just recomputed every
 * frame so the cursor visibly perturbs it.
 */
export default function ElectricFieldLines({
  className = "",
  lineCount = 14,
}: {
  className?: string;
  lineCount?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointerRef = useRef<{ x: number; y: number } | null>(null);
  const sizeRef = useRef({ w: 0, h: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const parent = canvas?.parentElement;
    if (!canvas || !parent) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const lineColor = getComputedStyle(document.documentElement).getPropertyValue("--ink-muted").trim() || "#6b6558";
    const accentColor = getComputedStyle(document.documentElement).getPropertyValue("--accent").trim() || "#2f5fe0";

    const resize = () => {
      const { width, height } = parent.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      sizeRef.current = { w: width, h: height };
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(parent);

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointerRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    const onLeave = () => {
      pointerRef.current = null;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerleave", onLeave);

    // field(): the combined electric field at a point, from every active charge.
    function field(x: number, y: number, charges: Charge[]) {
      let fx = 0;
      let fy = 0;
      for (const c of charges) {
        const dx = x - c.x;
        const dy = y - c.y;
        const distSq = Math.max(dx * dx + dy * dy, 36); // clamp so we never divide by ~0 next to a charge
        const dist = Math.sqrt(distSq);
        const strength = c.q / distSq;
        fx += (dx / dist) * strength;
        fy += (dy / dist) * strength;
      }
      return { fx, fy };
    }

    function traceLine(start: { x: number; y: number }, charges: Charge[], negatives: Charge[], step: number, maxSteps: number) {
      const pts: { x: number; y: number }[] = [start];
      let { x, y } = start;
      const { w, h } = sizeRef.current;
      for (let i = 0; i < maxSteps; i++) {
        const { fx, fy } = field(x, y, charges);
        const mag = Math.hypot(fx, fy) || 1;
        x += (fx / mag) * step;
        y += (fy / mag) * step;
        pts.push({ x, y });
        if (x < -40 || x > w + 40 || y < -40 || y > h + 40) break;
        if (negatives.some((n) => Math.hypot(x - n.x, y - n.y) < 14)) break;
      }
      return pts;
    }

    let raf = 0;
    const draw = () => {
      const { w, h } = sizeRef.current;
      ctx.clearRect(0, 0, w, h);

      const positive: Charge = { x: w * 0.32, y: h * 0.5, q: 1 };
      const negative: Charge = { x: w * 0.68, y: h * 0.5, q: -1 };
      const charges: Charge[] = [positive, negative];
      const pointer = pointerRef.current;
      if (pointer) {
        charges.push({ x: pointer.x, y: pointer.y, q: 0.6 });
      }

      const step = Math.max(w, h) / 260;
      const seedRadius = 10;

      for (let i = 0; i < lineCount; i++) {
        const angle = (i / lineCount) * Math.PI * 2;
        const start = {
          x: positive.x + Math.cos(angle) * seedRadius,
          y: positive.y + Math.sin(angle) * seedRadius,
        };
        const pts = traceLine(start, charges, [negative], step, 260);
        if (pts.length < 2) continue;

        ctx.beginPath();
        ctx.moveTo(pts[0].x, pts[0].y);
        for (let p = 1; p < pts.length; p++) ctx.lineTo(pts[p].x, pts[p].y);
        ctx.strokeStyle = lineColor;
        ctx.globalAlpha = 0.28;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // the charges themselves, small and quiet -- accent for +, muted for -
      ctx.globalAlpha = 0.55;
      ctx.fillStyle = accentColor;
      ctx.beginPath();
      ctx.arc(positive.x, positive.y, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = lineColor;
      ctx.beginPath();
      ctx.arc(negative.x, negative.y, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
    };
  }, [lineCount]);

  return <canvas ref={canvasRef} className={`pointer-events-none ${className}`} />;
}
