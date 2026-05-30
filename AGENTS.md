# Agent Instructions - UniDate

This file applies to the whole repository. It is written for AI coding agents that work on this project after the initial setup.

## Project Context

UniDate is a Flutter app for Vietnamese university students. It combines dating, matching, chat, a social feed, student events, moderation, and an admin dashboard.

Primary product constraints:

- Main user group: Vietnamese students, about 18-25 years old.
- Roles: `User`, `Moderator`, `Admin`.
- App targets: Web, Android, iOS, and optionally desktop from one Flutter codebase.
- Backend target: Supabase Auth, Postgres, Storage, Realtime, and Edge Functions.
- Push notifications target: Firebase Cloud Messaging.
- Core safety requirement: protect profile data, photos, chat, reports, moderation actions, and admin access.

Current repo state:

- The repo is currently a basic Flutter scaffold.
- `pubspec.yaml` does not yet contain the full intended stack from the docs.
- Treat the docs as the planned architecture before adding dependencies or large feature code.

## Source Of Truth

Read these before making non-trivial changes:

1. `README.md` - setup, run commands, repo overview.
2. `project-proposal-PA1.md` - course proposal, product goals, user/environment context.
3. `docs/01-features-and-roles.md` - feature scope, roles, priorities, sprints.
4. `docs/02-database-schema.md` - Supabase schema, RLS, storage buckets, realtime, migrations.
5. `docs/03-repo-structure.md` - intended Flutter architecture, folder structure, dependencies, coding conventions.
6. `Giao diện tham khảo/` - design system, preview HTML, mobile/admin UI reference.

If these files disagree, prefer the newest direct user instruction, then this `AGENTS.md`, then `README.md`, then `docs/03-repo-structure.md`, then `docs/02-database-schema.md`, then `docs/01-features-and-roles.md`, then `project-proposal-PA1.md`. Call out important conflicts instead of silently choosing.

## Installed Project Skills

Project-scope skills live in `.agents/skills/` and are locked in `skills-lock.json`.

Use relevant skills when available:

- `supabase` - any Supabase Auth, Storage, Realtime, Edge Function, migration, CLI, or RLS work.
- `supabase-postgres-best-practices` - schema, query, index, RLS performance, pagination, transaction, or Postgres review work.
- `flutter` - Flutter/Dart architecture, widgets, state management, testing, performance.
- `mobile-design` - mobile UX, touch targets, navigation, mobile performance, iOS/Android constraints.
- `accessibility-compliance` - forms, navigation, screen reader, color contrast, keyboard/focus, mobile accessibility.
- `security-threat-model` - threat modeling, privacy/security review, trust boundaries, sensitive flows.
- Visual/design skills under `.agents/skills/` - use only when the user asks for UI design, redesign, image-to-code, or visual polish.

Do not install new skills unless the user asks or the task clearly requires it.

## Development Rules

Follow the intended Flutter architecture from `docs/03-repo-structure.md`:

- Prefer feature-first structure under `lib/features/<feature>/`.
- Shared widgets go under `lib/shared/widgets/`.
- Data models go under `lib/data/models/`.
- Supabase queries/repositories go under `lib/data/repositories/`.
- Avoid business logic in widget `build()` methods.
- Prefer small widgets and reusable components over deeply nested widget trees.
- Prefer `const`, `final`, trailing commas, and `dart format`.
- Use `debugPrint()` or a logger, not `print()`.
- Keep Dart filenames in `snake_case.dart`.
- Keep classes in `PascalCase`, variables in `camelCase`.

When the planned stack is introduced:

- Use Riverpod providers for state beyond trivial local UI state.
- Use Freezed/json_serializable for generated model classes where appropriate.
- Use GoRouter for navigation.
- Run build generation after editing generated providers/models/routes:

```powershell
dart run build_runner build --delete-conflicting-outputs
```

## Supabase And Data Rules

Before writing Supabase queries, migrations, storage policies, or RLS:

