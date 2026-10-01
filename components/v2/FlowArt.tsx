"use client";

import { useEffect, useRef } from "react";

/**
 * Flowing-light artwork: a twisting bundle of thin silver and amber strands riding a
 * looping centerline, drawn with additive blending on one fixed canvas.
 *
 * - Animates gently on its own; the strands swirl around the pointer on desktop and around
 *   a slow virtual pointer on touch devices.
 * - Scroll-linked: as the hero leaves, the artwork zooms toward the loop and dissolves
 *   into the work section. Plain scrolling only, nothing is hijacked.
 * - Reduced motion: one static frame, no pointer response, no zoom (opacity fade only).
 * - The render loop pauses when the artwork has faded out or the tab is hidden, and sheds
 *   strands if frames get expensive.
 */

const TAU = Math.PI * 2;

// Centerline control points as fractions of the viewport (landscape). The path rises from the
// lower left, curls over itself near the upper right, then leaves through the right edge.
const PATH: [number, number][] = [
  [-0.14, 0.99], [0.14, 0.92], [0.4, 0.8], [0.64, 0.62], [0.85, 0.4],
  [0.86, 0.17], [0.66, 0.11], [0.55, 0.27], [0.67, 0.47], [0.9, 0.63], [1.16, 0.76],
];

function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const smoothstep = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

function catmull(p0: number, p1: number, p2: number, p3: number, t: number) {
  const t2 = t * t;
  const t3 = t2 * t;
  return 0.5 * (2 * p1 + (-p0 + p2) * t + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t2 + (-p0 + 3 * p1 - 3 * p2 + p3) * t3);
}

// Strokes are batched into buckets of (colour, alpha level, width) and drawn with one stroke()
// call each. Additive blending makes draw order irrelevant, so this looks the same as stroking
// every chunk separately but costs a small fraction as many draw calls.
const ALPHA_LEVELS = 8;
const ALPHA_STEP = 0.06;
const TONES: [number, number, number][] = [
  [226, 231, 238], // silver
  [238, 226, 214], // warm silver
  [255, 190, 118], // light amber
  [255, 146, 52], // amber
];
const WIDTHS = [0.7, 1.2];
const BUCKETS = TONES.length * ALPHA_LEVELS * WIDTHS.length;

type Strand = {
  phase: number;
  rho: number;
  twist: number;
  drift: number;
  stagger: number;
  alpha: number;
  wi: number;
  tone: number;
};

type Dust = { u: number; off: number; speed: number; size: number; tw: number; phase: number; amber: boolean };

