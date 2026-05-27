# UniDate Design System

> **Yêu ở giảng đường** — A dating + social app for Vietnamese university students. Tinder's swipe mechanic, Hinge's profile depth, Threads' feed, with a campus-verified twist (only verified `.edu.vn` emails can join).

This system was built from scratch off a written brief — there was **no codebase, Figma, or existing brand attached**. Every visual decision below is an opinion that the team can push back on, not a translation of source material. Flag anything that doesn't fit your direction.

---

## 1. Product context

UniDate is a Flutter app shipping to Web + iOS + Android, with a web admin console. Primary surface is **mobile at 390 × 844**. Mode coverage: both light and dark are first-class.

**Eight priority screens** (mocked in `ui_kits/mobile/`):
1. Discover — swipe deck with like/pass/super-like buttons
2. Match modal — "It's a Match!" celebration
3. Chat — realtime 1-on-1 messaging
4. Social feed — posts, stories, like/comment (Threads-style)
5. Event detail — GPS check-in, group chat, attendees grid
6. Onboarding — 5-step wizard (name, birthday, gender, university, photos)
7. Profile view — full profile with photos, bio, interests, university badge
8. Admin dashboard (web) — stats, user management, reports

**Sources referenced for inspiration:** Tinder (swipe mechanic + FAB cluster), Bumble (clean M3-leaning UI), Hinge (prompt cards + depth), Threads (feed pattern). These were used as conceptual references — no asset was copied. Substitute or rework anything that gets too close to a competitor's distinct look.

---

## 2. Content fundamentals

**Language.** Vietnamese is the primary voice. English appears only in product nouns and where Gen-Z code-switching is natural (e.g. "Match ngay", "Boost", "Super-like"). Never machine-translated; the copy reads like a 20-year-old HCMUS student texts.

**Tone.** Young, warm, lightly playful. We greet by first name. We use "mình" / "bạn" (informal first/second person) — never "tôi" / "anh/chị/em" except in admin or legal copy. Sentence case for headings, never title case.

**Casing.** Sentence case for buttons (`Tham gia sự kiện`), labels (`Sở thích`), screen titles (`Khám phá hôm nay`). ALL CAPS reserved for micro-labels and chip badges (`BOOST · 4 PHÚT`, `SUPER-LIKE BẠN`, `HCMUS`). Never use Title Case English-style.

**Person.** We use "mình" for the user when speaking on their behalf (`mình đang học năm 3…`) and "bạn" when addressing them (`Tên bạn là gì?`). The product itself never refers to itself as "we" / "chúng tôi" — the brand stays invisible.

**Emoji.** Yes, but sparingly and on user-generated content, not on system chrome. Acceptable on placeholders (`🫶`, `📸`, `☕`, `🎸`, `🤩`). Never decorate buttons or nav items with emoji — that's the icon system's job.

**Example copy.**
- ✅ `Bạn và Đăng đã thích nhau · Gửi lời chào đầu tiên`
- ✅ `Cuối tuần này CLB Robotics BK có demo, bạn ghé chơi không?`
- ✅ `Cần email .edu.vn để xác thực sinh viên`
- ❌ `Welcome! We are excited to have you in our community.` (too formal, in English, third-person brand voice)
- ❌ `BẠN VÀ ĐĂNG ĐÃ THÍCH NHAU!!!` (shouts, over-punctuates)

**Numbers + dates.** 24h time (`19:00 – 22:00`). Day before month (`30/05`). Distance in km with one decimal (`1.2 km`). Comma thousands separator (`2,847`).

---

## 3. Visual foundations

### Palette
Three brand families plus neutrals. Each is a full M3-style tonal scale 10 → 99.
- **Love** (`#D6336C`) — magenta-rose. Primary CTA, like button, match modal. The dating heart. (Picked for energy without going hot-pink candy.)
- **Spark** (`#8B5CF6`) — purple. Social energy. Boost, story rings, feed accents.
- **Campus** (`#3B82F6`) — academic blue. University badges, verified marks, admin chrome.
- **Neutrals** — slate-leaning grays (`#0A0A0F` → `#FFFFFF`). Never pure black.
- **Semantic** — success green, warning amber, error red, plus a brand-owned **Super-like aqua** (`#00C8FF`) outside the M3 token tree.
- **Gradients** — used sparingly. The brand gradient is `Love → Spark` at 135°. The "It's a Match!" modal uses the `Sunset` 3-stop gradient (yellow → pink → purple).

