"use client";

import { useState } from "react";

export default function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          setTimeout(() => setCopied(false), 2500);
        } catch {
          setCopied(false);
        }
      }}
      className="inline-flex items-center justify-center rounded-md border border-primary px-5 py-3 text-sm font-semibold text-primary hover:bg-primary/5 transition-colors"
    >
      {copied ? "Copied!" : "Copy the whole email"}
    </button>
  );
}
