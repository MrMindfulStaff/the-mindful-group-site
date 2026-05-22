// Orientation booking → VICTORIA webhook forwarder.
//
// The public booking form POSTs here. This server route generates a unique
// bookingId, attaches the shared Bearer secret (kept server-side, never in the
// browser), and forwards a normalized payload to the VICTORIA LMS webhook,
// which files it as an OrientationBooking under an auto-created OrientationDate.

import { NextRequest } from "next/server";
import { randomUUID } from "crypto";
import { ORIENTATION_PROGRAMS, type OrientationProgramId } from "@/lib/orientation-dates";

const VICTORIA_WEBHOOK = "https://www.victorialms.com/api/webhooks/bookings";

// Simple in-memory rate limiter (mirrors the contact route)
const submissions = new Map<string, number[]>();
const RATE_LIMIT = 5;
const RATE_WINDOW = 60 * 60 * 1000; // per hour

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
        { error: "Too many booking attempts. Please try again later or call 833-414-MIND (6463)." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { program, dateIso, firstName, lastName, email, phone } = body ?? {};

    // Program must be a known orientation
    const serviceName = ORIENTATION_PROGRAMS[program as OrientationProgramId];
    if (!serviceName) {
      return Response.json({ error: "Please choose a program." }, { status: 400 });
    }

    // Required contact fields
    if (!firstName?.trim() || !lastName?.trim() || !email?.trim()) {
      return Response.json(
        { error: "Please fill in your name and email." },
        { status: 400 }
      );
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return Response.json({ error: "Please enter a valid email address." }, { status: 400 });
    }

    // Validate the selected date
    const start = new Date(dateIso);
    if (!dateIso || isNaN(start.getTime())) {
      return Response.json({ error: "Please choose an orientation date." }, { status: 400 });
    }
    if (start.getTime() < Date.now() - 60 * 60 * 1000) {
      return Response.json({ error: "That date has already passed. Please pick an upcoming date." }, { status: 400 });
    }

    // Length guards
    if (firstName.length > 100 || lastName.length > 100 || email.length > 254 || (phone && phone.length > 30)) {
      return Response.json({ error: "One or more fields exceed the maximum length." }, { status: 400 });
    }

    const secret = process.env.BOOKINGS_WEBHOOK_SECRET;
    if (!secret) {
      console.error("[book] BOOKINGS_WEBHOOK_SECRET not configured");
      return Response.json(
        { error: "Booking is temporarily unavailable. Please call 833-414-MIND (6463)." },
        { status: 500 }
      );
    }

    const payload = {
      eventType: "created" as const,
      bookingId: `web-${randomUUID()}`,
      serviceName,
      customerName: `${firstName.trim()} ${lastName.trim()}`,
      customerEmail: email.trim(),
      customerPhone: phone?.trim() || null,
      startTime: start.toISOString(),
      programInterest: serviceName,
    };

    const res = await fetch(VICTORIA_WEBHOOK, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secret}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      console.error("[book] VICTORIA webhook error:", res.status, await res.text().catch(() => ""));
      return Response.json(
        { error: "We couldn't record your booking. Please call 833-414-MIND (6463)." },
        { status: 502 }
      );
    }

    return Response.json({ success: true });
  } catch {
    console.error("[book] unexpected error");
    return Response.json(
      { error: "Something went wrong. Please call 833-414-MIND (6463)." },
      { status: 500 }
    );
  }
}
