"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { COMPANY, INTERESTS, type Interest } from "@/content/company";
import { ENQUIRY_API, PRIVACY_URL } from "@/lib/flags";

/* ============================================================================
   The enquiry form (plan/11 §15). Only rendered when both ENQUIRY_API and
   PRIVACY_URL are set at build time (see lib/flags.ts): a form that collects
   personal data must not ship before the endpoint and the privacy notice exist.

   Client validation mirrors the server rules (name 2–120, company ≤160, email
   RFC-ish ≤254, message 20–4000). The server validates again; this is for the
   visitor's benefit only. Abuse protection that belongs here: a honeypot field,
   `elapsed_ms`, and an idempotency key. The Turnstile token is sent empty until
   DL-T05 decides a provider.

   Nothing on this form animates (plan/08 M-home-11).
   ========================================================================== */

type Field = "name" | "company" | "email" | "interest" | "message" | "consent";
type Errors = Partial<Record<Field, string>>;
type Status =
  | { kind: "idle" }
  | { kind: "sending" }
  | { kind: "done"; id?: string }
  | { kind: "error"; message: string; fallback?: boolean };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validate(v: {
  name: string;
  company: string;
  email: string;
  message: string;
  consent: boolean;
}): Errors {
  const e: Errors = {};
  const name = v.name.trim();
  if (name.length < 2 || name.length > 120) e.name = "Enter your name (2–120 characters).";
  if (v.company.trim().length > 160) e.company = "Keep the company name under 160 characters.";
  if (!EMAIL_RE.test(v.email.trim()) || v.email.trim().length > 254)
    e.email = "Enter a work email address, like name@company.com.";
  const msg = v.message.trim();
  if (msg.length < 20) e.message = "Tell us a little more (at least 20 characters).";
  else if (msg.length > 4000) e.message = "Keep the message under 4,000 characters.";
  if (!v.consent) e.consent = "Please confirm you have read the privacy notice.";
  return e;
}

