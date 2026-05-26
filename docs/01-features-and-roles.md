# UniDate — Features & Roles Specification

> **Project**: UniDate — Web + Mobile dating app dành cho sinh viên đại học Việt Nam
> **Stack**: Flutter 3.44.0 (single codebase: Web + iOS + Android) + Supabase (BaaS)
> **Team**: 4 developers, 3 tháng, AI agent-assisted
> **Last updated**: 2026-05-24

---

## 1. Tổng quan & USP

UniDate là **dating app + mạng xã hội mini + nền tảng sự kiện** dành riêng cho sinh viên đại học Việt Nam. Điểm khác biệt cốt lõi so với Tinder/Bumble/Hinge:

- **Lọc theo trường + vị trí** — sinh viên có thể chỉ swipe người cùng/khác trường mình muốn
- **Sự kiện sinh viên với GPS check-in + event-only swipe** — gặp mặt thật, không chỉ online
- **Feed mạng xã hội mini** kiểu Threads/Instagram — đăng bài, story, comment, like
- **Free toàn bộ tính năng core** (free cao hơn Tinder Free), không gate bằng paywall

Target user: sinh viên 18–25 tuổi tại các trường đại học VN (HCMUS, BK, UEH, FTU, HUST...).

---

## 2. Roles (3 roles)

### 2.1 User — Sinh viên (role chính)

- Đối tượng người dùng cuối, chiếm 99% lượng user
- Tạo profile, swipe, match, chat, đăng bài, tham gia sự kiện
- Có thể tạo sự kiện sinh viên hoặc hẹn hò nhóm
- Có thể report user/post/message vi phạm
- Có thể block user khác

### 2.2 Moderator — Kiểm duyệt nội dung

- Nhân viên kiểm duyệt, được Admin phân quyền
- Xem & xử lý report do User gửi lên
- Duyệt/xóa bài đăng vi phạm, ảnh profile không phù hợp
- Quản lý bộ lọc từ ngữ nhạy cảm (banned_words)
- **KHÔNG được phép đọc tin nhắn riêng tư 1-1** trừ khi tin nhắn đó nằm trong report
- Có thể duyệt sự kiện trước khi public (nếu admin bật setting đó)
- Có thể cảnh cáo / khóa tài khoản tạm thời (max 7 ngày)
- Mọi action của Moderator đều được ghi vào `audit_logs`

### 2.3 Admin — Quản lý hệ thống

- Toàn quyền trên hệ thống
- Quản lý user (xem, khóa, mở khóa, xóa vĩnh viễn)
- Phân quyền Moderator
- Dashboard analytics tổng quan
- Quản lý quảng cáo (tạo, lên lịch, theo dõi)
- Cấu hình hệ thống (boost duration, filter defaults, rate limits)
- 2FA bắt buộc cho tài khoản admin
- Mọi action đều ghi `audit_logs`

---

## 3. Features Map theo Role

### Ký hiệu ưu tiên

- 🔴 **MVP** — Bắt buộc có ở phase 1 (3 tháng đồ án)
- 🟡 **Nice** — Nên có nếu còn thời gian
- ⚪ **v2** — Để dành sau khi MVP xong

---

## 4. USER Features (Sinh viên)

### 4.1 Authentication & Onboarding

| # | Feature | Priority | Mô tả chi tiết |
|---|---------|----------|----------------|
| U1.1 | Đăng ký bằng email + password | 🔴 MVP | Supabase Auth email/password, có verify email |
| U1.2 | Đăng nhập Google OAuth | 🔴 MVP | Supabase Auth Provider Google |
| U1.3 | Quên mật khẩu / reset password | 🔴 MVP | Magic link qua email |
| U1.4 | Đồng ý Terms & Privacy khi đăng ký | 🔴 MVP | Lưu version đã đồng ý vào `user_consents` |
| U1.5 | Onboarding wizard 5 bước | 🔴 MVP | Tên → ngày sinh → giới tính + interested_in → trường + ngành → upload ảnh |
| U1.6 | Đăng xuất | 🔴 MVP | Clear session, redirect login |
| U1.7 | Xóa tài khoản (soft delete 30 ngày) | 🔴 MVP | Đánh dấu `deleted_at`, sau 30 ngày job xóa thật |

