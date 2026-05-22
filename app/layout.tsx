import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ChatWidget from "@/components/ChatWidget";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://the-mindful-group-site.vercel.app"),
  title: "The Mindful Group | Community First. Opportunity Always.",
  description:
    "Milwaukee's workforce training nonprofit. CNA/CBRF, Construction, and Career Development programs with wraparound support. 525+ trained. 90% graduation rate. 85% job placement.",
  keywords: [
    "The Mindful Group",
    "workforce development",
    "Milwaukee",
    "CNA training",
    "CBRF training",
    "construction training",
    "career development",
    "53216",
    "job training Milwaukee",
  ],
  openGraph: {
    title: "The Mindful Group | Community First. Opportunity Always.",
    description:
      "Milwaukee's workforce training nonprofit. 525+ trained. 90% graduation rate. 85% job placement.",
    type: "website",
    siteName: "The Mindful Group",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Mindful Group | Community First. Opportunity Always.",
    description:
      "Milwaukee's workforce training nonprofit. 525+ trained. 90% graduation rate. 85% job placement.",
  },
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased">
        <Navigation />
        <main>{children}</main>
        <Footer />
        <ChatWidget />
      </body>
    </html>
  );
}
