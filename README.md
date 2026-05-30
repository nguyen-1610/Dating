# UniDate - Dự án ứng dụng dating cho sinh viên

UniDate là ứng dụng hẹn hò dành cho sinh viên đại học Việt Nam. Dự án dùng Flutter để chạy chung một codebase cho Web, Windows, Android, iOS và các nền tảng desktop khác. Backend dự kiến dùng Supabase cho Auth, Database, Storage, Realtime và Edge Functions.

Repo hiện tại đã được khởi tạo Flutter project cơ bản. Android SDK có thể cài sau; trong giai đoạn đầu team có thể chạy bằng Chrome hoặc Windows trước.

## 1. Công nghệ chính

- Flutter 3.44.0
- Dart SDK theo Flutter hiện tại
- Supabase: Auth, PostgreSQL, Storage, Realtime, Edge Functions
- Firebase Cloud Messaging: push notification, làm sau
- Git/GitHub: quản lý code và pull request

Tài liệu chi tiết nằm trong:

- `docs/01-features-and-roles.md`: tính năng và vai trò người dùng
- `docs/02-database-schema.md`: thiết kế database Supabase
- `docs/03-repo-structure.md`: cấu trúc code Flutter dự kiến
- `Giao diện tham khảo/`: UI kit và giao diện tham khảo

## 2. Cần cài những gì

### Bắt buộc

1. Git
2. Flutter SDK 3.44.0 hoặc mới hơn trong cùng nhánh stable
3. Chrome để chạy Flutter Web
4. VS Code hoặc Android Studio
5. Node.js LTS để dùng Supabase CLI nếu cài qua npm

Kiểm tra Flutter:

```powershell
flutter doctor
```

Nếu `flutter doctor` báo lỗi Android toolchain nhưng Chrome đã xanh thì vẫn có thể làm Web trước.

### Tạm thời chưa bắt buộc

Android Studio và Android SDK chỉ cần khi chạy Android emulator hoặc build APK.

Khi cần Android, cài Android Studio rồi chạy:

```powershell
flutter doctor --android-licenses
flutter doctor
```

## 3. Clone và chạy project

Clone repo:

```powershell
git clone <URL_REPO>
cd Dating
```

Tải dependency Flutter:

```powershell
flutter pub get
```

Chạy trên Chrome:

```powershell
flutter run -d chrome
```

Chạy trên Windows:

```powershell
flutter run -d windows
```

Xem danh sách thiết bị có thể chạy:

```powershell
flutter devices
```

Dừng app đang chạy trong terminal:

```text
q
```

Nếu terminal hỏi `Terminate batch job (Y/N)?`, nhập:

```text
y
```

### Chạy thư mục giao diện tham khảo

Thư mục `Giao diện tham khảo/` là bộ HTML tĩnh, không cần `npm install`.

Từ thư mục gốc project, chạy:

```powershell
cd "Giao diện tham khảo"
python -m http.server 8001 --bind 127.0.0.1
```

Sau đó mở:

```text
http://127.0.0.1:8001/ui_kits/mobile/index.html
```

Trang admin:

```text
http://127.0.0.1:8001/ui_kits/admin/index.html
```

Tắt server: quay lại terminal đang chạy lệnh trên và nhấn:

```text
Ctrl + C
```

Nếu chạy server bằng `Start-Process` như Codex đã làm, kiểm tra process Python:

```powershell
Get-Process python
```

Tắt đúng process theo `Id`, ví dụ:

```powershell
Stop-Process -Id 17144
```

## 4. Các lệnh Flutter thường dùng

Tải package:

```powershell
flutter pub get
```

Kiểm tra lỗi code:

```powershell
flutter analyze
```

Chạy test:

```powershell
flutter test
```

Format code:

```powershell
dart format lib test
```

Build Web:

```powershell
flutter build web --release
```

Build Windows:

```powershell
flutter build windows --release
```

Sau này nếu có dùng code generation như Riverpod, Freezed, GoRouter:

```powershell
dart run build_runner build --delete-conflicting-outputs
```

## 5. Cấu trúc thư mục hiện tại

```text
Dating/
├── android/              # Cấu hình Android
├── ios/                  # Cấu hình iOS
├── lib/                  # Code Dart/Flutter chính
│   └── main.dart         # Entry point hiện tại
├── web/                  # Cấu hình Flutter Web
├── windows/              # Cấu hình Windows app
├── linux/                # Cấu hình Linux app
├── macos/                # Cấu hình macOS app
├── assets/               # Ảnh, icon, font
├── docs/                 # Tài liệu phân tích dự án
├── supabase/             # Migration và Edge Functions Supabase
├── test/                 # Unit/widget tests
├── integration_test/     # E2E tests
├── pubspec.yaml          # Khai báo package Flutter
└── README.md
```

Quy ước khi code:

- Code UI theo feature đặt trong `lib/features/<ten_feature>/`
- Model đặt trong `lib/data/models/`
- Query Supabase đặt trong `lib/data/repositories/`
- Widget dùng lại nhiều nơi đặt trong `lib/shared/widgets/`
- Không hard-code secret trong code Flutter

## 6. Thiết lập Supabase

### 6.1 Tạo project Supabase

1. Vào https://supabase.com
2. Tạo project mới
3. Chọn region gần Việt Nam, ví dụ Singapore
4. Lưu lại các thông tin:
   - Project URL
   - anon/public key
   - project ref

