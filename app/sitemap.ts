import type { MetadataRoute } from "next";

const BASE_URL = "https://the-mindful-group-site.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = [
    { url: "/", priority: 1.0 },
    { url: "/programs", priority: 0.9 },
    { url: "/programs/cna-cbrf", priority: 0.8 },
    { url: "/programs/construction", priority: 0.8 },
    { url: "/programs/career-development", priority: 0.8 },
    { url: "/programs/financial-literacy", priority: 0.7 },
    { url: "/programs/mental-health", priority: 0.7 },
    { url: "/support", priority: 0.8 },
    { url: "/support/childcare", priority: 0.7 },
    { url: "/support/housing", priority: 0.7 },
    { url: "/support/transportation", priority: 0.7 },
    { url: "/support/reentry", priority: 0.7 },
    { url: "/stellar-engine", priority: 0.8 },
    { url: "/about", priority: 0.7 },
    { url: "/testimonials", priority: 0.6 },
    { url: "/get-involved", priority: 0.8 },
    { url: "/employment", priority: 0.7 },
    { url: "/contact", priority: 0.7 },
    { url: "/blog", priority: 0.5 },
  ];

  return pages.map((page) => ({
    url: `${BASE_URL}${page.url}`,
    lastModified: new Date(),
    changeFrequency: page.priority >= 0.8 ? "weekly" : "monthly",
    priority: page.priority,
  }));
}
