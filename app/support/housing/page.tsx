import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Housing Support | The Mindful Group",
  description: "Housing assistance in Milwaukee: emergency shelter, temporary housing, and rent-to-own homeownership for program graduates.",
};

export default function HousingPage() {
  return (
    <>
      <section className="pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-6">
          <Link href="/support" className="text-gold text-sm uppercase tracking-wider hover:text-gold-light transition-colors mb-6 inline-block">&larr; All Support Services</Link>
          <h1 className="text-4xl md:text-6xl font-heading text-ivory leading-tight mb-8">Housing <span className="text-gold">Support</span></h1>
          <p className="text-silver text-lg max-w-3xl">The Mindful Way Housing Support provides emergency shelter, temporary housing, and a pathway to homeownership.</p>
        </div>
      </section>

      <section className="bg-obsidian-light py-24">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl md:text-3xl font-heading text-ivory mb-6">How It Works</h2>
            <div className="space-y-4 text-silver leading-relaxed">
              <p>Stable housing is foundational to career success. We provide tiered housing support for students at different stages:</p>
              <p><strong className="text-ivory">Emergency Shelter:</strong> Through our Rescue Mission partnership, we connect students facing immediate housing crises with short-term shelter.</p>
              <p><strong className="text-ivory">Individual Housing:</strong> Rooming house placements for individuals without children who need affordable, stable housing during training.</p>
              <p><strong className="text-ivory">Family Housing:</strong> Hope Street Ministries provides affordable temporary housing for families while they complete training.</p>
              <p><strong className="text-ivory">Homeownership Pathway:</strong> The Mindful Way Homeowner Program purchases and remodels dilapidated Milwaukee homes through our construction training program, then offers them to graduates via rent-to-own arrangements.</p>
            </div>
          </div>
          <div>
            <h3 className="text-ivory text-sm uppercase tracking-wider mb-6">Housing Tiers</h3>
            <div className="space-y-6">
              {[
                { tier: "Emergency", partner: "Rescue Mission", who: "Immediate crisis", type: "Short-term shelter" },
                { tier: "Individual", partner: "Rooming Houses", who: "Individuals without children", type: "Affordable rooms" },
                { tier: "Family", partner: "Hope Street Ministries", who: "Families", type: "Temporary affordable housing" },
                { tier: "Ownership", partner: "Mindful Way Homeowner Program", who: "Graduates", type: "Rent-to-own homes" },
              ].map((t) => (
                <div key={t.tier} className="border border-gold/10 p-4">
                  <p className="text-gold text-xs uppercase tracking-wider mb-1">{t.tier}</p>
                  <p className="text-ivory text-sm font-heading mb-1">{t.partner}</p>
                  <p className="text-silver text-xs">{t.who} &middot; {t.type}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-heading text-ivory mb-6">Need Housing <span className="text-gold">Help?</span></h2>
          <p className="text-silver text-lg mb-10">Housing support is available to all active program students. Contact us to discuss your situation.</p>
          <Link href="/contact" className="inline-block px-8 py-4 bg-gold text-obsidian font-semibold text-sm uppercase tracking-wider hover:bg-gold-light transition-colors">Contact Us</Link>
        </div>
      </section>
    </>
  );
}
