import type { Provenance } from "@/content/media";

/**
 * The one provenance label per media item (plan/13 §E1). The text is typed as
 * the controlled vocabulary in content/media.ts, so a free-form or mislabelled
 * string fails `tsc`. Set in the annotation voice (mono).
 */
export default function ProvenanceLabel({
  children,
  className = "",
}: {
  children: Provenance;
  className?: string;
}) {
  return <span className={`prov ${className}`.trim()}>{children}</span>;
}
