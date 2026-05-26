// Supportive-service inquiry form → email to staff.
//
// The /book-online page only does self-serve scheduling for orientations.
// Career Development, Mental Health, and Financial Literacy are by appointment
// — each has its own /programs/<slug>/inquire page that posts here. We send a
// single email to Info@ with a subject prefix so staff can triage by service.
//
// We deliberately don't write to VICTORIA here: volume is low, and email keeps
// the loop simple while the team learns what these inquiries actually look like.
// (See plan §3 "Optional" — wire to VICTORIA ServiceRequest model once we want
// admin-UI tracking.)

import { NextRequest } from "next/server";
import { verifyTurnstileToken } from "@/lib/turnstile";

const KNOWN_SERVICES = {
  "career-development": "Career Development",
  "mental-health":      "Mental Health Counseling",
  "financial-literacy": "Financial Literacy",
} as const;
type ServiceSlug = keyof typeof KNOWN_SERVICES;

// Match the broader app: 3 inquiries/hour per IP is plenty for real humans
// and not enough for a bot to be useful.
const submissions = new Map<string, number[]>();
const RATE_LIMIT = 3;
const RATE_WINDOW = 60 * 60 * 1000;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = submissions.get(ip)?.filter((t) => now - t < RATE_WINDOW) || [];
  submissions.set(ip, timestamps);
  if (timestamps.length >= RATE_LIMIT) return true;
  timestamps.push(now);
  return false;
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    if (isRateLimited(ip)) {
      return Response.json(
        { error: "Too many submissions. Please try again later or call us at 833-414-MIND (6463)." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { service, firstName, lastName, email, phone, contactWindow, message, turnstileToken } = body ?? {};

    // Bot challenge — no-ops if Turnstile is not configured.
    const turnstile = await verifyTurnstileToken(turnstileToken, ip);
    if (!turnstile.ok) {
      return Response.json(
        { error: "We couldn't verify you weren't a bot. Please refresh and try again." },
        { status: 400 }
      );
    }

    const serviceLabel = KNOWN_SERVICES[service as ServiceSlug];
    if (!serviceLabel) {
      return Response.json({ error: "Unknown service." }, { status: 400 });
    }

    if (!firstName?.trim() || !lastName?.trim() || !email?.trim() || !phone?.trim()) {
      return Response.json(
        { error: "Please fill in your name, email, and phone number." },
        { status: 400 }
      );
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return Response.json({ error: "Please enter a valid email address." }, { status: 400 });
    }
    if (
      firstName.length > 100 ||
      lastName.length > 100 ||
      email.length > 254 ||
      phone.length > 30 ||
      (contactWindow && contactWindow.length > 30) ||
      (message && message.length > 5000)
    ) {
      return Response.json({ error: "One or more fields exceed the maximum length." }, { status: 400 });
    }

    const resendKey = process.env.RESEND_API_KEY;
    if (!resendKey) {
      // Email is the only delivery path right now — without Resend we can't
      // get the inquiry to staff. Log so it isn't silently lost, but tell the
      // user to call.
      console.error("[inquire] RESEND_API_KEY not set — inquiry not delivered:", {
        service: serviceLabel,
        from:    `${firstName} ${lastName} <${email}>`,
      });
      return Response.json(
        { error: "We couldn't send your inquiry. Please call us at 833-414-MIND (6463)." },
        { status: 500 }
      );
    }

    const text = [
      `Service: ${serviceLabel}`,
      `Name:    ${firstName.trim()} ${lastName.trim()}`,
      `Email:   ${email.trim()}`,
      `Phone:   ${phone.trim()}`,
      `Best time to reach: ${contactWindow || "Not specified"}`,
      ``,
      `Message:`,
      (message?.trim() || "(none)"),
    ].join("\n");

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "The Mindful Group <noreply@themindfulgroupinc.org>",
        to: ["reginald@themindfulgroupinc.org"],
        reply_to: email.trim(),
        subject: `Inquiry: ${serviceLabel} — ${firstName.trim()} ${lastName.trim()}`,
        text,
      }),
    });

    if (!res.ok) {
      console.error("[inquire] Resend error:", res.status, await res.text().catch(() => ""));
      return Response.json(
        { error: "We couldn't send your inquiry. Please call us at 833-414-MIND (6463)." },
        { status: 502 }
      );
    }

    return Response.json({ success: true });
  } catch {
    console.error("[inquire] unexpected error");
    return Response.json(
      { error: "Something went wrong. Please call us at 833-414-MIND (6463)." },
      { status: 500 }
    );
  }
}
