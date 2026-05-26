# UniDate — Database Schema Specification

> **Database**: PostgreSQL 15+ qua Supabase
> **ORM**: Supabase JS client (`@supabase/supabase-js`, `@supabase/ssr`)
> **Extensions cần bật**: `pgcrypto`, `pg_cron`, `pg_trgm`
> **Last updated**: 2026-05-24

---

## 0. Quy ước chung

### Conventions
- **Primary key**: `uuid` với `DEFAULT gen_random_uuid()` (trừ bảng `profiles` dùng `id` = `auth.users.id`)
- **Timestamps**: `timestamptz` (timezone-aware), `DEFAULT now()`
- **Soft delete**: 2 pattern khác nhau, tùy bảng:
  - Pattern A — `deleted_at timestamptz` nullable: dùng cho bảng có user data đơn giản (profiles, posts, comments, events). Khi xóa: SET `deleted_at = now()`.
  - Pattern B — `is_active boolean` + metadata cột: dùng khi cần lưu thông tin về việc deactivate (matches lưu `unmatched_by`/`unmatched_at`, ads lưu schedule). KHÔNG dùng `deleted_at` ở các bảng này.
- **Naming**: bảng snake_case số nhiều (`profiles`, `swipes`, `event_attendees`)
- **Foreign keys**: luôn có `ON DELETE CASCADE` hoặc `ON DELETE SET NULL` rõ ràng
- **Enums**: dùng `text` + `CHECK constraint` (dễ thêm value, không phải migrate type)
- **Trigger functions**: tất cả function được trigger gọi mà cần ghi vào bảng khác (notifications, activities) phải dùng `SECURITY DEFINER` để bypass RLS

### Extensions
```sql
CREATE EXTENSION IF NOT EXISTS pgcrypto;     -- gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS pg_cron;      -- scheduled jobs
CREATE EXTENSION IF NOT EXISTS pg_trgm;      -- text search trigram
```

### Geohash strategy
- KHÔNG dùng PostGIS (overkill cho dating app)
- Dùng thư viện `dart_geohash` ở app layer (Flutter) encode lat/lng → geohash string
- **Query nearby users**: lấy `dart_geohash` tính 9 cells (current + 8 neighbors) → query `WHERE geohash_6 IN (...)`. KHÔNG dùng `WHERE geohash_6 LIKE 'w3gv5%'` vì sót user sát ranh giới cell khác.
- Lưu 2 precision trong DB để filter nhanh:
  - `geohash_6` (~1.2km × 0.6km) — filter chính cho swipe theo khoảng cách
  - `geohash_4` (~20km × 20km) — filter rộng cho "trong tỉnh"
- B-tree index trên cả 2 cột → query `WHERE geohash_6 LIKE 'w3gv5%'` cực nhanh

---

## 1. Sơ đồ tổng thể (25 bảng)

```
┌─ AUTH & PROFILE (5 bảng) ─────────┐
│ profiles                          │
│ profile_photos                    │
│ profile_prompts                   │
│ user_consents                     │
│ push_tokens                       │
└───────────────────────────────────┘

┌─ MATCHING & CHAT (4 bảng) ────────┐
│ swipes                            │
│ matches                           │
│ messages (partitioned)            │
│ profile_views                     │
└───────────────────────────────────┘

┌─ SOCIAL FEED (3 bảng) ────────────┐
│ posts                             │
│ comments                          │
│ post_likes                        │
└───────────────────────────────────┘

┌─ EVENTS (3 bảng) ─────────────────┐
│ events                            │
│ event_attendees                   │
│ event_messages                    │
└───────────────────────────────────┘

┌─ NOTIFICATIONS (2 bảng) ──────────┐
│ notifications                     │
│ notification_preferences          │
└───────────────────────────────────┘

┌─ SAFETY & MODERATION (4 bảng) ────┐
│ blocks                            │
│ reports                           │
│ banned_words                      │
│ flagged_content                   │
└───────────────────────────────────┘

┌─ ADMIN (4 bảng) ──────────────────┐
│ ads                               │
│ audit_logs                        │
│ activities                        │
│ app_config                        │
└───────────────────────────────────┘
```

**Tổng: 25 bảng** (đã bổ sung từ review production-grade).

### Sơ đồ liên kết (FK relationships)

```
auth.users (Supabase managed)
    ↓ (1:1, id = id)
profiles ◄────────────────────────────────┐
    ↓ (1:N)                               │
    ├── profile_photos                    │
    ├── profile_prompts                   │
    ├── user_consents                     │
    ├── push_tokens                       │
    ├── notification_preferences (1:1)    │
    ├── swipes (swiper_id, target_id)─────┤
    ├── matches (user_a_id, user_b_id)────┤
    │       ↓                             │
    │       messages (sender_id)──────────┤
    ├── profile_views (viewer/viewed)─────┤
    ├── posts ─→ comments, post_likes ────┤
    ├── events (creator_id)               │
    │       ↓                             │
    │       event_attendees ──────────────┤
    │       event_messages (sender_id)────┤
    ├── notifications (user_id, actor_id)─┤
    ├── blocks (blocker, blocked)─────────┤
    ├── reports (reporter, target_user)───┤
    ├── flagged_content                   │
    ├── ads (created_by)                  │
    ├── audit_logs (actor_id)             │
    └── activities ───────────────────────┘

events ────┬──→ swipes.event_id (event swipe)
           ├──→ matches.event_id (event match)
           ├──→ event_attendees
           └──→ event_messages
```

---

## 2. AUTH & PROFILE

### 2.1 `profiles`
Mở rộng từ `auth.users` của Supabase. Mỗi user 1 row.

```sql
CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Basic info
  display_name text NOT NULL CHECK (char_length(display_name) BETWEEN 2 AND 50),
  bio text CHECK (char_length(bio) <= 500),
  birth_date date NOT NULL CHECK (birth_date <= now() - interval '18 years'),
  gender text NOT NULL CHECK (gender IN ('male', 'female', 'non_binary', 'other')),
  interested_in text[] NOT NULL DEFAULT '{}', -- mảng các giá trị gender muốn gặp

  -- Student info (USP của app)
  university text NOT NULL,
  major text,
  year_of_study smallint CHECK (year_of_study BETWEEN 1 AND 8),

  -- Interests & social
  interests text[] NOT NULL DEFAULT '{}' CHECK (array_length(interests, 1) <= 10),
  social_links jsonb DEFAULT '{}'::jsonb, -- {instagram: "...", facebook: "...", tiktok: "..."}

  -- Location (geohash strategy)
  lat double precision,
  lng double precision,
  geohash_6 text,  -- ~1.2km precision, dùng cho swipe filter
  geohash_4 text,  -- ~20km precision, dùng cho "trong tỉnh"
  location_updated_at timestamptz,

  -- Role & status
  role text NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'moderator', 'admin')),
  is_active boolean NOT NULL DEFAULT true,
  is_verified boolean NOT NULL DEFAULT false, -- selfie verified blue tick
  is_banned boolean NOT NULL DEFAULT false,
  banned_until timestamptz, -- null nếu ban vĩnh viễn
  ban_reason text,

  -- Boost
  boost_expires_at timestamptz,

  -- Activity
  last_active_at timestamptz NOT NULL DEFAULT now(),

  -- Preferences (cached, có thể override khi swipe)
  filter_min_age smallint DEFAULT 18 CHECK (filter_min_age >= 18),
  filter_max_age smallint DEFAULT 30 CHECK (filter_max_age <= 100),
  filter_max_distance_km smallint DEFAULT 50,
  filter_same_university boolean DEFAULT false,

  -- Privacy
  show_age boolean DEFAULT true,
  show_distance boolean DEFAULT true,
  incognito_mode boolean DEFAULT false, -- v2

  -- Timestamps
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  deleted_at timestamptz, -- soft delete

  CHECK (filter_min_age <= filter_max_age)
);

-- Indexes
CREATE INDEX idx_profiles_geohash_6 ON profiles(geohash_6) WHERE deleted_at IS NULL AND is_active = true;
CREATE INDEX idx_profiles_geohash_4 ON profiles(geohash_4) WHERE deleted_at IS NULL AND is_active = true;
CREATE INDEX idx_profiles_university ON profiles(university) WHERE deleted_at IS NULL;
CREATE INDEX idx_profiles_last_active ON profiles(last_active_at DESC) WHERE is_active = true;
CREATE INDEX idx_profiles_role ON profiles(role) WHERE role != 'user';
-- Index thường, không partial (vì now() KHÔNG IMMUTABLE, không dùng được trong predicate)
-- Query có filter `WHERE boost_expires_at > now()` ở application layer
CREATE INDEX idx_profiles_boost ON profiles(boost_expires_at) WHERE boost_expires_at IS NOT NULL;

-- Updated_at trigger (xem section 9)
CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
```

