import type { Metadata } from "next";
import Link from "next/link";
import ContactForm from "./ContactForm";

export const metadata: Metadata = {
  title: "Contact | The Mindful Group",
  description: "Contact The Mindful Group. Located at 4201 N 27th Street Suite 500, Milwaukee, WI 53216. Phone: 414-600-3745.",
};

export default function ContactPage() {
  return (
    <>
      <section className="pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-primary text-sm uppercase tracking-[0.3em] mb-6">Contact</p>
          <h1 className="text-4xl md:text-6xl font-heading text-text leading-tight mb-8">
            Let&apos;s <span className="text-primary">Connect</span>
          </h1>
          <p className="text-text-light text-lg max-w-3xl">
            Whether you&apos;re a prospective student, partner, funder, or community member — we&apos;d love to hear from you.
          </p>
        </div>
      </section>

      <section className="pb-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-5 gap-12">
            {/* Form */}
            <div className="md:col-span-3">
              <ContactForm />
            </div>

            {/* Info */}
            <div className="md:col-span-2">
              <div className="space-y-8">
                <div>
                  <h3 className="text-text text-sm uppercase tracking-wider mb-3">Visit Us</h3>
                  <p className="text-text-light text-sm leading-relaxed">
                    4201 N 27th Street<br />
                    Suite 500<br />
                    Milwaukee, WI 53216
                  </p>
                </div>
                <div>
                  <h3 className="text-text text-sm uppercase tracking-wider mb-3">Call Us</h3>
                  <a href="tel:4146003745" className="text-text-light text-sm hover:text-primary transition-colors">414-600-3745</a>
                </div>
                <div>
                  <h3 className="text-text text-sm uppercase tracking-wider mb-3">Email Us</h3>
                  <a href="mailto:Info@TheMindfulGroupInc.Org" className="text-text-light text-sm hover:text-primary transition-colors">Info@TheMindfulGroupInc.Org</a>
                </div>
                <div className="bg-white border border-border-light rounded-lg p-6">
                  <h3 className="text-text text-sm uppercase tracking-wider mb-3">Ready to Enroll?</h3>
                  <p className="text-text-light text-sm leading-relaxed mb-4">
                    Skip the form — book an orientation directly to learn about our programs.
                  </p>
                  <a
                    href="https://www.themindfulgroupinc.org/book-online"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block px-6 py-3 bg-accent text-white font-semibold text-xs uppercase tracking-wider rounded-md hover:bg-accent-light transition-colors"
                  >
                    Book Orientation
                  </a>
                </div>

                <div className="bg-white border border-border-light rounded-lg p-6">
                  <h3 className="text-text text-sm uppercase tracking-wider mb-3">File a Complaint</h3>
                  <p className="text-text-light text-sm leading-relaxed mb-4">
                    We care about your experience. If something went wrong, let us know.
                  </p>
                  <Link
                    href="/participant-complaints"
                    className="text-primary text-sm uppercase tracking-wider hover:text-primary-light transition-colors"
                  >
                    File Complaint &rarr;
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
