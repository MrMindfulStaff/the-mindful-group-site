import { NextRequest } from "next/server";

// Simple in-memory rate limiter
const submissions = new Map<string, number[]>();
const RATE_LIMIT = 3; // max submissions
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
        { error: "Too many submissions. Please try again later or call us at 833-414-MIND (6463)." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { firstName, lastName, email, phone, role, message } = body;

    // Validate required fields
    if (!firstName?.trim() || !lastName?.trim() || !email?.trim() || !message?.trim()) {
      return Response.json(
        { error: "Please fill in all required fields (name, email, and message)." },
        { status: 400 }
      );
    }

    // Basic email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return Response.json({ error: "Please enter a valid email address." }, { status: 400 });
    }

    // Input length limits
    const MAX_LEN = 5000;
    if (
      firstName.length > 100 ||
      lastName.length > 100 ||
      email.length > 254 ||
      (phone && phone.length > 20) ||
      message.length > MAX_LEN
    ) {
      return Response.json({ error: "One or more fields exceed the maximum length." }, { status: 400 });
    }

    // Send email via Resend, or fall back to logging
    const resendKey = process.env.RESEND_API_KEY;

    if (resendKey) {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "Contact Form <noreply@themindfulgroup.org>",
          to: ["Info@TheMindfulGroupInc.Org"],
          subject: `Contact Form: ${firstName.trim()} ${lastName.trim()} (${role || "Not specified"})`,
          text: [
            `Name: ${firstName.trim()} ${lastName.trim()}`,
            `Email: ${email.trim()}`,
            `Phone: ${phone?.trim() || "Not provided"}`,
            `Role: ${role || "Not specified"}`,
            ``,
            `Message:`,
            message.trim(),
          ].join("\n"),
        }),
      });

      if (!res.ok) {
        console.error("Resend API error:", await res.text());
        return Response.json(
          { error: "Failed to send message. Please call us at 833-414-MIND (6463)." },
          { status: 500 }
        );
      }
    } else {
      // No email service configured — log the submission
      console.log("Contact form submission (no RESEND_API_KEY configured):", {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        phone: phone?.trim(),
        role,
        message: message.trim().substring(0, 200) + "...",
        timestamp: new Date().toISOString(),
      });
    }

    return Response.json({ success: true });
  } catch {
    console.error("Contact API error");
    return Response.json(
      { error: "Something went wrong. Please call us at 833-414-MIND (6463)." },
      { status: 500 }
    );
  }
}
