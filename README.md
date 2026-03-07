<p align="center">
  <img src="public/favicon.svg" width="80" alt="KasKelas Logo" />
</p>

<h1 align="center">KasKelas XII-F5</h1>

<p align="center">
  <strong>Aplikasi Manajemen Kas Kelas Modern — Cerdas, Cepat & Menyenangkan</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19.2-61DAFB?logo=react&logoColor=white" alt="React" />
  <img src="https://img.shields.io/badge/Vite-8.0_beta-646CFF?logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4.2-06B6D4?logo=tailwindcss&logoColor=white" alt="Tailwind" />
  <img src="https://img.shields.io/badge/License-MIT-green" alt="License" />
</p>

<p align="center">
  Dibuat khusus untuk bendahara kelas — kelola kas mingguan, iuran khusus, cicilan, transaksi, dan laporan keuangan dalam satu webapp yang ringan dan offline-first.
</p>

---

## Fitur Utama

### Keuangan
- **Dashboard** — Ringkasan saldo real-time, grafik pemasukan vs pengeluaran, tips harian
- **Kas Mingguan** — Tracking pembayaran per siswa per minggu, toggle lunas/belum bayar
- **Iuran Khusus** — Buat iuran dengan deadline, pantau progres pengumpulan
- **Cicilan** — Siswa bisa bayar cicilan untuk kas maupun iuran, otomatis lunas ketika tercukupi
- **Transaksi** — Catat pemasukan & pengeluaran dengan kategori, filter, dan pencarian
- **Per Anggota** — Lihat detail pembayaran lengkap per siswa

### Statistik & Laporan
- **Statistik** — Grafik Chart.js: tren mingguan, distribusi kategori pengeluaran
- **Export PDF** — Master Report lengkap via jsPDF (saldo, ringkasan, detail per anggota)
- **Export CSV** — Data kas mingguan & iuran dalam format spreadsheet
- **Laporan Grup** — Copy-paste text summary siap kirim ke grup WhatsApp

### Gamifikasi (RPG System)
- **XP & Level** — Dapatkan XP dari aktivitas (catat transaksi, backup, export)
- **Streak** — Login harian berturut-turut meningkatkan streak
- **Achievements** — 10+ achievement seperti "Bendahara Teladan", "Sigma Grindset", "Full Lunas"
- **Quest** — Tantangan harian & mingguan dengan reward XP

### Keamanan & Utilitas
- **PIN Lock** — Kunci aplikasi dengan PIN 4-6 digit
- **Backup & Restore** — Export/import seluruh data sebagai file JSON
- **Auto-Save** — Data tersimpan otomatis ke localStorage (debounced 1 detik)
- **Sound Effects** — Efek suara interaktif (bisa di-toggle on/off)
- **First Setup Wizard** — Panduan setup awal: nama kelas, nominal kas, daftar anggota

---

## Tech Stack

| Layer | Teknologi |
|-------|-----------|
| Framework | React 19.2 (CDN + Vite) |
| Build Tool | Vite 8.0 beta + Rolldown |
| Styling | Tailwind CSS 4.2 |
| Icons | Lucide React |
| Charts | Chart.js (CDN) |
| PDF | jsPDF + jsPDF-AutoTable |
| Animations | CSS Keyframes + Canvas Confetti |
| Storage | localStorage (offline-first, no database) |

---

## Struktur Proyek

