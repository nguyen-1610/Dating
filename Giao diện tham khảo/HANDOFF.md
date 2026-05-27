# UniDate · Developer Handoff

> Single-source reference for engineering. All values are mirrored in `colors_and_type.css` — read code first, this doc is for human review.

**Last updated:** May 2026 · **Design version:** v0.4

---

## 1. Color tokens

### 1.1 Brand palettes (full M3-style tonal scales)

#### Love — Primary · `#D6336C`
The dating heart. Like buttons, match modal, primary CTAs.

| Tone | Hex | Usage |
|---|---|---|
| `--love-10` | `#3D0014` | On-primary text in deep dark mode |
| `--love-20` | `#5C0223` | Primary-container fg (dark) |
| `--love-30` | `#7E0936` | Primary-container bg (dark) |
| `--love-40` | `#A2154D` | Hover state, accessible link color |
| `--love-50` | `#BC1F60` | Pressed state |
| `--love-60` | `#D6336C` | **BASE — primary** |
| `--love-70` | `#E25F8B` | Primary (dark mode) |
| `--love-80` | `#ED8FAE` | Disabled fill |
| `--love-90` | `#F8C6D5` | Primary-container fg (light) |
| `--love-95` | `#FCE3EB` | Primary-container bg (light) |
| `--love-99` | `#FFF8FB` | Surface tinted |

#### Spark — Secondary · `#8B5CF6`
Social energy. Boost, super-like glow, story rings, feed accents.

| Tone | Hex |
|---|---|
| `--spark-20` | `#341878` |
| `--spark-30` | `#4A279F` |
| `--spark-40` | `#6336C6` |
| `--spark-50` | `#7C4DEE` |
| `--spark-60` | `#8B5CF6` ← base |
| `--spark-70` | `#A78BFA` |
| `--spark-80` | `#C4B5FD` |
| `--spark-90` | `#E0D6FF` |
| `--spark-95` | `#F1EBFF` |

#### Campus — Tertiary · `#3B82F6`
Academic / trust. University badges, verified marks, admin chrome.

| Tone | Hex |
|---|---|
| `--campus-20` | `#122F73` |
| `--campus-30` | `#1B40A0` |
| `--campus-40` | `#2553CC` |
| `--campus-50` | `#3268EB` |
| `--campus-60` | `#3B82F6` ← base |
| `--campus-70` | `#60A5FA` |
| `--campus-80` | `#93C5FD` |
| `--campus-90` | `#BFDBFE` |
| `--campus-95` | `#DBEAFE` |

### 1.2 Neutrals

| Token | Hex | Token | Hex |
|---|---|---|---|
| `--neutral-0`  | `#000000` | `--neutral-60`  | `#878798` |
| `--neutral-5`  | `#0A0A0F` | `--neutral-70`  | `#A5A5B3` |
| `--neutral-10` | `#14141A` | `--neutral-80`  | `#C5C5CF` |
| `--neutral-15` | `#1D1D24` | `--neutral-90`  | `#E5E5EC` |
| `--neutral-20` | `#25252E` | `--neutral-94`  | `#EEEEF3` |
| `--neutral-25` | `#2F2F39` | `--neutral-96`  | `#F4F4F7` |
| `--neutral-30` | `#3A3A45` | `--neutral-98`  | `#F9F9FB` |
| `--neutral-40` | `#525261` | `--neutral-100` | `#FFFFFF` |
| `--neutral-50` | `#6B6B7C` | | |

### 1.3 Semantic

| Token | Hex | Container | Hex |
|---|---|---|---|
| `--success`   | `#10B981` | `--success-container` | `#D1FAE5` |
| `--warning`   | `#F59E0B` | `--warning-container` | `#FEF3C7` |
| `--error`     | `#EF4444` | `--error-container`   | `#FEE2E2` |
| `--info`      | `#3B82F6` | `--info-container`    | `#DBEAFE` |
| `--superlike` | `#00C8FF` | `--superlike-container` | `#CDF3FF` |

### 1.4 Surface roles

