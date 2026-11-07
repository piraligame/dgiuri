# დღიური (DGIURI) · Android Alpha 0.11

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
