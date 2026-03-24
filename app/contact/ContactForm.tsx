"use client";

import { useState } from "react";

export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");

    const form = e.currentTarget;
    const data = {
      firstName: (form.elements.namedItem("firstName") as HTMLInputElement).value,
      lastName: (form.elements.namedItem("lastName") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      phone: (form.elements.namedItem("phone") as HTMLInputElement).value,
      role: (form.elements.namedItem("role") as HTMLSelectElement).value,
      message: (form.elements.namedItem("message") as HTMLTextAreaElement).value,
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        setStatus("error");
        setErrorMsg(result.error || "Something went wrong.");
        return;
      }

      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
      setErrorMsg("Failed to send. Please call us at 414-600-3745.");
    }
  }

  if (status === "success") {
    return (
      <div className="bg-primary/5 border border-primary/20 rounded-lg p-8 text-center">
        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-text text-lg font-heading mb-2">Message Sent</h3>
        <p className="text-text-light text-sm">
          Thank you for reaching out. Our team will get back to you within 1-2 business days.
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="mt-4 text-primary text-sm uppercase tracking-wider hover:text-primary-light transition-colors"
        >
          Send Another Message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid sm:grid-cols-2 gap-6">
        <div>
          <label htmlFor="firstName" className="text-text-light text-xs uppercase tracking-wider block mb-2">
            First Name <span className="text-accent">*</span>
          </label>
          <input
            id="firstName"
            name="firstName"
            type="text"
            required
            className="w-full bg-white border border-border-light rounded-md px-4 py-3 text-text text-sm focus:border-primary focus:outline-none transition-colors"
          />
        </div>
        <div>
          <label htmlFor="lastName" className="text-text-light text-xs uppercase tracking-wider block mb-2">
            Last Name <span className="text-accent">*</span>
          </label>
          <input
            id="lastName"
            name="lastName"
            type="text"
            required
            className="w-full bg-white border border-border-light rounded-md px-4 py-3 text-text text-sm focus:border-primary focus:outline-none transition-colors"
          />
        </div>
      </div>
      <div>
        <label htmlFor="email" className="text-text-light text-xs uppercase tracking-wider block mb-2">
          Email <span className="text-accent">*</span>
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="w-full bg-white border border-border-light rounded-md px-4 py-3 text-text text-sm focus:border-primary focus:outline-none transition-colors"
        />
      </div>
      <div>
        <label htmlFor="phone" className="text-text-light text-xs uppercase tracking-wider block mb-2">Phone</label>
        <input
          id="phone"
          name="phone"
          type="tel"
          className="w-full bg-white border border-border-light rounded-md px-4 py-3 text-text text-sm focus:border-primary focus:outline-none transition-colors"
        />
      </div>
      <div>
        <label htmlFor="role" className="text-text-light text-xs uppercase tracking-wider block mb-2">I Am A</label>
        <select
          id="role"
          name="role"
          className="w-full bg-white border border-border-light rounded-md px-4 py-3 text-text text-sm focus:border-primary focus:outline-none transition-colors appearance-none"
        >
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
        <label htmlFor="message" className="text-text-light text-xs uppercase tracking-wider block mb-2">
          Message <span className="text-accent">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          maxLength={5000}
          className="w-full bg-white border border-border-light rounded-md px-4 py-3 text-text text-sm focus:border-primary focus:outline-none transition-colors resize-none"
        />
      </div>

      {status === "error" && (
        <p className="text-red-600 text-sm">{errorMsg}</p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="px-8 py-4 bg-accent text-white font-semibold text-sm uppercase tracking-wider rounded-md hover:bg-accent-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {status === "sending" ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}
