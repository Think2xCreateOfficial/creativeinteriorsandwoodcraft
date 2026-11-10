import type { MetadataRoute } from "next";

import { site } from "@/lib/site";

/**
 * Fixed content revision date to prevent crawler churn across deployments.
 * Update whenever substantive editorial changes are published.
 */
const CONTENT_LAST_MODIFIED = new Date("2026-03-30T00:00:00.000Z");

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: site.url,
      lastModified: CONTENT_LAST_MODIFIED,
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
