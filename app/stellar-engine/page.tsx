import Link from "next/link";
import type { Metadata } from "next";
import EngineRingWrapper from "@/components/EngineRingWrapper";

export const metadata: Metadata = {
  title: "The Stellar Engine | The Mindful Group",
  description:
    "A mathematically designed, self-sustaining workforce development model that reverses poverty through earned revenue — not grant dependency. Built and proven in Milwaukee's 53206.",
};

const closedLoop = [
  {
    step: "01",
    title: "Recruit",
    icon: "👥",
    color: "from-primary to-primary-light",
    description:
      "Participants are recruited from underserved communities, with priority given to individuals facing employment barriers — returning citizens, single parents, and chronically unemployed residents.",
  },
  {
    step: "02",
    title: "Train",
    icon: "📚",
    color: "from-primary-light to-teal-500",
    description:
      "Participants complete accelerated, industry-recognized certification programs — CNA/CBRF, Construction Pre-Apprenticeship, Phlebotomy — with wraparound support removing every barrier.",
  },
  {
    step: "03",
    title: "Certify",
    icon: "🎓",
    color: "from-teal-500 to-accent",
    description:
      "Graduates earn credentials that meet employer standards — not participation certificates, but industry-required qualifications that open career doors immediately.",
  },
  {
    step: "04",
    title: "Place",
    icon: "🤝",
    color: "from-accent to-orange-500",
    description:
      "The staffing arm places graduates with employer partners. This placement event generates workforce revenue — the fuel that powers the entire engine.",
  },
  {
    step: "05",
    title: "Generate Surplus",
    icon: "📈",
    color: "from-orange-500 to-secondary",
    description:
      "Revenue from placement and training exceeds operating costs, creating surplus. This is not profit for extraction — it is fuel for the next cycle.",
  },
  {
    step: "06",
    title: "Reinvest",
    icon: "🔄",
    color: "from-secondary to-secondary-light",
    description:
      "Surplus is allocated: 30% supportive services, 20% non-WIOA participant access, 30% program expansion, and 20% operational reserves.",
  },
  {
    step: "07",
    title: "Scale",
    icon: "🚀",
    color: "from-secondary-light to-primary",
    description:
      "As enrollment grows, costs per participant decrease and surplus increases — the system becomes more efficient at scale, not less. Then the loop repeats.",
  },
];

const surplusAllocation = [
  {
    category: "Supportive Services",
    percentage: "30%",
    color: "bg-primary",
    description:
      "Housing assistance, transportation, childcare, and mental health support. Removes the non-training barriers that cause dropout.",
  },
  {
    category: "Non-WIOA Access",
    percentage: "20%",
    color: "bg-primary-light",
    description:
      "Funds training slots for participants not eligible for government subsidies — ensuring zero-tuition extends beyond the WIOA-eligible population.",
  },
  {
    category: "Program Expansion",
    percentage: "30%",
    color: "bg-accent",
    description:
      "Capital for new cohorts, new training tracks, and new geographies. Surplus funds the growth rather than external grants.",
  },
  {
    category: "Operational Reserves",
    percentage: "20%",
    color: "bg-secondary",
    description:
      "Financial stability buffer. Ensures the system absorbs enrollment fluctuations without collapsing or cutting services.",
  },
];

const differentiators = [
  {
    title: "Self-Funding by Design",
    icon: "⚙️",
    description:
      "The revenue model is baked into the architecture from the start. Sustainability is not a goal — it is the mechanism.",
  },
  {
    title: "Outcomes Drive Revenue",
    icon: "🎯",
    description:
      "Traditional programs maximize enrollment. The Stellar Engine maximizes graduation and placement — because that is where the revenue comes from.",
  },
  {
    title: "Scale Creates Efficiency",
    icon: "📊",
    description:
      "As more students move through the system, fixed costs distribute across a larger base. Unit economics improve with growth — the opposite of most nonprofits.",
  },
  {
    title: "Grants Are Leverage, Not Dependency",
    icon: "🔧",
    description:
      "External funding accelerates scale, not sustains operations. The system can run without grants; grants make it run faster.",
  },
  {
    title: "Designed for Replication",
    icon: "🌐",
    description:
      "The Stellar Engine is a blueprint, not a boutique. Every component is designed to be duplicated in new cities, new sectors, and new populations.",
  },
];