### 4.2 Profile

| # | Feature | Priority | Mô tả chi tiết |
|---|---------|----------|----------------|
| U2.1 | Xem profile của chính mình | 🔴 MVP | Hiển thị đầy đủ thông tin + chỉnh sửa |
| U2.2 | Chỉnh sửa thông tin cá nhân | 🔴 MVP | Tên, bio, ngày sinh, trường, ngành, sở thích |
| U2.3 | Upload nhiều ảnh profile (max 6) | 🔴 MVP | Supabase Storage, kéo thả sắp xếp thứ tự. **BẮT BUỘC** dùng `flutter_image_compress` để resize + compress ảnh xuống ~200KB trước khi upload (Free tier Storage chỉ 1GB) |
| U2.4 | Crop ảnh trước khi upload | 🔴 MVP | Crop vuông cho avatar, ratio 4:5 cho ảnh swipe |
| U2.5 | Chọn sở thích từ tag pool | 🔴 MVP | Pool có sẵn: music, sport, gaming, reading, travel... (max 10 tags) |
| U2.6 | Thêm link mạng xã hội vào bio | 🔴 MVP | Instagram, Facebook, TikTok — user nhập link, app render thành icon clickable |
| U2.7 | Hiển thị tuổi (tính từ ngày sinh) | 🔴 MVP | Tự động, user không nhập tuổi thủ công |
| U2.8 | Profile prompts (kiểu Hinge) | 🟡 Nice | 3 câu hỏi có sẵn, user chọn và trả lời |
| U2.9 | Verify selfie (blue tick) | 🟡 Nice | Selfie pose ngẫu nhiên + face match với ảnh profile |
| U2.10 | Xem profile user khác (chi tiết) | 🔴 MVP | Tap card → modal full profile |

### 4.3 Discover & Swipe

| # | Feature | Priority | Mô tả chi tiết |
|---|---------|----------|----------------|
| U3.1 | Swipe deck (vuốt trái/phải) | 🔴 MVP | Animation mượt, có cả button bấm |
| U3.2 | Swipe right = Like | 🔴 MVP | Insert vào `swipes` với direction='like' |
| U3.3 | Swipe left = Pass | 🔴 MVP | Insert vào `swipes` với direction='pass' |
| U3.4 | Super Like (3/ngày free) | 🔴 MVP | direction='super_like', target nhận noti ngay |
| U3.5 | Undo swipe cuối (3 lần/ngày) | 🔴 MVP | Set `is_undone=true`, không đếm vào rate limit |
| U3.6 | Filter: giới tính | 🔴 MVP | Lưu vào `profiles.interested_in` |
| U3.7 | Filter: độ tuổi (range) | 🔴 MVP | min_age, max_age |
| U3.8 | Filter: khoảng cách (km) | 🔴 MVP | Dùng geohash để tối ưu query |
| U3.9 | Filter: trường đại học | 🔴 MVP | Cùng trường / khác trường / tất cả |
| U3.10 | Filter: sở thích chung | 🟡 Nice | Có ít nhất 1 sở thích trùng |
| U3.11 | Compatibility score trên card | 🟡 Nice | Số % hợp gu dựa trên sở thích + trường + tuổi |
| U3.12 | Hết người để swipe → "Đã hết hôm nay" | 🔴 MVP | Empty state đẹp, gợi ý chỉnh filter |
| U3.13 | Boost profile (1 lần/ngày free) | 🔴 MVP | 30 phút profile được đẩy lên đầu stack |
| U3.14 | Match popup khi match | 🔴 MVP | Modal "It's a match!" + nút "Send a message" hoặc "Keep swiping" |

### 4.4 Matches & Likes

