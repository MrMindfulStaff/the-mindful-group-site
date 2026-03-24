import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "The Stellar Engine | The Mindful Group",
  description:
    "A mathematically designed, self-sustaining workforce development model that reverses poverty through earned revenue — not grant dependency. Built and proven in Milwaukee's 53206.",
};

const closedLoop = [
  {
    step: "01",
    title: "Recruit",
    description:
      "Participants are recruited from underserved communities, with priority given to individuals facing employment barriers.",
  },
  {
    step: "02",
    title: "Train",
    description:
      "Participants complete accelerated, industry-recognized certification programs — CNA/CBRF, Construction Pre-Apprenticeship, Phlebotomy.",
  },
  {
    step: "03",
    title: "Certify",
    description:
      "Graduates earn credentials that meet employer standards — not participation certificates, but industry-required qualifications.",
  },
  {
    step: "04",
    title: "Place",
    description:
      "The staffing arm places graduates with employer partners. This placement event generates workforce revenue.",
  },
  {
    step: "05",
    title: "Generate Surplus",
    description:
      "Revenue from placement and training exceeds operating costs, creating surplus. This is not profit for extraction — it is fuel for the next cycle.",
  },
  {
    step: "06",
    title: "Reinvest",
    description:
      "Surplus is allocated across supportive services, access for non-subsidized participants, program expansion, and operational reserves.",
  },
  {
    step: "07",
    title: "Scale",
    description:
      "As enrollment grows, costs per participant decrease and surplus increases — the system becomes more efficient at scale, not less.",
  },
];

const surplusAllocation = [
  {
    category: "Supportive Services",
    percentage: "30%",
    description:
      "Housing assistance, transportation, childcare, and mental health support. Removes the non-training barriers that cause dropout.",
  },
  {
    category: "Non-WIOA Access",
    percentage: "20%",
    description:
      "Funds training slots for participants not eligible for government subsidies — ensuring zero-tuition extends beyond the WIOA-eligible population.",
  },
  {
    category: "Program Expansion",
    percentage: "30%",
    description:
      "Capital for new cohorts, new training tracks, and new geographies. Surplus funds the growth rather than external grants.",
  },
  {
    category: "Operational Reserves",
    percentage: "20%",
    description:
      "Financial stability buffer. Ensures the system absorbs enrollment fluctuations without collapsing or cutting services.",
  },
];

const differentiators = [
  {
    title: "Self-Funding by Design",
    description:
      "The revenue model is baked into the architecture from the start. Sustainability is not a goal — it is the mechanism.",
  },
  {
    title: "Outcomes Drive Revenue",
    description:
      "Traditional programs maximize enrollment. The Stellar Engine maximizes graduation and placement — because that is where the revenue comes from.",
  },
  {
    title: "Scale Creates Efficiency",
    description:
      "As more students move through the system, fixed costs distribute across a larger base. Unit economics improve with growth — the opposite of most nonprofits.",
  },
  {
    title: "Grants Are Leverage, Not Dependency",
    description:
      "External funding accelerates scale, not sustains operations. The system can run without grants; grants make it run faster.",
  },
  {
    title: "Designed for Replication",
    description:
      "The Stellar Engine is a blueprint, not a boutique. Every component is designed to be duplicated in new cities, new sectors, and new populations.",
  },
];

