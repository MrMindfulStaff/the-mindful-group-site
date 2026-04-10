"use client";

import { useState } from "react";

export default function ComplaintForm() {
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
      program: (form.elements.namedItem("program") as HTMLSelectElement).value,
      incidentDate: (form.elements.namedItem("incidentDate") as HTMLInputElement).value,
      description: (form.elements.namedItem("description") as HTMLTextAreaElement).value,
      resolution: (form.elements.namedItem("resolution") as HTMLTextAreaElement).value,
    };

    try {
      const res = await fetch("/api/complaints", {
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
        <h3 className="text-text text-lg font-heading mb-2">Complaint Received</h3>
        <p className="text-text-light text-sm">
          Thank you for sharing your feedback. Our team will review your complaint and respond within 3 business days.
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="mt-4 text-primary text-sm uppercase tracking-wider hover:text-primary-light transition-colors"
        >
          Submit Another Complaint
        </button>
      </div>
    );
  }

  const inputClass = "w-full bg-white border border-border-light rounded-md px-4 py-3 text-text text-sm focus:border-primary focus:outline-none transition-colors";
  const labelClass = "text-text-light text-xs uppercase tracking-wider block mb-2";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid sm:grid-cols-2 gap-6">
        <div>
          <label htmlFor="firstName" className={labelClass}>
            First Name <span className="text-accent">*</span>
          </label>
          <input id="firstName" name="firstName" type="text" required className={inputClass} />
        </div>
        <div>
          <label htmlFor="lastName" className={labelClass}>
            Last Name <span className="text-accent">*</span>
          </label>
          <input id="lastName" name="lastName" type="text" required className={inputClass} />
        </div>
      </div>
      <div>
        <label htmlFor="email" className={labelClass}>
          Email <span className="text-accent">*</span>
        </label>
        <input id="email" name="email" type="email" required className={inputClass} />
      </div>
      <div>
        <label htmlFor="phone" className={labelClass}>Phone</label>
        <input id="phone" name="phone" type="tel" className={inputClass} />
      </div>
      <div>
        <label htmlFor="program" className={labelClass}>
          Program <span className="text-accent">*</span>
        </label>
        <select id="program" name="program" required className={`${inputClass} appearance-none`}>
          <option value="">Select a program...</option>
          <option value="CNA/CBRF Training">CNA/CBRF Training</option>
          <option value="Construction Training">Construction Training</option>
          <option value="Financial Literacy">Financial Literacy</option>
          <option value="Career Development">Career Development</option>
          <option value="Mental Health Counseling">Mental Health Counseling</option>
          <option value="Other">Other</option>
        </select>
      </div>
      <div>
        <label htmlFor="incidentDate" className={labelClass}>
          Date of Incident <span className="text-accent">*</span>
        </label>
        <input id="incidentDate" name="incidentDate" type="date" required className={inputClass} />
      </div>
      <div>
        <label htmlFor="description" className={labelClass}>
          Description of Complaint <span className="text-accent">*</span>
        </label>
        <textarea
          id="description"
          name="description"
          rows={5}
          required
          maxLength={5000}
          placeholder="Please describe what happened..."
          className={`${inputClass} resize-none`}
        />
      </div>
      <div>
        <label htmlFor="resolution" className={labelClass}>Desired Resolution</label>
        <textarea
          id="resolution"
          name="resolution"
          rows={3}
          maxLength={2000}
          placeholder="What outcome would you like to see? (optional)"
          className={`${inputClass} resize-none`}
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
        {status === "sending" ? "Submitting..." : "Submit Complaint"}
      </button>
    </form>
  );
}
