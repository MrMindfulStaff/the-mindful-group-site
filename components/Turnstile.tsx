"use client";

// Cloudflare Turnstile widget — bot protection for our public forms.
//
// Why this shape: Turnstile renders its own iframe and writes the resulting
// token into a hidden <input name="cf-turnstile-response">. Our forms read the
// element by name and forward the token in the POST body as `turnstileToken`
// — no React state involvement, no re-render loops.
//
// If NEXT_PUBLIC_TURNSTILE_SITE_KEY is unset (early dev, or we disable it
// temporarily), this component renders nothing and the server-side helper
// also no-ops. Forms keep working — just without the bot challenge.

import Script from "next/script";

interface Props {
  // Cloudflare appearance modes: "always" | "execute" | "interaction-only".
  // We use "always" so users see they're being checked (transparency) but the
  // challenge is usually non-interactive.
  appearance?: "always" | "execute" | "interaction-only";
  className?: string;
}

export default function Turnstile({ appearance = "always", className }: Props) {
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  if (!siteKey) return null;

  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js"
        strategy="lazyOnload"
        async
        defer
      />
      <div
        className={`cf-turnstile ${className ?? ""}`}
        data-sitekey={siteKey}
        data-appearance={appearance}
      />
    </>
  );
}

// Helper for form `onSubmit` handlers to read the token from the form.
// Returns null when Turnstile isn't configured (caller should treat as OK).
export function readTurnstileToken(form: HTMLFormElement): string | null {
  const el = form.elements.namedItem("cf-turnstile-response") as HTMLInputElement | null;
  return el?.value || null;
}
