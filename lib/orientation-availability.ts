// Server-side seat availability lookup against the VICTORIA LMS.
//
// Given the ISO datetimes this site generates for upcoming orientations, ask
// VICTORIA how many seats remain in each. Used to show only sessions with open
// seats on the booking form. Server-only — uses the shared Bearer secret.
//
// Fail-open: if VICTORIA is unreachable or the secret is missing, return an
// empty map so the form still shows all generated dates. The webhook remains
// the authoritative cap guard, so failing open here never lets a session
// overbook — it just can't pre-hide full dates in that degraded case.

const VICTORIA_AVAILABILITY = "https://www.victorialms.com/api/orientation-availability";

export async function fetchRemainingByDate(isoDates: string[]): Promise<Record<string, number>> {
  const secret = process.env.BOOKINGS_WEBHOOK_SECRET;
  if (!secret || isoDates.length === 0) return {};

  try {
    const res = await fetch(VICTORIA_AVAILABILITY, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secret}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ dates: isoDates }),
      cache: "no-store",
    });
    if (!res.ok) return {};
    const data = (await res.json()) as {
      availability?: Record<string, { remaining?: number }>;
    };
    const out: Record<string, number> = {};
    for (const [iso, v] of Object.entries(data.availability ?? {})) {
      if (typeof v?.remaining === "number") out[iso] = v.remaining;
    }
    return out;
  } catch {
    return {};
  }
}
