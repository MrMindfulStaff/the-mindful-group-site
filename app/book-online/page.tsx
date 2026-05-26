import Link from "next/link";
import type { Metadata } from "next";
import {
  upcomingOrientationDates,
  ORIENTATION_CAPACITY,
  ORIENTATION_ADDRESS,
  ORIENTATION_ROOM,
  ORIENTATION_PARKING,
  ORIENTATION_TIME_LABEL,
} from "@/lib/orientation-dates";
import { fetchRemainingByDate } from "@/lib/orientation-availability";
import OrientationBookingForm from "./OrientationBookingForm";

// Always render fresh so seat availability is current.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Book an Orientation | The Mindful Group",
  description: "Book an orientation for CNA/CBRF Training, Construction Training, Career Development, Mental Health Counseling, or Financial Literacy. Milwaukee, WI.",
};

const services = [
  {
    id: "cna-cbrf",
    title: "CNA/CBRF Training Orientation",
    tag: "Healthcare",
    schedule: "Every other Tuesday at 11:00 AM",
    duration: "~1.5 hours",
    description: "Our CNA/CBRF training orientation walks you through the program, requirements, timeline, and next steps. Leave with a clear path to certification.",
    whatToExpect: [
      "Program overview and curriculum walkthrough",
      "Certification requirements explained",
      "Wraparound support services (childcare, transportation, housing)",
      "Enrollment paperwork — bring a valid ID",
      "Meet current students and graduates",
    ],
    href: "#book",
    programPage: "/programs/cna-cbrf",
  },
  {
    id: "construction",
    title: "Construction Training Orientation",
    tag: "Trades",
    schedule: "Every other Tuesday at 11:00 AM",
    duration: "~1.5 hours",
    description: "Enter the construction trades with hands-on training. This orientation covers the full pre-apprenticeship program, safety certification, and direct employment pipeline.",
    whatToExpect: [
      "Pre-apprenticeship program overview",
      "OSHA safety certification path",
      "Hands-on training schedule and job site expectations",
      "Tool and equipment orientation",
      "Employment placement through Mindful Staffing",
    ],
    href: "#book",
    programPage: "/programs/construction",
  },
  {
    id: "career-development",
    title: "Career Development Assistance",
    tag: "Career",
    schedule: "By appointment",
    duration: "Varies",
    description: "One-on-one career coaching, resume building, interview preparation, and job search strategy. Whether you're starting fresh or pivoting careers, we meet you where you are.",
    whatToExpect: [
      "Individual career assessment",
      "Resume and cover letter development",
      "Interview preparation and mock interviews",
      "Job search strategy and networking",
      "Ongoing support through employment",
    ],
    href: "/programs/career-development/inquire",
    programPage: "/programs/career-development",
  },
  {
    id: "mental-health",
    title: "Mental Health Counseling",
    tag: "Wellness",
    schedule: "By appointment",
    duration: "50 minutes per session",
    description: "Confidential counseling sessions for participants and community members. Address stress, trauma, anxiety, and the mental health challenges that come with career transitions.",
    whatToExpect: [
      "Confidential individual counseling",
      "Stress and anxiety management",
      "Trauma-informed care approach",
      "Referrals to specialized services when needed",
    ],
    href: "/programs/mental-health/inquire",
    programPage: "/programs/mental-health",
  },
  {
    id: "financial-literacy",
    title: "Financial Literacy",
    tag: "Education",
    schedule: "By appointment",
    duration: "Varies by module",
    description: "Build the financial foundation for long-term stability. Budgeting, saving, credit building, and debt management — practical skills for real life after training.",
    whatToExpect: [
      "Personal budgeting and money management",
      "Credit score building strategies",
      "Debt reduction planning",
      "Banking and savings fundamentals",
      "Tax preparation assistance",
    ],
    href: "/programs/financial-literacy/inquire",
    programPage: "/programs/financial-literacy",
  },
];

