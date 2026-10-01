"use client";

import { useEffect, useState } from "react";
import { scrollToSection } from "@/lib/slug";

/**
 * Sticky "on this page" list for a case study. Links are plain anchors (smooth scrolling comes
 * from html.v2); the script only marks the section currently near the top of the viewport.
 */
export default function CaseToc({ items }: { items: { id: string; label: string }[] }) {
  const [current, setCurrent] = useState(items[0]?.id ?? "");

  useEffect(() => {
    const els = items.map((i) => document.getElementById(i.id)).filter((el): el is HTMLElement => Boolean(el));
    if (!els.length) return;
    const onScroll = () => {
      // the last section whose top has passed the upper third of the viewport
      const line = window.innerHeight * 0.3;
      let active = els[0].id;
      for (const el of els) if (el.getBoundingClientRect().top <= line) active = el.id;
      setCurrent(active);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [items]);

  return (
    <nav className="v2-toc" aria-label="On this page">
      <ul role="list">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              aria-current={current === item.id ? "location" : undefined}
              onClick={(e) => {
                e.preventDefault();
                scrollToSection(item.id);
              }}
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
