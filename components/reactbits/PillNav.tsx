"use client";

/**
 * PillNav — adapted from React Bits (https://reactbits.dev, DavidHDev/react-bits,
 * TS-CSS registry). MIT + Commons Clause: see ./LICENSE.md.
 *
 * Kept from the original: the logo pill, the row of pills whose hover is a
 * circle that rises from below and lifts the label out while a second label
 * slides in (one GSAP timeline per pill, scrubbed with tweenTo), the logo
 * spin on hover, the initial load animation, and the active-item dot.
 *
 * Changed:
 *   · next/link instead of react-router-dom (no new dependency);
 *   · a pill can open a panel (`menu`): a native <button> with aria-expanded
 *     and aria-controls, Escape / outside click / focus leaving / route change
 *     close it, Escape returns focus, ArrowDown opens it and moves into it;
 *   · a trailing call-to-action pill (`cta`), a real link;
 *   · the built-in mobile menu was removed: below 1024 px the site uses the
 *     option-wheel dock, so this bar is desktop-only;
 *   · no ARIA menubar roles: these are site links, so a plain list in a <nav>
 *     is the correct pattern (the menubar roles promised arrow-key behaviour
 *     the original did not implement);
 *   · reduced motion: the hover fill and the load animation are skipped;
 *   · colours come from tokens via CSS, not props.
 */

