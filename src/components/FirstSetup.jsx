/**
 * FirstSetup.jsx
 * First-time setup wizard for KasKelas app.
 * Shown when user has NO data in localStorage.
 *
 * Steps:
 *   1. Welcome + localStorage warning + Accept terms
 *   2. Identitas Kelas
 *   3. Anggota Kelas (NEW — add members with bulk paste or one-by-one)
 *   4. Konfigurasi Kas
 *   5. Keamanan + Summary → Finish
 *
 * Props:
 *   onComplete({ appTitle, className, waliKelas, bendahara, kasAmount, startDate, pin, members })
 */

import React from "react";
import { LucideIcon } from "./ui/index.js";

/* ─────────────────────────────────────────────────────────
   CSS-in-JS style block injected once
───────────────────────────────────────────────────────── */
const STYLE_ID = "first-setup-styles";

function injectStyles() {
  if (document.getElementById(STYLE_ID)) return null;
  const style = document.createElement("style");
  style.id = STYLE_ID;
  style.textContent = `
    @keyframes confetti-fall {
      0%   { transform: translateY(-60px) rotate(0deg);   opacity: 1; }
      100% { transform: translateY(120vh) rotate(720deg); opacity: 0; }
    }
    @keyframes confetti-sway {
      0%, 100% { margin-left: 0; }
      25%       { margin-left: 24px; }
      75%       { margin-left: -24px; }
    }
    .confetti-particle {
      position: fixed; top: 0; width: 10px; height: 10px; border-radius: 2px;
      animation: confetti-fall linear forwards, confetti-sway ease-in-out infinite;
      pointer-events: none; z-index: 99998;
    }

    @keyframes slide-in-right {
      from { transform: translateX(48px); opacity: 0; }
      to   { transform: translateX(0);    opacity: 1; }
    }
    @keyframes slide-in-left {
      from { transform: translateX(-48px); opacity: 0; }
      to   { transform: translateX(0);     opacity: 1; }
    }
    .step-enter-right { animation: slide-in-right 0.32s cubic-bezier(0.25, 0.8, 0.25, 1) both; }
    .step-enter-left  { animation: slide-in-left  0.32s cubic-bezier(0.25, 0.8, 0.25, 1) both; }

    @keyframes pulse-ring {
      0%   { transform: scale(1);    opacity: 0.4; }
      100% { transform: scale(1.55); opacity: 0; }
    }
    .pulse-ring {
      position: absolute; inset: 0; border-radius: 9999px;
      background: rgba(99, 102, 241, 0.25);
      animation: pulse-ring 1.8s ease-out infinite;
    }

    @keyframes bounce-in {
      0%   { transform: scale(0.6); opacity: 0; }
      60%  { transform: scale(1.12); opacity: 1; }
      80%  { transform: scale(0.96); }
      100% { transform: scale(1); }
    }
    .bounce-in { animation: bounce-in 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) both; }

    @keyframes wiggle {
      0%, 100% { transform: translateX(0); }
      20%       { transform: translateX(-6px); }
      40%       { transform: translateX(6px); }
      60%       { transform: translateX(-4px); }
      80%       { transform: translateX(4px); }
    }
    .wiggle { animation: wiggle 0.45s ease both; }

    @keyframes shimmer {
      0%   { background-position: -200% 0; }
      100% { background-position: 200% 0; }
    }
    .progress-bar-shimmer {
      background: linear-gradient(90deg, #6366f1 0%, #8b5cf6 25%, #a78bfa 50%, #8b5cf6 75%, #6366f1 100%);
      background-size: 200% 100%;
      animation: shimmer 2s linear infinite;
    }

    @keyframes float-up {
      0%   { transform: translateY(0) scale(1);    opacity: 1; }
      100% { transform: translateY(-80px) scale(1.4); opacity: 0; }
    }
    .float-emoji {
      position: absolute; animation: float-up 1.2s ease-out forwards;
      pointer-events: none; font-size: 1.5rem; z-index: 10;
    }

    .setup-checkbox {
      appearance: none; -webkit-appearance: none;
      width: 20px; height: 20px; border: 2px solid #d1d5db;
      border-radius: 6px; cursor: pointer; transition: all 0.2s;
      flex-shrink: 0; position: relative;
    }
    .setup-checkbox:checked { background: #6366f1; border-color: #6366f1; }
    .setup-checkbox:checked::after {
      content: ''; position: absolute; left: 4px; top: 1px;
      width: 8px; height: 12px; border: 2px solid white;
      border-top: none; border-left: none; transform: rotate(45deg);
    }

    .setup-input:focus {
      outline: none; border-color: #6366f1;
      box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
    }

    .setup-overlay-bg {
      background: radial-gradient(ellipse at 30% 20%, rgba(237,233,254,0.9) 0%, rgba(224,231,255,0.7) 40%, rgba(255,255,255,0.95) 100%);
    }

    @keyframes fade-in-up {
      from { transform: translateY(8px); opacity: 0; }
      to   { transform: translateY(0);   opacity: 1; }
    }
    .fade-in-up { animation: fade-in-up 0.3s ease both; }

    @keyframes pop-in {
      0%   { transform: scale(0.8); opacity: 0; }
      100% { transform: scale(1);   opacity: 1; }
    }
    .pop-in { animation: pop-in 0.2s ease both; }
  `;
  document.head.appendChild(style);
  return style;
}

