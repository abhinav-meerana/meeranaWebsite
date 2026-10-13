"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { CSSProperties } from "react";
import OptionWheel from "@/components/reactbits/OptionWheel";
import PillNav from "@/components/reactbits/PillNav";
import { NAV_CTA, PILL_LINKS, PLATFORM_LINKS, WHEEL_ITEMS } from "@/content/navigation";
import { jumpToSection } from "@/lib/jump";
import { SCENE } from "@/lib/scene-colors";
import { useActiveSection } from "./useActiveSection";

/* ============================================================================
   The site navigation (brief §9).

   Both variants are server-rendered for everyone and app/nav.css shows one:
     ≥1024 px  PillNav: logo, Platforms (a panel of the six products),
               Solutions, Technology, About, Contact and the call to action;
     <1024 px  the option-wheel dock on the right edge, plus a home mark.
   A hidden variant is display:none, so only the visible one is in the tab
   order and the accessibility tree, and the HTML never depends on the
   viewport (no hydration mismatch).
   ========================================================================== */

const LABELS = WHEEL_ITEMS.map((i) => i.label);

export default function SiteNav() {
  const pathname = usePathname();
  const active = useActiveSection(pathname);

  return (
    <>
      <div className="nav-desktop">
        <PillNav
          logo="/brand/meerana-symbol-white.png"
          logoAlt="Meerana Technologies — home"
          items={[{ label: "Platforms", menu: <PlatformsPanel /> }, ...PILL_LINKS]}
          cta={NAV_CTA}
        />
      </div>
      <WheelNav active={WHEEL_ITEMS.findIndex((i) => i.key === active)} pathname={pathname} />
    </>
  );
}

/* The Platforms panel: six products in two columns, then the index. */
function PlatformsPanel() {
  return (
    <div className="platforms-panel">
      <p className="platforms-panel-label">The six platforms</p>
      <ul className="platforms-panel-list">
        {PLATFORM_LINKS.map((p) => (
          <li key={p.slug} style={{ "--p-accent": p.accent } as CSSProperties}>
            <Link href={p.href}>
              <span className="pp-index">{p.index}</span>
              <span className="pp-name">{p.name}</span>
              <span className="pp-desc">{p.descriptor}</span>
            </Link>
          </li>
        ))}
      </ul>
      <Link className="platforms-panel-all" href="/products/">
        All six platforms, side by side <span aria-hidden="true">→</span>
      </Link>
    </div>
  );
}

/* ---------------------------------------------------------------------------
   Tablet and phone: the wheel dock.

   Collapsed, it shows the current section with its neighbours fading above
   and below, and lets the page scroll straight through it. A tap (or Enter)
   expands it; then dragging, the mouse wheel and the arrow keys browse, and a
   tap, Enter or Space goes. Escape, a tap outside or focus leaving collapse
   it. While collapsed it follows the visible section (controlled `selected`).
   ------------------------------------------------------------------------- */
function WheelNav({ active, pathname }: { active: number; pathname: string }) {
  const router = useRouter();
  const [expanded, setExpanded] = useState(false);
  /* While expanded the reader owns the highlight; collapsed, the page does. */
  const [selected, setSelected] = useState(active);
  const dockRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!expanded) setSelected(active);
  }, [active, expanded]);

  useEffect(() => setExpanded(false), [pathname]);

  const collapse = useCallback((focusWheel = false) => {
    setExpanded(false);
    if (focusWheel) dockRef.current?.querySelector<HTMLElement>(".option-wheel")?.focus();
  }, []);

  useEffect(() => {
    if (!expanded) return;
    const outside = (e: Event) => {
      if (!dockRef.current?.contains(e.target as Node)) collapse();
    };
    document.addEventListener("pointerdown", outside);
    document.addEventListener("focusin", outside);
    return () => {
      document.removeEventListener("pointerdown", outside);
      document.removeEventListener("focusin", outside);
    };
  }, [expanded, collapse]);

  const go = useCallback(
    (index: number) => {
      const item = WHEEL_ITEMS[index];
      setSelected(index);
      setExpanded(false);
      if (pathname === "/" && jumpToSection(item.section)) return;
      router.push(item.route);
    },
    [pathname, router],
  );

  return (
    <div className="nav-mobile">
      <Link className="wheel-home" href="/">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/brand/meerana-symbol-white.png" alt="" width={225} height={123} />
        <span className="sr-only">Meerana Technologies — home</span>
      </Link>

      <nav ref={dockRef} className={`wheel-dock ${expanded ? "is-expanded" : ""}`} aria-label="Primary">
        <p className="wheel-dock-hint" aria-hidden="true">
          {expanded ? "Tap to go" : "Menu"}
        </p>
        <OptionWheel
          items={LABELS}
          selected={selected}
          interactive={expanded}
          onActivate={() => setExpanded(true)}
          onEscape={() => collapse(true)}
          onCommit={go}
          ariaLabel={expanded ? "Go to section" : "Site sections, press Enter to choose"}
          textColor={SCENE.coolGrey}
          activeColor={SCENE.white}
          side="right"
          fontSize={1.15}
          spacing={expanded ? 2.1 : 1.3}
          curve={1}
          tilt={6}
          blur={1.2}
          fade={expanded ? 0.24 : 0.5}
          minOpacity={0.16}
          smoothing={180}
          inset={22}
          loop={false}
          draggable
        />
      </nav>
    </div>
  );
}
