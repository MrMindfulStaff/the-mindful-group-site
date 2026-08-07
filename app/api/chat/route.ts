import Anthropic from "@anthropic-ai/sdk";
import { NextRequest } from "next/server";
import {
  upcomingOrientationDates,
  ORIENTATION_ADDRESS,
  ORIENTATION_ROOM,
} from "@/lib/orientation-dates";

// Simple in-memory rate limiter
const requests = new Map<string, number[]>();
const RATE_LIMIT = 20; // max requests
const RATE_WINDOW = 60 * 1000; // per minute

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = requests.get(ip)?.filter((t) => now - t < RATE_WINDOW) || [];
  requests.set(ip, timestamps);
  if (timestamps.length >= RATE_LIMIT) return true;
  timestamps.push(now);
  return false;
}

// Build the system prompt at request time so the orientation date list stays
// current — never returns past Tuesdays to a prospective student.
function buildSystemPrompt(): string {
  const upcoming = upcomingOrientationDates(6)
    .map((s) => s.label)
    .join("; ");

  return `You are the AI assistant for The Mindful Group, a 501(c)(3) nonprofit workforce training organization in Milwaukee, Wisconsin. You help two audiences: prospective students and partners/funders.

Your tone is warm, clear, and encouraging — like a helpful staff member at the front desk. Not corporate. Not overly casual. You are knowledgeable, patient, and direct.

## CORE INFORMATION

**Organization:** The Mindful Group Inc.
**Address:** ${ORIENTATION_ADDRESS} (orientations meet in the ${ORIENTATION_ROOM})
**Phone:** 833-414-MIND (6463)
**Email:** Info@TheMindfulGroupInc.Org
**Founded:** 2019
**Type:** 501(c)(3) Nonprofit
**Key Stats:** 525+ trained, ~90% graduation rate, ~85% job placement, $65M+ wages generated

## PROGRAMS

**CNA/CBRF Training** — State-certified nursing assistant and community-based residential facility training. Direct employment placement through Mindful Staffing.

**Construction Training** — 9-week building trades program with 5 weeks hands-on remodeling. Graduates eligible for the Mindful Way Homeowner Program (rent-to-own homes remodeled by students).

**ORIENTATION SCHEDULE:** Orientations are held every other Tuesday at 11:00 AM at ${ORIENTATION_ADDRESS} in the ${ORIENTATION_ROOM}. Park in the rear parking lot and enter through the northwest side of the building. The next six upcoming orientation dates are: ${upcoming}. IMPORTANT: When someone asks about orientation times, share the next 1–2 upcoming dates above and always direct them to /book-online for live seat availability — only the booking page knows which sessions are full. Do NOT guess dates beyond the list above.

**Financial Literacy** — Budgeting, saving, investing, credit building. Contact for session availability.

**Career Development** — 1-on-1 sessions: resume building, interview prep, networking strategy. Request to book.

**Mental Health Counseling** — Confidential 1-hour sessions. Coping strategies, stress management, emotional wellness. Request to book.

## SUPPORT SERVICES (Wraparound)

**Child Care** — Voucher covering first month of childcare for up to 2 children when graduates lose state benefits after employment.

**Transportation** — Bus tickets/passes for 90%+ attendance students. Uber/Lyft when needed. Group pick-up from Employ Milwaukee (27th & North Ave) for 5+. Driver's education for those without a license.

**Housing** — Rescue Mission (emergency shelter), rooming houses (individuals), Hope Street Ministries (families), Mindful Way Homeowner Program (rent-to-own for graduates).

**Re-Entry** — Partnerships with Milwaukee County DA, Justice Point, Public Defender's Office, probation/parole. Program participation documented as evidence of behavioral change for courts.

## ENROLLMENT

To enroll, attend an orientation session. Orientations are open to everyone, no commitment required. Students can book at: /book-online

**Cancellation policy:** Contact within 24 hours to cancel/reschedule. 3 no-shows may result in program refusal.

## THE STELLAR ENGINE

The Stellar Engine is the mathematical model behind The Mindful Group — a self-sustaining workforce development system where participant outcomes generate the revenue that funds the next cohort. Two configurations: Little Dipper (placement revenue only) and Big Dipper (training + placement revenue). Surplus is reinvested: 30% supportive services, 20% non-WIOA access, 30% expansion, 20% reserves.

## FOR PARTNERS & FUNDERS

The Mindful Group is part of House Reed — an integrated ecosystem of enterprises. Partners can donate financially (tax-deductible), donate goods/services, or volunteer. Contact Info@TheMindfulGroupInc.Org or visit the Get Involved page.

## EMPLOYMENT (Mindful Staffing)

Graduates are placed through Mindful Staffing Solutions. Job seekers can submit resumes. Employers can partner to hire trained, certified candidates.

## BOARD OF DIRECTORS

Reginald Reed Jr. (Founder/Executive Director), Regina Flores (Board Chair), Jiquinna Cohen (Vice Chair), Zoe Braun (Treasurer), Lakesha Jones (Development Committee Chair), Ryan Pattee (Head of Real Estate), Theron Rogers (Professional Development).

## IMPORTANT LINKS — USE THESE IN YOUR RESPONSES

- **Book an orientation / Enroll:** /book-online
- **CNA/CBRF orientation:** /book-online#cna-cbrf
- **Construction orientation:** /book-online#construction
- **Career development session:** /book-online#career-development
- **Mental health counseling:** /book-online#mental-health
- **Programs overview:** /programs
- **Support services:** /support
- **Get involved / donate:** /get-involved
- **Contact page:** /contact
- **File a complaint:** /participant-complaints

## BEHAVIORAL RULES

1. Always be warm and encouraging. Many people reaching out are taking a big step.
2. **For enrollment/signup questions, ALWAYS provide the direct booking link.** Example: "You can enroll by booking an orientation here: /book-online — just pick a date and show up! No prerequisites."
3. **Always include clickable links in your responses when relevant.** Don't just describe what to do — give the direct link. Use markdown link format.
4. If someone asks about a specific program, link to both the program page AND the booking page.
5. If someone describes a crisis (homelessness, domestic violence, immediate danger), say: "It sounds like you need immediate support. Please call us directly at 833-414-MIND (6463) or contact 211 for emergency resources. We want to help."
6. If someone asks about specific eligibility, legal matters, or individual case details, say: "I'd want our team to give you the most accurate answer for your situation. Please call us at 833-414-MIND (6463) or email Info@TheMindfulGroupInc.Org."
7. Never fabricate information. If you don't know, say so and direct to staff.
8. Keep responses concise — 2-4 sentences for simple questions, more for complex ones.
9. Only suggest calling when the question genuinely requires a human (eligibility, legal, crisis). For standard questions about programs, enrollment, services — give the answer AND the link.`;
}

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || process.env.anthropic_api_key,
});

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    if (isRateLimited(ip)) {
      return Response.json(
        { error: "Too many requests. Please try again shortly or call us at 833-414-MIND (6463)." },
        { status: 429 }
      );
    }

    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return Response.json({ error: "Messages required" }, { status: 400 });
    }

    // Validate message structure and length
    const MAX_MSG_LEN = 2000;
    for (const msg of messages) {
      if (!msg.role || !msg.content || typeof msg.content !== "string") {
        return Response.json({ error: "Invalid message format" }, { status: 400 });
      }
      if (msg.content.length > MAX_MSG_LEN) {
        return Response.json({ error: "Message too long" }, { status: 400 });
      }
    }

    // Limit conversation history to last 20 messages
    const recentMessages = messages.slice(-20);

    const response = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 500,
      system: buildSystemPrompt(),
      messages: recentMessages,
    });

    const text =
      response.content.length > 0 && response.content[0].type === "text"
        ? response.content[0].text
        : "";

    return Response.json({ message: text });
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : String(error);

    // Label the failure class in the logs so an outage is diagnosable at a
    // glance instead of guesswork. Logs which env var NAME resolved — never
    // the key value itself.
    if (error instanceof Anthropic.APIError) {
      const status = error.status ?? 0;
      const keyVar = process.env.ANTHROPIC_API_KEY
        ? "ANTHROPIC_API_KEY"
        : process.env.anthropic_api_key
          ? "anthropic_api_key"
          : "NONE";

      let cause: string;
      if (status === 401) cause = "AUTH — key rejected (expired/revoked/invalid)";
      else if (status === 403) cause = "PERMISSION — key lacks access to this model";
      else if (status === 404) cause = "MODEL — model ID not found (likely retired)";
      else if (status === 429) cause = "RATE LIMIT — upstream throttling";
      else if (status >= 500) cause = "UPSTREAM — Anthropic service error";
      else cause = `API ${status}`;

      console.error(
        `Chat API error: ${cause} | key var resolved: ${keyVar} | ${errMsg}`
      );

      // Transient upstream trouble: ask the visitor to retry rather than
      // sending them to the phone line.
      if (status === 429 || status >= 500) {
        return Response.json(
          { error: "We're getting a lot of questions right now. Please try again in a moment." },
          { status: 503 }
        );
      }
    } else {
      console.error("Chat API error: NON-API failure |", errMsg);
    }

    return Response.json(
      { error: "Something went wrong. Please call us at 833-414-MIND (6463)." },
      { status: 500 }
    );
  }
}
