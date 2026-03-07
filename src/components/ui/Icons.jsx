/**
 * Icons.jsx
 * Custom SVG icon components yang dipakai di app
 * - Inline SVG icons (Download, Plus, Eye, Calendar, dll)
 * - Logo components (WalletLogo, SchoolLogo)
 * - Tab icons (CicilanIcon, KasIcon, IuranIcon, HistoryIcon, InfoIcon)
 *
 * Semua icon accept { size, className } props
 */

import React from "react";

// ============================================================
// GENERIC SVG ICONS
// ============================================================

export const Download = ({ size = 18, className = "" }) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7,10 12,15 17,10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

export const Plus = ({ size = 18, className = "" }) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

export const Eye = ({ size = 18, className = "" }) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

export const Calendar = ({ size = 18, className = "" }) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

export const Wallet = ({ size = 18, className = "" }) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M17 12h5l-1.405-1.405A2.032 2.032 0 0 0 19.191 10H17V8a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-2z" />
    <path d="M11 6V4a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v2" />
    <line x1="17" y1="14" x2="17" y2="14" />
  </svg>
);

export const Users = ({ size = 18, className = "" }) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

export const CheckCircle = ({ size = 18, className = "" }) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const XCircle = ({ size = 18, className = "" }) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M15 9l-6 6M9 9l6 6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const HalfCircle = ({ size = 18, className = "" }) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <circle cx="12" cy="12" r="10" opacity="0.3" />
    <path d="M12 2a10 10 0 0 1 0 20" strokeLinecap="round" />
    <path d="M9 10l2 2 4-3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const Filter = ({ size = 18, className = "" }) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path
      d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const TrendingUp = ({ size = 18, className = "" }) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <polyline points="23,6 13.5,15.5 8.5,10.5 1,18" strokeLinecap="round" strokeLinejoin="round" />
    <polyline points="17,6 23,6 23,12" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const ClipboardList = ({ size = 18, className = "" }) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
    <path d="M12 11h4" />
    <path d="M12 16h4" />
    <path d="M8 11h.01" />
    <path d="M8 16h.01" />
  </svg>
);

export const TrendingDown = ({ size = 18, className = "" }) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <polyline points="23,18 13.5,8.5 8.5,13.5 1,6" />
    <polyline points="17,18 23,18 23,12" />
  </svg>
);

export const DollarSign = ({ size = 18, className = "" }) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <line x1="12" y1="1" x2="12" y2="23" />
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </svg>
);

// ============================================================
// LOGO COMPONENTS
// ============================================================

export const WalletLogo = ({ size = 32, className = "" }) => (
  <div className={`${className} flex items-center justify-center`}>
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      className="drop-shadow-lg"
    >
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffd700" />
          <stop offset="50%" stopColor="#ffed4e" />
          <stop offset="100%" stopColor="#f59e0b" />
        </linearGradient>
        <linearGradient id="walletGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1f2937" />
          <stop offset="100%" stopColor="#374151" />
        </linearGradient>
      </defs>
      <circle cx="32" cy="32" r="30" fill="url(#logoGradient)" stroke="#f59e0b" strokeWidth="2" />
      <rect x="18" y="22" width="28" height="20" rx="3" fill="url(#walletGradient)" stroke="#9ca3af" strokeWidth="1" />
      <rect x="16" y="20" width="28" height="20" rx="3" fill="url(#walletGradient)" stroke="#6b7280" strokeWidth="1" />
      <text x="30" y="32" fill="#fcd34d" fontSize="12" fontWeight="bold" fontFamily="Arial">
        Rp
      </text>
      <circle cx="24" cy="16" r="2" fill="#fbbf24" opacity="0.8" />
      <circle cx="40" cy="48" r="2" fill="#fbbf24" opacity="0.8" />
      <circle cx="48" cy="16" r="1.5" fill="#fed7aa" opacity="0.6" />
      <circle cx="16" cy="48" r="1.5" fill="#fed7aa" opacity="0.6" />
    </svg>
  </div>
);

export const SchoolLogo = ({ size = 32, className = "" }) => (
  <div className={`${className} flex items-center justify-center`}>
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      className="drop-shadow-lg"
    >
      {/* Outer Blast (Red) */}
      <path
        d="M50 5 L60 30 L95 25 L75 50 L90 85 L50 70 L10 85 L25 50 L5 25 L40 30 Z"
        fill="#ef4444"
      />
      {/* Middle Blast (Orange) */}
      <path
        d="M50 15 L58 35 L85 30 L70 50 L80 75 L50 65 L20 75 L30 50 L15 30 L42 35 Z"
        fill="#f97316"
      />
      {/* Inner Blast (Yellow) */}
      <path
        d="M50 25 L55 40 L70 38 L60 50 L65 65 L50 60 L35 65 L40 50 L30 38 L45 40 Z"
        fill="#fde047"
      />
    </svg>
  </div>
);

// ============================================================
// TAB / NAVIGATION ICONS (Custom SVG, fill-based)
// ============================================================

export const CicilanIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path
      d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z"
      fill="currentColor"
    />
    <path d="M12.5 7H11V13L16.25 16.15L17 14.92L12.5 12.25V7Z" fill="currentColor" />
  </svg>
);

export const KasIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path
      d="M20 4H4C2.89 4 2.01 4.89 2.01 6L2 18C2 19.11 2.89 20 4 20H20C21.11 20 22 19.11 22 18V6C22 4.89 21.11 4 20 4ZM20 18H4V12H20V18ZM20 8H4V6H20V8Z"
      fill="currentColor"
    />
  </svg>
);

export const IuranIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path
      d="M19 3H14.82C14.4 1.84 13.3 1 12 1C10.7 1 9.6 1.84 9.18 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM12 3C12.55 3 13 3.45 13 4C13 4.55 12.55 5 12 5C11.45 5 11 4.55 11 4C11 3.45 11.45 3 12 3ZM10 17L6 13L7.41 11.59L10 14.17L16.59 7.58L18 9L10 17Z"
      fill="currentColor"
    />
  </svg>
);

export const HistoryIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path
      d="M13 3C8.03 3 4 7.03 4 12H1L4.89 15.89L4.96 16.03L9 12H6C6 8.13 9.13 5 13 5C16.87 5 20 8.13 20 12C20 15.87 16.87 19 13 19C11.07 19 9.32 18.21 8.06 16.94L6.64 18.36C8.27 19.99 10.51 21 13 21C17.97 21 22 16.97 22 12C22 7.03 17.97 3 13 3ZM12 8V13L16.25 15.52L17.02 14.24L13.5 12.15V8H12Z"
      fill="currentColor"
    />
  </svg>
);

export const InfoIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path
      d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V11H13V17ZM13 9H11V7H13V9Z"
      fill="currentColor"
    />
  </svg>
);
