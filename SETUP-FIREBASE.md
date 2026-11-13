# Sinkronisasi StudentFlow
Config project `studentflow-befb2` sudah tertanam di index.html (const FBC). Yang perlu dicek di Firebase Console:
1. Authentication > Sign-in method > aktifkan **Google**.
2. Authentication > Settings > Authorized domains > tambahkan domain deploy (mis. studentflow.vercel.app).
3. Firestore Database > Create database > tab Rules > tempel isi `firestore.rules` > Publish.
Data tersimpan di `users/{uid}/studentflow/data`; versi terbaru yang menang.
