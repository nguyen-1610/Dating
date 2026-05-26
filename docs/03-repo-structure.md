# UniDate — Repository Structure Specification (Flutter)

> **Frontend**: Flutter 3.44.0 (single codebase: Web + iOS + Android)
> **Language**: Dart 3.9+ (Flutter 3.44 ships Dart 3.12)
> **Backend**: Supabase (PostgreSQL 15, supabase_flutter v2.12)
> **State management**: Riverpod 2.6 (code-generated)
> **Data classes**: Freezed 2.x (stable, compat Riverpod 2.x)
> **Navigation**: GoRouter 17.x
> **Last updated**: 2026-05-24

---

## 0. Vì sao Flutter? — Lưu ý quan trọng

Sau khi đã chốt Flutter, đây là những thứ cần biết để team không gặp bất ngờ:

### Lợi thế của Flutter (lý do bạn chọn)
- **1 codebase duy nhất** — chạy được Web + iOS + Android + macOS + Windows + Linux
- **KHÔNG cần mapping** — code 1 lần, deploy 3-6 platform
- **UI native 60fps** mặc định — swipe animation cực mượt
- **Material 3 + Cupertino** widgets sẵn — UI đẹp ngay từ đầu
- **Hot reload** cực nhanh khi dev

### Bất lợi cần xử lý
- **Cả nhóm phải học Dart** — dành ~1 tuần đầu để quen syntax + widget tree concept
- **Flutter Web SEO kém** — landing page public sẽ không index tốt trên Google. Workaround: làm 1 landing page riêng bằng plain HTML/Astro nếu cần SEO
- **AI agent training data ít hơn React** — prompt Claude Code phải rõ ràng hơn, kèm context Dart syntax
- **Library nhỏ hơn npm** — vài thứ phải tự viết hoặc dùng package ít maintained

### Quy ước Dart vs JavaScript (đáng nhớ)
| JavaScript | Dart |
|-----------|------|
| `const x = 5` | `final x = 5` (hoặc `const`) |
| `null` / `undefined` | `null` (no `undefined`) |
| `?.` optional chaining | `?.` tương tự |
| `??` nullish coalescing | `??` tương tự |
| `interface` / `type` | `class` / `mixin` / `extension` |
| `async/await + Promise` | `async/await + Future` |
| `Array<T>` | `List<T>` |
| `Record<K, V>` | `Map<K, V>` |
| `Stream` (RxJS) | `Stream` (built-in) |
| `console.log` | `print` / `debugPrint` |

---

## 1. Tổng quan kiến trúc

```
uni-date/                          ← single Flutter project
├── lib/                           ← All Dart code
│   ├── main.dart                  ← entry point
│   ├── core/                      ← shared infrastructure
│   ├── data/                      ← data layer (Supabase, repositories)
│   ├── domain/                    ← business logic, entities
│   ├── features/                  ← feature modules (auth, swipe, chat...)
│   ├── shared/                    ← shared widgets, utils
│   └── router/                    ← GoRouter config
├── assets/                        ← images, fonts, icons
│   ├── images/
│   ├── icons/
│   └── fonts/
├── test/                          ← unit + widget tests
├── integration_test/              ← E2E tests
├── android/                       ← Android native config
├── ios/                           ← iOS native config
├── web/                           ← Web entry HTML, manifest
├── macos/                         ← macOS (optional)
├── windows/                       ← Windows (optional)
├── linux/                         ← Linux (optional)
├── supabase/                      ← Supabase migrations, functions
│   ├── migrations/
│   ├── functions/
│   └── seed.sql
├── .github/
│   └── workflows/                 ← CI/CD
├── docs/                          ← 3 file markdown specs
│   ├── 01-features-and-roles.md
│   ├── 02-database-schema.md
│   └── 03-repo-structure.md       ← (file này)
├── .env.example
├── .gitignore
├── .mcp.json                      ← AI agent config
├── AGENTS.md                      ← AI agent instructions
├── analysis_options.yaml          ← Dart linter rules
├── pubspec.yaml                   ← dependencies (như package.json)
├── pubspec.lock
├── l10n.yaml                      ← i18n config
└── README.md
```

---

## 2. Root configuration files

### 2.1 `pubspec.yaml` — dependencies (giống package.json)

```yaml
name: unidate
description: UniDate — Dating app for Vietnamese university students
publish_to: 'none'
version: 0.1.0+1

environment:
  # Flutter 3.44 ships với Dart 3.12
  # go_router 17.x yêu cầu Dart 3.9+, Flutter 3.44 đáp ứng được
  sdk: ^3.9.0
  flutter: ">=3.44.0"

dependencies:
  flutter:
    sdk: flutter
  flutter_localizations:
    sdk: flutter

  # === Supabase ===
  # supabase_flutter v3 chưa có stable trên pub.dev tại 2026-05
  # Stable mới nhất là 2.12.4
  supabase_flutter: ^2.12.4          # Backend client

  # === State management (Riverpod 2.x stable) ===
  # Riverpod 3.x đã stable, nhưng chọn 2.6.1 để giảm migration risk,
  # nhiều tutorial hơn, và giữ syntax quen thuộc cho team/agent
  flutter_riverpod: ^2.6.1           # State management
  riverpod_annotation: ^2.6.1        # Code generation cho Riverpod
  hooks_riverpod: ^2.6.1             # Riverpod + flutter_hooks

  # === Navigation ===
  go_router: ^17.2.3                # Latest stable, maintained by Flutter team

  # === Forms & Validation ===
  flutter_hooks: ^0.20.5            # React-like hooks
  form_builder_validators: ^11.0.0  # Validators

  # === UI components ===
  cached_network_image: ^3.4.1      # Image cache
  flutter_svg: ^2.0.16              # SVG support
  shimmer: ^3.0.0                   # Loading skeleton
  pull_to_refresh_flutter3: ^2.0.2  # Pull to refresh
  flutter_animate: ^4.5.2           # Animation utilities
  smooth_page_indicator: ^1.2.1     # Onboarding indicators

  # === Swipe & gesture ===
  card_swiper: ^3.0.1               # Tinder-style swipe deck — dùng cho MVP
  # Note: Khi cần custom animation đặc biệt (3D rotation, dynamic scaling...),
  # tự build bằng GestureDetector + AnimatedBuilder. Xem Q5 self-review.

  # === Camera & images ===
  image_picker: ^1.1.2              # Pick từ gallery/camera
  image_cropper: ^8.0.2              # Crop ảnh profile
  image: ^4.3.0                      # Image processing
  flutter_image_compress: ^2.3.0    # Nén ảnh trước upload — TIẾT KIỆM STORAGE QUOTA

  # === Location & GPS ===
  geolocator: ^13.0.2                # GPS coordinates
  geocoding: ^3.0.0                  # Address → lat/lng
  flutter_map: ^7.0.2                # OpenStreetMap (free, no API key)
  # HOẶC google_maps_flutter cho Google Maps (cần API key)
  latlong2: ^0.9.1                   # Coordinate utilities
  dart_geohash: ^2.0.2               # Geohash encoding + neighbors computation

  # === Notifications ===
  firebase_core: ^3.8.0              # Firebase init
  firebase_messaging: ^16.2.2        # Push notifications (FCM)
  flutter_local_notifications: ^18.0.1  # Local notifications

  # === Storage ===
  flutter_secure_storage: ^9.2.2     # Encrypted local storage (auth tokens)
  shared_preferences: ^2.3.3         # Simple key-value (settings)

  # === Network & async ===
  dio: ^5.7.0                        # HTTP client (cho Edge Functions)
  connectivity_plus: ^6.1.0          # Network status

  # === Utils ===
  intl: ^0.19.0                      # i18n + date formatting
  timeago: ^3.7.0                    # "5 phút trước"
  uuid: ^4.5.1                       # UUID generation
  collection: ^1.18.0

  # === Data models (Freezed 2.x — match Riverpod 2.x ecosystem) ===
  # Freezed 3.x cũng có rồi nhưng để consistency với Riverpod 2.x, dùng 2.x
  # Cả 2 cùng tương thích với Dart SDK constraint của project
  freezed_annotation: ^2.4.4         # Immutable data classes
  json_annotation: ^4.9.0            # JSON serialization

  # === Analytics & monitoring ===
  sentry_flutter: ^8.11.0            # Error tracking
  posthog_flutter: ^4.10.0           # Analytics

  # === Theme & UI ===
  google_fonts: ^6.2.1               # Custom fonts
  flex_color_scheme: ^7.3.1          # Material 3 theming

  # === Admin dashboard ===
  data_table_2: ^2.5.15              # Responsive data table cho admin
  fl_chart: ^0.69.0                  # Charts cho analytics dashboard

dev_dependencies:
  flutter_test:
    sdk: flutter
  integration_test:
    sdk: flutter
  flutter_lints: ^5.0.0              # Linter rules
  build_runner: ^2.4.13              # Code generation
  riverpod_generator: ^2.6.3         # Match riverpod 2.x
  freezed: ^2.5.7                    # Match freezed_annotation 2.x
  json_serializable: ^6.9.0
  go_router_builder: ^3.0.0          # Latest, works với go_router 17.x
  flutter_launcher_icons: ^0.14.1
  flutter_native_splash: ^2.4.3

flutter:
  uses-material-design: true
  generate: true                     # Generate localization files

  assets:
    - assets/images/
    - assets/icons/

  fonts:
    - family: Inter
      fonts:
        - asset: assets/fonts/Inter-Regular.ttf
        - asset: assets/fonts/Inter-Medium.ttf
          weight: 500
        - asset: assets/fonts/Inter-Bold.ttf
          weight: 700
```