| Token | Light | Dark |
|---|---|---|
| `--surface`                    | `#FFFFFF` | `#0F0F14` |
| `--surface-dim`                | `#F4F4F7` | `#0A0A0F` |
| `--surface-container-lowest`   | `#FFFFFF` | `#07070B` |
| `--surface-container-low`      | `#FBFBFD` | `#14141A` |
| `--surface-container`          | `#F4F4F7` | `#1A1A22` |
| `--surface-container-high`     | `#EDEDF2` | `#25252E` |
| `--surface-container-highest`  | `#E5E5EC` | `#2F2F39` |
| `--on-surface`                 | `#14141A` | `#EDEDF2` |
| `--on-surface-variant`         | `#525261` | `#A5A5B3` |
| `--outline`                    | `#C5C5CF` | `#525261` |
| `--outline-variant`            | `#E5E5EC` | `#3A3A45` |

### 1.5 Brand gradients

| Token | Definition | Usage |
|---|---|---|
| `--grad-love`   | `linear-gradient(135deg, #D6336C 0%, #8B5CF6 100%)` | Hero CTAs, primary buttons, story rings |
| `--grad-spark`  | `linear-gradient(135deg, #8B5CF6 0%, #3B82F6 100%)` | Boost FAB, secondary hero |
| `--grad-campus` | `linear-gradient(135deg, #3B82F6 0%, #06B6D4 100%)` | Verification, admin charts |
| `--grad-sunset` | `linear-gradient(135deg, #FBBF24 0%, #D6336C 50%, #8B5CF6 100%)` | Match modal scrim, premium upsell |

---

## 2. Typography

Three families, all loaded from Google Fonts CDN. **Be Vietnam Pro is required for body** — Vietnamese diacritics render correctly. Bricolage Grotesque is a variable display font (opsz 12–96). JetBrains Mono for admin/debug only.

### 2.1 Type scale

| Token / Class | Size / Line | Weight | Tracking | Family | Usage |
|---|---|---|---|---|---|
| `display-lg` | 57 / 64 | 700 | -0.02em | Bricolage | Splash, match modal hero |
| `display-md` | 45 / 52 | 700 | -0.02em | Bricolage | Section heros, story captions |
| `display-sm` | 36 / 44 | 600 | -0.015em | Bricolage | Card headers, modal titles |
| `h1` / `headline-lg` | 32 / 40 | 700 | -0.01em | Bricolage | Top-level page titles |
| `h2` / `headline-md` | 28 / 36 | 600 | -0.005em | Bricolage | App-bar titles, section H |
| `h3` / `headline-sm` | 24 / 32 | 600 | 0 | Bricolage | Subsection headers |
| `h4` / `title-lg` | 22 / 28 | 600 | 0 | Be VN Pro | Card titles, list headers |
| `h5` / `title-md` | 16 / 24 | 600 | 0.005em | Be VN Pro | List item titles, settings rows |
| `h6` / `title-sm` | 14 / 20 | 600 | 0.005em | Be VN Pro | Micro-headers |
| `body-lg` | 16 / 24 | 400 | 0 | Be VN Pro | Body copy, chat bubbles |
| `body-md` | 14 / 20 | 400 | 0 | Be VN Pro | Secondary copy, captions |
| `body-sm` | 12 / 16 | 400 | 0 | Be VN Pro | Helpers, timestamps |
| `label-lg` | 14 / 20 | 600 | 0.005em | Be VN Pro | Buttons, primary chips |
| `label-md` | 12 / 16 | 600 | 0.04em | Be VN Pro | Filter chips, small CTAs |
| `label-sm` | 11 / 16 | 600 | 0.05em UPPER | Be VN Pro | Section eyebrows, taglines |
| `mono` | inherit | 400/500 | 0 | JetBrains Mono | Code, version strings, tokens |

### 2.2 Font CDN links

```html
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,500;12..96,600;12..96,700;12..96,800&family=Be+Vietnam+Pro:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap">
```

Material Symbols Rounded for icons:
```html
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL@20..48,300..700,0..1&display=block">
```

---

## 3. Shape, spacing, motion

### 3.1 Radii

