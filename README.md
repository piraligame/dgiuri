# დღიური (DGIURI) · Android Alpha 0.12

Offline-first Android daily planner by the PIRALI team. This is a **separate repository** from PIRALI and GEORGIA.

**Android package:** `ge.weeklyplus.app` • **versionCode:** `5` • **versionName:** `0.11-alpha` • **target SDK:** 36.

## Features
- Day/week/month/year calendar; TOP 3 manual priorities; hourly timeline.
- Joker match scoring, played-match history, JSON export/import.
- Separate countdown timer (Android AlarmManager) and daily alarm.
- Dark theme via dropdown; language menu; task reminder defaults.
- Facebook Georgian Gamers Guild plus PIRALI and GEORGIA tester links in Settings.
- Goals tab removed from navigation; existing planner task storage keys preserved.
- Locally stored tasks, backups and reminders; no ads or account requirement.

## Install
Get the **stable-signed Android APK** from [GitHub Releases](https://github.com/piraligame/dgiuri/releases/tag/v0.11).
It is intended to update previously installed stable-signed Diary builds (matching package and signing certificate). GitHub Actions debug APKs are **not** in-place updates. Before an update, back up important diary entries.

## Signing
No upload signing credentials or keystore are included in this repository. Release APK and AAB are built and signed on the authorized development laptop. Do not use default unsigned/CI builds as update packages.

## Browser preview 0.12
Open the preserved 0.10-style web UI with localized Clock, unlimited starred TOP tasks and year → month → day navigation:
https://piraligame.github.io/pirali/diary-alpha12-webtest/index.html?v=12

**Build status:** native 0.12 debug compilation passed. A release that updates existing stable-signed installs requires the original stable signing credentials, not the debug key. Do not upload unsigned AABs to Play.


## Alpha 0.15 (2026-11-08)

Native Android package ge.weeklyplus.app, versionCode 7, versionName 0.15-alpha,
signed for Google Play updates with the original weeklyplus upload certificate
held securely off-repository.

- Add separate checklist with red completed strike-through, open/done/all filters.
- Add native personal journal with creation/edit timestamps and history.
- Reorganize bottom navigation to List, Today, Calendar, Results, Other, Settings.
- In Other: Diary, Joker, Clock. Results includes checklist completion.
- 7 app accent choices, calendar year dropdown, unlimited TOP stars.
- Backups include planner, checklist, journal and Joker datasets.
- Alarm and timers use Android OS alarm notification/channel as before.

**Important:** Google authentication is on the linked web player
https://piraligame.github.io/pirali/diary-alpha15-webtest/index.html?v=15 .
The native Android data and browser cloud data are still separate.
Do not claim native cloud sync until a dedicated integrated sign-in/reconciliation
implementation is built and tested. Browser page is opened via an external intent.

No .jks, passwords, or private credentials are stored in the repository.
