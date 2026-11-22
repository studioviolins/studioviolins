import type { Metadata, Viewport } from "next";
import { DM_Sans, Source_Serif_4 } from "next/font/google";
import { pageMetadata } from "@/components/seo/metadata";
import { SITE_URL } from "@/components/site/business";
import "./globals.css";

// Contemporary serif with balanced proportions; variable weight + optical size.
const serif = Source_Serif_4({
  subsets: ["latin"],
  axes: ["opsz"],
  variable: "--font-serif",
  display: "swap",
});

const sans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-sans",
  display: "swap",
});

// The home page's details; the terms, privacy and not-found pages set their own.
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  ...pageMetadata({
    path: "/",
    title: "Studio Violins — Rent your violin from a professional violinist",
    description:
      "Violin rental in Hitchin with the personal guidance of Nick Evans-Pughe, professional violinist, teacher and Associate of the Royal Academy of Music.",
  }),
};

export const viewport: Viewport = {
  themeColor: "#102922",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB" className={`${serif.variable} ${sans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
