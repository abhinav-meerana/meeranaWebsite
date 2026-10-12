import type { CSSProperties, ReactNode } from "react";
import Link from "next/link";
import type { Provenance } from "@/content/media";
import { SHOWCASE } from "@/content/showcase";
import type { ProductStory, Scene, Viz } from "@/content/storyboards";
import ProvenanceLabel from "@/components/ui/ProvenanceLabel";
import ScreenFrame from "@/components/ui/ScreenFrame";

/* ============================================================================
   Scene visuals (owner B; moved from components/story/BeatVisual.tsx).

   Every visual draws ONLY the data its scene carries (`scene.viz`,
   `scene.steps`, `scene.features`, `scene.cases`). There are no fallback
   labels, so one product's vocabulary can never appear on another's page.

   Drawing language (FINAL-SPEC §6.1, the "drafting floor"):
     · nodes are hairline rectangles (1 px --line-strong) on --ink-900, given
       a body by two receding faces at 30° (`.viz-slab`, app/viz.css);
     · flow edges are 1.5 px --p-line; problems are dashed in --p-accent;
     · true isometric solids (the layer planes, the hub core) use
       iso(x, y, z): X = (x − y)·cos30°, Y = (x + y)·sin30° − z, with the
       accent on the front edges;
     · every label is HTML, never SVG <text>, at ≥12 px and ≥4.5:1.

   Four families, marked on the root as `data-viz` so the stage can treat
   them differently (phones hide only drawings that echo a list):
     · "screen"  a real product screen, framed, with the media's provenance;
     · "drawing" an aria-hidden echo of the copy (split, lanes, tiles, flow,
                 layers, wall, phone, records, system, boundary), with the
                 scene's provenance label exposed;
     · "list"    real lists (steps as stations, grid, cases, ports, chain,
                 columns). Those that are the only copy of their content are
                 never hidden; a ports or chain list beside a facts list
                 repeats the facts and sits in `.viz-art`, so phones drop it
                 like a drawing (see Listing);
     · "type"    the title ribbon (aria-hidden: it repeats the hero copy);
     · "link"    the next-product card.

   Motion hook contract (FINAL-SPEC §6.2). components/stage/choreo.ts targets
   these class names; neither owner renames one without the other:
     split    .viz-col  .viz-node  .viz-node.is-warn  .viz-divide
     lanes    .viz-lane  .viz-lane-path
     tiles    .viz-tile
     flow     .viz-box  .viz-edge  .viz-rework
     steps    .viz-stations  .viz-rail  .viz-station  .viz-station-tick
              .viz-station-n  .viz-station-l  .viz-station-copy
     grid     .viz-grid-list > li[data-d]          (d = row + col)
     layers   .viz-layer[style="--i:k"]  .viz-layer-name
     wall     .viz-cam[data-order]  .viz-scan
     phone    .viz-phone-body  .viz-phone-row
     records  .viz-record  .viz-record-rule  .viz-scan
     system   .viz-hub  .viz-sys-node   (no hub: the nodes are also
              `.viz-node.is-warn`, so the problem choreography lands them last)
     screen   .screen  .callout  .callout-line  .callout-label
     ribbon   .viz-ribbon-word
     cases    .viz-case
     ports    .port-in  .port-core  .port-wire  .port-out
     boundary .boundary-edge[data-edge]  .boundary-node  .boundary-caption
     chain    .chain-node  .chain-edge  .chain-branches
     columns  .viz-column  .viz-column li
     next     .next-card
   No hook element carries a CSS transform, opacity < 1 or visibility rest
   state: GSAP applies `from` states in stage mode only, so the rail, the list
   and reduced motion always show the final state.

   Hook elements carry no CSS `translate`, `rotate` or `scale` either: GSAP
   3.15 folds those into its own transform the first time it touches an
   element (CSSPlugin `_parseTransform`), so an absolute tween to y: 0 would
   erase the offset. Static offsets on hooks are layout (`top`, margins);
   only non-hook children use `translate`. The Yisbir layer fan is therefore
   placed by `top`: a layer's stacked from-state is
   y = −(layer.offsetTop − firstLayer.offsetTop), tweening to y: 0.
   ========================================================================== */

/** Image sizes for a stage screen (FINAL-SPEC §4.10). */
const SIZES = "(min-width: 1024px) 46vw, 92vw";