### 2.2 `profile_photos`
Tách riêng vì user có nhiều ảnh và cần kéo thả sắp xếp.

```sql
CREATE TABLE profile_photos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  url text NOT NULL,                    -- Supabase Storage URL
  storage_path text NOT NULL,           -- để xóa file khi xóa row
  display_order smallint NOT NULL DEFAULT 0,
  width int,
  height int,
  created_at timestamptz NOT NULL DEFAULT now(),

  CHECK (display_order BETWEEN 0 AND 5)  -- max 6 ảnh
);

CREATE INDEX idx_profile_photos_user ON profile_photos(user_id, display_order);
CREATE UNIQUE INDEX uq_profile_photos_order ON profile_photos(user_id, display_order);
```

### 2.3 `profile_prompts` (🟡 Nice - feature U2.8)
Câu hỏi profile kiểu Hinge.

```sql
CREATE TABLE profile_prompts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  prompt_key text NOT NULL,             -- vd: 'favorite_book', 'weekend_activity'
  answer text NOT NULL CHECK (char_length(answer) <= 200),
  display_order smallint NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),

  CHECK (display_order BETWEEN 0 AND 2) -- max 3 prompts
);

CREATE INDEX idx_profile_prompts_user ON profile_prompts(user_id, display_order);
```

### 2.4 `user_consents`
Track user đã đồng ý ToS / Privacy version nào.

```sql
CREATE TABLE user_consents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  consent_type text NOT NULL CHECK (consent_type IN ('terms', 'privacy', 'marketing')),
  version text NOT NULL,                -- vd: '1.0.0'
  accepted_at timestamptz NOT NULL DEFAULT now(),
  ip_address inet,
  user_agent text
);

CREATE INDEX idx_user_consents_user ON user_consents(user_id, consent_type);
```

### 2.5 `push_tokens`
Lưu FCM (Firebase Cloud Messaging) push token cho mobile + web notifications.

```sql
CREATE TABLE push_tokens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  token text NOT NULL,
  platform text NOT NULL CHECK (platform IN ('ios', 'android', 'web')),
  device_id text,
  created_at timestamptz NOT NULL DEFAULT now(),
  last_used_at timestamptz NOT NULL DEFAULT now(),

  UNIQUE(user_id, token)
);

CREATE INDEX idx_push_tokens_user ON push_tokens(user_id);
```

---

## 3. MATCHING & CHAT

### 3.1 `swipes`
Mọi swipe đều lưu để: detect match, hiển thị "ai đã like mình", chống swipe trùng.

```sql
CREATE TABLE swipes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  swiper_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  target_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  direction text NOT NULL CHECK (direction IN ('like', 'pass', 'super_like')),
  event_id uuid, -- FK tới events(id), sẽ ALTER TABLE thêm sau khi events được tạo (xem section 14)
  is_undone boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),

  CHECK (swiper_id != target_id)
);

-- Unique: 1 user không swipe 2 lần cùng target (trừ khi đã undo)
-- NULLS NOT DISTINCT bắt buộc — nếu không, PostgreSQL coi NULL != NULL,
-- user có thể swipe trùng cùng target khi event_id IS NULL (swipe thường)
-- Yêu cầu: PostgreSQL 15+ (Supabase dùng PG 15+ OK)
CREATE UNIQUE INDEX uq_swipes_active ON swipes(swiper_id, target_id, event_id)
  NULLS NOT DISTINCT
  WHERE is_undone = false;

-- Query "ai đã like mình"
CREATE INDEX idx_swipes_target_like ON swipes(target_id, direction)
  WHERE direction IN ('like', 'super_like') AND is_undone = false;

-- Query lịch sử swipe của 1 user
CREATE INDEX idx_swipes_swiper_recent ON swipes(swiper_id, created_at DESC)
  WHERE is_undone = false;
```

### 3.2 `matches`
Tạo tự động khi 2 user like nhau qua TRIGGER.

```sql
CREATE TABLE matches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_a_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  user_b_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  event_id uuid, -- FK tới events(id), sẽ ALTER TABLE thêm sau (xem section 14)
  matched_at timestamptz NOT NULL DEFAULT now(),
  is_active boolean NOT NULL DEFAULT true,
  unmatched_by uuid REFERENCES profiles(id) ON DELETE SET NULL,
  unmatched_at timestamptz,
  last_message_at timestamptz,          -- cache để sort match list

  -- Đảm bảo user_a_id < user_b_id (unique pair)
  CHECK (user_a_id < user_b_id)
);

CREATE UNIQUE INDEX uq_matches_pair ON matches(user_a_id, user_b_id);
-- Note: Unique theo (user_a_id, user_b_id) — 2 user chỉ có 1 match row.
-- Nếu user đã match thường rồi gặp lại trong event swipe: trigger sẽ ON CONFLICT DO NOTHING,
-- KHÔNG tạo match mới (UX hợp lý: 1 cặp = 1 conversation). Xem trigger ở section 9.

CREATE INDEX idx_matches_user_a ON matches(user_a_id, last_message_at DESC NULLS LAST)
  WHERE is_active = true;
CREATE INDEX idx_matches_user_b ON matches(user_b_id, last_message_at DESC NULLS LAST)
  WHERE is_active = true;
```

### 3.3 `messages`
**Partition theo tháng** để scale tốt (xem section 10).

```sql
CREATE TABLE messages (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  match_id uuid NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
  sender_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content text,                         -- null nếu là image-only
  message_type text NOT NULL DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'emoji', 'system')),
  image_url text,
  is_read boolean NOT NULL DEFAULT false,
  read_at timestamptz,
  is_deleted boolean NOT NULL DEFAULT false,
  is_flagged boolean NOT NULL DEFAULT false, -- bị banned_words filter
  created_at timestamptz NOT NULL DEFAULT now(),

  PRIMARY KEY (id, created_at) -- composite vì partition theo created_at
) PARTITION BY RANGE (created_at);

-- Tạo partition theo tháng (xem section 10 cho automation)
CREATE TABLE messages_2026_05 PARTITION OF messages
  FOR VALUES FROM ('2026-05-01') TO ('2026-06-01');
CREATE TABLE messages_2026_06 PARTITION OF messages
  FOR VALUES FROM ('2026-06-01') TO ('2026-07-01');
-- ... tự động tạo qua pg_cron

-- Composite index hot path: load chat history
CREATE INDEX idx_messages_match_time ON messages(match_id, created_at DESC);
CREATE INDEX idx_messages_unread ON messages(match_id, sender_id, is_read) WHERE is_read = false;
```