| Token | Value | Usage |
|---|---|---|
| `--r-xs` | 4px | Small dividers, tick marks |
| `--r-sm` | 8px | Tight components |
| `--r-md` | 12px | Settings row icons, small cards |
| `--r-lg` | 16px | Inputs, content cards, post images |
| `--r-xl` | 24px | Large cards, admin panels |
| `--r-2xl` | 28px | Bottom sheets, profile cards, sheet tops |
| `--r-3xl` | 32px | Phone bezels, modals |
| `--r-pill` | 999px | Buttons, chips, FABs, tags |

### 3.2 Spacing scale (4pt grid)

| Token | Value | Token | Value |
|---|---|---|---|
| `--s-1` | 4px  | `--s-7`  | 32px |
| `--s-2` | 8px  | `--s-8`  | 40px |
| `--s-3` | 12px | `--s-9`  | 48px |
| `--s-4` | 16px | `--s-10` | 64px |
| `--s-5` | 20px | `--s-11` | 80px |
| `--s-6` | 24px | `--s-12` | 96px |

Mobile screen edge: **16px**. Card padding: **16–20px**. Modal padding: **24–32px**. Section gap: **24px**. Min tap target: **44 × 44**.

### 3.3 Elevation

| Token | Shadow | Usage |
|---|---|---|
| `--elev-1` | `0 1px 2px rgba(0,0,0,.04), 0 1px 3px 1px rgba(0,0,0,.06)` | Resting cards |
| `--elev-2` | `0 1px 2px rgba(0,0,0,.05), 0 2px 6px 2px rgba(0,0,0,.08)` | Raised / hover |
| `--elev-3` | `0 4px 8px 3px rgba(0,0,0,.08), 0 1px 3px 0 rgba(0,0,0,.06)` | FABs, menus |
| `--elev-4` | `0 6px 12px 6px rgba(0,0,0,.10), 0 2px 3px 0 rgba(0,0,0,.06)` | Drawer, nav bar |
| `--elev-5` | `0 8px 24px 8px rgba(0,0,0,.12), 0 4px 6px 0 rgba(0,0,0,.08)` | Modals, dialogs |
| `--elev-love` | `0 12px 32px -8px rgba(214,51,108,.45), 0 4px 12px -2px rgba(139,92,246,.20)` | Match hero, like FAB |

### 3.4 Motion

| Token | Curve | Usage |
|---|---|---|
| `--ease-standard` | `cubic-bezier(0.2, 0, 0, 1)` | Most state transitions |
| `--ease-emphasized-decelerate` | `cubic-bezier(0.05, 0.7, 0.1, 1)` | Bottom sheet enter, screen pushes |
| `--ease-emphasized-accelerate` | `cubic-bezier(0.3, 0, 0.8, 0.15)` | Exits |
| `--ease-bounce` | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Match hero, avatar bounce, like feedback |

Durations: 150ms (state), 250–400ms (transitions), 600ms (match modal staggered choreography).

---

## 4. Screens

20 screens across 4 phases. All screens render at **390 × 844**, support light + dark via `data-theme` on document root.

