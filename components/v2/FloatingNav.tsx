"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { LINKS } from "@/lib/links";

type Item = { label: string; id: string; href: string; external?: boolean };

// "Currently building" belongs to Work as far as the nav is concerned.
const SECTION_TO_ITEM: Record<string, string> = { work: "work", building: "work", about: "about" };

/**
 * Floating, rounded, translucent nav.
 *
 * On the home page (`page` omitted) anchor links scroll natively (html.v2 sets
 * scroll-behavior: smooth, and turns it off for reduced motion) and the only script here marks
 * which section is in view. On subpages, pass `page` to mark the current destination and the
 * anchors point back at the home page's sections.
 */
export default function FloatingNav({ page }: { page?: "work" | "face-verify" }) {
  const onHome = !page;
  const home = onHome ? "" : "/";
  const items: Item[] = [
    { label: "Work", id: "work", href: `${home}#work` },
    { label: "Face Verify", id: "face-verify", href: "/face-verify" },
    { label: "About", id: "about", href: `${home}#about` },
    { label: "Résumé", id: "resume", href: LINKS.resume, external: true },
  ];

  const [current, setCurrent] = useState<string | null>(page ?? null);

  useEffect(() => {
    if (!onHome) return;
    const els = Object.keys(SECTION_TO_ITEM)
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setCurrent(SECTION_TO_ITEM[entry.target.id]);
          else setCurrent((c) => (c === SECTION_TO_ITEM[entry.target.id] && !isAnySectionActive(els) ? null : c));
        }
      },
      // a thin band across the upper-middle of the viewport
      { rootMargin: "-35% 0px -60% 0px" }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [onHome]);

  return (
    <header className="v2-nav">
      <div className="v2-nav-bar">
        {onHome ? (
          <a className="v2-brand" href="#top">
            Morris Lin
          </a>
        ) : (
          <Link className="v2-brand" href="/">
            Morris Lin
          </Link>
        )}
        <nav aria-label="Primary">
          <ul className="v2-nav-list" role="list">
            {items.map((item) => {
              const aria = current === item.id ? (onHome ? "location" : "page") : undefined;
              return (
                <li key={item.id}>
                  {item.external ? (
                    <a href={item.href} aria-current={aria} target="_blank" rel="noopener noreferrer">
                      {item.label}
                      <span className="v2-arrow" aria-hidden="true">
                        {" "}
                        ↗
                      </span>
                      <span className="v2-sr"> (opens in a new tab)</span>
                    </a>
                  ) : item.href.startsWith("#") ? (
                    <a href={item.href} aria-current={aria}>
                      {item.label}
                    </a>
                  ) : (
                    <Link href={item.href} aria-current={aria}>
                      {item.label}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </header>
  );
}

function isAnySectionActive(els: HTMLElement[]) {
  const band = [window.innerHeight * 0.35, window.innerHeight * 0.4];
  return els.some((el) => {
    const r = el.getBoundingClientRect();
    return r.top <= band[1] && r.bottom >= band[0];
  });
}
