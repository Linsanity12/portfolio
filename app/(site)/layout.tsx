import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import "./v2.css";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Morris Lin | Electrical + Computer Engineering",
  description:
    "Professional portfolio of Jia-Mao (Morris) Lin, specializing in AI, Embedded Systems, and Electrical Engineering.",
  metadataBase: new URL("https://morris-lin.com"),
};

export const viewport: Viewport = {
  themeColor: "#07070a",
  colorScheme: "dark",
};

// Second root layout (see app/(site)/layout.tsx for the original). It owns its own
// <html>/<body>, font and stylesheet, so nothing from the original site leaks in.
export default function V2Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`v2 ${geist.variable}`}>
      <body>{children}</body>
    </html>
  );
}