### 3.4 `profile_views`
Track ai xem profile mình.

```sql
CREATE TABLE profile_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  viewer_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  viewed_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  viewed_at timestamptz NOT NULL DEFAULT now(),

  CHECK (viewer_id != viewed_id)
);

-- Chỉ giữ 1 view gần nhất mỗi cặp (UPSERT khi insert)
CREATE UNIQUE INDEX uq_profile_views_pair ON profile_views(viewer_id, viewed_id);
CREATE INDEX idx_profile_views_viewed ON profile_views(viewed_id, viewed_at DESC);
```

---

## 4. SOCIAL FEED

### 4.1 `posts`

```sql
CREATE TABLE posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  caption text CHECK (char_length(caption) <= 2000),
  images text[] DEFAULT '{}',           -- mảng URL Supabase Storage
  post_type text NOT NULL DEFAULT 'post' CHECK (post_type IN ('post', 'thread', 'story')),
  is_public boolean NOT NULL DEFAULT true, -- false = chỉ match thấy
  likes_count int NOT NULL DEFAULT 0,   -- cached counter
  comments_count int NOT NULL DEFAULT 0, -- cached counter
  expires_at timestamptz,               -- null = không hết hạn; story = +24h
  is_deleted boolean NOT NULL DEFAULT false,
  deleted_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),

  -- Thread không có ảnh, post phải có content hoặc ảnh
  CHECK (
    (post_type = 'thread' AND array_length(images, 1) IS NULL AND caption IS NOT NULL)
    OR (post_type IN ('post', 'story') AND (caption IS NOT NULL OR array_length(images, 1) > 0))
  )
);

-- Index cho feed query. Filter `expires_at > now()` ở application layer
-- (PostgreSQL không cho dùng now() trong index predicate vì nó STABLE không IMMUTABLE)
CREATE INDEX idx_posts_feed ON posts(created_at DESC)
  WHERE is_deleted = false AND is_public = true;
CREATE INDEX idx_posts_user ON posts(user_id, created_at DESC) WHERE is_deleted = false;
CREATE INDEX idx_posts_expiring ON posts(expires_at) WHERE expires_at IS NOT NULL;

CREATE TRIGGER posts_updated_at BEFORE UPDATE ON posts
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
```

### 4.2 `comments`

```sql
CREATE TABLE comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  parent_id uuid REFERENCES comments(id) ON DELETE CASCADE, -- nested reply 1 level
  content text NOT NULL CHECK (char_length(content) BETWEEN 1 AND 500),
  is_deleted boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_comments_post ON comments(post_id, created_at) WHERE is_deleted = false;
CREATE INDEX idx_comments_parent ON comments(parent_id) WHERE parent_id IS NOT NULL;
```

### 4.3 `post_likes`

```sql
CREATE TABLE post_likes (
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  post_id uuid NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),

  PRIMARY KEY (user_id, post_id)
);

CREATE INDEX idx_post_likes_post ON post_likes(post_id, created_at DESC);
```

---

## 5. EVENTS

### 5.1 `events`

```sql
CREATE TABLE events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,

  -- Basic info
  title text NOT NULL CHECK (char_length(title) BETWEEN 5 AND 100),
  description text CHECK (char_length(description) <= 2000),
  event_type text NOT NULL CHECK (event_type IN ('dating_group', 'student_activity')),
  cover_image text,

  -- Location
  location_name text NOT NULL,
  address text,
  lat double precision NOT NULL,
  lng double precision NOT NULL,
  geohash_6 text NOT NULL,
  checkin_radius_m int NOT NULL DEFAULT 200 CHECK (checkin_radius_m BETWEEN 50 AND 2000),

  -- Time
  starts_at timestamptz NOT NULL,
  ends_at timestamptz NOT NULL,

  -- Limits & filters
  max_attendees int CHECK (max_attendees IS NULL OR max_attendees BETWEEN 2 AND 1000),
  university_filter text,               -- null = open all, value = chỉ trường đó
  min_age smallint DEFAULT 18,
  max_age smallint,

  -- Features
  allow_swipe boolean NOT NULL DEFAULT true,
  allow_group_chat boolean NOT NULL DEFAULT true,

  -- Status
  status text NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'pending_review', 'published', 'cancelled', 'ended')),
  is_deleted boolean NOT NULL DEFAULT false,

  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),

  CHECK (ends_at > starts_at),
  CHECK (max_age IS NULL OR max_age >= min_age)
);

-- Indexes cho events. Filter `ends_at > now()` ở application layer
CREATE INDEX idx_events_upcoming ON events(starts_at)
  WHERE status = 'published' AND is_deleted = false;
CREATE INDEX idx_events_geohash ON events(geohash_6)
  WHERE status = 'published';
CREATE INDEX idx_events_creator ON events(creator_id, created_at DESC);
CREATE INDEX idx_events_university ON events(university_filter) WHERE university_filter IS NOT NULL;

CREATE TRIGGER events_updated_at BEFORE UPDATE ON events
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
```

### 5.2 `event_attendees`

```sql
CREATE TABLE event_attendees (
  event_id uuid NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'registered' CHECK (status IN ('registered', 'checked_in', 'left', 'cancelled')),
  joined_at timestamptz NOT NULL DEFAULT now(),
  checked_in_at timestamptz,
  checkin_lat double precision,
  checkin_lng double precision,
  left_at timestamptz,

  PRIMARY KEY (event_id, user_id)
);

CREATE INDEX idx_event_attendees_user ON event_attendees(user_id, joined_at DESC);
CREATE INDEX idx_event_attendees_checked_in ON event_attendees(event_id, status)
  WHERE status = 'checked_in';
```

### 5.3 `event_messages`
Group chat sự kiện. Tự xóa sau 24h kết thúc event qua pg_cron.

```sql
CREATE TABLE event_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  sender_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content text NOT NULL CHECK (char_length(content) BETWEEN 1 AND 1000),
  is_flagged boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_event_messages_event ON event_messages(event_id, created_at DESC);
```

---

## 6. NOTIFICATIONS

### 6.1 `notifications`

```sql
CREATE TABLE notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN (
    'match', 'message', 'super_like', 'post_like', 'comment', 'comment_reply',
    'event_reminder', 'event_checkin_buddy', 'system', 'moderation'
  )),
  title text NOT NULL,
  body text,
  ref_type text,                        -- 'match', 'post', 'event', 'message'
  ref_id uuid,                          -- ID của object liên quan
  actor_id uuid REFERENCES profiles(id) ON DELETE SET NULL, -- ai gây ra noti
  is_read boolean NOT NULL DEFAULT false,
  read_at timestamptz,
  metadata jsonb DEFAULT '{}'::jsonb,   -- data thêm: count gộp, preview text...
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_notifications_user ON notifications(user_id, created_at DESC);
CREATE INDEX idx_notifications_unread ON notifications(user_id) WHERE is_read = false;
```

### 6.2 `notification_preferences`

