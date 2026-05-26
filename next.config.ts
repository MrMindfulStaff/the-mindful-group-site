import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",

  // Redirects for old Wix service-page and booking-calendar URLs.
  // Google has these indexed — keep them as 301s so crawlers and bookmarks
  // land on the right page after the DNS flip.
  async redirects() {
    return [
      // Service pages → program pages
      {
        source: "/service-page/cna-cbrf-training-orientation",
        destination: "/programs/cna-cbrf",
        permanent: true,
      },
      {
        source: "/service-page/cna-cbrf-training",
        destination: "/programs/cna-cbrf",
        permanent: true,
      },
      {
        source: "/service-page/career-consultation",
        destination: "/programs/cna-cbrf",
        permanent: true,
      },
      {
        source: "/service-page/construction-training-orientation",
        destination: "/programs/construction",
        permanent: true,
      },
      {
        source: "/service-page/construction-building-trades-training",
        destination: "/programs/construction",
        permanent: true,
      },
      {
        source: "/service-page/career-development-assistance",
        destination: "/programs/career-development",
        permanent: true,
      },
      {
        source: "/service-page/career-development-course",
        destination: "/programs/career-development",
        permanent: true,
      },
      {
        source: "/service-page/mental-health-counseling",
        destination: "/programs/mental-health",
        permanent: true,
      },
      {
        source: "/service-page/financial-literacy",
        destination: "/programs/financial-literacy",
        permanent: true,
      },
      {
        source: "/service-page/phlebotomy-training-orientation",
        destination: "/book-online",
        permanent: true,
      },
      {
        source: "/service-page/phlebotomy-training",
        destination: "/book-online",
        permanent: true,
      },

      // Booking-calendar pages → new booking or inquiry flows
      {
        source: "/booking-calendar/cna-cbrf-training-orientation",
        destination: "/book-online",
        permanent: true,
      },
      {
        source: "/booking-calendar/cna-cbrf-training",
        destination: "/book-online",
        permanent: true,
      },
      {
        source: "/booking-calendar/career-consultation",
        destination: "/book-online",
        permanent: true,
      },
      {
        source: "/booking-calendar/construction-training-orientation",
        destination: "/book-online",
        permanent: true,
      },
      {
        source: "/booking-calendar/construction-building-trades-training",
        destination: "/book-online",
        permanent: true,
      },
      {
        source: "/booking-calendar/career-development-assistance",
        destination: "/programs/career-development/inquire",
        permanent: true,
      },
      {
        source: "/booking-calendar/career-development-course",
        destination: "/programs/career-development/inquire",
        permanent: true,
      },
      {
        source: "/booking-calendar/mental-health-counseling",
        destination: "/programs/mental-health/inquire",
        permanent: true,
      },
      {
        source: "/booking-calendar/financial-literacy",
        destination: "/programs/financial-literacy/inquire",
        permanent: true,
      },
      {
        source: "/booking-calendar/phlebotomy-training-orientation",
        destination: "/book-online",
        permanent: true,
      },
      {
        source: "/booking-calendar/phlebotomy-training",
        destination: "/book-online",
        permanent: true,
      },

      // Wix catch-all for any other /service-page/* or /booking-calendar/* paths
      // that may have been shared in flyers or linked externally.
      {
        source: "/service-page/:slug",
        destination: "/programs",
        permanent: true,
      },
      {
        source: "/booking-calendar/:slug",
        destination: "/book-online",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
