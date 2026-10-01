"use client";

import { useEffect, useRef, useState } from "react";
import { sectionId } from "@/lib/slug";

export default function CaseStudyTOC({ headings }: { headings: string[] }) {
  const [activeId, setActiveId] = useState(sectionId(headings[0] ?? ""));
  const observer = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const elements = headings
      .map((h) => document.getElementById(sectionId(h)))
      .filter((el): el is HTMLElement => Boolean(el));

    observer.current = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-15% 0px -70% 0px", threshold: 0 }
    );

    elements.forEach((el) => observer.current?.observe(el));
    return () => observer.current?.disconnect();
  }, [headings]);

  return (
    <nav className="hidden lg:block sticky top-24 self-start w-48 shrink-0">
      <div className="mono text-xs uppercase tracking-widest text-[var(--ink-muted)] mb-3">Contents</div>
      <ul className="space-y-2 border-l border-[var(--grid-color)]">
        {headings.map((h) => {
          const id = sectionId(h);
          const active = id === activeId;
          return (
            <li key={id} className="relative pl-4">
              {active && (
                <span className="absolute left-[-1px] top-0 bottom-0 w-[2px] bg-[var(--accent)] rounded" />
              )}
              <a
                href={`#${id}`}
                className={`text-sm transition-colors ${active ? "text-[var(--accent)] font-medium" : "text-[var(--ink-muted)] hover:text-[var(--ink)]"}`}
              >
                {h}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
