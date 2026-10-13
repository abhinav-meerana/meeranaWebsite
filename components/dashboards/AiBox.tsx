import type { CSSProperties } from "react";
import { AIBOX_ANALYTICS, AIBOX_CHAT, AIBOX_NAV } from "@/content/demo-data";
import Icon, { type IconName } from "./Icon";

/* AI in a Box — interface reconstructions of the assistant and analytics
   screens in the owner's demo recording. The recording's sample ministry is
   replaced by neutral departments, the latency figure is left out, and the
   product's footer line is never shown (DL-P13). Design canvas 1440 × 900. */

const NAV_ICON: IconName[] = ["spark", "chart", "star", "users", "book", "shield", "link", "settings"];

function Sidebar({ active }: { active: number }) {
  return (
    <aside className="da-side">
      <p className="da-brand">
        <b>MEERANA</b>
        <small>AI in a Box</small>
      </p>
      {AIBOX_NAV.map((n, i) => (
        <span key={n} className={`da-nav ${i === active ? "is-on" : ""}`}>
          <Icon name={NAV_ICON[i]} size={16} />
          {n}
        </span>
      ))}
      <p className="da-office">
        <i>EO</i>
        <span>
          <b>Executive office</b>
          <small>Admin</small>
        </span>
        <em className="dz-live is-green" />
      </p>
    </aside>
  );
}

function Top({ title }: { title: string }) {
  return (
    <header className="da-top">
      <span>
        <b>{title}</b>
        <small>Thursday · sample workspace</small>
      </span>
      <span className="da-top-right">
        <Icon name="bell" size={17} />
        <span className="da-lang">
          <b>EN</b> AR
        </span>
        <span className="da-role">Exec. director</span>
      </span>
    </header>
  );
}

export function AiBoxAssistant() {
  const d = AIBOX_CHAT;
  return (
    <div className="dz dz--aibox">
      <Sidebar active={0} />
      <div className="da-main">
        <Top title="Assistant" />
        <div className="da-chat-wrap">
          <section className="da-chat">
            <span className="da-agent-pick">
              <i className="dz-live is-green" /> Legal agent
            </span>
            <p className="da-msg is-user">{d.question}</p>
            <div className="da-msg is-ai dz-rise">
              <p>{d.answer}</p>
              {d.flags.map((f, i) => (
                <div key={f.clause} className="da-flag dz-rise" style={{ "--i": i + 1 } as CSSProperties}>
                  <p>
                    <i>CLAUSE {f.clause}</i> <b>{f.title}</b>
                  </p>
                  <p>{f.note}</p>
                  <p className="da-fix">FIX {f.fix}</p>
                </div>
              ))}
              <p className="da-cite">
                Sources <sup>[1]</sup> <sup>[2]</sup> · Review note saved to the contract file.
              </p>
              <p className="da-decide">
                <span className="da-btn is-primary">
                  <Icon name="check" size={14} /> Approve the fixes
                </span>
                <span className="da-btn">Ask for changes</span>
                <small>A person reviews and decides.</small>
              </p>
            </div>
            <span className="da-composer">
              <Icon name="mic" size={18} />
              <span>Ask Meerana…</span>
              <Icon name="clip" size={18} />
              <span className="da-send">
                <Icon name="send" size={16} />
              </span>
            </span>
          </section>

          <aside className="da-context">
            <p className="da-context-head">Context &amp; intelligence</p>
            {d.files.map((f) => (
              <p key={f.name} className="da-file">
                <b>{f.name}</b>
                <small>{f.meta}</small>
              </p>
            ))}
            <p className="da-sub"># Active citations</p>
            {d.citations.map((c) => (
              <p key={c.n} className="da-file">
                <b>
                  [{c.n}] {c.title}
                </b>
                <small>{c.src}</small>
              </p>
            ))}
            <p className="da-sub">⚡ Execution trail</p>
            {d.trail.map((t) => (
              <p key={t.agent} className="da-file">
                <small>{t.agent}</small>
                <b>{t.what}</b>
                <small>{t.when}</small>
              </p>
            ))}
          </aside>
        </div>
      </div>
    </div>
  );
}