### 2.2 `analysis_options.yaml` — Linter rules

```yaml
include: package:flutter_lints/flutter.yaml

analyzer:
  exclude:
    - "**/*.g.dart"                  # Generated files
    - "**/*.freezed.dart"
    - "**/*.gr.dart"
  language:
    strict-casts: true
    strict-inference: true
    strict-raw-types: true

linter:
  rules:
    # Style
    prefer_single_quotes: true
    require_trailing_commas: true
    sort_pub_dependencies: true

    # Best practices
    avoid_print: true                # Dùng debugPrint
    prefer_const_constructors: true
    prefer_const_literals_to_create_immutables: true
    prefer_final_locals: true
    unawaited_futures: true

    # Riverpod
    avoid_manual_providers_as_generated_provider_dependency: true

    # Async
    discarded_futures: true
```

### 2.3 `.env.example`

```bash
# === CLIENT APP ENV ===
# Các biến này SẼ được bundle vào app binary — chỉ chứa thông tin công khai
# KHÔNG bao giờ để secret keys ở đây

# Supabase (publishable/anon key — an toàn để expose)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
# Hoặc dùng key mới (2026+):
# SUPABASE_PUBLISHABLE_KEY=sb_publishable_xxx

# Sentry DSN (an toàn expose)
SENTRY_DSN=

# PostHog (publishable key — an toàn expose)
POSTHOG_API_KEY=
POSTHOG_HOST=https://app.posthog.com

# Firebase configs đặt trong:
#   - android/app/google-services.json
#   - ios/Runner/GoogleService-Info.plist
#   - web/index.html
# (KHÔNG để trong .env)

# === SERVER-SIDE SECRETS — KHÔNG BAO GIỜ TRONG APP ===
# Các secret sau CHỈ set trong Supabase Dashboard → Edge Functions → Secrets
# Hoặc dùng `supabase secrets set KEY=value` từ CLI
# - SUPABASE_SERVICE_ROLE_KEY (hoặc SUPABASE_SECRET_KEY mới)
# - FIREBASE_SERVICE_ACCOUNT (cho FCM Admin SDK)
# - OPENAI_API_KEY (nếu dùng AI ice-breaker)
# Nếu thấy bất kỳ key nào ở trên xuất hiện trong .env.json hoặc dart-define,
# REVOKE KEY NGAY và rotate lại — đã bị compromise!
```

**Cách dùng env trong Flutter:**

Flutter không có `.env` built-in như Next.js. Có 2 cách:

```bash
# Option A: dart-define lúc build (recommended)
flutter run --dart-define-from-file=.env.json

# Option B: package flutter_dotenv (đọc runtime từ asset)
```

Mình recommend Option A vì không cần đọc file env runtime. Nhưng các giá trị này vẫn được compile vào binary và có thể bị extract/reverse-engineer từ APK/IPA, nên chỉ dùng cho public config.

### 2.4 `.env.json` (cho dart-define)

```json
{
  "SUPABASE_URL": "https://your-project.supabase.co",
  "SUPABASE_ANON_KEY": "your-anon-key",
  "SENTRY_DSN": "",
  "POSTHOG_API_KEY": ""
}
```

> ⚠️ **KHÔNG ĐỂ** `SUPABASE_SERVICE_ROLE_KEY`, `FIREBASE_SERVICE_ACCOUNT`, hoặc bất kỳ secret key nào ở đây. Mọi giá trị trong `.env.json` sẽ bị compile vào binary qua `--dart-define-from-file` và **có thể bị extract từ APK/IPA**. Secret keys luôn ở server-side (Edge Functions secrets).

Truy cập trong code:
```dart
const supabaseUrl = String.fromEnvironment('SUPABASE_URL');
const supabaseAnonKey = String.fromEnvironment('SUPABASE_ANON_KEY');
```

### 2.5 `.mcp.json` (cho AI agents)

```json
{
  "mcpServers": {
    "supabase": {
      "command": "npx",
      "args": ["-y", "@supabase/mcp-server-supabase@latest", "--project-ref", "YOUR_PROJECT_REF"]
    },
    "flutter-tools": {
      "command": "uvx",
      "args": ["mcp-flutter-tools"]
    }
  }
}
```

### 2.6 `AGENTS.md`

> **Lưu ý cho dev**: Đây là nội dung file `AGENTS.md` riêng đặt ở **root repo**, KHÔNG phải nội dung trong file 03 này. Copy phần dưới (trừ markdown wrapper) ra file `AGENTS.md` riêng.

