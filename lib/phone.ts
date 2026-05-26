// Phone normalization → E.164 for SMS delivery.
//
// The booking form requires phone but accepts whatever the user types
// ("(414) 555-1212", "414.555.1212", "+1 414 555 1212"). Twilio needs E.164
// ("+14145551212"). We normalize at the API boundary so:
//   • the LMS stores a single canonical shape (easier to look up later)
//   • the SMS cron can hand the number straight to Twilio without
//     re-parsing
//
// Scope: US numbers only. International would need a real lib (libphonenumber).
// Returns null on anything we can't confidently turn into a valid US E.164.

export function normalizeUsPhone(input: string | null | undefined): string | null {
  if (!input) return null;
  const trimmed = String(input).trim();
  if (!trimmed) return null;

  // Strip everything that isn't a digit. Parens, dashes, dots, spaces,
  // leading +1 — all gone. Then we judge the result by length.
  const digits = trimmed.replace(/\D/g, "");

  // 11-digit US numbers must start with country code 1.
  if (digits.length === 11) {
    if (digits[0] !== "1") return null;
    return `+${digits}`;
  }

  // 10-digit US numbers: prepend +1.
  if (digits.length === 10) {
    // Area codes can't start with 0 or 1 in NANP.
    if (digits[0] === "0" || digits[0] === "1") return null;
    return `+1${digits}`;
  }

  return null;
}
