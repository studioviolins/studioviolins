import { homeGraph, jsonLd, pageGraph } from "./structured-data";

/**
 * Structured data for search engines and AI systems (see ./structured-data.ts for what's in it and why).
 * The home page renders the full graph; supporting pages pass their own path, title and description.
 */
export default function BusinessJsonLd({ page }: { page?: { path: string; title: string; description: string } }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: jsonLd(page ? pageGraph(page) : homeGraph()) }}
    />
  );
}
