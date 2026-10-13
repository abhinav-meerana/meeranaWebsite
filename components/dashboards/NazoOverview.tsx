import { NAZO } from "@/content/demo-data";
import Icon, { type IconName } from "./Icon";

/* Nazo · Admin overview — an interface reconstruction of the screen the owner
   supplied (2026-10-13). Layout, widgets and labels follow it; the tenant's
   branding (emblem, product name) is replaced by Nazo's, and people by roles.
   Design canvas 1440 × 900 (DashboardFrame scales it). */

const WORKSPACE_ICONS: IconName[] = ["inbox", "plus", "send", "target", "archive"];
const MANAGE_ICONS: IconName[] = ["grid", "list", "doc", "flow", "users"];
const KPI_ICON: Record<string, IconName> = { blue: "doc", spin: "spinner", green: "checkCircle", amber: "users" };
const VERB_ICON: Record<string, IconName> = { Commented: "doc", Approved: "check", Completed: "checkCircle", Signed: "send" };

export default function NazoOverview() {
  return (
    <div className="dz dz--nazo">
      <aside className="dn-side">
        <div className="dn-brand">
          <span className="dn-mark">
            <Icon name="doc" size={20} />
          </span>
          <span>
            <b>Nazo</b>
            <small>Correspondence management</small>
          </span>
        </div>
        <div className="dn-profile">
          <small>System administrator</small>
          <b>Administrator</b>
          <span>Information technology</span>
        </div>
        <p className="dn-group">Workspace</p>
        {NAZO.workspace.map((item, i) => (
          <span key={item} className="dn-nav">
            <Icon name={WORKSPACE_ICONS[i]} size={18} />
            {item}
          </span>
        ))}
        <p className="dn-group">Manage</p>
        {NAZO.manage.map((item, i) => (
          <span key={item} className={`dn-nav ${i === 0 ? "is-on" : ""}`}>
            <Icon name={MANAGE_ICONS[i]} size={18} />
            {item}
          </span>
        ))}
        <p className="dn-foot">AI assists every step of your correspondence.</p>
      </aside>

      <div className="dn-main">
        <header className="dn-top">
          <span className="dn-search">
            <Icon name="search" size={16} />
            Search
            <kbd>⌘K</kbd>
          </span>
          <span className="dn-lang">
            <b>EN</b>
            <i>ع</i>
          </span>
          <Icon name="sun" size={18} />
          <Icon name="bell" size={18} />
          <span className="dn-user">
            <span className="dn-avatar">SA</span>
            <span>
              <b>Administrator</b>
              <small>System administrator</small>
            </span>
          </span>
        </header>

        <div className="dn-body">
          <section className="dn-content">
            <div className="dn-title">
              <span className="dn-title-ico">
                <Icon name="grid" size={22} />
              </span>
              <span>
                <b>Admin overview</b>
                <small>Templates, workflows and approvals at a glance.</small>
              </span>
            </div>

            <div className="dn-kpis">
              {NAZO.kpis.map((k) => (
                <div key={k.label} className="dn-kpi">
                  <span className={`dn-kpi-ico is-${k.tone}`}>
                    <Icon name={KPI_ICON[k.tone]} size={22} />
                  </span>
                  <span>
                    <b className="dz-count">{k.value}</b>
                    <small>{k.label}</small>
                  </span>
                </div>
              ))}
            </div>

            <div className="dn-row">
              <div className="dn-stack">
              <div className="dn-card dn-build">
                <p className="dn-card-title">
                  <Icon name="spark" size={18} />
                  Build with AI
                </p>
                {NAZO.buildWithAi.map((b, i) => (
                  <span key={b} className="dn-build-item">
                    <span className="dn-build-ico">
                      <Icon name={(["doc", "flow", "users"] as IconName[])[i]} size={18} />
                    </span>
                    {b}
                  </span>
                ))}
              </div>

              <div className="dn-card dn-progress">
                <p className="dn-card-title">
                  In progress <small>3 of {NAZO.kpis[1].value} active</small>
                </p>
                {NAZO.inProgress.map((r, i) => (
                  <p key={r.doc} className="dn-prow dz-rise" style={{ "--i": i } as React.CSSProperties}>
                    <span>
                      <b>{r.doc}</b>
                      <small>
                        {r.stage} · {r.owner}
                      </small>
                    </span>
                    <i className={r.due === "Today" ? "is-due" : ""}>{r.due}</i>
                  </p>
                ))}
              </div>
              </div>

              <div className="dn-card dn-activity">
                <p className="dn-card-title">Recent activity</p>
                <ol>
                  {NAZO.activity.map((a, i) => (
                    <li key={i} className="dz-rise" style={{ "--i": i } as React.CSSProperties}>
                      <span className={`dn-dot is-${a.verb.toLowerCase()}`}>
                        <Icon name={VERB_ICON[a.verb]} size={14} />
                      </span>
                      <span className="dn-act">
                        <b>{a.verb}</b> · <span>{a.by}</span>
                        <small>{a.at}</small>
                        {"note" in a && a.note ? <em>{a.note}</em> : null}
                      </span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
            <span className="dn-fab">
              <Icon name="plus" size={18} />
              New correspondence
            </span>
          </section>

          <aside className="dn-ai">
            <p className="dn-ai-head">
              <Icon name="spark" size={20} />
              <span>
                <b>AI assistant</b>
                <small>Context-aware, always on</small>
              </span>
            </p>
            <p className="dn-group">Suggested for you</p>
            <span className="dn-chips">
              <span>What should I do?</span>
              <span>Generate template</span>
            </span>
            <p className="dn-ai-empty">Pick an action above, or ask a question to get started.</p>
            <span className="dn-ai-input">
              Ask Nazo, or pick an action…
              <span className="dn-send">
                <Icon name="arrowUp" size={16} />
              </span>
            </span>
          </aside>
        </div>
      </div>
    </div>
  );
}
