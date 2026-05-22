// Orientation scheduling — CNA/CBRF and Construction orientations run
// "every other Tuesday at 11:30 AM" Central. We generate the upcoming
// biweekly Tuesdays here so the booking form always shows real, correct dates
// without anyone hand-maintaining a list.
//
// ⚠️ ANCHOR_ISO_DATE must be a real, confirmed orientation Tuesday. All dates
// are computed as ANCHOR + N×14 days, so if this is off by a week, every
// offered date is wrong. Confirm with staff and update if needed.

const ANCHOR_ISO_DATE = "2026-05-26"; // a Tuesday — CONFIRM this is a real orientation date
const ORIENTATION_HOUR = 11;
const ORIENTATION_MINUTE = 30;
const TZ = "America/Chicago";
const DAY_MS = 86_400_000;

// Offset (minutes east of UTC; negative in the Americas) for a timezone at a
// given instant. Uses Intl longOffset ("GMT-05:00") so DST is handled.
function tzOffsetMinutes(instant: Date, timeZone: string): number {
  const s = instant.toLocaleString("en-US", { timeZone, timeZoneName: "longOffset" });
  const m = s.match(/GMT([+-])(\d{2}):(\d{2})/);
  if (!m) return -360; // fall back to CST
  const sign = m[1] === "-" ? -1 : 1;
  return sign * (parseInt(m[2], 10) * 60 + parseInt(m[3], 10));
}

// Convert a wall-clock time in `timeZone` to a UTC ISO string. 11:30 AM is far
// from the 2 AM DST boundary, so the single-pass offset lookup is exact here.
function wallTimeToISO(y: number, mo: number, d: number, hh: number, mm: number, timeZone: string): string {
  const guess = new Date(Date.UTC(y, mo - 1, d, hh, mm));
  const offset = tzOffsetMinutes(guess, timeZone);
  return new Date(Date.UTC(y, mo - 1, d, hh, mm) - offset * 60_000).toISOString();
}

export interface OrientationSlot {
  iso: string;   // full ISO datetime (UTC Z) of the 11:30 AM Central session
  label: string; // e.g. "Tuesday, June 2, 2026"
}

// Returns the next `count` biweekly orientation Tuesdays at or after `from`.
export function upcomingOrientationDates(count = 8, from: Date = new Date()): OrientationSlot[] {
  const [ay, am, ad] = ANCHOR_ISO_DATE.split("-").map(Number);
  const anchorDay = Date.UTC(ay, am - 1, ad);
  const fromDay = Date.UTC(from.getUTCFullYear(), from.getUTCMonth(), from.getUTCDate());

  // Number of 14-day steps from anchor to land on or after today
  let k = Math.ceil((fromDay - anchorDay) / (14 * DAY_MS));
  if (k < 0) k = 0;

  const slots: OrientationSlot[] = [];
  for (let i = 0; i < count; i++) {
    const dayMs = anchorDay + (k + i) * 14 * DAY_MS;
    const dt = new Date(dayMs);
    const y = dt.getUTCFullYear();
    const mo = dt.getUTCMonth() + 1;
    const d = dt.getUTCDate();
    slots.push({
      iso: wallTimeToISO(y, mo, d, ORIENTATION_HOUR, ORIENTATION_MINUTE, TZ),
      label: dt.toLocaleDateString("en-US", {
        weekday: "long", year: "numeric", month: "long", day: "numeric", timeZone: "UTC",
      }),
    });
  }
  return slots;
}

// Service-name strings the VICTORIA webhook classifies into the orientation
// pipeline. These MUST contain the routing keywords (cna/cbrf/construction).
export const ORIENTATION_PROGRAMS = {
  "cna-cbrf":     "CNA/CBRF Training Orientation",
  "construction": "Construction Training Orientation",
} as const;

export type OrientationProgramId = keyof typeof ORIENTATION_PROGRAMS;