```markdown
# Agent Instructions — UniDate (Flutter)

## Project context
- Flutter 3.44.0, Dart 3.9+
- Single codebase: Web + iOS + Android
- State: Riverpod 2.6 (code-generated providers)
- Data classes: Freezed 2.x
- Navigation: GoRouter 17 (declarative)
- Backend: Supabase (supabase_flutter v2.12)

## Critical rules
1. ALWAYS use `flutter_riverpod` providers, NOT setState (except trivial local state)
2. ALWAYS write providers in features/<feature>/providers/
3. ALWAYS use `freezed` for data classes
4. ALWAYS use `final` not `var`, prefer `const` where possible
5. ALWAYS use single quotes `'string'` not double
6. ALWAYS use trailing commas (formatter expects them)
7. NEVER use `print()` — use `debugPrint()` or proper logging
8. NEVER bundle SUPABASE_SERVICE_ROLE_KEY into app — service role chỉ ở Edge Functions
9. ALWAYS read docs/02-database-schema.md before writing queries
10. ALWAYS run `dart run build_runner build` after schema/freezed changes
11. PLATFORM checks: use `kIsWeb`, `Platform.isIOS`, `Platform.isAndroid`
12. For images: use `CachedNetworkImage`, NOT `Image.network`
13. ALWAYS compress images với `flutter_image_compress` trước khi upload Supabase Storage (target ~200KB)

## File naming convention
- Files: snake_case.dart (`swipe_card.dart`)
- Classes: PascalCase (`SwipeCard`)
- Variables: camelCase (`userName`)
- Constants: camelCase (`maxPhotos`) — NOT SCREAMING_CASE in Dart

## Riverpod 2.x syntax (code-generated)
```dart
@riverpod
Future<Profile?> currentUser(CurrentUserRef ref) async {
  final supabase = ref.watch(supabaseClientProvider);
  return supabase.auth.currentUser != null
    ? await fetchProfile(supabase.auth.currentUser!.id)
    : null;
}

// Class-based notifier
@riverpod
class SwipeDeck extends _$SwipeDeck {
  @override
  Future<List<Profile>> build() async { ... }

  Future<void> swipe(String id) async { ... }
}
```

## Freezed 2.x syntax
```dart
@freezed
class ProfileModel with _$ProfileModel {
  const factory ProfileModel({
    required String id,
    @JsonKey(name: 'display_name') required String displayName,
  }) = _ProfileModel;

  factory ProfileModel.fromJson(Map<String, dynamic> json) =>
    _$ProfileModelFromJson(json);
}

// Union types
@freezed
class Result<T> with _$Result<T> {
  const factory Result.success(T data) = ResultSuccess<T>;
  const factory Result.error(String message) = ResultError<T>;
}

// Pattern matching với Dart 3
final message = switch (result) {
  ResultSuccess(:final data) => 'Got: $data',
  ResultError(:final message) => 'Error: $message',
};
```
```

---

## 3. `lib/` — Source code structure

### 3.1 Tổng quan folder