See `colors_and_type.css` for the full tonal palette and surface roles.

### Type
- **Display:** Bricolage Grotesque (700/800) — modern, slightly expressive, used for headlines and the match modal hero. Letter-spacing -0.02em for tight optical balance at large sizes.
- **Body / UI:** Be Vietnamese Pro (400/500/600) — purpose-built for Vietnamese diacritics; renders `đặc biệt` cleanly at any size. **Critical for this market.**
- **Mono:** JetBrains Mono — used only in admin / debug surfaces.

Type scale follows M3: display (57/45/36), headline (32/28/24), title (22/16/14), body (16/14/12), label (14/12/11). Display + headline use the display font; titles and below switch to the body font for tighter UI density.

### Spacing
4-point grid. Mobile screen edge padding **16**. Card padding **16**. Section gap **24**. Modal padding **24–32**. Tap targets minimum **44 × 44**. The bottom nav adds **28px** safe-area padding for the home indicator.

### Shape / radii
M3 shape scale: 4 / 8 / 12 / 16 / 24 / 28 / pill. Specific usage:
- **28** — profile cards, modals (top corners), event hero cards
- **24** — feed posts, sidebar in admin
- **20** — inputs, secondary cards
- **16** — chips when not pill, info-row containers
- **pill (999)** — buttons, chips, FABs, tags

### Shadows / elevation
Six tokens (`--elev-1` → `--elev-5`, plus `--elev-love`). Soft layered shadows — pair short blur + long blur with low opacity. The `--elev-love` token has a colored pink-purple shadow used only on the primary like-button FAB and the "Match ngay" hero CTA. Shadow opacity halves in dark mode and uses pure black instead of tinted black.

### Backgrounds
No repeating patterns or hand-drawn textures. Backgrounds are:
- **Flat surface** for chrome (`var(--surface)`, `var(--surface-container)`)
- **Tonal photo gradient** for profile cards and event heros — a 160° gradient between two of the tonal palette colors (e.g. `#fbcfe8 → #c4b5fd → #d6336c`). These read as "where a photo should go" and are the placeholder for user-uploaded photos.
- **Radial glow** for hero overlays — used on the match modal scrim (`radial-gradient(ellipse at center, love→spark→neutral)`).

Avoid generic full-bleed photography of "happy diverse students at sunset." Use photo gradients until real user/asset photos are sourced.

### Imagery
Imagery is **user-generated, warm, candid**. Never stock photography, never AI-illustrated couples. The brand has no illustration system on purpose — placeholders use the tonal photo gradients above. Photo treatments: full-bleed, no border, no filter unless the user applies one in upload.

### Motion
M3 easing throughout:
- `--ease-standard` `cubic-bezier(0.2, 0, 0, 1)` — most transitions
- `--ease-emphasized-decelerate` — entries (screens sliding in)
- `--ease-bounce` `cubic-bezier(0.34, 1.56, 0.64, 1)` — the match modal hero, like-button feedback, story ring pulse

Durations: 150ms for state, 300–450ms for screen transitions, 600ms for the match-modal hero choreography. The match modal uses three staggered animations: scrim fade-in → modal pop → avatars bounce in with 150ms offset between them.

