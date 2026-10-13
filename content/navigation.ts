/**
 * Site navigation: one source for the desktop PillNav, the tablet/phone
 * option wheel and the homepage section ids they keep in step with.
 *
 * Every destination is a real route or a real section id. There are no case
 * study or careers pages, so neither appears (brief §9.1, "if available").
 */

import { SHOWCASE } from "./showcase";

export type WheelKey = "home" | "platforms" | "solutions" | "technology" | "about" | "contact";

export type WheelItem = {
  key: WheelKey;
  label: string;
  /** The homepage section this item scrolls to. */
  section: string;
  /** Where it goes from any other route. */
  route: string;
};

/** The wheel, top to bottom (brief §9.2). */
export const WHEEL_ITEMS: WheelItem[] = [
  { key: "home", label: "Home", section: "top", route: "/" },
  { key: "platforms", label: "Platforms", section: "platforms", route: "/products/" },
  { key: "solutions", label: "Solutions", section: "solutions", route: "/services/" },
  { key: "technology", label: "Technology", section: "technology", route: "/#technology" },
  { key: "about", label: "About", section: "about", route: "/company/" },
  { key: "contact", label: "Contact", section: "contact", route: "/contact/" },
];

/** Which wheel item a non-home route belongs to. */
export function routeKey(pathname: string): WheelKey {
  if (pathname.startsWith("/products")) return "platforms";
  if (pathname.startsWith("/services")) return "solutions";
  if (pathname.startsWith("/company")) return "about";
  if (pathname.startsWith("/contact")) return "contact";
  return "home";
}

/** The desktop PillNav: Platforms opens a panel; the rest are routes. */
export const PILL_LINKS: { label: string; href: string }[] = [
  { label: "Solutions", href: "/services/" },
  { label: "Technology", href: "/#technology" },
  { label: "About", href: "/company/" },
  { label: "Contact", href: "/contact/" },
];

/** The Platforms panel: the six products, then the index. */
export const PLATFORM_LINKS = SHOWCASE.map((p) => ({
  slug: p.slug,
  index: p.index,
  name: p.name,
  descriptor: p.descriptor,
  accent: p.accent,
  href: `/products/${p.slug}/`,
}));

/** The desktop call to action: the real contact route. */
export const NAV_CTA = { label: "Talk to Meerana", href: "/contact/" };
