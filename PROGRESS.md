# PROGRESS — Rebuild Kelas 7.2

Rebuild total (bukan lanjutan build lama) sesuai spec baru dari user.
Ketik "lanjut" di chat kalau sesi kepotong limit — lanjutkan dari checklist di bawah.

## Keputusan tetap (jangan diubah tanpa persetujuan eksplisit user)
- Bypass Login (ambil alih akun siswa tanpa password) — TIDAK dibangun. Diganti "Lihat sebagai" read-only + log, khusus admin utama.
- Tanggal lahir — hanya terlihat untuk user yang sudah login (lihat rules.json: students/$no/private).
- Nomor WA — DIsimpan (sesuai permintaan user), di path `verification_requests` yang tidak bisa dibaca client biasa.
- PIN admin — di-hash SHA-256, tidak pernah disimpan/ditampilkan plaintext di kode.
- Tema default saat pertama kali dibuka: HUT RI 81.

## Checklist
- [x] Design tokens (warna, tipografi, spacing) — src/styles/tokens.css
- [x] Base layout/component styles — src/styles/base.css
- [x] Firebase init helper — src/lib/firebase.js
- [x] Draft Database Rules — rules.json
- [x] index.html — dashboard/daftar siswa (preview desain)
- [x] detail.html — profil siswa (dob terkunci sebelum login)
- [x] login.html — alur Google login → klaim MyProfil (form nama/absen/WA) → status menunggu verifikasi
- [x] myprofil.html — edit profil (foto link, cita-cita, gender, tanggal lahir, medsos, jabatan kelas [perlu verifikasi admin utama 1])
- [x] status.html — feed status ala WhatsApp
- [x] chat.html — grup + private (UI/UX selesai; sticker panel jalan; kirim pesan real & video/voice call Jitsi menyusul)
- [x] jadwal.html — jadwal pelajaran (DATA CONTOH, tunggu file asli) + jadwal piket (Bisma sudah ditambahkan di Sabtu)
- [x] sholat.html — jadwal live via Aladhan API (method 20/Kemenag, koordinat Tambun Utara) + countdown + toggle adzan/notif/murottal
- [x] quran.html — daftar surah + ayat (Arab+terjemah+audio, via API equran.id) + tombol tafsir
- [x] admin/ — login.html (ID+PIN, hash SHA-256), dashboard.html (verifikasi MyProfil, broadcast, album/akun/tema/event/kas/saran placeholder sesuai role, "Lihat Sebagai" read-only+log menggantikan bypass login)
- [x] event.html — daftar event + form daftar turnamen ML, gated login
- [x] album.html — galeri masonry, approved publik, upload baru masuk antrean admin
- [x] game.html — 4 game placeholder "segera hadir"
- [x] tentang.html — info sekolah, link maps, tombol install PWA, footer credit Tama Studio & PD Nur Cahaya
- [x] Tema musiman lain — src/lib/theme.js (auto by tanggal + manual override live via site_theme di DB); Maulid Nabi/Isra Mi'raj perlu diisi manual tiap tahun (kalender Hijriah)
- [x] manifest.json + sw.js (PWA installable, offline cache, push notif handler) — ikon per-tema (public/icons/*) belum ada file asli, masih referensi path
- [x] FCM handler ada di sw.js/firebase.js; broadcast admin ada di dashboard.html; adzan/kas reminder terhubung ke pengaturan masing-masing halaman (pengiriman terjadwal butuh Cloud Function server-side)
- [x] src/lib/birthday.js — modal tiup lilin+confetti saat login di hari ultah; notifikasi jam 00.00 ke semua orang WAJIB pakai Cloud Function terjadwal (dicatat di komentar kode)
- [x] Cloud Functions (functions/index.js): checkBirthdays, checkAdzanTime, weeklyKasReminder, verifyAdminLogin (PIN dicek server-side), logViewAs (audit log anti-manipulasi client). firebase.json menghubungkan hosting+functions+rules.
- [ ] Review keamanan akhir + validasi rules.json di Firebase Console + deploy `firebase deploy`

## Update — perbaikan bug & gating login
- [x] Bug 404 CSS: tokens.css & base.css dipindah ke root, semua halaman pakai path absolut `/tokens.css` `/base.css` (bukan relatif) — aman dari kedalaman folder manapun (termasuk admin/)
- [x] Favicon ditambahkan (favicon.svg) di semua halaman
- [x] sw.js diperbarui, cache path menyesuaikan lokasi CSS baru
- [x] Footer bersama (src/components/footer.js) dengan logo asli Tama Studio & PD Nur Cahaya + tombol "Download APK Class" — terpasang di semua halaman publik
- [x] Sistem tier akses (src/lib/auth-guard.js): guest / google / verified
  - Status Kelas & Album: tamu boleh lihat, posting/upload wajib verified
  - Sholat, Qur'an, Jadwal & Piket, Fun Game: bebas tanpa login
  - Event: tamu boleh lihat daftar event, daftar ikut wajib verified — turnamen ML yang sudah selesai dikosongkan (tinggal isi lagi via dashboard admin saat ada event baru)
  - Chat (grup & pribadi): terkunci total kecuali verified — ada lock-screen penuh + nav Chat ditandai gembok untuk yang belum verified

## Update — data asli, avatar, kredit, PWA, editor konten
- [x] jadwal.html diisi data asli (Jadwal Pelajaran MTs Miftahul Huda TP 2026-2027 + Jadwal Piket Kelas 7.2), termasuk Bisma tetap ditambahkan di piket Sabtu sesuai permintaan sebelumnya
- [x] Tahun ajaran diperbaiki ke 2026/2027 di tentang.html
- [x] Avatar default diganti jadi ikon siluet abu-abu (public/images/default-avatar.png) di semua kartu siswa, chat, status, profil, admin — ganti inisial berwarna
- [x] Tulisan "Preview sistem desain..." di index.html dihapus, diganti kredit pengembang (logo Tama Studio + PD Nur Cahaya) di area yang sama
- [x] Tombol download/install app diperbaiki jadi fungsional beneran: service worker didaftarkan (sebelumnya nggak pernah dipanggil sama sekali — itu penyebab tombolnya cuma simulasi), fallback instruksi manual untuk iOS/browser yang belum trigger prompt
- [x] Ikon PWA asli (192/512, termasuk maskable) sudah dibuat, manifest.json valid
- [x] Modul "Kelola Tampilan" (admin/dashboard.html, khusus Admin Utama 1) — edit teks hero beranda tanpa deploy ulang, tersimpan di site_content/hero, index.html baca live dari situ
- [ ] Catatan keamanan: site_content saat ini bisa ditulis siapa saja yang login (rules.json) — perlu diperketat lewat Cloud Function + custom claim role sebelum publish ke siswa/i sungguhan
- [ ] Fitur "tambah kode sendiri + auto-deploy tanpa GitHub" — BELUM dibangun, perlu keputusan user dulu (lihat penjelasan di chat) karena menyangkut GitHub token & risiko keamanan

## Update — keamanan Kelola Tampilan
- [x] site_content dipindah jadi write-only-lewat-server (rules.json ".write": false) — ditulis lewat Cloud Function updateSiteContent yang mengecek custom claim role === 'admin-utama-1'
- [x] admin/login.html sekarang benar-benar signInWithCustomToken() setelah verifyAdminLogin sukses, supaya role ke-attach ke sesi Firebase Auth (dipakai Cloud Function buat ngecek hak akses)
- [x] Kelola Tampilan diperluas: ada editor Banner (gambar + judul + link tujuan), tampil di index.html kalau diisi & visible=true

## Update — native app, fitur tersembunyi, video call
- [x] Nav Chat disembunyikan TOTAL (bukan digembok) untuk yang belum siswa/i terverifikasi — nggak keliatan sama sekali di sidebar sampai berhak akses
- [x] Video call di chat.html sekarang beneran jalan pakai Jitsi Meet External API (gratis) — tombol 📞🎥 buka overlay panggilan sungguhan, bukan dekorasi lagi
- [x] native-app/ — project Capacitor buat bungkus web app jadi APK Android native (bukan PWA lagi): capacitor.config.json, package.json, android-permissions-snippet.xml (izin kamera/mic buat video call), README.md step-by-step build
- [x] Tombol download di semua halaman diarahkan ke /downloads/kelas72.apk (file APK asli), cek dulu file-nya ada sebelum kasih tau siswa/i — bukan simulasi install PWA lagi
- [ ] APK asli belum ter-build — user/developer Tama Studio perlu jalankan langkah di native-app/README.md pakai Android Studio, lalu upload hasilnya ke public/downloads/kelas72.apk
