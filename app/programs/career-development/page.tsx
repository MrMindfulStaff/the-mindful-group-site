import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Career Development | The Mindful Group",
  description: "Resume building, interview prep, and career coaching in Milwaukee. Free career development support.",
};

export default function CareerDevelopmentPage() {
  return (
    <>
      <section className="pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-6">
          <Link href="/programs" className="text-gold text-sm uppercase tracking-wider hover:text-gold-light transition-colors mb-6 inline-block">&larr; All Programs</Link>
          <span className="text-[10px] uppercase tracking-[0.2em] border border-gold/20 text-gold/60 px-2 py-0.5 mb-6 inline-block">Career Readiness</span>
          <h1 className="text-4xl md:text-6xl font-heading text-ivory leading-tight mb-8">Career <span className="text-gold">Development</span></h1>
          <p className="text-silver text-lg max-w-3xl mb-10">Empowering you for success in your career journey. Personalized coaching in resume building, interview techniques, and networking strategies.</p>
          <a href="https://www.themindfulgroupinc.org/service-page/career-development-assistance" target="_blank" rel="noopener noreferrer" className="inline-block px-8 py-4 bg-gold text-obsidian font-semibold text-sm uppercase tracking-wider hover:bg-gold-light transition-colors">Request a Session</a>
        </div>
      </section>

      <section className="bg-obsidian-light py-24">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl md:text-3xl font-heading text-ivory mb-6">Get Career Ready</h2>
            <div className="space-y-4 text-silver leading-relaxed">
              <p>Our Career Development program provides personalized one-on-one coaching to prepare you for success in the job market. Whether you&apos;re entering the workforce for the first time or making a career transition, we&apos;ll help you build the skills and confidence you need.</p>
              <p>Sessions are scheduled by request and tailored to your specific needs and career goals.</p>
            </div>
          </div>
          <div>
            <h3 className="text-ivory text-sm uppercase tracking-wider mb-6">Services Include</h3>
            <ul className="space-y-3">
              {["Professional resume development", "Cover letter writing", "Mock interview practice", "Interview techniques and confidence building", "Networking strategy", "Job search support", "LinkedIn profile optimization", "Workplace communication skills"].map((t, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="text-gold mt-1 shrink-0"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg></span>
                  <span className="text-silver text-sm">{t}</span>
                </li>
              ))}
            </ul>
            <div className="mt-6 space-y-3">
              {[{ label: "Duration", value: "1 hour per session" }, { label: "Format", value: "1-on-1, by request" }, { label: "Location", value: "4201 N 27th St" }, { label: "Cost", value: "Free" }].map((d) => (
                <div key={d.label} className="flex justify-between border-b border-gold/10 pb-2">
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
          <h2 className="text-3xl md:text-4xl font-heading text-ivory mb-6">Ready to Level Up?</h2>
          <p className="text-silver text-lg mb-10">Request a career development session and take the next step in your professional journey.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="https://www.themindfulgroupinc.org/service-page/career-development-assistance" target="_blank" rel="noopener noreferrer" className="px-8 py-4 bg-gold text-obsidian font-semibold text-sm uppercase tracking-wider hover:bg-gold-light transition-colors">Request a Session</a>
            <Link href="/contact" className="px-8 py-4 border border-gold/40 text-gold text-sm uppercase tracking-wider hover:bg-gold/10 transition-colors">Contact Us</Link>
          </div>
        </div>
      </section>
    </>
  );
}