```sql
CREATE TABLE notification_preferences (
  user_id uuid PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,

  -- Push notification toggles
  push_match boolean NOT NULL DEFAULT true,
  push_message boolean NOT NULL DEFAULT true,
  push_super_like boolean NOT NULL DEFAULT true,
  push_post_like boolean NOT NULL DEFAULT true,
  push_comment boolean NOT NULL DEFAULT true,
  push_event_reminder boolean NOT NULL DEFAULT true,
  push_marketing boolean NOT NULL DEFAULT false,

  -- Quiet hours (giờ địa phương)
  quiet_hours_enabled boolean NOT NULL DEFAULT false,
  quiet_hours_start time,               -- vd 22:00
  quiet_hours_end time,                 -- vd 07:00
  timezone text DEFAULT 'Asia/Ho_Chi_Minh',

  updated_at timestamptz NOT NULL DEFAULT now()
);
```

---

## 7. SAFETY & MODERATION

### 7.1 `blocks`

```sql
CREATE TABLE blocks (
  blocker_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  blocked_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  reason text,
  created_at timestamptz NOT NULL DEFAULT now(),

  PRIMARY KEY (blocker_id, blocked_id),
  CHECK (blocker_id != blocked_id)
);

CREATE INDEX idx_blocks_blocked ON blocks(blocked_id);
```

### 7.2 `reports`

```sql
CREATE TABLE reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  -- reporter_id nullable: khi user report rồi xóa tài khoản, report vẫn giữ để mod xử lý
  -- (KHÔNG dùng NOT NULL vì conflict với ON DELETE SET NULL)
  reporter_id uuid REFERENCES profiles(id) ON DELETE SET NULL,

  -- Target
  target_type text NOT NULL CHECK (target_type IN ('user', 'post', 'comment', 'message', 'event', 'event_message')),
  target_id uuid NOT NULL,              -- không có FK vì target_type khác nhau
  target_user_id uuid REFERENCES profiles(id) ON DELETE CASCADE, -- user bị ảnh hưởng (chủ của content)

  -- Report content
  reason text NOT NULL CHECK (reason IN ('spam', 'harassment', 'fake_profile', 'inappropriate_content', 'underage', 'violence', 'other')),
  detail text CHECK (char_length(detail) <= 1000),
  evidence jsonb DEFAULT '{}'::jsonb,   -- screenshots URLs, message context...

  -- Resolution
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'investigating', 'resolved', 'dismissed')),
  resolved_by uuid REFERENCES profiles(id) ON DELETE SET NULL,
  resolved_at timestamptz,
  resolution_action text,               -- 'warning', 'content_removed', 'user_banned_temp', 'user_banned_perm', 'dismissed'
  resolution_note text,

  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_reports_pending ON reports(status, created_at) WHERE status = 'pending';
CREATE INDEX idx_reports_target_user ON reports(target_user_id, created_at DESC);
CREATE INDEX idx_reports_reporter ON reports(reporter_id, created_at DESC);
```

### 7.3 `banned_words`

```sql
CREATE TABLE banned_words (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  word text NOT NULL UNIQUE,            -- normalized lowercase, no diacritics
  severity text NOT NULL DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high')),
  -- low = warn user, medium = block message, high = block + flag for review
  action text NOT NULL DEFAULT 'block' CHECK (action IN ('warn', 'block', 'block_and_flag')),
  language text DEFAULT 'vi',
  created_by uuid REFERENCES profiles(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_banned_words_severity ON banned_words(severity);
```

### 7.4 `flagged_content`
Log content bị banned_words filter chặn, để mod review.

```sql
CREATE TABLE flagged_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content_type text NOT NULL CHECK (content_type IN ('message', 'event_message', 'post', 'comment', 'bio')),
  content_id uuid NOT NULL,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  matched_words text[] NOT NULL,
  severity text NOT NULL,
  action_taken text NOT NULL,           -- 'warned', 'blocked'
  reviewed boolean NOT NULL DEFAULT false,
  reviewed_by uuid REFERENCES profiles(id) ON DELETE SET NULL,
  reviewed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_flagged_unreviewed ON flagged_content(created_at DESC) WHERE reviewed = false;
CREATE INDEX idx_flagged_user ON flagged_content(user_id, created_at DESC);
```

---

## 8. ADMIN

### 8.1 `ads`

```sql
CREATE TABLE ads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  -- created_by nullable: khi admin tạo ad rồi xóa tài khoản, ad vẫn còn lịch sử
  created_by uuid REFERENCES profiles(id) ON DELETE SET NULL,

  title text NOT NULL,
  description text,
  image_url text NOT NULL,
  link_url text NOT NULL,
  cta_text text DEFAULT 'Learn more',

  placement text NOT NULL CHECK (placement IN ('feed', 'discover', 'event_list', 'match_list')),
  -- Targeting
  target_universities text[],           -- null = all
  target_min_age smallint,
  target_max_age smallint,
  target_gender text[],

  -- Schedule
  starts_at timestamptz NOT NULL,
  ends_at timestamptz NOT NULL,
  is_active boolean NOT NULL DEFAULT true,

  -- Stats (incremented qua trigger)
  impression_count int NOT NULL DEFAULT 0,
  click_count int NOT NULL DEFAULT 0,

  created_at timestamptz NOT NULL DEFAULT now(),

  CHECK (ends_at > starts_at)
);

CREATE INDEX idx_ads_active ON ads(placement, starts_at, ends_at)
  WHERE is_active = true;
```

### 8.2 `audit_logs`
Mọi action của Admin/Mod đều phải log.

```sql
CREATE TABLE audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  actor_role text NOT NULL,             -- 'admin', 'moderator'
  action text NOT NULL,                 -- 'ban_user', 'delete_post', 'resolve_report'...
  target_type text,
  target_id uuid,
  metadata jsonb DEFAULT '{}'::jsonb,   -- reason, before/after values
  ip_address inet,
  user_agent text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_audit_actor ON audit_logs(actor_id, created_at DESC);
CREATE INDEX idx_audit_target ON audit_logs(target_type, target_id, created_at DESC);
CREATE INDEX idx_audit_action ON audit_logs(action, created_at DESC);
```

### 8.3 `activities`
Activity log của user (cho trang "Hoạt động gần đây" — feature U4).

```sql
CREATE TABLE activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  activity_type text NOT NULL CHECK (activity_type IN (
    'matched', 'unmatched', 'post_created', 'post_liked', 'comment_posted',
    'event_joined', 'event_checked_in', 'event_created', 'super_like_sent', 'super_like_received'
  )),
  ref_type text,
  ref_id uuid,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_activities_user ON activities(user_id, created_at DESC);
```

### 8.4 `app_config`
Cấu hình hệ thống (admin chỉnh được trong dashboard).

```sql
CREATE TABLE app_config (
  key text PRIMARY KEY,
  value jsonb NOT NULL,
  description text,
  updated_by uuid REFERENCES profiles(id) ON DELETE SET NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Seed data
INSERT INTO app_config (key, value, description) VALUES
  ('boost_duration_minutes', '30', 'Boost duration in minutes'),
  ('free_super_likes_per_day', '3', 'Free super likes per user per day'),
  ('free_boosts_per_day', '1', 'Free boosts per user per day'),
  ('free_undos_per_day', '3', 'Free undo swipes per user per day'),
  ('rate_limit_swipe_per_hour', '100', 'Max swipes per user per hour'),
  ('rate_limit_message_per_minute', '30', 'Max messages per user per minute'),
  ('rate_limit_post_per_day', '10', 'Max posts per user per day'),
  ('max_profile_photos', '6', 'Max photos per profile'),
  ('terms_version', '"1.0.0"', 'Current Terms of Service version'),
  ('privacy_version', '"1.0.0"', 'Current Privacy Policy version');
```

---

## 9. TRIGGERS & FUNCTIONS

### 9.1 Trigger `set_updated_at`
Dùng chung cho mọi bảng có cột `updated_at`.

