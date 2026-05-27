---
name: unidate-design
description: Use this skill to generate well-branded interfaces and assets for UniDate (a dating + social app for Vietnamese university students), either for production or throwaway prototypes/mocks. Contains essential design guidelines, colors, type, fonts, assets, and UI kit components for prototyping.
user-invocable: true
---

# UniDate design skill

UniDate is a dating + social app for Vietnamese university students. The visual system is Material 3 — leaning, with a purple-pink "dating" palette and a blue-white "academic" accent. Mobile-first at 390 × 844; supports both light + dark mode.

## Start here

1. **Read `README.md`** — it's the manifest. Sections cover Content Fundamentals, Visual Foundations, and Iconography. The `Index` section maps every file in the system.
2. **Read `colors_and_type.css`** — every token (color, type, spacing, motion, radii, shadow) lives here. Reference these vars; never hard-code.
3. **Browse `preview/`** — small focused cards demonstrating each token / component. These render the system at a glance.
4. **Browse `ui_kits/`**:
   - `mobile/index.html` — interactive click-thru of all 8 priority screens inside an iPhone frame.
   - `mobile/screens/*.jsx` — copy-paste reference for each screen.
   - `mobile/components.jsx` — `Icon`, `Avatar`, `UniBadge`, `BottomNav`, `AppBar`, `IconBtn`.
   - `admin/index.html` — web admin dashboard.

## When making throwaway visual artifacts

- Copy `colors_and_type.css` and any assets you need into your output folder.
- Link Material Symbols Rounded from CDN: `<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL@20..48,300..700,0..1&display=block">` and add the `.msr` class with `font-feature-settings: 'liga'`.
- Static HTML is fine; React with Babel-standalone is fine. Follow `ui_kits/mobile/index.html` as the canonical pattern.

## When working on production code (Flutter / React)

- Lift the values from `colors_and_type.css` into your platform's token system. The `--love-*`, `--spark-*`, `--campus-*` scales correspond to M3 primary/secondary/tertiary tonal palettes.
- Use Material Symbols Rounded from the `material_symbols` Flutter package or web equivalent. Match the FILL + weight axes per state (`FILL 0` resting, `FILL 1` active/selected).
- Be Vietnam Pro is non-negotiable for body text — Vietnamese diacritics render correctly on it.

## When the user invokes this skill with no other context

Ask what they want to build:
- A new screen? Which feature?
- A marketing asset? What surface (social, in-app, email)?
- A pitch deck? For whom?

Then ask 5–10 clarifying questions in the style of a senior designer. Confirm the surface, audience, language (likely Vietnamese), variants requested, and any divergence from existing patterns. Build with what you have; flag substitutions for anything missing.

## Anti-patterns to avoid

- Pure black backgrounds (use `--neutral-5` or `--surface` instead)
- Title Case English headings — UniDate uses sentence case
- Stock-photo "diverse students at sunset" imagery (use tonal photo gradients as placeholders)
- Emoji as system iconography on buttons or nav — emoji only appear in user-generated content
- Hand-drawn SVG icons — use Material Symbols
- Gradients on body text or chrome — gradients are reserved for hero CTAs, match modal, splash, story rings
- Formal Vietnamese ("tôi", "quý vị") — use "mình" / "bạn"