export function AiBoxAnalytics() {
  const d = AIBOX_ANALYTICS;
  const maxSender = Math.max(...d.senders.map((s) => s.value));
  const maxTool = Math.max(...d.tools.map((t) => t.value));
  const maxHour = Math.max(...d.hours);
  const maxPri = Math.max(...d.priority.map((p) => p.value));
  return (
    <div className="dz dz--aibox">
      <Sidebar active={1} />
      <div className="da-main">
        <Top title="Analytics" />
        <div className="da-an">
          <div className="da-kpis">
            {d.kpis.map((k) => (
              <div key={k.label} className="da-card">
                <small className="da-cap">{k.label}</small>
                <b className="dz-count">{k.value}</b>
                <small className={`da-note is-${k.tone}`}>{k.note}</small>
              </div>
            ))}
          </div>

          <div className="da-row3">
            <div className="da-card da-ring">
              <p className="da-card-title">Task completion</p>
              <span className="da-ring-svg" style={{ "--v": d.completion.pct / 100 } as CSSProperties}>
                <b>{d.completion.pct}%</b>
              </span>
              <p className="da-legend">
                <span className="is-green">Done {d.completion.done}</span>
                <span className="is-blue">Open {d.completion.open}</span>
              </p>
            </div>
            <div className="da-card">
              <p className="da-card-title">Open tasks by priority</p>
              {d.priority.map((p) => (
                <p key={p.label} className="da-hbar">
                  <span>{p.label}</span>
                  <span className="da-track">
                    <i className={`dz-bar-h is-${p.tone}`} style={{ "--v": p.value / maxPri } as CSSProperties} />
                  </span>
                  <b>{p.value}</b>
                </p>
              ))}
            </div>
            <div className="da-card">
              <p className="da-card-title">Most contacted senders</p>
              {d.senders.map((s) => (
                <p key={s.label} className="da-hbar">
                  <span>{s.label}</span>
                  <span className="da-track">
                    <i className={`dz-bar-h is-${s.tone}`} style={{ "--v": s.value / maxSender } as CSSProperties} />
                  </span>
                  <b>{s.value}</b>
                </p>
              ))}
            </div>
          </div>

          <div className="da-row3">
            <div className="da-card">
              <p className="da-card-title">Agent activity · last 7 days</p>
              <div className="da-mini">
                {d.activity.map((a) => (
                  <span key={a.label}>
                    <small className="da-cap">{a.label}</small>
                    <b>{a.value}</b>
                  </span>
                ))}
              </div>
            </div>
            <div className="da-card">
              <p className="da-card-title">Tool usage · 30 days</p>
              {d.tools.map((t) => (
                <p key={t.label} className="da-hbar is-tight">
                  <span>{t.label}</span>
                  <span className="da-track">
                    <i className="dz-bar-h is-blue" style={{ "--v": t.value / maxTool } as CSSProperties} />
                  </span>
                  <b>{t.value}</b>
                </p>
              ))}
            </div>
            <div className="da-card">
              <p className="da-card-title">Most active hours · 30 days</p>
              <div className="da-hours">
                {d.hours.map((h, i) => (
                  <i key={i} className="dz-bar-v" style={{ "--v": h / maxHour } as CSSProperties} />
                ))}
              </div>
              <p className="da-axis">
                <span>0</span>
                <span>6</span>
                <span>12</span>
                <span>18</span>
                <span>23</span>
              </p>
            </div>
          </div>

          <div className="da-row2">
            <div className="da-card">
              <p className="da-card-title">Task board</p>
              <div className="da-board">
                {d.board.map((c) => (
                  <div key={c.col}>
                    <p className={`da-col is-${c.tone}`}>
                      ● {c.col.toUpperCase()} <span>{c.cards.length}</span>
                    </p>
                    {c.cards.map(([t, p]) => (
                      <p key={t} className="da-task">
                        <b>{t}</b>
                        <i className={`da-pri is-${p.toLowerCase()}`}>{p}</i>
                      </p>
                    ))}
                  </div>
                ))}
              </div>
            </div>
            <div className="da-card">
              <p className="da-card-title">
                Email digest <span className="da-unread">3 unread</span>
              </p>
              <p className="da-digest">{d.digest}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