/** Columns of the features grid at stage sizes; `data-d` is row + col. */
const GRID_COLS = 2;

const pad = (i: number) => String(i).padStart(2, "0");

/** A data error. Logged in development; never thrown, so one bad scene cannot
 * take down the shared dev server. scripts/content-check.mjs is the gate. */
function fail(scene: Scene, message: string): null {
  if (process.env.NODE_ENV !== "production") {
    console.error(`SceneVisual: scene "${scene.id}" ${message}`);
  }
  return null;
}

export type SceneVisualProps = {
  scene: Scene;
  /** The page's story: its name marks the product's own node in a boundary. */
  story: ProductStory;
  /** Eager for the first scenes; lazy (and upgraded by the engine) otherwise. */
  eager?: boolean;
};

export default function SceneVisual({ scene, story, eager = false }: SceneVisualProps) {
  const v = scene.viz;

  switch (v.kind) {
    case "none":
      return null;

    case "screen":
      return (
        <ScreenFrame
          screen={v.screen}
          eager={eager}
          priority={scene.kind === "title"}
          fit
          callouts={scene.callouts}
          sizes={SIZES}
        />
      );

    case "next":
      return <NextCard slug={v.slug} eager={eager} />;

    case "ribbon":
      /* Type, not a picture: it repeats the hero copy, so it is hidden from
         assistive technology and needs no provenance. */
      return (
        <div className="viz viz-ribbon" data-viz="type" aria-hidden="true">
          <ol className="viz-ribbon-words" data-count={v.words.length}>
            {v.words.map((w, i) => (
              <li key={w} className="viz-ribbon-word" style={{ "--k": i } as CSSProperties}>
                <span className="viz-ribbon-n tnum">{pad(i + 1)}</span>
                <span className="viz-ribbon-t">{w}</span>
              </li>
            ))}
          </ol>
        </div>
      );

    /* ---- real lists ---- */
    case "steps":
      return scene.steps?.length ? (
        <Listing kind="steps" provenance={scene.provenance}>
          <Stations steps={scene.steps} />
        </Listing>
      ) : (
        fail(scene, `is a "steps" visual with no steps`)
      );
    case "grid":
      /* No provenance gate (FINAL-SPEC §6.1): a features list is not a picture. */
      return scene.features?.length ? (
        <Listing kind="grid" provenance={scene.provenance}>
          <Grid features={scene.features} />
        </Listing>
      ) : (
        fail(scene, `is a "grid" visual with no features`)
      );
    case "cases":
      return scene.cases?.length ? (
        <Listing kind="cases" provenance={scene.provenance}>
          <Cases cases={scene.cases} />
        </Listing>
      ) : (
        fail(scene, `is a "cases" visual with no cases`)
      );
    case "columns":
      return (
        <Listing kind="columns" provenance={scene.provenance}>
          <Columns v={v} />
        </Listing>
      );
    case "ports":
      return (
        <Listing kind="ports" provenance={scene.provenance} echo={Boolean(scene.facts?.length)}>
          <Ports v={v} />
        </Listing>
      );
    case "chain":
      return (
        <Listing kind="chain" provenance={scene.provenance} echo={Boolean(scene.facts?.length)}>
          <Chain v={v} />
        </Listing>
      );

    /* ---- drawings ---- */
    default: {
      if (!scene.provenance) return fail(scene, "draws a diagram but has no provenance");
      return (
        <figure className={`viz viz-${v.kind}`} data-viz="drawing">
          <div className="viz-art" aria-hidden="true">
            {drawing(v, story)}
          </div>
          <figcaption>
            <ProvenanceLabel>{scene.provenance}</ProvenanceLabel>
          </figcaption>
        </figure>
      );
    }
  }
}

type Drawing = Exclude<
  Viz,
  { kind: "none" | "screen" | "next" | "ribbon" | "steps" | "grid" | "cases" | "columns" | "ports" | "chain" }
>;

function drawing(v: Drawing, story: ProductStory): ReactNode {
  switch (v.kind) {
    case "split":
      return <Split v={v} />;
    case "lanes":
      return <Lanes v={v} />;
    case "tiles":
      return <Tiles items={v.items} />;
    case "flow":
      return <Flow nodes={v.nodes} rework={v.rework} />;
    case "layers":
      return <Layers layers={v.layers} />;
    case "wall":
      return <Wall />;
    case "phone":
      return <Phone v={v} />;
    case "records":
      return <Records rows={v.rows} />;
    case "system":
      return <System v={v} />;
    case "boundary":
      return <Boundary v={v} core={story.name} />;
  }
}

