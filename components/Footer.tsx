import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-obsidian-light border-t border-gold/10 py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12">
          <div className="md:col-span-1">
            <h3 className="text-gold font-heading text-lg mb-4">
              The Mindful Group
            </h3>
            <p className="text-silver text-sm leading-relaxed mb-4">
              Community First. Opportunity Always.
              <br />
              Zero-tuition workforce training and holistic support in
              Milwaukee.
            </p>
            <div className="text-silver text-sm space-y-1">
              <p>4201 N 27th Street, Suite 500</p>
              <p>Milwaukee, WI 53216</p>
              <p className="mt-2">
                <a href="tel:4146003745" className="hover:text-gold transition-colors">
                  414-600-3745
                </a>
              </p>
              <p>
                <a href="mailto:Info@TheMindfulGroupInc.Org" className="hover:text-gold transition-colors">
                  Info@TheMindfulGroupInc.Org
                </a>
              </p>
            </div>
          </div>

          <div>
            <h4 className="text-ivory text-sm uppercase tracking-wider mb-4">
              Programs
            </h4>
            <div className="space-y-2">
              {[
                { href: "/programs/cna-cbrf", label: "CNA/CBRF Training" },
                { href: "/programs/construction", label: "Construction Training" },
                { href: "/programs/financial-literacy", label: "Financial Literacy" },
                { href: "/programs/career-development", label: "Career Development" },
                { href: "/programs/mental-health", label: "Mental Health Counseling" },
              ].map((l) => (
                <Link key={l.href} href={l.href} className="block text-silver text-sm hover:text-gold transition-colors">
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-ivory text-sm uppercase tracking-wider mb-4">
              Support
            </h4>
            <div className="space-y-2">
              {[
                { href: "/support/childcare", label: "Child Care Assistance" },
                { href: "/support/transportation", label: "Transportation" },
                { href: "/support/housing", label: "Housing Support" },
                { href: "/support/reentry", label: "Re-Entry Services" },
                { href: "/employment", label: "Employment" },
              ].map((l) => (
                <Link key={l.href} href={l.href} className="block text-silver text-sm hover:text-gold transition-colors">
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-ivory text-sm uppercase tracking-wider mb-4">
              Get Involved
            </h4>
            <div className="space-y-2">
              {[
                { href: "/about", label: "Our Mission" },
                { href: "/about#board", label: "Board of Directors" },
                { href: "/get-involved", label: "Donate" },
                { href: "/get-involved#volunteer", label: "Volunteer" },
                { href: "/contact", label: "Contact Us" },
              ].map((l) => (
                <Link key={l.href} href={l.href} className="block text-silver text-sm hover:text-gold transition-colors">
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gold/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-silver/60 text-xs">
              &copy; {new Date().getFullYear()} The Mindful Group Inc. All rights reserved. 501(c)(3) Nonprofit.
            </p>
            <div className="flex gap-6 text-silver/40 text-xs">
              <span>A House Reed Entity</span>
              <span>Milwaukee, WI &middot; 53216</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
