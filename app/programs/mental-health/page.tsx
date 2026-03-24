import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mental Health Counseling | The Mindful Group",
  description: "Free confidential mental health counseling in Milwaukee. Coping strategies, emotional wellness, and stress management.",
};

export default function MentalHealthPage() {
  return (
    <>
      <section className="pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-6">
          <Link href="/programs" className="text-primary text-sm uppercase tracking-wider hover:text-primary-light transition-colors mb-6 inline-block">&larr; All Programs</Link>
          <span className="text-[10px] uppercase tracking-[0.2em] border border-border-light text-primary/60 px-2 py-0.5 rounded-md mb-6 inline-block">Wellness</span>
          <h1 className="text-4xl md:text-6xl font-heading text-text leading-tight mb-8">Mental Health <span className="text-primary">Counseling</span></h1>
          <p className="text-text-light text-lg max-w-3xl mb-10">Nurturing your mental well-being. Personalized counseling in a safe, confidential environment to support your journey.</p>
          <a href="https://www.themindfulgroupinc.org/service-page/mental-health-counseling" target="_blank" rel="noopener noreferrer" className="inline-block px-8 py-4 bg-accent text-white font-semibold text-sm uppercase tracking-wider rounded-md hover:bg-accent-light transition-colors">Request to Book</a>
        </div>
      </section>

      <section className="pb-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="relative aspect-[21/9] rounded-lg overflow-hidden">
            <Image src="/images/mental-health.jpg" alt="Mental health counseling session" fill className="object-cover" />
          </div>
        </div>
      </section>

      <section className="bg-surface py-24">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl md:text-3xl font-heading text-text mb-6">Your Well-Being Matters</h2>
            <div className="space-y-4 text-text-light leading-relaxed">
              <p>Life transitions — from entering a training program to starting a new career — can be stressful. Our mental health counseling provides a confidential space to develop coping strategies, work through challenges, and build emotional resilience.</p>
              <p>Sessions are one-on-one and scheduled by request. Our counselors tailor each session to your individual needs, whether you&apos;re dealing with stress, anxiety, life transitions, or other challenges.</p>
            </div>
          </div>
          <div>
            <h3 className="text-text font-semibold text-sm uppercase tracking-wider mb-6">What to Expect</h3>
            <ul className="space-y-3">
              {["Confidential 1-on-1 sessions", "Personalized coping strategies", "Emotional wellness support", "Stress management techniques", "Life transition guidance", "Goal setting and accountability"].map((t, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="text-primary mt-1 shrink-0"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg></span>
                  <span className="text-text-light text-sm">{t}</span>
                </li>
              ))}
            </ul>
            <div className="mt-6 space-y-3">
              {[{ label: "Duration", value: "1 hour" }, { label: "Format", value: "Request to Book" }, { label: "Location", value: "4201 N 27th St" }, { label: "Cost", value: "Free" }].map((d) => (
                <div key={d.label} className="flex justify-between border-b border-border-light pb-2">
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
          <h2 className="text-3xl md:text-4xl font-heading text-text mb-6">You Don&apos;t Have to Do This <span className="text-primary">Alone</span></h2>
          <p className="text-text-light text-lg mb-10">Request a counseling session. Everything is confidential and there&apos;s no cost to you.</p>
          <a href="https://www.themindfulgroupinc.org/service-page/mental-health-counseling" target="_blank" rel="noopener noreferrer" className="inline-block px-8 py-4 bg-accent text-white font-semibold text-sm uppercase tracking-wider rounded-md hover:bg-accent-light transition-colors">Request to Book</a>
        </div>
      </section>
    </>
  );
}