export default function StellarEnginePage() {
  return (
    <>
      {/* Hero — gradient with depth */}
      <section className="relative pt-32 pb-20 bg-gradient-to-br from-secondary via-secondary to-primary overflow-hidden">
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
          backgroundSize: "40px 40px",
        }} />
        <div className="absolute inset-0 bg-gradient-to-r from-secondary/90 via-secondary/70 to-transparent z-[1]" />

        <div className="relative z-[2] max-w-7xl mx-auto px-6">
          <p className="text-primary-light text-sm uppercase tracking-[0.3em] mb-6 font-semibold">
            System Architecture
          </p>
          <h1 className="text-4xl md:text-6xl font-heading text-white leading-tight mb-8">
            The Stellar <span className="text-accent">Engine</span>
          </h1>
          <p className="text-white/70 text-lg md:text-xl max-w-3xl leading-relaxed mb-6">
            A mathematically designed, self-sustaining workforce development
            model engineered to reverse poverty through earned revenue — not
            perpetual grant dependency.
          </p>
          <p className="text-white/50 max-w-2xl leading-relaxed">
            Built on a closed-loop economic architecture where participant
            outcomes generate the revenue that funds the next cohort. Proven
            over 9 years in Milwaukee&apos;s 53206.
          </p>
        </div>
      </section>

      {/* Proof Points — elevated cards */}
      <section className="relative -mt-8 z-10 pb-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { stat: "525+", label: "Individuals Trained" },
              { stat: "~90%", label: "Graduation Rate" },
              { stat: "~85%", label: "Job Placement Rate" },
              { stat: "$60M+", label: "Cumulative Wages" },
              { stat: "9 Years", label: "Operating History" },
            ].map((m) => (
              <div
                key={m.label}
                className="bg-white rounded-lg shadow-lg border border-border-light p-6 text-center hover:shadow-xl transition-shadow"
              >
                <p className="text-2xl md:text-3xl font-heading text-primary mb-1">
                  {m.stat}
                </p>
                <p className="text-text-light text-xs">{m.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The Diagram — centerpiece */}
      <section className="py-20 bg-surface">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-accent text-sm uppercase tracking-[0.3em] mb-4 font-semibold">
              The Closed Loop
            </p>
            <h2 className="text-3xl md:text-5xl font-heading text-text leading-tight mb-4">
              Each Step <span className="text-primary">Feeds the Next</span>
            </h2>
            <p className="text-text-light text-lg max-w-2xl mx-auto">
              Participant outcomes generate the revenue that funds the next cohort — a self-reinforcing cycle that grows stronger at scale.
            </p>
          </div>
          <EngineRingWrapper />
        </div>
      </section>

      {/* The Problem */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-accent text-sm uppercase tracking-[0.3em] mb-6 font-semibold">
            The Problem
          </p>
          <h2 className="text-3xl md:text-5xl font-heading text-text leading-tight mb-12">
            Why Traditional Models <span className="text-accent">Fail</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: "Grant Dependency",
                icon: "💰",
                description:
                  "Traditional workforce programs are grant-dependent. When funding ends, the program ends. There is no mechanism for self-renewal.",
              },
              {
                title: "Training Without Placement",
                icon: "📋",
                description:
                  "Programs that measure success by enrollment rather than employment outcomes produce graduates without economic mobility.",
              },
              {
                title: "Charity, Not Systems",
                icon: "🔧",
                description:
                  "The dominant approach treats poverty as an individual failure requiring charity. The Stellar Engine treats it as a system design problem.",
              },
            ].map((p) => (
              <div
                key={p.title}
                className="bg-white rounded-lg border border-border-light p-8 shadow-sm hover:shadow-md transition-shadow"
              >
                <span className="text-3xl mb-4 block">{p.icon}</span>
                <h3 className="text-xl font-heading text-text mb-3">
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
      <section className="bg-surface py-20">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-primary text-sm uppercase tracking-[0.3em] mb-6 font-semibold">
            Dual Configuration
          </p>
          <h2 className="text-3xl md:text-5xl font-heading text-text leading-tight mb-12">
            Two Engines. <span className="text-accent">One Architecture.</span>
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg border border-border-light p-8 md:p-12 shadow-sm hover:shadow-md transition-shadow">
              <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs uppercase tracking-wider rounded-full mb-4 font-semibold">
                Sub-Model
              </span>
              <h3 className="text-2xl md:text-3xl font-heading text-text mb-4">
                Little Dipper
              </h3>
              <p className="text-accent text-sm mb-6 font-medium">
                Workforce Revenue Only
              </p>
              <p className="text-text-light leading-relaxed mb-6">
                Revenue generated from placing trained graduates with employers
                through the staffing arm. Proves the model works on placement
                revenue alone. Establishes the floor of sustainability.
              </p>
              <div className="border-t border-border-light pt-4">
                <p className="text-text-light text-xs uppercase tracking-wider font-semibold">
                  Revenue Source
                </p>
                <p className="text-text text-sm mt-1">
                  Placement revenue from staffing arm
                </p>
              </div>
            </div>
            <div className="bg-white rounded-lg border-2 border-accent/30 p-8 md:p-12 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-bl-full" />
              <span className="inline-block px-3 py-1 bg-accent/10 text-accent text-xs uppercase tracking-wider rounded-full mb-4 font-semibold relative z-10">
                Sub-Model
              </span>
              <h3 className="text-2xl md:text-3xl font-heading text-text mb-4 relative z-10">
                Big Dipper
              </h3>
              <p className="text-accent text-sm mb-6 font-medium relative z-10">
                Training + Workforce Revenue
              </p>
              <p className="text-text-light leading-relaxed mb-6 relative z-10">
                The full-power configuration. Combines training program tuition
                or WIOA reimbursement revenue with workforce placement revenue.
                Achieves sustainability at lower enrollment thresholds.
              </p>
              <div className="border-t border-border-light pt-4 relative z-10">
                <p className="text-text-light text-xs uppercase tracking-wider font-semibold">
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

      {/* Closed-Loop Steps — detailed */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-primary text-sm uppercase tracking-[0.3em] mb-6 font-semibold">
            The Process
          </p>
          <h2 className="text-3xl md:text-5xl font-heading text-text leading-tight mb-16">
            Seven Steps. <span className="text-accent">One Loop.</span>
          </h2>

          <div className="space-y-6">
            {closedLoop.map((step, i) => (
              <div key={step.step} className="bg-white rounded-lg border border-border-light p-6 md:p-8 shadow-sm hover:shadow-md transition-all hover:border-primary/30">
                <div className="flex items-start gap-6">
                  <div className={`shrink-0 w-14 h-14 rounded-lg bg-gradient-to-br ${step.color} flex items-center justify-center text-white font-heading text-lg shadow-md`}>
                    {step.step}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-heading text-text">
                        {step.title}
                      </h3>
                      <span className="text-xl">{step.icon}</span>
                    </div>
                    <p className="text-text-light leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
                {i < closedLoop.length - 1 && (
                  <div className="flex justify-center mt-4">
                    <svg width="20" height="20" viewBox="0 0 20 20" className="text-primary/30">
                      <path d="M10 4 L10 16 M6 12 L10 16 L14 12" stroke="currentColor" strokeWidth="1.5" fill="none" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
            {/* Loop-back */}
            <div className="bg-accent/5 rounded-lg border-2 border-accent/20 p-6 text-center">
              <p className="text-accent font-heading text-lg">
                ↻ Cycle Repeats — Each Cohort Funds the Next
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Surplus Distribution */}
      <section className="bg-surface py-20">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-accent text-sm uppercase tracking-[0.3em] mb-6 font-semibold">
            Reinvestment Architecture
          </p>
          <h2 className="text-3xl md:text-5xl font-heading text-text leading-tight mb-6">
            Where the <span className="text-accent">Surplus Goes</span>
          </h2>
          <p className="text-text-light text-lg max-w-3xl mb-12">
            When the system generates surplus, funds are allocated according to
            a structured reinvestment model — not extracted as profit.
          </p>

          {/* Visual bar */}
          <div className="mb-12 rounded-full overflow-hidden h-6 flex shadow-inner">
            <div className="bg-primary h-full flex items-center justify-center text-white text-xs font-semibold" style={{ width: "30%" }}>30%</div>
            <div className="bg-primary-light h-full flex items-center justify-center text-white text-xs font-semibold" style={{ width: "20%" }}>20%</div>
            <div className="bg-accent h-full flex items-center justify-center text-white text-xs font-semibold" style={{ width: "30%" }}>30%</div>
            <div className="bg-secondary h-full flex items-center justify-center text-white text-xs font-semibold" style={{ width: "20%" }}>20%</div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {surplusAllocation.map((a) => (
              <div
                key={a.category}
                className="bg-white rounded-lg border border-border-light p-8 shadow-sm flex gap-6 hover:shadow-md transition-shadow"
              >
                <div className="shrink-0 flex flex-col items-center">
                  <div className={`w-12 h-12 ${a.color} rounded-lg flex items-center justify-center text-white font-heading text-lg shadow-md`}>
                    {a.percentage}
                  </div>
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
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-primary text-sm uppercase tracking-[0.3em] mb-6 font-semibold">
            The Difference
          </p>
          <h2 className="text-3xl md:text-5xl font-heading text-text leading-tight mb-16">
            Not a Program. <span className="text-accent">Infrastructure.</span>
          </h2>

          <div className="space-y-4">
            {differentiators.map((d) => (
              <div
                key={d.title}
                className="bg-white rounded-lg border border-border-light hover:border-primary/30 p-8 shadow-sm hover:shadow-md transition-all"
              >
                <div className="grid md:grid-cols-3 gap-6 items-center">
                  <div className="flex items-center gap-3 md:col-span-1">
                    <span className="text-2xl">{d.icon}</span>
                    <h3 className="text-xl font-heading text-text">
                      {d.title}
                    </h3>
                  </div>
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
      <section className="bg-surface py-20">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-accent text-sm uppercase tracking-[0.3em] mb-6 font-semibold">
            Replication
          </p>
          <h2 className="text-3xl md:text-5xl font-heading text-text leading-tight mb-12">
            A Blueprint, <span className="text-accent">Not a Boutique</span>
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg border border-border-light p-8 md:p-12 shadow-sm">
              <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs uppercase tracking-wider rounded-full mb-4 font-semibold">
                Phase 1
              </span>
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
            <div className="bg-white rounded-lg border-2 border-accent/30 p-8 md:p-12 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-accent/5 rounded-bl-full" />
              <span className="inline-block px-3 py-1 bg-accent/10 text-accent text-xs uppercase tracking-wider rounded-full mb-4 font-semibold relative z-10">
                Phase 2
              </span>
              <h3 className="text-2xl font-heading text-text mb-4 relative z-10">
                Replication
              </h3>
              <p className="text-text-light leading-relaxed relative z-10">
                Each new site is seeded by the surplus of the previous site.
                The anchor funds the first satellite. The first satellite, once
                self-sustaining, funds the next. The network is
                self-financing.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Quote + CTA */}
      <section className="py-20 bg-gradient-to-br from-secondary via-secondary to-primary">
        <div className="max-w-5xl mx-auto px-6">
          <div className="border-l-4 border-accent pl-8 md:pl-12 mb-16">
            <p className="text-xl md:text-3xl font-heading text-white leading-relaxed mb-6">
              The Stellar Engine does not ask why people are poor. It builds a
              system that makes the conditions of poverty economically
              unsustainable.
            </p>
            <p className="text-accent text-sm uppercase tracking-[0.2em] font-semibold">
              <a href="https://reginald-reed-site.vercel.app" target="_blank" rel="noopener noreferrer" className="hover:underline">
                Reginald Reed Jr.
              </a>{" "}
              — Systems Architect
            </p>
          </div>

          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-heading text-white mb-6">
              See the Engine <span className="text-accent">in Action</span>
            </h2>
            <p className="text-white/70 text-lg mb-10 max-w-2xl mx-auto">
              The Mindful Group is the operating entity of the Stellar Engine.
              Explore our programs, see our outcomes, or partner with us to
              replicate the model.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/programs"
                className="px-8 py-4 bg-accent text-white font-semibold text-sm uppercase tracking-wider hover:bg-accent-light transition-colors rounded-md"
              >
                Explore Programs
              </Link>
              <Link
                href="/get-involved"
                className="px-8 py-4 border border-white/30 text-white text-sm uppercase tracking-wider hover:bg-white/10 transition-colors rounded-md"
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
