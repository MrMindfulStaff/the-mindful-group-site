"use client";

import Link from "next/link";
import Image from "next/image";
import { BOOKING } from "@/lib/booking";
import { motion } from "framer-motion";
import AnimatedSection, {
  StaggerContainer,
  StaggerItem,
} from "@/components/AnimatedSection";
import AnimatedCounter from "@/components/AnimatedCounter";
// 3D HomeExperience removed

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
  },
  {
    title: "Transportation",
    description:
      "Bus passes, Uber/Lyft rides, group pick-up, and driver's education for students maintaining 90%+ attendance.",
    href: "/support/transportation",
  },
  {
    title: "Housing",
    description:
      "Emergency shelter, rooming houses, family housing partnerships, and a rent-to-own homeownership pathway.",
    href: "/support/housing",
  },
  {
    title: "Re-Entry",
    description:
      "Partnerships with the DA, Justice Point, and Public Defender to support returning citizens through training and employment.",
    href: "/support/reentry",
  },
];

function FallbackHome() {
  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-12 bg-gradient-to-br from-secondary via-secondary to-primary overflow-hidden min-h-[90vh]">
        {/* 3D Scene (removed — globe experience handles this) */}
        {/* Gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-secondary/90 via-secondary/70 to-transparent z-[1]" />

        <div className="relative z-[2] max-w-7xl mx-auto px-6 py-8 md:py-12 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-white/70 text-sm uppercase tracking-[0.3em] mb-6"
            >
              Reverse Engineering Poverty
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="text-4xl md:text-5xl lg:text-6xl font-heading text-white leading-tight mb-8"
            >
              Community First.
              <br />
              <span className="text-accent">Opportunity Always.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.6 }}
              className="text-white/80 text-lg md:text-xl leading-relaxed mb-10 max-w-xl"
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
              <Link
                href={BOOKING.general}
                className="px-8 py-4 bg-accent text-white font-semibold text-sm uppercase tracking-wider hover:bg-accent-light transition-colors text-center rounded-md"
              >
                Enroll in a Program
              </Link>
              <Link
                href="/get-involved"
                className="px-8 py-4 border border-white/30 text-white text-sm uppercase tracking-wider hover:bg-white/10 transition-colors text-center rounded-md"
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
            <Link href="/stellar-engine" className="block mb-6 group">
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 hover:border-white/40 p-4 transition-all duration-300 flex items-center justify-between rounded-lg">
                <div>
                  <p className="text-accent text-xs uppercase tracking-[0.3em] mb-1">Proven Model</p>
                  <p className="text-white font-heading text-lg group-hover:text-accent transition-colors">
                    The Birthplace of the Stellar Engine
                  </p>
                </div>
                <span className="text-accent text-sm group-hover:text-accent-light transition-colors">&rarr;</span>
              </div>
            </Link>
            <div className="grid grid-cols-2 gap-4">
              {metrics.map((m, i) => (
                <div
                  key={i}
                  className="bg-white/10 backdrop-blur-sm border border-white/10 p-6 rounded-lg hover:border-white/30 transition-all duration-300 group"
                >
                  <p className="text-3xl md:text-4xl font-heading text-white mb-2 group-hover:scale-105 transition-transform">
                    <AnimatedCounter value={m.value} suffix={m.suffix} />
                  </p>
                  <p className="text-white/60 text-sm">{m.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Photo Strip */}
      <section className="bg-surface py-1">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { src: "/images/home-presenter.jpg", alt: "Instructor leading a workforce training session" },
              { src: "/images/home-construction.jpg", alt: "Construction training participants in safety gear" },
              { src: "/images/community-csr.jpg", alt: "Community engagement and outreach" },
              { src: "/images/programs-training.jpg", alt: "Adults in a professional training seminar" },
            ].map((img, i) => (
              <div key={i} className="relative aspect-[4/3] rounded-lg overflow-hidden">
                <Image src={img.src} alt={img.alt} fill className="object-cover" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Programs */}
      <section className="py-1">
        <div className="max-w-7xl mx-auto px-6">
          <AnimatedSection>
            <p className="text-primary text-sm uppercase tracking-[0.3em] mb-4 font-semibold">
              Training Programs
            </p>
            <h2 className="text-3xl md:text-5xl font-heading text-text leading-tight mb-6">
              Your Career <span className="text-primary">Starts Here</span>
            </h2>
            <p className="text-text-light text-lg max-w-3xl mb-6">
              Industry-recognized training programs with zero tuition, hands-on
              experience, and direct employment pipelines. Every program
              includes full wraparound support.
            </p>
          </AnimatedSection>

          <StaggerContainer className="grid md:grid-cols-3 gap-4">
            {programs.map((p) => (
              <StaggerItem key={p.title}>
                <Link href={p.href} className="block h-full">
                  <div className="bg-white border border-border-light hover:border-primary/30 hover:shadow-lg p-8 transition-all duration-300 h-full group rounded-lg">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-[10px] uppercase tracking-[0.2em] bg-primary/10 text-primary px-3 py-1 rounded-full font-semibold">
                        {p.tag}
                      </span>
                      <span className="text-text-light text-xs">{p.duration}</span>
                    </div>
                    <h3 className="text-xl font-heading text-text group-hover:text-primary transition-colors mb-3">
                      {p.title}
                    </h3>
                    <p className="text-text-light text-sm leading-relaxed mb-4">
                      {p.description}
                    </p>
                    <span className="text-primary text-sm uppercase tracking-wider font-semibold group-hover:text-primary-light transition-colors">
                      Learn More &rarr;
                    </span>
                  </div>
                </Link>
              </StaggerItem>
            ))}
          </StaggerContainer>

          <AnimatedSection delay={0.3} className="text-center mt-6">
            <Link
              href="/programs"
              className="inline-block px-8 py-4 border border-primary text-primary text-sm uppercase tracking-wider hover:bg-primary hover:text-white transition-colors rounded-md font-semibold"
            >
              View All Programs
            </Link>
          </AnimatedSection>
        </div>
      </section>

      {/* Support Services */}
      <section className="py-1 bg-surface">
        <div className="max-w-7xl mx-auto px-6">
          <AnimatedSection>
            <p className="text-primary text-sm uppercase tracking-[0.3em] mb-4 font-semibold">
              Wraparound Support
            </p>
            <h2 className="text-3xl md:text-5xl font-heading text-text leading-tight mb-6">
              We Remove <span className="text-primary">Every Barrier</span>
            </h2>
            <p className="text-text-light text-lg max-w-3xl mb-6">
              Training is only part of the equation. We provide child care,
              transportation, housing, and re-entry support so nothing stands
              between you and your career.
            </p>
          </AnimatedSection>

          <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {supportServices.map((s) => (
              <StaggerItem key={s.title}>
                <Link href={s.href} className="block h-full">
                  <div className="bg-white border border-border-light hover:border-primary/30 hover:shadow-lg p-8 transition-all duration-300 h-full group rounded-lg">
                    <h3 className="text-lg font-heading text-text group-hover:text-primary transition-colors mb-3">
                      {s.title}
                    </h3>
                    <p className="text-text-light text-sm leading-relaxed">
                      {s.description}
                    </p>
                  </div>
                </Link>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Testimonial Preview */}
      <section className="py-1">
        <div className="max-w-5xl mx-auto px-6">
          <AnimatedSection>
            <div className="bg-white border border-border-light rounded-xl p-8 md:p-12 shadow-sm">
              <p className="text-primary text-sm uppercase tracking-[0.3em] mb-6 font-semibold">
                From Our Students
              </p>
              <blockquote className="text-xl md:text-2xl font-heading text-text leading-relaxed mb-6">
                &ldquo;The Mindful Group trained me when no one else would take a chance.
                Zero tuition, real support, and a job waiting on the other side.
                That&apos;s not a program — that&apos;s a pipeline.&rdquo;
              </blockquote>
              <p className="text-primary font-semibold text-sm">
                Program Graduate, CNA Class of 2024
              </p>
              <div className="mt-8">
                <Link href="/testimonials" className="text-primary text-sm uppercase tracking-wider font-semibold hover:text-primary-light transition-colors">
                  Read More Stories &rarr;
                </Link>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Quote */}
      <section className="bg-primary py-1">
        <div className="max-w-5xl mx-auto px-6">
          <AnimatedSection>
            <div className="border-l-4 border-accent pl-8 md:pl-12">
              <p className="text-xl md:text-2xl font-heading text-white leading-relaxed mb-6">
                We don&apos;t just build programs — we build people. Every
                student who walks through our doors leaves with more than a
                certificate. They leave with a career, a support system, and
                the confidence to build a life.
              </p>
              <p className="text-accent text-sm uppercase tracking-[0.2em] font-semibold">
                <a href="https://reginald-reed-site.vercel.app" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">Reginald Reed Jr.</a> — Founder &amp; Executive Director
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Dual CTA */}
      <section className="py-1">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-4">
            <AnimatedSection direction="left">
              <div className="bg-white border border-border-light hover:shadow-lg p-8 md:p-12 transition-all duration-300 h-full rounded-lg">
                <p className="text-primary text-sm uppercase tracking-[0.3em] mb-4 font-semibold">
                  For Students
                </p>
                <h3 className="text-2xl md:text-3xl font-heading text-text mb-4">
                  Ready to Start Your Career?
                </h3>
                <p className="text-text-light text-sm leading-relaxed mb-8">
                  Attend an orientation session to learn about our programs, meet
                  our team, and begin your journey. No tuition. No prerequisites.
                  Just show up ready to change your life.
                </p>
                <Link
                  href={BOOKING.general}
                  className="inline-block px-8 py-4 bg-accent text-white font-semibold text-sm uppercase tracking-wider hover:bg-accent-light transition-colors rounded-md"
                >
                  Book an Orientation
                </Link>
              </div>
            </AnimatedSection>

            <AnimatedSection direction="right">
              <div className="bg-white border border-border-light hover:shadow-lg p-8 md:p-12 transition-all duration-300 h-full rounded-lg">
                <p className="text-primary text-sm uppercase tracking-[0.3em] mb-4 font-semibold">
                  For Partners &amp; Funders
                </p>
                <h3 className="text-2xl md:text-3xl font-heading text-text mb-4">
                  Invest in What Works
                </h3>
                <p className="text-text-light text-sm leading-relaxed mb-8">
                  525+ trained, 90% graduation rate, 85% job placement —
                  with zero tuition charged to students. Your investment creates
                  direct, measurable impact in Milwaukee&apos;s most underserved
                  communities.
                </p>
                <Link
                  href="/get-involved"
                  className="inline-block px-8 py-4 bg-primary text-white font-semibold text-sm uppercase tracking-wider hover:bg-primary-light transition-colors rounded-md"
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

export default function Home() {
  return <FallbackHome />;
}
