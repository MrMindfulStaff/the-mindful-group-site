import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Support Services | The Mindful Group",
  description: "Wraparound support services in Milwaukee: child care, transportation, housing, and re-entry assistance for program participants.",
};

const services = [
  {
    title: "Child Care Assistance",
    description: "When graduates get jobs and lose state childcare benefits, we provide vouchers covering the first month of childcare costs for up to 2 children. This bridge support ensures new employment doesn't collapse under the weight of childcare costs.",
    href: "/support/childcare",
    how: "Voucher covers first month for up to 2 children after employment starts.",
  },
  {
    title: "Transportation Assistance",
    description: "Bus tickets and passes for students maintaining 90%+ attendance. Uber/Lyft rides when other options aren't available. Group pick-up/drop-off from Employ Milwaukee for groups of 5+. Driver's education for those who've never had a license.",
    href: "/support/transportation",
    how: "Maintain 90%+ attendance to qualify. Needs documented at intake.",
  },
  {
    title: "Housing Support",
    description: "Emergency shelter through our Rescue Mission partnership. Rooming houses for individuals. Hope Street Ministries for families needing affordable temporary housing. Graduates can access the Mindful Way Homeowner Program — rent-to-own homes remodeled by our construction students.",
    href: "/support/housing",
    how: "Available to active students. Graduates eligible for homeownership pathway.",
  },
  {
    title: "Re-Entry Services",
    description: "Partnerships with the Milwaukee County DA, Justice Point Program, Public Defender's Office, and probation/parole officers. Program participation serves as evidence of behavioral changes during sentencing, helping reduce recidivism.",
    href: "/support/reentry",
    how: "Training participation documented for courts. Goal: reduce recidivism through employment.",
  },
];

export default function SupportPage() {
  return (
    <>
      <section className="pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-gold text-sm uppercase tracking-[0.3em] mb-6">Wraparound Support</p>
          <h1 className="text-4xl md:text-6xl font-heading text-ivory leading-tight mb-8">
            We Remove <span className="text-gold">Every Barrier</span>
          </h1>
          <p className="text-silver text-lg max-w-3xl">
            Training alone isn&apos;t enough. We provide child care, transportation, housing, and re-entry support so nothing stands between our students and their careers. This is what makes The Mindful Group different.
          </p>
        </div>
      </section>

      <section className="pb-24">
        <div className="max-w-7xl mx-auto px-6 space-y-8">
          {services.map((s) => (
            <Link key={s.title} href={s.href} className="block">
              <div className="border border-gold/10 hover:border-gold/30 p-8 md:p-12 transition-all duration-300 group">
                <div className="grid md:grid-cols-3 gap-8">
                  <div className="md:col-span-2">
                    <h2 className="text-2xl md:text-3xl font-heading text-ivory group-hover:text-gold transition-colors mb-4">{s.title}</h2>
                    <p className="text-silver leading-relaxed">{s.description}</p>
                  </div>
                  <div className="md:border-l md:border-gold/10 md:pl-8">
                    <h3 className="text-ivory text-sm uppercase tracking-wider mb-3">How It Works</h3>
                    <p className="text-silver text-sm leading-relaxed">{s.how}</p>
                    <p className="text-gold text-sm uppercase tracking-wider mt-4 group-hover:text-gold-light transition-colors">Learn More &rarr;</p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-obsidian-light py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-heading text-ivory mb-6">Need <span className="text-gold">Support?</span></h2>
          <p className="text-silver text-lg mb-10">Contact us to discuss your situation. We&apos;ll work with you to find the right resources.</p>
          <Link href="/contact" className="inline-block px-8 py-4 bg-gold text-obsidian font-semibold text-sm uppercase tracking-wider hover:bg-gold-light transition-colors">Contact Us</Link>
        </div>
      </section>
    </>
  );
}
