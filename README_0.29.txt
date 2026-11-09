# WEEKLY+ / DGIURI 0.29 TEST (v21)

APK is an UPDATE for the installed 0.28 TEST app, package ge.weeklyplus.app.test with matching debug signing cert. It does NOT replace Google Play-signed 0.04.

**Only user-approved changes**:
- Other menu adds "ხატვა" immediately above "ჩემი დღიური".
- Drawing notes: in-app touch canvas, pen color and width, undo/clear, optional title and text, local save, edit, delete and pin to top. Independent storage at files/weeklyplus_drawing_notes_029.
- Timer and daily alarm: audible repeating bundled ringtone using alarm audio stream in foreground, persistent user-visible notification with "გამორთვა", 3-minute safety timeout.
- Fallback alarm sound notification channel if Android blocks the service.
- Existing unrelated app modules are unchanged. No changes to tasks, Joker, calendar, color notes, widgets, Google login, PIN, diary.
- Both artifacts compile for target SDK 36, versionCode 21.

**Signing:** APK signed using same DEBUG key as 0.28 TEST. AAB UNSIGNED (Play stable keystore password unavailable) and kept only on the laptop. An unsigned AAB CANNOT be uploaded to Google Play. To sign it for Play, the original stable upload keystore password is required.

Real-device ringing (locked screen, DND, alarm volume and OEM battery policies) still requires testing on the user's phone.

APK SHA256 52dca20feef2f6866d3a223c6fd7f1d584bf069712e0c9ea41c4ed5ac37df6cc
AAB SHA256 d306eda8e715ac0cb09f7c3a298434c4a42b7ae67a3ca2ff610ad50a31c54ea3