| # | Feature | Priority | Mô tả chi tiết |
|---|---------|----------|----------------|
| U4.1 | Danh sách match | 🔴 MVP | Sort: mới nhất / có tin nhắn chưa đọc / online |
| U4.2 | See Who Liked You | 🔴 MVP | Grid ảnh người đã swipe phải mình (free, không gate) |
| U4.3 | Lịch sử swipe (7 ngày gần nhất) | 🔴 MVP | Tab "Đã like" / "Đã pass" để user xem lại |
| U4.4 | Lịch sử ai đã xem profile mình | 🟡 Nice | Bảng `profile_views`, list 30 ngày gần nhất |
| U4.5 | Lịch sử match đã unmatch | 🟡 Nice | Tab riêng trong match list, xem 30 ngày |
| U4.6 | Unmatch user | 🔴 MVP | Set `matches.is_active=false`, ẩn khỏi list |
| U4.7 | Online indicator (Presence) | 🔴 MVP | Chấm xanh = online, chấm vàng = active 24h |

### 4.5 Chat 1-1

| # | Feature | Priority | Mô tả chi tiết |
|---|---------|----------|----------------|
| U5.1 | Mở chat từ match list | 🔴 MVP | Click match → mở conversation |
| U5.2 | Gửi tin nhắn text | 🔴 MVP | INSERT vào `messages` trước; DB là source of truth |
| U5.3 | Realtime nhận tin nhắn | 🔴 MVP | Subscribe `postgres_changes` trên `messages` theo `match_id` |
| U5.4 | Seen / delivered indicator | 🔴 MVP | Update `is_read=true` khi đối phương mở chat |
| U5.5 | Typing indicator ("đang gõ...") | 🟡 Nice | Broadcast event, không lưu DB, biến mất sau 3s |
| U5.6 | Gửi emoji | 🔴 MVP | Emoji picker native |
| U5.7 | Gửi ảnh | 🟡 Nice | Upload Supabase Storage, send URL |
| U5.8 | Pagination chat history | 🔴 MVP | Load 30 tin gần nhất, scroll up load thêm |
| U5.9 | AI ice-breaker khi match | 🟡 Nice | Gợi ý 3 câu mở chat dựa trên profile 2 người |
| U5.10 | Tự lọc từ ngữ nhạy cảm | 🔴 MVP | Check `banned_words` trước khi insert, hiện warning |
| U5.11 | Báo cáo tin nhắn vi phạm | 🔴 MVP | Long-press tin nhắn → Report, gắn vào `reports` |
| U5.12 | Xóa tin nhắn của mình | 🟡 Nice | Soft delete, hiện "Tin nhắn đã bị xóa" |
| U5.13 | Voice/Video call trong chat | ⚪ v2 | Tích hợp Daily.co hoặc Agora |

### 4.6 Social Feed

| # | Feature | Priority | Mô tả chi tiết |
|---|---------|----------|----------------|
| U6.1 | Đăng bài (text + ảnh) | 🔴 MVP | Caption + multi-image, public. Compress ảnh ~300KB trước upload |
| U6.2 | Đăng story (24h tự xóa) | 🟡 Nice | `posts.type='story'`, `expires_at=now+24h` |
| U6.3 | Đăng thread (text-only, kiểu Threads) | 🟡 Nice | `posts.type='thread'`, max 500 ký tự |
| U6.4 | Feed trang chủ (timeline) | 🔴 MVP | Sort: newest, có infinite scroll |
| U6.5 | Feed trang cá nhân | 🔴 MVP | Tất cả bài đã đăng của user X |
| U6.6 | Like bài đăng | 🔴 MVP | Insert vào `post_likes`, update `posts.likes_count` |
| U6.7 | Comment bài đăng | 🔴 MVP | Bảng `comments`, nested reply 1 level |
| U6.8 | Xóa bài của mình | 🔴 MVP | Soft delete |
| U6.9 | Báo cáo bài đăng | 🔴 MVP | Gắn vào `reports` |
| U6.10 | Mention @user trong comment | ⚪ v2 | User được tag nhận noti riêng |
| U6.11 | Share bài lên story | ⚪ v2 | Repost với caption mới |