/** `intensity` scales the artwork's opacity; subpages run it dimmer than the home hero. */
export default function FlowArt({ intensity = 1 }: { intensity?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduceQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const fineQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
    let animate = !reduceQuery.matches;
    let fine = fineQuery.matches;

    // ---- geometry that depends on the viewport -------------------------------------------
    let W = 0;
    let H = 0;
    let dpr = 1;
    let portrait = false;
    let radius = 100;
    let path: [number, number][] = PATH;

    const SAMPLES = 96;
    const SEGMENTS = 9;
    const cpx = new Float32Array(PATH.length);
    const cpy = new Float32Array(PATH.length);
    const cx = new Float32Array(SAMPLES);
    const cy = new Float32Array(SAMPLES);
    const nx = new Float32Array(SAMPLES);
    const ny = new Float32Array(SAMPLES);
    const env = new Float32Array(SAMPLES);
    const fade = new Float32Array(SAMPLES);
    const xs = new Float32Array(SAMPLES);
    const ys = new Float32Array(SAMPLES);
    const ds = new Float32Array(SAMPLES);

    // ---- strands and dust (seeded so every load looks the same) --------------------------
    const rand = mulberry32(11);
    let strands: Strand[] = [];
    let dust: Dust[] = [];
    const build = () => {
      const nStrands = portrait ? 52 : 96;
      const nDust = portrait ? 70 : 150;
      strands = Array.from({ length: nStrands }, () => {
        const amberish = rand() < 0.45;
        const m = amberish ? 0.62 + 0.38 * rand() : 0.12 * rand();
        return {
          phase: rand() * TAU,
          rho: 0.1 + 0.9 * Math.pow(rand(), 0.7),
          twist: 1.05 + rand() * 0.4,
          drift: (rand() - 0.5) * 0.3,
          stagger: rand(),
          alpha: 0.2 + 0.4 * rand(),
          wi: rand() < 0.5 ? 0 : 1,
          tone: m < 0.06 ? 0 : m < 0.13 ? 1 : m < 0.8 ? 2 : 3,
        };
      });
      dust = Array.from({ length: nDust }, () => ({
        u: rand(),
        off: (rand() + rand() + rand() - 1.5) * 1.5,
        speed: 0.004 + rand() * 0.012,
        size: 0.6 + rand() * 1.3,
        tw: 0.4 + rand() * 1.4,
        phase: rand() * TAU,
        amber: rand() < 0.65,
      }));
    };

    // ---- state ---------------------------------------------------------------------------
    let progress = 0; // 0 at the top of the page, 1 once the hero is scrolled away
    let zoom = 1;
    let opacity = intensity;
    let quality = 1; // share of strands drawn; lowered if frames are slow (see degrade())
    let level = 0; // 0 = full quality ... 3 = leanest
    let scale = 1; // canvas resolution multiplier, also lowered by degrade()
    let interval = 0; // smoothed time between animation frames, ms
    let sampled = 0;
    let prevT = 0;
    let px = 0.62; // smoothed pointer, viewport fractions
    let py = 0.4;
    let tx = px; // pointer target
    let ty = py;
    let hasPointer = false;
    let raf = 0;
    let running = false;
    let last = 0;
    const t0 = performance.now();

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      W = Math.max(1, Math.round(rect.width));
      H = Math.max(1, Math.round(rect.height));
      const wasPortrait = portrait;
      portrait = W / H < 0.85;
      dpr = Math.min(window.devicePixelRatio || 1, portrait ? 1.75 : 2);
      // keep the backing store under ~4.5 megapixels
      const cap = Math.sqrt(4.5e6 / (W * H));
      dpr = Math.min(dpr, cap) * scale;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      radius = portrait ? Math.max(34, W * 0.115) : Math.min(W, H * 1.7) * 0.072;
      // On tall screens squeeze the path into the lower ~58% so it sits under the text.
      path = portrait ? PATH.map(([x, y]) => [x * 1.02, 0.4 + y * 0.6] as [number, number]) : PATH;
      if (!strands.length || wasPortrait !== portrait) build();
      renderOnce();
    };

    const readScroll = () => {
      const range = Math.max(1, window.innerHeight * 0.9);
      progress = Math.min(1, Math.max(0, window.scrollY / range));
    };

    // ---- drawing -------------------------------------------------------------------------
    const draw = (now: number) => {
      const t = animate ? (now - t0) / 1000 : 4.2;

      // centerline + normals. The control points breathe slowly; moving the points (rather than
      // offsetting samples per segment) keeps the curve smooth.
      const n = path.length - 1;
      for (let i = 0; i <= n; i++) {
        cpx[i] = (path[i][0] + (animate ? Math.sin(t * 0.21 + i * 1.7) * 0.014 : 0)) * W;
        cpy[i] = (path[i][1] + (animate ? Math.cos(t * 0.17 + i * 2.3) * 0.014 : 0)) * H;
      }
      for (let j = 0; j < SAMPLES; j++) {
        const u = j / (SAMPLES - 1);
        const f = u * n;
        const i = Math.min(n - 1, Math.floor(f));
        const l = f - i;
        const a = Math.max(0, i - 1);
        const d = Math.min(n, i + 2);
        cx[j] = catmull(cpx[a], cpx[i], cpx[i + 1], cpx[d], l);
        cy[j] = catmull(cpy[a], cpy[i], cpy[i + 1], cpy[d], l);
      }
      for (let j = 0; j < SAMPLES; j++) {
        const a = Math.max(0, j - 1);
        const b = Math.min(SAMPLES - 1, j + 1);
        let dx = cx[b] - cx[a];
        let dy = cy[b] - cy[a];
        const len = Math.hypot(dx, dy) || 1;
        dx /= len;
        dy /= len;
        nx[j] = -dy;
        ny[j] = dx;
        const u = j / (SAMPLES - 1);
        const pinch = 0.72 + 0.28 * Math.cos(u * TAU * 2.2 - t * 0.32);
        env[j] = (0.2 + 0.8 * Math.pow(Math.sin(Math.PI * u), 0.6)) * pinch;
        fade[j] = smoothstep(0.0, 0.1, u) * smoothstep(1.0, 0.9, u);
      }

      // pointer (real on desktop, a slow virtual one otherwise)
      if (animate) {
        if (!fine || !hasPointer) {
          tx = 0.6 + 0.2 * Math.sin(t * 0.23) + 0.05 * Math.sin(t * 0.61);
          ty = 0.4 + 0.16 * Math.cos(t * 0.19);
        }
        px += (tx - px) * 0.06;
        py += (ty - py) * 0.06;
      }
      const strength = animate ? (fine && hasPointer ? 1 : 0.55) : 0;

      // zoom about the loop; parallax shifts the art a little against the pointer
      const fx = W * 0.68;
      const fy = H * (portrait ? 0.7 : 0.4);
      const offX = -(px - 0.5) * 26 * strength;
      const offY = -(py - 0.5) * 18 * strength;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      ctx.translate(fx, fy);
      ctx.scale(zoom, zoom);
      ctx.translate(-fx + offX, -fy + offY);
      ctx.globalCompositeOperation = "lighter";
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      // pointer in art space (inverse of the transform above)
      const pax = fx + (px * W - fx) / zoom - offX;
      const pay = fy + (py * H - fy) / zoom - offY;
      const sigma = Math.min(W, H) * 0.17;
      const inv2s2 = 1 / (2 * sigma * sigma);

      // soft volumetric glow around the loop
      const gj = Math.floor(SAMPLES * 0.6);
      const glow = ctx.createRadialGradient(cx[gj], cy[gj], 0, cx[gj], cy[gj], Math.min(W, H) * 0.55);
      glow.addColorStop(0, "rgba(255,140,50,0.13)");
      glow.addColorStop(0.5, "rgba(255,150,70,0.04)");
      glow.addColorStop(1, "rgba(255,150,70,0)");
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, W, H);

      const paths: (Path2D | undefined)[] = new Array(BUCKETS);
      const active = Math.max(12, Math.round(strands.length * quality));
      const step = strands.length / active;
      for (let k = 0; k < active; k++) {
        const s = strands[Math.floor(k * step)];
        for (let j = 0; j < SAMPLES; j++) {
          const u = j / (SAMPLES - 1);
          const th = s.phase + s.twist * TAU * u + t * (0.2 + s.drift);
          const off = s.rho * radius * env[j] * Math.cos(th);
          let x = cx[j] + nx[j] * off;
          let y = cy[j] + ny[j] * off;
          if (strength) {
            const dx = x - pax;
            const dy = y - pay;
            const g = Math.exp(-(dx * dx + dy * dy) * inv2s2) * strength;
            x += -dy * g * 0.22 + dx * g * 0.1;
            y += dx * g * 0.22 + dy * g * 0.1;
          }
          xs[j] = x;
          ys[j] = y;
          ds[j] = Math.sin(th);
        }
        // Each strand splits into chunks whose boundaries are shifted per strand, so the small
        // brightness steps between chunks never line up into a visible seam across the ribbon.
        const len = (SAMPLES - 1) / SEGMENTS;
        for (let c = 0; c < SEGMENTS; c++) {
          const j0 = c === 0 ? 0 : Math.round((c - 1 + s.stagger) * len);
          const j1 = c === SEGMENTS - 1 ? SAMPLES - 1 : Math.round((c + s.stagger) * len);
          if (j1 <= j0) continue;
          const mid = (j0 + j1) >> 1;
          const a = s.alpha * (0.22 + 0.78 * (ds[mid] * 0.5 + 0.5)) * fade[mid];
          if (a < 0.012) continue;
          const level = Math.min(ALPHA_LEVELS - 1, Math.floor(a / ALPHA_STEP));
          const key = (s.tone * ALPHA_LEVELS + level) * WIDTHS.length + s.wi;
          const path = (paths[key] ??= new Path2D());
          path.moveTo(xs[j0], ys[j0]);
          for (let j = j0 + 1; j <= j1; j++) path.lineTo(xs[j], ys[j]);
        }
      }
      for (let key = 0; key < BUCKETS; key++) {
        const path = paths[key];
        if (!path) continue;
        const wi = key % WIDTHS.length;
        const level = Math.floor(key / WIDTHS.length) % ALPHA_LEVELS;
        const [r, g, b] = TONES[Math.floor(key / (WIDTHS.length * ALPHA_LEVELS))];
        ctx.lineWidth = WIDTHS[wi];
        ctx.strokeStyle = `rgba(${r},${g},${b},${((level + 0.5) * ALPHA_STEP).toFixed(3)})`;
        ctx.stroke(path);
      }

      // drifting sparks
      const dustCount = level >= 2 ? dust.length >> 1 : dust.length;
      for (let di = 0; di < dustCount; di++) {
        const d = dust[di];
        const u = (((d.u + (animate ? t * d.speed : 0)) % 1) + 1) % 1;
        const f = u * (SAMPLES - 1);
        const j = Math.floor(f);
        const l = f - j;
        const j2 = Math.min(SAMPLES - 1, j + 1);
        const baseX = cx[j] + (cx[j2] - cx[j]) * l;
        const baseY = cy[j] + (cy[j2] - cy[j]) * l;
        const e = env[j] * radius * 1.9 * d.off;
        let x = baseX + nx[j] * e;
        let y = baseY + ny[j] * e;
        if (strength) {
          const dx = x - pax;
          const dy = y - pay;
          const g = Math.exp(-(dx * dx + dy * dy) * inv2s2) * strength;
          x += -dy * g * 0.3;
          y += dx * g * 0.3;
        }
        const tw = animate ? 0.5 + 0.5 * Math.sin(t * d.tw + d.phase) : 0.7;
        const a = 0.55 * tw * fade[j];
        if (a < 0.03) continue;
        ctx.fillStyle = d.amber ? `rgba(255,170,90,${a.toFixed(3)})` : `rgba(235,238,244,${(a * 0.8).toFixed(3)})`;
        ctx.fillRect(x, y, d.size, d.size);
      }
    };

    const applyScrollStyle = () => {
      canvas.style.opacity = opacity.toFixed(3);
    };

    const renderOnce = () => {
      readScroll();
      zoom = animate ? 1 + 0.95 * smoothstep(0, 1, progress) : 1;
      opacity = intensity * (1 - smoothstep(0.22, 1, progress));
      applyScrollStyle();
      if (opacity > 0.005) draw(performance.now());
    };

    // ---- loop ----------------------------------------------------------------------------
    // If the device can't keep up (a slow frame interval, not just slow JS: canvas rasterising
    // happens after our code returns), step down: fewer strands, fewer sparks, then a lower
    // resolution. It only ever steps down, so it can't oscillate.
    const degrade = () => {
      level += 1;
      quality = [1, 0.7, 0.5, 0.4][level];
      interval = 0;
      sampled = 0;
      if (level === 3) {
        scale = 0.75;
        resize();
      }
    };

    const frame = (now: number) => {
      raf = 0;
      if (document.hidden) {
        running = false;
        return;
      }
      readScroll();
      const zTarget = 1 + 0.95 * smoothstep(0, 1, progress);
      const oTarget = intensity * (1 - smoothstep(0.22, 1, progress));
      zoom += (zTarget - zoom) * 0.14;
      opacity += (oTarget - opacity) * 0.2;
      applyScrollStyle();

      if (opacity < 0.005 && oTarget === 0) {
        running = false; // fully dissolved: stop drawing until the visitor scrolls back up
        return;
      }
      if (prevT) {
        const dt = now - prevT;
        if (dt < 250) {
          // ignore long stalls (a hidden tab, a paused loop)
          interval = interval ? interval * 0.92 + dt * 0.08 : dt;
          if (++sampled >= 60 && interval > 30 && level < 3) degrade();
        }
      }
      prevT = now;
      if (now - last >= 14) {
        last = now;
        draw(now);
      }
      raf = requestAnimationFrame(frame);
    };

    const kick = () => {
      if (!animate) {
        renderOnce();
        return;
      }
      if (!running) {
        running = true;
        prevT = 0;
        raf = requestAnimationFrame(frame);
      }
    };

    // ---- events --------------------------------------------------------------------------
    const onPointer = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      hasPointer = true;
      tx = e.clientX / window.innerWidth;
      ty = e.clientY / window.innerHeight;
    };
    const onLeave = () => {
      hasPointer = false;
    };
    const onVisibility = () => {
      if (!document.hidden) kick();
    };
    const onMotionChange = () => {
      animate = !reduceQuery.matches;
      kick();
      if (!animate) renderOnce();
    };
    const onFineChange = () => {
      fine = fineQuery.matches;
    };

    resize();
    kick();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    window.addEventListener("scroll", kick, { passive: true });
    window.addEventListener("pointermove", onPointer, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    document.addEventListener("visibilitychange", onVisibility);
    reduceQuery.addEventListener("change", onMotionChange);
    fineQuery.addEventListener("change", onFineChange);

    return () => {
      cancelAnimationFrame(raf);
      running = false;
      ro.disconnect();
      window.removeEventListener("scroll", kick);
      window.removeEventListener("pointermove", onPointer);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("visibilitychange", onVisibility);
      reduceQuery.removeEventListener("change", onMotionChange);
      fineQuery.removeEventListener("change", onFineChange);
    };
  }, [intensity]);

  return <canvas ref={ref} className="v2-art" aria-hidden="true" />;
}
