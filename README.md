# WEEKLY+ 0.24 Android TEST

This file is a *test APK only*. It updates existing 0.23 TEST signed with the same debug cert, and does not change the Google Play 0.04 install.

Changes requested only:
- Restore Google account panel appearance (user avatar, display name and email, actions), preserving native Google Firebase auth. Cloud check is read-only, not full sync.
- Restore classic 0.19 Joker 24-row board with four players and editable Bid/Won fields and auto scoring. Preserves the old stored JokerHistory preferences; imports existing rounds once into separate classic-sheet storage.
- Journal images: separate Camera and Gallery pickers, thumbnails. Old entries remain.
- Android back gesture from subpages and tabs.
- Improved magnetic compass with heading, tick marks and a proper rotating red/white north needle.

No other app features or Play signing changed. Phone QA still required.
No AAB built for this version.

SHA-256: 0e800891e110c7b270f7e394767bfcbe075e4ee818dbfa002e26565bb9237a9c
