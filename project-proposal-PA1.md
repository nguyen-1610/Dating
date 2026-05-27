# UniDate — Project Proposal

**Course:** CS300 / CSC13002 — Introduction to Software Engineering
**Assignment:** PA1-2026 — Section B (Project Proposal)
**Group:** 2 — 3 trẻ 1 già
**Members:** 

- 24127467 — Huỳnh Duy Nguyên — Team Leader
- 24127054 — Trần Thuận Khang
- 24127150 — Trương Nguyễn Thành Danh
- 21427419 — Mai Đăng Khánh

---

## 1. Introduction

UniDate is a mobile and web platform that combines dating, a lightweight social feed, and student event discovery into a single application designed for Vietnamese university students. Unlike mainstream dating apps such as Tinder or Bumble, which target the general adult population and gate core features behind paywalls, UniDate is built around Vietnamese campus life: students can filter matches by university, discover student-organized events with GPS check-in, and engage with peers through a feed similar to Threads.

The platform addresses three pain points that existing apps fail to solve for Vietnamese students. First, mainstream apps mix students with users of widely different ages and life stages, making relatable connections difficult. Second, Vietnamese students often want to meet peers from their own or nearby universities — for study groups, club activities, or dating — but no existing platform combines university filtering with event-based meetups; students currently juggle Tinder, Facebook groups, and Zalo separately. Third, premium features on Tinder cost 200,000–500,000 VND per month, which is unaffordable for most students; UniDate offers all core features for free.

The product targets approximately 2.1 million university students across Vietnam, with an initial launch focused on Ho Chi Minh City universities (HCMUS, UEH, BK, FTU) before nationwide expansion.

---

## 2. Target Users and Environments

*Performed by: [name] · Reviewed by: [name] · Edited by: [name]*

UniDate has three types of users. **Students** aged 18–25 are the main users (about 99%); they swipe, chat, post, and join events. **Moderators** review reports, manage banned words, and can suspend accounts temporarily; they cannot read private messages unless those messages are part of a report. **Admins** have full access for user management, moderator assignment, and system configuration. Two-factor authentication is required for admin accounts.

The app runs from a single Flutter codebase on three platforms: **iOS 13+**, **Android 8.0+**, and **modern web browsers** (Chrome, Safari, Edge, Firefox). Students can start a chat on their phone and continue it on a laptop. The app needs an internet connection for real-time features and requires location permission for nearby users and event check-in. Push notifications are sent through Firebase Cloud Messaging.

---

## 3. Key Features

UniDate has 10 functional groups. The first four are common to most apps but adapted for student use; the last six are what make UniDate different from other dating apps.

**1. Authentication and Onboarding.** Students sign up with email or Google, agree to the terms, and complete a 5-step onboarding wizard (name, birthday, gender, university, photos). This makes sure every profile has the basic information needed for matching.

**2. Profile Management.** Each student can edit their profile, upload up to 6 photos, choose interests from a tag pool, and add social media links. Photos are compressed before upload to keep storage costs low.

**3. Discover and Swipe.** Students swipe left to pass and right to like. They can filter by **university**, age, distance, and shared interests — the university filter is unique to UniDate and lets students choose to meet people from their own school or other schools.

**4. Matches and Likes.** When two users like each other, a match is created and a chat opens. Students can also see who liked them for free (most apps charge for this), undo their last swipe, and check their swipe history.

**5. Chat.** Matched users can send text, emoji, and images in real time, with typing indicator and seen status. A banned-word filter warns users before they send inappropriate messages.

**6. Social Feed.** Students can post photos with captions, share 24-hour stories, and write short threads. Other users can like, comment, and report posts.

**7. Events.** Students can create and join campus events such as study groups, club meetings, or group dates. Each event has a location on a map, a list of attendees, and a group chat. When the event starts, attendees check in using GPS, and a special "event swipe" mode lets them match only with people physically present at the event.

**8. Notifications.** Push notifications are sent for matches, new messages, comments, event reminders, and likes. Students can turn each type on or off in settings.

**9. Safety and Moderation.** Users can block, report, or unmatch other users. Moderators review reports and remove harmful content. A banned-word list filters offensive messages and posts.

**10. Admin and Analytics.** Admins see dashboards for daily active users, matches, and reports. They can manage users, assign moderators, schedule ads, and view audit logs of all moderator actions.

---

## 4. AI Feature

UniDate includes an **AI Ice-breaker** to help students start conversations after a match. After two users match, the AI suggests three short opening messages based on both profiles — their interests, university, major, and bio. For example, if both users like coffee and study at HCMUS, the AI might suggest: *"I saw you also study at HCMUS — have you tried the new coffee shop near the library?"*

This feature solves a real problem in dating apps: many matches go nowhere because users don't know what to say first. Generic openers like "hi" rarely get replies, but writing something personal takes effort and confidence that not everyone has. By suggesting messages that reference what the two users actually share, the AI lowers this barrier and helps shy students start real conversations.

The feature works by sending both profiles to a language model API (OpenAI GPT-4o-mini or Google Gemini Flash) with a prompt that asks for three short, friendly, Vietnamese-language openers. The AI runs only when the user opens the chat for the first time, and the suggestions appear as tappable chips above the text input — users can send a suggestion directly, edit it, or ignore it and type their own message. No conversation data is sent to the AI; only the two public profiles are used.
