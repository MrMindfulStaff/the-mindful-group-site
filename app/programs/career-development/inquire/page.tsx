import Link from "next/link";
import type { Metadata } from "next";
import InquiryForm from "@/components/InquiryForm";

export const metadata: Metadata = {
  title: "Request a Career Development Session | The Mindful Group",
  description:
    "Request 1-on-1 career coaching — resume building, interview prep, and job search strategy. A team member will follow up within one business day.",
};

export default function CareerDevelopmentInquirePage() {
  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-12 bg-gradient-to-br from-secondary via-secondary to-primary">
        <div className="max-w-3xl mx-auto px-6">
          <Link
            href="/programs/career-development"
            className="text-white/70 text-sm uppercase tracking-wider hover:text-white transition-colors mb-6 inline-block"
          >
            &larr; Career Development
          </Link>
          <p className="text-primary-light text-sm uppercase tracking-[0.3em] mb-4 font-semibold">
            By Appointment
          </p>
          <h1 className="text-4xl md:text-5xl font-heading text-white leading-tight mb-4">
            Request a <span className="text-accent">Career Development</span> Session
          </h1>
          <p className="text-white/70 text-base max-w-2xl">
            Tell us a little about yourself and what you&apos;re working toward. A team member will follow up within one business day to schedule your session.
          </p>
        </div>
      </section>

      {/* Form */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-6">
          <div className="bg-white rounded-lg border border-border-light shadow-sm p-8">
            <InquiryForm service="career-development" serviceName="Career Development" />
          </div>
        </div>
      </section>
    </>
  );
}