| # | Screen | File | Surface | Description |
|---|---|---|---|---|
| 01 | **Splash · intro** | `OnboardingSplash.jsx` | Standalone | Brand hero, value prop, 3 floating preview cards, CTA → wizard |
| 02 | **Onboarding** | `Onboarding.jsx` | Standalone | 5-step wizard: name → birthday → gender → university → photos |
| 03 | **Discover** | `Discover.jsx` | Tab | Swipe deck with rewind / pass / super-like / like / boost FABs. Boost icon opens `BoostSheet` |
| 04 | **Match modal** | `MatchModal.jsx` | Overlay | "It's a Match!" celebration. 36-piece confetti burst, bouncing avatars, shimmering headline |
| 05 | **Matches list** | `Matches.jsx` | Tab | New-matches grid (incl. "12 thích bạn" locked tile) + recent conversation list |
| 06 | **Chat** | `Chat.jsx` | Push | 1-on-1 messaging. Text bubbles + photo bubbles. Tap photo → lightbox |
| 07 | **Image lightbox** | `Chat.jsx` (component) | Overlay | Full-screen photo viewer with sender info, reply composer |
| 08 | **Filter sheet** | `FilterSheet.jsx` | Sheet | Age dual-range, distance, university multi-select, verified + online toggles |
| 09 | **Boost / Premium upsell** | `BoostSheet.jsx` | Sheet | Tabbed: Boost (3 tiers, one-time) + Premium (3-month plan, 6 perks) |
| 10 | **Notifications** | `Notifications.jsx` | Push | Today + Week groups, type icons over avatar |
| 11 | **Social feed** | `Feed.jsx` | Tab | Threads-style posts, story rail at top |
| 12 | **Story viewer** | `StoryViewer.jsx` | Overlay | 24h countdown, auto-advance, tap to skip, hold to pause, IG-style left-bottom caption |
| 13 | **Events list** | `Events.jsx` | Tab | Filterable cards: date, venue, distance, attendee preview |
| 14 | **Event detail** | `Events.jsx` | Push | Hero, info rows, GPS check-in CTA, attendees grid, group chat shortcut |
| 15 | **Profile view** | `Profile.jsx` | Tab | Photo carousel (rounded floating), verified pill, bio, facts, interests, prompts |
| 16 | **Profile edit** | `ProfileEdit.jsx` | Push | Drag-to-reorder photo grid (FLIP-animated), bio, interest chips, social inputs |
| 17 | **Settings** | `Settings.jsx` | Push | 5 grouped sections + destructive zone (logout, delete) |
| 18 | **Empty · no profiles** | `EmptyStates.jsx` | State | Discover tab when deck is exhausted |
| 19 | **Empty · no matches** | `EmptyStates.jsx` | State | Matches tab when empty |
| 20 | **Empty · no messages** | `EmptyStates.jsx` | State | Conversation list when empty |

### 4.1 Admin (web)

| # | Screen | File | Description |
|---|---|---|---|
| A1 | **Dashboard** | `ui_kits/admin/index.html` | KPI strip, hourly activity chart, top universities donut, reports queue table |

---

## 5. Components

Shared across the mobile kit. Implementations in `ui_kits/mobile/components.jsx`.

### 5.1 Shared

| Component | Props | Description |
|---|---|---|
| `Icon` | `name, size, fill, weight, color` | Material Symbols Rounded ligature. `fill: 1` for active state |
| `Avatar` | `initial, size, gradient, online, ring` | Gradient-initial avatar. Auto-picks a gradient by char code if not supplied |
| `UniBadge` | `code, label, variant` | University pill. `variant: 'tonal' \| 'glass'` |
| `BottomNav` | `active, badges, onChange` | 5-tab nav: discover, matches, feed, events, profile |
| `AppBar` | `title, leading, trailing, transparent` | Top app bar |
| `IconBtn` | `icon, onClick, size, color, bg, fill` | Circular icon button |

### 5.2 Buttons

| Variant | Usage |
|---|---|
| `filled` | Primary CTA (rose-pink solid) |
| `filled .grad` | Hero CTA (gradient) |
| `tonal` | Secondary actions on container backgrounds |
| `outlined` | Tertiary actions, "Đặt lại" / reset |
| `text` | Inline actions, "Đăng nhập" link buttons |
| `disabled` | Inert state, no shadow, fg-4 text |

Sizes: **40px** standard, **56px** hero, **44px** min tap target.

### 5.3 Form

| Component | Description |
|---|---|
| Text input | `var(--surface-container-low)` bg, 16px radius, 1.5px transparent border → primary on focus |
| Textarea | Same; with char counter in section header |
| Single range | M3 thumb (20px) with 10px state-layer halo on press, floating value pill |
| Dual range | Two thumbs, filled track between, layered invisible native inputs for accessibility |
| Toggle | 44 × 26 capsule, sliding 20px thumb, primary fill when on |
| Chip (filter) | Pill 13/16, surface-container bg unselected, primary-container selected |
| Chip (interest) | Pill with optional X icon when selected |
| Field icon | 22px Material Symbols, positioned absolute left:16 top:14 |

