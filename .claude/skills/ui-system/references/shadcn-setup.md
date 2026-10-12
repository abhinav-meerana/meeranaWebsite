# shadcn/ui on Tailwind v4, configured for these tokens

Verified against the official docs and changelog on 2026-10-01: shadcn CLI 4.21.0, Tailwind 4.3.3, Next.js 16.3.8, React 19.3. Sources are listed in the stack-fact research: ui.shadcn.com/docs/{installation/next, theming, components-json, tailwind-v4, changelog}.

## 1. What changed in 2025–2026 (don't follow older tutorials)

**Defaults and imports:**
- **Base UI is the default primitive library** (since Jul 2026). Keep Radix with `-b radix`.
  - Base UI composes with `render`, Radix with `asChild`.
  - For links styled as buttons, use `className={buttonVariants()}` on `<Link>`/`<a>`. Don't wrap a link in a Button.
- `cn` comes from the **`cn` package** (Sep 2026): `lib/utils.ts` → `export { cn } from "cn"`. Older projects keep `clsx` + `tailwind-merge`, which still works.
- The scaffold imports `shadcn/tailwind.css` (accordion keyframes, `data-open`/`data-closed` variants, `no-scrollbar`). Keep that import.
- `tailwindcss-animate` is deprecated. Use `@import "tw-animate-css";`.

**Tokens and styles:**
- Tokens are OKLCH in the default themes. We **replace** them with our hex semantic variables (exact brand values).
- Never wrap our tokens in `hsl()`/`oklch()`.
- New styles (`base-nova`, `radix-vega` …). `new-york` is legacy Radix. `style`, `baseColor` and `cssVariables` **cannot change after init**.

## 2. Install (Next.js 16, App Router)

```bash
npx shadcn@latest init -t next -b radix
```

Use `-b base` instead if the team prefers Base UI. Then add only the primitives you need:

```bash
npx shadcn@latest add button dialog sheet tabs accordion navigation-menu select tooltip form input textarea checkbox
```

`components.json`. The relevant fields:

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "radix-vega",
  "rsc": true,
  "tsx": true,
  "tailwind": { "config": "", "css": "app/globals.css", "baseColor": "neutral", "cssVariables": true, "prefix": "" },
  "aliases": { "components": "@/components", "utils": "@/lib/utils", "ui": "@/components/ui", "lib": "@/lib", "hooks": "@/hooks" },
  "iconLibrary": "lucide"
}
```

## 3. globals.css: replace the generated theme with ours

```css
@import "tailwindcss";
@import "tw-animate-css";
@import "shadcn/tailwind.css";
@import "./tokens.css";          /* copy of .claude/skills/ui-system/references/tokens.css */

/* Delete the generated :root { --background: oklch(...) } and .dark { ... } blocks.
   tokens.css already defines --color-background, --color-primary, … in @theme inline
   and resolves them per data-surface / data-brand. */
```

**Dark variant:**
- shadcn's scaffold writes `@custom-variant dark (&:is(.dark *));`. **Remove it.**
- `tokens.css` defines `dark` against `data-surface`. Keep exactly one `dark` variant.

**Do not install `next-themes`** for marketing pages. Surfaces are chosen by section purpose, not a global toggle. Product demos that need a theme toggle (e.g. the Nazo light/dark switch) scope it with `data-surface` on the demo frame.

## 4. Fonts with next/font, wired to the tokens

```tsx
// app/layout.tsx  (Meerana)
import { Poppins, Almarai } from "next/font/google";
const poppins = Poppins({ subsets: ["latin"], weight: ["300", "400", "500", "600"], variable: "--font-poppins", display: "swap" });
const almarai = Almarai({ subsets: ["arabic"], weight: ["400", "700"], variable: "--font-almarai", display: "swap" });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" dir="ltr" data-brand="meerana" data-surface="dark" className={`${poppins.variable} ${almarai.variable}`}>
      <body>{children}</body>
    </html>
  );
}
```

YISBIR uses `Montserrat`, `Tajawal` and `IBM_Plex_Mono` with the variables `--font-montserrat`, `--font-tajawal` and `--font-plex-mono`, plus `data-brand="yisbir"`.

## 5. Restyling rules for generated components
1. Replace raw colour classes with semantic ones:
   - `bg-primary` is fine: it maps to `--action-primary-bg`.
   - Replace `ring-ring/50` with `outline-focus`.
2. Radius:
   - Buttons and inputs: `rounded-control` / `rounded-input`.
   - Cards, popovers and dialogs: `rounded-card` / `rounded-panel`.
3. Shadows:
   - **Dark surfaces:** remove `shadow-*`; use `border border-line`.
   - **Light surfaces:** `shadow-sm` at most for popovers.
4. Remove `backdrop-blur` from overlays. Use an opaque scrim, `bg-surface-deep/80`.
5. Button variants (cva):
   - `primary`: `bg-action text-on-action hover:bg-action-hover`
   - `secondary`: `border border-action-secondary text-on-action-secondary`
   - `link`: `text-link underline-offset-4 hover:underline`
   - `product`: `bg-product text-on-product`
   - Sizes: `h-11` (≥ 44 px target) and `h-9` for dense UI only.
6. Keep the `data-slot` attributes. Style compound parts via `data-slot`, not deep selectors.

## 6. Verification
- `npx shadcn@latest add` writes files, so inspect the diff and remove any OKLCH theme blocks it re-adds.
- Run `python .claude/skills/ui-system/scripts/contrast.py --gate` and the `anti-generic-audit` script on rendered pages.
- Keyboard-test every primitive: Dialog focus trap and return, Tabs arrow keys, NavigationMenu disclosure.
