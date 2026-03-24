import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CNA/CBRF Training | The Mindful Group",
  description:
    "Zero-tuition CNA and CBRF training in Milwaukee. State-certified nursing assistant program with job placement, child care, transportation, and housing support.",
};

export default function CNACBRFPage() {
  return (
    <>
      <section className="pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-6">
          <Link href="/programs" className="text-gold text-sm uppercase tracking-wider hover:text-gold-light transition-colors mb-6 inline-block">
            &larr; All Programs
          </Link>
          <div className="flex items-center gap-3 mb-6">
            <span className="text-[10px] uppercase tracking-[0.2em] border border-gold/20 text-gold/60 px-2 py-0.5">Healthcare</span>
            <span className="text-[10px] uppercase tracking-[0.2em] border border-sage/20 text-sage/60 px-2 py-0.5">Enrolling</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-heading text-ivory leading-tight mb-8">
            CNA/CBRF <span className="text-gold">Training</span>
          </h1>
          <p className="text-silver text-lg max-w-3xl mb-10">
            The best CNA training in Milwaukee. Launch a healthcare career with zero tuition, state certification, and direct employment placement through our staffing partners.
          </p>
          <a
            href="https://www.themindfulgroupinc.org/service-page/cna-cbrf-training-orientation"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-8 py-4 bg-gold text-obsidian font-semibold text-sm uppercase tracking-wider hover:bg-gold-light transition-colors"
          >
            Book Orientation
          </a>
        </div>
      </section>

      <section className="bg-obsidian-light py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 md:gap-16">
            <div>
              <h2 className="text-2xl md:text-3xl font-heading text-ivory mb-6">The Mindful Way Medical Training Program</h2>
              <div className="space-y-4 text-silver leading-relaxed">
                <p>Our CNA/CBRF training program provides comprehensive, state-certified nursing assistant and community-based residential facility training to prepare you for immediate employment in healthcare.</p>
                <p>Students receive hands-on clinical training, classroom instruction, and certification preparation — all at zero cost. Upon completion, graduates are connected directly to healthcare employers through Mindful Staffing Solutions.</p>
                <p>This isn&apos;t just training — it&apos;s a complete career launch system. Every student receives wraparound support including child care assistance, transportation, and housing help to ensure nothing stands between them and their certification.</p>
              </div>
            </div>
            <div>
              <h3 className="text-ivory text-sm uppercase tracking-wider mb-6">Program Details</h3>
              <div className="space-y-4">
                {[
                  { label: "Tuition", value: "$0 — Fully Funded" },
                  { label: "Orientation", value: "1.5 hours, Tuesdays" },
                  { label: "Location", value: "4201 N 27th St, Milwaukee" },
                  { label: "Certification", value: "State CNA & CBRF" },
                  { label: "Employment", value: "Direct placement pipeline" },
                  { label: "Support", value: "Child care, transport, housing" },
                ].map((d) => (
                  <div key={d.label} className="flex justify-between border-b border-gold/10 pb-3">
                    <span className="text-silver text-sm">{d.label}</span>
                    <span className="text-ivory text-sm">{d.value}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8 p-6 border border-gold/10">
                <h4 className="text-ivory text-sm uppercase tracking-wider mb-3">Cancellation Policy</h4>
                <p className="text-silver text-sm leading-relaxed">
                  Contact us within 24 hours to cancel or reschedule. Three no-shows without notice may result in program refusal.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-heading text-ivory mb-6">
            Take the <span className="text-gold">First Step</span>
          </h2>
          <p className="text-silver text-lg mb-10">
            Book a free orientation to learn more about the program, meet our team, and start your journey into healthcare.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://www.themindfulgroupinc.org/service-page/cna-cbrf-training-orientation"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-gold text-obsidian font-semibold text-sm uppercase tracking-wider hover:bg-gold-light transition-colors"
            >
              Book Orientation
            </a>
            <Link href="/contact" className="px-8 py-4 border border-gold/40 text-gold text-sm uppercase tracking-wider hover:bg-gold/10 transition-colors">
              Ask a Question
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