```
lib/
├── main.dart                          ← App entry, init Supabase + Sentry + Firebase
├── app.dart                           ← Root MaterialApp.router widget
│
├── core/                              ← Infrastructure (không gắn với feature cụ thể)
│   ├── config/
│   │   ├── env.dart                   ← Env vars wrapper
│   │   ├── constants.dart             ← App constants
│   │   └── feature_flags.dart
│   ├── theme/
│   │   ├── app_theme.dart             ← Material 3 theme
│   │   ├── colors.dart                ← Design tokens
│   │   ├── typography.dart
│   │   └── spacing.dart
│   ├── error/
│   │   ├── failures.dart              ← Failure classes
│   │   ├── exceptions.dart
│   │   └── error_handler.dart         ← Sentry integration
│   ├── network/
│   │   ├── dio_client.dart            ← Dio config (cho Edge Functions)
│   │   └── connectivity.dart
│   ├── storage/
│   │   ├── secure_storage.dart        ← flutter_secure_storage wrapper
│   │   └── preferences.dart           ← shared_preferences wrapper
│   ├── utils/
│   │   ├── date_utils.dart
│   │   ├── geohash_utils.dart         ← encode/decode geohash
│   │   ├── distance_utils.dart        ← Haversine distance
│   │   ├── validators.dart
│   │   └── formatters.dart
│   ├── platform/
│   │   ├── platform_info.dart         ← isWeb, isIOS, isAndroid
│   │   └── permissions.dart           ← Location, camera permissions
│   └── analytics/
│       ├── analytics_service.dart     ← PostHog wrapper
│       └── events.dart                ← Event names constants
│
├── data/                              ← Data layer (Supabase calls)
│   ├── supabase/
│   │   ├── supabase_client.dart       ← Singleton Supabase instance
│   │   └── realtime_manager.dart      ← Realtime channels manager
│   ├── repositories/                  ← Implement domain interfaces
│   │   ├── auth_repository_impl.dart
│   │   ├── profile_repository_impl.dart
│   │   ├── swipe_repository_impl.dart
│   │   ├── match_repository_impl.dart
│   │   ├── message_repository_impl.dart
│   │   ├── post_repository_impl.dart
│   │   ├── event_repository_impl.dart
│   │   ├── notification_repository_impl.dart
│   │   ├── report_repository_impl.dart
│   │   └── admin_repository_impl.dart
│   └── models/                        ← DTOs từ Supabase (mapped từ DB tables)
│       ├── profile_model.dart         ← + .freezed.dart + .g.dart
│       ├── swipe_model.dart
│       ├── match_model.dart
│       ├── message_model.dart
│       ├── post_model.dart
│       ├── comment_model.dart
│       ├── event_model.dart
│       ├── event_attendee_model.dart
│       ├── notification_model.dart
│       ├── report_model.dart
│       └── ...
│
├── domain/                            ← Business logic (pure Dart, no Flutter import)
│   ├── entities/                      ← Core domain models
│   │   ├── user.dart
│   │   ├── profile.dart
│   │   ├── match.dart
│   │   ├── message.dart
│   │   ├── post.dart
│   │   ├── event.dart
│   │   └── ...
│   ├── repositories/                  ← Abstract interfaces
│   │   ├── auth_repository.dart
│   │   ├── profile_repository.dart
│   │   └── ...
│   └── use_cases/                     ← Business logic units
│       ├── auth/
│       │   ├── sign_in_with_email.dart
│       │   ├── sign_in_with_google.dart
│       │   └── sign_out.dart
│       ├── swipe/
│       │   ├── get_swipe_deck.dart
│       │   ├── record_swipe.dart
│       │   └── undo_last_swipe.dart
│       └── ...
│
├── features/                          ← UI + state cho từng feature
│   ├── auth/
│   │   ├── presentation/
│   │   │   ├── screens/
│   │   │   │   ├── login_screen.dart
│   │   │   │   ├── register_screen.dart
│   │   │   │   ├── forgot_password_screen.dart
│   │   │   │   └── reset_password_screen.dart
│   │   │   ├── widgets/
│   │   │   │   ├── google_sign_in_button.dart
│   │   │   │   ├── email_input.dart
│   │   │   │   └── password_input.dart
│   │   │   └── providers/
│   │   │       └── auth_provider.dart   ← Riverpod state
│   ├── onboarding/
│   │   └── presentation/
│   │       ├── screens/
│   │       │   ├── name_step.dart
│   │       │   ├── birthday_step.dart
│   │       │   ├── gender_step.dart
│   │       │   ├── university_step.dart
│   │       │   ├── photos_step.dart
│   │       │   └── onboarding_wrapper.dart
│   │       └── providers/
│   │           └── onboarding_provider.dart
│   ├── discover/                      ← Swipe deck
│   │   └── presentation/
│   │       ├── screens/
│   │       │   └── discover_screen.dart
│   │       ├── widgets/
│   │       │   ├── swipe_deck.dart       ← Main swipe stack
│   │       │   ├── profile_card.dart     ← Card UI
│   │       │   ├── action_buttons.dart   ← Like/Pass/SuperLike
│   │       │   ├── filter_sheet.dart
│   │       │   └── match_dialog.dart     ← "It's a match!"
│   │       └── providers/
│   │           ├── swipe_deck_provider.dart
│   │           └── filter_provider.dart
│   ├── matches/
│   │   └── presentation/
│   │       ├── screens/
│   │       │   ├── matches_list_screen.dart
│   │       │   └── likes_received_screen.dart
│   │       ├── widgets/
│   │       │   ├── match_tile.dart
│   │       │   └── empty_matches.dart
│   │       └── providers/
│   │           └── matches_provider.dart
│   ├── chat/
│   │   └── presentation/
│   │       ├── screens/
│   │       │   └── chat_screen.dart
│   │       ├── widgets/
│   │       │   ├── message_bubble.dart
│   │       │   ├── chat_input.dart
│   │       │   ├── typing_indicator.dart
│   │       │   └── seen_indicator.dart
│   │       └── providers/
│   │           ├── chat_provider.dart       ← Realtime messages
│   │           ├── typing_provider.dart     ← Broadcast typing event
│   │           └── presence_provider.dart   ← Online/offline
│   ├── feed/
│   │   └── presentation/
│   │       ├── screens/
│   │       │   ├── feed_screen.dart
│   │       │   ├── post_detail_screen.dart
│   │       │   └── create_post_screen.dart
│   │       ├── widgets/
│   │       │   ├── post_card.dart
│   │       │   ├── post_composer.dart
│   │       │   ├── comment_list.dart
│   │       │   ├── comment_input.dart
│   │       │   └── like_button.dart
│   │       └── providers/
│   │           ├── feed_provider.dart       ← Infinite scroll
│   │           ├── post_provider.dart
│   │           └── comments_provider.dart
│   ├── events/
│   │   └── presentation/
│   │       ├── screens/
│   │       │   ├── events_list_screen.dart
│   │       │   ├── event_detail_screen.dart
│   │       │   ├── create_event_screen.dart
│   │       │   ├── event_swipe_screen.dart  ← Event-only swipe
│   │       │   ├── event_attendees_screen.dart
│   │       │   └── event_chat_screen.dart   ← Group chat
│   │       ├── widgets/
│   │       │   ├── event_card.dart
│   │       │   ├── map_picker.dart           ← Pick location
│   │       │   ├── check_in_button.dart      ← GPS check-in
│   │       │   └── attendees_grid.dart
│   │       └── providers/
│   │           ├── events_provider.dart
│   │           ├── event_detail_provider.dart
│   │           └── checkin_provider.dart
│   ├── profile/
│   │   └── presentation/
│   │       ├── screens/
│   │       │   ├── my_profile_screen.dart
│   │       │   ├── edit_profile_screen.dart
│   │       │   ├── manage_photos_screen.dart
│   │       │   ├── view_profile_screen.dart  ← Xem profile user khác
│   │       │   └── history_screen.dart       ← Lịch sử swipe, views
│   │       ├── widgets/
│   │       │   ├── photo_grid.dart
│   │       │   ├── photo_uploader.dart
│   │       │   ├── interest_picker.dart
│   │       │   └── bio_editor.dart
│   │       └── providers/
│   │           └── profile_provider.dart
│   ├── notifications/
│   │   └── presentation/
│   │       ├── screens/
│   │       │   └── notifications_screen.dart
│   │       ├── widgets/
│   │       │   └── notification_tile.dart
│   │       └── providers/
│   │           └── notifications_provider.dart
│   ├── settings/
│   │   └── presentation/
│   │       ├── screens/
│   │       │   ├── settings_screen.dart
│   │       │   ├── account_settings_screen.dart
│   │       │   ├── notification_settings_screen.dart
│   │       │   ├── privacy_settings_screen.dart
│   │       │   ├── blocked_users_screen.dart
│   │       │   └── language_screen.dart
│   │       └── providers/
│   │           └── settings_provider.dart
│   └── admin/                         ← Admin + Moderator dashboard
│       └── presentation/
│           ├── screens/
│           │   ├── dashboard_screen.dart
│           │   ├── users_management_screen.dart
│           │   ├── user_detail_screen.dart
│           │   ├── reports_screen.dart
│           │   ├── report_detail_screen.dart
│           │   ├── flagged_content_screen.dart
│           │   ├── banned_words_screen.dart
│           │   ├── moderators_screen.dart   ← Admin only
│           │   ├── ads_screen.dart          ← Admin only
│           │   ├── audit_logs_screen.dart
│           │   └── config_screen.dart
│           ├── widgets/
│           │   ├── stats_card.dart
│           │   ├── data_table.dart           ← Responsive table
│           │   ├── role_guard.dart           ← Wrap component check role
│           │   └── audit_dialog.dart
│           └── providers/
│               ├── admin_provider.dart
│               ├── reports_provider.dart
│               └── ads_provider.dart
│
├── shared/                            ← Cross-feature widgets & utilities
│   ├── widgets/
│   │   ├── app_button.dart
│   │   ├── app_text_field.dart
│   │   ├── app_avatar.dart
│   │   ├── app_card.dart
│   │   ├── empty_state.dart
│   │   ├── error_state.dart
│   │   ├── loading_indicator.dart
│   │   ├── skeleton_loader.dart
│   │   ├── confirm_dialog.dart
│   │   └── bottom_sheet_wrapper.dart
│   ├── layouts/
│   │   ├── main_scaffold.dart         ← Bottom nav layout
│   │   ├── admin_scaffold.dart        ← Sidebar layout
│   │   └── auth_scaffold.dart
│   └── providers/
│       ├── supabase_provider.dart     ← Global Supabase client
│       ├── theme_provider.dart        ← Dark/Light mode
│       └── locale_provider.dart       ← Vi/En toggle
│
├── router/
│   ├── app_router.dart                ← GoRouter config
│   ├── routes.dart                    ← Route paths constants
│   └── guards.dart                    ← Auth/role guards
│
└── l10n/                              ← Localization
    ├── app_en.arb                     ← English strings
    └── app_vi.arb                     ← Vietnamese strings
```

### 3.2 `lib/main.dart` — Entry point

```dart
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:sentry_flutter/sentry_flutter.dart';
import 'app.dart';
import 'core/config/env.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // 1. Initialize Supabase
  await Supabase.initialize(
    url: Env.supabaseUrl,
    anonKey: Env.supabaseAnonKey,
    authOptions: const FlutterAuthClientOptions(
      authFlowType: AuthFlowType.pkce,        // Recommended for mobile
    ),
    realtimeClientOptions: const RealtimeClientOptions(
      logLevel: RealtimeLogLevel.info,
    ),
  );

  // 2. Initialize Sentry (wraps runApp)
  await SentryFlutter.init(
    (options) {
      options.dsn = Env.sentryDsn;
      options.tracesSampleRate = 0.2;
      options.environment = Env.environment;
    },
    appRunner: () => runApp(
      const ProviderScope(
        child: UniDateApp(),
      ),
    ),
  );
}
```

