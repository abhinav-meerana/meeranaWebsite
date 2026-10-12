/**
 * The brand's isometric lattice, as a quiet field behind content.
 *
 * Drawn in CSS (two crossing 30° line sets, faded toward the edges), tinted by
 * the surrounding `--p-accent` at low alpha. It replaces the AI-generated
 * plates: it carries no claim, costs no image bytes, and is the same geometry as
 * the Meerana symbol. `aria-hidden`; at most one per viewport (plan/09 §6).
 *
 * `assemble` plays the page's single signature motion once: the field resolves
 * from the horizon down. It is a CSS animation, off under reduced motion.
 */
export default function LatticeField({
  className = "",
  assemble = false,
}: {
  className?: string;
  assemble?: boolean;
}) {
  return (
    <div
      className={`lattice ${assemble ? "is-assemble" : ""} ${className}`.trim()}
      aria-hidden="true"
    />
  );
}
