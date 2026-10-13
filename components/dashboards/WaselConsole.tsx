import type { CSSProperties } from "react";
import { WASEL, type WaselMode } from "@/content/demo-data";
import Icon, { type IconName } from "./Icon";

/* Wasel · Gate console — ILLUSTRATIVE. No Wasel screen exists; this expresses
   what the owner's 2026 brochures document: gate status (open / closed /
   moving), gate types (single, double, sliding, barrier, custom), the three
   connectivity modes with Bluetooth as the offline fallback, temperature and
   humidity sensors, open/close relays with the auto-close timer, the audit
   trail (time, trigger source, command) and the access model (admin master
   keys, role-based access, QR key sharing). Wasel palette only (brown, sand,
   copper, ivory — never cyan). The logo is the official raster, unmodified.
   Design canvas 1440 × 900. */

const MODE_ICON: Record<WaselMode, IconName> = { Cloud: "cloud", "Local Wi-Fi": "wifi", Bluetooth: "bluetooth" };
const NAV: [string, IconName][] = [
  ["Gates", "gate"],
  ["Access keys", "key"],
  ["Audit trail", "list"],
  ["Devices", "settings"],
  ["Sites", "home"],
];

export default function WaselConsole() {
  const d = WASEL;
  const lastFor = (gate: string) => d.audit.find((a) => a.gate === gate);
  return (
    <div className="dz dz--wasel">
      <aside className="dw-side">
        <span className="dw-logo">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/wasel-logo-white.png" alt="" width={308} height={308} />
        </span>
        {NAV.map(([n, ic], i) => (
          <span key={n} className={`dw-nav ${i === 0 ? "is-on" : ""}`}>
            <Icon name={ic} size={17} />
            {n}
          </span>
        ))}
        <span className="dw-provision">
          <Icon name="bluetooth" size={15} />
          <span>
            <b>New controller nearby</b>
            <small>BLE scan · ready to configure</small>
          </span>
        </span>
      </aside>

      <div className="dw-main">
        <header className="dw-top">
          <span>
            <b>Gates</b>
            <small>
              {d.site} · {d.gates.length} gates
            </small>
          </span>
          <span className="dw-modes">
            {(["Cloud", "Local Wi-Fi", "Bluetooth"] as WaselMode[]).map((m) => (
              <span key={m}>
                <Icon name={MODE_ICON[m]} size={15} /> {m}
              </span>
            ))}
          </span>
        </header>

        <div className="dw-body">
          <section className="dw-gates">
            {d.gates.map((g, i) => (
              <div key={g.name} className={`dw-gate dz-rise is-${g.state.toLowerCase()}`} style={{ "--i": i } as CSSProperties}>
                <p className="dw-gate-head">
                  <b>{g.name}</b>
                  <span className={`dw-state is-${g.state.toLowerCase()}`}>{g.state}</span>
                </p>
                <p className="dw-gate-meta">
                  <span>{g.type}</span>
                  <span>
                    <Icon name={MODE_ICON[g.mode]} size={13} /> {g.mode}
                    {"offline" in g && g.offline ? " · offline fallback" : ""}
                  </span>
                </p>
                <p className="dw-sensors">
                  <span>
                    <Icon name="thermo" size={13} /> {g.temp}°C
                  </span>
                  <span>
                    <Icon name="drop" size={13} /> {g.hum}%
                  </span>
                  {"timer" in g && g.timer ? <span className="dw-timer">{g.timer}</span> : null}
                </p>
                {(() => {
                  const last = lastFor(g.name);
                  return (
                    <p className="dw-last">
                      <small>Last command</small>
                      {last ? (
                        <span>
                          <b>{last.cmd}</b> · {last.t} · {last.source}
                        </span>
                      ) : (
                        <span>None today</span>
                      )}
                    </p>
                  );
                })()}
                <p className="dw-ctrl">
                  <span className={g.state === "Open" ? "is-dim" : "is-primary"}>Open</span>
                  <span className={g.state === "Closed" ? "is-dim" : ""}>Close</span>
                </p>
              </div>
            ))}
          </section>

          <aside className="dw-right">
            <div className="dw-card">
              <p className="dw-card-title">Audit trail</p>
              {d.audit.map((a) => (
                <p key={a.t + a.gate} className="dw-log">
                  <i>{a.t}</i>
                  <span>
                    <b>
                      {a.gate} · {a.cmd}
                    </b>
                    <small>
                      {a.source} · {a.who}
                    </small>
                  </span>
                </p>
              ))}
            </div>
            <div className="dw-card">
              <p className="dw-card-title">Access</p>
              {d.access.map((a) => (
                <p key={a.label} className="dw-access">
                  <span>{a.label}</span>
                  <b>{a.value}</b>
                </p>
              ))}
              <span className="dw-qr">
                <Icon name="key" size={15} /> Share a QR key
              </span>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