### 4.7 Events (Sự kiện)

| # | Feature | Priority | Mô tả chi tiết |
|---|---------|----------|----------------|
| U7.1 | Xem danh sách sự kiện | 🔴 MVP | Sort: sắp diễn ra, gần mình, tham gia nhiều |
| U7.2 | Filter sự kiện theo type | 🔴 MVP | Hẹn hò nhóm / Hoạt động sinh viên / Tất cả |
| U7.3 | Filter sự kiện theo trường | 🔴 MVP | Chỉ trường mình / tất cả |
| U7.4 | Xem chi tiết sự kiện | 🔴 MVP | Ảnh bìa, mô tả, địa điểm, thời gian, người tham gia |
| U7.5 | Tạo sự kiện | 🔴 MVP | Form đầy đủ — title, type, location, time, max_attendees |
| U7.6 | Pick location trên bản đồ | 🔴 MVP | Map picker để lấy lat/lng chính xác |
| U7.7 | Đăng ký tham gia sự kiện | 🔴 MVP | Insert vào `event_attendees` status='registered' |
| U7.8 | Hủy đăng ký | 🔴 MVP | Delete row trong `event_attendees` |
| U7.9 | GPS check-in tại sự kiện | 🔴 MVP | So GPS user với event location, ≤ checkin_radius → check-in |
| U7.10 | Xem danh sách attendees | 🔴 MVP | Ảnh mờ nếu chưa check-in, rõ nếu đã check-in |
| U7.11 | Swipe riêng trong sự kiện | 🔴 MVP | Event-only swipe deck — chỉ hiện người đã check-in |
| U7.12 | Group chat sự kiện | 🔴 MVP | Chỉ attendee đã check-in vào được, tự xóa sau 24h kết thúc |
| U7.13 | Sửa/xóa sự kiện của mình | 🔴 MVP | Owner only |
| U7.14 | Báo cáo sự kiện vi phạm | 🔴 MVP | Gắn vào `reports` |
| U7.15 | Lịch sử event đã tham gia | 🟡 Nice | Tab trong profile, hiện ở public profile như badge |

### 4.8 Notifications

| # | Feature | Priority | Mô tả chi tiết |
|---|---------|----------|----------------|
| U8.1 | Match mới | 🔴 MVP | In-app + push noti |
| U8.2 | Tin nhắn mới | 🔴 MVP | In-app + push, badge số tin chưa đọc |
| U8.3 | Super Like nhận được | 🔴 MVP | Push noti riêng (khác match thường) |
| U8.4 | Ai đó like bài đăng | 🔴 MVP | Gộp: "X và 5 người khác đã thích bài của bạn" |
| U8.5 | Ai đó comment bài đăng | 🔴 MVP | Push noti với preview comment |
| U8.6 | Reply comment của mình | 🔴 MVP | Noti khi comment được reply |
| U8.7 | Sự kiện sắp diễn ra | 🔴 MVP | Trước 24h và 1h |
| U8.8 | Ai check-in cùng sự kiện | 🟡 Nice | "X vừa đến sự kiện Y" |
| U8.9 | Inbox notification (xem tất cả) | 🔴 MVP | Trang dedicated, mark as read |
| U8.10 | Cài đặt noti theo loại | 🔴 MVP | Bật/tắt từng loại trong settings |
| U8.11 | Giờ im lặng (quiet hours) | 🟡 Nice | VD 22h-7h không push |
| U8.12 | Daily summary noti | ⚪ v2 | Gộp các noti nhỏ thành 1 daily summary |

### 4.9 Safety & Privacy

