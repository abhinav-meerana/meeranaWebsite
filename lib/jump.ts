/**
 * Jump to a homepage section by id.
 *
 * An instant jump, not a smooth scroll: a glide across the pinned story would
 * scrub its whole timeline in a second, which is both janky and the kind of
 * large movement people with vestibular sensitivity ask sites to avoid. It
 * uses scrollIntoView so the CSS scroll-padding (the floating nav) applies,
 * records the hash without adding a history entry, and moves focus to the
 * section for keyboard and screen-reader users.
 */
export function jumpToSection(id: string): boolean {
  const el = document.getElementById(id);
  if (!el) return false;
  if (id === "top") window.scrollTo({ top: 0, behavior: "auto" });
  else el.scrollIntoView({ block: "start", behavior: "auto" });
  try {
    history.replaceState(history.state, "", id === "top" ? window.location.pathname : `#${id}`);
  } catch {
    /* A sandboxed frame may refuse; the jump itself already happened. */
  }
  if (!el.hasAttribute("tabindex")) el.setAttribute("tabindex", "-1");
  el.focus({ preventScroll: true });
  return true;
}
