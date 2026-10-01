# Deploying morris-lin.com

The site is live on **Cloudflare Pages** (project `morris-lin`), with `morris-lin.com` and
`www.morris-lin.com` attached as custom domains. It is a fully static export, with no server code.

## Updating the live site

1. `npm run build`: writes the finished site to the `out/` folder.
2. Zip the **contents** of `out/` (select everything inside `out`, then zip it, not the folder itself).
   Keep the zip under ~10 MB if uploading through the dashboard. The face-recognition model files
   alone are ~7 MB.
3. Cloudflare dashboard → Workers & Pages → **morris-lin** → **Create deployment** → drag in the zip →
   **Save and deploy**. It goes live within a minute.

## How the code is laid out

- `app/(site)/`: the live site (the dark redesign). Its styles are in `app/(site)/v2.css`, and its
  components are in `components/v2/`. Content lives in `lib/v2-content.ts` and `lib/v2-dashboard.ts`.
- `public/_redirects`: Cloudflare redirects that keep old links (`/v2/...`, `/info`) working.
- `next.config.ts`: `output: "export"` is what makes the build static for Cloudflare Pages.

## Safe to delete

These are leftovers from before the redesign moved to the root. Each one only redirects now:

- the whole `app/v2/` folder
- `app/(site)/info/`
- `app/(site)/face-verify/page.module.css`
- `components/CaseStudyTOC.tsx`, `CircuitDiagram.tsx`, `DecryptedText.tsx`,
  `ElectricFieldLines.tsx`, `Footer.tsx`, `Nav.tsx`, `ProjectRow.tsx` (used only by the old light design)
- `morris-lin-site.zip` (the first upload)
