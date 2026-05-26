// Server-side verification of Cloudflare Turnstile tokens.
//
// Each public form POST passes `turnstileToken` in the JSON body. Routes call
// `verifyTurnstileToken(token, remoteIp)` before doing real work and reject
// requests that fail.
//
// No-op behavior: if TURNSTILE_SECRET_KEY is unset we skip verification and
// return ok=true, so the bot challenge can be toggled with env vars alone.
// In production we expect it to always be set.

const SECRET = process.env.TURNSTILE_SECRET_KEY;

export interface TurnstileResult {
  ok: boolean;
  reason?: string;
}

export async function verifyTurnstileToken(
  token: string | null | undefined,
  remoteIp?: string | null
): Promise<TurnstileResult> {
  // If we haven't configured Turnstile, skip — the rate limiter is the only
  // line of defense in that case. Logged-by-deployment: this is intentional
  // until we set the secret.
  if (!SECRET) return { ok: true };

  if (!token) {
    return { ok: false, reason: "missing_token" };
  }

  const form = new URLSearchParams();
  form.set("secret",   SECRET);
  form.set("response", token);
  if (remoteIp) form.set("remoteip", remoteIp);

  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: form.toString(),
    });
    if (!res.ok) return { ok: false, reason: `siteverify_http_${res.status}` };
    const json = (await res.json().catch(() => ({}))) as {
      success?: boolean;
      "error-codes"?: string[];
    };
    if (json.success) return { ok: true };
    return { ok: false, reason: (json["error-codes"] || []).join(",") || "turnstile_failed" };
  } catch (e) {
    return { ok: false, reason: (e as Error).message };
  }
}
