import type { Metadata } from "next";
import Link from "next/link";
import ComplaintForm from "./ComplaintForm";

export const metadata: Metadata = {
  title: "File a Complaint | The Mindful Group",
  description: "File a participant complaint with The Mindful Group, Wisconsin DWD, or Employ Milwaukee. Know your rights under WIOA.",
};

export default function ComplaintPage() {
  return (
    <>
      <section className="pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-primary text-sm uppercase tracking-[0.3em] mb-6 font-semibold">Feedback</p>
          <h1 className="text-4xl md:text-6xl font-heading text-text leading-tight mb-8">
            File a <span className="text-accent">Complaint</span>
          </h1>
          <p className="text-text-light text-lg max-w-3xl">
            Your voice matters. You have multiple options for filing a complaint. Choose the path that works best for you.
          </p>
        </div>
      </section>

      {/* ── Filing Options ── */}
      <section className="pb-16">
        <div className="max-w-7xl mx-auto px-6 space-y-8">

          {/* Option 1 — DWD */}
          <div className="bg-white border border-border-light rounded-lg p-8 shadow-sm">
            <div className="flex items-start gap-4 mb-4">
              <span className="shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-heading text-lg">1</span>
              <div>
                <h2 className="text-xl font-heading text-text">File With the Wisconsin Department of Workforce Development (DWD)</h2>
                <p className="text-text-light text-sm mt-1"><strong>For:</strong> Enrollment delays, consumer choice violations, failure to process WIOA eligibility</p>
                <p className="text-text-light text-sm"><strong>Authority:</strong> 20 CFR &sect; 683.600 and WIOA Section 181(c)</p>
              </div>
            </div>

            <div className="ml-14 space-y-4">
              <div>
                <h3 className="text-text text-sm font-semibold uppercase tracking-wider mb-2">File by Email</h3>
                <p className="text-text-light text-sm">
                  Primary: <a href="mailto:dwdDET@dwd.wisconsin.gov" className="text-primary hover:text-primary-light transition-colors underline">dwdDET@dwd.wisconsin.gov</a><br />
                  Secondary: <a href="mailto:michele.carter1@dwd.wisconsin.gov" className="text-primary hover:text-primary-light transition-colors underline">michele.carter1@dwd.wisconsin.gov</a>
                </p>
              </div>

              <div>
                <h3 className="text-text text-sm font-semibold uppercase tracking-wider mb-2">File by Mail</h3>
                <p className="text-text-light text-sm">
                  Wisconsin DWD, Division of Employment and Training<br />
                  201 E. Washington Ave, Madison, WI 53707
                </p>
              </div>

              <div>
                <h3 className="text-text text-sm font-semibold uppercase tracking-wider mb-2">Subject Line to Use</h3>
                <p className="text-text-light text-sm italic">
                  Formal WIOA Participant Grievance — WDA 2 Enrollment Delay — [Your Name]
                </p>
              </div>

              <div>
                <h3 className="text-text text-sm font-semibold uppercase tracking-wider mb-2">What to Include</h3>
                <p className="text-text-light text-sm leading-relaxed">
                  Your name, address, phone, and email; a description of what happened and when; what specific right you believe was violated; what resolution you are requesting.
                </p>
              </div>

              <div className="bg-surface rounded-md p-4">
                <h3 className="text-text text-sm font-semibold uppercase tracking-wider mb-2">What Happens Next</h3>
                <p className="text-text-light text-sm leading-relaxed">
                  DWD must acknowledge receipt in writing. A written determination is required within 90 days. If unsatisfied, you may file with the U.S. DOL Civil Rights Center within 30 days of DWD&apos;s final decision.
                </p>
              </div>
            </div>
          </div>

          {/* Option 2 — Employ Milwaukee */}
          <div className="bg-white border border-border-light rounded-lg p-8 shadow-sm">
            <div className="flex items-start gap-4 mb-4">
              <span className="shrink-0 w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center text-accent font-heading text-lg">2</span>
              <div>
                <h2 className="text-xl font-heading text-text">File With Employ Milwaukee</h2>
                <p className="text-text-light text-sm mt-1"><strong>For:</strong> Violations of WIOA program rules by Employ Milwaukee or its service providers (including Dynamic Workforce Solutions)</p>
                <p className="text-text-light text-sm"><strong>Authority:</strong> WIOA Sections 181(c) and 188</p>
              </div>
            </div>

            <div className="ml-14 space-y-4">
              <div>
                <h3 className="text-text text-sm font-semibold uppercase tracking-wider mb-2">Complaint Officer</h3>
                <p className="text-text-light text-sm">
                  <strong>Elizabeth Jankowski</strong><br />
                  Employ Milwaukee, 2342 N. 27th Street, Milwaukee, WI 53210<br />
                  Phone: <a href="tel:4142701759" className="text-primary hover:text-primary-light transition-colors underline">414-270-1759</a><br />
                  Email: <a href="mailto:Elizabeth.Jankowski@EmployMilwaukee.org" className="text-primary hover:text-primary-light transition-colors underline">Elizabeth.Jankowski@EmployMilwaukee.org</a>
                </p>
              </div>

              <div>
                <h3 className="text-text text-sm font-semibold uppercase tracking-wider mb-2">Filing Deadline</h3>
                <p className="text-text-light text-sm leading-relaxed">
                  Within 1 year of the alleged violation (non-discrimination complaints). Discrimination complaints must be filed within 180 days.
                </p>
              </div>

              <div>
                <h3 className="text-text text-sm font-semibold uppercase tracking-wider mb-2">What to Include</h3>
                <p className="text-text-light text-sm leading-relaxed">
                  Your name, address, and phone; the name and address of the party your complaint is against; a clear statement of what happened and on what dates; which WIOA regulation you believe was violated; whether you have filed this complaint anywhere else; and what resolution you are requesting.
                </p>
              </div>

              <div className="bg-surface rounded-md p-4">
                <h3 className="text-text text-sm font-semibold uppercase tracking-wider mb-2">What Happens Next</h3>
                <p className="text-text-light text-sm leading-relaxed">
                  Employ Milwaukee must acknowledge receipt within 5 business days and complete investigation by Day 12. You have the right to request a hearing no later than Day 15. A final decision must be issued within 60 days. If you are unsatisfied, you may appeal to Wisconsin DWD/DET within 10 calendar days of receiving the decision.
                </p>
              </div>

              <div>
                <a
                  href="https://www.employmilwaukee.org/Employ-Milwaukee/Policies/Grievance-Procedure.htm"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-primary text-sm font-semibold uppercase tracking-wider hover:text-primary-light transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                  Download Employ Milwaukee Grievance Procedure PDF
                </a>
              </div>
            </div>
          </div>

          {/* Option 3 — TMG Transmit */}
          <div className="bg-white border-2 border-primary/30 rounded-lg p-8 shadow-sm">
            <div className="flex items-start gap-4 mb-4">
              <span className="shrink-0 w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-white font-heading text-lg">3</span>
              <div>
                <h2 className="text-xl font-heading text-text">Authorize The Mindful Group to Transmit on Your Behalf</h2>
                <p className="text-text-light text-sm mt-1">
                  You do not have to navigate this alone. If you prefer, The Mindful Group can submit your complaint to DWD, Employ Milwaukee, or both — using your words, without alteration.
                </p>
              </div>
            </div>

            <div className="ml-14 space-y-4">
              <div>
                <h3 className="text-text text-sm font-semibold uppercase tracking-wider mb-2">To Authorize Us</h3>
                <ol className="text-text-light text-sm leading-relaxed space-y-2 list-decimal list-inside">
                  <li>Complete the Participant Complaint Template (available at the portal or in person)</li>
                  <li>Complete and sign the Voluntary Authorization to Transmit form, selecting which agency or agencies you want us to file with</li>
                  <li>Return both to us by email, in person, or by mail</li>
                </ol>
              </div>

              <p className="text-text-light text-sm leading-relaxed">
                We will transmit your complaint within 3 business days and send you confirmation.
              </p>

              <div className="bg-primary/5 border border-primary/20 rounded-md p-4">
                <p className="text-text-light text-sm leading-relaxed">
                  <strong>This is entirely voluntary.</strong> Authorizing TMG to transmit your complaint is not required to participate in training or to remain on our enrollment list. You can revoke this authorization at any time in writing.
                </p>
              </div>
            </div>
          </div>

          {/* Anti-Retaliation */}
          <div className="bg-accent/5 border-2 border-accent/30 rounded-lg p-8">
            <h2 className="text-xl font-heading text-text mb-3 flex items-center gap-3">
              <svg className="w-6 h-6 text-accent shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              Your Anti-Retaliation Protections
            </h2>
            <p className="text-text-light text-sm leading-relaxed">
              Federal law prohibits any retaliation, intimidation, or adverse action against you for filing a grievance or exercising your rights under WIOA. This protection is established under <strong>29 CFR Part 38</strong>.
            </p>
          </div>
        </div>
      </section>

      {/* ── Complaint Form ── */}
      <section className="pb-24 bg-surface">
        <div className="max-w-7xl mx-auto px-6 pt-16">
          <div className="text-center mb-12">
            <p className="text-primary text-sm uppercase tracking-[0.3em] mb-4 font-semibold">Option 3</p>
            <h2 className="text-3xl font-heading text-text mb-4">Submit Your Complaint Through The Mindful Group</h2>
            <p className="text-text-light text-lg max-w-2xl mx-auto">
              Complete the form below and we will transmit your complaint to the appropriate agency on your behalf.
            </p>
          </div>

          <div className="grid md:grid-cols-5 gap-12">
            <div className="md:col-span-3">
              <ComplaintForm />
            </div>

            <div className="md:col-span-2">
              <div className="space-y-8">
                <div className="bg-white border border-border-light rounded-lg p-6">
                  <h3 className="text-text text-sm uppercase tracking-wider mb-3 font-semibold">What Happens Next</h3>
                  <ol className="text-text-light text-sm leading-relaxed space-y-3 list-decimal list-inside">
                    <li>Your complaint is sent directly to our leadership team</li>
                    <li>We review all complaints within 1 business day</li>
                    <li>We transmit to the selected agency within 3 business days</li>
                    <li>You receive confirmation of transmission</li>
                  </ol>
                </div>
                <div>
                  <h3 className="text-text text-sm uppercase tracking-wider mb-3">Call Us</h3>
                  <a href="tel:8334146463" className="text-text-light text-sm hover:text-primary transition-colors">833-414-MIND (6463)</a>
                </div>
                <div>
                  <h3 className="text-text text-sm uppercase tracking-wider mb-3">Email Us</h3>
                  <a href="mailto:Info@TheMindfulGroupInc.Org" className="text-text-light text-sm hover:text-primary transition-colors">Info@TheMindfulGroupInc.Org</a>
                </div>
                <div>
                  <h3 className="text-text text-sm uppercase tracking-wider mb-3">Visit Us</h3>
                  <p className="text-text-light text-sm leading-relaxed">
                    4201 N 27th Street<br />
                    Suite 500<br />
                    Milwaukee, WI 53216
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
