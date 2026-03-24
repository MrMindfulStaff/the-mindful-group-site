import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Employment | The Mindful Group",
  description: "Mindful Staffing connects trained graduates with employers across Milwaukee. Submit your resume or partner with us.",
};

export default function EmploymentPage() {
  return (
    <>
      <section className="pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-primary text-sm uppercase tracking-[0.3em] mb-6">Employment</p>
          <h1 className="text-4xl md:text-6xl font-heading text-text leading-tight mb-8">
            Need a Job? <span className="text-primary">We&apos;ll Help You Find One.</span>
          </h1>
          <p className="text-text-light text-lg max-w-3xl">
            Mindful Staffing partners with businesses across multiple industries to connect trained, job-ready individuals with employers who need them.
          </p>
        </div>
      </section>

      {/* Photo Banner */}
      <section className="pb-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="relative aspect-[21/9] rounded-lg overflow-hidden">
            <Image src="/images/employment.jpg" alt="Employment and job placement services" fill className="object-cover" />
          </div>
        </div>
      </section>

      <section className="bg-surface py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 md:gap-16">
            {/* Job Seekers */}
            <div className="bg-white border border-border-light rounded-lg p-8 md:p-12">
              <p className="text-primary text-sm uppercase tracking-[0.3em] mb-4">For Job Seekers</p>
              <h2 className="text-2xl md:text-3xl font-heading text-text mb-6">Launch Your Career</h2>
              <div className="space-y-4 text-text-light leading-relaxed mb-8">
                <p>Complete a training program and we&apos;ll connect you directly to employers through Mindful Staffing Solutions. Our staffing arm works with businesses across healthcare, construction, and other industries.</p>
                <p>Already have skills? Submit your resume and we&apos;ll match you with available positions.</p>
              </div>
              <div className="space-y-3 mb-8">
                {["Direct placement after training", "Multiple industry partnerships", "Resume review and coaching", "Interview preparation", "Ongoing career support"].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="text-primary mt-1 shrink-0"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg></span>
                    <span className="text-text-light text-sm">{item}</span>
                  </div>
                ))}
              </div>
              <Link href="/contact" className="inline-block px-8 py-4 bg-accent text-white font-semibold text-sm uppercase tracking-wider rounded-md hover:bg-accent-light transition-colors">
                Submit Resume
              </Link>
            </div>

            {/* Employers */}
            <div className="bg-white border border-border-light rounded-lg p-8 md:p-12">
              <p className="text-primary text-sm uppercase tracking-[0.3em] mb-4">For Employers</p>
              <h2 className="text-2xl md:text-3xl font-heading text-text mb-6">Hire Trained Talent</h2>
              <div className="space-y-4 text-text-light leading-relaxed mb-8">
                <p>Partner with Mindful Staffing to access a pipeline of trained, certified, job-ready candidates. Our graduates complete rigorous training programs and are prepared to contribute from day one.</p>
                <p>We handle the training. You get the talent.</p>
              </div>
              <div className="space-y-3 mb-8">
                {["Pre-trained, certified candidates", "Healthcare (CNA/CBRF) graduates", "Construction trades graduates", "Ongoing support for placed employees", "Reduce your hiring costs"].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="text-primary mt-1 shrink-0"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg></span>
                    <span className="text-text-light text-sm">{item}</span>
                  </div>
                ))}
              </div>
              <Link href="/contact" className="inline-block px-8 py-4 border border-primary text-primary text-sm uppercase tracking-wider rounded-md hover:bg-primary/10 transition-colors">
                Partner With Us
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-5xl mx-auto px-6">
          <div className="border-l-2 border-primary pl-8 md:pl-12">
            <p className="text-2xl md:text-3xl font-heading text-text leading-relaxed mb-6">
              We don&apos;t just place people in jobs. We build the bridge between training and career — and we walk across it with them.
            </p>
            <p className="text-primary text-sm uppercase tracking-[0.2em]">Mindful Staffing Solutions</p>
          </div>
        </div>
      </section>
    </>
  );
}
