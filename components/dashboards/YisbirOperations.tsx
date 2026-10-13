import type { CSSProperties } from "react";
import { YISBIR_OPS } from "@/content/demo-data";
import Icon from "./Icon";

/* Yisbir · Site operations — the command-centre format of the owner's Figma
   (Yisbir expanded states: alert queue, live camera, PPE compliance), rebuilt
   for a generic site with documented detection classes only. Illustrative:
   the Figma is a proposed design, not a capture of the shipping product.
   No faces, people, plates, weapons or behaviour scoring; no police or
   government marks. Design canvas 1440 × 900. */

const STATUS_TONE: Record<string, string> = {
  New: "crit",
  Acknowledged: "high",
  Dispatched: "aqua",
  Resolved: "ok",
};

export default function YisbirOperations() {
  const d = YISBIR_OPS;
  const maxCross = Math.max(...d.crossings24h);
  const maxType = Math.max(...d.byType.map((t) => t.value));
  return (
    <div className="dz dz--yops">
      <header className="dy-bar">
        <span className="dy-badge">YISBIR</span>
        <b>Site operations</b>
        <span className="dy-site">{d.site}</span>
        <nav className="dy-tabs">
          <span className="is-on">Dashboard</span>
          <span>Map</span>
          <span>Alerts</span>
          <span>Analytics</span>
          <span>Video search</span>
        </nav>
        <span className="dy-clock">
          <i className="dz-live" /> Shift 2 · 14:32
        </span>
      </header>

      <div className="dy-grid">
        {/* ---- left column ---- */}
        <div className="dy-col">
          <section className="dy-panel">
            <p className="dy-label">
              Restricted zones <span className="dy-tag is-aqua">Armed</span>
            </p>
            <p className="dy-big">
              <b className="dz-count">20</b>
              <small>zone entries today</small>
            </p>
            <div className="dy-spark">
              {d.crossings24h.map((v, i) => (
                <i key={i} className="dz-bar-v" style={{ "--v": v / maxCross } as CSSProperties} />
              ))}
            </div>
            <ul className="dy-zones">
              {d.zones.map((z) => (
                <li key={z.name}>
                  <span>{z.name}</span>
                  <b>{z.count}</b>
                </li>
              ))}
            </ul>
          </section>

          <section className="dy-panel">
            <p className="dy-label">Attendance today</p>
            <p className="dy-big">
              <b className="dz-count">{d.attendance.onSite}</b>
              <small>on site of {d.attendance.expected} expected</small>
            </p>
            <span className="dy-meter">
              <i className="dz-bar-h" style={{ "--v": d.attendance.onSite / d.attendance.expected } as CSSProperties} />
            </span>
          </section>

          <section className="dy-panel dy-fire">
            <p className="dy-label">
              <Icon name="flame" size={14} /> Fire &amp; smoke <span className="dy-tag is-crit">1 open</span>
            </p>
            <p className="dy-fire-row">
              <b>Smoke detected</b>
              <span>Aisle 4 · CAM-12 · 14:32:08</span>
            </p>
            <p className="dy-fire-row">
              <span>Safety team alerted · Control room notified</span>
            </p>
          </section>
        </div>

        {/* ---- centre: the alert queue ---- */}
        <section className="dy-panel dy-queue">
          <p className="dy-queue-title">
            <b>Active alert queue</b>
            <span className="dy-tag is-crit">{d.queue.critical} critical</span>
            <span className="dy-right">
              <i className="dz-live" /> Live
            </span>
          </p>
          <div className="dy-kpis">
            <span>
              <small>Open</small>
              <b className="dz-count">{d.queue.open}</b>
            </span>
            <span className="is-crit">
              <small>Critical (P1)</small>
              <b className="dz-count">{d.queue.critical}</b>
            </span>
            <span className="is-high">
              <small>Acknowledged</small>
              <b className="dz-count">{d.queue.acknowledged}</b>
            </span>
            <span className="is-ok">
              <small>Resolved today</small>
              <b className="dz-count">{d.queue.resolved}</b>
            </span>
          </div>
          <p className="dy-filters">
            <span>Severity: All</span>
            <span>Zone: All</span>
            <span>Type: Safety</span>
            <span>Status: All</span>
          </p>
          <div className="dy-table">
            <p className="dy-th">
              <span>Priority</span>
              <span>Event</span>
              <span>Camera</span>
              <span>Time</span>
              <span>Status</span>
              <span>Assigned</span>
            </p>
            {d.alerts.map((a, i) => (
              <p key={i} className="dy-tr dz-rise" style={{ "--i": i } as CSSProperties}>
                <span>
                  <i className={`dy-p is-${a.sev}`}>{a.p}</i>
                </span>
                <span className="dy-ev">{a.type}</span>
                <span className="dy-mono">{a.cam}</span>
                <span className="dy-mono">{a.time}</span>
                <span className={`dy-st is-${STATUS_TONE[a.status]}`}>{a.status}</span>
                <span className="dy-muted">{a.owner}</span>
              </p>
            ))}
          </div>
          <p className="dy-qfoot">
            Latest {d.alerts.length} of {d.queue.open + d.queue.resolved} alerts today
          </p>
        </section>

        {/* ---- right column ---- */}
        <div className="dy-col">
          <section className="dy-panel">
            <p className="dy-label">
              Live camera · CAM-A12 <span className="dy-right dy-muted">Loading bay</span>
            </p>
            <div className="dy-cam">
              <span className="dy-cam-floor" />
              <span className="dy-cam-racks" />
              <span className="dy-zone-poly" />
              <em className="dy-zone-label">Restricted zone · armed</em>
              <span className="dy-cam-chip">
                <i className="dz-live is-red" /> REC · 14:32:51
              </span>
            </div>
          </section>

          <section className="dy-panel">
            <p className="dy-label">
              <Icon name="helmet" size={14} /> PPE compliance · today
            </p>
            <p className="dy-big">
              <b className="dz-count">{d.ppe.compliant}%</b>
              <small>fully compliant</small>
            </p>
            {[
              ["Helmet", d.ppe.helmet],
              ["Safety vest", d.ppe.vest],
            ].map(([label, v]) => (
              <p key={label} className="dy-ppe">
                <span>{label}</span>
                <b>{v}%</b>
                <span className="dy-meter">
                  <i className="dz-bar-h" style={{ "--v": Number(v) / 100 } as CSSProperties} />
                </span>
              </p>
            ))}
          </section>

          <section className="dy-panel">
            <p className="dy-label">Alerts by type · all sites · last 4 h</p>
            {d.byType.map((t) => (
              <p key={t.label} className="dy-type">
                <span>{t.label}</span>
                <span className="dy-meter is-thin">
                  <i className="dz-bar-h" style={{ "--v": t.value / maxType } as CSSProperties} />
                </span>
                <b>{t.value}</b>
              </p>
            ))}
          </section>
        </div>
      </div>

      <footer className="dy-shelf">
        <span className="dy-label">Modules</span>
        {d.modules.map((m) => (
          <span key={m} className="dy-mod">
            <i /> {m}
          </span>
        ))}
      </footer>
    </div>
  );
}