### 3.3 `lib/app.dart` — Root widget

```dart
import 'package:flutter/material.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';
import 'l10n/app_localizations.dart';
import 'core/theme/app_theme.dart';
import 'router/app_router.dart';
import 'shared/providers/theme_provider.dart';
import 'shared/providers/locale_provider.dart';

class UniDateApp extends HookConsumerWidget {
  const UniDateApp({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final router = ref.watch(appRouterProvider);
    final themeMode = ref.watch(themeModeProvider);
    final locale = ref.watch(localeProvider);

    return MaterialApp.router(
      title: 'UniDate',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.light(),
      darkTheme: AppTheme.dark(),
      themeMode: themeMode,
      locale: locale,
      supportedLocales: const [Locale('en'), Locale('vi')],
      localizationsDelegates: const [
        AppLocalizations.delegate,
        GlobalMaterialLocalizations.delegate,
        GlobalWidgetsLocalizations.delegate,
        GlobalCupertinoLocalizations.delegate,
      ],
      routerConfig: router,
    );
  }
}
```

### 3.4 `lib/data/supabase/supabase_client.dart`

```dart
import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';

part 'supabase_client.g.dart';

// Riverpod 2.x code-generated provider
@Riverpod(keepAlive: true)
SupabaseClient supabaseClient(SupabaseClientRef ref) {
  return Supabase.instance.client;
}

@Riverpod(keepAlive: true)
GoTrueClient supabaseAuth(SupabaseAuthRef ref) {
  return ref.watch(supabaseClientProvider).auth;
}

@Riverpod(keepAlive: true)
SupabaseStorageClient supabaseStorage(SupabaseStorageRef ref) {
  return ref.watch(supabaseClientProvider).storage;
}
```

### 3.5 Example repository

```dart
// lib/data/repositories/profile_repository_impl.dart
import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';
import '../models/profile_model.dart';
import '../supabase/supabase_client.dart';

part 'profile_repository_impl.g.dart';

@riverpod
ProfileRepository profileRepository(ProfileRepositoryRef ref) {
  return ProfileRepository(ref.watch(supabaseClientProvider));
}

class ProfileRepository {
  ProfileRepository(this._client);
  final SupabaseClient _client;

  Future<ProfileModel?> getProfile(String userId) async {
    final data = await _client
        .from('profiles')
        .select('*, profile_photos(*)')
        .eq('id', userId)
        .maybeSingle();

    return data == null ? null : ProfileModel.fromJson(data);
  }

  Future<void> updateProfile(String userId, Map<String, dynamic> updates) async {
    await _client.from('profiles').update(updates).eq('id', userId);
  }

  Stream<ProfileModel> watchProfile(String userId) {
    return _client
        .from('profiles')
        .stream(primaryKey: ['id'])
        .eq('id', userId)
        .map((data) => ProfileModel.fromJson(data.first));
  }
}
```

### 3.6 Example feature with Riverpod state

```dart
// lib/features/discover/presentation/providers/swipe_deck_provider.dart
import 'package:hooks_riverpod/hooks_riverpod.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';
import '../../../../data/models/profile_model.dart';
import '../../../../data/repositories/swipe_repository_impl.dart';

part 'swipe_deck_provider.g.dart';

@riverpod
class SwipeDeck extends _$SwipeDeck {
  @override
  Future<List<ProfileModel>> build() async {
    final repo = ref.watch(swipeRepositoryProvider);
    return repo.getDeck(limit: 20);
  }

  Future<void> swipe(String targetId, SwipeDirection direction) async {
    final repo = ref.read(swipeRepositoryProvider);
    await repo.recordSwipe(targetId: targetId, direction: direction);

    // Remove swiped profile from deck
    final current = state.valueOrNull ?? [];
    state = AsyncData(current.where((p) => p.id != targetId).toList());

    // Load more if running low
    if (current.length < 5) {
      await _loadMore();
    }
  }

  Future<void> _loadMore() async {
    final repo = ref.read(swipeRepositoryProvider);
    final more = await repo.getDeck(limit: 10);
    state = AsyncData([...state.valueOrNull ?? [], ...more]);
  }
}
```

---

## 4. `lib/router/app_router.dart` — GoRouter setup

```dart
import 'package:go_router/go_router.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';

part 'app_router.g.dart';

@riverpod
GoRouter appRouter(AppRouterRef ref) {
  final authState = ref.watch(authStateProvider);

  return GoRouter(
    initialLocation: '/',
    redirect: (context, state) {
      final isAuthed = authState.value != null;
      final isAuthRoute = state.matchedLocation.startsWith('/auth');
      final isOnboarding = state.matchedLocation.startsWith('/onboarding');

      if (!isAuthed && !isAuthRoute) return '/auth/login';
      if (isAuthed && isAuthRoute) return '/discover';
      return null;
    },
    routes: [
      // Auth routes
      GoRoute(path: '/auth/login', builder: (c, s) => const LoginScreen()),
      GoRoute(path: '/auth/register', builder: (c, s) => const RegisterScreen()),

      // Onboarding
      GoRoute(
        path: '/onboarding',
        builder: (c, s) => const OnboardingWrapper(),
        routes: [
          GoRoute(path: 'name', builder: (c, s) => const NameStep()),
          GoRoute(path: 'birthday', builder: (c, s) => const BirthdayStep()),
          // ...
        ],
      ),

      // Main app với bottom nav
      ShellRoute(
        builder: (c, s, child) => MainScaffold(child: child),
        routes: [
          GoRoute(path: '/discover', builder: (c, s) => const DiscoverScreen()),
          GoRoute(path: '/matches', builder: (c, s) => const MatchesScreen()),
          GoRoute(path: '/feed', builder: (c, s) => const FeedScreen()),
          GoRoute(path: '/events', builder: (c, s) => const EventsListScreen()),
          GoRoute(path: '/profile', builder: (c, s) => const MyProfileScreen()),
        ],
      ),

      // Chat
      GoRoute(
        path: '/chat/:matchId',
        builder: (c, s) => ChatScreen(matchId: s.pathParameters['matchId']!),
      ),

      // Event
      GoRoute(
        path: '/events/:eventId',
        builder: (c, s) => EventDetailScreen(eventId: s.pathParameters['eventId']!),
        routes: [
          GoRoute(path: 'swipe', builder: (c, s) => EventSwipeScreen(...)),
          GoRoute(path: 'chat', builder: (c, s) => EventChatScreen(...)),
          GoRoute(path: 'attendees', builder: (c, s) => EventAttendeesScreen(...)),
        ],
      ),

      // Admin (sidebar layout)
      ShellRoute(
        builder: (c, s, child) => AdminScaffold(child: child),
        routes: [
          GoRoute(path: '/admin/dashboard', builder: (c, s) => const DashboardScreen()),
          GoRoute(path: '/admin/users', builder: (c, s) => const UsersScreen()),
          GoRoute(path: '/admin/reports', builder: (c, s) => const ReportsScreen()),
          // ...
        ],
      ),
    ],
  );
}
```

---

## 5. Platform-specific configurations

### 5.1 `android/app/build.gradle`

Cập nhật minSdk, package name:

