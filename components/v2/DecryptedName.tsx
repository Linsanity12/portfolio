"use client";

import { useEffect, useState } from "react";

const GLYPHS = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghkmnpqrstuvwxyz0123456789#%&*+=<>/?";
const START_DELAY = 250; // ms before the first character locks in
const PER_CHAR = 95; // ms between characters locking in
const FRAME = 45; // ms between scramble frames

const randomGlyph = () => GLYPHS[Math.floor(Math.random() * GLYPHS.length)];

type Phase = "idle" | "run" | "done";

/**
 * Scrambled glyphs resolve left to right into `text`, once, on load.
 * Each character sits in a cell sized by its real glyph (the final character is
 * always rendered, just hidden), so the scramble never changes the layout.
 * Assistive tech reads the visually hidden real text; the animated layer is aria-hidden.
 * The stylesheet shows the final text at once for reduced motion, and after a
 * few seconds if scripts never run.
 */
export default function DecryptedName({ text }: { text: string }) {
  const chars = Array.from(text);
  const [phase, setPhase] = useState<Phase>("idle");
  const [revealed, setRevealed] = useState(0);
  const [glyphs, setGlyphs] = useState<string[]>(() => chars.map(() => ""));

  useEffect(() => {
    // Reduced motion: the stylesheet already shows the final name, so there is nothing to animate.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let cancelled = false;
    let raf = 0;
    let t0 = 0;

    const tick = (now: number) => {
      if (cancelled) return;
      if (!t0) {
        t0 = now;
        setPhase("run");
        setGlyphs(chars.map(randomGlyph));
      }
      const elapsed = now - t0;
      const count = Math.max(0, Math.min(chars.length, Math.floor((elapsed - START_DELAY) / PER_CHAR) + 1));
      setRevealed(count);
      if (count >= chars.length) {
        setPhase("done");
        return;
      }
      // Reshuffle on a slower cadence than the display refresh so it reads as a flicker, not noise.
      if (Math.floor(elapsed / FRAME) !== Math.floor((elapsed - 16) / FRAME)) {
        setGlyphs(chars.map(randomGlyph));
      }
      raf = requestAnimationFrame(tick);
    };

    // Wait for the webfont so the first frames use the real letterforms.
    let started = false;
    const start = () => {
      if (started || cancelled) return;
      started = true;
      raf = requestAnimationFrame(tick);
    };
    const fallback = window.setTimeout(start, 500);
    document.fonts?.ready.then(() => {
      window.clearTimeout(fallback);
      start();
    });

    return () => {
      cancelled = true;
      window.clearTimeout(fallback);
      cancelAnimationFrame(raf);
    };
    // chars is derived from `text`, which is a constant for this component's lifetime
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  return (
    <>
      <span className="v2-sr">{text}</span>
      <span className="v2-dt" data-phase={phase} aria-hidden="true">
        {chars.map((ch, i) => {
          const resolved = phase === "done" || i < revealed;
          return (
            <span className="v2-dt-cell" key={i}>
              <span className="v2-dt-final" data-on={resolved ? "" : undefined}>
                {ch === " " ? " " : ch}
              </span>
              {!resolved && phase === "run" && ch !== " " && <span className="v2-dt-scr">{glyphs[i]}</span>}
            </span>
          );
        })}
      </span>
    </>
  );
}
