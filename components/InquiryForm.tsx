"use client";

// Shared client form for the three supportive-service inquiry pages
// (Career Development, Mental Health, Financial Literacy). All three POST to
// /api/inquire with a `service` discriminator so staff can triage by program.

import { useState } from "react";
import Turnstile, { readTurnstileToken } from "@/components/Turnstile";

interface Props {
  service: "career-development" | "mental-health" | "financial-literacy";
  serviceName: string;
}

export default function InquiryForm({ service, serviceName }: Props) {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");

    const form = e.currentTarget;
    const data = {
      service,
      firstName:     (form.elements.namedItem("firstName")     as HTMLInputElement).value,
      lastName:      (form.elements.namedItem("lastName")      as HTMLInputElement).value,
      email:         (form.elements.namedItem("email")         as HTMLInputElement).value,
      phone:         (form.elements.namedItem("phone")         as HTMLInputElement).value,
      contactWindow: (form.elements.namedItem("contactWindow") as HTMLSelectElement).value,
      message:       (form.elements.namedItem("message")       as HTMLTextAreaElement).value,
      turnstileToken: readTurnstileToken(form),
    };

    try {
      const res = await fetch("/api/inquire", {
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
      setErrorMsg("Failed to send. Please call us at 833-414-MIND (6463).");
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
        <h3 className="text-text text-lg font-heading mb-2">Inquiry Sent</h3>
        <p className="text-text-light text-sm">
          Thanks for reaching out about <strong className="text-text">{serviceName}</strong>. A member of our team will follow up within one business day. If your need is more urgent, call{" "}
          <a href="tel:8334146463" className="text-primary hover:text-primary-light">833-414-MIND (6463)</a>.
        </p>
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

      <div className="grid sm:grid-cols-2 gap-6">
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
          <label htmlFor="phone" className="text-text-light text-xs uppercase tracking-wider block mb-2">
            Phone <span className="text-accent">*</span>
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            required
            className="w-full bg-white border border-border-light rounded-md px-4 py-3 text-text text-sm focus:border-primary focus:outline-none transition-colors"
          />
        </div>
      </div>

      <div>
        <label htmlFor="contactWindow" className="text-text-light text-xs uppercase tracking-wider block mb-2">
          Best Time to Reach You
        </label>
        <select
          id="contactWindow"
          name="contactWindow"
          defaultValue="Anytime"
          className="w-full bg-white border border-border-light rounded-md px-4 py-3 text-text text-sm focus:border-primary focus:outline-none transition-colors appearance-none"
        >
          <option value="Anytime">Anytime</option>
          <option value="Morning">Morning (8 AM – 12 PM)</option>
          <option value="Afternoon">Afternoon (12 – 5 PM)</option>
          <option value="Evening">Evening (5 – 8 PM)</option>
        </select>
      </div>

      <div>
        <label htmlFor="message" className="text-text-light text-xs uppercase tracking-wider block mb-2">
          Anything you&apos;d like us to know?
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          maxLength={5000}
          placeholder="Optional — what would you like help with?"
          className="w-full bg-white border border-border-light rounded-md px-4 py-3 text-text text-sm focus:border-primary focus:outline-none transition-colors"
        />
      </div>

      {status === "error" && <p className="text-red-600 text-sm">{errorMsg}</p>}

      <Turnstile />

      <button
        type="submit"
        disabled={status === "sending"}
        className="px-8 py-4 bg-accent text-white font-semibold text-sm uppercase tracking-wider rounded-md hover:bg-accent-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {status === "sending" ? "Sending…" : "Send Inquiry"}
      </button>
      <p className="text-text-light text-xs">
        A team member will follow up within one business day. Prefer to talk now? Call{" "}
        <a href="tel:8334146463" className="text-primary hover:text-primary-light">833-414-MIND (6463)</a>.
      </p>
    </form>
  );
}