export default async function BookOnlinePage() {
  // Generate a wide window of upcoming biweekly Tuesdays, then keep only the
  // ones with open seats (next-available-onward), Wix-style.
  const generated = upcomingOrientationDates(12);
  const remainingByIso = await fetchRemainingByDate(generated.map((s) => s.iso));

  const withSeats = generated.map((s) => ({
    ...s,
    remaining: remainingByIso[s.iso] ?? ORIENTATION_CAPACITY, // fail-open
  }));
  const orientationSlots = withSeats.filter((s) => s.remaining > 0).slice(0, 8);
  const someHidden = withSeats.some((s) => s.remaining <= 0);

  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-16 bg-gradient-to-br from-secondary via-secondary to-primary overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
          backgroundSize: "40px 40px",
        }} />
        <div className="absolute inset-0 bg-gradient-to-r from-secondary/90 via-secondary/70 to-transparent z-[1]" />
        <div className="relative z-[2] max-w-7xl mx-auto px-6">
          <p className="text-primary-light text-sm uppercase tracking-[0.3em] mb-6 font-semibold">
            Get Started
          </p>
          <h1 className="text-4xl md:text-6xl font-heading text-white leading-tight mb-6">
            Book an <span className="text-accent">Orientation</span>
          </h1>
          <p className="text-white/70 text-lg max-w-2xl mb-4">
            Every journey starts with a single step. Choose a program below and book your orientation — no prerequisites, just show up.
          </p>
          <div className="flex flex-wrap gap-6 text-white/50 text-sm">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              {ORIENTATION_ADDRESS} — {ORIENTATION_ROOM}
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
              <a href="tel:8334146463" className="text-white/50 hover:text-white transition-colors">833-414-MIND (6463)</a>
            </div>
          </div>
        </div>
      </section>

      {/* Schedule notice */}
      <section className="relative -mt-6 z-10 pb-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-white rounded-lg shadow-lg border border-border-light p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            </div>
            <div>
              <h2 className="text-text font-heading text-lg">Training Orientations: Every Other Tuesday at 11:00 AM</h2>
              <p className="text-text-light text-sm mt-1">CNA/CBRF and Construction orientations run on the same biweekly schedule. Career Development, Mental Health, and Financial Literacy are available by appointment.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Where & how to arrive — shown BEFORE booking so people know what
          they're signing up for. Mirrors the success-state and confirmation
          email so all three channels say the exact same thing. */}
      <section className="pb-8">
        <div className="max-w-3xl mx-auto px-6">
          <div className="bg-white rounded-lg border border-border-light shadow-sm p-6">
            <h2 className="text-text font-heading text-lg mb-4">Where &amp; How to Arrive</h2>
            <div className="grid sm:grid-cols-2 gap-4 text-sm text-text-light">
              <div className="flex gap-3">
                <span className="shrink-0 text-base">📍</span>
                <span>
                  <strong className="text-text">{ORIENTATION_ADDRESS}</strong>
                  <br />
                  {ORIENTATION_ROOM}
                </span>
              </div>
              <div className="flex gap-3">
                <span className="shrink-0 text-base">🅿️</span>
                <span>{ORIENTATION_PARKING}</span>
              </div>
              <div className="flex gap-3">
                <span className="shrink-0 text-base">🕚</span>
                <span>
                  Arrive a few minutes before <strong className="text-text">{ORIENTATION_TIME_LABEL}</strong>. Orientations run about 90 minutes.
                </span>
              </div>
              <div className="flex gap-3">
                <span className="shrink-0 text-base">📞</span>
                <span>
                  Need to reschedule? Call{" "}
                  <a href="tel:8334146463" className="text-primary hover:text-primary-light">
                    833-414-MIND (6463)
                  </a>
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Orientation booking form */}
      <section id="book" className="pb-16 scroll-mt-28">
        <div className="max-w-3xl mx-auto px-6">
          <div className="bg-white rounded-lg border border-border-light shadow-sm p-8">
            <p className="text-primary text-xs uppercase tracking-[0.3em] mb-3 font-semibold">Reserve Your Seat</p>
            <h2 className="text-2xl md:text-3xl font-heading text-text mb-3">Book Your Orientation</h2>
            <p className="text-text-light text-sm mb-6 max-w-2xl">
              Pick a program and an upcoming Tuesday. Orientations are in-person and about 90 minutes. Career Development, Mental Health, and Financial Literacy are by appointment — tell us about your interest on the program page to get scheduled.
            </p>
            <div className="mb-8 flex items-start gap-2 rounded-md bg-surface border border-border-light px-4 py-3">
              <svg className="w-4 h-4 text-primary shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <p className="text-text-light text-xs">
                Each orientation seats {ORIENTATION_CAPACITY} (CNA/CBRF and Construction combined).
                {someHidden
                  ? " Only dates with open seats are shown — sessions that are full are hidden."
                  : " We show the next available dates with open seats."}
              </p>
            </div>
            {orientationSlots.length === 0 ? (
              <div className="rounded-md border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                All upcoming orientations are currently full. Please call <a href="tel:8334146463" className="font-semibold underline">833-414-MIND (6463)</a> and we&apos;ll get you on the next available date.
              </div>
            ) : (
              <OrientationBookingForm slots={orientationSlots} />
            )}
          </div>
        </div>
      </section>

      {/* Service cards */}
      <section className="pb-24">
        <div className="max-w-7xl mx-auto px-6 space-y-8">
          {services.map((service) => (
            <div key={service.id} id={service.id} className="bg-white rounded-lg border border-border-light shadow-sm hover:shadow-md transition-shadow scroll-mt-32">
              <div className="p-8">
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] uppercase tracking-wider rounded-full font-semibold">
                    {service.tag}
                  </span>
                  <span className="text-text-light text-xs">{service.schedule}</span>
                  <span className="text-text-light text-xs">· {service.duration}</span>
                </div>

                <h2 className="text-2xl font-heading text-text mb-3">{service.title}</h2>
                <p className="text-text-light leading-relaxed mb-6 max-w-3xl">{service.description}</p>

                <div className="bg-surface rounded-lg p-6 mb-6">
                  <h3 className="text-text text-sm uppercase tracking-wider font-semibold mb-3">What to Expect</h3>
                  <ul className="space-y-2">
                    {service.whatToExpect.map((item) => (
                      <li key={item} className="flex items-start gap-3 text-text-light text-sm">
                        <svg className="w-4 h-4 text-primary shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex flex-wrap gap-3">
                  <a
                    href={service.href}
                    className="px-6 py-3 bg-accent text-white font-semibold text-xs uppercase tracking-wider rounded-md hover:bg-accent-light transition-colors"
                  >
                    Book Now
                  </a>
                  <Link
                    href={service.programPage}
                    className="px-6 py-3 border border-border-light text-text-light text-xs uppercase tracking-wider rounded-md hover:border-primary/30 hover:text-primary transition-colors"
                  >
                    Learn More About This Program
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-surface py-16">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-2xl font-heading text-text mb-4">
            Can&apos;t Find What You Need?
          </h2>
          <p className="text-text-light mb-8">
            Call us at <a href="tel:8334146463" className="text-primary hover:text-primary-light transition-colors font-semibold">833-414-MIND (6463)</a> or send us a message. We&apos;re here to help you find the right path.
          </p>
          <Link
            href="/contact"
            className="px-8 py-4 bg-accent text-white font-semibold text-sm uppercase tracking-wider rounded-md hover:bg-accent-light transition-colors"
          >
            Contact Us
          </Link>
        </div>
      </section>
    </>
  );
}
