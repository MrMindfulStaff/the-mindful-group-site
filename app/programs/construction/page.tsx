import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { BOOKING } from "@/lib/booking";

export const metadata: Metadata = {
  title: "Construction Training | The Mindful Group",
  description: "9-week construction and building trades training in Milwaukee. Hands-on remodeling experience with zero tuition and job placement.",
};

export default function ConstructionPage() {
  return (
    <>
      <section className="pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-6">
          <Link href="/programs" className="text-primary text-sm uppercase tracking-wider hover:text-primary-light transition-colors mb-6 inline-block">&larr; All Programs</Link>
          <div className="flex items-center gap-3 mb-6">
            <span className="text-[10px] uppercase tracking-[0.2em] border border-border-light text-primary/60 px-2 py-0.5 rounded-md">Trades</span>
            <span className="text-[10px] uppercase tracking-[0.2em] border border-primary/20 text-primary/60 px-2 py-0.5 rounded-md">Enrolling</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-heading text-text leading-tight mb-8">
            Construction <span className="text-primary">Training</span>
          </h1>
          <p className="text-text-light text-lg max-w-3xl mb-10">
            The Mindful Way Building Trades Training. A 9-week program featuring 5 weeks of hands-on remodeling training on real Milwaukee job sites.
          </p>
          <Link href={BOOKING.construction} className="inline-block px-8 py-4 bg-accent text-white font-semibold text-sm uppercase tracking-wider rounded-md hover:bg-accent-light transition-colors">Book Orientation</Link>
        </div>
      </section>

      <section className="pb-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="relative aspect-[21/9] rounded-lg overflow-hidden">
            <Image src="/images/construction-training.jpg" alt="Construction training on a job site" fill className="object-cover" />
          </div>
        </div>
      </section>

      <section className="bg-surface py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 md:gap-16">
            <div>
              <h2 className="text-2xl md:text-3xl font-heading text-text mb-6">Build Skills. Build Homes. Build Your Future.</h2>
              <div className="space-y-4 text-text-light leading-relaxed">
                <p>Our 9-week construction training program teaches real building trades skills through hands-on experience. Students spend 5 weeks working on actual home remodeling projects in Milwaukee neighborhoods.</p>
                <p>The program connects directly to The Mindful Group&apos;s homeownership initiative — students help remodel dilapidated Milwaukee homes that are then offered to program graduates through a rent-to-own model.</p>
                <p>Graduates gain construction industry skills, real job site experience, and access to employment through our staffing partnerships. This is workforce development that literally builds communities.</p>
              </div>
            </div>
            <div>
              <h3 className="text-text font-semibold text-sm uppercase tracking-wider mb-6">Program Details</h3>
              <div className="space-y-4">
                {[
                  { label: "Duration", value: "9 Weeks" },
                  { label: "Hands-On", value: "5 weeks remodeling" },
                  { label: "Tuition", value: "$0 — Fully Funded" },
                  { label: "Orientation", value: "1.5 hours, Tuesdays" },
                  { label: "Location", value: "4201 N 27th St, Milwaukee" },
                  { label: "Support", value: "Child care, transport, housing" },
                ].map((d) => (
                  <div key={d.label} className="flex justify-between border-b border-border-light pb-3">
                    <span className="text-text-light text-sm">{d.label}</span>
                    <span className="text-text text-sm">{d.value}</span>
                  </div>
                ))}
              </div>
              <div className="mt-8 p-6 bg-white border border-border-light rounded-lg">
                <h4 className="text-text font-semibold text-sm uppercase tracking-wider mb-3">Homeownership Pathway</h4>
                <p className="text-text-light text-sm leading-relaxed">Graduates are eligible for the Mindful Way Homeowner Program — rent-to-own homes remodeled through the training program itself.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-heading text-text mb-6">Ready to <span className="text-primary">Build?</span></h2>
          <p className="text-text-light text-lg mb-10">Book a free orientation to learn about the program and start your career in the trades.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={BOOKING.construction} className="px-8 py-4 bg-accent text-white font-semibold text-sm uppercase tracking-wider rounded-md hover:bg-accent-light transition-colors">Book Orientation</Link>
            <Link href="/contact" className="px-8 py-4 border border-primary text-primary text-sm uppercase tracking-wider rounded-md hover:bg-primary/10 transition-colors">Ask a Question</Link>
          </div>
        </div>
      </section>
    </>
  );
}
