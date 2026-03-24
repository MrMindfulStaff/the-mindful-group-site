import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Programs | The Mindful Group",
  description:
    "Zero-tuition workforce training programs: CNA/CBRF, Construction, Financial Literacy, Career Development, and Mental Health Counseling in Milwaukee.",
};

const programs = [
  {
    title: "CNA/CBRF Training",
    tag: "Healthcare",
    description:
      "State-certified nursing assistant and community-based residential facility training. Launch a healthcare career with zero tuition and direct job placement through Mindful Staffing.",
    details: [
      "Zero tuition — fully funded",
      "State-certified CNA and CBRF curriculum",
      "Orientation sessions on Tuesdays",
      "Direct employment pipeline",
      "Full wraparound support included",
    ],
    href: "/programs/cna-cbrf",
    bookingUrl:
      "https://www.themindfulgroupinc.org/service-page/cna-cbrf-training-orientation",
  },
  {
    title: "Construction Training",
    tag: "Trades",
    description:
      "9-week building trades program featuring 5 weeks of hands-on remodeling training. Learn real skills on real Milwaukee job sites while contributing to neighborhood revitalization.",
    details: [
      "9-week comprehensive program",
      "5 weeks hands-on remodeling",
      "Real job site experience",
      "Connects to homeownership pathway",
      "Tuesday orientation sessions",
    ],
    href: "/programs/construction",
    bookingUrl:
      "https://www.themindfulgroupinc.org/service-page/construction-training-orientation",
  },
  {
    title: "Financial Literacy",
    tag: "Career Readiness",
    description:
      "Master budgeting, saving, and investing. Make informed financial decisions that build long-term wealth and stability for you and your family.",
    details: [
      "Budgeting and saving strategies",
      "Introduction to investing",
      "Credit building and repair",
      "Financial planning for families",
    ],
    href: "/programs/financial-literacy",
    bookingUrl:
      "https://www.themindfulgroupinc.org/service-page/financial-literacy",
  },
  {
    title: "Career Development",
    tag: "Career Readiness",
    description:
      "Resume building, interview preparation, and networking strategies. Get personalized coaching to prepare you for career success.",
    details: [
      "Professional resume development",
      "Mock interview practice",
      "Networking strategy",
      "Job search support",
      "1-hour individual sessions",
    ],
    href: "/programs/career-development",
    bookingUrl:
      "https://www.themindfulgroupinc.org/service-page/career-development-assistance",
  },
  {
    title: "Mental Health Counseling",
    tag: "Wellness",
    description:
      "Personalized counseling sessions covering coping strategies, emotional wellness, and stress management in a safe, confidential environment.",
    details: [
      "Confidential 1-on-1 sessions",
      "Coping strategies and tools",
      "Emotional wellness support",
      "Stress management techniques",
      "Request-to-book for scheduling",
    ],
    href: "/programs/mental-health",
    bookingUrl:
      "https://www.themindfulgroupinc.org/service-page/mental-health-counseling",
  },
];

export default function ProgramsPage() {
  return (
    <>
      <section className="pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-gold text-sm uppercase tracking-[0.3em] mb-6">
            Training Programs
          </p>
          <h1 className="text-4xl md:text-6xl font-heading text-ivory leading-tight mb-8">
            Zero Tuition. <span className="text-gold">Real Careers.</span>
          </h1>
          <p className="text-silver text-lg max-w-3xl">
            Industry-recognized training with full wraparound support. Every
            program includes child care assistance, transportation, housing
            help, and direct employment placement.
          </p>
        </div>
      </section>

      <section className="pb-24">
        <div className="max-w-7xl mx-auto px-6 space-y-8">
          {programs.map((p) => (
            <div
              key={p.title}
              className="border border-gold/10 hover:border-gold/30 transition-all duration-300"
            >
              <div className="p-8 md:p-12">
                <div className="grid md:grid-cols-5 gap-8 md:gap-12">
                  <div className="md:col-span-3">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-[10px] uppercase tracking-[0.2em] border border-gold/20 text-gold/60 px-2 py-0.5">
                        {p.tag}
                      </span>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-heading text-ivory mb-4">
                      {p.title}
                    </h2>
                    <p className="text-silver leading-relaxed mb-6">
                      {p.description}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <a
                        href={p.bookingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-8 py-4 bg-gold text-obsidian font-semibold text-sm uppercase tracking-wider hover:bg-gold-light transition-colors text-center"
                      >
                        Book Orientation
                      </a>
                      <Link
                        href={p.href}
                        className="px-8 py-4 border border-gold/40 text-gold text-sm uppercase tracking-wider hover:bg-gold/10 transition-colors text-center"
                      >
                        Learn More
                      </Link>
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <h3 className="text-ivory text-sm uppercase tracking-wider mb-4">
                      What&apos;s Included
                    </h3>
                    <ul className="space-y-3">
                      {p.details.map((d, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <span className="text-gold mt-1 shrink-0">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </span>
                          <span className="text-silver text-sm">{d}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-obsidian-light py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-heading text-ivory mb-6">
            Ready to <span className="text-gold">Get Started?</span>
          </h2>
          <p className="text-silver text-lg mb-10 max-w-2xl mx-auto">
            Attend an orientation session — no commitment required. Learn about
            our programs, meet the team, and see if it&apos;s the right fit.
          </p>
          <a
            href="https://www.themindfulgroupinc.org/book-online"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-8 py-4 bg-gold text-obsidian font-semibold text-sm uppercase tracking-wider hover:bg-gold-light transition-colors"
          >
            Book an Orientation
          </a>
        </div>
      </section>
    </>
  );
}
