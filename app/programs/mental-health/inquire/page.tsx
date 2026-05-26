import Link from "next/link";
import type { Metadata } from "next";
import InquiryForm from "@/components/InquiryForm";

export const metadata: Metadata = {
  title: "Request Mental Health Counseling | The Mindful Group",
  description:
    "Request confidential mental health counseling. Trauma-informed, individual sessions. A team member will follow up within one business day.",
};

export default function MentalHealthInquirePage() {
  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-12 bg-gradient-to-br from-secondary via-secondary to-primary">
        <div className="max-w-3xl mx-auto px-6">
          <Link
            href="/programs/mental-health"
            className="text-white/70 text-sm uppercase tracking-wider hover:text-white transition-colors mb-6 inline-block"
          >
            &larr; Mental Health Counseling
          </Link>
          <p className="text-primary-light text-sm uppercase tracking-[0.3em] mb-4 font-semibold">
            Confidential · By Appointment
          </p>
          <h1 className="text-4xl md:text-5xl font-heading text-white leading-tight mb-4">
            Request <span className="text-accent">Mental Health Counseling</span>
          </h1>
          <p className="text-white/70 text-base max-w-2xl">
            Confidential individual sessions with a trauma-informed approach. Share what you&apos;re comfortable with — a team member will follow up within one business day to set up an appointment.
          </p>
          <p className="text-white/60 text-sm mt-6 max-w-2xl">
            If you are in immediate crisis, please call or text <a href="tel:988" className="text-white underline">988</a> (Suicide &amp; Crisis Lifeline) or <a href="tel:911" className="text-white underline">911</a>.
          </p>
        </div>
      </section>

      {/* Form */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-6">
          <div className="bg-white rounded-lg border border-border-light shadow-sm p-8">
            <InquiryForm service="mental-health" serviceName="Mental Health Counseling" />
          </div>
        </div>
      </section>
    </>
  );
}
