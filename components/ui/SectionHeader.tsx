import type { ReactNode } from "react";

/**
 * Section header: an annotation, the H2, an optional caption.
 *
 * The heading is plain static markup. It is never wrapped in a reveal, so no
 * heading depends on animation to be visible (DEPTH-DIRECTION §6).
 */
export default function SectionHeader({
  id,
  annotation,
  children,
  caption,
  level = 2,
  className = "",
}: {
  id: string;
  annotation?: string;
  children: ReactNode;
  caption?: ReactNode;
  level?: 1 | 2;
  className?: string;
}) {
  const Tag = level === 1 ? "h1" : "h2";
  return (
    <header className={`sec-head ${className}`.trim()}>
      {annotation ? <p className="annot">{annotation}</p> : null}
      <Tag id={id} className={level === 1 ? "t-display" : "t-h2"}>
        {children}
      </Tag>
      {caption ? <p className="t-lede sec-caption">{caption}</p> : null}
    </header>
  );
}
