import type { MetadataRoute } from "next";

// Allow everything; point crawlers at the sitemap.
// The sitemap URL is fully-qualified so search engines reach it on the
// production host even if they discovered robots.txt elsewhere.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // No /admin or private surfaces on this site yet — if those land later,
        // add a `disallow` entry here. The booking + inquiry endpoints under
        // /api are intentionally NOT disallowed because crawlers do not POST.
      },
    ],
    sitemap: "https://themindfulgroupinc.org/sitemap.xml",
    host: "https://themindfulgroupinc.org",
  };
}
