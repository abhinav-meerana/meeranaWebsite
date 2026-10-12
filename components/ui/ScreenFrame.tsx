import type { CSSProperties } from "react";
import type { Screen } from "@/content/media";
import ProvenanceLabel from "./ProvenanceLabel";

/**
 * A real product screen, in a hairline frame, with its one provenance label.
 *
 * The image is never shown larger than its intrinsic size (`max-width`), and
 * `width`/`height` reserve the box before decode, so a slow load cannot shift
 * the layout. `bare` cut-outs (transparent background) are drawn without a
 * frame.
 *
 * Options (FINAL-SPEC §6.1):
 *   · `fit` caps the image at the stage's media height, so a screen never
 *     pushes a scene past the frame. The width is set from that height and
 *     the file's aspect ratio (`--ar`), capped at the column, so the box is
 *     right before the image decodes (no layout shift when a lazy screen
 *     arrives) and the callouts drawn over it scale with it;
 *   · `callouts` draws the screen's own `labels` as rings, leaders and chips
 *     over the image box. They are aria-hidden: the alt text and the scene
 *     copy carry the meaning, and every chip's text is printed in the image;
 *   · a screen with `labelInAsset` prints its own provenance, so the label is
 *     kept for assistive technology only;
 *   · `priority` is for the title scene's screen only (fetchpriority high).
 *
 * Motion hooks (§6.2): `.screen`, `.callout`, `.callout-line`,
 * `.callout-label`. None has a transform, opacity or visibility rest state.
 */

/** Labels up to this many characters stay on one line, so a chip covers as
 * little of the screen as possible; longer ones wrap (app/viz.css). */
const SHORT_LABEL = 14;

export default function ScreenFrame({
  screen,
  eager = false,
  priority = false,
  fit = false,
  callouts = false,
  className = "",
  sizes,
}: {
  screen: Screen;
  /** Eager for anything near the first viewport; lazy otherwise. */
  eager?: boolean;
  /** The page's most important image: eager, with fetchpriority high. */
  priority?: boolean;
  /** Cap the height at the stage content box (`.is-fit`). */
  fit?: boolean;
  /** Draw `screen.labels` as callouts. */
  callouts?: boolean;
  className?: string;
  sizes?: string;
}) {
  const labels = callouts ? (screen.labels ?? []).slice(0, 3) : [];
  const classes = ["screen", screen.bare && "is-bare", fit && "is-fit", labels.length > 0 && "has-callouts", className]
    .filter(Boolean)
    .join(" ");

  return (
    <figure
      className={classes}
      style={{ maxWidth: screen.width, "--ar": (screen.width / screen.height).toFixed(4) } as CSSProperties}
    >
      <div className="screen-box">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={screen.src}
          alt={screen.alt}
          width={screen.width}
          height={screen.height}
          sizes={sizes}
          loading={eager || priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : undefined}
          decoding="async"
        />
        {labels.length > 0 ? (
          <ol className="callouts" aria-hidden="true">
            {labels.map((l, i) => (
              <li
                key={i}
                className="callout"
                data-side={l.side ?? "right"}
                data-short={(l.text ?? l.note ?? "").length <= SHORT_LABEL || undefined}
                style={{ "--x": l.at[0], "--y": l.at[1] } as CSSProperties}
              >
                <span className="callout-ring" />
                <span className="callout-line" />
                <span className="callout-label">{l.text ?? l.note}</span>
              </li>
            ))}
          </ol>
        ) : null}
      </div>
      <figcaption className={screen.labelInAsset ? "sr-only" : undefined}>
        <ProvenanceLabel>{screen.provenance}</ProvenanceLabel>
      </figcaption>
    </figure>
  );
}
