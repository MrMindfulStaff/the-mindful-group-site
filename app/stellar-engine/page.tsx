import Link from "next/link";
import type { Metadata } from "next";
import StellarEngineAcceleratorWrapper from "@/components/StellarEngineAcceleratorWrapper";
import WagesTickerWrapper from "@/components/WagesTickerWrapper";
import CascadingBucketsWrapper from "@/components/CascadingBucketsWrapper";

export const metadata: Metadata = {
  title: "The Stellar Engine | The Mindful Group",
  description:
    "A mathematically designed, self-sustaining workforce development model that reverses poverty through earned revenue — not grant dependency. Built and proven in Milwaukee's 53206.",
};

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
    icon: "\u2699\uFE0F",
    description:
      "The revenue model is baked into the architecture from the start. Sustainability is not a goal — it is the mechanism.",
  },
  {
    title: "Outcomes Drive Revenue",
    icon: "\uD83C\uDFAF",
    description:
      "Traditional programs maximize enrollment. The Stellar Engine maximizes graduation and placement — because that is where the revenue comes from.",
  },
  {
    title: "Scale Creates Efficiency",
    icon: "\uD83D\uDCCA",
    description:
      "As more students move through the system, fixed costs distribute across a larger base. Unit economics improve with growth — the opposite of most nonprofits.",
  },
  {
    title: "Grants Are Leverage, Not Dependency",
    icon: "\uD83D\uDD27",
    description:
      "External funding accelerates scale, not sustains operations. The system can run without grants; grants make it run faster.",
  },
  {
    title: "Designed for Replication",
    icon: "\uD83C\uDF10",
    description:
      "The Stellar Engine is a blueprint, not a boutique. Every component is designed to be duplicated in new cities, new sectors, and new populations.",
  },
];

