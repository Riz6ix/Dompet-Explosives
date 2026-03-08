/**
 * useToast.js
 * Hook untuk mengelola toast notification
 * Return: { toast, showToast, closeToast }
 *
 * Usage:
 *   const { toast, showToast, closeToast } = useToast();
 *   showToast("Berhasil disimpan!", "success");
 *   <Toast toast={toast} onClose={closeToast} />
 */

import { useState, useRef, useCallback, useEffect } from "react";

const useToast = () => {
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
    closing: false,
  });

  const timerRef = useRef(null);

  const showToast = useCallback((message, type = "success") => {
    // Clear timer sebelumnya
    if (timerRef.current) clearTimeout(timerRef.current);

    // Auto-detect type dari message untuk konsistensi
    let finalType = type;
    if (
      message.toLowerCase().includes("batal") ||
      message.toLowerCase().includes("hapus")
    ) {
      finalType = "error";
    }

    setToast({ show: true, message, type: finalType, closing: false });

    // Auto-close setelah 3 detik
    timerRef.current = setTimeout(() => {
      setToast((prev) => ({ ...prev, closing: true }));
      timerRef.current = setTimeout(() => {
        setToast({
          show: false,
          message: "",
          type: "success",
          closing: false,
        });
        timerRef.current = null;
      }, 300); // Closing animation duration
    }, 3000);
  }, []);

  const closeToast = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setToast((prev) => ({ ...prev, closing: true }));
    timerRef.current = setTimeout(() => {
      setToast({
        show: false,
        message: "",
        type: "success",
        closing: false,
      });
      timerRef.current = null;
    }, 300);
  }, []);

  // Cleanup on unmount — prevent state updates on unmounted component
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return { toast, showToast, closeToast };
};

export default useToast;