| # | Feature | Priority | Mô tả chi tiết |
|---|---------|----------|----------------|
| U9.1 | Report user | 🔴 MVP | Lý do: spam / harassment / fake / inappropriate / other |
| U9.2 | Report post/message/event | 🔴 MVP | Tương tự, dùng chung bảng `reports` với `target_type` |
| U9.3 | Block user | 🔴 MVP | RLS tự ẩn 2 chiều khỏi nhau |
| U9.4 | Danh sách user đã block | 🔴 MVP | Trong settings, có thể unblock |
| U9.5 | Ẩn profile tạm thời | 🔴 MVP | `is_active=false`, không hiện trong discover |
| U9.6 | Chế độ ẩn danh (incognito) | ⚪ v2 | Chỉ người mình đã like thấy mình trong discover |
| U9.7 | Privacy: ẩn tuổi/khoảng cách | 🟡 Nice | Per-field privacy |
| U9.8 | Export dữ liệu (GDPR-style) | 🟡 Nice | Download JSON tất cả data của mình |

### 4.10 Settings

| # | Feature | Priority | Mô tả chi tiết |
|---|---------|----------|----------------|
| U10.1 | Đổi mật khẩu | 🔴 MVP | Yêu cầu nhập mật khẩu cũ |
| U10.2 | Đổi email | 🔴 MVP | Verify email mới trước khi đổi |
| U10.3 | Dark mode toggle | 🔴 MVP | Auto theo system / Light / Dark |
| U10.4 | Ngôn ngữ | 🟡 Nice | Tiếng Việt / English (i18n) |
| U10.5 | Quản lý devices đã đăng nhập | 🟡 Nice | Xem session, logout từ xa |

---

## 5. MODERATOR Features

| # | Feature | Priority | Mô tả chi tiết |
|---|---------|----------|----------------|
| M1.1 | Đăng nhập dashboard riêng | 🔴 MVP | Route `/admin/*`, yêu cầu role=moderator hoặc admin |
| M1.2 | Xem danh sách reports pending | 🔴 MVP | Sort: mới nhất, lọc theo target_type |
| M1.3 | Xem chi tiết report | 🔴 MVP | Reporter, target, lý do, context (tin nhắn/post/event đính kèm) |
| M1.4 | Duyệt report — Approve | 🔴 MVP | Action: cảnh cáo / xóa nội dung / khóa tạm thời |
| M1.5 | Duyệt report — Dismiss | 🔴 MVP | Bỏ qua report (không vi phạm) |
| M1.6 | Cảnh cáo user | 🔴 MVP | Gửi noti cảnh cáo, log vào `audit_logs` |
| M1.7 | Khóa tài khoản tạm thời | 🔴 MVP | 1-7 ngày, user không đăng nhập được, có message lý do |
| M1.8 | Xóa bài đăng vi phạm | 🔴 MVP | Soft delete + reason |
| M1.9 | Xóa ảnh profile không phù hợp | 🔴 MVP | Remove ảnh khỏi `profile_photos` |
| M1.10 | Xem flagged messages (từ bộ lọc tự động) | 🔴 MVP | Tin nhắn dính từ `banned_words` |
| M1.11 | Quản lý banned_words | 🔴 MVP | CRUD: thêm/xóa/sửa từ cấm, set severity |
| M1.12 | Duyệt sự kiện (nếu admin bật) | 🟡 Nice | Sự kiện đợi duyệt mới public |
| M1.13 | Lịch sử action của bản thân | 🔴 MVP | Tab "Lịch sử xử lý", filter theo loại |

> **Lưu ý quan trọng**: Moderator KHÔNG được phép xem tin nhắn riêng tư 1-1 trừ khi tin nhắn đó được User chủ động report. Chỉ thấy tin nhắn flagged tự động bởi banned_words filter và tin nhắn nằm trong context của report.

---

## 6. ADMIN Features

