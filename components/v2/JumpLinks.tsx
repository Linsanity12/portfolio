"use client";

import { scrollToSection } from "@/lib/slug";

export default function JumpLinks({ links }: { links: { id: string; label: string }[] }) {
  return (
    <p className="v2-takeaway-links">
      {links.map((link) => (
        <a
          key={link.id}
          href={`#${link.id}`}
          onClick={(e) => {
            e.preventDefault();
            scrollToSection(link.id);
          }}
        >
          {link.label}
        </a>
      ))}
    </p>
  );
}
