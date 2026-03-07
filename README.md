<p align="center">
  <img src="public/favicon.svg" width="120" alt="KasKelas Logo" />
</p>

<h1 align="center">KasKelas XII-F5</h1>

<p align="center">
  <strong>A Modern Class Cash Management WebApp — Smart, Fast, and Fun</strong>
  <br />
  <i>Aplikasi Manajemen Kas Kelas Modern — Cerdas, Cepat, dan Menyenangkan</i>
</p>

<p align="center">
  <a href="#english">English</a> • <a href="#indonesia">Bahasa Indonesia</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19.2-61DAFB?logo=react&logoColor=white" alt="React" />
  <img src="https://img.shields.io/badge/Vite-8.0_beta-646CFF?logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4.2-06B6D4?logo=tailwindcss&logoColor=white" alt="Tailwind" />
  <img src="https://img.shields.io/badge/License-MIT-green" alt="License" />
  <img src="https://img.shields.io/badge/Offline--First-Support-blue" alt="Offline-First" />
  <img src="https://img.shields.io/github/stars/Riz6ix/KasKelas-WebApp?style=social" alt="GitHub stars" />
</p>

---

<a name="english"></a>
## 🌐 English Version

### 🎯 About the Project
**KasKelas** is a powerful yet lightweight web application designed specifically for class treasurers. It simplifies the tedious task of managing weekly dues, special contributions, installments, and expenses with a modern, gamified interface. Built with an **offline-first** approach, your data stays private and accessible without needing a server.

### ✨ Key Features

#### 💰 Finance Management
- **Smart Dashboard**: Real-time balance summaries, income vs. expense charts, and daily financial tips.
- **Weekly Tracking**: Easily monitor student payments per week with simple status toggles.
- **Special Dues**: Create custom contributions with deadlines and track collection progress.
- **Installment System**: Students can pay in installments; the system automatically marks them as paid once the target is met.
- **Transaction History**: Log every penny with categories, filters, and instant search.
- **Member Portfolios**: Detailed payment history for every individual student.

#### 📊 Reporting & Analytics
- **Visual Statistics**: Beautiful charts (Chart.js) showing weekly trends and expense distributions.
- **PDF Export**: Generate professional Master Reports (balance, summaries, member details).
- **CSV Export**: Export data to spreadsheets for further processing.
- **WhatsApp Summary**: One-click "copy-to-clipboard" summaries ready to share in class groups.

#### 🎮 Gamification (RPG System)
- **XP & Leveling**: Earn XP for every action (logging transactions, backups, exports).
- **Login Streaks**: Build daily streaks to boost your status.
- **Achievements**: Unlock 10+ badges like "Model Treasurer", "Sigma Grindset", and "Debt Slayer".
- **Quests**: Complete daily and weekly challenges to level up faster.

#### 🔒 Security & Utility
- **PIN Protection**: Secure your app with a 4-6 digit PIN.
- **Backup & Restore**: Full JSON export/import functionality.
- **Auto-Save**: Automatic data persistence to `localStorage` (1s debounce).
- **Immersive UX**: Interactive sound effects and haptic feedback.

---

<a name="indonesia"></a>
## 🇮🇩 Versi Bahasa Indonesia

### 🎯 Tentang Proyek
**KasKelas** adalah web aplikasi yang ringan namun bertenaga, dirancang khusus untuk bendahara kelas. Aplikasi ini menyederhanakan tugas membosankan dalam mengelola kas mingguan, iuran khusus, cicilan, dan pengeluaran dengan antarmuka modern yang tergamifikasi. Dibuat dengan pendekatan **offline-first**, data Anda tetap privat dan dapat diakses tanpa memerlukan server.

### ✨ Fitur Utama