1. Read `docs/02-database-schema.md`.
2. Check the relevant table section and RLS section.
3. Preserve privacy boundaries for matches, chat, blocks, reports, moderation, and admin data.
4. Never expose `SUPABASE_SERVICE_ROLE_KEY` or server-only secrets to Flutter, `.env.json`, `dart-define`, or bundled assets.
5. Use Edge Functions for privileged server-side operations.
6. Add indexes intentionally for new query patterns.
7. Keep migrations ordered and reversible where practical.

Sensitive data rules:

- Moderators cannot read private messages unless they are part of a report flow described by the product/spec.
- Admin actions should be auditable.
- Profile photos and user-generated content need storage policies, moderation paths, and deletion behavior.
- AI features must not send private conversation history unless the user explicitly approves a design change.

## UI And Design Rules

Before implementing app UI, inspect:

- `Giao diện tham khảo/README.md`
- `Giao diện tham khảo/colors_and_type.css`
- `Giao diện tham khảo/ui_kits/mobile/index.html`
- `Giao diện tham khảo/ui_kits/admin/index.html`

Run the static UI reference from repo root:

```powershell
cd "Giao diện tham khảo"
python -m http.server 8001
```

Open:

```text
http://localhost:8001/ui_kits/mobile/index.html
http://localhost:8001/ui_kits/admin/index.html
```

Stop the server with `Ctrl + C`.

Design expectations:

- Vietnamese copy by default.
- Student-facing tone: warm, young, informal, using `mình` / `bạn`.
- Admin/moderation copy can be more direct and operational.
- Keep mobile touch targets at least 44x44.
- Support light and dark mode where practical.
- Do not copy competitor assets or distinctive UI directly.
- Use the reference kit for palette, spacing, typography intent, and component behavior.

## Commands

Install dependencies:

```powershell
flutter pub get
```

Run Flutter Web:

```powershell
flutter run -d chrome
```

Run Windows:

```powershell
flutter run -d windows
```

Analyze:

```powershell
flutter analyze
```

Test:

```powershell
flutter test
```

Format:

```powershell
dart format lib test
```

Build Web:

```powershell
flutter build web --release
```

## Verification Expectations

Before saying work is complete:

- Run the smallest useful verification command for the change.
- For Dart/Flutter code, prefer `dart format`, `flutter analyze`, and targeted tests.
- For UI changes, run the app or relevant static preview when feasible.
- For Supabase/schema changes, review RLS and migration order.
- If verification cannot run, say exactly why and what remains unverified.

## Git And File Safety

- Do not revert user changes unless explicitly asked.
- Do not run destructive git commands like `git reset --hard` unless the user clearly requests them.
- Keep edits scoped to the requested task.
- Do not edit generated files by hand when source files can generate them.
- Do not commit secrets, local environment files, build outputs, or private credentials.
- Preserve docs unless the task asks to update them.

## Commit Message Rules

Use Conventional Commits:

```text
[type]([scope]): [short message]
```

Rules:

- `type` must describe the kind of change.
- `scope` should name the affected area, such as `auth`, `profile`, `chat`, `feed`, `events`, `admin`, `supabase`, `docs`, `ui`, `test`, or `ci`.
- `short message` should be concise, imperative, and lowercase where natural.
- Keep the first line short, ideally under 72 characters.
- Do not mix unrelated changes in one commit.

Recommended types:

- `feat` - new feature.
- `fix` - bug fix.
- `docs` - documentation only.
- `style` - formatting or visual-only change without behavior change.
- `refactor` - code restructuring without behavior change.
- `test` - adding or updating tests.
- `chore` - maintenance, tooling, config, dependency work.
- `ci` - CI/CD workflow changes.
- `perf` - performance improvement.
- `security` - security or privacy improvement.

Examples:

```text
feat(auth): add student email signup
fix(chat): prevent sending empty messages
docs(readme): add ui reference server command
refactor(profile): split photo uploader widget
test(supabase): cover match creation trigger
security(admin): require audit log for moderator action
```

## Communication

- Reply in Vietnamese by default.
- Be concise but include file paths and commands when useful.
- If requirements are unclear, make a reasonable assumption for small changes; ask first for risky product, schema, security, or destructive changes.
