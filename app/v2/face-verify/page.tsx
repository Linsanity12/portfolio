import { redirect } from "next/navigation";

// Retired route: the site now lives at the root. Cloudflare's public/_redirects also
// sends visitors here. This whole folder can be deleted.
export default function Retired() {
  redirect("/face-verify");
}