#### 💰 Manajemen Keuangan
- **Dashboard Cerdas**: Ringkasan saldo real-time, grafik pemasukan vs pengeluaran, dan tips keuangan harian.
- **Pelacakan Mingguan**: Pantau pembayaran siswa per minggu dengan mudah.
- **Iuran Khusus**: Buat iuran kustom dengan tenggat waktu dan pantau progres pengumpulan.
- **Sistem Cicilan**: Siswa dapat mencicil pembayaran; sistem otomatis menandai lunas saat target tercapai.
- **Riwayat Transaksi**: Catat setiap pengeluaran/pemasukan dengan kategori, filter, dan pencarian instan.
- **Portofolio Anggota**: Detail riwayat pembayaran lengkap untuk setiap siswa.

#### 📊 Laporan & Analistik
- **Statistik Visual**: Grafik cantik (Chart.js) yang menunjukkan tren mingguan dan distribusi pengeluaran.
- **Ekspor PDF**: Hasilkan Laporan Master profesional (saldo, ringkasan, detail anggota).
- **Ekspor CSV**: Ekspor data ke format spreadsheet untuk pengolahan lebih lanjut.
- **Ringkasan WhatsApp**: Salin ringkasan teks siap kirim ke grup kelas hanya dengan satu klik.

#### 🎮 Gamifikasi (Sistem RPG)
- **XP & Level**: Dapatkan XP untuk setiap aktivitas (mencatat transaksi, backup, ekspor).
- **Streak Login**: Bangun streak harian untuk meningkatkan status Anda.
- **Achievement**: Buka 10+ lencana seperti "Bendahara Teladan", "Sigma Grindset", dan "Pelunas Hutang".
- **Quest**: Selesaikan tantangan harian dan mingguan untuk naik level lebih cepat.

#### 🔒 Keamanan & Utilitas
- **Proteksi PIN**: Amankan aplikasi Anda dengan PIN 4-6 digit.
- **Backup & Restore**: Fungsi ekspor/impor JSON penuh untuk keamanan data.
- **Simpan Otomatis**: Penyimpanan data otomatis ke `localStorage` (debounce 1 detik).
- **UX Imersif**: Efek suara interaktif dan umpan balik haptic.

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 19.2 (Vite) |
| **Styling** | Tailwind CSS 4.2 |
| **Icons** | Lucide React |
| **Charts** | Chart.js |
| **PDF Engine** | jsPDF + jsPDF-AutoTable |
| **Animations** | CSS Keyframes + Canvas Confetti |
| **Storage** | localStorage (Offline-first) |

---

## 🚀 Getting Started / Memulai

### Prerequisites
- Node.js 18+
- npm 9+

### Installation

```bash
# Clone the repository
git clone https://github.com/Riz6ix/KasKelas-WebApp.git

# Enter the directory
cd KasKelas-WebApp

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:5173` in your browser.

---

## 🛣️ Roadmap

- [ ] **Multi-Class Support**: Manage multiple class databases in one app.
- [ ] **Cloud Sync**: Optional Supabase/Firebase integration for real-time collaboration.
- [ ] **Dark/Light Mode**: Full theme customization options.
- [ ] **Mobile App (PWA)**: Enhanced service workers for better offline experience.
- [ ] **Data Encryption**: End-to-end encryption for sensitive local data.

---

## 🛡️ Data & Privacy

- **100% Client-Side**: All data is stored in your browser's `localStorage`. No data ever leaves your device.
- **Manual Backups**: We highly recommend using the **Backup** feature regularly to save your data as a JSON file.
- **Encryption**: PIN protection is local; ensure you don't clear your browser cache unless you have a backup.

---

## 🤝 Contributing

Contributions are welcome! Please check the [CONTRIBUTING.md](CONTRIBUTING.md) for details.

## 📄 License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Iky Setiawan**
- GitHub: [@Riz6ix](https://github.com/Riz6ix)
- Role: Class Treasurer XII-F5

---

<p align="center">
  <i>Developed with ❤️ for a better class management experience.</i>
</p>

<!-- SEO Tags -->
<!-- Keywords: Kas Kelas, Management App, React Finance, Class Treasurer App, Bendahara Kelas, Aplikasi Kas, WebApp Offline-First, Gamified Finance -->
