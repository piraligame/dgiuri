# DGIURI 0.17 artifacts
- DGIURI_Alpha_0.17_TEST_Parallel.apk: signed Android debug build, package ge.weeklyplus.app.test. Installs alongside the Google Play version; does NOT update it.
- DGIURI_Alpha_0.17_UNSIGNED_DO_NOT_UPLOAD.aab: unsigned intermediate bundle. DO NOT upload to Google Play; sign with the original weeklyplus upload certificate first.
- Production/closed-test upgrade must use a new AAB with ge.weeklyplus.app and versionCode 9, signed with the original upload key. Test through the same Play track. Do not uninstall the existing app.
- Web preview: https://piraligame.github.io/pirali/diary-alpha17-webtest/index.html?v=17
