import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://djenriquez.dev";
  const lastModified = new Date();

  return [
    {
      url: base,
      lastModified,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${base}/archive`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];
}
