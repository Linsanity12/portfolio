import Image from "next/image";
import Link from "next/link";
import type { V2Project } from "@/lib/v2-types";
import { LINKS } from "@/lib/links";
import {
  ABOUT_COPY,
  EDUCATION,
  EXPERIENCE,
  EXPLORING,
  EXTRA_LINKS,
  FEATURED,
  IMAGE_META,
  IN_PROGRESS,
} from "@/lib/v2-content";
import CursorTrail from "@/components/v2/CursorTrail";
import DecryptedName from "@/components/v2/DecryptedName";
import FlowArt from "@/components/v2/FlowArt";
import FloatingNav from "@/components/v2/FloatingNav";

const caseStudy = (p: V2Project) => `/work/${p.slug}`;

function FeaturedProject({ project, priority }: { project: V2Project; priority: boolean }) {
  const meta = IMAGE_META[project.slug];
  const extra = EXTRA_LINKS[project.slug];
  return (
    <li className="v2-project">
      {project.thumb && (
        <div className="v2-media">
          <Image
            src={project.thumb}
            alt={meta?.alt ?? project.title}
            fill
            sizes="(min-width: 900px) 56vw, 100vw"
            priority={priority}
            style={{ objectPosition: meta?.position }}
          />
          {/* Makes the whole image clickable without adding a second tab stop or a duplicate link for screen readers. */}
          <Link className="v2-media-link" href={caseStudy(project)} tabIndex={-1} aria-hidden="true" />
        </div>
      )}
      <div className="v2-project-body">
        <p className="v2-meta">
          <span>{project.tags}</span>
          <span>{project.period}</span>
        </p>
        <h3 className="v2-project-title">{project.title}</h3>
        <p className="v2-desc">{project.oneLiner}</p>
        {project.highlights && (
          <ul className="v2-highlights" aria-label="Key facts">
            {project.highlights.map((h) => (
              <li key={h}>{h}</li>
            ))}
          </ul>
        )}
        {project.tech && (
          <ul className="v2-tech v2-tech-sm" aria-label="Technologies used">
            {project.tech.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        )}
        <div className="v2-links">
          <Link className="v2-link" href={caseStudy(project)}>
            View project<span className="v2-sr">: {project.title}</span>
          </Link>
          {extra &&
            (extra.external ? (
              <a className="v2-link v2-link-quiet" href={extra.href} target="_blank" rel="noopener noreferrer">
                {extra.label}
                <span aria-hidden="true"> ↗</span>
                <span className="v2-sr"> (opens in a new tab)</span>
              </a>
            ) : (
              <Link className="v2-link v2-link-quiet" href={extra.href}>
                {extra.label}
              </Link>
            ))}
        </div>
      </div>
    </li>
  );
}

export default function V2Page() {
  return (
    <>
      <a className="v2-skip" href="#work">
        Skip to selected work
      </a>
      <FlowArt />
      <CursorTrail />
      <FloatingNav />

      <div id="top" />
      <main className="v2-main">
        <section className="v2-hero" aria-labelledby="v2-name">
          <div className="v2-wrap">
            <h1 id="v2-name" className="v2-name">
              <DecryptedName text="Morris Lin" />
            </h1>
            <p className="v2-role">Electrical + Computer Engineering</p>
            <p className="v2-intro">
              I build the parts of a system most people never see — the boards, the firmware, the mechanisms that make
              hardware actually do what it&rsquo;s supposed to.
            </p>
            <p className="v2-fields">Embedded systems, electronics, robotics, and computer vision.</p>
            <a className="v2-btn" href="#work">
              Explore my work
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path
                  d="M7 1.5v11m0 0L2.5 8M7 12.5 11.5 8"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          </div>
        </section>

        <section id="work" className="v2-work" aria-labelledby="work-title">
          <div className="v2-wrap">
            <h2 id="work-title" className="v2-h2">
              Selected work
            </h2>
            <ul className="v2-projects" role="list">
              {FEATURED.map((p, i) => (
                <FeaturedProject key={p.slug} project={p} priority={i === 0} />
              ))}
            </ul>
          </div>
        </section>

        <section id="building" className="v2-building" aria-labelledby="building-title">
          <div className="v2-wrap">
            <h2 id="building-title" className="v2-h2">
              Currently building
            </h2>
            <ul className="v2-building-list" role="list">
              {IN_PROGRESS.map((p) => (
                <li key={p.slug} className="v2-building-item">
                  <p className="v2-status">
                    <span className="v2-dot" aria-hidden="true" />
                    In progress
                  </p>
                  <h3 className="v2-project-title v2-project-title-sm">
                    <Link className="v2-title-link" href={caseStudy(p)}>
                      {p.title}
                    </Link>
                  </h3>
                  <p className="v2-meta">
                    <span>{p.tags}</span>
                    <span>{p.period}</span>
                  </p>
                  <p className="v2-desc">{p.oneLiner}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section id="about" className="v2-about" aria-labelledby="about-title">
          <div className="v2-wrap v2-about-grid">
            <div>
              <h2 id="about-title" className="v2-statement">
                Where electronics, code, and physical systems meet.
              </h2>
              {ABOUT_COPY.map((paragraph) => (
                <p key={paragraph} className="v2-prose">
                  {paragraph}
                </p>
              ))}
            </div>
            <div className="v2-facts">
              <h3 className="v2-h3">Education</h3>
              <div className="v2-fact">
                <p className="v2-fact-main">{EDUCATION.school}</p>
                <p className="v2-fact-sub">{EDUCATION.detail}</p>
              </div>

              <h3 className="v2-h3">Experience</h3>
              <ul role="list">
                {EXPERIENCE.map((item) => (
                  <li key={item.role} className="v2-fact">
                    <p className="v2-fact-main">{item.role}</p>
                    <p className="v2-fact-sub">{item.org}</p>
                    <p className="v2-fact-when">{item.period}</p>
                  </li>
                ))}
              </ul>

              <h3 className="v2-h3">Currently exploring</h3>
              <p className="v2-fact-sub">{EXPLORING.join(", ")}</p>
            </div>
          </div>
        </section>

        <section id="contact" className="v2-contact" aria-labelledby="contact-title">
          <div className="v2-wrap v2-contact-row">
            <h2 id="contact-title" className="v2-contact-title">
              Let&rsquo;s build something.
            </h2>
            <ul className="v2-contact-links" role="list">
              <li>
                <a className="v2-link" href={`mailto:${LINKS.email}`}>
                  Email<span className="v2-sr">: {LINKS.email}</span>
                </a>
              </li>
              <li>
                <a className="v2-link" href={LINKS.github} target="_blank" rel="noopener noreferrer">
                  GitHub<span aria-hidden="true"> ↗</span>
                  <span className="v2-sr"> (opens in a new tab)</span>
                </a>
              </li>
              <li>
                <a className="v2-link" href={LINKS.linkedin} target="_blank" rel="noopener noreferrer">
                  LinkedIn<span aria-hidden="true"> ↗</span>
                  <span className="v2-sr"> (opens in a new tab)</span>
                </a>
              </li>
              <li>
                <a className="v2-link" href={LINKS.resume} target="_blank" rel="noopener noreferrer">
                  Résumé<span aria-hidden="true"> ↗</span>
                  <span className="v2-sr"> (PDF, opens in a new tab)</span>
                </a>
              </li>
            </ul>
          </div>
        </section>
      </main>
    </>
  );
}