export default function StellarEnginePage() {
  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-primary text-sm uppercase tracking-[0.3em] mb-6">
            System Architecture
          </p>
          <h1 className="text-4xl md:text-6xl font-heading text-text leading-tight mb-8">
            The Stellar <span className="text-primary">Engine</span>
          </h1>
          <p className="text-text-light text-lg md:text-xl max-w-4xl leading-relaxed mb-10">
            A mathematically designed, self-sustaining workforce development
            model engineered to reverse poverty through earned revenue — not
            perpetual grant dependency. It is not a program. It is
            infrastructure.
          </p>
          <p className="text-text-light max-w-3xl leading-relaxed">
            Built on a closed-loop economic architecture where participant
            outcomes generate the revenue that funds the next cohort — creating
            a self-reinforcing cycle that grows stronger as it scales. Proven
            over 9 years in Milwaukee&apos;s 53206 zip code, one of the most
            economically distressed communities in the United States.
          </p>
        </div>
      </section>

      {/* Proof Points */}
      <section className="bg-surface py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {[
              { stat: "525+", label: "Individuals Trained" },
              { stat: "~90%", label: "Graduation Rate" },
              { stat: "~85%", label: "Job Placement Rate" },
              { stat: "$60M+", label: "Cumulative Wages Generated" },
              { stat: "9 Years", label: "Operating History" },
            ].map((m) => (
              <div
                key={m.label}
                className="border border-border-light p-6 text-center"
              >
                <p className="text-2xl md:text-3xl font-heading text-primary mb-2">
                  {m.stat}
                </p>
                <p className="text-text-light text-xs">{m.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The Problem */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-primary text-sm uppercase tracking-[0.3em] mb-6">
            The Problem
          </p>
          <h2 className="text-3xl md:text-5xl font-heading text-text leading-tight mb-12">
            Why Traditional Models <span className="text-primary">Fail</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Grant Dependency",
                description:
                  "Traditional workforce programs are grant-dependent. When funding ends, the program ends. There is no mechanism for self-renewal. Communities are left with a gap rather than infrastructure.",
              },
              {
                title: "Training Without Placement",
                description:
                  "Programs that measure success by enrollment rather than employment outcomes produce graduates without economic mobility. The Stellar Engine measures what matters: wages earned.",
              },
              {
                title: "Charity, Not Systems",
                description:
                  "The dominant approach treats poverty as an individual failure requiring charity. The Stellar Engine treats it as a system design problem requiring a better system.",
              },
            ].map((p) => (
              <div
                key={p.title}
                className="border border-border-light p-8"
              >
                <h3 className="text-xl font-heading text-text mb-4">
                  {p.title}
                </h3>
                <p className="text-text-light text-sm leading-relaxed">
                  {p.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Two Sub-Models */}
      <section className="bg-surface py-24">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-primary text-sm uppercase tracking-[0.3em] mb-6">
            Dual Configuration
          </p>
          <h2 className="text-3xl md:text-5xl font-heading text-text leading-tight mb-12">
            Two Engines. <span className="text-primary">One Architecture.</span>
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="border border-border-light p-8 md:p-12">
              <p className="text-primary text-xs uppercase tracking-[0.2em] mb-2">
                Sub-Model
              </p>
              <h3 className="text-2xl md:text-3xl font-heading text-text mb-4">
                Little Dipper
              </h3>
              <p className="text-primary/60 text-sm mb-6">
                Workforce Revenue Only
              </p>
              <p className="text-text-light leading-relaxed mb-6">
                Revenue generated from placing trained graduates with employers
                through the staffing arm. Proves the model works on placement
                revenue alone. Establishes the floor of sustainability.
              </p>
              <div className="border-t border-border-light pt-4">
                <p className="text-text-light text-xs uppercase tracking-wider">
                  Revenue Source
                </p>
                <p className="text-text text-sm mt-1">
                  Placement revenue from staffing arm
                </p>
              </div>
            </div>
            <div className="border border-border-light p-8 md:p-12">
              <p className="text-primary text-xs uppercase tracking-[0.2em] mb-2">
                Sub-Model
              </p>
              <h3 className="text-2xl md:text-3xl font-heading text-text mb-4">
                Big Dipper
              </h3>
              <p className="text-primary/60 text-sm mb-6">
                Training + Workforce Revenue
              </p>
              <p className="text-text-light leading-relaxed mb-6">
                The full-power configuration. Combines training program tuition
                or WIOA reimbursement revenue with workforce placement revenue.
                Achieves sustainability at lower enrollment thresholds and
                generates larger surplus for reinvestment.
              </p>
              <div className="border-t border-border-light pt-4">
                <p className="text-text-light text-xs uppercase tracking-wider">
                  Revenue Sources
                </p>
                <p className="text-text text-sm mt-1">
                  Training revenue + Placement revenue
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Closed-Loop Logic */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-primary text-sm uppercase tracking-[0.3em] mb-6">
            The Closed-Loop
          </p>
          <h2 className="text-3xl md:text-5xl font-heading text-text leading-tight mb-6">
            Each Step <span className="text-primary">Feeds the Next</span>
          </h2>
          <p className="text-text-light text-lg max-w-3xl mb-16">
            The system is designed as a closed loop, not a linear program. Participant outcomes generate the revenue that funds the next cohort.
          </p>

          <div className="space-y-0">
            {closedLoop.map((step, i) => (
              <div key={step.step} className="relative flex gap-8">
                {/* Vertical line + circle */}
                <div className="flex flex-col items-center shrink-0">
                  <div className="w-12 h-12 border border-primary flex items-center justify-center text-primary text-sm font-heading">
                    {step.step}
                  </div>
                  {i < closedLoop.length - 1 && (
                    <div className="w-px bg-primary/10 flex-1 min-h-8" />
                  )}
                </div>
                {/* Content */}
                <div className="pb-10">
                  <h3 className="text-xl font-heading text-text mb-2">
                    {step.title}
                  </h3>
                  <p className="text-text-light text-sm leading-relaxed max-w-2xl">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
            {/* Loop-back indicator */}
            <div className="flex gap-8">
              <div className="flex flex-col items-center shrink-0">
                <div className="w-12 h-12 border border-primary bg-primary/5 flex items-center justify-center text-primary text-lg">
                  &#x21bb;
                </div>
              </div>
              <div className="pt-2">
                <p className="text-primary text-sm uppercase tracking-wider font-heading">
                  Cycle Repeats — Each Cohort Funds the Next
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Surplus Distribution */}
      <section className="bg-surface py-24">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-primary text-sm uppercase tracking-[0.3em] mb-6">
            Reinvestment Architecture
          </p>
          <h2 className="text-3xl md:text-5xl font-heading text-text leading-tight mb-6">
            Where the <span className="text-primary">Surplus Goes</span>
          </h2>
          <p className="text-text-light text-lg max-w-3xl mb-16">
            When the system generates surplus, funds are allocated according to
            a structured reinvestment model — not extracted as profit.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {surplusAllocation.map((a) => (
              <div
                key={a.category}
                className="border border-border-light p-8 flex gap-6"
              >
                <div className="shrink-0">
                  <p className="text-3xl font-heading text-primary">
                    {a.percentage}
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-heading text-text mb-2">
                    {a.category}
                  </h3>
                  <p className="text-text-light text-sm leading-relaxed">
                    {a.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What Makes It Different */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-primary text-sm uppercase tracking-[0.3em] mb-6">
            The Difference
          </p>
          <h2 className="text-3xl md:text-5xl font-heading text-text leading-tight mb-16">
            Not a Program. <span className="text-primary">Infrastructure.</span>
          </h2>

          <div className="space-y-6">
            {differentiators.map((d) => (
              <div
                key={d.title}
                className="border border-border-light hover:border-primary/30 p-8 transition-all duration-300"
              >
                <div className="grid md:grid-cols-3 gap-6">
                  <h3 className="text-xl font-heading text-text md:col-span-1">
                    {d.title}
                  </h3>
                  <p className="text-text-light leading-relaxed md:col-span-2">
                    {d.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Replication Vision */}
      <section className="bg-surface py-24">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-primary text-sm uppercase tracking-[0.3em] mb-6">
            Replication
          </p>
          <h2 className="text-3xl md:text-5xl font-heading text-text leading-tight mb-12">
            A Blueprint, <span className="text-primary">Not a Boutique</span>
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="border border-border-light p-8 md:p-12">
              <p className="text-primary text-xs uppercase tracking-[0.2em] mb-4">
                Phase 1
              </p>
              <h3 className="text-2xl font-heading text-text mb-4">
                Anchor Site
              </h3>
              <p className="text-text-light leading-relaxed">
                The Milwaukee operation reaches full financial
                self-sufficiency, generating surplus beyond what is needed for
                local operations. This surplus becomes the seed capital for
                Phase 2.
              </p>
            </div>
            <div className="border border-border-light p-8 md:p-12">
              <p className="text-primary text-xs uppercase tracking-[0.2em] mb-4">
                Phase 2
              </p>
              <h3 className="text-2xl font-heading text-text mb-4">
                Replication
              </h3>
              <p className="text-text-light leading-relaxed">
                Each new site is seeded by the surplus of the previous site.
                The anchor funds the first satellite. The first satellite, once
                self-sustaining, funds the next. The network is
                self-financing — no external capital required to maintain the
                chain of replication once it begins.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Quote + CTA */}
      <section className="py-24">
        <div className="max-w-5xl mx-auto px-6">
          <div className="border-l-2 border-primary pl-8 md:pl-12 mb-16">
            <p className="text-2xl md:text-3xl font-heading text-text leading-relaxed mb-6">
              The Stellar Engine does not ask why people are poor. It builds a
              system that makes the conditions of poverty economically
              unsustainable.
            </p>
            <p className="text-primary text-sm uppercase tracking-[0.2em]">
              Reginald Reed Jr. — Systems Architect
            </p>
          </div>

          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-heading text-text mb-6">
              See the Engine <span className="text-primary">in Action</span>
            </h2>
            <p className="text-text-light text-lg mb-10 max-w-2xl mx-auto">
              The Mindful Group is the operating entity of the Stellar Engine.
              Explore our programs, see our outcomes, or partner with us to
              replicate the model.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/programs"
                className="px-8 py-4 bg-accent text-white font-semibold text-sm uppercase tracking-wider hover:bg-accent-light transition-colors"
              >
                Explore Programs
              </Link>
              <Link
                href="/get-involved"
                className="px-8 py-4 border border-primary text-primary text-sm uppercase tracking-wider hover:bg-primary/10 transition-colors"
              >
                Partner With Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
