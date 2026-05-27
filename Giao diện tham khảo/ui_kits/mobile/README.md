# UniDate — Mobile UI Kit

Flutter app recreations in HTML/JSX. Mobile-first at **390 × 844** (iPhone 14/15 baseline). Both **light** and **dark** mode supported via `data-theme` on `<html>`.

Open **`index.html`** for an interactive click-thru of all 8 screens inside an iOS device frame.

## Screens

| # | File | Purpose |
|---|---|---|
| 1 | `screens/Discover.jsx` | Swipe deck with pass / like / super-like / boost / rewind FABs |
| 2 | `screens/MatchModal.jsx` | "It's a Match!" celebration overlay |
| 3 | `screens/Chat.jsx` | 1-on-1 messaging with match banner + typing indicator |
| 4 | `screens/Matches.jsx` | Match tab: new matches grid + active conversations |
| 5 | `screens/Feed.jsx` | Threads-style social feed with story rail |
| 6 | `screens/Events.jsx` | Event list + GPS check-in detail screen |
| 7 | `screens/Profile.jsx` | Full profile: photos carousel, bio, interests, prompts |
| 8 | `screens/Onboarding.jsx` | 5-step wizard (name, birthday, gender, university, photos) |

## Shared

- `components.jsx` — `Icon`, `Avatar`, `UniBadge`, `BottomNav`, `AppBar`, `IconBtn`. Loaded first; exports to `window` so screens share scope.
- `ios-frame.jsx` — starter iPhone device frame (`IOSDevice`). 
- `design-canvas.jsx` — starter; available if you want to compose variations side-by-side.

## Convention notes

- Every screen mounts into `<IOSDevice width={390} height={844}>` and renders its own header — there's no global router.
- Bottom nav is rendered **outside** screens by `index.html`, since it persists across tabs.
- The Match modal is also rendered above the device by the host; passing `onMatch` from Discover triggers it.
- All copy is in Vietnamese to match the target market.

## Known gaps

- No real swipe gesture — swipe-deck advances via the button row only. (Drag is not wired; the visual rotate-on-drag is a placeholder.)
- Photo carousels use color gradients in place of real photos. Swap in `<img>` tags when assets land.
- Onboarding has no validation beyond required-ness; production needs phone OTP + .edu.vn email verification.