/* ─────────────────────────────────────────────────────────
   Confetti burst helper
───────────────────────────────────────────────────────── */
const CONFETTI_COLORS = ["#6366f1","#8b5cf6","#ec4899","#f59e0b","#10b981","#3b82f6","#f97316"];

function launchConfetti() {
  for (let i = 0; i < 72; i++) {
    const el = document.createElement("div");
    el.className = "confetti-particle";
    el.style.left = Math.random() * 100 + "vw";
    el.style.background = CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)];
    el.style.width = (8 + Math.random() * 8) + "px";
    el.style.height = (8 + Math.random() * 8) + "px";
    el.style.borderRadius = Math.random() > 0.5 ? "50%" : "2px";
    const dur = 2.2 + Math.random() * 2;
    const delay = Math.random() * 0.8;
    el.style.animationDuration = `${dur}s, ${dur * 0.5}s`;
    el.style.animationDelay = `${delay}s, ${delay}s`;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), (dur + delay + 0.5) * 1000);
  }
}

/* ─────────────────────────────────────────────────────────
   Sub-components
───────────────────────────────────────────────────────── */

const TOTAL_STEPS = 5;

const ProgressBar = ({ step }) => {
  const pct = Math.round(((step - 1) / (TOTAL_STEPS - 1)) * 100);
  return (
    <div className="fixed top-0 left-0 right-0 h-1 bg-indigo-100 z-[100001]">
      <div className="h-full progress-bar-shimmer rounded-full transition-all duration-500" style={{ width: pct + "%" }} />
    </div>
  );
};

const StepDots = ({ step }) => (
  <div className="flex items-center justify-center gap-2 mt-4">
    {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
      <div
        key={i}
        className={`rounded-full transition-all duration-300 ${
          i + 1 === step ? "w-6 h-2.5 bg-indigo-500"
            : i + 1 < step ? "w-2.5 h-2.5 bg-indigo-300"
            : "w-2.5 h-2.5 bg-gray-200 border-2 border-gray-300"
        }`}
      />
    ))}
  </div>
);

const BackBtn = ({ onClick }) => (
  <button
    onClick={onClick}
    className="inline-flex items-center gap-0.5 text-gray-400 hover:text-indigo-500 transition-colors text-sm font-medium group mb-4 -ml-1"
    aria-label="Kembali"
  >
    <LucideIcon name="ChevronLeft" size={18} className="group-hover:-translate-x-0.5 transition-transform" />
    <span className="leading-none">Kembali</span>
  </button>
);

const SetupInput = ({ label, id, value, onChange, type = "text", placeholder, required, prefix, helper, autoFocus }) => (
  <div className="flex flex-col gap-1.5">
    <label htmlFor={id} className="text-sm font-semibold text-gray-700">
      {label}
      {required && <span className="text-rose-400 ml-0.5">*</span>}
    </label>
    <div className="relative flex items-center">
      {prefix && (
        <span className="absolute left-3.5 text-sm font-semibold text-gray-400 pointer-events-none select-none">{prefix}</span>
      )}
      <input
        id={id} type={type} value={value} onChange={onChange}
        placeholder={placeholder} required={required} autoFocus={autoFocus}
        className={`setup-input w-full rounded-xl border-2 border-gray-200 bg-gray-50 py-3 text-sm text-gray-800 font-medium transition-all duration-200 placeholder:text-gray-300 ${
          prefix ? "pl-10 pr-4" : "px-4"
        }`}
      />
    </div>
    {helper && <p className="text-xs text-gray-400 leading-relaxed">{helper}</p>}
  </div>
);

/** Gradient action button */
const ActionBtn = ({ onClick, disabled, gradient, children, className = "" }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`w-full py-3.5 rounded-2xl text-white font-bold text-sm shadow-md hover:shadow-lg active:scale-95 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100 ${className}`}
    style={{ background: gradient || "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)" }}
  >
    {children}
  </button>
);