export default function ContactForm({ defaultInterest }: { defaultInterest: Interest }) {
  const pathname = usePathname();

  const [values, setValues] = useState({
    name: "",
    company: "",
    email: "",
    interest: defaultInterest as string,
    message: "",
    consent: false,
    website: "", // honeypot
  });
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  const startedAt = useRef(0);
  const idempotencyKey = useRef("");
  const statusRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    startedAt.current = Date.now();
    idempotencyKey.current = crypto.randomUUID();
  }, []);

  /* Keep the preselected interest in step with the link that brought us here. */
  useEffect(() => {
    setValues((v) => ({ ...v, interest: defaultInterest }));
  }, [defaultInterest]);

  const set = <K extends keyof typeof values>(key: K, value: (typeof values)[K]) =>
    setValues((v) => ({ ...v, [key]: value }));

  const submit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (status.kind === "sending") return; // no double submit

    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      const first = (Object.keys(found) as Field[])[0];
      document.getElementById(`f-${first}`)?.focus();
      return;
    }

    // The campaign parameters are read when the form is sent, not at render.
    const params = new URLSearchParams(window.location.search);
    const utm = {
      source: params.get("utm_source") ?? "",
      medium: params.get("utm_medium") ?? "",
      campaign: params.get("utm_campaign") ?? "",
    };

    setStatus({ kind: "sending" });
    try {
      const res = await fetch(ENQUIRY_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Idempotency-Key": idempotencyKey.current,
        },
        body: JSON.stringify({
          name: values.name.trim(),
          company: values.company.trim(),
          email: values.email.trim(),
          interest: values.interest,
          message: values.message.trim(),
          locale: "en",
          source: { page: pathname, cta: params.get("cta") ?? "", utm },
          consent: { privacy_notice_ack: true, marketing_opt_in: false },
          website: values.website,
          elapsed_ms: Date.now() - startedAt.current,
          turnstile_token: "",
        }),
      });

      if (res.status === 202) {
        const body = (await res.json().catch(() => ({}))) as { id?: string };
        setStatus({ kind: "done", id: body.id });
      } else if (res.status === 422) {
        const body = (await res.json().catch(() => ({}))) as {
          errors?: { field: string; message: string }[];
        };
        const next: Errors = {};
        body.errors?.forEach((e) => {
          if (e.field in values) next[e.field as Field] = e.message;
        });
        setErrors(next);
        setStatus({ kind: "error", message: "Please check the highlighted fields." });
      } else if (res.status === 429) {
        const body = (await res.json().catch(() => ({}))) as { retry_after?: number };
        const mins = body.retry_after ? Math.ceil(body.retry_after / 60) : 10;
        setStatus({
          kind: "error",
          message: `Too many attempts. Please try again in about ${mins} minutes.`,
        });
      } else if (res.status === 409) {
        // A repeated key with a different body: start a fresh attempt.
        idempotencyKey.current = crypto.randomUUID();
        setStatus({ kind: "error", message: "That did not send. Please try once more." });
      } else {
        setStatus({ kind: "error", message: "We could not send that just now.", fallback: true });
      }
    } catch {
      setStatus({ kind: "error", message: "We could not send that just now.", fallback: true });
    }
  };

  /* Move focus to the outcome so it is announced and found. */
  useEffect(() => {
    if (status.kind === "done" || status.kind === "error") statusRef.current?.focus();
  }, [status]);

  if (status.kind === "done") {
    return (
      <div className="form-status is-success" ref={statusRef} tabIndex={-1} role="status">
        <h2 className="t-h3">Thank you. We have your enquiry.</h2>
        <p className="t-small">
          A member of the team will reply from {COMPANY.email}.
          {status.id ? <> Reference: <span className="tnum">{status.id}</span>.</> : null}
        </p>
      </div>
    );
  }

  const err = (f: Field) => (errors[f] ? `e-${f}` : undefined);

  return (
    <form className="form" onSubmit={submit} noValidate aria-label="Enquiry">
      <div className="form-grid">
        <Row id="name" label="Name" error={errors.name}>
          <input
            id="f-name"
            name="name"
            autoComplete="name"
            value={values.name}
            onChange={(e) => set("name", e.target.value)}
            aria-invalid={!!errors.name}
            aria-describedby={err("name")}
            required
          />
        </Row>
        <Row id="email" label="Work email" error={errors.email}>
          <input
            id="f-email"
            name="email"
            type="email"
            autoComplete="email"
            value={values.email}
            onChange={(e) => set("email", e.target.value)}
            aria-invalid={!!errors.email}
            aria-describedby={err("email")}
            required
          />
        </Row>
        <Row id="company" label="Company" error={errors.company} optional>
          <input
            id="f-company"
            name="company"
            autoComplete="organization"
            value={values.company}
            onChange={(e) => set("company", e.target.value)}
            aria-invalid={!!errors.company}
            aria-describedby={err("company")}
          />
        </Row>
        <Row id="interest" label="What is this about?" error={errors.interest}>
          <select
            id="f-interest"
            name="interest"
            value={values.interest}
            onChange={(e) => set("interest", e.target.value)}
          >
            {INTERESTS.map((i) => (
              <option key={i.value} value={i.value}>
                {i.label}
              </option>
            ))}
          </select>
        </Row>
      </div>

      <Row id="message" label="Message" error={errors.message}>
        <textarea
          id="f-message"
          name="message"
          rows={6}
          value={values.message}
          onChange={(e) => set("message", e.target.value)}
          aria-invalid={!!errors.message}
          aria-describedby={err("message")}
          required
        />
      </Row>

      {/* Honeypot: hidden from people and assistive technology; bots fill it. */}
      <div className="form-hp" aria-hidden="true">
        <label>
          Leave this empty
          <input
            tabIndex={-1}
            autoComplete="off"
            name="website"
            value={values.website}
            onChange={(e) => set("website", e.target.value)}
          />
        </label>
      </div>

      <div className="form-row">
        <label className="form-check">
          <input
            id="f-consent"
            type="checkbox"
            checked={values.consent}
            onChange={(e) => set("consent", e.target.checked)}
            aria-invalid={!!errors.consent}
            aria-describedby={err("consent")}
          />
          <span>
            I have read the{" "}
            <a className="link-quiet" href={PRIVACY_URL}>
              privacy notice
            </a>
            .
          </span>
        </label>
        {errors.consent ? (
          <p className="form-error" id="e-consent">
            {errors.consent}
          </p>
        ) : null}
      </div>

      <div ref={statusRef} tabIndex={-1} role="status" aria-live="polite" className="form-status-live">
        {status.kind === "error" ? (
          <p className="form-error">
            {status.message}{" "}
            {status.fallback ? (
              <>
                You can email us at{" "}
                <a className="link-quiet" href={`mailto:${COMPANY.email}`}>
                  {COMPANY.email}
                </a>
                .
              </>
            ) : null}
          </p>
        ) : null}
      </div>

      <button className="btn btn-primary" type="submit" disabled={status.kind === "sending"}>
        {status.kind === "sending" ? "Sending…" : "Send enquiry"}
      </button>
    </form>
  );
}

function Row({
  id,
  label,
  error,
  optional,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  optional?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="form-row">
      <label htmlFor={`f-${id}`}>
        {label}
        {optional ? <span className="form-opt"> (optional)</span> : null}
      </label>
      {children}
      {error ? (
        <p className="form-error" id={`e-${id}`}>
          {error}
        </p>
      ) : null}
    </div>
  );
}
