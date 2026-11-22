import type { MetadataRoute } from "next";

/**
 * Web app manifest: the SV monogram for "Add to Home Screen" and Android. Tab favicons come from app/icon.svg and
 * app/favicon.ico, and the iOS icon from app/apple-icon.png (Next adds those links itself). Masters and the
 * generator are in assets/brand/.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Studio Violins",
    short_name: "Studio Violins",
    start_url: "/",
    display: "browser",
    theme_color: "#102922",
    background_color: "#102922",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
