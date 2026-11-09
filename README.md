# WEEKLY+ / დღიური — Alpha 0.21 TEST (2026-11-09)
This is a debug APK, package ge.weeklyplus.app.test, versionCode 13.
It installs alongside the Play app and does NOT replace the Play-installed 0.04.

Native changes: compact 12-month calendar; smaller hourly/tomorrow blocks; 24-round classic Joker board; app-wide PIN switch and biometric option; launcher widget and pin button; Compass; updated quiet hours controls; high priority notification channel with badges/lock screen privacy.

IMPORTANT: Android Google sign-in / native Firebase sync is NOT complete. The old 0.15 browser redirect is removed and the settings page labels the separate 0.21 web test explicitly. Device QA pending, especially biometric/compass/widget and calendar fit.

The accompanying source ZIP excludes passwords and keystore files.
The unsigned AAB is a compile artifact only, NOT for Google Play upload.
For Play's existing ge.weeklyplus.app an AAB signed by the same established upload key is required. The local original release procedure could not find its signing password. Never upload an unsigned file or replace the key. Verify Play App Signing certificate and currently accepted versionCode before release.

APK SHA-256: 111aa295ed7eb828963292c5c8d012080e1233b309064bcb34694574247142b5
