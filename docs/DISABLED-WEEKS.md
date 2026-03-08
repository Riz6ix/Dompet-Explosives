# 🚫 Minggu Nonaktif (Disabled Weeks)

## Apa Itu Minggu Nonaktif?

Fitur untuk menandai minggu-minggu tertentu sebagai **libur / nonaktif**, sehingga tidak dihitung dalam target saldo dan tunggakan. Cocok untuk minggu UTS, UAS, libur semester, atau hari besar.

---

## Cara Menggunakan

### Mengaktifkan Minggu Nonaktif
1. Buka tab **Pengaturan** ⚙️
2. Scroll ke bagian **"Minggu Nonaktif"**
3. Klik toggle pada minggu yang ingin dinonaktifkan
4. Minggu yang di-toggle akan berwarna merah dengan ikon ❌
5. Klik **Simpan** untuk menyimpan perubahan

### Menonaktifkan Kembali
- Klik toggle lagi pada minggu yang sudah nonaktif
- Minggu kembali aktif dan dihitung normal

---

## Pengaruh ke Perhitungan

### Yang TIDAK dihitung saat minggu nonaktif:
| Aspek | Penjelasan |
|-------|-----------|
| **Target saldo** | Minggu libur tidak menambah target (expected income) |
| **Tunggakan** | Siswa tidak dianggap menunggak di minggu libur |
| **Achievement** | Minggu libur di-skip saat cek streak lunas |
| **Progress bar** | Minggu libur tidak masuk hitungan total minggu |

### Yang TETAP dihitung:
| Aspek | Penjelasan |
|-------|-----------|
| **Saldo aktual** | Uang yang sudah masuk (termasuk deposit) tetap dihitung |
| **Transaksi** | Semua transaksi tetap tercatat |
| **Statistik** | Data tetap muncul di chart/grafik |

---

## Skenario Umum

### Skenario 1: Libur UTS (Minggu 8-9)

```
Minggu 1-7:  Aktif → Target = 7 × Rp5.000 × 36 siswa = Rp1.260.000
Minggu 8-9:  Nonaktif → Tidak tambah target
Minggu 10+:  Aktif → Target bertambah lagi
```

Jika di minggu 10, total target = (jumlah minggu aktif) × iuran × jumlah siswa.

### Skenario 2: Siswa Bayar di Minggu Libur (Deposit)

Jika siswa sudah bayar sebelum minggu ditandai libur, atau bendahara mencatat pembayaran di minggu libur:
- Uang **tidak hilang** — tetap masuk saldo
- Status berubah jadi **"💰 Deposit"**
- Otomatis di-carry ke minggu aktif berikutnya (lihat [Deposit Carry-Forward](./DEPOSIT-CARRY-FORWARD.md))

### Skenario 3: Disable Minggu yang Sudah Lewat

- Bisa dilakukan kapan saja
- Tunggakan langsung dihitung ulang (berkurang)
- Siswa yang tadinya "nunggak" di minggu itu otomatis terbebas
- Deposit carry-forward dihitung ulang

---

## Tampilan di Setiap Tab

### Dashboard
- Saldo target disesuaikan (minggu libur tidak dihitung)
- Alert tunggakan berkurang
- Rank/poin tetap

### Cek Bayar
- Dropdown minggu menampilkan semua minggu (termasuk libur)
- Minggu libur ditandai **(Libur)** di dropdown
- Pembayaran di minggu libur = **"💰 Deposit"** (kuning)

### Per Anggota
- Histori kas menampilkan minggu libur dengan status deposit (jika ada)
- Minggu libur tanpa pembayaran di-skip

### Iuran
- Target iuran disesuaikan dengan jumlah minggu aktif

### Statistik
- Grafik tetap menampilkan data lengkap
- Summary cards menyesuaikan target

### Pengaturan
- Grid toggle per minggu
- Warna merah + ❌ untuk minggu nonaktif
- Info text: *"Minggu nonaktif tidak dihitung dalam target saldo & tunggakan"*

---

## Implementasi Teknis

### Storage

```javascript
// localStorage key: kasKelas_disabledWeeks
{
  "3": true,   // Minggu 3 nonaktif
  "7": true,   // Minggu 7 nonaktif
  "8": true,   // Minggu 8 nonaktif
}
```

- Key = nomor minggu (string)
- Value = `true` jika nonaktif
- Minggu yang tidak ada di object = aktif

### State di App.jsx

```javascript
const [disabledWeeks, setDisabledWeeks] = React.useState({});

// Load dari localStorage
setDisabledWeeks(safeJSONParse("kasKelas_disabledWeeks", {}));
```

### Penggunaan di Kalkulasi

```javascript
// Skip minggu libur di loop perhitungan tunggakan
for (let w = 1; w <= currentWeek; w++) {
  if (disabledWeeks[w]) continue;  // Skip minggu libur
  // ... hitung tunggakan
}

// Tapi TETAP hitung di saldo (deposit masuk)
// Saldo = semua kasMingguan yang true × KAS_MINGGUAN_AMOUNT
```

### Files yang Terlibat
| File | Fungsi |
|------|--------|
| `App.jsx` | State management, kalkulasi saldo/tunggakan, export/import |
| `PengaturanTab.jsx` | UI toggle per minggu |
| `CekBayarTab.jsx` | Tampilan status deposit |
| `PerAnggotaTab.jsx` | Histori kas per anggota |
| `DashboardTab.jsx` | Summary cards + alerts |
| `calculations.js` | Helper kalkulasi |

---

## Interaksi dengan Fitur Lain

| Fitur | Interaksi |
|-------|-----------|
| **Deposit Carry-Forward** | Deposit di minggu libur auto-carry ke minggu aktif |
| **Export/Import Data** | `disabledWeeks` termasuk dalam export JSON |
| **Laporan PDF** | Minggu libur ditandai di laporan |
| **Quest/Achievement** | Minggu libur di-skip saat cek achievement |
| **First Setup** | Default semua minggu aktif |