### 5.4 Cards & containers

| Component | Description |
|---|---|
| Profile card (deck) | 28px radius, aspect 3:4, photo gradient, top tag, scrim, glass uni-badge, name + meta |
| Feed post | Padded row: avatar, name+badge, time, text, optional image (16px radius), action bar |
| Event card | Top color band (100px), gradient + icon, body with date pill, distance, attendees |
| Notification row | Avatar + type-icon badge overlay, name + action verb, uni-badge + time, unread dot |
| Settings group | Surface card with hairline dividers inset 54px (after icon column) |

### 5.5 Sheets & modals

| Component | Description |
|---|---|
| Bottom sheet (FilterSheet) | 28px top radius, drag handle, 88% max height, scroll inside, CTA pinned bottom |
| Bottom sheet (BoostSheet) | Same chrome, with hero header (radial halo + 64px icon + title + sub), tab switch |
| Match modal | Radial gradient scrim, popping container, sunset gradient bg, confetti burst |
| Lightbox (image) | Full-bleed black, max 340px image, scale-in animation, reply composer at bottom |

### 5.6 Navigation

| Element | Spec |
|---|---|
| Bottom nav (5 tabs) | 56 × 32 active pill background, 24px filled icon when active, 11px label |
| App bar | 12px horizontal padding, 22px Bricolage title, icon buttons trailing |
| Tab switcher (in sheets) | Pill toggle, 4px inner padding, surface ↔ surface-container swap |
| Progress bar (onboarding) | 4px track, gradient fill, transitions on step change |
| Story progress | 3px segments, white fill at 100% on past frames, animated fill on current |

---

## 6. Iconography

- **System:** Material Symbols Rounded (Google variable font)
- **Axes used:** `FILL` (0 outline, 1 solid for active), `wght` (300–700, default 500)
- **Sizes:** 14 inline / 18–20 buttons / 22–24 nav / 28–32 FAB / 64–140 empty states
- **Loading:** CDN ligature font with `font-feature-settings: 'liga'` enabled on the `.msr` class
- **Emoji:** Allowed only in user-generated content (bio, posts, chat). Never on system chrome
- **Custom SVG:** Reserved for the logo system (`assets/logo-*.svg`) and the 3 empty-state illustrations

---

## 7. File map

```
colors_and_type.css         ← single source of truth for tokens
README.md                   ← context, content + visual foundations
SKILL.md                    ← Agent Skill entry point
HANDOFF.md                  ← this file

assets/
  logo-mark.svg             ← full icon (heart + mortarboard)
  logo-mark-small.svg       ← simplified (heart only, ≤24px)
  logo-wordmark.svg
  logo-wordmark-light.svg
  logo-v1-wordmark.svg      ← wordmark-only variant
  logo-v2-icon-wordmark.svg ← PICKED (icon + wordmark)
  logo-v3-monogram.svg      ← UD monogram variant

preview/                    ← 27 cards registered in the Design System tab
ui_kits/mobile/             ← React + JSX recreations of all 20 screens
  index.html                ← interactive click-thru
  showcase.html             ← light + dark grid (this is the team-share asset)
  components.jsx
  ios-frame.jsx
  screens/*.jsx             ← one screen per file

ui_kits/admin/
  index.html                ← web admin dashboard
```

---

## 8. Open questions for engineering

1. **Flutter token mirroring** — should we generate a `tokens.dart` from `colors_and_type.css` automatically? (Style Dictionary or theo)
2. **Material Symbols on mobile** — confirm `material_symbols` Flutter package gives identical glyphs. If not, switch to bundled font files.
3. **Confetti library** — the match-modal confetti is hand-rolled CSS. Use Lottie or pmndrs/canvas-confetti in production for performance.
4. **GPS check-in** — needs platform location permission + a geofence radius around event venue. Spec'd at 100m.
5. **Premium IAP** — currency formatting per region. The mocks show VND only.
6. **Vietnamese language switch** — current copy is Vietnamese-first. English fallback strings need to be sourced from product.
