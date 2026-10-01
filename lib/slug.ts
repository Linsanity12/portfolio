export function sectionId(heading: string) {
  return heading
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/**
 * Scrolls to a section by id, then corrects itself once shortly after.
 *
 * Why: on a page this image-heavy, the very first anchor click right after
 * load can land well short of the target — something below the fold (an
 * image, a web font) is still settling layout at the instant the browser
 * computes the smooth-scroll target, so the target's real position moves
 * after the scroll has already started. A second click always lands
 * correctly, because by then layout has settled — so this just does that
 * correction automatically instead of leaving a broken first click.
 */
export function scrollToSection(id: string) {
  const go = () => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  go();
  setTimeout(go, 400);
}
