# WEEKLY+ / DGIURI Alpha 0.22 — Google sign-in test
Package: ge.weeklyplus.app.test
versionCode: 14, versionName: 0.22-alpha-TEST

New: Native Google account chooser using Android Credential Manager and Firebase Authentication. Test package and debug SHA1/SHA256 were registered in the existing Firebase project. Sign-in session persists through FirebaseAuth.
Cloud check is **READ ONLY** and shows counts; it cannot delete or overwrite saved tasks/notes in Firestore or on device. Two-way sync is not implemented and must undergo separate testing before enablement.
Old 0.21 features retained: 12-month calendar, native widget, PIN/biometrics, classic Joker, notifications, clock and compass.
APK installs as an update to existing 0.20/0.21 TEST signed with the same Android debug key; does not update the Play-installed 0.04.
Google OAuth requires Google Play services and a working connection. Login success on an actual phone is not yet confirmed.
Play release AAB still needs the existing stable signing key password. Do not upload debug APK.
APK SHA-256: dcd5ffe5f7961487eb711bdbca458a9e78d757e565e8b49107fbb402909ae322
