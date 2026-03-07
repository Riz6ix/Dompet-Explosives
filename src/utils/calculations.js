/**
 * calculations.js
 * Fungsi-fungsi kalkulasi: minggu, tanggal minggu, dll.
 */

import { DEFAULT_START_DATE } from "../constants/config.js";

/**
 * Hitung minggu ke-berapa berdasarkan tanggal mulai
 * @param {string} startDateStr - Tanggal mulai (format ISO)
 * @returns {number} Nomor minggu saat ini (0 = belum dimulai)
 */
export const calculateWeek = (startDateStr) => {
  if (!startDateStr) return 1;
  const start = new Date(startDateStr);
  const now = new Date();

  // Jika sekarang belum sampai tanggal mulai, return 0 (Belum dimulai)
  if (now < start) return 0;

  const diffInMs = now - start;
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  return Math.floor(diffInDays / 7) + 1;
};

/**
 * Alias: hitung minggu saat ini pakai DEFAULT_START_DATE
 * Backward compatibility — nanti bisa diganti pakai appConfig.startDate
 * @returns {number} Nomor minggu saat ini
 */
export const getCalculatedCurrentWeek = () => calculateWeek(DEFAULT_START_DATE);

/**
 * Dapatkan rentang tanggal untuk minggu tertentu
 * @param {number} weekNumber - Nomor minggu (1-based)
 * @param {string} startDateStr - Tanggal mulai project (ISO format)
 * @returns {string} Contoh: "04 – 10 Agustus 2025"
 */
export const getWeekDate = (weekNumber, startDateStr) => {
  if (!startDateStr || isNaN(new Date(startDateStr).getTime())) return "—";
  const startDate = new Date(startDateStr);
  const startOfWeek = new Date(startDate);
  startOfWeek.setDate(startDate.getDate() + (weekNumber - 1) * 7);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);

  const startStr = startOfWeek.toLocaleDateString("id-ID", {
    day: "2-digit",
  });
  const endStr = endOfWeek.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return `${startStr} – ${endStr}`;
};