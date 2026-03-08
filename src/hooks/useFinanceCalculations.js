/**
 * useFinanceCalculations.js
 * Hook untuk semua kalkulasi keuangan utama
 * 
 * SOURCE OF TRUTH: Semua angka pemasukan/pengeluaran/saldo dihitung di sini
 * Menggantikan useMemo block besar dari original index.html
 *
 * @param {Object} params
 * @param {Array} params.transactions - Semua transaksi manual
 * @param {Array} params.members - Data anggota (filter no !== 0)
 * @param {Object} params.kasMingguan - Status kas mingguan per member per week
 * @param {Array} params.iuranKhusus - Daftar iuran khusus
 * @param {Object} params.payments - Status pembayaran iuran khusus
 * @param {Object} params.cicilan - Data cicilan per key
 * @param {Object} params.disabledWeeks - Minggu yang dinonaktifkan
 * @param {number} params.currentWeek - Minggu ke berapa sekarang
 * @param {number} params.kasAmount - Nominal kas per minggu (dari config)
 *
 * @returns {{ totalPemasukan, totalPengeluaran, saldoAkhir, totalKasMingguan, totalIuranKhusus, totalCicilanTerbayar }}
 */

import { useMemo } from "react";

const useFinanceCalculations = ({
  transactions = [],
  members = [],
  kasMingguan = {},
  iuranKhusus = [],
  payments = {},
  cicilan = {},
  disabledWeeks = {},
  currentWeek = 1,
  kasAmount = 5000,
}) => {
  return useMemo(() => {
    const activeMembers = members.filter((m) => m.no !== 0);

    // 1. Pemasukan Manual (transaksi tipe "pemasukan")
    const manualIncome = transactions
      .filter((t) => t.type === "pemasukan")
      .reduce((sum, t) => sum + (t.amount || 0), 0);

    // 2. Total Kas Mingguan (Lunas + Cicilan)
    let kasTotal = 0;
    activeMembers.forEach((member) => {
      for (let w = 1; w <= currentWeek; w++) {
        if (disabledWeeks[w]) continue; // Skip minggu libur
        const key = `${w}-${member.no}`;
        if (kasMingguan[key] === true) {
          kasTotal += kasAmount;
        } else {
          // Hitung cicilan yang sudah dibayar
          const cicilanKey = `kas-${w}-${member.no}`;
          kasTotal += (cicilan[cicilanKey] || []).reduce(
            (sum, c) => sum + (c.amount || 0),
            0,
          );
        }
      }
    });

    // 3. Total Iuran Khusus (Lunas + Cicilan)
    let iuranTotal = 0;
    iuranKhusus.forEach((iuran) => {
      activeMembers.forEach((member) => {
        const key = `${iuran.id}-${member.no}`;
        if (payments[key] === true) {
          iuranTotal += Number(iuran.amount) || 0;
        } else {
          const cicilanKey = `iuran-${iuran.id}-${member.no}`;
          iuranTotal += (cicilan[cicilanKey] || []).reduce(
            (sum, c) => sum + (c.amount || 0),
            0,
          );
        }
      });
    });

    // 4. Total Pengeluaran
    const totalExpense = transactions
      .filter((t) => t.type === "pengeluaran")
      .reduce((sum, t) => sum + (t.amount || 0), 0);

    // 5. Hitung Total Cicilan Terbayar (untuk breakdown)
    // NOTE: totalCicilanTerbayar is a breakdown subset already included in totalPemasukan
    let cicilanTotal = 0;
    Object.values(cicilan).forEach((entries) => {
      if (Array.isArray(entries)) {
        cicilanTotal += entries.reduce((sum, c) => sum + (c.amount || 0), 0);
      }
    });

    const totalIncome = manualIncome + kasTotal + iuranTotal;

    return {
      totalPemasukan: totalIncome,
      totalPengeluaran: totalExpense,
      saldoAkhir: totalIncome - totalExpense,
      totalKasMingguan: kasTotal,
      totalIuranKhusus: iuranTotal,
      totalCicilanTerbayar: cicilanTotal,
    };
  }, [
    transactions,
    members,
    kasMingguan,
    iuranKhusus,
    payments,
    cicilan,
    disabledWeeks,
    currentWeek,
    kasAmount,
  ]);
};

export default useFinanceCalculations;