/* ─────────────────────────────────────────────────────────
   Main component
───────────────────────────────────────────────────────── */
const FirstSetup = ({ onComplete }) => {
  React.useEffect(() => {
    const tag = injectStyles();
    return () => { if (tag) tag.remove(); };
  }, []);

  // Lock body scroll
  React.useEffect(() => {
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const preventScroll = (e) => {
      if (e.target.closest(".setup-card-scroll")) return;
      e.preventDefault();
    };
    document.addEventListener("touchmove", preventScroll, { passive: false });
    return () => {
      document.body.style.overflow = original;
      document.removeEventListener("touchmove", preventScroll);
    };
  }, []);

  /* ── State ── */
  const [step, setStep] = React.useState(1);
  const [direction, setDirection] = React.useState("right");
  const [animKey, setAnimKey] = React.useState(0);
  const [showEmojiBurst, setShowEmojiBurst] = React.useState(false);

  const [acceptTerms, setAcceptTerms] = React.useState(false);
  const [acceptStorage, setAcceptStorage] = React.useState(false);
  const [showTermsDetail, setShowTermsDetail] = React.useState(false);

  const [formData, setFormData] = React.useState({
    appTitle: "Dompet Explosives",
    className: "",
    waliKelas: "",
    bendahara: "",
    kasAmount: 5000,
    startDate: new Date().toISOString().split("T")[0],
    pin: "",
  });

  // Members state for step 3
  const [membersList, setMembersList] = React.useState([]);
  const [bulkText, setBulkText] = React.useState("");
  const [showBulkMode, setShowBulkMode] = React.useState(true); // start in bulk mode
  const [newMemberName, setNewMemberName] = React.useState("");
  const [editingIdx, setEditingIdx] = React.useState(null);
  const [editingName, setEditingName] = React.useState("");

  const [skipPin, setSkipPin] = React.useState(false);
  const [pinError, setPinError] = React.useState("");
  const [pinWiggle, setPinWiggle] = React.useState(false);

  /* Navigation */
  const goTo = React.useCallback((nextStep, dir = "right") => {
    setDirection(dir);
    setAnimKey((k) => k + 1);
    setStep(nextStep);
  }, []);
  const handleNext = () => goTo(step + 1, "right");
  const handleBack = () => goTo(step - 1, "left");

  const setField = (field) => (e) => {
    // Avoid coercing empty string to 0 for number inputs
    const val = e.target.type === "number"
      ? (e.target.value === "" ? "" : Number(e.target.value))
      : e.target.value;
    setFormData((prev) => ({ ...prev, [field]: val }));
  };

  /* PIN validation */
  const validatePin = () => {
    if (skipPin) return true;
    if (formData.pin === "") return true;
    if (formData.pin.length !== 4 || !/^\d{4}$/.test(formData.pin)) {
      setPinError("PIN harus 4 digit angka");
      setPinWiggle(true);
      setTimeout(() => setPinWiggle(false), 500);
      return false;
    }
    return true;
  };

  /* ── Members helpers ── */
  const parseBulkNames = () => {
    const lines = bulkText
      .split("\n")
      .map((l) => l.replace(/^\d+[\.\)\-]\s*/, "").trim()) // strip numbering like "1. ", "2) "
      .filter((l) => l.length > 0);
    if (lines.length === 0) return;
    // Deduplicate & uppercase
    const existing = new Set(membersList.map((m) => m.toUpperCase()));
    const newNames = [];
    for (const name of lines) {
      const upper = name.toUpperCase();
      if (!existing.has(upper)) {
        existing.add(upper);
        newNames.push(upper);
      }
    }
    setMembersList((prev) => [...prev, ...newNames]);
    setBulkText("");
    setShowBulkMode(false);
  };

  const addSingleMember = () => {
    const name = newMemberName.trim().toUpperCase();
    if (!name) return;
    if (membersList.some((m) => m.toUpperCase() === name)) return;
    setMembersList((prev) => [...prev, name]);
    setNewMemberName("");
  };

  const removeMember = (idx) => {
    setMembersList((prev) => prev.filter((_, i) => i !== idx));
  };

  const startEdit = (idx) => {
    setEditingIdx(idx);
    setEditingName(membersList[idx]);
  };

  const saveEdit = () => {
    if (editingIdx === null) return;
    const name = editingName.trim().toUpperCase();
    if (!name) {
      removeMember(editingIdx);
    } else {
      setMembersList((prev) => prev.map((m, i) => (i === editingIdx ? name : m)));
    }
    setEditingIdx(null);
    setEditingName("");
  };

  /* Final submit */
  const handleFinish = () => {
    if (!validatePin()) return;
    launchConfetti();
    setShowEmojiBurst(true);
    const finalPin = skipPin ? "" : formData.pin;

    // Build members array with no: index
    const membersData = membersList.map((nama, i) => ({
      no: i + 1,
      nama,
      jk: null, // no default gender — set in settings
    }));

    setTimeout(() => {
      onComplete({ ...formData, pin: finalPin, members: membersData });
    }, 900);
  };

  const canProceedStep1 = acceptTerms && acceptStorage;

  /* ══════════════════════════════════════════════════════════
     STEP 1 — Welcome + Terms
  ══════════════════════════════════════════════════════════ */
  const renderStep1 = () => (
    <div className="flex flex-col items-center text-center gap-5 px-1">
      {/* Hero */}
      <div className="relative bounce-in" style={{ width: 112, height: 112 }}>
        <div className="pulse-ring" />
        <div className="pulse-ring" style={{ animationDelay: "0.6s" }} />
        <div
          className="absolute inset-1 flex items-center justify-center rounded-full shadow-xl"
          style={{ background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a78bfa 100%)" }}
        >
          <LucideIcon name="Sparkles" size={48} color="white" />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <h1 className="text-2xl font-extrabold text-gray-900 leading-tight tracking-tight">Selamat Datang! 🎉</h1>
        <p className="text-sm text-gray-500 leading-relaxed max-w-[280px] mx-auto">
          Setup cepat untuk mulai mengelola kas kelas — hanya butuh 2 menit.
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-2">
        {[
          { icon: "Wallet", label: "Kas Mingguan" },
          { icon: "Users", label: "Anggota Kelas" },
          { icon: "BarChart2", label: "Statistik" },
        ].map(({ icon, label }) => (
          <span key={label} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-50 text-indigo-600 text-xs font-semibold border border-indigo-100">
            <span className="flex-shrink-0 flex items-center"><LucideIcon name={icon} size={13} /></span>
            {label}
          </span>
        ))}
      </div>

      {/* Terms */}
      <div className="w-full space-y-3 text-left mt-1">
        <div className="rounded-xl bg-amber-50 border border-amber-200 px-3.5 py-3 flex gap-2.5">
          <div className="flex-shrink-0 w-[15px] h-[15px] mt-[3px]"><LucideIcon name="AlertTriangle" size={15} color="#d97706" /></div>
          <div className="flex flex-col gap-0.5">
            <p className="text-xs font-semibold text-amber-700">Penyimpanan Lokal</p>
            <p className="text-xs text-amber-600 leading-relaxed">
              Data disimpan di browser (localStorage). Menghapus data browser atau ganti perangkat akan menghilangkan semua data. Gunakan fitur backup secara berkala.
            </p>
          </div>
        </div>

        <label className="flex items-start gap-2.5 cursor-pointer select-none group py-1">
          <input type="checkbox" className="setup-checkbox mt-[1px]" checked={acceptStorage} onChange={(e) => setAcceptStorage(e.target.checked)} />
          <span className="text-xs text-gray-600 leading-relaxed group-hover:text-gray-800 transition-colors">
            Saya memahami bahwa data tersimpan <span className="font-semibold">secara lokal di perangkat ini</span> dan bertanggung jawab untuk melakukan backup secara berkala.
          </span>
        </label>

        <label className="flex items-start gap-2.5 cursor-pointer select-none group py-1">
          <input type="checkbox" className="setup-checkbox mt-[1px]" checked={acceptTerms} onChange={(e) => setAcceptTerms(e.target.checked)} />
          <span className="text-xs text-gray-600 leading-relaxed group-hover:text-gray-800 transition-colors">
            Saya menyetujui{" "}
            <button type="button" onClick={(e) => { e.preventDefault(); setShowTermsDetail(!showTermsDetail); }} className="text-indigo-500 font-semibold underline underline-offset-2 hover:text-indigo-700 transition-colors">
              Ketentuan Penggunaan
            </button>
            {" "}aplikasi ini.
          </span>
        </label>

        {showTermsDetail && (
          <div className="rounded-xl bg-gray-50 border border-gray-200 px-3.5 py-3 text-xs text-gray-500 leading-relaxed space-y-2 fade-in-up max-h-48 overflow-y-auto setup-card-scroll">
            <p className="font-bold text-gray-700 text-xs">Ketentuan Penggunaan KasKelas</p>
            <p><span className="font-semibold text-gray-600">1. Penggunaan.</span> Aplikasi ini dirancang sebagai alat bantu pencatatan kas kelas untuk keperluan pendidikan.</p>
            <p><span className="font-semibold text-gray-600">2. Data & Privasi.</span> Seluruh data disimpan secara lokal (localStorage). Tidak ada data yang dikirim ke server eksternal.</p>
            <p><span className="font-semibold text-gray-600">3. Penyimpanan.</span> localStorage memiliki batasan kapasitas (~5–10 MB). Data dapat hilang jika cache dihapus atau mode incognito.</p>
            <p><span className="font-semibold text-gray-600">4. Backup.</span> Pengguna sangat disarankan untuk rutin backup melalui Pengaturan. Pengembang tidak bertanggung jawab atas kehilangan data.</p>
            <p><span className="font-semibold text-gray-600">5. Akurasi.</span> Pengguna tetap bertanggung jawab memverifikasi catatan keuangan.</p>
            <p><span className="font-semibold text-gray-600">6. Perubahan.</span> Aplikasi dapat diperbarui sewaktu-waktu dengan menjaga kompatibilitas data.</p>
            <p><span className="font-semibold text-gray-600">7. Disclaimer.</span> Aplikasi disediakan <em>&quot;as is&quot;</em> tanpa jaminan apapun.</p>
          </div>
        )}
      </div>

      <ActionBtn onClick={handleNext} disabled={!canProceedStep1}>
        <span className="flex items-center justify-center gap-2">
          <LucideIcon name="Rocket" size={18} color="white" />
          Mulai Setup
        </span>
      </ActionBtn>
    </div>
  );

  /* ══════════════════════════════════════════════════════════
     STEP 2 — Identitas Kelas
  ══════════════════════════════════════════════════════════ */
  const renderStep2 = () => (
    <div className="flex flex-col gap-5">
      <div className="flex items-start gap-2.5">
        <div className="w-8 h-8 rounded-full flex items-center justify-center bg-indigo-100 flex-shrink-0 mt-0.5">
          <LucideIcon name="School" size={16} color="#6366f1" />
        </div>
        <div className="flex flex-col gap-0.5">
          <h2 className="text-lg font-extrabold text-gray-900 leading-tight">Identitas Kelas</h2>
          <p className="text-xs text-gray-400">Isi informasi dasar tentang kelas kamu</p>
        </div>
      </div>

      <SetupInput id="appTitle" label="Nama Aplikasi" value={formData.appTitle} onChange={setField("appTitle")} placeholder="Dompet Explosives" autoFocus />
      <SetupInput id="className" label="Nama Kelas" value={formData.className} onChange={setField("className")} placeholder="XII-F5" required />
      <SetupInput id="waliKelas" label="Wali Kelas (Opsional)" value={formData.waliKelas} onChange={setField("waliKelas")} placeholder="Nama Wali Kelas" />
      <SetupInput id="bendahara" label="Bendahara" value={formData.bendahara} onChange={setField("bendahara")} placeholder="Nama Bendahara Kelas" />

      <ActionBtn onClick={handleNext} disabled={!formData.className.trim()} className="mt-1">
        Lanjut →
      </ActionBtn>
    </div>
  );

  /* ══════════════════════════════════════════════════════════
     STEP 3 — Anggota Kelas (NEW)
  ══════════════════════════════════════════════════════════ */
  const renderStep3 = () => {
    const siswaCount = membersList.length;

    return (
      <div className="flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-start gap-2.5">
          <div className="w-8 h-8 rounded-full flex items-center justify-center bg-blue-100 flex-shrink-0 mt-0.5">
            <LucideIcon name="Users" size={16} color="#3b82f6" />
          </div>
          <div className="flex flex-col gap-0.5">
            <h2 className="text-lg font-extrabold text-gray-900 leading-tight">Anggota Kelas</h2>
            <p className="text-xs text-gray-400">
              Tambahkan nama-nama siswa. Bisa paste langsung dari daftar absen.
            </p>
          </div>
        </div>

        {/* Mode toggle */}
        <div className="flex rounded-xl bg-gray-100 p-1 gap-1">
          <button
            onClick={() => setShowBulkMode(true)}
            className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all duration-200 flex items-center justify-center gap-1.5 ${
              showBulkMode ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <span className="flex-shrink-0 flex items-center"><LucideIcon name="ClipboardPaste" size={13} /></span>
            Paste Massal
          </button>
          <button
            onClick={() => setShowBulkMode(false)}
            className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all duration-200 flex items-center justify-center gap-1.5 ${
              !showBulkMode ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <span className="flex-shrink-0 flex items-center"><LucideIcon name="UserPlus" size={13} /></span>
            Satu-satu
          </button>
        </div>

        {/* Bulk mode */}
        {showBulkMode && (
          <div className="flex flex-col gap-2 fade-in-up">
            <textarea
              value={bulkText}
              onChange={(e) => setBulkText(e.target.value)}
              placeholder={"Paste daftar nama disini,\nsatu nama per baris:\n\n1. SAHRUL BAROKAH\n2. BUDIONO SIREGAR\n3. SUMANTO\n..."}
              rows={6}
              autoFocus
              className="setup-input w-full rounded-xl border-2 border-gray-200 bg-gray-50 py-3 px-4 text-sm text-gray-800 font-medium transition-all duration-200 placeholder:text-gray-300 resize-none leading-relaxed"
            />
            <p className="text-xs text-gray-400 flex items-center gap-1.5">
              <span className="flex-shrink-0 flex items-center"><LucideIcon name="Info" size={12} color="#9ca3af" /></span>
              Nomor urut otomatis dihapus. Nama duplikat akan diskip.
            </p>
            <button
              onClick={parseBulkNames}
              disabled={!bulkText.trim()}
              className="w-full py-2.5 rounded-xl text-sm font-semibold border-2 border-blue-200 bg-blue-50 text-blue-600 hover:bg-blue-100 active:scale-95 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <LucideIcon name="Plus" size={15} color="#3b82f6" />
              Tambahkan {bulkText.split("\n").filter((l) => l.trim()).length || 0} Nama
            </button>
          </div>
        )}

        {/* Single add mode */}
        {!showBulkMode && (
          <div className="flex gap-2 fade-in-up">
            <input
              value={newMemberName}
              onChange={(e) => setNewMemberName(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addSingleMember(); } }}
              placeholder="Ketik nama siswa..."
              autoFocus
              className="setup-input flex-1 rounded-xl border-2 border-gray-200 bg-gray-50 py-2.5 px-3.5 text-sm text-gray-800 font-medium transition-all duration-200 placeholder:text-gray-300"
            />
            <button
              onClick={addSingleMember}
              disabled={!newMemberName.trim()}
              className="px-4 rounded-xl bg-blue-500 text-white font-semibold text-sm hover:bg-blue-600 active:scale-95 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
            >
              <LucideIcon name="Plus" size={16} color="white" />
            </button>
          </div>
        )}

        {/* Members list */}
        {siswaCount > 0 && (
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold text-gray-500">
                {siswaCount} siswa ditambahkan
              </span>
              {siswaCount > 0 && (
                <button
                  onClick={() => { setMembersList([]); setShowBulkMode(true); }}
                  className="text-xs text-rose-400 hover:text-rose-600 font-medium transition-colors"
                >
                  Hapus Semua
                </button>
              )}
            </div>

            <div className="max-h-52 overflow-y-auto setup-card-scroll rounded-xl border border-gray-200 bg-gray-50 divide-y divide-gray-100">
              {membersList.map((name, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2.5 px-3 py-2 hover:bg-white transition-colors group pop-in"
                  style={{ animationDelay: `${Math.min(idx * 0.02, 0.3)}s` }}
                >
                  {/* Number badge */}
                  <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-xs font-bold flex items-center justify-center flex-shrink-0">
                    {idx + 1}
                  </span>

                  {/* Name (editable) */}
                  {editingIdx === idx ? (
                    <input
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      onBlur={saveEdit}
                      onKeyDown={(e) => { if (e.key === "Enter") saveEdit(); if (e.key === "Escape") { setEditingIdx(null); setEditingName(""); } }}
                      autoFocus
                      className="flex-1 text-xs font-medium text-gray-800 bg-white border border-blue-300 rounded-lg px-2 py-1 outline-none"
                    />
                  ) : (
                    <span
                      className="flex-1 text-xs font-medium text-gray-700 truncate cursor-pointer hover:text-blue-600 transition-colors"
                      onClick={() => startEdit(idx)}
                      title="Klik untuk edit"
                    >
                      {name}
                    </span>
                  )}

                  {/* Actions */}
                  {editingIdx !== idx && (
                    <button
                      onClick={() => removeMember(idx)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-lg hover:bg-rose-50"
                      title="Hapus"
                    >
                      <LucideIcon name="X" size={13} color="#f43f5e" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty state */}
        {siswaCount === 0 && !showBulkMode && (
          <div className="rounded-xl border-2 border-dashed border-gray-200 py-8 flex flex-col items-center gap-2 text-center">
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
              <LucideIcon name="UserPlus" size={20} color="#9ca3af" />
            </div>
            <p className="text-xs text-gray-400">Belum ada anggota. Ketik nama di atas untuk mulai.</p>
          </div>
        )}

        {/* Info badge */}
        <div className="rounded-xl bg-blue-50 border border-blue-100 px-3.5 py-2.5 flex gap-2.5">
          <div className="flex-shrink-0 mt-[3px]"><LucideIcon name="Info" size={14} color="#3b82f6" /></div>
          <p className="text-xs text-blue-600 leading-relaxed">
            Jenis kelamin & detail lainnya bisa diatur nanti di menu Pengaturan. Cukup masukkan nama dulu.
          </p>
        </div>

        <ActionBtn onClick={handleNext} disabled={siswaCount === 0} className="mt-1">
          {siswaCount > 0 ? `Lanjut dengan ${siswaCount} Siswa →` : "Tambahkan minimal 1 siswa"}
        </ActionBtn>
      </div>
    );
  };

  /* ══════════════════════════════════════════════════════════
     STEP 4 — Konfigurasi Kas
  ══════════════════════════════════════════════════════════ */
  const renderStep4 = () => (
    <div className="flex flex-col gap-5">
      <div className="flex items-start gap-2.5">
        <div className="w-8 h-8 rounded-full flex items-center justify-center bg-emerald-100 flex-shrink-0 mt-0.5">
          <LucideIcon name="PiggyBank" size={16} color="#10b981" />
        </div>
        <div className="flex flex-col gap-0.5">
          <h2 className="text-lg font-extrabold text-gray-900 leading-tight">Konfigurasi Kas</h2>
          <p className="text-xs text-gray-400">Tentukan nominal dan tanggal mulai</p>
        </div>
      </div>

      {/* Kas amount */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="kasAmount" className="text-sm font-semibold text-gray-700">Nominal Kas Mingguan</label>
        <div className="relative flex items-center">
          <span className="absolute left-3.5 text-sm font-bold text-emerald-600 pointer-events-none select-none">Rp</span>
          <input
            id="kasAmount" type="number" value={formData.kasAmount} onChange={setField("kasAmount")}
            min={500} step={500} autoFocus
            className="setup-input w-full rounded-xl border-2 border-gray-200 bg-gray-50 py-3 pl-10 pr-4 text-sm text-gray-800 font-medium transition-all duration-200"
          />
        </div>
        <div className="flex gap-2 mt-1 flex-wrap">
          {[2000, 5000, 10000, 15000, 20000].map((v) => (
            <button
              key={v}
              onClick={() => setFormData((prev) => ({ ...prev, kasAmount: v }))}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all duration-150 ${
                formData.kasAmount === v
                  ? "bg-emerald-500 border-emerald-500 text-white shadow-sm"
                  : "bg-gray-50 border-gray-200 text-gray-500 hover:border-emerald-300 hover:text-emerald-600"
              }`}
            >
              {(v / 1000).toLocaleString("id-ID")}rb
            </button>
          ))}
        </div>
      </div>

      {/* Start date */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="startDate" className="text-sm font-semibold text-gray-700">Tanggal Mulai</label>
        <input
          id="startDate" type="date" value={formData.startDate} onChange={setField("startDate")}
          className="setup-input w-full rounded-xl border-2 border-gray-200 bg-gray-50 py-3 px-4 text-sm text-gray-800 font-medium transition-all duration-200"
        />
        <p className="text-xs text-gray-400 flex items-center gap-1.5">
          <span className="flex-shrink-0 flex items-center"><LucideIcon name="Info" size={12} color="#d1d5db" /></span>
          Ini menentukan perhitungan minggu berjalan
        </p>
      </div>

      {/* Preview card */}
      <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4 flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
          <LucideIcon name="TrendingUp" size={20} color="#10b981" />
        </div>
        <div>
          <p className="text-xs text-emerald-600 font-semibold">Target Bulanan Kelas</p>
          <p className="text-base font-extrabold text-emerald-700">
            Rp {(formData.kasAmount * 4 * membersList.length).toLocaleString("id-ID")}
          </p>
          <p className="text-xs text-emerald-500">
            {membersList.length} siswa × Rp {formData.kasAmount.toLocaleString("id-ID")} × 4 minggu
          </p>
        </div>
      </div>

      <ActionBtn onClick={handleNext}>Lanjut →</ActionBtn>
    </div>
  );

  /* ══════════════════════════════════════════════════════════
     STEP 5 — Keamanan + Summary
  ══════════════════════════════════════════════════════════ */
  const renderStep5 = () => (
    <div className="flex flex-col gap-5 relative">
      {showEmojiBurst && (
        <div className="pointer-events-none absolute inset-0">
          {["✨", "🎉", "🎊", "💸", "🏆"].map((em, i) => (
            <span key={i} className="float-emoji" style={{ left: 20 + i * 18 + "%", bottom: "60%", animationDelay: i * 0.1 + "s" }}>{em}</span>
          ))}
        </div>
      )}

      <div className="flex items-start gap-2.5">
        <div className="w-8 h-8 rounded-full flex items-center justify-center bg-rose-100 flex-shrink-0 mt-0.5">
          <LucideIcon name="Shield" size={16} color="#f43f5e" />
        </div>
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-extrabold text-gray-900 leading-tight">Keamanan</h2>
            <span className="text-xs text-gray-400 font-medium bg-gray-100 px-2 py-0.5 rounded-full">Opsional</span>
          </div>
          <p className="text-xs text-gray-400">Kunci app dengan PIN 4 digit agar data aman</p>
        </div>
      </div>

      {/* PIN input */}
      <div className={`flex flex-col gap-1.5 ${skipPin ? "opacity-40 pointer-events-none" : ""}`}>
        <label htmlFor="pin" className="text-sm font-semibold text-gray-700">PIN 4 Digit</label>
        <div className={`relative ${pinWiggle ? "wiggle" : ""}`}>
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
            <LucideIcon name="Lock" size={16} color="#9ca3af" />
          </span>
          <input
            id="pin" type="password" inputMode="numeric" maxLength={4}
            value={formData.pin}
            onChange={(e) => {
              const v = e.target.value.replace(/\D/g, "").slice(0, 4);
              setFormData((prev) => ({ ...prev, pin: v }));
              if (pinError) setPinError("");
            }}
            placeholder="••••"
            className="setup-input w-full rounded-xl border-2 border-gray-200 bg-gray-50 py-3 pl-10 pr-4 text-sm text-gray-800 font-medium tracking-widest transition-all duration-200"
            disabled={skipPin} autoFocus={!skipPin}
          />
        </div>
        <div className="flex gap-2 mt-1">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className={`h-1.5 flex-1 rounded-full transition-all duration-200 ${formData.pin.length > i ? "bg-indigo-500" : "bg-gray-200"}`} />
          ))}
        </div>
        {pinError && (
          <p className="text-xs text-rose-500 font-medium mt-0.5 flex items-center gap-1.5">
            <span className="flex-shrink-0 flex items-center"><LucideIcon name="AlertCircle" size={12} color="#f43f5e" /></span>
            {pinError}
          </p>
        )}
      </div>

      {/* Skip PIN */}
      <label className="flex items-start gap-3 cursor-pointer select-none group">
        <input type="checkbox" className="setup-checkbox mt-[3px]" checked={skipPin}
          onChange={(e) => {
            setSkipPin(e.target.checked);
            if (e.target.checked) { setFormData((prev) => ({ ...prev, pin: "" })); setPinError(""); }
          }}
        />
        <div>
          <p className="text-sm font-semibold text-gray-700 group-hover:text-indigo-600 transition-colors">Skip — tidak pakai PIN</p>
          <p className="text-xs text-gray-400">Bisa diaktifkan kapan saja di Pengaturan</p>
        </div>
      </label>

      {/* Summary card */}
      <div className="rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50 to-purple-50 p-4">
        <p className="text-xs font-bold text-indigo-500 uppercase tracking-wider mb-2.5">Ringkasan Setup</p>
        <div className="flex flex-col gap-1.5">
          {[
            { icon: "Tag", label: "Nama App", value: formData.appTitle || "—" },
            { icon: "GraduationCap", label: "Kelas", value: formData.className || "—" },
            { icon: "Users", label: "Anggota", value: `${membersList.length} siswa` },
            { icon: "Wallet", label: "Kas / Minggu", value: `Rp ${Number(formData.kasAmount).toLocaleString("id-ID")}` },
            { icon: "Calendar", label: "Mulai", value: formData.startDate },
          ].map(({ icon, label, value }) => (
            <div key={label} className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-xs text-gray-500">
                <span className="flex-shrink-0 flex items-center"><LucideIcon name={icon} size={12} color="#9ca3af" /></span>
                {label}
              </span>
              <span className="text-xs font-semibold text-gray-700 truncate max-w-[140px] text-right">{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Finish */}
      <button
        onClick={handleFinish}
        className="w-full py-4 rounded-2xl text-white font-extrabold text-base shadow-lg hover:shadow-xl active:scale-95 transition-all duration-200"
        style={{ background: "linear-gradient(135deg, #10b981 0%, #059669 100%)" }}
      >
        <span className="flex items-center justify-center gap-2">
          <LucideIcon name="Sparkles" size={18} color="white" />
          Selesai &amp; Mulai!
        </span>
      </button>
    </div>
  );

  /* ── Render ── */
  const stepContent = { 1: renderStep1, 2: renderStep2, 3: renderStep3, 4: renderStep4, 5: renderStep5 };
  const animClass = direction === "right" ? "step-enter-right" : "step-enter-left";

  return (
    <>
      <div
        className="fixed inset-0 setup-overlay-bg flex flex-col items-center justify-start overflow-y-auto overscroll-none"
        style={{ zIndex: 99999 }}
        role="dialog" aria-modal="true" aria-label="First Setup Wizard"
      >
        <ProgressBar step={step} />
        <div className="flex-1 min-h-4" />

        <div className="setup-card-scroll relative w-full max-w-sm bg-white rounded-2xl shadow-2xl px-6 py-7 mx-4">
          {step > 1 && <BackBtn onClick={handleBack} />}
          <div key={animKey} className={animClass}>
            {stepContent[step]?.()}
          </div>
        </div>

        <div className="flex flex-col items-center py-4 flex-shrink-0">
          <StepDots step={step} />
          <p className="mt-3 text-xs text-gray-400 opacity-60">KasKelas — Data tersimpan lokal di perangkat kamu</p>
        </div>
        <div className="flex-1 min-h-4" />
      </div>
    </>
  );
};

export default FirstSetup;
