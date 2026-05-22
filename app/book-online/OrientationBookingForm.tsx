"use client";

import { useState } from "react";

interface SlotWithSeats {
  iso: string;
  label: string;
  remaining: number;
}

interface Props {
  slots: SlotWithSeats[];
}

function seatsNote(remaining: number): string {
  if (remaining <= 5) return ` — only ${remaining} seat${remaining === 1 ? "" : "s"} left`;
  return ` — ${remaining} seats left`;
}

const PROGRAM_NAMES: Record<string, string> = {
  "cna-cbrf": "CNA/CBRF Training Orientation",
  "construction": "Construction Training Orientation",
};

export default function OrientationBookingForm({ slots }: Props) {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [booked, setBooked] = useState<{ program: string; dateLabel: string } | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");

    const form = e.currentTarget;
    const data = {
      program:   (form.elements.namedItem("program")   as HTMLSelectElement).value,
      dateIso:   (form.elements.namedItem("dateIso")    as HTMLSelectElement).value,
      firstName: (form.elements.namedItem("firstName")  as HTMLInputElement).value,
      lastName:  (form.elements.namedItem("lastName")   as HTMLInputElement).value,
      email:     (form.elements.namedItem("email")      as HTMLInputElement).value,
      phone:     (form.elements.namedItem("phone")      as HTMLInputElement).value,
    };

    try {
      const res = await fetch("/api/book", {
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
      setBooked({
        program: PROGRAM_NAMES[data.program] ?? "Orientation",
        dateLabel: slots.find((s) => s.iso === data.dateIso)?.label ?? "",
      });
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
      setErrorMsg("Failed to book. Please call us at 833-414-MIND (6463).");
    }
  }

  if (status === "success") {
    return (
      <div className="bg-primary/5 border border-primary/20 rounded-lg p-8">
        <div className="text-center">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-text text-lg font-heading mb-2">You&apos;re Booked!</h3>
          {booked && (
            <p className="text-text text-sm font-semibold">
              {booked.program}
              {booked.dateLabel ? ` · ${booked.dateLabel} at 11:00 AM` : ""}
            </p>
          )}
          <p className="text-text-light text-sm mt-1">
            A confirmation email is on its way. Here&apos;s what you need to know:
          </p>
        </div>

        <div className="mt-5 bg-white rounded-lg border border-border-light p-5 text-sm text-text-light space-y-3 max-w-md mx-auto text-left">
          <div className="flex gap-3">
            <span className="shrink-0">📍</span>
            <span><strong className="text-text">4201 N 27th Street, Milwaukee, WI 53216</strong><br/>First Floor Conference Room</span>
          </div>
          <div className="flex gap-3">
            <span className="shrink-0">🅿️</span>
            <span>Park in the <strong className="text-text">rear parking lot</strong> and enter through the <strong className="text-text">northwest side</strong> of the building.</span>
          </div>
          <div className="flex gap-3">
            <span className="shrink-0">🕚</span>
            <span>Arrive a few minutes before <strong className="text-text">11:00 AM</strong>. Attending orientation is required to move forward — call <a href="tel:8334146463" className="text-primary hover:text-primary-light">833-414-MIND (6463)</a> if you need to reschedule.</span>
          </div>
        </div>

        <div className="text-center">
        <button
          onClick={() => { setStatus("idle"); setBooked(null); }}
          className="mt-5 text-primary text-sm uppercase tracking-wider hover:text-primary-light transition-colors"
        >
          Book Another Orientation
        </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid sm:grid-cols-2 gap-6">
        <div>
          <label htmlFor="program" className="text-text-light text-xs uppercase tracking-wider block mb-2">
            Program <span className="text-accent">*</span>
          </label>
          <select
            id="program"
            name="program"
            required
            defaultValue=""
            className="w-full bg-white border border-border-light rounded-md px-4 py-3 text-text text-sm focus:border-primary focus:outline-none transition-colors appearance-none"
          >
            <option value="" disabled>Choose a program…</option>
            <option value="cna-cbrf">CNA/CBRF Training Orientation</option>
            <option value="construction">Construction Training Orientation</option>
          </select>
        </div>
        <div>
          <label htmlFor="dateIso" className="text-text-light text-xs uppercase tracking-wider block mb-2">
            Orientation Date <span className="text-accent">*</span>
          </label>
          <select
            id="dateIso"
            name="dateIso"
            required
            defaultValue=""
            className="w-full bg-white border border-border-light rounded-md px-4 py-3 text-text text-sm focus:border-primary focus:outline-none transition-colors appearance-none"
          >
            <option value="" disabled>Choose a date…</option>
            {slots.map((s) => (
              <option key={s.iso} value={s.iso}>{s.label} · 11:00 AM{seatsNote(s.remaining)}</option>
            ))}
          </select>
        </div>
      </div>

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
          <label htmlFor="phone" className="text-text-light text-xs uppercase tracking-wider block mb-2">Phone</label>
          <input
            id="phone"
            name="phone"
            type="tel"
            className="w-full bg-white border border-border-light rounded-md px-4 py-3 text-text text-sm focus:border-primary focus:outline-none transition-colors"
          />
        </div>
      </div>

      {status === "error" && <p className="text-red-600 text-sm">{errorMsg}</p>}

      <button
        type="submit"
        disabled={status === "sending"}
        className="px-8 py-4 bg-accent text-white font-semibold text-sm uppercase tracking-wider rounded-md hover:bg-accent-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {status === "sending" ? "Booking…" : "Reserve My Spot"}
      </button>
      <p className="text-text-light text-xs">
        Orientations are held at 4201 N 27th St, Suite 500, Milwaukee. Bring a valid ID. Zero tuition, no prerequisites.
      </p>
    </form>
  );
}
