# WEEKLY+ დღიური — Alpha 0.25 TEST

A debug APK only. This updates existing ge.weeklyplus.app.test 0.24 (versionCode 16) to versionCode 17 with the same testing certificate. The Play Store 0.04 package remains unchanged.

Scoped changes:
1. Joker: replace keyboard entry with the same Compose dropdown style as the language picker. Bid and Won fields offer em dash (not set), 0 = pass and 1..hand card maximum; hand 1 offers 0..1, hand 8 offers 0..8, hand 9 offers 0..9. Original score computation and saved state remain unchanged.
2. Separate Color Notes page under Other: colored cards, pin-to-top, search, create/edit/delete, optional folder labels, AES-GCM encrypted local storage using existing Android Keystore. Does not overwrite the existing personal journal or cloud records.
3. Navigation from Color Notes back to Other with Android back gesture.

No AAB produced. Other app files and Firebase configuration unmodified. App functionality still needs verification on an actual Android device.

APK SHA256: 10d8fb8f96df1f8ac8d7c36ff2eb04d22355e1314a56cc1db682f3bc6e26fd48
