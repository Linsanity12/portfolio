"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import type { Project } from "@/lib/projects";

export default function ProjectRow({ project, index }: { project: Project; index: number }) {
  const clickable = Boolean(project.sections);
  const href = clickable ? `/work/${project.slug}` : "#";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
    >
      <Link
        href={href}
        aria-disabled={!clickable}
        className={`group block rounded-2xl border border-[var(--grid-color)] overflow-hidden bg-[var(--bg-raised)] transition-shadow ${clickable ? "hover:shadow-lg hover:shadow-black/5" : "cursor-default"}`}
      >
        <div className="relative w-full aspect-[16/10] overflow-hidden bg-[var(--bg)]">
          {project.thumb ? (
            <Image
              src={project.thumb}
              alt={project.title}
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
            />
          ) : (
            <div className="engineering-grid absolute inset-0 flex items-center justify-center">
              <span className="mono text-xs uppercase tracking-widest text-[var(--ink-muted)] px-4 text-center">
                {project.tags}
              </span>
            </div>
          )}
          {project.status === "in-progress" && (
            <span className="mono absolute top-3 right-3 text-[10px] uppercase tracking-widest bg-[var(--accent)] text-white px-2 py-1 rounded-full">
              In progress
            </span>
          )}
        </div>
        <div className="p-6">
          <div className="flex items-baseline justify-between gap-4 mb-2">
            <h3 className="text-xl md:text-2xl font-bold group-hover:text-[var(--accent)] transition-colors">
              {String(project.order).padStart(2, "0")} / {project.title}
              {clickable ? " ↗" : ""}
            </h3>
          </div>
          <p className="text-[var(--ink-muted)] mb-3">{project.oneLiner}</p>
          <div className="mono text-xs text-[var(--ink-muted)] uppercase tracking-widest">
            {project.tags} · {project.period}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
