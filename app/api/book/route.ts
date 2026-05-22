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
const ORIENTATION_ADDRESS = "4201 N 27th Street, Milwaukee, WI 53216";
const ORIENTATION_ROOM = "First Floor Conference Room";
const ORIENTATION_PARKING = "Park in the rear parking lot and enter through the northwest side of the building.";

// Best-effort booking confirmation email via Resend (same setup as the contact
// form). Never throws — a booking must succeed even if the email fails.
async function sendConfirmationEmail(args: {
  firstName: string;
  email: string;
  serviceName: string;
  start: Date;
}): Promise<void> {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.log("[book] RESEND_API_KEY not set — skipping confirmation email");
    return;
  }

  const dateStr = args.start.toLocaleDateString("en-US", {
    weekday: "long", year: "numeric", month: "long", day: "numeric", timeZone: "America/Chicago",
  });
  const timeStr = args.start.toLocaleTimeString("en-US", {
    hour: "numeric", minute: "2-digit", timeZone: "America/Chicago",
  });

  const text = [
    `Hi ${args.firstName},`,
    ``,
    `You're confirmed for ${args.serviceName}:`,
    ``,
    `Date: ${dateStr}`,
    `Time: ${timeStr} (please arrive a few minutes early)`,
    `Location: ${ORIENTATION_ADDRESS} — ${ORIENTATION_ROOM}`,
    `Parking & entry: ${ORIENTATION_PARKING}`,
    ``,
    `Attending orientation is required to move forward in the program. If you can't make it, please call us at 833-414-MIND (6463) so we can get you on another date.`,
    ``,
    `We look forward to seeing you!`,
    ``,
    `— The Mindful Group`,
    `833-414-MIND (6463)`,
  ].join("\n");

  const html = `
    <div style="font-family:Arial,Helvetica,sans-serif;max-width:560px;margin:0 auto;color:#1a1a1a">
      <p>Hi ${args.firstName},</p>
      <p>You're confirmed for <strong>${args.serviceName}</strong>:</p>
      <table style="margin:16px 0;border-collapse:collapse">
        <tr><td style="padding:4px 12px 4px 0;color:#555">Date</td><td style="padding:4px 0"><strong>${dateStr}</strong></td></tr>
        <tr><td style="padding:4px 12px 4px 0;color:#555">Time</td><td style="padding:4px 0"><strong>${timeStr}</strong> (please arrive a few minutes early)</td></tr>
        <tr><td style="padding:4px 12px 4px 0;color:#555;vertical-align:top">Location</td><td style="padding:4px 0">${ORIENTATION_ADDRESS}<br/><strong>${ORIENTATION_ROOM}</strong></td></tr>
        <tr><td style="padding:4px 12px 4px 0;color:#555;vertical-align:top">Parking &amp; entry</td><td style="padding:4px 0">${ORIENTATION_PARKING}</td></tr>
      </table>
      <p>Attending orientation is required to move forward in the program. If you can't make it, please call us at <a href="tel:8334146463">833-414-MIND (6463)</a> so we can get you on another date.</p>
      <p>We look forward to seeing you!</p>
      <p style="margin-top:24px;color:#555">— The Mindful Group<br/>833-414-MIND (6463)</p>
    </div>`;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: "The Mindful Group <noreply@themindfulgroupinc.org>",
        to: [args.email],
        subject: `You're booked: ${args.serviceName} — ${dateStr}`,
        text,
        html,
      }),
    });
    if (!res.ok) console.error("[book] confirmation email failed:", res.status, await res.text().catch(() => ""));
  } catch (e) {
    console.error("[book] confirmation email error:", (e as Error).message);
  }
}

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

    // Session filled between page load and submit — the webhook is the
    // authoritative cap guard and returns 409 {code:"FULL"}.
    if (res.status === 409) {
      return Response.json(
        { error: "That orientation just filled up. Please pick another date." },
        { status: 409 }
      );
    }

    if (!res.ok) {
      console.error("[book] VICTORIA webhook error:", res.status, await res.text().catch(() => ""));
      return Response.json(
        { error: "We couldn't record your booking. Please call 833-414-MIND (6463)." },
        { status: 502 }
      );
    }

    // Booking recorded — send the confirmation email (best-effort, non-blocking).
    await sendConfirmationEmail({
      firstName: firstName.trim(),
      email: email.trim(),
      serviceName,
      start,
    });

    return Response.json({ success: true });
  } catch {
    console.error("[book] unexpected error");
    return Response.json(
      { error: "Something went wrong. Please call 833-414-MIND (6463)." },
      { status: 500 }
    );
  }
}
