/**
 * useAutoSave.js
 * Hook untuk auto-save semua data ke localStorage
 * Debounced 1 detik — gak langsung save setiap perubahan
 *
 * Menggantikan "SINGLE SOLID SAVE EFFECT" dari original index.html
 *
 * @param {Object} dataMap - Object { key: value } yang mau disave
 *   contoh: { kasKelas_transactions: transactions, kasKelas_members: members }
 * @param {boolean} isReady - Apakah data sudah loaded? (prevent save data kosong)
 * @param {React.MutableRefObject} isSavingDisabled - Ref flag untuk disable save sementara
 */

import { useEffect } from "react";

const useAutoSave = (dataMap, isReady, isSavingDisabled = { current: false }) => {
  useEffect(() => {
    // Jangan save kalau data belum loaded atau saving disabled
    if (!isReady || isSavingDisabled.current) return;

    const saveTimer = setTimeout(() => {
      if (isSavingDisabled.current) return;
      try {
        Object.entries(dataMap).forEach(([key, value]) => {
          localStorage.setItem(key, JSON.stringify(value));
        });
      } catch (error) {
        console.warn("Gagal menyimpan data:", error);
      }
    }, 1000); // Debounce 1 detik

    return () => clearTimeout(saveTimer);
  }, [dataMap, isReady]);
  // Note: dataMap sebagai dependency — setiap kali ada state berubah, timer direset
};

export default useAutoSave;
