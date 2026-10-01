import Link from "next/link";
import { NAV_ITEMS, LINKS } from "@/lib/links";

export default function Nav() {
  return (
    <header className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 px-6 py-5 mono text-sm uppercase tracking-widest">
      <Link href="/" className="font-bold text-[var(--ink)]">
        Morris Lin ↗
      </Link>
      <nav className="flex gap-4 sm:gap-6">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="hover:text-[var(--accent)] transition-colors"
          >
            {item.label}
          </Link>
        ))}
        <a
          href={LINKS.resume}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-[var(--accent)] transition-colors"
        >
          Resume ↗
        </a>
      </nav>
    </header>
  );
}