### State / interaction
- **Hover** — 8% currentColor overlay (`.state-layer::after` opacity 0.08)
- **Press** — 12% overlay, no shrink (M3 doesn't shrink)
- **Disabled** — surface-container-high background, fg-4 text, no shadow, `cursor: not-allowed`
- **Focused inputs** — 1.5px primary border + 4px 10%-primary glow ring
- **Error inputs** — 1.5px error-red border, error-red helper text

### Borders
- 1px borders use `var(--outline-variant)` (sublime, almost invisible)
- 1.5–2px borders use `var(--outline)` (assertive, used on selected state)
- Hairline dividers in tables: `var(--outline-variant)`

### Blur / transparency
Used on **overlays only** — never on chrome.
- Status pills on photos (`backdrop-filter: blur(10px) saturate(160%)`, `rgba(255,255,255,0.18)` glass)
- Story rail's "your story +" tile uses a dashed outline, not blur
- Match modal action buttons (the secondary one only) use glass

### Iconography
See `ICONOGRAPHY` section below.

---

## 4. Iconography

**System used:** [Material Symbols Rounded](https://fonts.google.com/icons) — Google's modern icon system, variable font with `FILL` and `wght` axes.

**Why:** Matches the Material 3 visual language the brief calls for. Variable axes let us animate fill on tap (e.g. heart outline → filled heart) without swapping assets. Single font file, ligature-driven (`<span class="msr">favorite</span>` renders the heart glyph), zero per-icon network requests.

**How it's loaded:** Linked from Google's CDN with `font-feature-settings: 'liga'` enabled on the icon class. See `index.html` heads — no self-hosting needed for prototype work. For production Flutter, ship the equivalent material symbols package and use the same names.

**Sizes used:**
- 14px — inline with body text (location pin, school badge)
- 18–20px — buttons, list rows
- 22–24px — bottom nav, app bar actions
- 28–32px — FABs (swipe actions)
- 64–140px — empty states, event hero icons

**FILL axis:**
- `FILL 0` (outline) — resting state, non-selected
- `FILL 1` (solid) — selected, active, primary CTA

**Emoji.** Used in user-generated content (bio, posts, prompt answers). Never used as system iconography or button decoration. Vietnamese users heavily use emoji in chat — preserve their input verbatim.

**No SVG icon set.** Custom illustration is out of scope; if a specific concept lacks a Material Symbol (e.g. our app logo), it's hand-crafted as SVG and stored in `assets/`.

**Substitutions flagged.** Material Symbols Rounded is the canonical icon set. If Flutter Material 3 ships a slightly different stroke weight, prefer the Flutter version on real device and update this doc.

---

## 5. Index — what's in this folder

```
/
├── README.md                  ← you are here
├── SKILL.md                   ← Claude/Agent Skill entry point
├── colors_and_type.css        ← all CSS vars (palette, type, spacing, motion)
│
├── assets/
│   ├── logo-mark.svg          ← gradient square + heart + spark
│   ├── logo-wordmark.svg      ← mark + "UniDate" wordmark (dark text)
│   └── logo-wordmark-light.svg← same, white text for dark backgrounds
│
├── preview/                   ← Design System tab cards (registered as assets)
│   ├── _card.css              ← shared card base
│   ├── brand-logo.html
│   ├── color-*.html           ← Love, Spark, Campus, Neutral, Semantic, Gradients, Surfaces
│   ├── type-*.html            ← Display, Headline, Body, Scale ladder
│   ├── spacing-scale.html
│   ├── radii.html
│   ├── elevation.html
│   └── cmp-*.html             ← Buttons, Swipe FABs, Inputs, Chips, Uni badges,
│                                Bottom nav, Profile cards, Match modal, Avatars, Chat bubbles
│
└── ui_kits/
    ├── mobile/                ← Flutter app recreation, 390×844
    │   ├── index.html         ← Interactive click-thru of all 15 screens
    │   ├── showcase.html      ← Light + dark grid of every screen (shareable sheet)
    │   ├── README.md
    │   ├── ios-frame.jsx
    │   ├── components.jsx
    │   └── screens/
    │       ├── Discover.jsx
    │       ├── MatchModal.jsx
    │       ├── Chat.jsx
    │       ├── Matches.jsx
    │       ├── Feed.jsx
    │       ├── Events.jsx
    │       ├── Profile.jsx
    │       ├── ProfileEdit.jsx
    │       ├── Settings.jsx
    │       ├── StoryViewer.jsx
    │       ├── Notifications.jsx
    │       ├── FilterSheet.jsx
    │       ├── EmptyStates.jsx
    │       └── Onboarding.jsx
    └── admin/                 ← Web admin dashboard
        ├── index.html
        └── README.md
```

---

## 6. Substitutions to flag for the user

- **Fonts.** Bricolage Grotesque, Be Vietnam Pro, and JetBrains Mono are loaded from Google Fonts CDN, not self-hosted. If you want offline-able TTFs, download from [Google Fonts](https://fonts.google.com/) and replace the `@import` in `colors_and_type.css` with `@font-face` declarations pointing at `fonts/`.
- **Logo.** Hand-drawn — gradient square with a heart and sparkle. **Not a real brand logo.** Replace with a designer-made mark when ready.
- **Vietnamese university names.** I used HCMUS, BK, UEH, FTU, RMIT, USSH, UEL as plausible launch markets. Confirm with the team — there are 250+ universities in Vietnam.
- **Photos.** All "photos" are tonal color gradients. Swap in real user content or licensed stock when you have it.
- **No source material.** This was built off a written brief, not a Figma file or codebase. Treat every aesthetic decision as a starting point, not a translation.