```gradle
android {
    namespace "vn.unidate.app"
    compileSdkVersion 35

    defaultConfig {
        applicationId "vn.unidate.app"
        minSdkVersion 24                  // Android 7.0+
        targetSdkVersion 35
        versionCode flutterVersionCode.toInteger()
        versionName flutterVersionName
    }
}
```

### 5.2 `android/app/src/main/AndroidManifest.xml`

Thêm permissions:

```xml
<uses-permission android:name="android.permission.INTERNET"/>
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION"/>
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION"/>
<uses-permission android:name="android.permission.CAMERA"/>
<uses-permission android:name="android.permission.READ_MEDIA_IMAGES"/>
<uses-permission android:name="android.permission.POST_NOTIFICATIONS"/>
```

### 5.3 `ios/Runner/Info.plist`

Thêm usage descriptions:

```xml
<key>NSLocationWhenInUseUsageDescription</key>
<string>UniDate cần vị trí để gợi ý người gần bạn và check-in sự kiện</string>
<key>NSCameraUsageDescription</key>
<string>Chụp ảnh profile</string>
<key>NSPhotoLibraryUsageDescription</key>
<string>Chọn ảnh từ thư viện cho profile</string>
<key>NSPhotoLibraryAddUsageDescription</key>
<string>Lưu ảnh từ chat</string>

<!-- Minimum iOS 14 (default Flutter), recommend 15+ -->
<key>MinimumOSVersion</key>
<string>14.0</string>
```

### 5.4 `web/index.html`

```html
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <meta name="description" content="UniDate — Hẹn hò cho sinh viên đại học">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="theme-color" content="#7F77DD">
    <title>UniDate</title>
    <link rel="manifest" href="manifest.json">
    <link rel="apple-touch-icon" href="icons/Icon-192.png">
    <script src="flutter_bootstrap.js" async></script>
</head>
<body>
</body>
</html>
```

---

## 6. `supabase/` — Database & Edge Functions

```
supabase/
├── migrations/                   ← 16 migration files (xem file 02)
├── functions/
│   ├── send-push-notification/   ← Gửi FCM (Firebase Cloud Messaging)
│   │   └── index.ts
│   ├── matching-algorithm/
│   │   └── index.ts
│   ├── moderate-content/         ← Check banned_words
│   │   └── index.ts
│   ├── ai-icebreaker/            ← Gợi ý câu mở chat
│   │   └── index.ts
│   └── _shared/
│       ├── supabase.ts
│       └── cors.ts
├── config.toml
└── seed.sql
```

> **LƯU Ý**: Edge Functions vẫn viết bằng TypeScript chạy trên Deno, không phụ thuộc Flutter. File 02 schema giữ nguyên 100%, không đổi gì.

### ⚠️ Push Notifications — đổi từ Expo Push sang FCM

Trong file 02, mình thiết kế bảng `push_tokens` ban đầu nghĩ dùng Expo Push (cho React Native). Khi chuyển sang Flutter:

- **Schema KHÔNG cần đổi** — bảng `push_tokens(user_id, token, platform, device_id)` vẫn dùng được, chỉ token format khác
- **Edge Function `send-push-notification`** phải REWRITE: dùng FCM Admin SDK thay vì Expo Push API
- **Setup FCM**:
  1. Tạo Firebase project (firebase.google.com)
  2. Add Android app → download `google-services.json` → đặt vào `android/app/`
  3. Add iOS app → download `GoogleService-Info.plist` → đặt vào `ios/Runner/`
  4. Add Web app → copy config vào `web/index.html` (cho Web push qua Service Worker)
  5. Lấy Service Account JSON → set vào Supabase secrets cho Edge Function dùng

**Code Edge Function (Deno) gọi FCM:**

```typescript
// supabase/functions/send-push-notification/index.ts
import { initializeApp, cert } from "npm:firebase-admin/app";
import { getMessaging } from "npm:firebase-admin/messaging";

const firebaseApp = initializeApp({
  credential: cert(JSON.parse(Deno.env.get("FIREBASE_SERVICE_ACCOUNT")!)),
});

Deno.serve(async (req) => {
  const { userId, title, body, data } = await req.json();

  // Get push tokens for user
  const { data: tokens } = await supabase
    .from("push_tokens")
    .select("token, platform")
    .eq("user_id", userId);

  // Send via FCM
  const messaging = getMessaging(firebaseApp);
  await messaging.sendEachForMulticast({
    tokens: tokens.map(t => t.token),
    notification: { title, body },
    data,
  });
});
```

---

## 7. `.github/workflows/` — CI/CD

### `ci.yml`

```yaml
name: CI

on:
  pull_request:
    branches: [main]
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: subosito/flutter-action@v2
        with:
          flutter-version: '3.44.0'
          channel: 'stable'
          cache: true
      - run: flutter pub get
      - run: dart run build_runner build --delete-conflicting-outputs
      - run: dart analyze
      - run: dart format --set-exit-if-changed lib test
      - run: flutter test
```

### `build-web.yml`

```yaml
name: Deploy Web

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: subosito/flutter-action@v2
        with:
          flutter-version: '3.44.0'
      - run: flutter pub get
      - run: dart run build_runner build --delete-conflicting-outputs
      - run: |
          flutter build web --release \
            --dart-define=SUPABASE_URL=${{ secrets.SUPABASE_URL }} \
            --dart-define=SUPABASE_ANON_KEY=${{ secrets.SUPABASE_ANON_KEY }} \
            --wasm                            # Tăng performance
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-args: '--prod'
          working-directory: build/web
```

### `build-android.yml`

```yaml
name: Build Android

on:
  push:
    tags: ['v*']

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: subosito/flutter-action@v2
      - run: flutter pub get
      - run: dart run build_runner build
      - run: |
          flutter build apk --release \
            --dart-define-from-file=.env.json
      - uses: actions/upload-artifact@v4
        with:
          name: unidate.apk
          path: build/app/outputs/flutter-apk/app-release.apk
```

---

## 8. Deployment

### Web (Vercel hoặc Netlify)

```bash
# Build
flutter build web --release --wasm \
  --dart-define-from-file=.env.json

# Deploy với Vercel CLI
cd build/web
vercel --prod
```

> **LƯU Ý SEO**: Flutter Web SPA, không SEO tốt. Nếu cần landing page index Google, làm separate site bằng Astro/Next.js cho marketing page, link sang Flutter app.

### iOS

```bash
# Build IPA
flutter build ipa --release --dart-define-from-file=.env.json

# Upload TestFlight
xcrun altool --upload-app -f build/ios/ipa/unidate.ipa \
  -u APPLE_ID -p APP_SPECIFIC_PASSWORD
```

Cần **Apple Developer Account $99/năm**.

### Android

```bash
# Build APK để share trực tiếp
flutter build apk --release --dart-define-from-file=.env.json
# Output: build/app/outputs/flutter-apk/app-release.apk

# Build AAB cho Google Play
flutter build appbundle --release --dart-define-from-file=.env.json
```

Google Play Console: **$25 một lần**.

### Desktop (optional)

```bash
# macOS
flutter build macos --release

# Windows
flutter build windows --release

# Linux
flutter build linux --release
```

---

## 9. Initial setup commands