import { useCallback, useEffect, useId, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { gsap } from "gsap";

export type PillNavItem = {
  label: string;
  href?: string;
  ariaLabel?: string;
  /** Renders the pill as a button that opens this panel instead of a link. */
  menu?: ReactNode;
};

export interface PillNavProps {
  logo: string;
  logoAlt: string;
  logoHref?: string;
  items: PillNavItem[];
  cta?: { label: string; href: string };
  ease?: string;
  initialLoadAnimation?: boolean;
  className?: string;
}

const reducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export default function PillNav({
  logo,
  logoAlt,
  logoHref = "/",
  items,
  cta,
  ease = "power3.out",
  initialLoadAnimation = true,
  className = "",
}: PillNavProps) {
  const pathname = usePathname();
  const uid = useId().replace(/:/g, "");
  const circleRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const tlRefs = useRef<Array<gsap.core.Timeline | null>>([]);
  const activeTweenRefs = useRef<Array<gsap.core.Tween | null>>([]);
  const logoImgRef = useRef<HTMLImageElement | null>(null);
  const logoTweenRef = useRef<gsap.core.Tween | null>(null);
  const navItemsRef = useRef<HTMLDivElement | null>(null);
  const logoRef = useRef<HTMLAnchorElement | null>(null);
  const navRef = useRef<HTMLElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const [openMenu, setOpenMenu] = useState<number | null>(null);

  /* The hover timelines: a circle sized to the pill rises from below. */
  useEffect(() => {
    const layout = () => {
      circleRefs.current.forEach((circle, index) => {
        if (!circle?.parentElement) return;
        const pill = circle.parentElement as HTMLElement;
        const { width: w, height: h } = pill.getBoundingClientRect();
        if (!w || !h) return;
        const R = ((w * w) / 4 + h * h) / (2 * h);
        const D = Math.ceil(2 * R) + 2;
        const delta = Math.ceil(R - Math.sqrt(Math.max(0, R * R - (w * w) / 4))) + 1;
        const originY = D - delta;
        circle.style.width = `${D}px`;
        circle.style.height = `${D}px`;
        circle.style.bottom = `-${delta}px`;
        gsap.set(circle, {
          xPercent: -50,
          scale: 0,
          transformOrigin: `50% ${originY}px`,
        });

        const label = pill.querySelector<HTMLElement>(".pill-label");
        const hover = pill.querySelector<HTMLElement>(".pill-label-hover");
        if (label) gsap.set(label, { y: 0 });
        if (hover) gsap.set(hover, { y: Math.ceil(h + 100), opacity: 0 });

        tlRefs.current[index]?.kill();
        const tl = gsap.timeline({ paused: true });
        tl.to(circle, { scale: 1.2, xPercent: -50, duration: 2, ease, overwrite: "auto" }, 0);
        if (label) tl.to(label, { y: -(h + 8), duration: 2, ease, overwrite: "auto" }, 0);
        if (hover) tl.to(hover, { y: 0, opacity: 1, duration: 2, ease, overwrite: "auto" }, 0);
        tlRefs.current[index] = tl;
      });
    };

    layout();
    window.addEventListener("resize", layout);
    document.fonts?.ready.then(layout).catch(() => {});

    if (initialLoadAnimation && !reducedMotion()) {
      const logoEl = logoRef.current;
      const navItems = navItemsRef.current;
      if (logoEl) gsap.fromTo(logoEl, { scale: 0 }, { scale: 1, duration: 0.6, ease });
      if (navItems)
        gsap.fromTo(
          navItems,
          { width: 0, overflow: "hidden" },
          {
            width: "auto",
            duration: 0.6,
            ease,
            clearProps: "width,overflow",
            onComplete: layout,
          },
        );
    }

    return () => {
      window.removeEventListener("resize", layout);
      tlRefs.current.forEach((tl) => tl?.kill());
    };
  }, [items, ease, initialLoadAnimation]);

  const handleEnter = (i: number) => {
    const tl = tlRefs.current[i];
    if (!tl || reducedMotion()) return;
    activeTweenRefs.current[i]?.kill();
    activeTweenRefs.current[i] = tl.tweenTo(tl.duration(), {
      duration: 0.3,
      ease,
      overwrite: "auto",
    });
  };
  const handleLeave = (i: number) => {
    const tl = tlRefs.current[i];
    if (!tl) return;
    activeTweenRefs.current[i]?.kill();
    activeTweenRefs.current[i] = tl.tweenTo(0, {
      duration: 0.2,
      ease,
      overwrite: "auto",
    });
  };
  const handleLogoEnter = () => {
    const img = logoImgRef.current;
    if (!img || reducedMotion()) return;
    logoTweenRef.current?.kill();
    gsap.set(img, { rotate: 0 });
    logoTweenRef.current = gsap.to(img, {
      rotate: 360,
      duration: 0.2,
      ease,
      overwrite: "auto",
    });
  };

  /* ---- the panel ---- */
  const close = useCallback((focusTrigger = false) => {
    setOpenMenu(null);
    if (focusTrigger) triggerRef.current?.focus();
  }, []);

  useEffect(() => close(), [pathname, close]);

  useEffect(() => {
    if (openMenu === null) return;
    const panel = panelRef.current;
    if (panel && !reducedMotion())
      gsap.fromTo(panel, { opacity: 0, y: -8 }, { opacity: 1, y: 0, duration: 0.25, ease });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close(true);
        return;
      }
      if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
      const links = Array.from(panel?.querySelectorAll<HTMLElement>("a[href]") ?? []);
      const i = links.indexOf(document.activeElement as HTMLElement);
      if (i === -1 && document.activeElement !== triggerRef.current) return;
      e.preventDefault();
      const next = e.key === "ArrowDown" ? (i + 1) % links.length : (i - 1 + links.length) % links.length;
      links[next]?.focus();
    };
    const outside = (e: Event) => {
      if (!navRef.current?.contains(e.target as Node)) close();
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", outside);
    document.addEventListener("focusin", outside);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", outside);
      document.removeEventListener("focusin", outside);
    };
  }, [openMenu, close, ease]);

  const isActive = (href?: string) => !!href && !href.includes("#") && pathname === href;

  const pillInner = (label: string, i: number, caret = false) => (
    <>
      <span
        className="hover-circle"
        aria-hidden="true"
        ref={(el) => {
          circleRefs.current[i] = el;
        }}
      />
      <span className="label-stack">
        <span className="pill-label">
          {label}
          {caret ? <span className="pill-caret" aria-hidden="true" /> : null}
        </span>
        <span className="pill-label-hover" aria-hidden="true">
          {label}
          {caret ? <span className="pill-caret" /> : null}
        </span>
      </span>
    </>
  );

  return (
    <div className={`pill-nav-container ${className}`.trim()}>
      <nav className="pill-nav" aria-label="Primary" ref={navRef}>
        <Link className="pill-logo" href={logoHref} onMouseEnter={handleLogoEnter} ref={logoRef}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logo} alt="" ref={logoImgRef} width={225} height={123} />
          <span className="sr-only">{logoAlt}</span>
        </Link>

        <div className="pill-nav-items" ref={navItemsRef}>
          <ul className="pill-list">
            {items.map((item, i) => (
              <li key={item.label}>
                {item.menu ? (
                  <>
                    <button
                      ref={triggerRef}
                      type="button"
                      className={`pill ${openMenu === i ? "is-open" : ""}`}
                      aria-expanded={openMenu === i}
                      aria-controls={`${uid}-panel`}
                      onClick={() => setOpenMenu((v) => (v === i ? null : i))}
                      onKeyDown={(e) => {
                        if (e.key === "ArrowDown") {
                          e.preventDefault();
                          setOpenMenu(i);
                          window.requestAnimationFrame(() =>
                            panelRef.current?.querySelector<HTMLElement>("a[href]")?.focus(),
                          );
                        }
                      }}
                      onMouseEnter={() => handleEnter(i)}
                      onMouseLeave={() => handleLeave(i)}
                    >
                      {pillInner(item.label, i, true)}
                    </button>
                    {/* Right after its button, so Tab moves from the button
                      into the open panel (disclosure pattern). */}
                    <div
                      id={`${uid}-panel`}
                      ref={openMenu === i ? panelRef : undefined}
                      className="pill-panel"
                      hidden={openMenu !== i}
                      onClick={(e) => {
                        if ((e.target as HTMLElement).closest("a")) close();
                      }}
                    >
                      {item.menu}
                    </div>
                  </>
                ) : (
                  <Link
                    href={item.href ?? "/"}
                    className={`pill${isActive(item.href) ? " is-active" : ""}`}
                    aria-label={item.ariaLabel}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    onMouseEnter={() => handleEnter(i)}
                    onMouseLeave={() => handleLeave(i)}
                    onClick={() => close()}
                  >
                    {pillInner(item.label, i)}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>

        {cta ? (
          <Link className="pill-cta" href={cta.href} onClick={() => close()}>
            {cta.label}
          </Link>
        ) : null}
      </nav>
    </div>
  );
}
