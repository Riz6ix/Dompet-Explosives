/**
 * Toast.jsx
 * Komponen notifikasi toast — muncul di kanan atas
 * Mendukung tipe: success, error, info
 * Dipakai via props dari parent (toast state + onClose)
 */

import React from "react";
import LucideIcon from "./LucideIcon.jsx";

const Toast = ({ toast, onClose }) => {
  if (!toast || !toast.show) return null;

  return (
    <div
      className={`fixed top-5 right-5 z-[9999] max-w-sm w-full ${
        toast.closing ? "toast-container closing" : "toast-container"
      }`}
    >
      <div
        className="relative overflow-hidden rounded-3xl bg-white/95 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.2)] p-4 flex items-center gap-4 border border-slate-200"
      >
        {/* Icon Wrapper */}
        <div
          className={`flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm ${
            toast.type === "success"
              ? "bg-emerald-50 text-emerald-500"
              : toast.type === "error"
                ? "bg-rose-50 text-rose-500"
                : "bg-blue-50 text-blue-500"
          }`}
        >
          <LucideIcon
            name={
              toast.type === "success"
                ? "CheckCircle2"
                : toast.type === "error"
                  ? "XCircle"
                  : "Info"
            }
            size={24}
            className="animate-bounce-subtle"
          />
        </div>

        {/* Text Content */}
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 mb-0.5">
            {toast.type === "success"
              ? "Success"
              : toast.type === "error"
                ? "Alert"
                : "Info"}
          </p>
          <p className="text-sm font-bold text-slate-800 leading-tight">
            {toast.message}
          </p>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="flex-shrink-0 w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center transition-all text-slate-300 hover:text-slate-600"
        >
          <LucideIcon name="X" size={16} />
        </button>

        {/* Progress Bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-100">
          <div
            className={`h-full ${
              toast.type === "success"
                ? "bg-emerald-400"
                : toast.type === "error"
                  ? "bg-rose-400"
                  : "bg-blue-400"
            }`}
            style={{
              animation: "toastProgress 3s linear forwards",
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Toast;