"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import AnimatedSection, {
  StaggerContainer,
  StaggerItem,
} from "@/components/AnimatedSection";
import AnimatedCounter from "@/components/AnimatedCounter";

const metrics = [
  { value: 525, suffix: "+", label: "People Trained" },
  { value: 90, suffix: "%", label: "Graduation Rate" },
  { value: 85, suffix: "%", label: "Job Placement" },
  { value: 0, suffix: "", label: "Tuition Charged" },
];

const programs = [
  {
    title: "CNA/CBRF Training",
    description:
      "State-certified nursing assistant and community-based residential facility training. Launch a healthcare career with zero tuition.",
    href: "/programs/cna-cbrf",
    duration: "Training Program",
    tag: "Healthcare",
  },
  {
    title: "Construction Training",
    description:
      "9-week building trades program featuring 5 weeks of hands-on remodeling training. Learn real skills on real job sites.",
    href: "/programs/construction",
    duration: "9 Weeks",
    tag: "Trades",
  },
  {
    title: "Career Development",
    description:
      "Resume building, interview techniques, and networking strategies to prepare you for career success.",
    href: "/programs/career-development",
    duration: "Ongoing",
    tag: "Career",
  },
];

const supportServices = [
  {
    title: "Child Care",
    description:
      "Vouchers covering first month of childcare for up to 2 children when graduates lose state benefits after employment.",
    href: "/support/childcare",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342" />
      </svg>
    ),
  },
  {
    title: "Transportation",
    description:
      "Bus passes, Uber/Lyft rides, group pick-up, and driver's education for students maintaining 90%+ attendance.",
    href: "/support/transportation",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
      </svg>
    ),
  },
  {
    title: "Housing",
    description:
      "Emergency shelter, rooming houses, family housing partnerships, and a rent-to-own homeownership pathway.",
    href: "/support/housing",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
      </svg>
    ),
  },
  {
    title: "Re-Entry",
    description:
      "Partnerships with the DA, Justice Point, and Public Defender to support returning citizens through training and employment.",
    href: "/support/reentry",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
      </svg>
    ),
  },
];

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="relative min-h-screen flex items-center pt-20">
        {/* Background grid */}
        <div className="absolute inset-0 opacity-[0.03]">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(rgba(200,163,95,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(200,163,95,0.3) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 py-24 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-gold text-sm uppercase tracking-[0.3em] mb-6"
            >
              Milwaukee&apos;s Workforce Training Nonprofit
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="text-5xl md:text-6xl lg:text-7xl font-heading text-ivory leading-tight mb-8"
            >
              Community First.
              <br />
              <span className="text-gold">Opportunity Always.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.6 }}
              className="text-silver text-lg md:text-xl leading-relaxed mb-10 max-w-xl"
            >
              Zero-tuition career training with wraparound support — child care,
              transportation, housing, and employment placement. We don&apos;t
              just train people. We build futures.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <a
                href="https://www.themindfulgroupinc.org/book-online"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 bg-gold text-obsidian font-semibold text-sm uppercase tracking-wider hover:bg-gold-light transition-colors text-center"
              >
                Enroll in a Program
              </a>
              <Link
                href="/get-involved"
                className="px-8 py-4 border border-gold/40 text-gold text-sm uppercase tracking-wider hover:bg-gold/10 transition-colors text-center"
              >
                Partner With Us
              </Link>
            </motion.div>
          </div>

          {/* Metrics Panel */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 1.0 }}
          >
            <div className="grid grid-cols-2 gap-6">
              {metrics.map((m, i) => (
                <div
                  key={i}
                  className="border border-gold/10 p-6 hover:border-gold/30 transition-all duration-300 group"
                >
                  <p className="text-3xl md:text-4xl font-heading text-gold mb-2 group-hover:scale-105 transition-transform">
                    <AnimatedCounter
                      value={m.value}
                      suffix={m.suffix}
                    />
                  </p>
                  <p className="text-silver text-sm">{m.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Programs */}
      <section className="bg-obsidian-light py-24">
        <div className="max-w-7xl mx-auto px-6">
          <AnimatedSection>
            <p className="text-gold text-sm uppercase tracking-[0.3em] mb-6">
              Training Programs
            </p>
            <h2 className="text-3xl md:text-5xl font-heading text-ivory leading-tight mb-6">
              Your Career <span className="text-gold">Starts Here</span>
            </h2>
            <p className="text-silver text-lg max-w-3xl mb-16">
              Industry-recognized training programs with zero tuition, hands-on
              experience, and direct employment pipelines. Every program
              includes full wraparound support.
            </p>
          </AnimatedSection>

          <StaggerContainer className="grid md:grid-cols-3 gap-8">
            {programs.map((p) => (
              <StaggerItem key={p.title}>
                <Link href={p.href} className="block h-full">
                  <div className="border border-gold/10 hover:border-gold/30 p-8 transition-all duration-300 h-full group">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-[10px] uppercase tracking-[0.2em] border border-gold/20 text-gold/60 px-2 py-0.5">
                        {p.tag}
                      </span>
                      <span className="text-silver/50 text-xs">{p.duration}</span>
                    </div>
                    <h3 className="text-xl font-heading text-ivory group-hover:text-gold transition-colors mb-3">
                      {p.title}
                    </h3>
                    <p className="text-silver text-sm leading-relaxed mb-4">
                      {p.description}
                    </p>
                    <span className="text-gold text-sm uppercase tracking-wider group-hover:text-gold-light transition-colors">
                      Learn More &rarr;
                    </span>
                  </div>
                </Link>
              </StaggerItem>
            ))}
          </StaggerContainer>

          <AnimatedSection delay={0.3} className="text-center mt-12">
            <Link
              href="/programs"
              className="inline-block px-8 py-4 border border-gold/40 text-gold text-sm uppercase tracking-wider hover:bg-gold/10 transition-colors"
            >
              View All Programs
            </Link>
          </AnimatedSection>
        </div>
      </section>

      {/* Support Services */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <AnimatedSection>
            <p className="text-gold text-sm uppercase tracking-[0.3em] mb-6">
              Wraparound Support
            </p>
            <h2 className="text-3xl md:text-5xl font-heading text-ivory leading-tight mb-6">
              We Remove <span className="text-gold">Every Barrier</span>
            </h2>
            <p className="text-silver text-lg max-w-3xl mb-16">
              Training is only part of the equation. We provide child care,
              transportation, housing, and re-entry support so nothing stands
              between you and your career.
            </p>
          </AnimatedSection>

          <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {supportServices.map((s) => (
              <StaggerItem key={s.title}>
                <Link href={s.href} className="block h-full">
                  <div className="border border-gold/10 hover:border-gold/30 p-8 transition-all duration-300 h-full group">
                    <div className="text-gold mb-4">{s.icon}</div>
                    <h3 className="text-lg font-heading text-ivory group-hover:text-gold transition-colors mb-3">
                      {s.title}
                    </h3>
                    <p className="text-silver text-sm leading-relaxed">
                      {s.description}
                    </p>
                  </div>
                </Link>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Impact / Quote */}
      <section className="bg-obsidian-light py-24">
        <div className="max-w-5xl mx-auto px-6">
          <AnimatedSection>
            <div className="border-l-2 border-gold pl-8 md:pl-12">
              <p className="text-2xl md:text-3xl font-heading text-ivory leading-relaxed mb-6">
                We don&apos;t just build programs — we build people. Every
                student who walks through our doors leaves with more than a
                certificate. They leave with a career, a support system, and
                the confidence to build a life.
              </p>
              <p className="text-gold text-sm uppercase tracking-[0.2em]">
                Reginald Reed Jr. — Founder &amp; Executive Director
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Dual CTA */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-8">
            <AnimatedSection direction="left">
              <div className="border border-gold/10 hover:border-gold/30 p-8 md:p-12 transition-all duration-300 h-full">
                <p className="text-gold text-sm uppercase tracking-[0.3em] mb-4">
                  For Students
                </p>
                <h3 className="text-2xl md:text-3xl font-heading text-ivory mb-4">
                  Ready to Start Your Career?
                </h3>
                <p className="text-silver text-sm leading-relaxed mb-8">
                  Attend an orientation session to learn about our programs, meet
                  our team, and begin your journey. No tuition. No prerequisites.
                  Just show up ready to change your life.
                </p>
                <a
                  href="https://www.themindfulgroupinc.org/book-online"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-8 py-4 bg-gold text-obsidian font-semibold text-sm uppercase tracking-wider hover:bg-gold-light transition-colors"
                >
                  Book an Orientation
                </a>
              </div>
            </AnimatedSection>

            <AnimatedSection direction="right">
              <div className="border border-gold/10 hover:border-gold/30 p-8 md:p-12 transition-all duration-300 h-full">
                <p className="text-gold text-sm uppercase tracking-[0.3em] mb-4">
                  For Partners &amp; Funders
                </p>
                <h3 className="text-2xl md:text-3xl font-heading text-ivory mb-4">
                  Invest in What Works
                </h3>
                <p className="text-silver text-sm leading-relaxed mb-8">
                  525+ trained, 90% graduation rate, 85% job placement —
                  with zero tuition charged to students. Your investment creates
                  direct, measurable impact in Milwaukee&apos;s most underserved
                  communities.
                </p>
                <Link
                  href="/get-involved"
                  className="inline-block px-8 py-4 border border-gold/40 text-gold text-sm uppercase tracking-wider hover:bg-gold/10 transition-colors"
                >
                  Get Involved
                </Link>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>
    </>
  );
}
