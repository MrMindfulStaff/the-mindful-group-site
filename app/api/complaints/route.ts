import { NextRequest } from "next/server";

// Simple in-memory rate limiter
const submissions = new Map<string, number[]>();
const RATE_LIMIT = 3;
const RATE_WINDOW = 60 * 60 * 1000; // 1 hour

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
        { error: "Too many submissions. Please try again later or call us at 414-600-3745." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { firstName, lastName, email, phone, program, incidentDate, description, resolution } = body;

    // Validate required fields
    if (!firstName?.trim() || !lastName?.trim() || !email?.trim() || !program?.trim() || !incidentDate?.trim() || !description?.trim()) {
      return Response.json(
        { error: "Please fill in all required fields." },
        { status: 400 }
      );
    }

    // Basic email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return Response.json({ error: "Please enter a valid email address." }, { status: 400 });
    }

    // Input length limits
    if (
      firstName.length > 100 ||
      lastName.length > 100 ||
      email.length > 254 ||
      (phone && phone.length > 20) ||
      description.length > 5000 ||
      (resolution && resolution.length > 2000)
    ) {
      return Response.json({ error: "One or more fields exceed the maximum length." }, { status: 400 });
    }

    const resendKey = process.env.RESEND_API_KEY;

    if (resendKey) {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "Complaint Form <noreply@themindfulgroup.org>",
          to: ["Info@TheMindfulGroupInc.Org"],
          subject: `Participant Complaint: ${firstName.trim()} ${lastName.trim()} (${program})`,
          text: [
            `PARTICIPANT COMPLAINT`,
            `${"=".repeat(40)}`,
            ``,
            `Name: ${firstName.trim()} ${lastName.trim()}`,
            `Email: ${email.trim()}`,
            `Phone: ${phone?.trim() || "Not provided"}`,
            `Program: ${program}`,
            `Date of Incident: ${incidentDate}`,
            ``,
            `DESCRIPTION:`,
            description.trim(),
            ``,
            `DESIRED RESOLUTION:`,
            resolution?.trim() || "Not specified",
            ``,
            `${"=".repeat(40)}`,
            `Submitted: ${new Date().toLocaleString("en-US", { timeZone: "America/Chicago" })}`,
          ].join("\n"),
        }),
      });

      if (!res.ok) {
        console.error("Resend API error:", await res.text());
        return Response.json(
          { error: "Failed to submit complaint. Please call us at 414-600-3745." },
          { status: 500 }
        );
      }
    } else {
      console.log("Complaint submission (no RESEND_API_KEY configured):", {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        program,
        incidentDate,
        description: description.trim().substring(0, 200) + "...",
        timestamp: new Date().toISOString(),
      });
    }

    return Response.json({ success: true });
  } catch {
    console.error("Complaints API error");
    return Response.json(
      { error: "Something went wrong. Please call us at 414-600-3745." },
      { status: 500 }
    );
  }
}
