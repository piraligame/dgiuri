# WEEKLY+ / DGIURI Alpha 0.27 TEST

A debug APK only, versionCode 19. Package ge.weeklyplus.app.test, same signing certificate as 0.26 TEST (v18). Install as an UPDATE over the testing app. Google Play 0.04 is separate and unchanged.

## Approved scoped updates
- Merge Today and Calendar into one bottom Calendar tab, opening on today's Day mode by default. Previous separate Today bottom tab removed; no replacement tab invented.
- Day mode preserves 0.26's simple quick entry and day task panel, but removes the old hourly schedule.
- New daily quick tasks default to time 12:00 with reminders unchanged (no additional alerts unless set). New task editor defaults to 12:00. Existing tasks remain unchanged.
- Week: 7-day calendar plus a list of all weekly tasks below, each with side-by-side date/time, chronological order, completion, edit, and tap-through to Day.
- Month: month grid plus a list of all monthly tasks below, sorted date then time. Tap a date to open Day and add/edit there.
- Year: 12 compact months remain; tap ANYWHERE in a month, including a printed date, to open that MONTH (never jump straight to Day). No add button in Year mode.
- Other > "Hourly daily schedule": separate 24-hour list by date with title, HH:mm, edit/delete, and a 15-minute-before Android reminder. Alarm permission and Android notification permission may be required for accurate delivery; quiet hours are respected.
- No changes to Google auth, Joker, color notes, diary photos, calendar theme, PIN, biometric, widget, or existing task persistence.

Compilation is verified; visual behavior and notification delivery must still be tested on the phone. This is NOT a Play production release and no AAB was created.

APK SHA-256: c20fa9dcd77a58d2e74acd0ef667e9760a0bb9b98a280e77edaa6c30ff68bc02
