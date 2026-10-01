import { Mail, FileText } from "lucide-react";
import { LINKS } from "@/lib/links";

// lucide-react 1.x dropped brand marks, so GitHub/LinkedIn are inline SVGs.
function GithubMark() {
  return (
    <svg width={20} height={20} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.57.1.78-.25.78-.55 0-.27-.01-1.17-.02-2.12-3.2.7-3.88-1.36-3.88-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.03 1.75 2.7 1.25 3.36.96.1-.74.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.68 0-1.25.45-2.28 1.18-3.08-.12-.29-.51-1.46.11-3.04 0 0 .96-.31 3.15 1.18a10.9 10.9 0 0 1 5.74 0c2.19-1.49 3.15-1.18 3.15-1.18.62 1.58.23 2.75.11 3.04.73.8 1.18 1.83 1.18 3.08 0 4.41-2.7 5.38-5.26 5.67.41.36.78 1.06.78 2.15 0 1.55-.01 2.8-.01 3.18 0 .3.2.66.79.55A10.51 10.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
    </svg>
  );
}

function LinkedinMark() {
  return (
    <svg width={20} height={20} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.45 20.45h-3.56v-5.58c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.95v5.67H9.34V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.38-1.85 3.61 0 4.28 2.38 4.28 5.47v6.27ZM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13ZM7.12 20.45H3.56V9h3.56v11.45Z" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="flex justify-center gap-6 py-12 border-t border-[var(--grid-color)]">
      <a
        href={LINKS.github}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="GitHub"
        className="text-[var(--ink-muted)] hover:text-[var(--accent)] transition-colors"
      >
        <GithubMark />
      </a>
      <a
        href={LINKS.linkedin}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="LinkedIn"
        className="text-[var(--ink-muted)] hover:text-[var(--accent)] transition-colors"
      >
        <LinkedinMark />
      </a>
      <a
        href={`mailto:${LINKS.email}`}
        aria-label="Email"
        className="text-[var(--ink-muted)] hover:text-[var(--accent)] transition-colors"
      >
        <Mail size={20} />
      </a>
      <a
        href={LINKS.resume}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Resume PDF"
        className="text-[var(--ink-muted)] hover:text-[var(--accent)] transition-colors"
      >
        <FileText size={20} />
      </a>
    </footer>
  );
}
