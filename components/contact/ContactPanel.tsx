"use client";

import { useEffect, useState } from "react";
import { COMPANY, INTERESTS, type Interest } from "@/content/company";
import { FORM_ENABLED } from "@/lib/flags";
import CopyEmail from "@/components/ui/CopyEmail";
import ContactForm from "./ContactForm";

const PRODUCT_VALUES = new Set<string>([
  "mandoobee",
  "tasree3",
  "nazo",
  "yisbir",
  "wasel",
  "ai-in-a-box",
]);

function parseInterest(raw: string | null): Interest {
  return INTERESTS.some((i) => i.value === raw) ? (raw as Interest) : "other";
}

/** The email subject carries the topic only: never any personal data. */
export function subjectFor(interest: Interest): string {
  const label = INTERESTS.find((i) => i.value === interest)?.label ?? "Enquiry";
  if (interest === "other") return "Enquiry";
  return PRODUCT_VALUES.has(interest) ? `${label} briefing request` : `${label} enquiry`;
}

/**
 * The contact actions. `?interest=` (from every product call to action)
 * preselects the topic. While the enquiry endpoint and privacy notice do not
 * exist, the page offers email only, with the topic in the subject line.
 */
export default function ContactPanel() {
  /* The query string is read after mount rather than with `useSearchParams`,
     which would need a Suspense boundary in a static export and leave a gap that
     the panel then pops into (a layout shift of 0.2 measured by Lighthouse). The
     server-rendered panel is the full panel with the neutral topic; mounting only
     changes the selected option, so nothing moves. */
  const [interest, setInterest] = useState<Interest>("other");

  useEffect(() => {
    setInterest(parseInterest(new URLSearchParams(window.location.search).get("interest")));
  }, []);

  if (FORM_ENABLED) return <ContactForm defaultInterest={interest} />;

  const subject = subjectFor(interest);
  const href = `mailto:${COMPANY.email}?subject=${encodeURIComponent(subject)}`;

  return (
    <div className="mail-panel card">
      <div className="form-row">
        <label htmlFor="f-topic">What is this about?</label>
        <select
          id="f-topic"
          value={interest}
          onChange={(e) => setInterest(e.target.value as Interest)}
        >
          {INTERESTS.map((i) => (
            <option key={i.value} value={i.value}>
              {i.label}
            </option>
          ))}
        </select>
      </div>

      <div className="mail-actions">
        <a className="btn btn-primary" href={href}>
          Email Meerana
        </a>
        <CopyEmail email={COMPANY.email} subject={subject} />
      </div>

      <p className="annot">Subject line: {subject}</p>
    </div>
  );
}