Không đưa `service_role key` vào app Flutter. Key này chỉ dùng ở server hoặc Edge Functions.

### 6.2 Cài Supabase CLI

Cài bằng npm:

```powershell
npm install -g supabase
```

Kiểm tra:

```powershell
supabase --version
```

Đăng nhập:

```powershell
supabase login
```

Link repo với project Supabase:

```powershell
supabase link --project-ref <PROJECT_REF>
```

### 6.3 Migration database

Migration đặt trong:

```text
supabase/migrations/
```

Hiện thư mục migration mới có `.gitkeep`, chưa có file SQL thật. Khi bắt đầu làm database, tạo migration theo tài liệu:

```text
docs/02-database-schema.md
```

Tạo migration mới:

```powershell
supabase migration new init_extensions
```

Sau đó viết SQL vào file mới trong `supabase/migrations/`.

Đẩy migration lên Supabase remote:

```powershell
supabase db push
```

Nếu muốn chạy local Supabase bằng Docker:

```powershell
supabase start
supabase db reset
```

Lưu ý: local Supabase cần Docker Desktop.

### 6.4 Storage buckets

Theo thiết kế, app cần các bucket:

- `avatars`
- `post-images`
- `event-covers`
- `chat-images`
- `ad-images`

Bucket và policy nên được tạo bằng migration SQL, không tạo tay trong dashboard nếu muốn team đồng bộ schema.

Chi tiết policy nằm trong `docs/02-database-schema.md`.

### 6.5 Realtime

Các bảng cần realtime dự kiến:

- `messages`
- `event_messages`
- `notifications`
- `matches`
- `event_attendees`

Realtime cũng nên bật bằng migration SQL.

## 7. Cấu hình biến môi trường

Flutter không tự đọc `.env` như một số framework web. Dự án sẽ dùng `--dart-define-from-file`.

Tạo file `.env.json` ở root:

```json
{
  "SUPABASE_URL": "https://your-project.supabase.co",
  "SUPABASE_ANON_KEY": "your-anon-key",
  "SENTRY_DSN": "",
  "POSTHOG_API_KEY": ""
}
```

Chạy app với file env:

```powershell
flutter run -d chrome --dart-define-from-file=.env.json
```

Build Web với env:

```powershell
flutter build web --release --dart-define-from-file=.env.json
```

Không commit `.env.json` lên Git. Chỉ commit `.env.example` nếu cần.

Các giá trị không được để trong app Flutter:

- `SUPABASE_SERVICE_ROLE_KEY`
- Firebase service account
- OpenAI API key
- bất kỳ secret backend nào

## 8. Quy trình làm việc cho team

Trước khi code:

```powershell
git pull
flutter pub get
```

Tạo branch mới:

```powershell
git checkout -b feature/auth-login
```

Trong quá trình làm:

```powershell
flutter analyze
flutter test
```

Trước khi commit:

```powershell
dart format lib test
flutter analyze
flutter test
git status
```

Commit:

```powershell
git add .
git commit -m "feat(auth): add login screen"
```

Push:

```powershell
git push origin feature/auth-login
```

Sau đó tạo Pull Request trên GitHub.

Quy ước commit:

- `feat(auth): add login screen`
- `fix(chat): handle empty message`
- `docs(readme): update setup guide`
- `chore: initialize flutter project`
- `refactor(profile): split photo uploader`

## 9. Lộ trình setup tiếp theo

1. Cập nhật `pubspec.yaml` theo stack thật: Supabase, Riverpod, GoRouter, Freezed.
2. Tạo `.env.example`.
3. Tạo màn hình app shell ban đầu.
4. Tạo Supabase project.
5. Viết migration database đầu tiên.
6. Kết nối Supabase Auth.
7. Làm luồng đăng ký, đăng nhập, onboarding.

## 10. Troubleshooting

### Flutter không nhận lệnh

Kiểm tra Flutter đã được thêm vào PATH chưa:

```powershell
flutter --version
```

Nếu không nhận, thêm thư mục `flutter/bin` vào Environment Variables.

### Android SDK chưa có

Nếu thấy:

```text
Unable to locate Android SDK
```

Vẫn có thể chạy Web:

```powershell
flutter run -d chrome
```

Android SDK cài sau bằng Android Studio.

### Chạy Chrome bị kẹt hoặc muốn dừng

Trong terminal đang chạy app, bấm:

```text
q
```

Hoặc `Ctrl + C`, sau đó nhập:

```text
y
```

### Supabase CLI không nhận lệnh

Kiểm tra Node.js:

```powershell
node -v
npm -v
```

Cài lại CLI:

```powershell
npm install -g supabase
```

## 11. Ghi chú bảo mật

- Không commit `.env.json`
- Không đưa service role key vào Flutter
- Bật Row Level Security cho mọi bảng Supabase
- Mọi thay đổi database phải qua migration
- Storage policy phải giới hạn user chỉ sửa file của chính mình
- Moderator không được đọc tin nhắn riêng tư trừ phần được report

## 12. Trạng thái hiện tại

- Flutter project đã được khởi tạo.
- App hiện vẫn là Flutter counter app mặc định.
- Có thể chạy Web bằng Chrome.
- Android toolchain có thể cài sau.
- Supabase folder đã có nhưng chưa có migration SQL thật.
- README này là tài liệu setup ban đầu cho team.