```sql
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

### 9.2 Trigger tự tạo `matches` khi 2 user like nhau

```sql
CREATE OR REPLACE FUNCTION check_mutual_like()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER -- bypass RLS để insert notifications và activities
SET search_path = public
AS $$
DECLARE
  reverse_swipe RECORD;
  match_user_a uuid;
  match_user_b uuid;
  new_match_id uuid;
BEGIN
  -- Chỉ check khi swipe mới là like hoặc super_like
  IF NEW.direction NOT IN ('like', 'super_like') OR NEW.is_undone THEN
    RETURN NEW;
  END IF;

  -- Tìm swipe ngược chiều
  SELECT * INTO reverse_swipe
  FROM swipes
  WHERE swiper_id = NEW.target_id
    AND target_id = NEW.swiper_id
    AND direction IN ('like', 'super_like')
    AND is_undone = false
    AND (event_id IS NOT DISTINCT FROM NEW.event_id) -- match cùng context
  LIMIT 1;

  IF reverse_swipe IS NULL THEN
    RETURN NEW;
  END IF;

  -- Đảm bảo user_a < user_b (cho unique constraint)
  IF NEW.swiper_id < NEW.target_id THEN
    match_user_a := NEW.swiper_id;
    match_user_b := NEW.target_id;
  ELSE
    match_user_a := NEW.target_id;
    match_user_b := NEW.swiper_id;
  END IF;

  -- Tạo match (skip nếu đã tồn tại)
  INSERT INTO matches (user_a_id, user_b_id, event_id)
  VALUES (match_user_a, match_user_b, NEW.event_id)
  ON CONFLICT (user_a_id, user_b_id) DO NOTHING
  RETURNING id INTO new_match_id;

  IF new_match_id IS NOT NULL THEN
    -- Tạo 2 notifications cho 2 user
    INSERT INTO notifications (user_id, type, title, body, ref_type, ref_id, actor_id)
    VALUES
      (match_user_a, 'match', 'Bạn có match mới!', 'Bắt đầu trò chuyện ngay nhé', 'match', new_match_id, match_user_b),
      (match_user_b, 'match', 'Bạn có match mới!', 'Bắt đầu trò chuyện ngay nhé', 'match', new_match_id, match_user_a);

    -- Log vào activities
    INSERT INTO activities (user_id, activity_type, ref_type, ref_id)
    VALUES
      (match_user_a, 'matched', 'match', new_match_id),
      (match_user_b, 'matched', 'match', new_match_id);
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_check_mutual_like AFTER INSERT ON swipes
  FOR EACH ROW EXECUTE FUNCTION check_mutual_like();
```

### 9.3 Trigger cập nhật `posts.likes_count` và `comments_count`

```sql
CREATE OR REPLACE FUNCTION update_post_likes_count()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER -- bypass RLS để insert notifications
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE posts SET likes_count = likes_count + 1 WHERE id = NEW.post_id;
    -- Insert notification cho chủ post
    INSERT INTO notifications (user_id, type, title, ref_type, ref_id, actor_id)
    SELECT user_id, 'post_like', 'Có người thích bài viết của bạn', 'post', NEW.post_id, NEW.user_id
    FROM posts WHERE id = NEW.post_id AND user_id != NEW.user_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE posts SET likes_count = GREATEST(0, likes_count - 1) WHERE id = OLD.post_id;
  END IF;
  RETURN NULL;
END;
$$;

CREATE TRIGGER trg_post_likes_count
  AFTER INSERT OR DELETE ON post_likes
  FOR EACH ROW EXECUTE FUNCTION update_post_likes_count();

CREATE OR REPLACE FUNCTION update_comments_count()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  post_owner_id uuid;
  parent_comment_user_id uuid;
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE posts SET comments_count = comments_count + 1 WHERE id = NEW.post_id;

    -- Notification cho chủ post (nếu commenter khác chủ post)
    SELECT user_id INTO post_owner_id FROM posts WHERE id = NEW.post_id;
    IF post_owner_id != NEW.user_id THEN
      INSERT INTO notifications (user_id, type, title, body, ref_type, ref_id, actor_id, metadata)
      VALUES (
        post_owner_id, 'comment',
        'Có người bình luận bài viết của bạn',
        substring(NEW.content, 1, 100),
        'post', NEW.post_id, NEW.user_id,
        jsonb_build_object('comment_id', NEW.id)
      );
    END IF;

    -- Nếu là reply, notification cho parent comment author
    IF NEW.parent_id IS NOT NULL THEN
      SELECT user_id INTO parent_comment_user_id FROM comments WHERE id = NEW.parent_id;
      IF parent_comment_user_id != NEW.user_id AND parent_comment_user_id != post_owner_id THEN
        INSERT INTO notifications (user_id, type, title, body, ref_type, ref_id, actor_id, metadata)
        VALUES (
          parent_comment_user_id, 'comment_reply',
          'Có người trả lời bình luận của bạn',
          substring(NEW.content, 1, 100),
          'comment', NEW.id, NEW.user_id,
          jsonb_build_object('post_id', NEW.post_id, 'parent_comment_id', NEW.parent_id)
        );
      END IF;
    END IF;

  ELSIF TG_OP = 'DELETE' THEN
    UPDATE posts SET comments_count = GREATEST(0, comments_count - 1) WHERE id = OLD.post_id;
  END IF;
  RETURN NULL;
END;
$$;

CREATE TRIGGER trg_comments_count
  AFTER INSERT OR DELETE ON comments
  FOR EACH ROW EXECUTE FUNCTION update_comments_count();
```

### 9.4 Trigger cập nhật `matches.last_message_at`

```sql
CREATE OR REPLACE FUNCTION update_match_last_message()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE matches SET last_message_at = NEW.created_at WHERE id = NEW.match_id;
  RETURN NEW;
END;
$$;

-- Trigger này tự apply cho mọi partition của messages (PostgreSQL 11+)
-- Supabase dùng PG 15+ nên OK
CREATE TRIGGER trg_match_last_message AFTER INSERT ON messages
  FOR EACH ROW EXECUTE FUNCTION update_match_last_message();
```

---

## 10. PARTITIONING & SCHEDULED JOBS

### 10.1 Auto-create messages partitions

```sql
CREATE OR REPLACE FUNCTION create_messages_partition_for_next_month()
RETURNS void AS $$
DECLARE
  start_date date := date_trunc('month', now() + interval '1 month')::date;
  end_date date := date_trunc('month', now() + interval '2 month')::date;
  partition_name text := 'messages_' || to_char(start_date, 'YYYY_MM');
BEGIN
  EXECUTE format(
    'CREATE TABLE IF NOT EXISTS %I PARTITION OF messages FOR VALUES FROM (%L) TO (%L)',
    partition_name, start_date, end_date
  );
END;
$$ LANGUAGE plpgsql;

-- Chạy ngày 25 hàng tháng tạo partition cho tháng sau
SELECT cron.schedule('create-messages-partition', '0 0 25 * *',
  'SELECT create_messages_partition_for_next_month()');
