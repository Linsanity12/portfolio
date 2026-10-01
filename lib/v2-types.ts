import type { CaseStudySection, Project } from "@/lib/projects";

/** A link shown next to a project's case-study link. */
export type ExtraLink = { label: string; href: string; external?: boolean };

export type Figure = { src: string; alt: string; caption?: string; width: number; height: number };

/** A caption cue, kept in the page as text so the transcript matches the .vtt track. */
export type VideoCue = { at: string; text: string };

export type Video = {
  /** anchor id, so other pages can link straight to the player */
  id: string;
  mp4: string;
  captions: string;
  poster: string;
  width: number;
  height: number;
  /** shown in the download fallback, e.g. "1:54" and "1.3 MB" */
  duration: string;
  size: string;
  caption: string;
  cues: VideoCue[];
};

export type Stat = { value: string; label: string; note?: string };

/**
 * A case-study section. Everything from lib/projects.ts still works (body, one image, one table);
 * the optional fields below add richer blocks and render in this order:
 * body, steps, table, note, list, terms, video, diagram, image, figures.
 */
export type V2Section = CaseStudySection & {
  /** a real sequence: rendered as a numbered list */
  steps?: string[];
  list?: string[];
  /** lead-in term followed by an explanation */
  terms?: { term: string; text: string }[];
  video?: Video;
  diagram?: "dashboard-architecture";
  /** small print directly under a table */
  note?: string;
  figures?: Figure[];
};

/** A project as v2 shows it: everything from lib/projects.ts plus optional card and header extras. */
export type V2Project = Project & {
  /** technology chips */
  tech?: string[];
  /** short verified facts shown on the home-page card */
  highlights?: string[];
  /** headline numbers shown under the case-study title */
  stats?: Stat[];
  /** buttons in the case-study header (only real, working links belong here) */
  actions?: ExtraLink[];
  /** one-or-two-sentence "if you read nothing else" summary, shown at the top with jump links —
   * only worth adding on a case study long enough that skimming it needs a shortcut */
  takeaway?: string;
};
