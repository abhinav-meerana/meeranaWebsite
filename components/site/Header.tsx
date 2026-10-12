"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SHOWCASE } from "@/content/showcase";

/* ============================================================================
   Site header (plan/06 §3, plan/08 M-global-02).

     · transparent over the hero; after 80px: solid surface, 1px border;
     · never hides on scroll;
     · desktop: Products opens a compact router panel (not a mega-menu) so all
       six products are reachable from every page;
     · below 1024px: a sheet, rendered always (hidden when closed, so its
       `aria-controls` target exists) with a real focus trap and focus return.

   Keyboard: Enter/Space open the panel, ArrowDown/Up/Home/End move through it,
   Escape closes it and returns focus to its button.
   ========================================================================== */

const FOCUSABLE =
  'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

export default function Header() {
  const pathname = usePathname();
  const [condensed, setCondensed] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);

  const toggleRef = useRef<HTMLButtonElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    const onScroll = () => setCondensed(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Any navigation closes both menus. */
  useEffect(() => {
    setSheetOpen(false);
    setPanelOpen(false);
  }, [pathname]);

  /* ---- mobile sheet: scroll lock, focus in, trap, Escape, focus return ---- */
  useEffect(() => {
    if (!sheetOpen) return;
    const sheet = sheetRef.current;
    const toggle = toggleRef.current;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const items = () =>
      Array.from(sheet?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? []);
    items()[0]?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setSheetOpen(false);
        return;
      }
      if (e.key !== "Tab") return;
      const list = items();
      if (list.length === 0) return;
      const first = list[0];
      const last = list[list.length - 1];
      const active = document.activeElement as HTMLElement | null;
      if (e.shiftKey && (active === first || !sheet?.contains(active))) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (active === last || !sheet?.contains(active))) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      toggle?.focus();
    };
  }, [sheetOpen]);

  /* ---- desktop router panel: outside click, Escape, focus leaving ---- */
  useEffect(() => {
    if (!panelOpen) return;
    const onPointer = (e: PointerEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setPanelOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setPanelOpen(false);
        triggerRef.current?.focus();
      }
    };
    const onFocusIn = (e: FocusEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setPanelOpen(false);
    };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    document.addEventListener("focusin", onFocusIn);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("focusin", onFocusIn);
    };
  }, [panelOpen]);

  const panelLinks = () =>
    Array.from(panelRef.current?.querySelectorAll<HTMLElement>("a") ?? []);

  const onTriggerKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setPanelOpen(true);
      // The panel is un-hidden on the next render; focus after it paints.
      window.requestAnimationFrame(() => panelLinks()[0]?.focus());
    }
  };

  const onPanelKey = (e: React.KeyboardEvent) => {
    const links = panelLinks();
    const i = links.indexOf(document.activeElement as HTMLElement);
    if (e.key === "ArrowDown") {
      e.preventDefault();
      links[(i + 1) % links.length]?.focus();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      links[(i - 1 + links.length) % links.length]?.focus();
    } else if (e.key === "Home") {
      e.preventDefault();
      links[0]?.focus();
    } else if (e.key === "End") {
      e.preventDefault();
      links[links.length - 1]?.focus();
    }
  };

  return (
    <header className={`site-header ${condensed ? "is-condensed" : ""}`}>
      <div className="hdr-inner">
        <Link className="hdr-logo" href="/">
          {/* The official symbol, white colourway on navy (brand PDF), cropped
              and never recoloured or redrawn. Vector masters are DL-B02.
              No typed wordmark beside it: the official horizontal lockup
              replaces the symbol only if the client approves it (D14,
              FINAL-SPEC §9), so until then the name is sr-only text. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="hdr-mark"
            src="/brand/meerana-symbol-white.png"
            width={225}
            height={123}
            alt=""
          />
          <span className="sr-only">Meerana Technologies — home</span>
        </Link>

        <nav className="hdr-nav" aria-label="Primary">
          <ul>
            <li ref={wrapRef} className="hdr-products-wrap">
              <button
                ref={triggerRef}
                type="button"
                className="hdr-trigger"
                aria-expanded={panelOpen}
                aria-controls="hdr-products-panel"
                onClick={() => setPanelOpen((v) => !v)}
                onKeyDown={onTriggerKey}
              >
                Products
                <span className="hdr-caret" aria-hidden="true" data-open={panelOpen} />
              </button>

              <div
                ref={panelRef}
                id="hdr-products-panel"
                className="hdr-panel"
                hidden={!panelOpen}
                onKeyDown={onPanelKey}
              >
                <ul className="hdr-panel-list">
                  {SHOWCASE.map((p) => (
                    <li key={p.slug}>
                      <Link href={`/products/${p.slug}/`}>
                        <span
                          className="hdr-tick"
                          aria-hidden="true"
                          style={{ background: p.accent }}
                        />
                        <span className="hdr-panel-name">{p.name}</span>
                        <span className="hdr-panel-desc">{p.descriptor}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
                <Link className="hdr-panel-all" href="/products/">
                  All six products <span aria-hidden="true">→</span>
                </Link>
              </div>
            </li>
            <li>
              <Link href="/services/">Services</Link>
            </li>
            <li>
              <Link href="/company/">Company</Link>
            </li>
          </ul>
        </nav>

        <div className="hdr-actions">
          <Link className="btn btn-primary hdr-cta" href="/contact/">
            Talk to Meerana
          </Link>

          <button
            ref={toggleRef}
            type="button"
            className="hdr-toggle"
            aria-expanded={sheetOpen}
            aria-controls="hdr-sheet"
            onClick={() => setSheetOpen((v) => !v)}
          >
            <span className="sr-only">{sheetOpen ? "Close menu" : "Open menu"}</span>
            <span className="hdr-bars" aria-hidden="true" data-open={sheetOpen} />
          </button>
        </div>
      </div>

      {/* Mobile sheet: rendered always so `aria-controls` resolves; `hidden`
          removes it from the tab order and the accessibility tree when closed. */}
      <button
        className="hdr-scrim"
        aria-label="Close menu"
        hidden={!sheetOpen}
        tabIndex={-1}
        onClick={() => setSheetOpen(false)}
      />
      <div
        ref={sheetRef}
        className="hdr-sheet"
        id="hdr-sheet"
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        hidden={!sheetOpen}
      >
        <div className="hdr-sheet-head">
          <p className="annot">Products</p>
          <button
            type="button"
            className="hdr-close"
            onClick={() => setSheetOpen(false)}
          >
            Close<span className="sr-only"> menu</span>
          </button>
        </div>
        <ul className="hdr-products">
          {SHOWCASE.map((p) => (
            <li key={p.slug}>
              <Link href={`/products/${p.slug}/`}>
                <span className="annot">{p.index}</span>
                {p.name}
              </Link>
            </li>
          ))}
        </ul>
        <Link className="hdr-sheet-all" href="/products/">
          All six products <span aria-hidden="true">→</span>
        </Link>

        <p className="annot hdr-sheet-label">Site</p>
        <ul className="hdr-sections">
          <li>
            <Link href="/services/">Services</Link>
          </li>
          <li>
            <Link href="/company/">Company</Link>
          </li>
          <li>
            <Link href="/contact/">Contact</Link>
          </li>
        </ul>
      </div>
    </header>
  );
}
