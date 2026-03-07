/**
 * formatters.js
 * Fungsi-fungsi formatting: mata uang, tanggal, dll.
 */

/**
 * Format angka ke mata uang Rupiah (IDR)
 * @param {number} amount - Jumlah uang
 * @returns {string} String terformat (contoh: "Rp 50.000")
 */
export const formatCurrency = (amount) => {
  if (amount == null || isNaN(amount)) return "Rp 0";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Format tanggal lengkap dengan jam
 * @param {string} dateString - String tanggal ISO
 * @returns {string} Contoh: "30 Des 2025, 14:00"
 */
export const formatDate = (dateString) => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "-";
  const options = {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };
  return date.toLocaleString("id-ID", options);
};

/**
 * Format tanggal singkat tanpa jam
 * @param {string} dateString - String tanggal ISO
 * @returns {string} Contoh: "30 Des 2025"
 */
export const formatDateShort = (dateString) => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "-";
  const options = { day: "numeric", month: "short", year: "numeric" };
  return date.toLocaleDateString("id-ID", options);
};

/**
 * Format tanggal dengan nama hari
 * Support format Indonesia (dd/mm/yyyy) dan ISO
 * @param {string} dateString - String tanggal
 * @returns {string} Contoh: "Senin, 4/8/2025"
 */
export const formatDateWithDay = (dateString) => {
  if (!dateString) return "—";
  const days = [
    "Minggu",
    "Senin",
    "Selasa",
    "Rabu",
    "Kamis",
    "Jumat",
    "Sabtu",
  ];

  // Parse tanggal dari format Indonesia (dd/mm/yyyy) atau format lain
  let date;
  if (dateString.includes("/")) {
    // Format Indonesia dd/mm/yyyy
    const parts = dateString.split("/");
    if (parts.length !== 3) return "—";
    date = new Date(parts[2], parts[1] - 1, parts[0]);
  } else {
    // Format lain (ISO, dll)
    date = new Date(dateString);
  }

  if (isNaN(date.getTime())) return "—";
  const dayName = days[date.getDay()];
  const formattedDate = date.toLocaleDateString("id-ID");

  return `${dayName}, ${formattedDate}`;
};