| # | Feature | Priority | Mô tả chi tiết |
|---|---------|----------|----------------|
| A1.1 | Dashboard thống kê tổng quan | 🔴 MVP | DAU/MAU, total users, matches/day, messages/day, events/week |
| A1.2 | 2FA bắt buộc | 🔴 MVP | TOTP, không vào dashboard nếu chưa setup |
| A1.3 | Xem danh sách toàn bộ user | 🔴 MVP | Search by name/email, filter by status |
| A1.4 | Xem chi tiết 1 user | 🔴 MVP | Profile + lịch sử swipe/match/post/event/report |
| A1.5 | Khóa / mở khóa user vĩnh viễn | 🔴 MVP | Khác mod (mod chỉ khóa tạm thời) |
| A1.6 | Xóa user vĩnh viễn | 🔴 MVP | Confirm 2 lần, ghi `audit_logs` |
| A1.7 | Phân quyền Moderator | 🔴 MVP | Promote user → mod, demote mod → user |
| A1.8 | Quản lý tất cả Moderators | 🔴 MVP | List, xem hiệu suất xử lý report |
| A1.9 | Quản lý sự kiện (CRUD all events) | 🔴 MVP | Override quyền owner |
| A1.10 | Quản lý quảng cáo (banner ads) | 🔴 MVP | CRUD ads, lên lịch chạy, theo dõi impression/click |
| A1.11 | Cấu hình system | 🔴 MVP | Boost duration, rate limits, max images per profile |
| A1.12 | Cấu hình banned_words mặc định | 🔴 MVP | Initial seed list |
| A1.13 | Báo cáo phân tích | 🟡 Nice | Xuất Excel: user growth, top events, top reporters |
| A1.14 | Xem audit_logs | 🔴 MVP | Full action log của Admin + Mod, filter & search |
| A1.15 | Broadcast announcement | 🟡 Nice | Gửi noti tới tất cả/nhóm user (vd "Sự kiện hot tuần này") |
| A1.16 | Quản lý ToS / Privacy version | 🔴 MVP | Cập nhật version, user phải đồng ý lại |

---

## 7. Production-grade Requirements

Các yêu cầu kỹ thuật bắt buộc để app chạy production (không phải feature user-facing):

### 7.1 Observability

- **Sentry** integration cho cả web và mobile — capture errors, performance traces
- **PostHog** analytics — track events: signup, swipe, match, message_sent, post_created
- **Supabase logs** — query performance, slow queries alert

### 7.2 Security

- **Row Level Security (RLS)** trên TẤT CẢ bảng (chi tiết policy trong file 02)
- **Rate limiting** với Upstash Redis:
  - Swipe: 100/giờ/user
  - Message: 30/phút/user
  - Post: 10/ngày/user
  - Login attempts: 5/15 phút/IP
- **CAPTCHA** sau 3 lần đăng nhập sai
- **2FA** cho Admin
- **Input sanitization** chống XSS trong bio, post caption, comment

### 7.3 Data Protection

- **Backup database** weekly qua GitHub Action (`pg_dump` → Google Drive/S3)
- **Soft delete** mọi bảng có user data (cột `deleted_at`)
- **Hard delete** sau 30 ngày qua `pg_cron` job
- **User consent log** cho ToS và Privacy

### 7.4 Performance

- **Geohash indexing** cho location queries (precision 6 ≈ 1.2km)
- **Composite indexes** trên các query hot:
  - `messages(match_id, created_at DESC)`
  - `swipes(swiper_id, target_id)` UNIQUE
  - `posts(user_id, created_at DESC)`
- **Partition** bảng `messages` theo tháng
- **CDN image transform** — Supabase serve ảnh đã resize cho thumbnail
- **Pagination** bắt buộc cho mọi list endpoint (max 50 items/page)

### 7.5 Compliance

- **Terms of Service** + **Privacy Policy** version control
- **Audit log** cho mọi action của Admin/Moderator
- **GDPR-style data export** (user download data của mình)
- **Account deletion** thực sự xóa data sau 30 ngày

### 7.6 DevOps

- **Database migrations** version control qua Supabase CLI
- **E2E tests** Flutter `integration_test` cho 3 luồng chính:
  1. Register → onboarding → swipe → match → chat
  2. Create event → check-in → event swipe → group chat
  3. Create post → like → comment → report
- **CI/CD** GitHub Actions:
  - `dart analyze` + `flutter test` trên mỗi PR
  - Auto deploy Web build lên Vercel/Netlify/Cloudflare Pages khi merge main (Flutter Web build ra static files, host được mọi nơi)
  - `flutter build apk` cho Android khi tag release
  - `flutter build ipa` cho iOS qua Codemagic/Github Actions runner Mac (cần Apple Dev Account)

