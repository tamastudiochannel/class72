# Kelas 7.2 — MTs Miftahul Huda

## Struktur repo ini
Semua file di sini masuk ke GitHub repo yang sama, tapi **dideploy ke tempat berbeda**:

| Bagian | Isi | Cara deploy |
|---|---|---|
| File statis (root + `src/`) | Semua `.html`, `manifest.json`, `sw.js`, `src/styles`, `src/lib` | **Netlify** — connect repo ini, publish directory `.` (sudah diatur di `netlify.toml`) |
| `rules.json` | Aturan keamanan Realtime Database | **Firebase Console** → Realtime Database → Rules → tempel isi file ini → Publish |
| `functions/` | Cloud Functions (notifikasi terjadwal, verifikasi PIN admin) | **Firebase CLI**: `firebase deploy --only functions` (butuh `firebase init` sekali di awal) |
| `firebase.json` | Penghubung konfigurasi Firebase (hosting/functions/rules) | Dipakai otomatis oleh Firebase CLI saat kamu `firebase deploy` |

Netlify **tidak** menjalankan `functions/` (itu format Firebase Cloud Functions, beda runtime dari Netlify Functions) dan **tidak** menyentuh `rules.json` — dua itu WAJIB tetap lewat Firebase supaya notifikasi terjadwal & keamanan data (tanggal lahir, PIN admin) benar-benar aktif.

## Urutan deploy yang disarankan
1. Push repo ini ke GitHub.
2. Connect ke Netlify → deploy (otomatis pakai `netlify.toml`).
3. Login `firebase login` di komputer kamu → `firebase init` di folder ini (pilih Hosting *skip*, Database ✔, Functions ✔) → `firebase deploy --only database,functions`.
4. Isi `admins/{id}/pinHash` di Realtime Database dengan hash SHA-256 dari PIN (bukan PIN asli).
5. Tambahkan domain Netlify kamu ke Firebase Console → Authentication → Settings → Authorized domains.
6. Buat ikon PWA asli di `public/icons/` (192x192, 512x512, + versi maskable) — `manifest.json` sudah mereferensikan path ini.

Detail progres pembangunan & keputusan desain ada di `PROGRESS.md`.
