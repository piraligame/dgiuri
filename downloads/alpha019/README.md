# DGIURI alpha 0.19
- DGIURI_Alpha_0.19_TEST_Parallel.apk: debug-signed side-by-side Android test build, package ge.weeklyplus.app.test, versionCode 11. Does NOT update the Play-installed app.
- DGIURI_Alpha_0.19_UNSIGNED_DO_NOT_UPLOAD.aab: unsigned release bundle, validated ZIP/CRC, package ge.weeklyplus.app, versionCode 11. DO NOT upload to Play until signed with the original upload key.
- Only calendar change from alpha 0.18: red circle around the date numeral for every calendar date with a scheduled task or reminder, including recurrence, in week and month views. All other app functionality unchanged.
- Web: https://piraligame.github.io/pirali/diary-alpha19-webtest/index.html?v=19
- QA: Web calendar passed 42 combinations (7 colors, 2 themes, 3 viewport widths); Android debug and release bundle compiled successfully; debug APK signature verified.
- For an in-place update, sign AAB with original upload key and test through the same Google Play track. Never uninstall old app to update.
