# Sinkronisasi StudentFlow (opsional, gratis paket Spark)
1. console.firebase.google.com > buat/pakai project > Authentication > aktifkan **Google**.
2. Authentication > Settings > Authorized domains > tambahkan domain deploy (mis. studentflow.vercel.app).
3. Firestore Database > Create database > tab Rules > tempel isi `firestore.rules` > Publish.
4. Project settings > Your apps > Web app > salin `firebaseConfig`.
5. Di StudentFlow: Pengaturan > tempel config > Simpan config > Masuk Google.
Data tersimpan di `users/{uid}/studentflow/data`; versi terbaru (berdasarkan waktu simpan) yang menang.
