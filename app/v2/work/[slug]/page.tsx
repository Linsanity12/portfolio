import { redirect } from "next/navigation";
import { PROJECTS } from "@/lib/projects";
import { DASHBOARD_PROJECT } from "@/lib/v2-dashboard";

// Retired route: the site now lives at the root. This whole folder can be deleted.
export function generateStaticParams() {
  return [...PROJECTS.map((p) => ({ slug: p.slug })), { slug: DASHBOARD_PROJECT.slug }];
}

export default async function Retired({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  redirect(`/work/${slug}`);
}
