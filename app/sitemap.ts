import type { MetadataRoute } from "next";

import { site } from "@/lib/site";

/**
 * Sitemap configuration for Creative Interiors & Woodcraft.
 * Host domain: https://creativeinteriorsandwoodcraft.think2xcreate.com/
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    {
      url: `${site.url}/`,
      lastModified,
      changeFrequency: "weekly",
      priority: 1.0,
    },
  ];
}
