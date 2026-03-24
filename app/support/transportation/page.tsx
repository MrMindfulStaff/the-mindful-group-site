import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Transportation Assistance | The Mindful Group",
  description: "Transportation support for Milwaukee students: bus passes, rideshare, group transport, and driver's education.",
};

export default function TransportationPage() {
  return (
    <>
      <section className="pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-6">
          <Link href="/support" className="text-primary text-sm uppercase tracking-wider hover:text-primary-light transition-colors mb-6 inline-block">&larr; All Support Services</Link>
          <h1 className="text-4xl md:text-6xl font-heading text-text leading-tight mb-8">Transportation <span className="text-primary">Assistance</span></h1>
          <p className="text-text-light text-lg max-w-3xl">The Mindful Way Transportation Assistance ensures no student misses training because they can&apos;t get there.</p>
        </div>
      </section>

      <section className="pb-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="relative aspect-[21/9] rounded-lg overflow-hidden">
            <Image src="/images/transportation.jpg" alt="Transportation assistance for students" fill className="object-cover" />
          </div>
        </div>
      </section>

      <section className="bg-surface py-24">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl md:text-3xl font-heading text-text mb-6">How It Works</h2>
            <div className="space-y-4 text-text-light leading-relaxed">
              <p>Transportation is one of the biggest barriers to workforce participation in Milwaukee. We address it head-on with multiple tiers of support:</p>
              <ul className="space-y-3 ml-4">
                <li className="flex items-start gap-3"><span className="text-primary shrink-0">&bull;</span>Bus tickets and passes for students maintaining 90%+ attendance</li>
                <li className="flex items-start gap-3"><span className="text-primary shrink-0">&bull;</span>Uber/Lyft arranged when public transit isn&apos;t available</li>
                <li className="flex items-start gap-3"><span className="text-primary shrink-0">&bull;</span>Group pick-up and drop-off from Employ Milwaukee (27th &amp; North Ave) for groups of 5+</li>
                <li className="flex items-start gap-3"><span className="text-primary shrink-0">&bull;</span>Groups under 5 receive bus tickets</li>
                <li className="flex items-start gap-3"><span className="text-primary shrink-0">&bull;</span>Driver&apos;s education offered for students who&apos;ve never had a license</li>
              </ul>
              <p>Students falling below 90% attendance become ineligible for transportation support. Needs are documented during the intake process.</p>
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-text text-sm uppercase tracking-wider mb-6">Requirements</h3>
            <div className="space-y-4">
              {[
                { label: "Attendance", value: "90%+ required" },
                { label: "Documentation", value: "Needs assessed at intake" },
                { label: "Group Transport", value: "5+ students from same area" },
                { label: "Individual", value: "Bus tickets/passes" },
                { label: "Emergency", value: "Uber/Lyft when needed" },
                { label: "Long-Term", value: "Driver's education available" },
              ].map((d) => (
                <div key={d.label} className="flex justify-between border-b border-border-light pb-3">
                  <span className="text-text-light text-sm">{d.label}</span>
                  <span className="text-text text-sm">{d.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-heading text-text mb-6">Need a <span className="text-primary">Ride?</span></h2>
          <p className="text-text-light text-lg mb-10">Transportation needs are assessed during intake. Contact us to get started.</p>
          <Link href="/contact" className="inline-block px-8 py-4 bg-accent text-white font-semibold text-sm uppercase tracking-wider hover:bg-accent-light transition-colors rounded-md">Contact Us</Link>
        </div>
      </section>
    </>
  );
}
