"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const links = [
  { href: "/", label: "Home" },
  { href: "/programs", label: "Programs" },
  { href: "/support", label: "Support" },
  { href: "/stellar-engine", label: "Stellar Engine" },
  { href: "/testimonials", label: "Stories" },
  { href: "/about", label: "About" },
  { href: "/get-involved", label: "Get Involved" },
  { href: "/contact", label: "Contact" },
];

export default function Navigation() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-border-light shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 hover:opacity-90 transition-opacity"
        >
          <Image
            src="/images/tmg-logo.png"
            alt="The Mindful Group"
            width={50}
            height={27}
            className="h-7 w-auto"
            priority
          />
          <span className="text-text font-heading text-sm hidden sm:inline">
            The Mindful Group
          </span>
        </Link>

        {/* Desktop */}
        <div className="hidden lg:flex items-center gap-8">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`text-sm transition-colors tracking-wide uppercase nav-underline ${
                isActive(l.href)
                  ? "text-primary"
                  : "text-text-light hover:text-primary"
              }`}
            >
              {l.label}
            </Link>
          ))}
          <a
            href="https://www.themindfulgroupinc.org/book-online"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-2 bg-accent text-white font-semibold text-xs uppercase tracking-wider hover:bg-accent-light transition-colors rounded-md"
          >
            Enroll Now
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="lg:hidden text-text-light hover:text-primary"
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {open ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="lg:hidden bg-white border-t border-border-light overflow-hidden"
          >
            <div className="px-6 py-4 space-y-3">
              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className={`block tracking-wide uppercase text-sm transition-colors ${
                    isActive(l.href) ? "text-primary" : "text-text-light hover:text-primary"
                  }`}
                >
                  {l.label}
                </Link>
              ))}
              <a
                href="https://www.themindfulgroupinc.org/book-online"
                target="_blank"
                rel="noopener noreferrer"
                className="block mt-4 px-6 py-3 bg-accent text-white font-semibold text-xs uppercase tracking-wider text-center hover:bg-accent-light transition-colors rounded-md"
              >
                Enroll Now
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
