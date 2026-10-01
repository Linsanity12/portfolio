// Retired: the redesign now lives at the root (app/(site)). This whole folder can be deleted.
export default function RetiredLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