/**
 * A visual that is content: its lists are exposed, with an optional
 * provenance label under them.
 *
 * `echo` marks a list that repeats the scene's facts (ports and chains beside
 * a facts list). It goes in `.viz-art`, the stage's mark for a drawing that
 * phones leave out because the copy column carries the same content
 * (FINAL-SPEC §4.9; app/stage.css). It stays a real list wherever it shows.
 */
function Listing({
  kind,
  provenance,
  echo = false,
  children,
}: {
  kind: Viz["kind"];
  provenance?: Provenance;
  echo?: boolean;
  children: ReactNode;
}) {
  const body = echo ? <div className="viz-art">{children}</div> : children;
  if (!provenance) {
    return (
      <div className={`viz viz-${kind}`} data-viz="list">
        {body}
      </div>
    );
  }
  return (
    <figure className={`viz viz-${kind}`} data-viz="list">
      {body}
      <figcaption>
        <ProvenanceLabel>{provenance}</ProvenanceLabel>
      </figcaption>
    </figure>
  );
}

/* ---- isometric solids ---------------------------------------------------- */

const COS30 = Math.cos(Math.PI / 6);

/** iso(x, y, z) → screen [X, Y] (FINAL-SPEC §6.1). */
function iso(x: number, y: number, z: number): [number, number] {
  return [(x - y) * COS30, (x + y) * 0.5 - z];
}

const poly = (...p: [number, number, number][]) =>
  p.map((q) => iso(...q).map((n) => n.toFixed(2)).join(",")).join(" ");

/**
 * An isometric box, w × d × h, drawn as its three visible faces (top, the
 * left-front +y face and the right-front +x face), with the accent on the
 * front edges. Strokes do not scale, so a box drawn at any size keeps 1 px
 * lines.
 */
function IsoBox({ w, d, h, className = "" }: { w: number; d: number; h: number; className?: string }) {
  const vb = [-d * COS30, -h, (w + d) * COS30, h + (w + d) / 2].map((n) => n.toFixed(2)).join(" ");
  const front: [number, number, number] = [w, d, 0];
  return (
    <svg className={`iso-box ${className}`.trim()} viewBox={vb} preserveAspectRatio="xMidYMid meet">
      <polygon className="iso-top" points={poly([0, 0, h], [w, 0, h], [w, d, h], [0, d, h])} />
      <polygon className="iso-left" points={poly([0, d, 0], [w, d, 0], [w, d, h], [0, d, h])} />
      <polygon className="iso-right" points={poly([w, 0, 0], [w, d, 0], [w, d, h], [w, 0, h])} />
      <polyline className="iso-edge" points={poly([0, d, 0], front, [w, 0, 0])} />
      <polyline className="iso-edge" points={poly(front, [w, d, h])} />
    </svg>
  );
}

/* ---- split: two lists side by side -------------------------------------- */

