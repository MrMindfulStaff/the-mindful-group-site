import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Child Care Assistance | The Mindful Group",
  description: "Child care voucher program for Mindful Group graduates. First month coverage for up to 2 children when employment begins.",
};

export default function ChildcarePage() {
  return (
    <>
      <section className="pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-6">
          <Link href="/support" className="text-gold text-sm uppercase tracking-wider hover:text-gold-light transition-colors mb-6 inline-block">&larr; All Support Services</Link>
          <h1 className="text-4xl md:text-6xl font-heading text-ivory leading-tight mb-8">Child Care <span className="text-gold">Assistance</span></h1>
          <p className="text-silver text-lg max-w-3xl">The Mindful Way Child Care Assistance Program bridges the gap when new employment causes loss of state childcare benefits.</p>
        </div>
      </section>

      <section className="bg-obsidian-light py-24">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl md:text-3xl font-heading text-ivory mb-6">How It Works</h2>
            <div className="space-y-4 text-silver leading-relaxed">
              <p>When our graduates secure employment, they often lose state-funded childcare benefits due to increased income. This creates a critical gap — they have a job but can&apos;t afford childcare during the transition period.</p>
              <p>The Mindful Group provides a voucher covering the first month of childcare costs for up to 2 children. This bridge period allows graduates to establish themselves in their new position while transitioning to self-funded childcare arrangements.</p>
              <p>The program ensures that the success of getting a job doesn&apos;t become a new barrier to keeping it.</p>
            </div>
          </div>
          <div>
            <h3 className="text-ivory text-sm uppercase tracking-wider mb-6">Program Details</h3>
            <div className="space-y-4">
              {[
                { label: "Coverage", value: "First month of childcare" },
                { label: "Children", value: "Up to 2 children" },
                { label: "Eligibility", value: "Program graduates" },
                { label: "Trigger", value: "Loss of state benefits after employment" },
                { label: "Cost", value: "Free to participants" },
              ].map((d) => (
                <div key={d.label} className="flex justify-between border-b border-gold/10 pb-3">
                  <span className="text-silver text-sm">{d.label}</span>
                  <span className="text-ivory text-sm">{d.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-heading text-ivory mb-6">Need Child Care <span className="text-gold">Help?</span></h2>
          <p className="text-silver text-lg mb-10">Contact us to discuss your situation and learn about eligibility.</p>
          <Link href="/contact" className="inline-block px-8 py-4 bg-gold text-obsidian font-semibold text-sm uppercase tracking-wider hover:bg-gold-light transition-colors">Contact Us</Link>
        </div>
      </section>
    </>
  );
}
