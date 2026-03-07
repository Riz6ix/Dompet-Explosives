/**
 * config.js
 * Konfigurasi default aplikasi KasKelas
 */

// Nominal kas mingguan default (Rp)
export const DEFAULT_KAS_AMOUNT = 5000;

// Tanggal mulai perhitungan minggu
export const DEFAULT_START_DATE = "2025-08-04";

// Tipe transaksi
export const TRANSACTION_TYPES = {
  INCOME: "pemasukan",
  EXPENSE: "pengeluaran",
};

// Kategori pengeluaran + ikon Lucide
export const EXPENSE_CATEGORIES = [
  { id: "lainnya", label: "Lainnya", icon: "Tag" },
  { id: "konsumsi", label: "Konsumsi", icon: "Coffee" },
  { id: "atk", label: "Alat Tulis / Foto Copy", icon: "PenTool" },
  { id: "kebersihan", label: "Kebersihan", icon: "Trash2" },
  { id: "sosial", label: "Sosial / Duka", icon: "Heart" },
  { id: "acara", label: "Acara / Lomba", icon: "Trophy" },
  { id: "sarana", label: "Sarana Prasarana", icon: "Wrench" },
];

// Key localStorage yang dipakai aplikasi
export const STORAGE_KEYS = {
  CONFIG: "kasKelas_config",
  MEMBERS: "kasKelas_members",
  ACTIVITIES: "kasKelas_activities",
  ACTIVITIES_LEGACY: "kasKelasActivities",
  LAST_BACKUP: "kasKelas/lastBackupDate",
};

// Pagination
export const ITEMS_PER_PAGE = 10;