```

### 10.2 Cleanup expired stories (24h)

```sql
SELECT cron.schedule('cleanup-expired-stories', '*/15 * * * *', $$
  UPDATE posts SET is_deleted = true, deleted_at = now()
  WHERE post_type = 'story'
    AND expires_at < now()
    AND is_deleted = false;
$$);
```

### 10.3 Cleanup event_messages sau 24h kết thúc event

```sql
SELECT cron.schedule('cleanup-event-messages', '0 */6 * * *', $$
  DELETE FROM event_messages
  WHERE event_id IN (
    SELECT id FROM events WHERE ends_at < now() - interval '24 hours'
  );
$$);
```

### 10.4 Hard delete user data sau 30 ngày soft delete

```sql
SELECT cron.schedule('hard-delete-users', '0 3 * * *', $$
  DELETE FROM profiles WHERE deleted_at < now() - interval '30 days';
$$);
```

### 10.5 Drop messages partitions cũ (giữ 12 tháng gần nhất)

```sql
CREATE OR REPLACE FUNCTION drop_old_messages_partitions()
RETURNS void AS $$
DECLARE
  partition_name text;
  cutoff_date date := date_trunc('month', now() - interval '12 months')::date;
BEGIN
  FOR partition_name IN
    SELECT tablename FROM pg_tables
    WHERE tablename LIKE 'messages_%'
      AND tablename < 'messages_' || to_char(cutoff_date, 'YYYY_MM')
  LOOP
    -- Archive trước khi drop (optional)
    EXECUTE format('DROP TABLE %I', partition_name);
  END LOOP;
END;
$$ LANGUAGE plpgsql;

SELECT cron.schedule('drop-old-partitions', '0 4 1 * *',
  'SELECT drop_old_messages_partitions()');
```

---

## 11. ROW LEVEL SECURITY (RLS)

**RLS BẬT trên TẤT CẢ bảng**. Dưới đây là policy cho từng bảng.

### 11.1 Helper functions

```sql
-- Check user có role admin
CREATE OR REPLACE FUNCTION is_admin() RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin' AND is_active = true
  );
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Check user có role mod hoặc admin
CREATE OR REPLACE FUNCTION is_moderator_or_admin() RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role IN ('moderator', 'admin') AND is_active = true
  );
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Check user A có bị block bởi user B không (2 chiều)
CREATE OR REPLACE FUNCTION is_blocked_pair(a uuid, b uuid) RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1 FROM blocks
    WHERE (blocker_id = a AND blocked_id = b)
       OR (blocker_id = b AND blocked_id = a)
  );
$$ LANGUAGE sql STABLE SECURITY DEFINER;
```

### 11.2 `profiles`

```sql
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Đọc: chỉ user đã đăng nhập đọc được profile active của người khác (trừ ai bị block với mình)
CREATE POLICY "profiles_select" ON profiles FOR SELECT
  USING (
    auth.uid() IS NOT NULL
    AND deleted_at IS NULL
    AND is_active = true
    AND NOT is_blocked_pair(auth.uid(), id)
  );

-- Insert: chỉ insert profile của chính mình
CREATE POLICY "profiles_insert" ON profiles FOR INSERT
  WITH CHECK (id = auth.uid());

-- Update: chỉ chính mình hoặc admin
CREATE POLICY "profiles_update_self" ON profiles FOR UPDATE
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid() AND role = (SELECT role FROM profiles WHERE id = auth.uid()));
  -- không cho user tự đổi role

CREATE POLICY "profiles_update_admin" ON profiles FOR UPDATE
  USING (is_admin());

-- Delete: chỉ admin (user dùng soft delete qua update)
CREATE POLICY "profiles_delete_admin" ON profiles FOR DELETE USING (is_admin());
```

### 11.3 `profile_photos`

```sql
ALTER TABLE profile_photos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "photos_select" ON profile_photos FOR SELECT
  USING (auth.uid() IS NOT NULL AND NOT is_blocked_pair(auth.uid(), user_id));

CREATE POLICY "photos_modify_own" ON profile_photos FOR ALL
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "photos_delete_mod" ON profile_photos FOR DELETE USING (is_moderator_or_admin());
```

### 11.4 `swipes`

```sql
ALTER TABLE swipes ENABLE ROW LEVEL SECURITY;

-- User chỉ thấy swipe của chính mình
CREATE POLICY "swipes_select_own" ON swipes FOR SELECT
  USING (swiper_id = auth.uid());

-- See Who Liked You: thấy swipe target_id = mình AND direction = like
CREATE POLICY "swipes_select_likes_on_me" ON swipes FOR SELECT
  USING (target_id = auth.uid() AND direction IN ('like', 'super_like'));

CREATE POLICY "swipes_insert_own" ON swipes FOR INSERT
  WITH CHECK (swiper_id = auth.uid());

CREATE POLICY "swipes_update_own" ON swipes FOR UPDATE
  USING (swiper_id = auth.uid());
```

### 11.5 `matches`

```sql
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "matches_select" ON matches FOR SELECT
  USING (user_a_id = auth.uid() OR user_b_id = auth.uid());

-- Update (unmatch): chỉ user trong match
CREATE POLICY "matches_update" ON matches FOR UPDATE
  USING (user_a_id = auth.uid() OR user_b_id = auth.uid());
```

### 11.6 `messages`

```sql
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Chỉ 2 user trong match đọc được
CREATE POLICY "messages_select" ON messages FOR SELECT
  USING (
    match_id IN (
      SELECT id FROM matches
      WHERE (user_a_id = auth.uid() OR user_b_id = auth.uid())
        AND is_active = true
    )
  );

-- Chỉ insert nếu là user trong match
CREATE POLICY "messages_insert" ON messages FOR INSERT
  WITH CHECK (
    sender_id = auth.uid()
    AND match_id IN (
      SELECT id FROM matches
      WHERE (user_a_id = auth.uid() OR user_b_id = auth.uid())
        AND is_active = true
    )
  );

-- Update read status: chỉ user trong match
CREATE POLICY "messages_update_read" ON messages FOR UPDATE
  USING (
    match_id IN (
      SELECT id FROM matches WHERE user_a_id = auth.uid() OR user_b_id = auth.uid()
    )
  );

-- Mod xem được message khi có report kèm theo (không có policy chung cho mod)
-- → Mod phải query qua reports table
```

### 11.7 `posts`, `comments`, `post_likes`

```sql
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "posts_select" ON posts FOR SELECT
  USING (
    auth.uid() IS NOT NULL
    AND is_deleted = false
    AND (expires_at IS NULL OR expires_at > now())
    AND (is_public = true OR user_id = auth.uid())
    AND NOT is_blocked_pair(auth.uid(), user_id)
  );

CREATE POLICY "posts_insert" ON posts FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "posts_update_own" ON posts FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "posts_delete_own_or_mod" ON posts FOR DELETE
  USING (user_id = auth.uid() OR is_moderator_or_admin());

-- comments
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "comments_select" ON comments FOR SELECT
  USING (auth.uid() IS NOT NULL AND is_deleted = false AND NOT is_blocked_pair(auth.uid(), user_id));
CREATE POLICY "comments_insert" ON comments FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "comments_update_own" ON comments FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "comments_delete" ON comments FOR DELETE
  USING (user_id = auth.uid() OR is_moderator_or_admin());

-- post_likes
ALTER TABLE post_likes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "post_likes_select" ON post_likes FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "post_likes_modify_own" ON post_likes FOR ALL
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
```

### 11.8 `events`, `event_attendees`, `event_messages`

```sql
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "events_select" ON events FOR SELECT
  USING (auth.uid() IS NOT NULL AND is_deleted = false AND status IN ('published', 'ended'));
CREATE POLICY "events_insert" ON events FOR INSERT WITH CHECK (creator_id = auth.uid());
CREATE POLICY "events_update" ON events FOR UPDATE
  USING (creator_id = auth.uid() OR is_moderator_or_admin());
CREATE POLICY "events_delete" ON events FOR DELETE
  USING (creator_id = auth.uid() OR is_admin());