export default function StellarEnginePage() {
  return (
    <>
      {/* ============================================================
          HERO — Full-viewport 3D Accelerator
          ============================================================ */}
      <section className="relative">
        <StellarEngineAcceleratorWrapper height="100vh" />
      </section>

      {/* ============================================================
          Proof Points — dark theme continuation
          ============================================================ */}
      <section className="relative bg-[#0a0d14] py-16 border-t border-[rgba(180,140,100,0.12)]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { stat: "525+", label: "Individuals Trained" },
              { stat: "~90%", label: "Graduation Rate" },
              { stat: "~85%", label: "Job Placement Rate" },
              { stat: null, label: "Cumulative Wages", isTicker: true },
              { stat: "9 Years", label: "Operating History" },
            ].map((m) => (
              <div
                key={m.label}
                className="rounded-lg p-6 text-center transition-all duration-300 hover:bg-[rgba(201,165,122,0.05)]"
                style={{
                  background: "rgba(10,13,20,0.8)",
                  border: "1px solid rgba(180,140,100,0.12)",
                }}
              >
                <p className="text-2xl md:text-3xl font-heading mb-1 tabular-nums" style={{ color: "#c9a57a" }}>
                  {"isTicker" in m && m.isTicker ? <WagesTickerWrapper /> : m.stat}
                </p>
                <p className="text-xs" style={{ color: "#8a94a4" }}>{m.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          The Problem — dark theme
          ============================================================ */}
      <section className="bg-[#0a0d14] py-20">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-[10px] uppercase tracking-[0.35em] font-medium mb-6" style={{ color: "#c9a57a" }}>
            The Problem
          </p>
          <h2 className="text-3xl md:text-5xl font-heading leading-tight mb-12" style={{ color: "#e8ecf2" }}>
            Why Traditional Models{" "}
            <span style={{ color: "#c9a57a" }}>Fail</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: "Grant Dependency",
                icon: "\uD83D\uDCB0",
                description:
                  "Traditional workforce programs are grant-dependent. When funding ends, the program ends. There is no mechanism for self-renewal.",
              },
              {
                title: "Training Without Placement",
                icon: "\uD83D\uDCCB",
                description:
                  "Programs that measure success by enrollment rather than employment outcomes produce graduates without economic mobility.",
              },
              {
                title: "Charity, Not Systems",
                icon: "\uD83D\uDD27",
                description:
                  "The dominant approach treats poverty as an individual failure requiring charity. The Stellar Engine treats it as a system design problem.",
              },
            ].map((p) => (
              <div
                key={p.title}
                className="rounded-lg p-8 transition-all duration-300 hover:border-[rgba(201,165,122,0.3)]"
                style={{
                  background: "rgba(26,31,40,0.6)",
                  border: "1px solid rgba(180,140,100,0.12)",
                }}
              >
                <span className="text-3xl mb-4 block">{p.icon}</span>
                <h3 className="text-xl font-heading mb-3" style={{ color: "#e8ecf2" }}>
                  {p.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "#8a94a4" }}>
                  {p.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          Dual Configuration — Two Sub-Models
          ============================================================ */}
      <section className="bg-[#0a0d14] py-20 border-t border-[rgba(180,140,100,0.08)]">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-[10px] uppercase tracking-[0.35em] font-medium mb-6" style={{ color: "#c0cad8" }}>
            Dual Configuration
          </p>
          <h2 className="text-3xl md:text-5xl font-heading leading-tight mb-12" style={{ color: "#e8ecf2" }}>
            Two Engines.{" "}
            <span style={{ color: "#c9a57a" }}>One Architecture.</span>
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div
              className="rounded-lg p-8 md:p-12 transition-all duration-300"
              style={{
                background: "rgba(26,31,40,0.6)",
                border: "1px solid rgba(180,140,100,0.12)",
              }}
            >
              <span
                className="inline-block px-3 py-1 text-[9px] uppercase tracking-[0.3em] rounded-full mb-4 font-medium"
                style={{ background: "rgba(201,165,122,0.1)", color: "#c9a57a" }}
              >
                Sub-Model
              </span>
              <h3 className="text-2xl md:text-3xl font-heading mb-4" style={{ color: "#e8ecf2" }}>
                Little Dipper
              </h3>
              <p className="text-sm mb-6 font-medium" style={{ color: "#c9a57a" }}>
                Workforce Revenue Only
              </p>
              <p className="leading-relaxed mb-6" style={{ color: "#8a94a4" }}>
                Revenue generated from placing trained graduates with employers
                through the staffing arm. Proves the model works on placement
                revenue alone. Establishes the floor of sustainability.
              </p>
              <div className="pt-4" style={{ borderTop: "1px solid rgba(180,140,100,0.12)" }}>
                <p className="text-[9px] uppercase tracking-[0.3em] font-medium" style={{ color: "#8a94a4" }}>
                  Revenue Source
                </p>
                <p className="text-sm mt-1" style={{ color: "#c0cad8" }}>
                  Placement revenue from staffing arm
                </p>
              </div>
            </div>
            <div
              className="rounded-lg p-8 md:p-12 relative overflow-hidden transition-all duration-300"
              style={{
                background: "rgba(26,31,40,0.6)",
                border: "2px solid rgba(201,165,122,0.25)",
              }}
            >
              <div className="absolute top-0 right-0 w-32 h-32 rounded-bl-full" style={{ background: "rgba(201,165,122,0.05)" }} />
              <span
                className="inline-block px-3 py-1 text-[9px] uppercase tracking-[0.3em] rounded-full mb-4 font-medium relative z-10"
                style={{ background: "rgba(201,165,122,0.1)", color: "#c9a57a" }}
              >
                Sub-Model
              </span>
              <h3 className="text-2xl md:text-3xl font-heading mb-4 relative z-10" style={{ color: "#e8ecf2" }}>
                Big Dipper
              </h3>
              <p className="text-sm mb-6 font-medium relative z-10" style={{ color: "#c9a57a" }}>
                Training + Workforce Revenue
              </p>
              <p className="leading-relaxed mb-6 relative z-10" style={{ color: "#8a94a4" }}>
                The full-power configuration. Combines training program tuition
                or WIOA reimbursement revenue with workforce placement revenue.
                Achieves sustainability at lower enrollment thresholds.
              </p>
              <div className="pt-4 relative z-10" style={{ borderTop: "1px solid rgba(180,140,100,0.12)" }}>
                <p className="text-[9px] uppercase tracking-[0.3em] font-medium" style={{ color: "#8a94a4" }}>
                  Revenue Sources
                </p>
                <p className="text-sm mt-1" style={{ color: "#c0cad8" }}>
                  Training revenue + Placement revenue
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          Surplus Distribution — Cascading Buckets
          ============================================================ */}
      <section className="bg-[#0a0d14] py-20 border-t border-[rgba(180,140,100,0.08)]">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-[10px] uppercase tracking-[0.35em] font-medium mb-6" style={{ color: "#c9a57a" }}>
            Reinvestment Architecture
          </p>
          <h2 className="text-3xl md:text-5xl font-heading leading-tight mb-6" style={{ color: "#e8ecf2" }}>
            Where the{" "}
            <span style={{ color: "#c9a57a" }}>Surplus Goes</span>
          </h2>
          <p className="text-lg max-w-3xl mb-12" style={{ color: "#8a94a4" }}>
            When the system generates surplus, funds are allocated according to
            a structured reinvestment model — not extracted as profit.
          </p>

          <div className="mb-12">
            <CascadingBucketsWrapper />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {surplusAllocation.map((a) => (
              <div
                key={a.category}
                className="rounded-lg p-8 flex gap-6 transition-all duration-300 hover:border-[rgba(201,165,122,0.3)]"
                style={{
                  background: "rgba(26,31,40,0.6)",
                  border: "1px solid rgba(180,140,100,0.12)",
                }}
              >
                <div className="shrink-0 flex flex-col items-center">
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center font-heading text-lg"
                    style={{
                      background: "rgba(201,165,122,0.15)",
                      color: "#c9a57a",
                      border: "1px solid rgba(201,165,122,0.25)",
                    }}
                  >
                    {a.percentage}
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-heading mb-2" style={{ color: "#e8ecf2" }}>
                    {a.category}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: "#8a94a4" }}>
                    {a.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          What Makes It Different
          ============================================================ */}
      <section className="bg-[#0a0d14] py-20 border-t border-[rgba(180,140,100,0.08)]">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-[10px] uppercase tracking-[0.35em] font-medium mb-6" style={{ color: "#c0cad8" }}>
            The Difference
          </p>
          <h2 className="text-3xl md:text-5xl font-heading leading-tight mb-16" style={{ color: "#e8ecf2" }}>
            Not a Program.{" "}
            <span style={{ color: "#c9a57a" }}>Infrastructure.</span>
          </h2>

          <div className="space-y-4">
            {differentiators.map((d) => (
              <div
                key={d.title}
                className="rounded-lg p-8 transition-all duration-300 hover:border-[rgba(201,165,122,0.3)]"
                style={{
                  background: "rgba(26,31,40,0.6)",
                  border: "1px solid rgba(180,140,100,0.12)",
                }}
              >
                <div className="grid md:grid-cols-3 gap-6 items-center">
                  <div className="flex items-center gap-3 md:col-span-1">
                    <span className="text-2xl">{d.icon}</span>
                    <h3 className="text-xl font-heading" style={{ color: "#e8ecf2" }}>
                      {d.title}
                    </h3>
                  </div>
                  <p className="leading-relaxed md:col-span-2" style={{ color: "#8a94a4" }}>
                    {d.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          Replication Vision
          ============================================================ */}
      <section className="bg-[#0a0d14] py-20 border-t border-[rgba(180,140,100,0.08)]">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-[10px] uppercase tracking-[0.35em] font-medium mb-6" style={{ color: "#c9a57a" }}>
            Replication
          </p>
          <h2 className="text-3xl md:text-5xl font-heading leading-tight mb-12" style={{ color: "#e8ecf2" }}>
            A Blueprint,{" "}
            <span style={{ color: "#c9a57a" }}>Not a Boutique</span>
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div
              className="rounded-lg p-8 md:p-12"
              style={{
                background: "rgba(26,31,40,0.6)",
                border: "1px solid rgba(180,140,100,0.12)",
              }}
            >
              <span
                className="inline-block px-3 py-1 text-[9px] uppercase tracking-[0.3em] rounded-full mb-4 font-medium"
                style={{ background: "rgba(201,165,122,0.1)", color: "#c9a57a" }}
              >
                Phase 1
              </span>
              <h3 className="text-2xl font-heading mb-4" style={{ color: "#e8ecf2" }}>
                Anchor Site
              </h3>
              <p className="leading-relaxed" style={{ color: "#8a94a4" }}>
                The Milwaukee operation reaches full financial
                self-sufficiency, generating surplus beyond what is needed for
                local operations. This surplus becomes the seed capital for
                Phase 2.
              </p>
            </div>
            <div
              className="rounded-lg p-8 md:p-12 relative overflow-hidden"
              style={{
                background: "rgba(26,31,40,0.6)",
                border: "2px solid rgba(201,165,122,0.25)",
              }}
            >
              <div className="absolute top-0 right-0 w-40 h-40 rounded-bl-full" style={{ background: "rgba(201,165,122,0.05)" }} />
              <span
                className="inline-block px-3 py-1 text-[9px] uppercase tracking-[0.3em] rounded-full mb-4 font-medium relative z-10"
                style={{ background: "rgba(201,165,122,0.1)", color: "#c9a57a" }}
              >
                Phase 2
              </span>
              <h3 className="text-2xl font-heading mb-4 relative z-10" style={{ color: "#e8ecf2" }}>
                Replication
              </h3>
              <p className="leading-relaxed relative z-10" style={{ color: "#8a94a4" }}>
                Each new site is seeded by the surplus of the previous site.
                The anchor funds the first satellite. The first satellite, once
                self-sustaining, funds the next. The network is
                self-financing.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          Quote + CTA — dark accelerator aesthetic
          ============================================================ */}
      <section
        className="py-20"
        style={{
          background: "linear-gradient(to bottom, #0a0d14 0%, #1a1f28 50%, #0a0d14 100%)",
          borderTop: "1px solid rgba(180,140,100,0.12)",
        }}
      >
        <div className="max-w-5xl mx-auto px-6">
          <div className="mb-16 pl-8 md:pl-12" style={{ borderLeft: "4px solid #c9a57a" }}>
            <p className="text-xl md:text-3xl font-heading leading-relaxed mb-6" style={{ color: "#e8ecf2" }}>
              The Stellar Engine does not ask why people are poor. It builds a
              system that makes the conditions of poverty economically
              unsustainable.
            </p>
            <p className="text-[10px] uppercase tracking-[0.3em] font-medium" style={{ color: "#c9a57a" }}>
              <a
                href="https://reginald-reed-site.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                Reginald Reed Jr.
              </a>{" "}
              — Systems Architect
            </p>
          </div>

          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-heading mb-6" style={{ color: "#e8ecf2" }}>
              See the Engine{" "}
              <span style={{ color: "#c9a57a" }}>in Action</span>
            </h2>
            <p className="text-lg mb-10 max-w-2xl mx-auto" style={{ color: "#8a94a4" }}>
              The Mindful Group is the operating entity of the Stellar Engine.
              Explore our programs, see our outcomes, or partner with us to
              replicate the model.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/programs"
                className="px-8 py-4 font-semibold text-sm uppercase tracking-wider transition-colors rounded-md"
                style={{
                  background: "#c9a57a",
                  color: "#0a0d14",
                }}
              >
                Explore Programs
              </Link>
              <Link
                href="/get-involved"
                className="px-8 py-4 text-sm uppercase tracking-wider transition-colors rounded-md"
                style={{
                  border: "1px solid rgba(201,165,122,0.3)",
                  color: "#c9a57a",
                }}
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
