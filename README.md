<p align="center">
  <img src="public/favicon.svg" width="100" alt="Dompet Explosives Logo" />
</p>

<h1 align="center">Dompet Explosives 💣</h1>
<h3 align="center">Aplikasi Manajemen Kas Kelas Modern</h3>

<p align="center">
  Manage uang kelas tanpa ribet. Offline-first, gamified, dan seru.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white" alt="React" />
  <img src="https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss&logoColor=white" alt="Tailwind" />
  <img src="https://img.shields.io/badge/License-MIT-green" alt="License" />
  <img src="https://img.shields.io/badge/Storage-Offline--First-blue" alt="Offline-First" />
</p>

<p align="center">
  <a href="https://kaskelasxiif5.vercel.app" target="_blank"><strong>🌐 Live Demo</strong></a>
</p>

---

## Apa Sih Ini?

**Dompet Explosives** adalah web app buat bendahara kelas yang capek ngitung manual. Semua serba otomatis — dari tracking kas mingguan, iuran, cicilan, sampe generate laporan PDF yang tinggal print.

Oh iya, ada sistem **RPG** juga. Jadi makin rajin ngurus kas, makin naik level. Biar gak boring.

Data 100% disimpan di browser kamu (localStorage). Gak ada server, gak ada yang bisa intip. Privacy first.

---

## Features

### 💰 Finance Core
- **Dashboard** — Ringkasan saldo, chart pemasukan vs pengeluaran, daily tips
- **Kas Mingguan** — Track pembayaran per minggu, toggle lunas/belum, progress bar
- **Iuran** — Custom iuran dengan deadline, pantau siapa yang udah bayar
- **Cicilan** — Bayar nyicil? Bisa. Auto-mark lunas kalau udah cukup
- **Transaksi** — Log semua pemasukan/pengeluaran dengan kategori & search
- **Per Anggota** — Detail lengkap per siswa, payment history, progress

### 📊 Reporting
- **PDF Export** — Laporan resmi lengkap, tinggal print buat wali kelas
- **CSV Export** — Export ke spreadsheet buat diolah lebih lanjut
- **Copy Report** — Satu klik, langsung paste ke grup WhatsApp

### 🎮 Gamification
- **XP & Level** — Setiap aksi dapet XP. Backup data? XP. Export PDF? XP.
- **Daily & Weekly Quest** — Challenge harian dan mingguan
- **Achievement** — 10+ badge kayak "Bendahara Teladan", "Sigma Grindset", "Debt Slayer"
- **Login Streak** — Streak harian, jangan sampe putus

### 🔒 Security & Utils
- **PIN Lock** — Kunci app pake PIN 4-6 digit
- **Backup & Restore** — Export/import data JSON kapan aja
- **Auto-Save** — Data otomatis kesimpan setiap ada perubahan
- **Sound & Haptics** — Efek suara satisfying buat setiap aksi

---

## Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React 19 + Vite 8 |
| Styling | Tailwind CSS 4 |
| Icons | Lucide (CDN) |
| Charts | Chart.js |
| PDF | jsPDF + AutoTable |
| Animation | CSS Keyframes + Canvas Confetti |
| Storage | localStorage (offline-first) |

---

## Quick Start

### Yang Dibutuhin
- Node.js 18+
- npm 9+

### Setup

```bash
# Clone repo
git clone https://github.com/Riz6ix/Dompet-Explosives.git

# Masuk folder
cd Dompet-Explosives

# Install dependencies
npm install

# Jalanin dev server
npm run dev
```

Buka `http://localhost:5173` dan langsung setup kelas kamu.

---

## Project Structure

```
src/
├── components/       # UI components (FirstSetup, Toast, Icons, dll)
├── constants/        # Config, member defaults
├── features/         # Tab-based features
│   ├── cek-bayar/    # Cek status pembayaran
│   ├── cicilan/      # Manage cicilan
│   ├── dashboard/    # Main dashboard
│   ├── iuran/        # Iuran management
│   ├── pengaturan/   # Settings & member management
│   ├── per-anggota/  # Detail per siswa
│   ├── quest/        # RPG quest system
│   ├── statistik/    # Charts & analytics
│   └── transaksi/    # Transaction log
├── hooks/            # Custom hooks (localStorage, toast, finance calc)
├── styles/           # CSS (theme, animations, components)
├── utils/            # Helper functions (formatters, calculations)
└── App.jsx           # Main app + PDF generation + backup/restore
```

---

## Data & Privacy

- **100% Client-Side** — Semua data cuma ada di browser kamu. Nothing goes to any server.
- **Backup Regularly** — Sering-sering backup, jangan sampe clear cache tanpa backup.
- **PIN Protection** — Lock screen buat jaga data dari tangan-tangan jahil.

---

## Roadmap

- [ ] Multi-class support — Manage beberapa kelas sekaligus
- [ ] Cloud sync — Optional, buat yang mau kolaborasi real-time
- [ ] Dark mode — Karena mata juga butuh istirahat
- [ ] PWA upgrade — Biar makin smooth di mobile
- [ ] Data encryption — Extra layer keamanan

---

## Contributing

Mau contribute? Boleh banget. Cek [CONTRIBUTING.md](CONTRIBUTING.md) dulu ya.

## License

MIT License — bebas dipake, dimodif, di-fork. Cek [LICENSE](LICENSE).

## Author

**Iky Setiawan** — [@Riz6ix](https://github.com/Riz6ix)

---

<p align="center">
  Built with ☕ and a lot of debugging.
</p>

<!-- SEO: kas kelas, bendahara kelas, manajemen keuangan kelas, class finance app, react offline-first, gamified finance -->
