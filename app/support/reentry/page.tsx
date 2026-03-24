import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Re-Entry Services | The Mindful Group",
  description: "Re-entry support in Milwaukee. Partnerships with DA, Justice Point, and Public Defender for returning citizens.",
};

export default function ReentryPage() {
  return (
    <>
      <section className="pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-6">
          <Link href="/support" className="text-primary text-sm uppercase tracking-wider hover:text-primary-light transition-colors mb-6 inline-block">&larr; All Support Services</Link>
          <h1 className="text-4xl md:text-6xl font-heading text-text leading-tight mb-8">Re-Entry <span className="text-primary">Services</span></h1>
          <p className="text-text-light text-lg max-w-3xl">Supporting returning citizens through workforce training, court partnerships, and employment placement to reduce recidivism.</p>
        </div>
      </section>

      <section className="bg-surface py-24">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl md:text-3xl font-heading text-text mb-6">How It Works</h2>
            <div className="space-y-4 text-text-light leading-relaxed">
              <p>The Mindful Group partners with key players in Milwaukee&apos;s justice system to provide meaningful pathways for returning citizens:</p>
              <ul className="space-y-3 ml-4">
                <li className="flex items-start gap-3"><span className="text-primary shrink-0">&bull;</span>Milwaukee County District Attorney&apos;s Office</li>
                <li className="flex items-start gap-3"><span className="text-primary shrink-0">&bull;</span>Milwaukee&apos;s Justice Point Program</li>
                <li className="flex items-start gap-3"><span className="text-primary shrink-0">&bull;</span>Public Defender&apos;s Office</li>
                <li className="flex items-start gap-3"><span className="text-primary shrink-0">&bull;</span>Probation and parole officers</li>
                <li className="flex items-start gap-3"><span className="text-primary shrink-0">&bull;</span>Private attorneys</li>
              </ul>
              <p>Participation in our training programs serves as documented evidence of behavioral changes during sentencing. This creates a tangible pathway from the justice system to stable employment, directly reducing recidivism.</p>
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-text text-sm uppercase tracking-wider mb-6">The Impact</h3>
            <div className="space-y-6">
              <div className="border border-border-light p-6 bg-white rounded-lg">
                <p className="font-semibold text-primary text-xs uppercase tracking-wider mb-2">Court Documentation</p>
                <p className="text-text-light text-sm leading-relaxed">Program enrollment and participation is documented and shared with courts as evidence of proactive behavioral change.</p>
              </div>
              <div className="border border-border-light p-6 bg-white rounded-lg">
                <p className="font-semibold text-primary text-xs uppercase tracking-wider mb-2">Skills + Employment</p>
                <p className="text-text-light text-sm leading-relaxed">Participants gain real job skills and are connected to employment through our staffing partnerships.</p>
              </div>
              <div className="border border-border-light p-6 bg-white rounded-lg">
                <p className="font-semibold text-primary text-xs uppercase tracking-wider mb-2">Reduced Recidivism</p>
                <p className="text-text-light text-sm leading-relaxed">Stable employment and support services address the root causes of reoffending.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-heading text-text mb-6">Ready for a <span className="text-primary">Fresh Start?</span></h2>
          <p className="text-text-light text-lg mb-10">Contact us to learn about re-entry services — whether for yourself or someone you represent.</p>
          <Link href="/contact" className="inline-block px-8 py-4 bg-accent text-white font-semibold text-sm uppercase tracking-wider hover:bg-accent-light transition-colors rounded-md">Contact Us</Link>
        </div>
      </section>
    </>
  );
}
