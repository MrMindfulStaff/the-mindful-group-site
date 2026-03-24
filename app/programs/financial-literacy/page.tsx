import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Financial Literacy | The Mindful Group",
  description: "Free financial literacy training in Milwaukee. Budgeting, saving, investing, and credit building.",
};

export default function FinancialLiteracyPage() {
  return (
    <>
      <section className="pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-6">
          <Link href="/programs" className="text-gold text-sm uppercase tracking-wider hover:text-gold-light transition-colors mb-6 inline-block">&larr; All Programs</Link>
          <span className="text-[10px] uppercase tracking-[0.2em] border border-gold/20 text-gold/60 px-2 py-0.5 mb-6 inline-block">Career Readiness</span>
          <h1 className="text-4xl md:text-6xl font-heading text-ivory leading-tight mb-8">Financial <span className="text-gold">Literacy</span></h1>
          <p className="text-silver text-lg max-w-3xl mb-10">Master your finances. Learn budgeting, saving, and investing to make informed decisions that build long-term wealth and stability.</p>
        </div>
      </section>

      <section className="bg-obsidian-light py-24">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl md:text-3xl font-heading text-ivory mb-6">Master Your Money</h2>
            <div className="space-y-4 text-silver leading-relaxed">
              <p>Financial literacy is the foundation of long-term stability. Our program covers budgeting, saving, investing, and credit building to help you make informed financial decisions.</p>
              <p>Whether you&apos;re managing your first paycheck or planning for homeownership, this program gives you the tools and knowledge to take control of your financial future.</p>
            </div>
          </div>
          <div>
            <h3 className="text-ivory text-sm uppercase tracking-wider mb-6">Topics Covered</h3>
            <ul className="space-y-3">
              {["Budgeting and expense tracking", "Saving strategies", "Introduction to investing", "Credit building and repair", "Understanding debt", "Financial planning for families", "Homeownership readiness"].map((t, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="text-gold mt-1 shrink-0"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg></span>
                  <span className="text-silver text-sm">{t}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-heading text-ivory mb-6">Interested?</h2>
          <p className="text-silver text-lg mb-10">Contact us to learn about upcoming Financial Literacy sessions.</p>
          <Link href="/contact" className="inline-block px-8 py-4 bg-gold text-obsidian font-semibold text-sm uppercase tracking-wider hover:bg-gold-light transition-colors">Contact Us</Link>
        </div>
      </section>
    </>
  );
}