---

## 8. Tổng kết Số liệu

| Phân loại | MVP (🔴) | Nice (🟡) | v2 (⚪) | Tổng |
|-----------|---------|----------|--------|------|
| User features | 75 | 18 | 7 | 100 |
| Moderator | 12 | 1 | 0 | 13 |
| Admin | 14 | 2 | 0 | 16 |
| **Tổng** | **101** | **21** | **7** | **129** |

**So sánh với Tinder:**
- Tinder Free có 11 tính năng core
- Tinder Platinum đầy đủ 23 tính năng
- UniDate MVP có **101 tính năng** — gấp ~4x Tinder Platinum vì có thêm Feed + Events + Admin/Mod system

---

## 9. Phân chia thành Sprints (gợi ý 3 tháng, 6 sprints × 2 tuần)

### Sprint 1 (Tuần 1-2): Foundation
- Setup Flutter project + dependencies (Riverpod, GoRouter, Supabase)
- Setup Supabase project + schema cơ bản (profiles, photos)
- Setup Firebase project (cho FCM push notifications)
- Auth flow (register, login, Google OAuth, forgot password)
- Onboarding wizard 5 bước
- Basic profile CRUD
- Setup code generation (`build_runner` cho Freezed, Riverpod, GoRouter)

### Sprint 2 (Tuần 3-4): Discovery
- Geohash setup + indexes
- Swipe deck UI (animation với `card_swiper` package hoặc custom với `AnimatedBuilder` + `Transform.rotate`)
- Swipe logic + match trigger
- Filter system
- See Who Liked You
- Lịch sử swipe + undo

### Sprint 3 (Tuần 5-6): Chat & Match
- Match list UI
- Chat 1-1 DB-first: insert `messages`, realtime qua `postgres_changes`; Broadcast chỉ dùng cho typing
- Typing indicator + seen indicator
- Presence (online/offline)
- Notifications system (bảng + UI inbox)
- Push notifications (FCM — Firebase Cloud Messaging cho cả 3 platform)

### Sprint 4 (Tuần 7-8): Social Feed
- Posts CRUD (text + image)
- Feed timeline
- Like + Comment
- Story 24h
- Feed notifications (like, comment)
- Profile page với feed

### Sprint 5 (Tuần 9-10): Events
- Events CRUD
- Map picker + GPS check-in
- Event attendees list
- Event swipe mode
- Event group chat
- Event notifications

### Sprint 6 (Tuần 11-12): Admin + Production
- Moderator dashboard
- Admin dashboard + analytics
- Audit log + 2FA
- Rate limiting + Sentry + PostHog
- E2E tests (integration_test trên Flutter)
- Platform polish — test kỹ trên iOS + Android + Web, fix UI khác biệt
- Build APK/IPA, deploy Web
- Final testing & deploy

---

## 10. Notes cho AI Agent (Claude Code, Cursor...)

Khi triển khai feature, agent nên tuân thủ:

1. **Đọc file 02 (database schema) trước** khi viết bất kỳ query nào
2. **Đọc file 03 (repo structure) trước** khi tạo file mới
3. **Mọi query database** đặt trong `lib/data/repositories/` để tách khỏi UI
4. **Mọi widget UI** dùng được nhiều nơi nên đặt trong `lib/shared/widgets/`
5. **RLS policy** phải viết SQL migration cùng lúc với tạo bảng
6. **Dart code generation**: chạy `dart run build_runner build --delete-conflicting-outputs` sau khi đổi Riverpod providers, Freezed models, hoặc GoRouter routes
7. **Mỗi feature** phải có ít nhất 1 widget test (`flutter test`)
8. **Commit message** theo convention: `feat(swipe): add undo button`
9. **PR description** liên kết tới feature ID (vd "Closes U3.5")
10. **Không commit secrets** — dùng `.env.json` với `--dart-define-from-file`, KHÔNG commit `.env.json` lên git
