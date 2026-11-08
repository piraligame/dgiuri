# DGIURI Alpha 0.16
- Removed the TOP priorities panel and task search field only from Today; category filters and hourly schedule remain.
- Added pin/unpin to each item in native General List. Newest pinned appears first; other items keep their original order.
- Persisted pinned and pinOrder fields in existing diary_native_modules_015 SharedPreferences JSON; older records load with unpinned defaults.
- Existing JSON backup/restore copies list verbatim, including pin metadata.
- Preserves package ge.weeklyplus.app, signing configuration, user data, and all existing Diary/Joker/Clock/Calendar features.
- Android versionCode 8, versionName 0.16-alpha; target SDK 36.
- This source is not a Google Play release until the AAB is published in the existing testing track.
