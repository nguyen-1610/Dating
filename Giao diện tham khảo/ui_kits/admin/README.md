# UniDate — Admin Dashboard

Web admin console for ops/moderation. Plain HTML + CSS; no React. Open `index.html`.

Recreates one canonical view: **the moderation dashboard**.

## Sections

- **Sidebar nav** — Overview, Users, Moderation, Operations groupings. Badge counters on Xác thực + Báo cáo.
- **Topbar** — title, command-K search, notification bell, admin avatar.
- **KPI strip** — 4 tiles (match today, new users / week, messages / day, open reports) with delta + sparkline.
- **Activity chart** — stacked bar chart of swipes vs matches by hour, 7-day window.
- **Top universities donut** — share-of-active-users by school.
- **Reports queue** — table of moderation reports with reporter / reportee / reason / status / action buttons.

## Convention notes

- Uses Material Symbols Rounded ligatures (loaded over CDN — no node_modules).
- Pulls all tokens from the root `colors_and_type.css` — primary stays love-pink, but the chrome leans on `surface-*` neutrals to keep the moderator's eye on data, not brand.
- Avatars use gradient initials throughout, matching the mobile kit's `Avatar` component visually.

## Known gaps

- No interaction — clicks are inert. This is a pixel-accurate static recreation, not a working app.
- No charts library; the bar chart and donut are CSS shapes. Wire D3 / Recharts when building for real.
