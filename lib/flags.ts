/**
 * Build-time switches. Read once at build: the site is a static export, so these
 * are inlined into the bundle and cannot change at runtime.
 *
 * PREVIEW (NEXT_PUBLIC_PREVIEW=1)
 *   An internal review build. It adds the prototype note to the footer and
 *   shows content the evidence register still marks `confirm-with-meerana`,
 *   each item flagged "Unconfirmed". A production build (the default) never
 *   shows either — meerana-frontend skill, "content:check" rule.
 *
 * ENQUIRY_API (NEXT_PUBLIC_ENQUIRY_API=https://…/v1/enquiries)
 *   The enquiry endpoint from plan/11 §15. Until it exists (DL-T04) the contact
 *   page offers email only.
 *
 * PRIVACY_URL (NEXT_PUBLIC_PRIVACY_URL=/privacy/)
 *   The form collects personal data, so it stays off until a privacy notice is
 *   published (DL-T06, UAE PDPL). Both this and ENQUIRY_API must be set.
 */
export const PREVIEW = process.env.NEXT_PUBLIC_PREVIEW === "1";

export const ENQUIRY_API = process.env.NEXT_PUBLIC_ENQUIRY_API ?? "";

export const PRIVACY_URL = process.env.NEXT_PUBLIC_PRIVACY_URL ?? "";

export const FORM_ENABLED = Boolean(ENQUIRY_API && PRIVACY_URL);