```bash
# 1. Cài Flutter SDK 3.44.0
# Tải từ https://docs.flutter.dev/get-started/install

# 2. Verify
flutter doctor

# 3. Clone & install
git clone https://github.com/YOUR_ORG/uni-date.git
cd uni-date
flutter pub get

# 4. Setup Supabase
npm install -g supabase
supabase login
supabase link --project-ref YOUR_PROJECT_REF
supabase db push

# 5. Setup env
cp .env.example .env.json
# Điền thực tế

# 6. Generate code (Riverpod, Freezed, GoRouter)
dart run build_runner build --delete-conflicting-outputs

# 7. Run
flutter run                        # Auto-detect device
flutter run -d chrome              # Web
flutter run -d ios                 # iOS Simulator
flutter run -d android             # Android Emulator
```

---

## 10. Phân task 4 người (Flutter version)

Vì Flutter là 1 codebase, phân task theo **feature module** thay vì platform:

| Người | Phụ trách | Folder chính |
|-------|-----------|--------------|
| Dev 1 | Auth + Profile + Onboarding | `features/auth/`, `features/profile/`, `features/onboarding/` |
| Dev 2 | Discover + Matches + Chat | `features/discover/`, `features/matches/`, `features/chat/` |
| Dev 3 | Feed + Events + Notifications | `features/feed/`, `features/events/`, `features/notifications/` |
| Dev 4 | Admin + Settings + Production | `features/admin/`, `features/settings/`, CI/CD, Sentry, testing |

**Layer chung cần phối hợp:**
- `data/repositories/`, `data/models/` — Dev 3 lead, mọi người contribute
- `core/`, `shared/widgets/` — code review chung
- `router/app_router.dart` — Dev 4 maintain, mỗi feature add routes của mình
- `supabase/migrations/` — Dev 3 lead

**Quy tắc:**
- Branch theo feature: `feature/swipe-deck`, `feature/chat-realtime`
- PR review tối thiểu 1 người khác
- Commit convention: `feat(swipe): add undo button`
- Code generation phải commit: `*.g.dart`, `*.freezed.dart` đều push lên git

---

## 11. Self-review — câu hỏi mình tự đặt và trả lời

### Q1: Flutter Web có chạy được toàn bộ feature không?
**A**: ~95% có. Một số khác biệt nhỏ:
- Camera & image picker hoạt động khác (web dùng file input)
- Push notification trên web cần Service Worker setup riêng
- GPS hoạt động qua browser API, hỏi permission khác mobile
- Realtime, Supabase Auth, Database operations: 100% giống mobile

Dùng `kIsWeb` check và viết platform-specific code khi cần.

### Q2: Cả nhóm chưa biết Dart thì học ở đâu trong 1 tuần?
**A**:
- **Ngày 1-2**: Dart syntax basics — https://dart.dev/language
- **Ngày 3-4**: Flutter widgets concept — https://docs.flutter.dev/ui/widgets-intro
- **Ngày 5**: Riverpod basics — https://riverpod.dev/docs/introduction/why_riverpod
- **Ngày 6-7**: Code thử 1 screen đơn giản (login) bằng AI Code

AI agent help đáng kể — paste doc + ví dụ vào prompt thì agent code đúng pattern Dart.

### Q3: Riverpod vs Provider vs Bloc — sao chọn Riverpod?
**A**: Riverpod 2.x là chuẩn 2026 vì:
- Code generation tự động giảm boilerplate
- Type-safe 100% (no runtime errors)
- Compile-time graph checking
- Author là người tạo Provider package, đã rewrite hoàn toàn
- Better testing — không cần wrap ProviderScope mỗi test

Bloc tốt cho enterprise lớn nhưng boilerplate nhiều hơn. Đồ án Riverpod đủ.

### Q4: AI agent có làm Flutter tốt không?
**A**: Tốt nhưng kém React. Workaround:
- Trong AGENTS.md ghi rõ Dart conventions, Riverpod syntax 2.x
- Prompt rõ ràng kèm context file đang sửa
- Sau code generation, chạy `dart analyze` để catch error sớm
- Nếu AI viết Riverpod 1.x syntax (StateNotifier...) thì re-prompt với "use code-generated Riverpod 2.x"

### Q5: Swipe deck Flutter có thư viện sẵn không?
**A**: Có `card_swiper` package — dùng cho MVP để tiết kiệm thời gian. Khi cần custom animation đặc biệt (rotation 3D, scaling dynamic, particle effect khi like) thì tự build với:
- `GestureDetector` cho swipe gesture
- `AnimatedBuilder` + `Transform.rotate` cho animation
- `Stack` để layer card chồng
- Đoạn này AI làm tốt với ví dụ rõ — có sẵn nhiều tutorial.

**Strategy**: Bắt đầu với `card_swiper` để có UI nhanh, refactor sang custom widget khi UX team muốn animation đặc biệt hơn (Sprint 6).

### Q6: Admin dashboard Flutter có đẹp như shadcn không?
**A**: Khó bằng. Nhưng dùng:
- `data_table_2` package — responsive data table
- `flex_color_scheme` — Material 3 đẹp
- `fl_chart` — biểu đồ analytics
- Custom widgets với card layout

Đủ "professional looking" cho đồ án, không cần đẹp như Vercel dashboard.

### Q7: Code generation `build_runner` chạy chậm, làm sao?
**A**:
- Chạy `dart run build_runner watch` mode — auto regen khi save file
- `--delete-conflicting-outputs` để tránh lỗi conflict
- CI cache `.dart_tool/` để build nhanh

### Q8: 4 người làm cùng repo có conflict nhiều không?
**A**: Vì 1 codebase nên có rủi ro:
- `pubspec.yaml` thường conflict khi nhiều người add package — coordinate trên Slack/Discord
- `pubspec.lock` conflict — chấp nhận và `flutter pub get` lại
- `app_router.dart` thường conflict — Dev 4 maintain, mọi người PR add route
- Generated files (`*.g.dart`) conflict — chạy build_runner xong commit lại

Quy tắc: feature isolated trong `features/<name>/`, ít đụng nhau.

### Q9: Cấu trúc Clean Architecture (data/domain/features) có quá phức tạp cho đồ án?
**A**: Có một chút, nhưng nên giữ vì:
- 4 người làm — ranh giới rõ
- 101 MVP features — không có structure sẽ rối loạn
- AI agent code đúng pattern khi cấu trúc nhất quán

Có thể **bỏ `domain/` layer** nếu muốn đơn giản hơn — call repository trực tiếp từ provider. Vẫn OK cho đồ án.

### Q10: Có thiếu gì so với production app thật?
**A**:
- ❌ Chưa có CDN cho images (Supabase Storage có sẵn CDN, đủ)
- ❌ Chưa có Crashlytics — Sentry thay thế được
- ❌ Chưa có A/B testing — PostHog có nhưng chưa wire
- ❌ Chưa có deep linking branding nâng cao (Branch.io) — `app_links` package đủ
- ❌ Chưa có background sync — Supabase Realtime đủ
- ❌ Chưa có offline mode hoàn chỉnh — `hive` package có thể thêm sau

Đủ cho MVP đồ án.

---

## 12. So sánh tóm tắt với phiên bản Next.js + RN cũ

