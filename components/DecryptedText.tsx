"use client";

import { useEffect, useRef, useState } from "react";

const GLYPHS = "!<>-_\\/[]{}—=+*^?#________";

/**
 * Scrambles through random glyphs before settling on the real text, left to
 * right. Runs once, either on mount or when it scrolls into view.
 */
export default function DecryptedText({
  text,
  className = "",
  speed = 30,
  revealDelay = 25,
  mono = true,
}: {
  text: string;
  className?: string;
  /** ms between scramble frames */
  speed?: number;
  /** ms between each character locking in */
  revealDelay?: number;
  /** force monospace while scrambling — off for text that should keep its own font (e.g. a large heading) */
  mono?: boolean;
}) {
  const [display, setDisplay] = useState(text.replace(/[^\s]/g, " "));
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || started) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    let revealed = 0;
    let frame = 0;
    const scrambleInterval = setInterval(() => {
      frame++;
      setDisplay(
        text
          .split("")
          .map((ch, i) => {
            if (ch === " ") return " ";
            if (i < revealed) return text[i];
            return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
          })
          .join("")
      );
    }, speed);

    const revealInterval = setInterval(() => {
      revealed++;
      if (revealed > text.length) {
        clearInterval(revealInterval);
        clearInterval(scrambleInterval);
        setDisplay(text);
      }
    }, revealDelay);

    return () => {
      clearInterval(scrambleInterval);
      clearInterval(revealInterval);
    };
  }, [started, text, speed, revealDelay]);

  return (
    <span ref={ref} className={`${mono ? "mono" : ""} ${className}`} aria-label={text}>
      {display}
    </span>
  );
}
