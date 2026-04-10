import type { Metadata } from "next";
import ComplaintForm from "./ComplaintForm";

export const metadata: Metadata = {
  title: "File a Complaint | The Mindful Group",
  description: "File a participant complaint with The Mindful Group. We take all feedback seriously and will respond within 3 business days.",
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
            Your voice matters. If something went wrong during your experience with The Mindful Group, we want to hear about it and make it right.
          </p>
        </div>
      </section>

      <section className="pb-24">
        <div className="max-w-7xl mx-auto px-6">
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
                    <li>You will receive a response within 3 business days</li>
                    <li>If needed, we schedule a follow-up conversation</li>
                  </ol>
                </div>
                <div>
                  <h3 className="text-text text-sm uppercase tracking-wider mb-3">Call Us</h3>
                  <a href="tel:4146003745" className="text-text-light text-sm hover:text-primary transition-colors">414-600-3745</a>
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