```
kas-kelas/
├── public/
│   └── favicon.svg
├── src/
│   ├── App.jsx                  # Komponen utama (~4800 baris)
│   ├── App.css                  # Global styles
│   ├── main.jsx                 # Entry point
│   ├── components/
│   │   ├── FirstSetup.jsx       # Wizard setup awal
│   │   └── ui/                  # Komponen UI reusable
│   │       ├── AnimatedNumber.jsx
│   │       ├── AnimatedNumberWithTrend.jsx
│   │       ├── ErrorBoundary.jsx
│   │       ├── IconDisplay.jsx
│   │       ├── Icons.jsx        # Custom SVG icons
│   │       ├── LucideIcon.jsx
│   │       └── Toast.jsx
│   ├── features/
│   │   ├── dashboard/           # Tab Dashboard
│   │   ├── cek-bayar/           # Tab Cek Bayar (Kas & Iuran)
│   │   ├── iuran/               # Tab Iuran Khusus
│   │   ├── cicilan/             # Tab Cicilan
│   │   ├── transaksi/           # Tab Transaksi
│   │   ├── per-anggota/         # Tab Per Anggota
│   │   ├── statistik/           # Tab Statistik & Grafik
│   │   ├── quest/               # Tab Quest & Achievement
│   │   └── pengaturan/          # Tab Pengaturan
│   ├── hooks/
│   │   ├── useAutoSave.js       # Debounced localStorage save
│   │   ├── useFinanceCalculations.js
│   │   ├── useLocalStorage.js
│   │   └── useToast.js
│   ├── utils/
│   │   ├── calculations.js      # Week & date calculations
│   │   ├── formatters.js        # Currency & date formatting
│   │   └── haptics.js           # Vibration API
│   ├── constants/
│   │   ├── config.js            # App configuration defaults
│   │   ├── members.js           # Default member data
│   │   └── tips.js              # Daily tips content
│   └── styles/
│       ├── theme.css            # Color tokens & glassmorphism
│       ├── components.css       # Component styles
│       └── animations.css       # All @keyframes
├── index.html                   # HTML entry + CDN scripts
├── vite.config.js
├── package.json
└── eslint.config.js
```

---

## Quick Start

### Prerequisites
- Node.js 18+
- npm 9+

### Install & Run

```bash
# Clone repository
git clone https://github.com/Riz6ix/KasKelas-WebApp.git
cd KasKelas-WebApp

# Install dependencies
npm install

# Jalankan dev server
npm run dev
```

Buka `http://localhost:5173` di browser.

### Build untuk Production

```bash
npm run build
```

Output di folder `dist/` — siap deploy ke Vercel, Netlify, atau hosting statis lainnya.

---

## Deploy ke Vercel

1. Push ke GitHub
2. Buka [vercel.com](https://vercel.com) → New Project → Import dari GitHub
3. Pilih repository `KasKelas-WebApp`
4. Framework Preset: **Vite**
5. Build Command: `npm run build`
6. Output Directory: `dist`
7. Klik **Deploy**

Vercel akan otomatis build & deploy setiap push ke `main`.

---

## Data & Privasi

- **Semua data tersimpan di localStorage browser** — tidak ada database eksternal
- **Tidak ada data yang dikirim ke server** — 100% offline-capable
- **Backup manual** — Export ke file JSON untuk backup, import untuk restore
- **PIN protection** — Opsional, PIN disimpan di localStorage (plaintext)

> **Penting:** Jika browser cache dihapus, data akan hilang. Rutin backup via menu Pengaturan.

---

## Keyboard Shortcuts

| Shortcut | Aksi |
|----------|------|
| Tab navigation | Swipe atau klik tab di bottom nav |

---

## Browser Support

| Browser | Status |
|---------|--------|
| Chrome 90+ | ✅ Full support |
| Firefox 90+ | ✅ Full support |
| Safari 15+ | ✅ Full support |
| Edge 90+ | ✅ Full support |
| Mobile Chrome/Safari | ✅ Optimized (responsive) |

---

## Contributing

Project ini dibuat untuk kebutuhan kelas XII-F5. Jika ingin kontribusi:

1. Fork repository
2. Buat branch fitur: `git checkout -b fitur-baru`
3. Commit perubahan: `git commit -m "Tambah fitur baru"`
4. Push: `git push origin fitur-baru`
5. Buka Pull Request

---

## Credits

Dibuat oleh **Muhamad Rizki Setiawan** ([@Riz6ix](https://github.com/Riz6ix))
Kelas XII-F5 — Bendahara Kelas

---

## License

MIT License — bebas digunakan, dimodifikasi, dan didistribusikan.
