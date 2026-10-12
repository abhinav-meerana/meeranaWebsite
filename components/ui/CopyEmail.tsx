"use client";

import { useState } from "react";

/**
 * The email address as a plain mailto link, with a copy button. The status text
 * is announced politely; nothing here animates.
 */
export default function CopyEmail({
  email,
  subject,
  className = "",
}: {
  email: string;
  /** Optional subject. Never carries personal data. */
  subject?: string;
  className?: string;
}) {
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setState("copied");
    } catch {
      setState("failed");
    }
    window.setTimeout(() => setState("idle"), 2400);
  };

  const href = subject
    ? `mailto:${email}?subject=${encodeURIComponent(subject)}`
    : `mailto:${email}`;

  return (
    <span className={`copy-email ${className}`.trim()}>
      <a className="link-quiet" href={href}>
        {email}
      </a>
      <button type="button" className="btn-copy" onClick={copy}>
        Copy address
      </button>
      <span className="sr-only" role="status" aria-live="polite">
        {state === "copied"
          ? "Email address copied"
          : state === "failed"
            ? "Could not copy. Select the address instead."
            : ""}
      </span>
      {state === "copied" ? (
        <span className="copy-note" aria-hidden="true">
          Copied
        </span>
      ) : null}
    </span>
  );
}
