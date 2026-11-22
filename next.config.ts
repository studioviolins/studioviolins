import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Lets you open the dev preview from a phone on the same Wi-Fi.
  allowedDevOrigins: ["192.168.1.4"],

  // The old Framer site's pages (its sitemap.xml, read 22 Nov 2026): /, /terms and /privacy keep their
  // addresses; /contact now lives on the home page.
  async redirects() {
    return [{ source: "/contact", destination: "/#contact", permanent: true }];
  },
};

export default nextConfig;