| Tiêu chí | Flutter (chốt) | Next.js + RN (cũ) |
|----------|----------------|--------------------|
| Số codebase | 1 | 2 (web + mobile) |
| Mapping web → mobile | KHÔNG cần | Cần ~2-3 tuần |
| Platform support | Web + iOS + Android + macOS + Win + Linux | Web + iOS + Android |
| Ngôn ngữ | Dart (mới với nhóm) | TypeScript |
| Setup phức tạp | Trung bình | Cao (monorepo) |
| Total time | ~10 tuần (gồm 1 tuần học Dart) | ~12 tuần |
| Admin dashboard | OK (Material 3) | Tốt nhất (shadcn) |
| Swipe animation | Mượt nhất | Mượt với Reanimated v4 |
| AI agent support | Trung bình | Cao |
| SEO web | Kém | Tốt |

---

## 13. Checklist hoàn chỉnh trước khi bắt đầu code

- [ ] Đọc kỹ 3 file markdown (01, 02, 03)
- [ ] Cài Flutter SDK 3.44.0 stable
- [ ] Cài Android Studio + Xcode (cho iOS)
- [ ] `flutter doctor` không có lỗi đỏ
- [ ] Tạo Supabase project (region Singapore)
- [ ] Tạo Firebase project (cho FCM push notification)
- [ ] Tạo Sentry + PostHog projects
- [ ] Setup `.env.json` từ template
- [ ] Setup `.mcp.json` và `AGENTS.md`
- [ ] Run `flutter pub get` thành công
- [ ] Run `dart run build_runner build` thành công
- [ ] Run `flutter run -d chrome` test Web chạy
- [ ] Run `flutter run -d android` test Android chạy
- [ ] Run `flutter run -d ios` test iOS chạy (cần Mac)
- [ ] Cả nhóm hoàn thành tutorial Dart cơ bản (1 tuần đầu)
- [ ] Phân task 4 người theo section 10
- [ ] Branch protection rules GitHub
- [ ] Pre-commit hook chạy `dart format` + `dart analyze`
- [ ] Sprint 1 kickoff!

---

## 14. Resources học Dart + Flutter (cho nhóm)

- **Dart language tour**: https://dart.dev/language (3 giờ đọc)
- **Flutter cookbook**: https://docs.flutter.dev/cookbook (practical recipes)
- **Riverpod docs**: https://riverpod.dev/docs/introduction/why_riverpod
- **Freezed 3.x migration**: https://pub.dev/packages/freezed (xem changelog 3.0)
- **Flutter Mapp YouTube** — kênh hay nhất cho Flutter beginners
- **Code With Andrea** — Riverpod tutorials chuẩn
- **Flutter Gems** — https://fluttergems.dev/ — tìm package tốt
- **pub.dev** — npm của Dart, search package
- **Supabase Flutter quickstart**: https://supabase.com/docs/guides/getting-started/quickstarts/flutter

---

## 15. Version Compatibility Matrix (2026)

Bảng tổng hợp các version đã được verify (qua pub.dev tháng 5/2026) tương thích tốt với nhau. Nếu Claude Code gợi ý version khác, **giữ theo bảng này** trừ khi có lý do cụ thể.

> ⚠️ **Verified status** (cập nhật 2026-05-25):
> - supabase_flutter v3 chưa có stable trên pub.dev (latest stable: 2.12.4)
> - Riverpod 3.x đã stable, nhưng project pin Riverpod 2.6.1 để giảm migration risk và giữ syntax quen thuộc
> - Freezed 3.x đã stable, nhưng project dùng Freezed 2.x để đồng bộ với lựa chọn Riverpod 2.x

### Core SDK

| Package | Version | Lý do |
|---------|---------|-------|
| Flutter SDK | `3.44.0` | Stable May 2026, ship Dart 3.12 |
| Dart SDK constraint | `^3.9.0` | go_router 17.x yêu cầu Dart 3.9+, Flutter 3.44 đáp ứng được |

### State management & Routing

| Package | Version | Note |
|---------|---------|------|
| `flutter_riverpod` | `^2.6.1` | Stable, có code generation |
| `riverpod_annotation` | `^2.6.1` | Match riverpod 2.x |
| `riverpod_generator` | `^2.6.3` | dev_dependency, code gen |
| `hooks_riverpod` | `^2.6.1` | Match riverpod 2.x |
| `go_router` | `^17.2.3` | Latest stable (1 May 2026), maintained by Flutter team |
| `go_router_builder` | `^3.0.0` | Match go_router 17.x |

### Data models

| Package | Version | Note |
|---------|---------|------|
| `freezed` | `^2.5.7` | Dev dependency, 2.x stable |
| `freezed_annotation` | `^2.4.4` | Match freezed 2.x |
| `json_serializable` | `^6.9.0` | OK với Freezed 2.x |
| `build_runner` | `^2.4.13` | Works với mọi code gen package |

### Backend

| Package | Version | Note |
|---------|---------|------|
| `supabase_flutter` | `^2.12.4` | **Latest stable trên pub.dev** — v3 chưa có stable |
| `firebase_core` | `^3.8.0` | Cho FCM init |
| `firebase_messaging` | `^16.2.2` | Push notifications |

### Image handling — quan trọng cho storage quota

| Package | Version | Note |
|---------|---------|------|
| `image_picker` | `^1.1.2` | Pick từ gallery/camera |
| `image_cropper` | `^8.0.2` | Crop ảnh profile |
| `image` | `^4.3.0` | Image processing |
| `flutter_image_compress` | `^2.3.0` | **BẮT BUỘC** nén ảnh trước upload (target ~200KB) |
| `cached_network_image` | `^3.4.1` | Image cache |

### Common dependencies — không có breaking change

| Package | Version |
|---------|---------|
| `dio` | `^5.7.0` |
| `geolocator` | `^13.0.2` |
| `flutter_map` | `^7.0.2` |
| `dart_geohash` | `^2.0.2` |
| `flutter_secure_storage` | `^9.2.2` |
| `shared_preferences` | `^2.3.3` |
| `sentry_flutter` | `^8.11.0` |
| `posthog_flutter` | `^4.10.0` |
| `google_fonts` | `^6.2.1` |
| `flex_color_scheme` | `^7.3.1` |
| `data_table_2` | `^2.5.15` |
| `fl_chart` | `^0.69.0` |

### Quy trình verify trước khi code

Sau khi tạo project, chạy ngay:
```bash
flutter pub get                    # Tải dependencies
flutter pub outdated               # Check version conflict
dart run build_runner build --delete-conflicting-outputs  # Test code gen works
flutter analyze                    # Check static errors
```

Nếu có lỗi version conflict, debug theo thứ tự:
1. Kiểm tra `flutter --version` đúng 3.44.0
2. `pubspec.lock` xóa rồi `flutter pub get` lại
3. `flutter clean` rồi build lại
4. Nếu vẫn lỗi, downgrade version conflict (xem `flutter pub deps`)

### Khi nào nên update lên version mới hơn?

- **PATCH** (2.12.4 → 2.12.5): Update tự do
- **MINOR** (2.12.4 → 2.13.0): Update sau khi check changelog
- **MAJOR** (2.x → 3.x): KHÔNG update trong 3 tháng đồ án — quá rủi ro

### Khi nào nên cân nhắc major upgrade?

Theo dõi:
- https://pub.dev/packages/supabase_flutter/versions
- https://pub.dev/packages/flutter_riverpod/versions

Sau đồ án xong nếu muốn upgrade supabase_flutter 3.x hoặc Riverpod 3.x thì follow migration guide chính thức của từng package.
