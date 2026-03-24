import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Student Stories | The Mindful Group",
  description:
    "Hear from Mindful Group graduates about how workforce training, wraparound support, and career placement changed their lives.",
};

const testimonials = [
  {
    quote:
      "Before The Mindful Group, I was stuck. No one would hire me with my background. They didn't just train me — they helped with bus passes, helped me find housing, and had a job waiting when I graduated. I went from nothing to a CNA making real money in four months.",
    name: "Marquise T.",
    program: "CNA/CBRF Training",
    year: "2024",
    outcome: "Employed as CNA within 30 days of graduation",
  },
  {
    quote:
      "I was a single mom with two kids and no childcare. Every other program told me to figure it out. The Mindful Group gave me a childcare voucher and bus tickets so I could actually show up to class. I graduated top of my class.",
    name: "Jasmine R.",
    program: "CNA/CBRF Training",
    year: "2023",
    outcome: "Working full-time, transitioned to permanent childcare",
  },
  {
    quote:
      "The construction program changed everything. I learned how to actually build something with my hands. Now I'm working on real job sites and they're talking about me getting into the apprenticeship program. Zero tuition. Zero excuses.",
    name: "DeAndre W.",
    program: "Construction Training",
    year: "2024",
    outcome: "Employed in construction, pursuing apprenticeship",
  },
  {
    quote:
      "I came to The Mindful Group through my parole officer. I thought it was just another program. But they actually placed me in a job. My PO used my participation to show the judge I was making changes. That mattered more than anything on paper.",
    name: "Marcus L.",
    program: "Re-Entry Services + CNA Training",
    year: "2023",
    outcome: "Employed, successfully completed parole",
  },
  {
    quote:
      "I didn't even know what a resume was supposed to look like. The career development sessions taught me how to talk about my experience, how to interview, how to present myself. I got three callbacks after my first week of applying.",
    name: "Tanya M.",
    program: "Career Development",
    year: "2024",
    outcome: "Secured employment after career coaching",
  },
  {
    quote:
      "The mental health counseling was the part nobody talks about, but it's what kept me going. Training is stressful. Life is stressful. Having someone to talk to — confidentially, for free — that's the difference between finishing and dropping out.",
    name: "Keisha B.",
    program: "CNA Training + Mental Health Counseling",
    year: "2023",
    outcome: "Graduated CNA program, working in healthcare",
  },
  {
    quote:
      "I was sleeping on my cousin's couch when I started. They connected me with housing through Hope Street, got me bus passes, and I finished the construction program. Now I have my own place. I'm helping remodel houses for other people like me.",
    name: "Jerome H.",
    program: "Construction Training + Housing Support",
    year: "2024",
    outcome: "Employed in construction, stable housing secured",
  },
  {
    quote:
      "What makes this place different is they don't stop caring after you graduate. They placed me through staffing, checked in on me, made sure I was good. That's not a program — that's a family.",
    name: "Alicia G.",
    program: "CNA/CBRF Training",
    year: "2024",
    outcome: "Employed through Mindful Staffing, 6+ months retained",
  },
];

const impactStats = [
  { stat: "525+", label: "People Trained" },
  { stat: "~90%", label: "Graduation Rate" },
  { stat: "~85%", label: "Job Placement" },
  { stat: "$0", label: "Tuition Charged" },
];

export default function TestimonialsPage() {
  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-secondary via-secondary to-primary">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-white/70 text-sm uppercase tracking-[0.3em] mb-6 font-semibold">
            Student Stories
          </p>
          <h1 className="text-4xl md:text-6xl font-heading text-white leading-tight mb-8">
            Real People. <span className="text-accent">Real Results.</span>
          </h1>
          <p className="text-white/80 text-lg max-w-3xl">
            Behind every statistic is a person who showed up, put in the work,
            and built a new life. These are their stories.
          </p>
        </div>
      </section>

      {/* Impact Stats Bar */}
      <section className="bg-white border-b border-border-light py-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {impactStats.map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-2xl md:text-3xl font-heading text-primary">
                  {s.stat}
                </p>
                <p className="text-text-light text-sm">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Grid */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map((t, i) => (
              <div
                key={i}
                className="bg-white border border-border-light hover:border-primary/30 hover:shadow-lg p-8 transition-all duration-300 rounded-lg"
              >
                <div className="flex items-center gap-3 mb-6">
                  {/* Avatar placeholder */}
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-primary font-heading text-lg">
                      {t.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="text-text font-semibold text-sm">{t.name}</p>
                    <p className="text-text-light text-xs">
                      {t.program} &middot; {t.year}
                    </p>
                  </div>
                </div>

                <blockquote className="text-text leading-relaxed mb-6">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>

                <div className="pt-4 border-t border-border-light">
                  <p className="text-primary text-xs uppercase tracking-wider font-semibold">
                    Outcome
                  </p>
                  <p className="text-text-light text-sm mt-1">{t.outcome}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Share Your Story CTA */}
      <section className="bg-surface py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-heading text-text mb-6">
            Have a <span className="text-primary">Story to Share?</span>
          </h2>
          <p className="text-text-light text-lg mb-10 max-w-2xl mx-auto">
            If you&apos;re a Mindful Group graduate and want to share your
            experience, we&apos;d love to hear from you. Your story can inspire
            the next person to take the first step.
          </p>
          <Link
            href="/contact"
            className="inline-block px-8 py-4 bg-accent text-white font-semibold text-sm uppercase tracking-wider hover:bg-accent-light transition-colors rounded-md"
          >
            Share Your Story
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-heading text-white mb-6">
            Ready to Write Your Own Story?
          </h2>
          <p className="text-white/80 text-lg mb-10">
            Join the 525+ people who have transformed their lives through The
            Mindful Group. Zero tuition. Full support. Real careers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://www.themindfulgroupinc.org/book-online"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-accent text-white font-semibold text-sm uppercase tracking-wider hover:bg-accent-light transition-colors rounded-md"
            >
              Book an Orientation
            </a>
            <Link
              href="/programs"
              className="px-8 py-4 border border-white/30 text-white text-sm uppercase tracking-wider hover:bg-white/10 transition-colors rounded-md"
            >
              Explore Programs
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