function Split({ v }: { v: Extract<Viz, { kind: "split" }> }) {
  /* The longer column sets the node pitch, so the drawing fits the media
     height however many steps "as it runs" has (app/viz.css). */
  const rows = Math.max(v.left.items.length, v.right.items.length);
  return (
    <div className="viz-split-cols" style={{ "--rows": rows } as CSSProperties}>
      <div className="viz-col">
        <p className="annot viz-col-label">{v.left.label}</p>
        <ol className="viz-col-chain">
          {v.left.items.map((s, i) => (
            <li key={s + i} className="viz-node viz-slab">
              {s}
            </li>
          ))}
        </ol>
      </div>
      <span className="viz-divide" />
      <div className="viz-col is-problem">
        <p className="annot viz-col-label">{v.right.label}</p>
        <ol className="viz-col-chain">
          {v.right.items.map((s, i) => (
            <li key={s + i} className={`viz-node viz-slab ${v.right.warn?.includes(s) ? "is-warn" : ""}`.trim()}>
              {s}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

/* ---- lanes: one case crossing departments -------------------------------- */

function Lanes({ v }: { v: Extract<Viz, { kind: "lanes" }> }) {
  const n = v.lanes.length;
  /* One stop per lane, moving right as the case moves down. The path is drawn
     in a 100 × 100 box over the cells, with orthogonal steps between stops. */
  const xs = v.lanes.map((_, i) => 10 + (i * 80) / Math.max(1, n - 1));
  const ys = v.lanes.map((_, i) => ((i + 0.5) * 100) / n);
  const d = xs.map((x, i) => (i === 0 ? `M0 ${ys[0]} H${x}` : `V${ys[i]} H${x}`)).join(" ") + " H100";
  return (
    <div className="viz-lanes-wrap">
      <p className="annot viz-lanes-cap">{v.caption}</p>
      <div className="viz-lanes-grid" style={{ "--n": n } as CSSProperties}>
        {v.lanes.map((l, i) => (
          <div className="viz-lane" key={l}>
            <span className="viz-lane-name">{l}</span>
            <span className="viz-lane-cell">
              <span className="viz-lane-stop" style={{ left: `${xs[i]}%` }} />
            </span>
          </div>
        ))}
        <svg className="viz-lane-path" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path d={d} />
        </svg>
      </div>
    </div>
  );
}

/* ---- tiles: standing slabs (cap 9; never an orphan in two columns) ------ */

function Tiles({ items }: { items: string[] }) {
  const shown = items.slice(0, 9);
  return (
    <ul className="viz-tiles-list" data-count={shown.length}>
      {shown.map((t, i) => (
        <li key={t} className="viz-tile viz-slab">
          <span className="viz-tile-n tnum">{pad(i + 1)}</span>
          <span className="viz-tile-t">{t}</span>
        </li>
      ))}
    </ul>
  );
}

/* ---- flow: a process graph ---------------------------------------------- */

/**
 * A left-to-right chain of slabs. With `rework`, the node named "Rework"
 * leaves the chain and hangs below the edge it interrupts, on a dashed loop
 * from the node before it to the node after it.
 */
function Flow({ nodes, rework }: { nodes: string[]; rework?: boolean }) {
  const r = rework ? nodes.indexOf("Rework") : -1;
  const chain = nodes.filter((_, i) => i !== r);
  const loop = r > 0 && r < nodes.length - 1;
  return (
    <div className="viz-flow-grid" style={{ "--n": chain.length } as CSSProperties}>
      <ol className="viz-flow-row">
        {chain.map((label, i) => (
          <li key={label} className="viz-box viz-slab">
            {label}
            {i < chain.length - 1 ? <span className="viz-edge" /> : null}
          </li>
        ))}
      </ol>
      {loop ? (
        /* Grid columns r and r + 1 (1-based) are the nodes either side. */
        <div className="viz-rework" style={{ gridColumn: `${r} / ${r + 2}` }}>
          <span className="viz-rework-loop" />
          <span className="viz-box viz-slab is-warn">{nodes[r]}</span>
        </div>
      ) : null}
    </div>
  );
}

/* ---- steps as stations: the only copy of the steps ---------------------- */

function Stations({ steps }: { steps: { label: string; copy: string }[] }) {
  return (
    <div className="viz-stations-wrap" style={{ "--n": steps.length } as CSSProperties}>
      <span className="viz-rail" aria-hidden="true" />
      <ol className="viz-stations">
        {steps.map((s, i) => (
          <li key={s.label} className="viz-station">
            <span className="viz-station-tick" aria-hidden="true" />
            <span className="viz-station-head">
              <span className="viz-station-n tnum" aria-hidden="true">
                {pad(i + 1)}
              </span>
              <span className="viz-station-l">{s.label}</span>
            </span>
            <span className="viz-station-copy">{s.copy}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

/* ---- grid: the features list, a contact sheet of slabs ------------------ */

function Grid({ features }: { features: string[] }) {
  return (
    <ul className="viz-grid-list">
      {features.map((f, i) => (
        <li key={f} className="viz-slab" data-d={Math.floor(i / GRID_COLS) + (i % GRID_COLS)}>
          <span className="viz-tick" aria-hidden="true" />
          <span className="viz-grid-t">{f}</span>
        </li>
      ))}
    </ul>
  );
}

/* ---- layers: one frame, exploded into isometric planes ------------------ */

/** The faint marks on each plane, so the four read as different layers. Drawn
 * in the plane's own iso space (16 × 9, z = 0.8). */
const LAYER_MARKS: [number, number, number][][] = [
  /* a detection frame */
  [[3, 2.5, 0.8], [6, 2.5, 0.8], [6, 6, 0.8], [3, 6, 0.8], [3, 2.5, 0.8]],
  /* a waveform */
  [[2, 4.5, 0.8], [4, 3.5, 0.8], [6, 5.5, 0.8], [8, 3, 0.8], [10, 6, 0.8], [12, 4, 0.8], [14, 4.5, 0.8]],
  /* lines of text */
  [[2, 2.5, 0.8], [12, 2.5, 0.8], [12, 4, 0.8], [2, 4, 0.8], [2, 5.5, 0.8], [9, 5.5, 0.8]],
  /* an object box */
  [[9, 4, 0.8], [12.5, 4, 0.8], [12.5, 7, 0.8], [9, 7, 0.8], [9, 4, 0.8]],
];

function Layers({ layers }: { layers: string[] }) {
  return (
    <ul className="viz-layers-list" style={{ "--n": layers.length } as CSSProperties}>
      {layers.map((l, i) => (
        /* `--i` drives the static fan in app/viz.css (`top`: in isometric
           projection an explode along z is a straight vertical offset), so
           GSAP keeps sole ownership of `transform`. */
        <li key={l} className="viz-layer" style={{ "--i": i, zIndex: 10 - i } as CSSProperties}>
          <span className="viz-layer-plane">
            <IsoBox w={16} d={9} h={0.8} />
            <svg className="viz-layer-marks" viewBox={`${(-9 * COS30).toFixed(2)} -0.8 ${(25 * COS30).toFixed(2)} 13.3`}>
              <polyline points={poly(...LAYER_MARKS[i % LAYER_MARKS.length])} />
            </svg>
          </span>
          <span className="viz-layer-name">
            <span className="viz-layer-n tnum">{pad(i + 1)}</span>
            {l}
          </span>
        </li>
      ))}
    </ul>
  );
}

/* ---- wall: a rack of camera feeds (abstract: no footage, no people) ----- */

/** The order the six feeds light up in (3 × 2, reading order). */
const CAM_ORDER = [4, 1, 5, 0, 3, 2];
/** The one feed that matters: flagged in the accent. */
const CAM_FLAGGED = 4;

function Wall() {
  return (
    <div className="viz-wall-stage">
      <div className="viz-wall-rack viz-slab">
        <div className="viz-wall-grid">
          {CAM_ORDER.map((order, i) => (
            <span key={i} className={`viz-cam ${i === CAM_FLAGGED ? "is-flagged" : ""}`.trim()} data-order={order}>
              {/* A camera view of an empty space, in hairlines: a horizon, a
                  floor running to a vanishing point, one object. */}
              <svg className="viz-cam-view" viewBox="0 0 160 90" preserveAspectRatio="none">
                <path className="viz-cam-floor" d={`M0 38 H160 M80 38 L-40 90 M80 38 L30 90 M80 38 L130 90 M80 38 L200 90`} />
                <rect className="viz-cam-object" x={40 + ((i * 23) % 70)} y={48 - (i % 2) * 4} width="22" height="16" />
              </svg>
              <span className="viz-cam-bar">
                <span className="viz-cam-head" style={{ left: `${18 + ((i * 29) % 64)}%` }} />
              </span>
            </span>
          ))}
        </div>
        <span className="viz-scan-wrap">
          <span className="viz-scan" />
        </span>
      </div>
    </div>
  );
}

/* ---- phone: an illustrative screen -------------------------------------- */

function Phone({ v }: { v: Extract<Viz, { kind: "phone" }> }) {
  return (
    <div className="viz-phone-wrap">
      <div className="viz-phone-body viz-slab">
        <span className="viz-phone-notch" />
        <div className="viz-phone-screen">
          <span className="viz-phone-title">{v.title}</span>
          {v.rows.slice(0, 4).map((r) => (
            <span key={r.label} className="viz-phone-row">
              <span>{r.label}</span>
              <span className={`viz-phone-status ${/open/i.test(r.status) ? "is-open" : ""}`.trim()}>
                {r.status}
              </span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---- records: a printed ledger ------------------------------------------ */

function Records({ rows }: { rows: { label: string; meta?: string }[] }) {
  return (
    <div className="viz-records-sheet viz-slab">
      <ul className="viz-records-list">
        {rows.slice(0, 5).map((r, i) => (
          <li key={r.label} className="viz-record">
            <span className="viz-rec-n tnum">{pad(i + 1)}</span>
            <span className="viz-rec-name">{r.label}</span>
            {r.meta ? <span className="viz-rec-meta">{r.meta}</span> : null}
            <span className="viz-record-rule" />
          </li>
        ))}
      </ul>
      <span className="viz-scan" />
    </div>
  );
}

/* ---- system: nodes around a hub, or deliberately disconnected ------------ */

function System({ v }: { v: Extract<Viz, { kind: "system" }> }) {
  const n = v.nodes.length;
  /* With a hub: a ring of nodes around the core. Without: separate systems,
     each a small solid of its own, in a loose zigzag whose links are broken
     in the middle. Positions are percentages of the drawing box. */
  const at = v.nodes.map((_, k) => {
    if (!v.hub) return { x: 17 + (k * 66) / Math.max(1, n - 1), y: k % 2 ? 68 : 30 };
    const t = -Math.PI / 2 + (k * 2 * Math.PI) / n;
    return { x: 50 + 36 * Math.cos(t), y: 50 + 38 * Math.sin(t) };
  });
  const pct = (x: number) => `${x.toFixed(2)}%`;
  return (
    <div className={`viz-system-wrap ${v.hub ? "has-hub" : "no-hub"}`}>
      <svg className="viz-sys-links" viewBox="0 0 100 100" preserveAspectRatio="none">
        {v.hub
          ? at.map((p, k) => <line key={k} x1="50" y1="50" x2={p.x.toFixed(2)} y2={p.y.toFixed(2)} />)
          : at.slice(1).map((p, k) => {
              const a = at[k];
              const g = 0.16;
              const mid = (t: number) => [a.x + (p.x - a.x) * t, a.y + (p.y - a.y) * t].map((q) => q.toFixed(2));
              const [x1, y1] = mid(0.5 - g);
              const [x2, y2] = mid(0.5 + g);
              return (
                <g key={k}>
                  <line x1={a.x} y1={a.y} x2={x1} y2={y1} />
                  <line x1={x2} y1={y2} x2={p.x} y2={p.y} />
                </g>
              );
            })}
      </svg>
      {/* Where each link breaks: a small cross, drawn in HTML so it keeps its
          shape however the box stretches. */}
      {v.hub
        ? null
        : at.slice(1).map((p, k) => (
            <span
              key={k}
              className="viz-sys-break"
              style={{ left: pct((at[k].x + p.x) / 2), top: pct((at[k].y + p.y) / 2) }}
            />
          ))}
      {v.hub ? (
        <span className="viz-hub">
          <IsoBox w={1} d={1} h={1} />
        </span>
      ) : null}
      <ul className="viz-sys-nodes">
        {v.nodes.map((node, k) => (
          /* The hook is a zero-size anchor at the node's point; the label is
             centred on it with its own `translate`, which GSAP never sees. */
          <li
            key={node}
            className={`viz-sys-node ${v.hub ? "" : "viz-node is-warn"}`.trim()}
            style={{ left: pct(at[k].x), top: pct(at[k].y) }}
          >
            {v.hub ? (
              <span className="viz-sys-label viz-slab">{node}</span>
            ) : (
              <span className="viz-sys-tool">
                <IsoBox w={1.2} d={1} h={0.8} className="viz-sys-solid" />
                <span className="viz-sys-label viz-slab">{node}</span>
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ---- boundary: what runs inside your infrastructure --------------------- */

const EDGES = ["top", "right", "bottom", "left"] as const;

function Boundary({ v, core }: { v: Extract<Viz, { kind: "boundary" }>; core: string }) {
  return (
    <div className="viz-boundary-box">
      {EDGES.map((e) => (
        <span key={e} className="boundary-edge" data-edge={e} />
      ))}
      <p className="boundary-caption annot">{v.caption}</p>
      <ul className="boundary-nodes">
        {v.inside.map((n) => (
          <li key={n} className={`boundary-node viz-slab ${n === core ? "is-core" : ""}`.trim()}>
            {n}
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ---- cases: use-case tiles from the scene's own cases ------------------- */

function Cases({ cases }: { cases: NonNullable<Scene["cases"]> }) {
  return (
    <ul className="viz-cases-list" data-count={cases.length}>
      {cases.map((c, i) => (
        <li key={c.label} className="viz-case viz-slab">
          <span className="viz-case-n tnum" aria-hidden="true">
            {pad(i + 1)}
          </span>
          <span className="viz-case-l">{c.label}</span>
          <span className="viz-case-copy">{c.copy}</span>
        </li>
      ))}
    </ul>
  );
}

/* ---- ports: inputs, one core, outputs ----------------------------------- */

function Ports({ v }: { v: Extract<Viz, { kind: "ports" }> }) {
  return (
    <div className="viz-ports-grid">
      <ul className="port-ins" aria-label="Inputs">
        {v.inputs.map((x) => (
          <li key={x} className="port-in">
            <span className="port-label">{x}</span>
            <span className="port-wire" aria-hidden="true" />
          </li>
        ))}
      </ul>
      <p className="port-core viz-slab">{v.core}</p>
      <ul className="port-outs" aria-label="Outputs">
        {v.outputs.map((x) => (
          <li key={x} className="port-out">
            <span className="port-wire" aria-hidden="true" />
            <span className="port-label">{x}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ---- chain: ordered states, with optional branches ---------------------- */

/** A label whose hyphenated words never break at the hyphen ("SHA-256", not
 * "SHA-/256"), in narrow chain columns. */
function keepHyphenated(label: string): ReactNode {
  return label.split(/(\S*-\S*)/).map((part, i) => (i % 2 ? <span key={i} className="nobr">{part}</span> : part));
}

function Chain({ v }: { v: Extract<Viz, { kind: "chain" }> }) {
  return (
    <div className="viz-chain-wrap" data-count={v.nodes.length} style={{ "--n": v.nodes.length } as CSSProperties}>
      <ol className="chain-nodes">
        {v.nodes.map((n, i) => (
          <li key={n} className="chain-node">
            {i > 0 ? <span className="chain-edge" aria-hidden="true" /> : null}
            {/* One inner span: the label is a grid, and loose text beside a
                span would become two grid rows. */}
            <span className="chain-label viz-slab">
              <span>{keepHyphenated(n)}</span>
            </span>
          </li>
        ))}
      </ol>
      {v.branches?.length ? (
        <ul className="chain-branches">
          {v.branches.map((b) => (
            <li key={b}>{b}</li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

/* ---- columns: labelled lists (Nazo AI actions by role) ------------------ */

function Columns({ v }: { v: Extract<Viz, { kind: "columns" }> }) {
  return (
    <div className="viz-columns-grid" data-count={v.cols.length}>
      {v.cols.map((c) => (
        <div key={c.label} className="viz-column viz-slab">
          <h3 className="viz-column-label">
            {c.label}
            <span className="viz-column-count tnum" aria-hidden="true">
              {pad(c.items.length)}
            </span>
          </h3>
          <ul>
            {c.items.map((it) => (
              <li key={it}>{it}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

/* ---- next: the next product's page -------------------------------------- */

function NextCard({ slug, eager }: { slug: string; eager: boolean }) {
  const p = SHOWCASE.find((x) => x.slug === slug);
  if (!p) return null;
  return (
    <Link className="next-card" href={`/products/${p.slug}/`} prefetch={false} data-viz="link">
      {/* The image only illustrates the link, so it and its provenance label
          are hidden from assistive technology; the name carries the link. */}
      <span className="next-shot" aria-hidden="true">
        <span
          className="next-frame viz-slab"
          style={{ "--ar": (p.shot.width / p.shot.height).toFixed(4) } as CSSProperties}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={p.shot.src}
            alt=""
            width={p.shot.width}
            height={p.shot.height}
            sizes={SIZES}
            loading={eager ? "eager" : "lazy"}
            decoding="async"
          />
        </span>
        {/* An asset that prints its own provenance (Wasel's illustrations)
            gets no second label (FINAL-SPEC §13, "Wasel double provenance"). */}
        {p.shot.labelInAsset ? null : <ProvenanceLabel>{p.shot.provenance}</ProvenanceLabel>}
      </span>
      <span className="next-meta">
        <span className="next-kicker annot">Next product</span>
        <span className="next-name">{p.name}</span>
        <span className="next-desc">{p.descriptor}</span>
        <span className="next-go">
          Explore <span aria-hidden="true">→</span>
        </span>
      </span>
    </Link>
  );
}
