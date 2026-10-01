import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ALL, getCaseStudy, nextProject } from "@/lib/v2-content";
import type { Figure as FigureData, V2Section } from "@/lib/v2-types";
import { sectionId } from "@/lib/slug";
import CaseToc from "@/components/v2/CaseToc";
import CaseVideo from "@/components/v2/CaseVideo";
import CursorTrail from "@/components/v2/CursorTrail";
import DashboardArchitecture from "@/components/v2/DashboardArchitecture";
import FlowArt from "@/components/v2/FlowArt";
import FloatingNav from "@/components/v2/FloatingNav";
import JumpLinks from "@/components/v2/JumpLinks";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return ALL.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) return {};
  return { title: `${study.project.title} | Morris Lin`, description: study.project.oneLiner };
}

function Figure({ fig }: { fig: FigureData }) {
  return (
    <figure className="v2-fig">
      <div className="v2-fig-frame">
        <Image
          src={fig.src}
          alt={fig.alt}
          width={fig.width}
          height={fig.height}
          sizes="(min-width: 1100px) 44rem, 100vw"
        />
      </div>
      {fig.caption && <figcaption>{fig.caption}</figcaption>}
    </figure>
  );
}

/** "Set up. Choose a dataset…" -> bold lead-in plus the rest, for numbered steps. */
function Step({ text }: { text: string }) {
  const cut = text.indexOf(". ");
  if (cut < 1 || cut > 20) return <>{text}</>;
  return (
    <>
      <strong>{text.slice(0, cut + 1)}</strong> {text.slice(cut + 2)}
    </>
  );
}

function SectionBody({ section }: { section: V2Section }) {
  return (
    <>
      {section.body.map((paragraph, i) => (
        <p key={i} className="v2-case-p">
          {paragraph}
        </p>
      ))}

      {section.steps && (
        <ol className="v2-steps">
          {section.steps.map((step) => (
            <li key={step}>
              <Step text={step} />
            </li>
          ))}
        </ol>
      )}

      {section.table && (
        <div className="v2-table-wrap" tabIndex={0} role="region" aria-label={`${section.heading}: table`}>
          <table className={section.table.headers.length > 5 ? "v2-table v2-table-wide" : "v2-table"}>
            <thead>
              <tr>
                {section.table.headers.map((h) => (
                  <th key={h} scope="col">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {section.table.rows.map((row, i) => (
                <tr key={i}>
                  {row.map((cell, j) =>
                    j === 0 ? (
                      <th key={j} scope="row">
                        {cell}
                      </th>
                    ) : (
                      <td key={j}>{cell}</td>
                    ),
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {section.note && <p className="v2-note">{section.note}</p>}

      {section.list && (
        <ul className="v2-list">
          {section.list.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      )}

      {section.terms && (
        <dl className="v2-terms">
          {section.terms.map((t) => (
            <div key={t.term}>
              <dt>{t.term}</dt>
              <dd>{t.text}</dd>
            </div>
          ))}
        </dl>
      )}

      {section.video && <CaseVideo video={section.video} />}
      {section.diagram === "dashboard-architecture" && <DashboardArchitecture />}

      {section.image && (
        <Figure
          fig={{
            src: section.image.src,
            alt: section.image.alt,
            caption: section.image.caption,
            width: section.image.width ?? 1000,
            height: section.image.height ?? 625,
          }}
        />
      )}
      {section.figures?.map((fig) => (
        <Figure key={fig.src} fig={fig} />
      ))}
    </>
  );
}

export default async function CaseStudyPage({ params }: Params) {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study || !study.sections.length) notFound();

  const { project, sections } = study;
  const next = nextProject(slug);
  const toc = sections.map((s) => ({ id: sectionId(s.heading), label: s.heading }));

  return (
    <>
      <a className="v2-skip" href="#case-body">
        Skip to the case study
      </a>
      <FlowArt intensity={0.55} />
      <CursorTrail />
      <FloatingNav page="work" />

      <main className="v2-main">
        <header className="v2-case-head">
          <div className="v2-wrap">
            <Link className="v2-back" href="/#work">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path
                  d="M12.5 7h-11m0 0L6 2.5M1.5 7 6 11.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Selected work
            </Link>
            <p className="v2-meta v2-case-meta">
              <span>{project.tags}</span>
              <span>{project.period}</span>
              {project.status === "in-progress" && (
                <span className="v2-status">
                  <span className="v2-dot" aria-hidden="true" />
                  In progress
                </span>
              )}
            </p>
            <h1 className="v2-case-title">{project.title}</h1>
            <p className="v2-case-lede">{project.oneLiner}</p>

            {project.takeaway && (
              <div className="v2-takeaway">
                <p>{project.takeaway}</p>
                <JumpLinks
                  links={[
                    { id: sectionId("What the run found"), label: "Jump to Results ↓" },
                    { id: sectionId("Engineering details"), label: "Jump to Engineering ↓" },
                  ]}
                />
              </div>
            )}

            {project.actions && (
              <div className="v2-actions">
                {project.actions.map((action) => (
                  <a
                    key={action.href}
                    className="v2-btn"
                    href={action.href}
                    {...(action.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  >
                    {action.label}
                    {action.external && <span className="v2-sr"> (opens in a new tab)</span>}
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" aria-hidden="true">
                      <path d="M3.5 1.8v10.4a.5.5 0 0 0 .77.42l8.2-5.2a.5.5 0 0 0 0-.84l-8.2-5.2a.5.5 0 0 0-.77.42Z" />
                    </svg>
                  </a>
                ))}
              </div>
            )}

            {project.stats && (
              <ul className="v2-stats" aria-label="Key numbers">
                {project.stats.map((stat) => (
                  <li key={stat.label}>
                    <span className="v2-stat-value">{stat.value}</span>
                    <span className="v2-stat-label">{stat.label}</span>
                    {stat.note && <span className="v2-stat-note">{stat.note}</span>}
                  </li>
                ))}
              </ul>
            )}

            {project.tech && (
              <ul className="v2-tech" aria-label="Technologies used">
                {project.tech.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            )}

            {project.slug === "facial-recognition" && (
              <Link className="v2-callout" href="/face-verify">
                <span>
                  <span className="v2-callout-title">Try the live demo</span>
                  <span className="v2-callout-text">
                    Upload two photos and run the same detect, embed and compare pipeline in your browser, with an
                    adjustable match threshold.
                  </span>
                </span>
                <span className="v2-callout-go">Open demo</span>
              </Link>
            )}
          </div>
        </header>

        <div className="v2-band">
          <div className="v2-wrap v2-case-body" id="case-body">
            <CaseToc items={toc} />

            <article className="v2-case-article">
              {sections.map((section) => (
                <section key={section.heading} id={sectionId(section.heading)} className="v2-case-section">
                  <h2 className="v2-case-h2">{section.heading}</h2>
                  <SectionBody section={section} />
                </section>
              ))}

              <nav className="v2-next" aria-label="Next project">
                <Link href={`/work/${next.slug}`}>
                  <span className="v2-next-label">Next project</span>
                  <span className="v2-next-title">{next.title}</span>
                </Link>
              </nav>
            </article>
          </div>
        </div>
      </main>
    </>
  );
}
