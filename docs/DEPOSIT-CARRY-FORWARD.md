# 💰 Deposit Carry-Forward

## Apa Itu Deposit Carry-Forward?

Fitur yang memungkinkan pembayaran kas di **minggu libur** (disabled week) otomatis "di-carry" ke minggu aktif berikutnya yang belum lunas. Jadi uang yang sudah masuk **tidak hilang** — tetap dihitung dan menutup tunggakan.

---

## Skenario

### Skenario 1: Bayar di Minggu Libur → Auto-Cover Minggu Aktif

| Minggu | Status | Keterangan |
|--------|--------|------------|
| M1 | ✅ Aktif — Lunas | Bayar normal |
| M2 | ✅ Aktif — Lunas | Bayar normal |
| M3 | 🔴 Libur — **Deposit** | Siswa bayar di minggu libur |
| M4 | ✅ Aktif — Belum bayar | — |
| M5 | ✅ Aktif — **Lunas (dari deposit M3)** | Otomatis di-cover |

**Apa yang terjadi:**
- M3 ditandai libur tapi siswa sudah bayar → status = **"💰 Deposit"**
- Deposit M3 di-carry ke M5 (minggu aktif pertama yang belum lunas)
- M5 tampil **"✓ Lunas (deposit M3)"** — siswa tidak perlu bayar lagi

### Skenario 2: Multiple Deposit

| Minggu | Anggota A | Anggota B |
|--------|-----------|-----------|
| M3 (Libur) | 💰 Deposit → M5 | 💰 Deposit → M4 |
| M4 (Aktif) | ❌ Belum bayar | ✅ Lunas (deposit M3) |
| M5 (Aktif) | ✅ Lunas (deposit M3) | ❌ Belum bayar |

Setiap deposit di-carry secara **per-anggota** — satu deposit cover satu minggu aktif.

### Skenario 3: Deposit Tanpa Target

| Minggu | Status |
|--------|--------|
| M3 (Libur) | 💰 Deposit |
| M4 (Aktif) | ✅ Sudah lunas sendiri |
| M5 (Aktif) | ✅ Sudah lunas sendiri |

Jika semua minggu aktif sudah lunas, deposit tetap tercatat tapi belum ada target carry. Status = **"💰 Deposit (belum carry)"**. Deposit akan otomatis ter-carry begitu ada minggu aktif baru yang belum lunas.

---

## Bagaimana Saldo Dihitung?

```
Saldo = Total kas masuk (termasuk deposit) - Pengeluaran
```

- Deposit **SELALU** dihitung ke saldo total
- Uang yang masuk di minggu libur tetap masuk ke kas
- `disabledWeeks` skip **HANYA** di penghitungan tunggakan/target, bukan di saldo

---

## Pengaruh ke Fitur Lain

### Dashboard
- **Saldo**: Deposit ikut dihitung
- **Tunggakan**: Minggu yang di-cover deposit **tidak** dihitung sebagai tunggakan
- **Progress bar**: Deposit di-count sebagai lunas

### Cek Bayar
- Minggu libur + sudah bayar = badge **"💰 Deposit"** (kuning)
- Detail menampilkan "Di-carry ke Minggu X"
- Minggu aktif yang di-cover = badge **"✓ Lunas"** (hijau) + detail "Lunas dari deposit Minggu X"

### Per Anggota
- Histori kas menampilkan baris deposit dengan label "💰 Deposit → MX"
- Minggu yang di-cover deposit tampil dengan label "✓ Lunas (deposit MX)"

### Quest / Achievement
- `full_lunas_all` — deposit carry-forward **dihitung** sebagai lunas
- `sigma_grindset` (10 minggu berturut-turut full) — deposit carry-forward **dihitung**

### Statistik
- Deposit masuk ke total pemasukan
- Grafik mingguan menampilkan deposit sebagai income di minggu libur

### Laporan PDF
- Deposit tercatat di laporan dengan keterangan minggu sumber

---

## Implementasi Teknis

### Data Structure

```javascript
// depositCarryForward = useMemo(() => {...})
{
  carryMap: {
    "5-1": { fromWeek: 3 },    // M5 anggota no.1 → lunas dari deposit M3
    "5-2": { fromWeek: 3 },    // M5 anggota no.2 → lunas dari deposit M3
  },
  depositSourceMap: {
    "3-1": { targetWeek: 5 },  // Deposit M3 anggota no.1 → carry ke M5
    "3-2": { targetWeek: 5 },  // Deposit M3 anggota no.2 → carry ke M5
  }
}
```

### Key Format
- `"week-memberNo"` — contoh: `"3-1"` = Minggu 3, Anggota nomor 1

### Files yang Terlibat
| File | Fungsi |
|------|--------|
| `App.jsx` | `depositCarryForward` useMemo, saldo calculation, `getPaymentStatusDetail`, achievement checks |
| `CekBayarTab.jsx` | Render status deposit + carry di grid pembayaran |
| `PerAnggotaTab.jsx` | Render histori deposit + carry di detail anggota |

### Alur Logika
1. Loop semua anggota × semua minggu sampai `currentWeek`
2. Kalau minggu libur **DAN** sudah bayar → ini deposit
3. Cari minggu aktif berikutnya yang:
   - Bukan minggu libur
   - Belum lunas langsung (`kasMingguan[key] !== true`)
   - Belum di-carry dari deposit lain
4. Map: deposit source → target, target → source
5. Saldo: semua pembayaran dihitung (termasuk deposit)
6. Tunggakan: minggu yang di-carry **tidak** dihitung sebagai tunggakan

---

## Storage

Data disimpan di **localStorage** dengan prefix `kasKelas_`:

```
kasKelas_kasMingguan     → { "3-1": true, "5-1": true, ... }
kasKelas_disabledWeeks   → { "3": true, "7": true, ... }
```

`depositCarryForward` **tidak** disimpan — dihitung ulang (derived state) setiap render dari `kasMingguan` + `disabledWeeks`.
