import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Get Involved | The Mindful Group",
  description: "Support The Mindful Group through financial contributions, goods/services donations, or volunteer service.",
};

export default function GetInvolvedPage() {
  return (
    <>
      <section className="pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-gold text-sm uppercase tracking-[0.3em] mb-6">Get Involved</p>
          <h1 className="text-4xl md:text-6xl font-heading text-ivory leading-tight mb-8">
            Invest in <span className="text-gold">What Works</span>
          </h1>
          <p className="text-silver text-lg max-w-3xl">
            Every contribution powers zero-tuition training, wraparound support, and direct job placement for Milwaukee&apos;s underserved communities. Your support creates measurable, lasting impact.
          </p>
        </div>
      </section>

      <section className="pb-24">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-8">
          {/* Financial */}
          <div className="border border-gold/10 hover:border-gold/30 p-8 md:p-10 transition-all duration-300">
            <p className="text-gold text-sm uppercase tracking-[0.3em] mb-4">Financial Contribution</p>
            <h2 className="text-2xl font-heading text-ivory mb-4">Fund a Future</h2>
            <p className="text-silver text-sm leading-relaxed mb-6">
              All donations are tax-deductible. 100% of financial contributions support student training, support services, and program operations. You&apos;ll receive a receipt for your records.
            </p>
            <div className="space-y-3 mb-8">
              {[
                { amount: "$50", impact: "Supplies one student for a week" },
                { amount: "$250", impact: "Covers transportation for a cohort" },
                { amount: "$1,000", impact: "Sponsors a full student journey" },
              ].map((d) => (
                <div key={d.amount} className="flex gap-4 items-start">
                  <span className="text-gold font-heading text-lg w-16 shrink-0">{d.amount}</span>
                  <span className="text-silver text-sm">{d.impact}</span>
                </div>
              ))}
            </div>
            <Link href="/contact" className="inline-block px-6 py-3 bg-gold text-obsidian font-semibold text-xs uppercase tracking-wider hover:bg-gold-light transition-colors">
              Contribute
            </Link>
          </div>

          {/* Goods/Services */}
          <div className="border border-gold/10 hover:border-gold/30 p-8 md:p-10 transition-all duration-300">
            <p className="text-gold text-sm uppercase tracking-[0.3em] mb-4">Goods &amp; Services</p>
            <h2 className="text-2xl font-heading text-ivory mb-4">Donate Resources</h2>
            <p className="text-silver text-sm leading-relaxed mb-6">
              We accept donations of goods and services that directly support our students and programs. Construction materials, office supplies, professional services, and more.
            </p>
            <div className="space-y-2 mb-8">
              {["Construction materials & tools", "Office supplies", "Professional services (legal, accounting)", "Training equipment", "Clothing for job interviews"].map((item, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="text-gold mt-1 shrink-0"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg></span>
                  <span className="text-silver text-sm">{item}</span>
                </div>
              ))}
            </div>
            <Link href="/contact" className="inline-block px-6 py-3 border border-gold/40 text-gold text-xs uppercase tracking-wider hover:bg-gold/10 transition-colors">
              Donate Goods
            </Link>
          </div>

          {/* Volunteer */}
          <div id="volunteer" className="border border-gold/10 hover:border-gold/30 p-8 md:p-10 transition-all duration-300">
            <p className="text-gold text-sm uppercase tracking-[0.3em] mb-4">Volunteer</p>
            <h2 className="text-2xl font-heading text-ivory mb-4">Give Your Time</h2>
            <p className="text-silver text-sm leading-relaxed mb-6">
              Share your skills and experience with our students. We match volunteers with opportunities that align with their expertise and availability.
            </p>
            <div className="space-y-2 mb-8">
              {["Guest instruction & mentorship", "Career coaching & mock interviews", "Administrative support", "Event planning & coordination", "Community outreach"].map((item, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="text-gold mt-1 shrink-0"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg></span>
                  <span className="text-silver text-sm">{item}</span>
                </div>
              ))}
            </div>
            <Link href="/contact" className="inline-block px-6 py-3 border border-gold/40 text-gold text-xs uppercase tracking-wider hover:bg-gold/10 transition-colors">
              Volunteer
            </Link>
          </div>
        </div>
      </section>

      {/* Impact */}
      <section className="bg-obsidian-light py-24">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <p className="text-gold text-sm uppercase tracking-[0.3em] mb-6">Your Impact</p>
          <h2 className="text-3xl md:text-4xl font-heading text-ivory mb-8">
            Every Dollar <span className="text-gold">Builds Futures</span>
          </h2>
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            {[
              { stat: "525+", label: "People Trained" },
              { stat: "90%", label: "Graduation Rate" },
              { stat: "85%", label: "Job Placement" },
              { stat: "$0", label: "Tuition to Students" },
            ].map((s) => (
              <div key={s.label} className="border border-gold/10 p-6">
                <p className="text-3xl font-heading text-gold mb-2">{s.stat}</p>
                <p className="text-silver text-sm">{s.label}</p>
              </div>
            ))}
          </div>
          <p className="text-silver text-lg max-w-2xl mx-auto">
            The Mindful Group Inc. is a registered 501(c)(3) nonprofit organization.
            All financial contributions are tax-deductible.
          </p>
        </div>
      </section>
    </>
  );
}
