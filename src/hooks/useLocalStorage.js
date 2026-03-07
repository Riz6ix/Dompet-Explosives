/**
 * useLocalStorage.js
 * Generic hook untuk baca/tulis data ke localStorage
 * - Auto JSON parse/stringify
 * - Safe fallback kalau data corrupt
 * - Lazy initialization (baca cuma sekali pas mount)
 *
 * @param {string} key - localStorage key
 * @param {*} defaultValue - Nilai default kalau key belum ada
 * @returns {[value, setValue]} - Seperti useState biasa
 */

import { useState, useCallback } from "react";

const useLocalStorage = (key, defaultValue) => {
  // Lazy init — baca dari localStorage cuma sekali
  const [value, setValue] = useState(() => {
    try {
      const saved = localStorage.getItem(key);
      if (saved === null) return defaultValue;
      return JSON.parse(saved);
    } catch (error) {
      console.error(`Error parsing localStorage key "${key}":`, error);
      localStorage.removeItem(key);
      return defaultValue;
    }
  });

  // Wrapper setter yang otomatis sync ke localStorage
  const setStoredValue = useCallback(
    (newValue) => {
      setValue((prev) => {
        const resolved =
          typeof newValue === "function" ? newValue(prev) : newValue;
        try {
          localStorage.setItem(key, JSON.stringify(resolved));
        } catch (error) {
          console.warn(`Failed to save to localStorage key "${key}":`, error);
        }
        return resolved;
      });
    },
    [key],
  );

  return [value, setStoredValue];
};

export default useLocalStorage;
