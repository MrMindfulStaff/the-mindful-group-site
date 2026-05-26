import { NextRequest } from "next/server";
import { verifyTurnstileToken } from "@/lib/turnstile";

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
    const {
      firstName, lastName, streetAddress, city, state, zipCode, email, phone,
      complaintAbout, funderResponse, rightsViolated, funderServiceProvider,
      trainingProvider, harmCaused, powerOfAttorney, meetingDate,
      otherTrainingProvider, desiredCourse, remedySeeking, otherExplanation,
      fileWithWorkforceBoard, hasSigned, turnstileToken,
    } = body;

    // Bot challenge — no-ops if Turnstile is not configured.
    const turnstile = await verifyTurnstileToken(turnstileToken, ip);
    if (!turnstile.ok) {
      return Response.json(
        { error: "We couldn't verify you weren't a bot. Please refresh and try again." },
        { status: 400 }
      );
    }

    // Validate required fields
    if (!firstName?.trim() || !lastName?.trim() || !email?.trim()) {
      return Response.json({ error: "Please fill in all required fields (name and email)." }, { status: 400 });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return Response.json({ error: "Please enter a valid email address." }, { status: 400 });
    }

    if (firstName.length > 100 || lastName.length > 100 || email.length > 254) {
      return Response.json({ error: "One or more fields exceed the maximum length." }, { status: 400 });
    }

    const rightsStr = Array.isArray(rightsViolated) ? rightsViolated.join(", ") : rightsViolated || "Not specified";
    const harmStr = Array.isArray(harmCaused) ? harmCaused.join(", ") : harmCaused || "Not specified";

    const emailBody = [
      `PARTICIPANT COMPLAINT`,
      `${"=".repeat(50)}`,
      ``,
      `CONTACT INFORMATION`,
      `${"-".repeat(30)}`,
      `Name: ${firstName.trim()} ${lastName.trim()}`,
      `Address: ${streetAddress?.trim() || "Not provided"}`,
      `City: ${city?.trim() || ""}, ${state?.trim() || ""} ${zipCode?.trim() || ""}`,
      `Email: ${email.trim()}`,
      `Phone: ${phone?.trim() || "Not provided"}`,
      ``,
      `COMPLAINT INFORMATION`,
      `${"-".repeat(30)}`,
      `Complaint About: ${complaintAbout || "Not specified"}`,
      `Funder/Provider Response: ${funderResponse || "Not specified"}`,
      `Rights Violated: ${rightsStr}`,
      `Funder/Service Provider: ${funderServiceProvider || "Not specified"}`,
      `Chosen Training Provider: ${trainingProvider || "Not specified"}`,
      `Other Training Provider: ${otherTrainingProvider?.trim() || "N/A"}`,
      `Specific Harm Caused: ${harmStr}`,
      `Limited Power of Attorney on file: ${powerOfAttorney || "Not specified"}`,
      `Meeting Date with Funder: ${meetingDate || "Not specified"}`,
      `Desired Training Course: ${desiredCourse || "Not specified"}`,
      `Remedy Seeking: ${remedySeeking || "Not specified"}`,
      `Other Explanation: ${otherExplanation?.trim() || "N/A"}`,
      `File with Workforce Board (Employ Milwaukee): ${fileWithWorkforceBoard || "Not specified"}`,
      ``,
      `CERTIFICATION`,
      `${"-".repeat(30)}`,
      `Signature provided: ${hasSigned ? "YES" : "NO"}`,
      `Certification: "I certify that the information provided is true and accurate. I voluntarily authorize The Mindful Group to submit this complaint to Wisconsin DWD and/or Employ Milwaukee on my behalf as my designated representative."`,
      ``,
      `${"=".repeat(50)}`,
      `Submitted: ${new Date().toLocaleString("en-US", { timeZone: "America/Chicago" })}`,
    ].join("\n");

    const resendKey = process.env.RESEND_API_KEY;

    if (resendKey) {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "Complaint Form <noreply@themindfulgroupinc.org>",
          to: ["Info@TheMindfulGroupInc.Org"],
          subject: `Participant Complaint: ${firstName.trim()} ${lastName.trim()} — ${complaintAbout || "General"}`,
          text: emailBody,
        }),
      });

      if (!res.ok) {
        console.error("Resend API error:", await res.text());
        return Response.json(
          { error: "Failed to submit complaint. Please call us at 833-414-MIND (6463)." },
          { status: 500 }
        );
      }
    } else {
      console.log("Complaint submission (no RESEND_API_KEY):", {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        complaintAbout,
        rightsViolated: rightsStr,
        harmCaused: harmStr,
        timestamp: new Date().toISOString(),
      });
    }

    return Response.json({ success: true });
  } catch {
    console.error("Complaints API error");
    return Response.json(
      { error: "Something went wrong. Please call us at 833-414-MIND (6463)." },
      { status: 500 }
    );
  }
}
