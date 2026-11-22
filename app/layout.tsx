import type { Metadata, Viewport } from "next";
import { DM_Sans, Source_Serif_4 } from "next/font/google";
import Analytics from "@/components/analytics/Analytics";
import { HOME_SEO, pageMetadata } from "@/components/seo/metadata";
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

// The home page's details; every other page sets its own. The visible hero heading is unchanged.
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  ...pageMetadata({ path: "/", ...HOME_SEO }),
};

export const viewport: Viewport = {
  themeColor: "#102922",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB" className={`${serif.variable} ${sans.variable}`}>
      <body>
        {children}
        {/* Renders nothing unless NEXT_PUBLIC_GA_MEASUREMENT_ID is set (components/analytics/config.ts). */}
        <Analytics />
      </body>
    </html>
  );
}
