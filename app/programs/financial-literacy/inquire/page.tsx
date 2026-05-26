import Link from "next/link";
import type { Metadata } from "next";
import InquiryForm from "@/components/InquiryForm";

export const metadata: Metadata = {
  title: "Request a Financial Literacy Session | The Mindful Group",
  description:
    "Request financial literacy coaching — budgeting, credit building, debt reduction, and banking fundamentals. A team member will follow up within one business day.",
};

export default function FinancialLiteracyInquirePage() {
  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-12 bg-gradient-to-br from-secondary via-secondary to-primary">
        <div className="max-w-3xl mx-auto px-6">
          <Link
            href="/programs/financial-literacy"
            className="text-white/70 text-sm uppercase tracking-wider hover:text-white transition-colors mb-6 inline-block"
          >
            &larr; Financial Literacy
          </Link>
          <p className="text-primary-light text-sm uppercase tracking-[0.3em] mb-4 font-semibold">
            By Appointment
          </p>
          <h1 className="text-4xl md:text-5xl font-heading text-white leading-tight mb-4">
            Request a <span className="text-accent">Financial Literacy</span> Session
          </h1>
          <p className="text-white/70 text-base max-w-2xl">
            Practical coaching on budgeting, credit, debt, and savings. Tell us where you&apos;re starting and a team member will follow up within one business day.
          </p>
        </div>
      </section>

      {/* Form */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-6">
          <div className="bg-white rounded-lg border border-border-light shadow-sm p-8">
            <InquiryForm service="financial-literacy" serviceName="Financial Literacy" />
          </div>
        </div>
      </section>
    </>
  );
}
