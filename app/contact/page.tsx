import type { Metadata } from "next";

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
              <form className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label className="text-text-light text-xs uppercase tracking-wider block mb-2">First Name</label>
                    <input type="text" className="w-full bg-white border border-border-light px-4 py-3 text-text text-sm focus:border-primary focus:outline-none transition-colors" />
                  </div>
                  <div>
                    <label className="text-text-light text-xs uppercase tracking-wider block mb-2">Last Name</label>
                    <input type="text" className="w-full bg-white border border-border-light px-4 py-3 text-text text-sm focus:border-primary focus:outline-none transition-colors" />
                  </div>
                </div>
                <div>
                  <label className="text-text-light text-xs uppercase tracking-wider block mb-2">Email</label>
                  <input type="email" className="w-full bg-white border border-border-light px-4 py-3 text-text text-sm focus:border-primary focus:outline-none transition-colors" />
                </div>
                <div>
                  <label className="text-text-light text-xs uppercase tracking-wider block mb-2">Phone</label>
                  <input type="tel" className="w-full bg-white border border-border-light px-4 py-3 text-text text-sm focus:border-primary focus:outline-none transition-colors" />
                </div>
                <div>
                  <label className="text-text-light text-xs uppercase tracking-wider block mb-2">I Am A</label>
                  <select className="w-full bg-white border border-border-light px-4 py-3 text-text text-sm focus:border-primary focus:outline-none transition-colors appearance-none">
                    <option value="">Select one...</option>
                    <option value="student">Prospective Student</option>
                    <option value="employer">Employer / Hiring Partner</option>
                    <option value="funder">Funder / Donor</option>
                    <option value="volunteer">Volunteer</option>
                    <option value="partner">Community Partner</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="text-text-light text-xs uppercase tracking-wider block mb-2">Message</label>
                  <textarea rows={5} className="w-full bg-white border border-border-light px-4 py-3 text-text text-sm focus:border-primary focus:outline-none transition-colors resize-none" />
                </div>
                <button type="submit" className="px-8 py-4 bg-accent text-white font-semibold text-sm uppercase tracking-wider hover:bg-accent-light transition-colors">
                  Send Message
                </button>
              </form>
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
                <div className="border border-border-light p-6">
                  <h3 className="text-text text-sm uppercase tracking-wider mb-3">Ready to Enroll?</h3>
                  <p className="text-text-light text-sm leading-relaxed mb-4">
                    Skip the form — book an orientation directly to learn about our programs.
                  </p>
                  <a
                    href="https://www.themindfulgroupinc.org/book-online"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block px-6 py-3 bg-accent text-white font-semibold text-xs uppercase tracking-wider hover:bg-accent-light transition-colors"
                  >
                    Book Orientation
                  </a>
                </div>

                <div className="border border-border-light p-6">
                  <h3 className="text-text text-sm uppercase tracking-wider mb-3">File a Complaint</h3>
                  <p className="text-text-light text-sm leading-relaxed mb-4">
                    We care about your experience. If something went wrong, let us know.
                  </p>
                  <a
                    href="https://www.themindfulgroupinc.org/participant-complaints"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary text-sm uppercase tracking-wider hover:text-primary-light transition-colors"
                  >
                    File Complaint &rarr;
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
