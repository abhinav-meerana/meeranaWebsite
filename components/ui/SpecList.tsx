/**
 * Key/value spec rows ("Deploys", "Languages"…). Rows with no value are
 * skipped, so an unconfirmed fact is omitted instead of shown as a placeholder.
 */
export default function SpecList({
  rows,
  className = "",
}: {
  rows: { label: string; value?: string }[];
  className?: string;
}) {
  const shown = rows.filter((r) => r.value);
  if (shown.length === 0) return null;
  return (
    <dl className={`spec ${className}`.trim()}>
      {shown.map((r) => (
        <div key={r.label}>
          <dt>{r.label}</dt>
          <dd>{r.value}</dd>
        </div>
      ))}
    </dl>
  );
}