ALTER TABLE event_attendees ENABLE ROW LEVEL SECURITY;
CREATE POLICY "attendees_select" ON event_attendees FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "attendees_join" ON event_attendees FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "attendees_update_own" ON event_attendees FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "attendees_leave" ON event_attendees FOR DELETE USING (user_id = auth.uid());

ALTER TABLE event_messages ENABLE ROW LEVEL SECURITY;
-- Chỉ attendee đã check-in đọc/ghi được
CREATE POLICY "event_messages_select" ON event_messages FOR SELECT
  USING (
    event_id IN (
      SELECT event_id FROM event_attendees
      WHERE user_id = auth.uid() AND status = 'checked_in'
    )
  );
CREATE POLICY "event_messages_insert" ON event_messages FOR INSERT
  WITH CHECK (
    sender_id = auth.uid()
    AND event_id IN (
      SELECT event_id FROM event_attendees
      WHERE user_id = auth.uid() AND status = 'checked_in'
    )
  );
```

### 11.9 `notifications`, `notification_preferences`

```sql
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "noti_select_own" ON notifications FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "noti_update_own" ON notifications FOR UPDATE USING (user_id = auth.uid());
-- Insert chỉ qua trigger / service role, không cho client tự insert
CREATE POLICY "noti_no_client_insert" ON notifications FOR INSERT WITH CHECK (false);

ALTER TABLE notification_preferences ENABLE ROW LEVEL SECURITY;
CREATE POLICY "noti_prefs_own" ON notification_preferences FOR ALL
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
```

### 11.10 `blocks`, `reports`

```sql
ALTER TABLE blocks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "blocks_select_own" ON blocks FOR SELECT USING (blocker_id = auth.uid());
CREATE POLICY "blocks_insert" ON blocks FOR INSERT WITH CHECK (blocker_id = auth.uid());
CREATE POLICY "blocks_delete_own" ON blocks FOR DELETE USING (blocker_id = auth.uid());

ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "reports_select_own" ON reports FOR SELECT
  USING (reporter_id = auth.uid() OR is_moderator_or_admin());
CREATE POLICY "reports_insert" ON reports FOR INSERT
  WITH CHECK (reporter_id = auth.uid());
CREATE POLICY "reports_update_mod" ON reports FOR UPDATE
  USING (is_moderator_or_admin());
```

### 11.11 `banned_words`, `flagged_content`, `audit_logs`, `ads`, `app_config`

```sql
-- banned_words: chỉ mod/admin
ALTER TABLE banned_words ENABLE ROW LEVEL SECURITY;
CREATE POLICY "banned_words_mod_all" ON banned_words FOR ALL
  USING (is_moderator_or_admin()) WITH CHECK (is_moderator_or_admin());

-- flagged_content: chỉ mod/admin xem; insert qua trigger
ALTER TABLE flagged_content ENABLE ROW LEVEL SECURITY;
CREATE POLICY "flagged_mod_select" ON flagged_content FOR SELECT USING (is_moderator_or_admin());
CREATE POLICY "flagged_mod_update" ON flagged_content FOR UPDATE USING (is_moderator_or_admin());

-- audit_logs: chỉ admin đọc; insert qua service role
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "audit_admin_select" ON audit_logs FOR SELECT USING (is_admin());

-- ads: ai cũng đọc (để hiển thị); chỉ admin CRUD
ALTER TABLE ads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "ads_select_active" ON ads FOR SELECT
  USING (is_active = true AND starts_at <= now() AND ends_at >= now());
CREATE POLICY "ads_admin_select" ON ads FOR SELECT USING (is_admin());
CREATE POLICY "ads_admin_modify" ON ads FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "ads_admin_update" ON ads FOR UPDATE USING (is_admin());
CREATE POLICY "ads_admin_delete" ON ads FOR DELETE USING (is_admin());

-- app_config: ai cũng đọc; chỉ admin update
ALTER TABLE app_config ENABLE ROW LEVEL SECURITY;
CREATE POLICY "config_select" ON app_config FOR SELECT USING (true);
CREATE POLICY "config_admin_modify" ON app_config FOR ALL USING (is_admin());
```

### 11.12 Còn lại

```sql
-- profile_prompts, user_consents, push_tokens, profile_views, activities
ALTER TABLE profile_prompts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "prompts_select" ON profile_prompts FOR SELECT
  USING (auth.uid() IS NOT NULL AND NOT is_blocked_pair(auth.uid(), user_id));
CREATE POLICY "prompts_modify_own" ON profile_prompts FOR ALL
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

ALTER TABLE user_consents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "consents_own" ON user_consents FOR ALL
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

ALTER TABLE push_tokens ENABLE ROW LEVEL SECURITY;
CREATE POLICY "push_tokens_own" ON push_tokens FOR ALL
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

ALTER TABLE profile_views ENABLE ROW LEVEL SECURITY;
CREATE POLICY "views_select" ON profile_views FOR SELECT
  USING (viewer_id = auth.uid() OR viewed_id = auth.uid());
CREATE POLICY "views_insert" ON profile_views FOR INSERT
  WITH CHECK (viewer_id = auth.uid());

ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "activities_own" ON activities FOR SELECT USING (user_id = auth.uid());
```

---

## 12. SUPABASE STORAGE BUCKETS

Tạo qua Supabase dashboard hoặc CLI:

```sql
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types) VALUES
  ('avatars', 'avatars', true, 5242880, ARRAY['image/jpeg','image/png','image/webp']),
  ('post-images', 'post-images', true, 10485760, ARRAY['image/jpeg','image/png','image/webp']),
  ('event-covers', 'event-covers', true, 5242880, ARRAY['image/jpeg','image/png','image/webp']),
  ('chat-images', 'chat-images', false, 5242880, ARRAY['image/jpeg','image/png','image/webp']),
  ('ad-images', 'ad-images', true, 2097152, ARRAY['image/jpeg','image/png','image/webp']);
```

Storage policies (ví dụ avatars):

```sql
CREATE POLICY "avatars_public_read" ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

CREATE POLICY "avatars_user_upload" ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'avatars'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "avatars_user_update" ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'avatars'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "avatars_user_delete" ON storage.objects FOR DELETE
  USING (
    bucket_id = 'avatars'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );
```

Convention path: `{user_id}/{photo_id}.jpg` để policy kiểm tra ownership qua foldername.

---

## 13. REALTIME CONFIGURATION

Enable Realtime cho các bảng cần realtime:

```sql
ALTER PUBLICATION supabase_realtime ADD TABLE messages;
ALTER PUBLICATION supabase_realtime ADD TABLE event_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE matches;
ALTER PUBLICATION supabase_realtime ADD TABLE event_attendees;
```

**Lưu ý cho dev:**
- **Chat 1-1**: **LUÔN write DB trước** (INSERT vào `messages`), sau đó client tự nhận tin nhắn mới qua `postgres_changes` subscribe trên `messages WHERE match_id=X`. KHÔNG dùng Broadcast cho main message vì Broadcast là fire-and-forget, mất tin khi mất mạng. Pattern: client A insert message → Supabase emit postgres_changes event → client B (đang subscribe) nhận event và update UI.
- **Typing indicator**: Broadcast event qua `channel('typing:{match_id}')`, KHÔNG lưu DB. Tự biến mất sau 3s không có event mới.
- **Online presence**: dùng **Supabase Presence** built-in qua channel
- **Notifications**: postgres_changes OK vì volume thấp
- **Match popup**: postgres_changes trên bảng `matches` filter `user_a_id=eq.X OR user_b_id=eq.X`
- **Event group chat**: tương tự chat 1-1 — write DB trước, subscribe postgres_changes

---

## 14. MIGRATION ORDER

Thứ tự chạy migration (Supabase CLI). **Quan trọng**: thứ tự đã được reorder để tránh forward reference (events phải tạo trước matching):

```
20260524000001_init_extensions.sql       -- CREATE EXTENSION
20260524000002_init_functions.sql        -- set_updated_at, is_admin, is_moderator_or_admin, is_blocked_pair
20260524000003_create_profiles.sql       -- profiles + photos + prompts + consents + push_tokens
20260524000004_create_events.sql         -- events + event_attendees + event_messages (CHẠY TRƯỚC matching)
20260524000005_create_matching.sql       -- swipes + matches + messages + profile_views (event_id chưa có FK)
20260524000006_add_event_fks.sql         -- ALTER TABLE swipes, matches ADD FK event_id
20260524000007_create_social.sql         -- posts + comments + post_likes
20260524000008_create_notifications.sql  -- notifications + notification_preferences
20260524000009_create_safety.sql         -- blocks + reports + banned_words + flagged_content
20260524000010_create_admin.sql          -- ads + audit_logs + activities + app_config
20260524000011_triggers.sql              -- check_mutual_like, update_*_count, update_match_last_message
20260524000012_cron_jobs.sql             -- pg_cron schedules
20260524000013_rls_policies.sql          -- ALL RLS policies
20260524000014_storage_buckets.sql       -- buckets + storage policies
20260524000015_realtime.sql              -- ALTER PUBLICATION
20260524000016_seed_data.sql             -- app_config + banned_words seed
```

### File `20260524000006_add_event_fks.sql`

```sql
-- Thêm FK event_id cho swipes và matches sau khi events được tạo

ALTER TABLE swipes
  ADD CONSTRAINT swipes_event_id_fkey
  FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE SET NULL;

ALTER TABLE matches
  ADD CONSTRAINT matches_event_id_fkey
  FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE SET NULL;
```

---

## 15. DART MODELS GENERATION (Flutter)

Khác với JavaScript/TypeScript, **Supabase KHÔNG có CLI tool tự generate Dart types từ schema** (tại 2026). Có 2 cách xử lý:

### Cách 1 (Recommended): Viết Freezed models thủ công

Vì schema đã định nghĩa rõ trong file 02 này, dev viết `freezed` models tương ứng. Có code generation tự động cho `fromJson` / `toJson` / `copyWith`.

```dart
// lib/data/models/profile_model.dart
import 'package:freezed_annotation/freezed_annotation.dart';

part 'profile_model.freezed.dart';
part 'profile_model.g.dart';

// Freezed 2.x — KHÔNG cần keyword `abstract`/`sealed`
@freezed
class ProfileModel with _$ProfileModel {
  const factory ProfileModel({
    required String id,
    @JsonKey(name: 'display_name') required String displayName,
    String? bio,
    @JsonKey(name: 'birth_date') required DateTime birthDate,
    required String gender,
    @JsonKey(name: 'interested_in') required List<String> interestedIn,
    required String university,
    String? major,
    @JsonKey(name: 'year_of_study') int? yearOfStudy,
    @Default([]) List<String> interests,
    @JsonKey(name: 'social_links') Map<String, dynamic>? socialLinks,
    double? lat,
    double? lng,
    @JsonKey(name: 'geohash_6') String? geohash6,
    @JsonKey(name: 'geohash_4') String? geohash4,
    @Default('user') String role,
    @JsonKey(name: 'is_active') @Default(true) bool isActive,
    @JsonKey(name: 'is_verified') @Default(false) bool isVerified,
    @JsonKey(name: 'is_banned') @Default(false) bool isBanned,
    @JsonKey(name: 'boost_expires_at') DateTime? boostExpiresAt,
    @JsonKey(name: 'last_active_at') required DateTime lastActiveAt,
    @JsonKey(name: 'created_at') required DateTime createdAt,
    @JsonKey(name: 'updated_at') required DateTime updatedAt,
    @JsonKey(name: 'deleted_at') DateTime? deletedAt,
  }) = _ProfileModel;

  factory ProfileModel.fromJson(Map<String, dynamic> json) =>
      _$ProfileModelFromJson(json);
}
```

Chạy code generation:
```bash
dart run build_runner build --delete-conflicting-outputs
```

Sẽ tự tạo `profile_model.freezed.dart` (immutable + copyWith) và `profile_model.g.dart` (fromJson/toJson).

### Cách 2: Dùng community tool `supabase_codegen`

Có package community `supabase_codegen` (chưa stable) generate Dart models từ Postgres schema. Recommend skip cho đồ án — viết tay rõ ràng hơn, dễ control hơn.

### Naming convention

- **DB columns**: `snake_case` (vd: `display_name`)
- **Dart fields**: `camelCase` (vd: `displayName`)
- Dùng `@JsonKey(name: 'display_name')` để map giữa 2 conventions

### Models cần tạo (1 file per table)

```
lib/data/models/
├── profile_model.dart
├── profile_photo_model.dart
├── profile_prompt_model.dart
├── user_consent_model.dart
├── push_token_model.dart
├── swipe_model.dart
├── match_model.dart
├── message_model.dart
├── profile_view_model.dart
├── post_model.dart
├── comment_model.dart
├── event_model.dart
├── event_attendee_model.dart
├── event_message_model.dart
├── notification_model.dart
├── notification_preference_model.dart
├── block_model.dart
├── report_model.dart
├── banned_word_model.dart
├── flagged_content_model.dart
├── ad_model.dart
├── audit_log_model.dart
├── activity_model.dart
└── app_config_model.dart
```

24 models tương ứng 24 bảng (trừ `messages` partition - dùng chung model).

---

## 16. NOTES QUAN TRỌNG

1. **Geohash KHÔNG được tính ở DB** — encode lat/lng → geohash ở app layer dùng `dart_geohash` (Flutter), rồi insert vào DB. Lý do: không cần PostGIS, đơn giản, đủ nhanh. **Khi query nearby**: tính 9 cells (current + 8 neighbors) qua `GeoHash.neighbors()` và query `WHERE geohash_6 IN (...)`.

2. **Match ID convention**: `user_a_id < user_b_id` để unique pair. Khi query, luôn dùng `(user_a_id = me OR user_b_id = me)`.

3. **Trigger `check_mutual_like`** chạy AFTER INSERT swipes — đảm bảo match tự động tạo, app không cần check manual.

4. **Notifications insert** đa số qua trigger (match, post_like, comment). Reminder noti và push noti gọi từ Edge Functions.

5. **Push notification** không lưu trong bảng `notifications` — bảng đó là in-app inbox. Push gửi qua **FCM (Firebase Cloud Messaging)** từ Edge Function khi insert notification. FCM hỗ trợ cả Android, iOS, và Web push.

6. **RLS có thể chậm** nếu policy dùng subquery phức tạp. Đo qua `EXPLAIN ANALYZE`. Nếu chậm, tách logic ra Database Function với SECURITY DEFINER.

7. **Messages partition** rất quan trọng — KHÔNG bỏ qua. Bảng messages sẽ phình to nhanh, partition giúp drop dữ liệu cũ và query nhanh.

8. **Service role key** chỉ dùng ở Edge Functions, NEVER expose lên client. Bypass RLS để: insert notifications qua trigger, run cron jobs, gửi push noti.

9. **Backup**: Supabase Free tier không có daily backup. Setup GitHub Action chạy `pg_dump` hàng tuần upload Google Drive.

10. **Schema versioning**: Mọi thay đổi schema qua migration file, NEVER edit trực tiếp trong dashboard. Commit migration files vào git.
