# WEEKLY+ / DGIURI Alpha 0.28 - Today's final testing build

This branch delivers two Android build artifacts:
* APK ge.weeklyplus.app.test / v20 / 0.28-alpha-TEST, debug signed using the same certificate as 0.27 TEST, suitable to install over previous TEST APK without deletion.
* AAB ge.weeklyplus.app / v20 / 0.28-alpha. SIGNING_STATUS: UNSIGNED (NOT ready for Play upload).

Only approved changes over Alpha 0.27:
- Global temporary notice/banner clears automatically after 3 seconds.
- Settings: Google account and synchronization is the very first settings card.
- Settings: Backup export/import controls and their restore dialog removed from the visible settings UI. PlannerStore save/import/export data logic is not touched; existing user data is preserved.
- Settings: panel title changed to "კონფიდენციალურობა", with accurate note that full two-way Google sync is not yet enabled.
- Other navigation reordered exactly: Color Notes, Hourly Schedule, My Diary, Alarm clock, Joker, Compass. "საათობრივი დღის განრიგი" shortened to "საათობრივი განრიგი"; "საათი" menu label changed to "მაღვიძარა". All six destinations and underlying functions are unchanged.
- Compact scrollable home screen widget: 170x96dp default, resizable; full daily task list scrolls with times and completion indicators, without altering saved tasks. Widget updates through the existing provider ID.
- Other than the user-requested widget changes, all remaining source files, Google auth, Joker, Color Notes, Compass, Calendar, Tasks, Reminders, and App Locks unchanged.

Phone visual check still needed.
The AAB cannot be uploaded to Google Play until signed with the ORIGINAL stable Play upload keystore. Keystore file exists locally but its password is NOT provided in the active build environment. Do not upload it as-is.

APK sha256: 9d45f22fceb1a0b32d2774da01bb47059681b22ee7630237ad554344b4d088e5
AAB sha256: 2b410d22cd4d06c10a7f4bf94a734365a0d09c0e419e1892dbe504a298a06f24
