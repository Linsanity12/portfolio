"use client";

import { useEffect, useRef } from "react";

const LIFE = 720; // ms a point of the trail stays visible
const MAX_POINTS = 56;

/**
 * A thin silver-to-amber light trail that follows a mouse and fades out on its own.
 * The canvas ignores pointer events and only ever brightens what is beneath it
 * (screen blending), so it can't block clicks or hide text. It is not mounted for
 * touch-first devices or reduced-motion visitors; the artwork's ambient motion covers those.
 */
export default function CursorTrail() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let W = 0;
    let H = 0;
    const dpr = 1; // the trail is soft, so full-resolution pixels would be wasted work
    const pts: { x: number; y: number; t: number }[] = [];
    let raf = 0;

    const resize = () => {
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
    };

    const draw = (now: number) => {
      raf = 0;
      while (pts.length && now - pts[0].t > LIFE) pts.shift();
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      if (pts.length < 2) return; // nothing left to fade; the next move restarts the loop

      ctx.globalCompositeOperation = "lighter";
      ctx.lineCap = "round";
      for (let i = 1; i < pts.length; i++) {
        const a = 1 - (now - pts[i].t) / LIFE; // 1 at the head, 0 at the tail
        if (a <= 0) continue;
        const k = a * a;
        // head reads silver, the tail warms to amber
        const r = 255;
        const g = Math.round(150 + 85 * a);
        const b = Math.round(60 + 170 * a);
        ctx.beginPath();
        ctx.moveTo(pts[i - 1].x, pts[i - 1].y);
        ctx.lineTo(pts[i].x, pts[i].y);
        ctx.strokeStyle = `rgba(${r},${g},${b},${(k * 0.16).toFixed(3)})`;
        ctx.lineWidth = 2 + 9 * a;
        ctx.stroke();
        ctx.strokeStyle = `rgba(${r},${g},${b},${(k * 0.55).toFixed(3)})`;
        ctx.lineWidth = 0.8 + 2 * a;
        ctx.stroke();
      }
      raf = requestAnimationFrame(draw);
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      const last = pts[pts.length - 1];
      if (last && Math.hypot(e.clientX - last.x, e.clientY - last.y) < 2) return;
      pts.push({ x: e.clientX, y: e.clientY, t: performance.now() });
      if (pts.length > MAX_POINTS) pts.shift();
      if (!raf) raf = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return <canvas ref={ref} className="v2-trail" aria-hidden="true" />;
}
