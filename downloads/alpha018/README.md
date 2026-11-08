# DGIURI α 0.18 release artifacts
- DGIURI_Alpha_0.18_TEST_Parallel.apk: debug-signed side-by-side test build; package ge.weeklyplus.app.test, versionCode 10. Does NOT update Play-installed Diary.
- DGIURI_Alpha_0.18_UNSIGNED_DO_NOT_UPLOAD.aab: validated ZIP-format bundle, intentionally UNSIGNED; DO NOT upload to Google Play until it is signed with the original weeklyplus upload key.
- Primary package ge.weeklyplus.app, versionCode 10, versionName 0.18-alpha, targetSdk 36.
- Web preview: https://piraligame.github.io/pirali/diary-alpha18-webtest/index.html?v=18
- QA: Web passed 42 palette/theme/viewport combinations; Android debug compile passed, release bundle compile passed; package verified.
- Follow-up: re-sign with original credentials, test in-place Play update and stored data preservation before publishing to existing track.
