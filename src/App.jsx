/* global confetti */
import React from "react";
import {
  LucideIcon,
  AnimatedNumber,
  SchoolLogo,
  Download,
  Plus,
  Eye,
  Calendar,
  Users,
  TrendingUp,
  TrendingDown,
  DollarSign,
  ClipboardList,
} from "./components/ui/index.js";

import {
  DEFAULT_KAS_AMOUNT,
  DEFAULT_START_DATE,
  DEFAULT_MEMBERS_DATA,
  EXPENSE_CATEGORIES,
} from "./constants/index.js";

import {
  formatCurrency,
  formatDateShort,
  formatDateWithDay,
  calculateWeek,
} from "./utils/index.js";

// Feature Tab Components
import DashboardTab from "./features/dashboard/DashboardTab.jsx";
import TransaksiTab from "./features/transaksi/TransaksiTab.jsx";
import IuranTab from "./features/iuran/IuranTab.jsx";
import CekBayarTab from "./features/cek-bayar/CekBayarTab.jsx";
import CicilanTab from "./features/cicilan/CicilanTab.jsx";
import PerAnggotaTab from "./features/per-anggota/PerAnggotaTab.jsx";
import StatistikTab from "./features/statistik/StatistikTab.jsx";
import PengaturanTab from "./features/pengaturan/PengaturanTab.jsx";
import QuestTab, { RANK_TIERS } from "./features/quest/QuestTab.jsx";
import FirstSetup from "./components/FirstSetup.jsx";

// ============================================================
// APP COMPONENT
// ============================================================
/* eslint-disable complexity */
const App = () => {
  /* 
  ┌────────────────────────────────────────────────────────────────────┐
  │  ⚙️ APP CONFIGURATION & STATE INITIALIZATION                        │
  └────────────────────────────────────────────────────────────────────┘ 
  */

  // Load Config from LocalStorage
  const [appConfig, setAppConfig] = React.useState(() => {
    try {
      const saved = localStorage.getItem("kasKelas_config");
      const parsed = saved ? JSON.parse(saved) : {};
      return {
        kasAmount: parsed.kasAmount || DEFAULT_KAS_AMOUNT,
        startDate: parsed.startDate || DEFAULT_START_DATE,
        pin: parsed.pin || "",
        className: parsed.className || "XII-F5",
        waliKelas: parsed.waliKelas || "",
        bendahara: parsed.bendahara || "",
        appTitle: parsed.appTitle || "Dompet Explosives",
      };
    } catch (e) {
      return {
        kasAmount: DEFAULT_KAS_AMOUNT,
        startDate: DEFAULT_START_DATE,
        pin: "",
        className: "XII-F5",
        waliKelas: "",
        bendahara: "",
        appTitle: "Dompet Explosives",
      };
    }
  });

  // 🔒 SECURITY STATE (FIXED INITIALIZATION)
  const [isLocked, setIsLocked] = React.useState(() => {
    try {
      const saved = localStorage.getItem("kasKelas_config");
      const parsed = saved ? JSON.parse(saved) : {};
      return !!(parsed.pin && parsed.pin.length === 4);
    } catch {
      return false;
    }
  });
  const [pinInput, setPinInput] = React.useState("");

  // 🎭 RPG FEEDBACK STATE
  const [isShaking, setIsShaking] = React.useState(false);

  // 🔊 SOUND EFFECTS STATE
  const [soundEnabled, setSoundEnabled] = React.useState(() => {
    try {
      return localStorage.getItem("kasKelas_sound") !== "false";
    } catch {
      return true;
    }
  });
  React.useEffect(() => {
    localStorage.setItem("kasKelas_sound", soundEnabled ? "true" : "false");
  }, [soundEnabled]);

  // Dynamic document title
  React.useEffect(() => {
    document.title = `${appConfig.appTitle} — Kas Kelas ${appConfig.className}`;
  }, [appConfig.appTitle, appConfig.className]);

  const audioCtxRef = React.useRef(null);
  const playSound = React.useCallback(
    (type) => {
      if (!soundEnabled) return;
      try {
        if (!audioCtxRef.current || audioCtxRef.current.state === "closed") {
          audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
        }
        const ctx = audioCtxRef.current;
        if (ctx.state === "suspended") ctx.resume();
        const makeOsc = (freq, oscType, startT, endT, vol = 0.08) => {
          const o = ctx.createOscillator();
          const g = ctx.createGain();
          o.connect(g);
          g.connect(ctx.destination);
          o.frequency.value = freq;
          o.type = oscType;
          g.gain.setValueAtTime(vol, ctx.currentTime + startT);
          g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + endT);
          o.start(ctx.currentTime + startT);
          o.stop(ctx.currentTime + endT);
          return o;
        };

        if (type === "lunas") {
          // Happy ding — two ascending notes C5→E5
          makeOsc(523, "sine", 0, 0.3, 0.08);
          makeOsc(659, "sine", 0.15, 0.5, 0.08);
        } else if (type === "coin") {
          // Coin drop — descending chirp
          const o = ctx.createOscillator();
          const g = ctx.createGain();
          o.connect(g);
          g.connect(ctx.destination);
          o.frequency.value = 1200;
          o.type = "sine";
          o.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.15);
          g.gain.setValueAtTime(0.06, ctx.currentTime);
          g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
          o.start(ctx.currentTime);
          o.stop(ctx.currentTime + 0.15);
        } else if (type === "whoosh") {
          // Soft whoosh
          const o = ctx.createOscillator();
          const g = ctx.createGain();
          o.connect(g);
          g.connect(ctx.destination);
          o.type = "sine";
          o.frequency.value = 400;
          o.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.12);
          g.gain.setValueAtTime(0.03, ctx.currentTime);
          g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
          o.start(ctx.currentTime);
          o.stop(ctx.currentTime + 0.12);
        } else if (type === "error") {
          // Low buzz
          makeOsc(200, "square", 0, 0.2, 0.04);
        } else if (type === "xpGain") {
          // Bright ascending chime — C6→E6→G6 arpeggio
          makeOsc(1047, "sine", 0, 0.2, 0.05);
          makeOsc(1319, "sine", 0.08, 0.25, 0.05);
          makeOsc(1568, "sine", 0.16, 0.35, 0.04);
        } else if (type === "levelUp") {
          // Epic ascending fanfare — C5→E5→G5→C6
          makeOsc(523, "sine", 0, 0.25, 0.07);
          makeOsc(659, "sine", 0.12, 0.35, 0.07);
          makeOsc(784, "sine", 0.24, 0.45, 0.06);
          makeOsc(1047, "sine", 0.36, 0.65, 0.08);
          // Harmony layer
          makeOsc(523, "triangle", 0.36, 0.7, 0.03);
        } else if (type === "achievement") {
          // Triumphant sparkle — quick ascending + shimmer
          makeOsc(880, "sine", 0, 0.15, 0.06);
          makeOsc(1108, "sine", 0.06, 0.2, 0.06);
          makeOsc(1319, "sine", 0.12, 0.3, 0.05);
          makeOsc(1760, "sine", 0.18, 0.5, 0.04);
          // Sparkle overtone
          makeOsc(2640, "sine", 0.24, 0.45, 0.02);
        } else if (type === "streak") {
          // Fire crackle — quick ascending with warmth
          makeOsc(440, "sawtooth", 0, 0.1, 0.03);
          makeOsc(660, "sine", 0.05, 0.2, 0.05);
          makeOsc(880, "sine", 0.1, 0.3, 0.04);
        } else if (type === "success") {
          // Gentle positive confirmation — maj7 chord
          makeOsc(523, "sine", 0, 0.4, 0.05);
          makeOsc(659, "sine", 0, 0.4, 0.04);
          makeOsc(784, "sine", 0, 0.4, 0.03);
          makeOsc(988, "sine", 0.05, 0.45, 0.02);
        } else if (type === "backup") {
          // Save/download — descending safe tone
          makeOsc(784, "sine", 0, 0.2, 0.05);
          makeOsc(659, "sine", 0.1, 0.3, 0.05);
          makeOsc(523, "sine", 0.2, 0.45, 0.06);
        } else if (type === "pop") {
          // Tiny pop — for small UI interactions
          makeOsc(900, "sine", 0, 0.08, 0.04);
        }
      } catch {}
    },
    [soundEnabled],
  );

  // 🚀 FIRST SETUP DETECTION
  const [showFirstSetup, setShowFirstSetup] = React.useState(() => {
    try {
      const hasConfig = localStorage.getItem("kasKelas_config");
      const hasMembers = localStorage.getItem("kasKelas_members");
      return !hasConfig && !hasMembers;
    } catch {
      return false;
    }
  });

  const handleFirstSetupComplete = (setupData) => {
    setAppConfig((prev) => ({
      ...prev,
      kasAmount: setupData.kasAmount || prev.kasAmount,
      startDate: setupData.startDate || prev.startDate,
      pin: setupData.pin || "",
      className: setupData.className || prev.className,
      waliKelas: setupData.waliKelas || prev.waliKelas,
      bendahara: setupData.bendahara || prev.bendahara,
      appTitle: setupData.appTitle || prev.appTitle,
    }));
    // Set custom members if provided from setup wizard
    if (setupData.members && setupData.members.length > 0) {
      setMembers(setupData.members);
    }
    setShowFirstSetup(false);
    showToast("Setup selesai! Selamat datang! 🎉", "success");
    playSound("achievement");
    // Award first setup XP
    setRpgData((prev) => ({
      ...prev,
      totalXP: (prev.totalXP || 0) + 20,
      achievements: [...(prev.achievements || []), "first_setup"],
    }));
  };

  // 🎮 RPG STATE
  const [achievementPopup, setAchievementPopup] = React.useState(null);
  const [rankUpPopup, setRankUpPopup] = React.useState(null);

  // Auto-dismiss popups after a few seconds
  React.useEffect(() => {
    if (!achievementPopup) return;
    const t = setTimeout(() => setAchievementPopup(null), 4000);
    return () => clearTimeout(t);
  }, [achievementPopup]);
  React.useEffect(() => {
    if (!rankUpPopup) return;
    const t = setTimeout(() => setRankUpPopup(null), 5000);
    return () => clearTimeout(t);
  }, [rankUpPopup]);
  const [rpgData, setRpgData] = React.useState(() => {
    try {
      const saved = localStorage.getItem("kasKelas_rpg");
      return saved
        ? JSON.parse(saved)
        : {
            totalXP: 0,
            completedQuests: [],
            achievements: [],
            streakDays: 0,
            lastOpenDate: null,
            dailyLastClaim: null,
            weeklyLastClaim: null,
          };
    } catch {
      return {
        totalXP: 0,
        completedQuests: [],
        achievements: [],
        streakDays: 0,
        lastOpenDate: null,
        dailyLastClaim: null,
        weeklyLastClaim: null,
      };
    }
  });

  // Save RPG data
  React.useEffect(() => {
    try {
      localStorage.setItem("kasKelas_rpg", JSON.stringify(rpgData));
    } catch {}
  }, [rpgData]);

  // Track daily streak
  React.useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setRpgData((prev) => {
      if (prev.lastOpenDate === today) return prev;
      const yesterday = new Date(Date.now() - 86400000)
        .toISOString()
        .split("T")[0];
      const newStreak =
        prev.lastOpenDate === yesterday ? (prev.streakDays || 0) + 1 : 1;
      return { ...prev, lastOpenDate: today, streakDays: newStreak };
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // 🎲 RANDOM TIPS SYSTEM
  const [randomTip, setRandomTip] = React.useState(null);

  React.useEffect(() => {
    const TIPS = [
      {
        icon: "Lightbulb",
        text: "Tips: Cek ulang struk belanja, kadang ada yang nyelip!",
        color: "bg-yellow-50 border-yellow-200 text-yellow-700",
      },
      {
        icon: "Save",
        text: "Jangan lupa Backup Data secara berkala di menu Pengaturan.",
        color: "bg-emerald-50 border-emerald-200 text-emerald-700",
      },
      {
        icon: "Search",
        text: "Cari nama siswa dengan cepat pakai kolom pencarian di Cek Bayar.",
        color: "bg-blue-50 border-blue-200 text-blue-700",
      },
      {
        icon: "PiggyBank",
        text: "Ada ikon babi emas? Itu tandanya siswa punya deposit di minggu libur.",
        color: "bg-amber-50 border-amber-200 text-amber-700",
      },
      {
        icon: "CalendarOff",
        text: "Minggu libur bisa dinonaktifkan di menu Pengaturan agar target saldo tetap rapi.",
        color: "bg-slate-100 border-slate-200 text-slate-600",
      },
      {
        icon: "Trash2",
        text: "Salah input? Hapus transaksi dengan tombol silang (X) di riwayat.",
        color: "bg-rose-50 border-rose-200 text-rose-700",
      },
      {
        icon: "Coffee",
        text: "Rehat sejenak: Jangan lupa minum air putih biar fokus ngitung duit.",
        color: "bg-sky-50 border-sky-200 text-sky-700",
      },
      {
        icon: "Heart",
        text: `Semangat Bendahara! Kamu pahlawan tanpa tanda jasa kelas ${appConfig.className}.`,
        color: "bg-pink-50 border-pink-200 text-pink-700",
      },
      {
        icon: "Smile",
        text: "Senyum dulu dong! Uang kas aman, hati tenang.",
        color: "bg-purple-50 border-purple-200 text-purple-700",
      },
      {
        icon: "Star",
        text: "Ingat: Kejujuran adalah mata uang yang paling berharga.",
        color: "bg-yellow-50 border-yellow-200 text-yellow-700",
      },
      {
        icon: "Ghost",
        text: "Squidward: 'Aku benci semua orang... kecuali yang lunas kas tepat waktu.'",
        color: "bg-teal-50 border-teal-200 text-teal-700 italic",
      },
      {
        icon: "Zap",
        text: "Fakta: Uang kertas Rupiah sebenarnya terbuat dari serat kapas, bukan kertas!",
        color: "bg-orange-50 border-orange-200 text-orange-700",
      },
      {
        icon: "Gem",
        text: "Tahukah kamu? Menabung 5rb sehari = 1.8 juta setahun!",
        color: "bg-indigo-50 border-indigo-200 text-indigo-700",
      },
      {
        icon: "Music",
        text: "Sambil dengerin lagu favorit biar ngitung duitnya makin asik 🎵",
        color: "bg-fuchsia-50 border-fuchsia-200 text-fuchsia-700",
      },
      {
        icon: "Moon",
        text: "Jangan begadang ngurusin kas ya, kesehatanmu lebih penting!",
        color: "bg-slate-50 border-slate-200 text-slate-700",
      },
      {
        icon: "Shield",
        text: "Pro tip: Simpan PIN 4 digit di Pengaturan biar data kamu aman!",
        color: "bg-cyan-50 border-cyan-200 text-cyan-700",
      },
      {
        icon: "TrendingUp",
        text: "Statistik di tab Statistik bisa bantu lihat pola pembayaran kelas.",
        color: "bg-green-50 border-green-200 text-green-700",
      },
      {
        icon: "Clock",
        text: "Kas di-collect tiap Senin? Jangan lupa update sebelum hari Jumat!",
        color: "bg-lime-50 border-lime-200 text-lime-700",
      },
      {
        icon: "Award",
        text: `Fun fact: ${appConfig.className} punya ${(() => {
          try {
            const s = localStorage.getItem("kasKelas_members");
            return s
              ? JSON.parse(s).filter((m) => m.no !== 0).length
              : DEFAULT_MEMBERS_DATA.filter((m) => m.no !== 0).length;
          } catch {
            return "???";
          }
        })()} anggota. Semangat ngurus semuanya!`,
        color: "bg-violet-50 border-violet-200 text-violet-700",
      },
      {
        icon: "BookOpen",
        text: "Cicilan bisa dibayar kapan aja. Cek tab Cicilan untuk input manual.",
        color: "bg-amber-50 border-amber-200 text-amber-700",
      },
      {
        icon: "Clipboard",
        text: "Fitur Salin Laporan di Cek Bayar bisa langsung di-paste ke grup WA.",
        color: "bg-teal-50 border-teal-200 text-teal-700",
      },
      {
        icon: "Sunrise",
        text: "Pagi-pagi ngurus kas lebih fokus. Selamat pagi, Bendahara! ☀️",
        color: "bg-orange-50 border-orange-200 text-orange-700",
      },
      {
        icon: "Target",
        text: "Set target mingguan: 'Minggu ini semua harus lunas!' Let\'s go!",
        color: "bg-red-50 border-red-200 text-red-700",
      },
      {
        icon: "Repeat",
        text: "Cek tab Per Anggota untuk lihat rekap lengkap per siswa.",
        color: "bg-indigo-50 border-indigo-200 text-indigo-700",
      },
      {
        icon: "Sparkles",
        text: "Quick Cicil: Bisa langsung bayar cicilan dari halaman Cek Bayar!",
        color: "bg-fuchsia-50 border-fuchsia-200 text-fuchsia-700",
      },
      {
        icon: "HelpCircle",
        text: "Bingung fitur apa? Klik tombol di pojok kanan bawah (FAB)!",
        color: "bg-gray-50 border-gray-200 text-gray-700",
      },
      {
        icon: "Flame",
        text: "Streak: Kalau semua lunas 3 minggu berturut-turut, kamu legend!",
        color: "bg-rose-50 border-rose-200 text-rose-700",
      },
      {
        icon: "Gift",
        text: "Bendahara terbaik itu yang rajin update data. Keep it up!",
        color: "bg-emerald-50 border-emerald-200 text-emerald-700",
      },
      {
        icon: "Headphones",
        text: "Lo-fi beats + ngitung kas = kombinasi sempurna.",
        color: "bg-sky-50 border-sky-200 text-sky-700",
      },
      {
        icon: "Rocket",
        text: `Kelas ${appConfig.className} bisa jadi kelas dengan catatan keuangan terbersih!`,
        color: "bg-blue-50 border-blue-200 text-blue-700",
      },
    ];
    if (Math.random() > 0.3) {
      setRandomTip(TIPS[Math.floor(Math.random() * TIPS.length)]);
    }
  }, []);

  // AUTO-BACKUP REMINDER
  React.useEffect(() => {
    const lastBackup = localStorage.getItem("kasKelas/lastBackupDate");
    if (!lastBackup) {
      localStorage.setItem("kasKelas/lastBackupDate", new Date().toISOString());
      return;
    }
    const daysSinceBackup = Math.floor(
      (Date.now() - new Date(lastBackup).getTime()) / (1000 * 60 * 60 * 24),
    );
    if (daysSinceBackup >= 7) {
      setTimeout(() => {
        showToast(
          `👀 Udah ${daysSinceBackup} hari belum backup! Buka Pengaturan → Backup Data.`,
          "error",
        );
      }, 3000);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /* 
  ┌────────────────────────────────────────────────────────────────────┐
  │  🛡️ DATA MIGRATION & INITIALIZATION SYSTEM                         │
  └────────────────────────────────────────────────────────────────────┘ 
  */

  // Members State (Auto-Migrate if empty)
  const [members, setMembers] = React.useState(() => {
    try {
      const saved = localStorage.getItem("kasKelas_members");
      if (!saved) {
        return DEFAULT_MEMBERS_DATA;
      }
      return JSON.parse(saved);
    } catch (e) {
      return DEFAULT_MEMBERS_DATA;
    }
  });

  // 🔄 SYNC: appConfig.waliKelas ↔ members[no:0]
  // Kalau wali kelas diubah di Pengaturan → update members[no:0]
  // Kalau wali kelas kosong → hapus entry no:0 dari members
  React.useEffect(() => {
    const waliName = (appConfig.waliKelas || "").trim();
    const expectedNama = waliName ? `${waliName} (Wali Kelas)` : "";

    setMembers((prev) => {
      const existingWali = prev.find((m) => m.no === 0);
      if (waliName) {
        if (!existingWali) {
          return [...prev, { no: 0, nama: expectedNama, jk: "L" }];
        } else if (existingWali.nama !== expectedNama) {
          return prev.map((m) =>
            m.no === 0 ? { ...m, nama: expectedNama } : m,
          );
        }
      } else {
        if (existingWali) {
          return prev.filter((m) => m.no !== 0);
        }
      }
      return prev;
    });
  }, [appConfig.waliKelas]);

  // 📝 GLOBAL ACTIVITY LOG SYSTEM (With Legacy Support)
  const [globalActivities, setGlobalActivities] = React.useState(() => {
    try {
      const saved = localStorage.getItem("kasKelas_activities");
      if (saved) return JSON.parse(saved);
      const legacySaved = localStorage.getItem("kasKelasActivities");
      if (legacySaved) {
        return JSON.parse(legacySaved);
      }
      return [];
    } catch (e) {
      return [];
    }
  });

  // Helper untuk mencatat aktivitas
  const logActivity = (type, description, extra = {}) => {
    const newLog = {
      id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      date: new Date().toLocaleDateString("id-ID"),
      time: new Date().toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      type,
      description,
      ...extra,
    };
    setGlobalActivities((prev) => [newLog, ...prev].slice(0, 100));
  };

  /* 
  ┌────────────────────────────────────────────────────────────────────┐
  │  📱 UI NAVIGATION & VIEW STATE                                     │
  └────────────────────────────────────────────────────────────────────┘ 
  */

  // Derived Constants (Dynamic based on Config)
  const currentWeek = calculateWeek(appConfig.startDate);
  const KAS_MINGGUAN_AMOUNT = appConfig.kasAmount;
  const START_DATE_PROJECT = appConfig.startDate;

  const [activeTab, setActiveTab] = React.useState("dashboard");
  const [selectedMemberView, setSelectedMemberView] = React.useState("");

  /* 
  ┌────────────────────────────────────────────────────────────────────────┐
  │  📊 CORE DATA STATES (Database LocalStorage)                           │
  └────────────────────────────────────────────────────────────────────────┘ 
  */
  const [transactions, setTransactions] = React.useState([]);
  const [iuranKhusus, setIuranKhusus] = React.useState([]);
  const [payments, setPayments] = React.useState({});
  const [kasMingguan, setKasMingguan] = React.useState({});
  const [disabledWeeks, setDisabledWeeks] = React.useState({});
  const [isDataLoaded, setIsDataLoaded] = React.useState(false);
  const isSavingDisabled = React.useRef(false);
  const navScrollRef = React.useRef(null);

  // 🔔 Alerts & Notifications State
  const [dismissedAlerts, setDismissedAlerts] = React.useState([]);
  const dismissAlert = (alertId) => {
    playSound("pop");
    setDismissedAlerts((prev) => [...prev, alertId]);
  };

  /* 
  ┌────────────────────────────────────────────────────────────────────┐
  │  🔍 SEARCH & FILTER STATES                                         │
  └────────────────────────────────────────────────────────────────────┘ 
  */
  const [searchQuery, setSearchQuery] = React.useState("");
  const [memberSearch, setMemberSearch] = React.useState("");
  const [filterType, setFilterType] = React.useState("semua");
  const [filterStatus, setFilterStatus] = React.useState("semua");
  const [sortBy, setSortBy] = React.useState("terbaru");
  const [transactionPage, setTransactionPage] = React.useState(1);
  const [isFilterOpen, setIsFilterOpen] = React.useState(false);

  // Reset pagination on filter/search change
  React.useEffect(() => {
    setTransactionPage(1);
  }, [searchQuery, filterType, sortBy]);

  /* 
  ┌────────────────────────────────────────────────────────────────────────┐
  │  💳 CICILAN FEATURE STATES                                             │
  └────────────────────────────────────────────────────────────────────────┘ 
  */
  const [cicilan, setCicilan] = React.useState({});
  const [cicilanForm, setCicilanForm] = React.useState({
    type: "kas",
    targetId: "",
    iuranId: "",
    week: currentWeek,
    memberNo: undefined,
    amount: "",
    keterangan: "",
  });

  /* 
  ┌────────────────────────────────────────────────────────────────────────┐
  │  📈 STATISTICS & ACTIVITY STATES                                       │
  └────────────────────────────────────────────────────────────────────────┘ 
  */
  const [statView, setStatView] = React.useState("overview");
  const [activitySearch, setActivitySearch] = React.useState("");
  const [activityPage, setActivityPage] = React.useState(1);

  /* 
  ┌────────────────────────────────────────────────────────────────────────┐
  │  ✨ ANIMATION & VISUAL EFFECT STATES                                   │
  └────────────────────────────────────────────────────────────────────────┘ 
  */
  const [showCelebration, setShowCelebration] = React.useState(false);
  const [saldoEffect, setSaldoEffect] = React.useState(null);
  const [saldoChange, setSaldoChange] = React.useState(0);
  const [showChangeIndicator, setShowChangeIndicator] = React.useState(false);
  // [CLEANED] pemasukanEffect & pengeluaranEffect removed — always false, animations never trigger
  // flyingCoin — reserved for future coin animation effect

  /* 
  ┌────────────────────────────────────────────────────────────────────────┐
  │  🔔 UX FEEDBACK & MODAL STATES                                         │
  └────────────────────────────────────────────────────────────────────────┘ 
  */
  const [toast, setToast] = React.useState({
    show: false,
    message: "",
    type: "success",
    closing: false,
  });
  const [confirmModal, setConfirmModal] = React.useState(null);
  const [confirmInput, setConfirmInput] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isToggling, setIsToggling] = React.useState(false);
  // [CLEANED] setShowDetailModal removed — modal never rendered
  // showPemasukanTooltip, showPengeluaranTooltip — reserved for future tooltip hover
  // [CLEANED] showSaldoTooltip removed — always false, tooltip never renders

  // Confirmation Modals
  const [toggleConfirm, setToggleConfirm] = React.useState(null);

  /* 
  ┌────────────────────────────────────────────────────────────────────────┐
  │  🎗️ CEK BAYAR STATES                                                   │
  └────────────────────────────────────────────────────────────────────────┘ 
  */
  const [cekBayarMode, setCekBayarMode] = React.useState("kas");
  const [selectedCekWeek, setSelectedCekWeek] = React.useState(currentWeek);
  const [cekBayarKey, setCekBayarKey] = React.useState(0);

  /* 
  ┌────────────────────────────────────────────────────────────────────────┐
  │  💾 REFS & PERSISTENT TIMERS                                           │
  └────────────────────────────────────────────────────────────────────────┘ 
  */
  const saldoAkhirRef = React.useRef(0);
  const toastTimerRef = React.useRef(null);

  // 🔄 EFFECTS & CALCULATIONS

  // Cleanup toast timer on unmount
  React.useEffect(() => {
    return () => {
      if (toastTimerRef.current) {
        clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

  // === TOAST NOTIFICATION FUNCTION ===
  const showToast = (message, type = "success") => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);

    let finalType = type;
    if (
      message.toLowerCase().includes("batal") ||
      message.toLowerCase().includes("hapus")
    ) {
      finalType = "error";
    }

    setToast({ show: true, message, type: finalType, closing: false });

    toastTimerRef.current = setTimeout(() => {
      setToast((prev) => ({ ...prev, closing: true }));
      toastTimerRef.current = setTimeout(() => {
        setToast({ show: false, message: "", type: "success", closing: false });
        toastTimerRef.current = null;
      }, 300);
    }, 3000);
  };

  // 🎭 RPG EFFECT TRIGGER
  const triggerFinanceEffect = (amount) => {
    if (!amount || amount === 0) return;

    setSaldoChange(Math.abs(amount));
    setSaldoEffect(amount > 0 ? "positive" : "negative");
    setShowChangeIndicator(true);

    if (amount < 0) {
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 600);
    }

    // Celebration Milestone (Setiap kelipatan 175rb)
    const s = Number(saldoAkhirRef.current) || 0;
    const currentMilestone = Math.floor(s / 175000);
    const nextMilestone = Math.floor((s + amount) / 175000);

    if (nextMilestone > currentMilestone && amount > 0) {
      setShowCelebration(true);
      if (typeof confetti !== "undefined") {
        confetti({
          particleCount: 200,
          spread: 100,
          origin: { y: 0.6 },
          colors: ["#fbbf24", "#f59e0b", "#ffffff"],
        });
      }
      setTimeout(() => setShowCelebration(false), 4000);
    }

    setTimeout(() => {
      setSaldoEffect(null);
      setShowChangeIndicator(false);
    }, 2000);
  };

  // FILTER & SORT LOGIC
  const filteredTransactions = React.useMemo(() => {
    let filtered = [...transactions];
    if (filterType !== "semua") {
      filtered = filtered.filter((t) => t.type === filterType);
    }
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          (t.name && t.name.toLowerCase().includes(query)) ||
          (t.description && t.description.toLowerCase().includes(query)),
      );
    }
    filtered.sort((a, b) => {
      if (sortBy === "terbaru") return new Date(b.date) - new Date(a.date);
      if (sortBy === "terlama") return new Date(a.date) - new Date(b.date);
      if (sortBy === "terbesar") return (b.amount || 0) - (a.amount || 0);
      if (sortBy === "terkecil") return (a.amount || 0) - (b.amount || 0);
      return 0;
    });
    return filtered;
  }, [transactions, filterType, searchQuery, sortBy]);

  // Load data from localStorage on component mount
  React.useEffect(() => {
    const safeJSONParse = (key, defaultValue) => {
      try {
        const data = localStorage.getItem(key);
        if (!data) return defaultValue;
        return JSON.parse(data);
      } catch (error) {
        console.error(`Error parsing ${key}:`, error);
        localStorage.removeItem(key);
        return defaultValue;
      }
    };

    // 🧹 DATA SANITIZATION
    const rawKas = safeJSONParse("kasKelas_kasMingguan", {});
    const cleanKas = {};
    Object.entries(rawKas).forEach(([key, val]) => {
      const parts = key.split(/[-|_]/);
      if (parts.length < 2) return;
      const w = Number.parseInt(parts[0]);
      let mId = Number.parseInt(parts[1]);
      if (isNaN(mId)) {
        const found = DEFAULT_MEMBERS_DATA.find(
          (m) => m.nama.toLowerCase() === parts[1].toLowerCase(),
        );
        if (found) mId = found.no;
      }
      if (!isNaN(w) && !isNaN(mId)) {
        cleanKas[`${w}-${mId}`] = val;
      }
    });

    setTransactions(safeJSONParse("kasKelas_transactions", []));
    setIuranKhusus(safeJSONParse("kasKelas_iuranKhusus", []));
    setPayments(safeJSONParse("kasKelas_payments", {}));
    setKasMingguan(cleanKas);
    setDisabledWeeks(safeJSONParse("kasKelas_disabledWeeks", {}));
    setCicilan(safeJSONParse("kasKelas_cicilan", {}));

    setTimeout(() => {
      setIsDataLoaded(true);
      if (typeof window.appReady === "function") {
        window.appReady();
      }
    }, 100);
  }, []);

  // 💾 SINGLE SOLID SAVE EFFECT
  React.useEffect(() => {
    if (!isDataLoaded || isSavingDisabled.current) return;

    const saveData = setTimeout(() => {
      if (isSavingDisabled.current) return;
      try {
        const storageMap = {
          kasKelas_transactions: transactions,
          kasKelas_iuranKhusus: iuranKhusus,
          kasKelas_payments: payments,
          kasKelas_disabledWeeks: disabledWeeks,
          kasKelas_kasMingguan: kasMingguan,
          kasKelas_cicilan: cicilan,
          kasKelas_activities: globalActivities,
          kasKelas_members: members,
          kasKelas_config: appConfig,
        };
        Object.entries(storageMap).forEach(([key, value]) => {
          localStorage.setItem(key, JSON.stringify(value));
        });
      } catch (error) {
        console.warn("❌ Gagal menyimpan data:", error);
      }
    }, 1000);

    return () => clearTimeout(saveData);
  }, [
    transactions,
    iuranKhusus,
    payments,
    disabledWeeks,
    kasMingguan,
    cicilan,
    globalActivities,
    members,
    appConfig,
    isDataLoaded,
  ]);

  // 🛡️ FLUSH: Save data synchronously on tab close to prevent data loss
  React.useEffect(() => {
    const flushSave = () => {
      if (!isDataLoaded || isSavingDisabled.current) return;
      try {
        const storageMap = {
          kasKelas_transactions: transactions,
          kasKelas_iuranKhusus: iuranKhusus,
          kasKelas_payments: payments,
          kasKelas_disabledWeeks: disabledWeeks,
          kasKelas_kasMingguan: kasMingguan,
          kasKelas_cicilan: cicilan,
          kasKelas_activities: globalActivities,
          kasKelas_members: members,
          kasKelas_config: appConfig,
        };
        Object.entries(storageMap).forEach(([key, value]) => {
          localStorage.setItem(key, JSON.stringify(value));
        });
      } catch (e) {
        // Best-effort flush — ignore errors on unload
      }
    };
    window.addEventListener("beforeunload", flushSave);
    return () => window.removeEventListener("beforeunload", flushSave);
  }, [
    transactions,
    iuranKhusus,
    payments,
    disabledWeeks,
    kasMingguan,
    cicilan,
    globalActivities,
    members,
    appConfig,
    isDataLoaded,
  ]);

  // 💰 SOURCE OF TRUTH: Perhitungan Saldo Utama
  const { totalPemasukan, totalPengeluaran, saldoAkhir } = React.useMemo(() => {
    const manualIncome = transactions
      .filter((t) => t.type === "pemasukan")
      .reduce((sum, t) => sum + (t.amount || 0), 0);

    let kasTotal = 0;
    members
      .filter((m) => m.no !== 0)
      .forEach((member) => {
        for (let w = 1; w <= currentWeek; w++) {
          // Deposit di minggu libur TETAP dihitung ke saldo
          const key = `${w}-${member.no}`;
          if (kasMingguan[key] === true) {
            kasTotal += KAS_MINGGUAN_AMOUNT;
          } else {
            const cicilanKey = `kas-${w}-${member.no}`;
            kasTotal += (cicilan[cicilanKey] || []).reduce(
              (sum, c) => sum + (c.amount || 0),
              0,
            );
          }
        }
      });

    let iuranTotal = 0;
    iuranKhusus.forEach((iuran) => {
      members
        .filter((m) => m.no !== 0)
        .forEach((member) => {
          const key = `${iuran.id}-${member.no}`;
          if (payments[key] === true) {
            iuranTotal += iuran.amount;
          } else {
            const cicilanKey = `iuran-${iuran.id}-${member.no}`;
            iuranTotal += (cicilan[cicilanKey] || []).reduce(
              (sum, c) => sum + (c.amount || 0),
              0,
            );
          }
        });
    });

    const income = manualIncome + kasTotal + iuranTotal;
    const expense = transactions
      .filter((t) => t.type === "pengeluaran")
      .reduce((sum, t) => sum + (t.amount || 0), 0);

    return {
      totalPemasukan: income,
      totalPengeluaran: expense,
      saldoAkhir: income - expense,
    };
  }, [
    transactions,
    kasMingguan,
    payments,
    iuranKhusus,
    cicilan,
    members,
    disabledWeeks,
    currentWeek,
  ]);
  saldoAkhirRef.current = saldoAkhir;

  // 💰 DEPOSIT CARRY-FORWARD: Map deposit dari minggu libur → lunas di minggu aktif berikutnya
  const depositCarryForward = React.useMemo(() => {
    const carryMap = {}; // key: "targetWeek-memberNo" → { fromWeek }
    const depositSourceMap = {}; // key: "sourceWeek-memberNo" → { targetWeek }

    members
      .filter((m) => m.no !== 0)
      .forEach((member) => {
        for (let w = 1; w <= currentWeek; w++) {
          if (!disabledWeeks[w]) continue; // Hanya proses minggu libur
          const key = `${w}-${member.no}`;
          if (kasMingguan[key] !== true) continue; // Hanya yang sudah bayar (deposit)

          // Cari minggu aktif PERTAMA setelah minggu libur ini (tepat berikutnya)
          let targetWeek = null;
          for (let nw = w + 1; nw <= currentWeek; nw++) {
            if (disabledWeeks[nw]) continue; // Skip minggu libur juga
            // Target = minggu aktif pertama setelah libur, titik.
            // Kalau sudah lunas sendiri atau sudah di-carry lain, deposit ini "nganggur"
            targetWeek = nw;
            break;
          }

          // Hanya carry kalau target belum lunas sendiri & belum di-carry deposit lain
          if (targetWeek) {
            const targetKey = `${targetWeek}-${member.no}`;
            if (kasMingguan[targetKey] === true || carryMap[targetKey]) {
              // Target sudah lunas sendiri atau sudah di-carry — deposit nganggur
              targetWeek = null;
            }
          }

          if (targetWeek) {
            const targetKey = `${targetWeek}-${member.no}`;
            carryMap[targetKey] = { fromWeek: w };
            depositSourceMap[`${w}-${member.no}`] = { targetWeek };
          }
        }
      });

    return { carryMap, depositSourceMap };
  }, [members, currentWeek, disabledWeeks, kasMingguan]);

  const totalCicilanTerbayar = Object.values(cicilan).reduce(
    (total, cicilanList) =>
      total + cicilanList.reduce((sum, c) => sum + (c.amount || 0), 0),
    0,
  );

  // Budget warning (Pengeluaran > 80% Pemasukan)
  const isBudgetWarning = totalPengeluaran > totalPemasukan * 0.8;

  // Hitung total kas mingguan yang terkumpul
  // Deposit di minggu libur tetap dihitung
  const totalKasMingguan = Object.keys(kasMingguan).reduce((total, key) => {
    if (!kasMingguan[key]) return total;
    return total + KAS_MINGGUAN_AMOUNT;
  }, 0);

  // Hitung total iuran khusus yang terkumpul
  const totalIuranKhusus = iuranKhusus.reduce((total, iuran) => {
    const paidCount = members.filter(
      (m) => m.no !== 0 && payments[`${iuran.id}-${m.no}`],
    ).length;
    return total + paidCount * iuran.amount;
  }, 0);

  // 🏆 RPG SYSTEM: Finance Rank
  const financeRank = React.useMemo(() => {
    const s = Number(saldoAkhir) || 0;
    if (s < 0)
      return {
        title: "Krisis Moneter",
        rank: "F",
        color: "bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)]",
        textColor: "text-red-100",
        icon: "Skull",
      };
    if (s < 100000)
      return {
        title: "Gubuk Reyot Jir",
        rank: "E",
        color: "bg-slate-500 shadow-[0_0_15px_rgba(100,116,139,0.5)]",
        textColor: "text-slate-100",
        icon: "Home",
      };
    if (s < 500000)
      return {
        title: "Rumah Warga",
        rank: "D",
        color: "bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]",
        textColor: "text-blue-100",
        icon: "Home",
      };
    if (s < 1000000)
      return {
        title: "Ruko Megah",
        rank: "C",
        color: "bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]",
        textColor: "text-emerald-100",
        icon: "Building",
      };
    if (s < 2000000)
      return {
        title: "Jenderal Hitam",
        rank: "B",
        color: "bg-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.5)]",
        textColor: "text-purple-100",
        icon: "Castle",
      };
    return {
      title: "Kaisar Sigma 💸",
      rank: "A",
      color:
        "bg-gradient-to-r from-yellow-400 to-amber-600 shadow-[0_0_20px_rgba(245,158,11,0.6)]",
      textColor: "text-yellow-50",
      icon: "Crown",
    };
  }, [saldoAkhir]);

  // 🎮 RPG XP ENGINE — calculates rank, quests, achievements from real data
  const rpgCurrentRank = React.useMemo(() => {
    const xp = rpgData.totalXP || 0;
    let current = RANK_TIERS[0];
    for (const tier of RANK_TIERS) {
      if (xp >= tier.xpRequired) current = tier;
    }
    const idx = RANK_TIERS.indexOf(current);
    const next = idx < RANK_TIERS.length - 1 ? RANK_TIERS[idx + 1] : null;
    return { ...current, nextRank: next };
  }, [rpgData.totalXP]);

  const rpgXpProgress = React.useMemo(() => {
    const xp = rpgData.totalXP || 0;
    const curr = rpgCurrentRank;
    const next = curr.nextRank;
    if (!next) return 100;
    const range = next.xpRequired - curr.xpRequired;
    if (range === 0) return 100;
    const progress = xp - curr.xpRequired;
    return Math.min(100, Math.round((progress / range) * 100));
  }, [rpgData.totalXP, rpgCurrentRank]);

  // Daily quests
  const rpgDailyQuests = React.useMemo(() => {
    const today = new Date().toISOString().split("T")[0];
    const claimed =
      rpgData.dailyLastClaim === today
        ? (rpgData.completedQuests || []).filter(
            (q) => q.startsWith("daily_") && q.endsWith(today),
          )
        : [];
    const todayTransactions = transactions.filter((t) => t.date === today);
    const todayPemasukan = todayTransactions.filter(
      (t) => t.type === "pemasukan",
    );
    const todayPengeluaran = todayTransactions.filter(
      (t) => t.type === "pengeluaran",
    );
    // Check if any kas mingguan was checked today (approximate: any member paid this week)
    const totalSiswa = members.filter((m) => m.no !== 0).length;
    const paidCount =
      totalSiswa > 0
        ? members.filter(
            (m) => m.no !== 0 && kasMingguan[`${currentWeek}-${m.no}`],
          ).length
        : 0;
    const hasCekBayar = paidCount > 0;
    // Streak bonus
    const streak = rpgData.streakDays || 0;
    return [
      {
        id: `daily_open_${today}`,
        title: "Buka Aplikasi",
        description: "Buka KasKelas hari ini",
        xpReward: 2,
        completed: true,
        claimable: !claimed.includes(`daily_open_${today}`),
        icon: "LogIn",
      },
      {
        id: `daily_transaksi_${today}`,
        title: "Catat Transaksi",
        description: "Catat minimal 1 transaksi hari ini",
        xpReward: 5,
        completed: todayTransactions.length > 0,
        claimable:
          todayTransactions.length > 0 &&
          !claimed.includes(`daily_transaksi_${today}`),
        icon: "PenLine",
      },
      {
        id: `daily_pemasukan_${today}`,
        title: "Terima Pemasukan",
        description: "Catat minimal 1 pemasukan hari ini",
        xpReward: 3,
        completed: todayPemasukan.length > 0,
        claimable:
          todayPemasukan.length > 0 &&
          !claimed.includes(`daily_pemasukan_${today}`),
        icon: "ArrowUpRight",
      },
      {
        id: `daily_cekbayar_${today}`,
        title: "Cek Pembayaran",
        description: "Centang kas mingguan minimal 1 siswa",
        xpReward: 3,
        completed: hasCekBayar,
        claimable: hasCekBayar && !claimed.includes(`daily_cekbayar_${today}`),
        icon: "CheckSquare",
      },
      ...(streak >= 3
        ? [
            {
              id: `daily_streak_${today}`,
              title: "Streak Bonus",
              description: `${streak} hari berturut-turut! Bonus XP`,
              xpReward: Math.min(streak, 10),
              completed: true,
              claimable: !claimed.includes(`daily_streak_${today}`),
              icon: "Flame",
            },
          ]
        : []),
      ...(todayTransactions.length >= 3
        ? [
            {
              id: `daily_triple_${today}`,
              title: "Triple Catat",
              description: "Catat 3 transaksi dalam sehari",
              xpReward: 8,
              completed: true,
              claimable: !claimed.includes(`daily_triple_${today}`),
              icon: "Zap",
            },
          ]
        : []),
    ];
  }, [rpgData, transactions, members, kasMingguan, currentWeek]);

  // Weekly quests
  const rpgWeeklyQuests = React.useMemo(() => {
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    const weekKey = `${weekStart.getFullYear()}-${String(weekStart.getMonth() + 1).padStart(2, "0")}-${String(weekStart.getDate()).padStart(2, "0")}`;
    const claimed =
      rpgData.weeklyLastClaim === weekKey
        ? (rpgData.completedQuests || []).filter(
            (q) => q.startsWith("weekly_") && q.endsWith(weekKey),
          )
        : [];
    const totalSiswa = members.filter((m) => m.no !== 0).length;
    const allPaidThisWeek =
      totalSiswa > 0 &&
      members.filter((m) => m.no !== 0 && kasMingguan[`${currentWeek}-${m.no}`])
        .length === totalSiswa;
    const didBackup = rpgData.completedQuests?.some(
      (q) => q.startsWith("weekly_backup_") && q.endsWith(weekKey),
    );
    // Check if backup was done this week (via lastBackupDate in localStorage)
    let backupDoneThisWeek = !!didBackup;
    try {
      const lastBkp = localStorage.getItem("kasKelas/lastBackupDate");
      if (lastBkp) {
        const bkpDate = new Date(lastBkp);
        const wkStart = new Date(weekKey);
        backupDoneThisWeek = backupDoneThisWeek || bkpDate >= wkStart;
      }
    } catch {}
    // Weekly transactions count
    const wkStartDate = new Date(weekKey);
    const wkEndDate = new Date(wkStartDate);
    wkEndDate.setDate(wkEndDate.getDate() + 7);
    const weekTxCount = transactions.filter((t) => {
      const d = new Date(t.date);
      return d >= wkStartDate && d < wkEndDate;
    }).length;
    // Check if any pengeluaran recorded this week
    const weekHasExpense = transactions.some((t) => {
      const d = new Date(t.date);
      return d >= wkStartDate && d < wkEndDate && t.type === "pengeluaran";
    });
    return [
      {
        id: `weekly_full_lunas_${weekKey}`,
        title: "Full Lunas Mingguan",
        description: `Semua ${totalSiswa} siswa lunas minggu ini`,
        xpReward: 30,
        completed: allPaidThisWeek,
        claimable:
          allPaidThisWeek && !claimed.includes(`weekly_full_lunas_${weekKey}`),
        icon: "CheckCircle2",
      },
      {
        id: `weekly_backup_${weekKey}`,
        title: "Backup Data",
        description: "Backup data minggu ini",
        xpReward: 10,
        completed: backupDoneThisWeek,
        claimable:
          backupDoneThisWeek && !claimed.includes(`weekly_backup_${weekKey}`),
        icon: "HardDrive",
      },
      {
        id: `weekly_positive_${weekKey}`,
        title: "Saldo Positif",
        description: "Saldo tetap positif sepanjang minggu",
        xpReward: 15,
        completed: saldoAkhir >= 0,
        claimable:
          saldoAkhir >= 0 && !claimed.includes(`weekly_positive_${weekKey}`),
        icon: "TrendingUp",
      },
      {
        id: `weekly_5tx_${weekKey}`,
        title: "Pencatat Rajin",
        description: "Catat 5 transaksi dalam seminggu",
        xpReward: 15,
        completed: weekTxCount >= 5,
        claimable:
          weekTxCount >= 5 && !claimed.includes(`weekly_5tx_${weekKey}`),
        icon: "BookOpen",
      },
      {
        id: `weekly_expense_${weekKey}`,
        title: "Juru Belanja Mingguan",
        description: "Catat minimal 1 pengeluaran minggu ini",
        xpReward: 10,
        completed: weekHasExpense,
        claimable:
          weekHasExpense && !claimed.includes(`weekly_expense_${weekKey}`),
        icon: "ShoppingBag",
      },
    ];
  }, [rpgData, members, kasMingguan, currentWeek, saldoAkhir, transactions]);

  // Achievements (one-time) — expanded collection
  const rpgAchievements = React.useMemo(() => {
    const done = rpgData.achievements || [];
    const totalSiswa = members.filter((m) => m.no !== 0).length;
    const totalTx = transactions.length;
    const totalPemasukan = transactions
      .filter((t) => t.type === "pemasukan")
      .reduce((s, t) => s + t.amount, 0);
    const totalPengeluaran = transactions
      .filter((t) => t.type === "pengeluaran")
      .reduce((s, t) => s + t.amount, 0);
    return [
      // ── COMMON (starter) ──
      {
        id: "first_setup",
        title: "Pertama Kali",
        description: "Selesaikan first setup",
        xpReward: 20,
        completed: done.includes("first_setup"),
        icon: "Rocket",
        rarity: "common",
      },
      {
        id: "first_transaction",
        title: "Transaksi Perdana",
        description: "Catat transaksi pertama",
        xpReward: 10,
        completed: done.includes("first_transaction") || totalTx > 0,
        icon: "PenLine",
        rarity: "common",
      },
      {
        id: "first_pdf",
        title: "Bendahara Teladan",
        description: "Export laporan PDF pertama",
        xpReward: 10,
        completed: done.includes("first_pdf"),
        icon: "FileText",
        rarity: "common",
      },
      {
        id: "first_iuran",
        title: "Kolektor Pemula",
        description: "Buat iuran khusus pertama",
        xpReward: 10,
        completed: done.includes("first_iuran") || iuranKhusus.length > 0,
        icon: "ClipboardList",
        rarity: "common",
      },
      {
        id: "first_expense",
        title: "Juru Belanja",
        description: "Catat pengeluaran pertama",
        xpReward: 10,
        completed:
          done.includes("first_expense") ||
          transactions.some((t) => t.type === "pengeluaran"),
        icon: "ShoppingBag",
        rarity: "common",
      },

      // ── RARE (progress milestones) ──
      {
        id: "tx_10",
        title: "Pencatat Aktif",
        description: "Catat 10 transaksi",
        xpReward: 15,
        completed: done.includes("tx_10") || totalTx >= 10,
        icon: "BookOpen",
        rarity: "rare",
      },
      {
        id: "tx_50",
        title: "Mesin Pencatat",
        description: "Catat 50 transaksi",
        xpReward: 30,
        completed: done.includes("tx_50") || totalTx >= 50,
        icon: "Cpu",
        rarity: "rare",
      },
      {
        id: "kolektor_500k",
        title: "Kolektor Ulung",
        description: "Kumpulkan saldo Rp 500.000",
        xpReward: 25,
        completed: done.includes("kolektor_500k") || saldoAkhir >= 500000,
        icon: "Gem",
        rarity: "rare",
      },
      {
        id: "backup_5x",
        title: "Tukang Backup",
        description: "Backup data 5 kali",
        xpReward: 15,
        completed:
          done.includes("backup_5x") || (rpgData.backupCount || 0) >= 5,
        icon: "HardDrive",
        rarity: "rare",
      },
      {
        id: "streak_7",
        title: "Rajin Buka",
        description: "7 hari berturut-turut buka app",
        xpReward: 25,
        completed: done.includes("streak_7") || rpgData.streakDays >= 7,
        icon: "Flame",
        rarity: "rare",
      },
      {
        id: "iuran_3",
        title: "Event Organizer",
        description: "Buat 3 iuran khusus",
        xpReward: 20,
        completed: done.includes("iuran_3") || iuranKhusus.length >= 3,
        icon: "CalendarPlus",
        rarity: "rare",
      },
      {
        id: "pemasukan_1m",
        title: "Satu Juta Pertama",
        description: "Total pemasukan Rp 1.000.000",
        xpReward: 25,
        completed: done.includes("pemasukan_1m") || totalPemasukan >= 1000000,
        icon: "TrendingUp",
        rarity: "rare",
      },

      // ── EPIC (hard milestones) ──
      {
        id: "jutawan",
        title: "Jutawan Kelas",
        description: "Saldo mencapai Rp 1.000.000",
        xpReward: 50,
        completed: done.includes("jutawan") || saldoAkhir >= 1000000,
        icon: "Crown",
        rarity: "epic",
      },
      {
        id: "streak_30",
        title: "Sang Penjaga",
        description: "30 hari berturut-turut buka app",
        xpReward: 50,
        completed: done.includes("streak_30") || rpgData.streakDays >= 30,
        icon: "Shield",
        rarity: "epic",
      },
      {
        id: "tx_100",
        title: "Veteran Kasir",
        description: "Catat 100 transaksi",
        xpReward: 40,
        completed: done.includes("tx_100") || totalTx >= 100,
        icon: "Award",
        rarity: "epic",
      },
      {
        id: "saldo_2m",
        title: "Sultan Kelas",
        description: "Saldo mencapai Rp 2.000.000",
        xpReward: 60,
        completed: done.includes("saldo_2m") || saldoAkhir >= 2000000,
        icon: "BadgeDollarSign",
        rarity: "epic",
      },
      {
        id: "streak_60",
        title: "Penjaga Abadi",
        description: "60 hari berturut-turut buka app",
        xpReward: 60,
        completed: done.includes("streak_60") || rpgData.streakDays >= 60,
        icon: "ShieldCheck",
        rarity: "epic",
      },
      {
        id: "iuran_5",
        title: "Manajer Keuangan",
        description: "Kelola 5 iuran khusus",
        xpReward: 35,
        completed: done.includes("iuran_5") || iuranKhusus.length >= 5,
        icon: "Briefcase",
        rarity: "epic",
      },
      {
        id: "pengeluaran_500k",
        title: "Big Spender",
        description: "Total pengeluaran Rp 500.000",
        xpReward: 30,
        completed:
          done.includes("pengeluaran_500k") || totalPengeluaran >= 500000,
        icon: "CreditCard",
        rarity: "epic",
      },

      // ── LEGENDARY (ultimate goals) ──
      {
        id: "full_lunas_all",
        title: "Kelas Bebas Hutang",
        description: "Semua siswa lunas semua minggu",
        xpReward: 100,
        completed: done.includes("full_lunas_all"),
        icon: "Sparkles",
        rarity: "legendary",
      },
      {
        id: "sigma_grindset",
        title: "Sigma Grindset",
        description: "10 minggu berturut-turut full lunas",
        xpReward: 100,
        completed: done.includes("sigma_grindset"),
        icon: "Flame",
        rarity: "legendary",
      },
      {
        id: "tx_200",
        title: "Grand Master",
        description: "Catat 200 transaksi",
        xpReward: 80,
        completed: done.includes("tx_200") || totalTx >= 200,
        icon: "Sword",
        rarity: "legendary",
      },
      {
        id: "saldo_5m",
        title: "Konglomerat XII",
        description: "Saldo mencapai Rp 5.000.000",
        xpReward: 100,
        completed: done.includes("saldo_5m") || saldoAkhir >= 5000000,
        icon: "Castle",
        rarity: "legendary",
      },
      {
        id: "streak_100",
        title: "Immortal",
        description: "100 hari streak tanpa putus",
        xpReward: 100,
        completed: done.includes("streak_100") || rpgData.streakDays >= 100,
        icon: "Infinity",
        rarity: "legendary",
      },
    ];
  }, [rpgData, transactions, saldoAkhir, members, iuranKhusus]);

  // Auto-award achievements that are milestone-based
  React.useEffect(() => {
    const done = rpgData.achievements || [];
    const totalTx = transactions.length;
    const totalPemasukan = transactions
      .filter((t) => t.type === "pemasukan")
      .reduce((s, t) => s + t.amount, 0);
    const totalPengeluaran = transactions
      .filter((t) => t.type === "pengeluaran")
      .reduce((s, t) => s + t.amount, 0);
    const streak = rpgData.streakDays || 0;

    // All auto-awardable milestones: [id, condition, xp]
    const checks = [
      ["first_transaction", totalTx > 0, 10],
      ["first_expense", transactions.some((t) => t.type === "pengeluaran"), 10],
      ["first_iuran", iuranKhusus.length > 0, 10],
      ["tx_10", totalTx >= 10, 15],
      ["tx_50", totalTx >= 50, 30],
      ["tx_100", totalTx >= 100, 40],
      ["tx_200", totalTx >= 200, 80],
      ["kolektor_500k", saldoAkhir >= 500000, 25],
      ["jutawan", saldoAkhir >= 1000000, 50],
      ["saldo_2m", saldoAkhir >= 2000000, 60],
      ["saldo_5m", saldoAkhir >= 5000000, 100],
      ["streak_7", streak >= 7, 25],
      ["streak_30", streak >= 30, 50],
      ["streak_60", streak >= 60, 60],
      ["streak_100", streak >= 100, 100],
      ["iuran_3", iuranKhusus.length >= 3, 20],
      ["iuran_5", iuranKhusus.length >= 5, 35],
      ["pemasukan_1m", totalPemasukan >= 1000000, 25],
      ["pengeluaran_500k", totalPengeluaran >= 500000, 30],
      ["backup_5x", (rpgData.backupCount || 0) >= 5, 15],
    ];

    const newAchievements = [];
    let bonusXP = 0;
    for (const [id, condition, xp] of checks) {
      if (condition && !done.includes(id)) {
        newAchievements.push(id);
        bonusXP += xp;
      }
    }

    // Special check: full_lunas_all (deposit carry-forward counts!)
    if (!done.includes("full_lunas_all")) {
      const siswa = members.filter((m) => m.no !== 0);
      const allLunas =
        siswa.length > 0 &&
        currentWeek > 0 &&
        siswa.every((m) => {
          for (let w = 1; w <= currentWeek; w++) {
            if (disabledWeeks[w]) continue;
            const key = `${w}-${m.no}`;
            // Lunas langsung ATAU di-cover deposit carry-forward
            if (!kasMingguan[key] && !depositCarryForward.carryMap[key]) return false;
          }
          return true;
        });
      if (allLunas) {
        newAchievements.push("full_lunas_all");
        bonusXP += 100;
      }
    }

    // Special check: sigma_grindset (10 minggu berturut-turut full lunas, deposit counts!)
    if (!done.includes("sigma_grindset") && currentWeek >= 10) {
      const siswa = members.filter((m) => m.no !== 0);
      let consecutiveFull = 0;
      for (let w = currentWeek; w >= 1; w--) {
        if (disabledWeeks[w]) {
          continue;
        }
        const weekFull = siswa.every(
          (m) => kasMingguan[`${w}-${m.no}`] === true || !!depositCarryForward.carryMap[`${w}-${m.no}`],
        );
        if (weekFull) {
          consecutiveFull++;
        } else {
          break;
        }
      }
      if (consecutiveFull >= 10) {
        newAchievements.push("sigma_grindset");
        bonusXP += 100;
      }
    }

    if (newAchievements.length > 0) {
      // Check if rank will change (for rank-up celebration)
      const oldXP = rpgData.totalXP || 0;
      const newXP = oldXP + bonusXP;
      const oldRank = RANK_TIERS.reduce(
        (best, t) => (oldXP >= t.xpRequired ? t : best),
        RANK_TIERS[0],
      );
      const newRank = RANK_TIERS.reduce(
        (best, t) => (newXP >= t.xpRequired ? t : best),
        RANK_TIERS[0],
      );
      const didRankUp = newRank.rank > oldRank.rank;

      setRpgData((prev) => ({
        ...prev,
        totalXP: (prev.totalXP || 0) + bonusXP,
        achievements: [...(prev.achievements || []), ...newAchievements],
      }));

      // Show celebration for each achievement
      newAchievements.forEach((a, idx) => {
        const achievement = rpgAchievements.find((ac) => ac.id === a);
        if (achievement) {
          setTimeout(() => {
            setAchievementPopup(achievement);
            playSound("achievement");
            // Confetti for epic/legendary
            if (
              (achievement.rarity === "epic" ||
                achievement.rarity === "legendary") &&
              typeof confetti !== "undefined"
            ) {
              confetti({
                particleCount: achievement.rarity === "legendary" ? 200 : 100,
                spread: achievement.rarity === "legendary" ? 120 : 80,
                origin: { y: 0.5 },
                colors:
                  achievement.rarity === "legendary"
                    ? ["#fbbf24", "#f59e0b", "#ef4444", "#8b5cf6", "#3b82f6"]
                    : ["#8b5cf6", "#a855f7", "#c084fc", "#e9d5ff"],
              });
            }
          }, idx * 2500); // stagger multiple achievements
        }
      });

      // Rank-up celebration
      if (didRankUp) {
        setTimeout(
          () => {
            setRankUpPopup(newRank);
            playSound("levelUp");
            if (typeof confetti !== "undefined") {
              // Epic confetti burst for rank up
              const end = Date.now() + 1500;
              const frame = () => {
                confetti({
                  particleCount: 4,
                  angle: 60,
                  spread: 55,
                  origin: { x: 0 },
                  colors: ["#fbbf24", "#f97316", "#ef4444"],
                });
                confetti({
                  particleCount: 4,
                  angle: 120,
                  spread: 55,
                  origin: { x: 1 },
                  colors: ["#8b5cf6", "#3b82f6", "#10b981"],
                });
                if (Date.now() < end) requestAnimationFrame(frame);
              };
              frame();
            }
          },
          newAchievements.length * 2500 + 500,
        );
      }
    }
  }, [
    transactions,
    saldoAkhir,
    rpgData.streakDays,
    rpgData.backupCount,
    iuranKhusus.length,
    kasMingguan,
    members,
    disabledWeeks,
    currentWeek,
  ]); // eslint-disable-line react-hooks/exhaustive-deps

  // Claim quest handler
  const claimQuest = (questId) => {
    const today = new Date().toISOString().split("T")[0];
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    const weekKey = `${weekStart.getFullYear()}-${String(weekStart.getMonth() + 1).padStart(2, "0")}-${String(weekStart.getDate()).padStart(2, "0")}`;
    const allQuests = [...rpgDailyQuests, ...rpgWeeklyQuests];
    const quest = allQuests.find((q) => q.id === questId);
    if (!quest || !quest.claimable) return;
    // Check for rank-up before state update
    const oldXP = rpgData.totalXP || 0;
    const newXP = oldXP + quest.xpReward;
    const oldRank = RANK_TIERS.reduce(
      (best, t) => (oldXP >= t.xpRequired ? t : best),
      RANK_TIERS[0],
    );
    const newRank = RANK_TIERS.reduce(
      (best, t) => (newXP >= t.xpRequired ? t : best),
      RANK_TIERS[0],
    );

    setRpgData((prev) => ({
      ...prev,
      totalXP: (prev.totalXP || 0) + quest.xpReward,
      completedQuests: [...(prev.completedQuests || []), questId],
      dailyLastClaim: questId.startsWith("daily_")
        ? today
        : prev.dailyLastClaim,
      weeklyLastClaim: questId.startsWith("weekly_")
        ? weekKey
        : prev.weeklyLastClaim,
    }));
    // Varied sounds based on quest type & XP amount
    const isWeekly = questId.startsWith("weekly_");
    const isStreak = questId.includes("streak");
    if (isStreak) {
      playSound("streak");
    } else if (isWeekly) {
      playSound(quest.xpReward >= 20 ? "achievement" : "xpGain");
    } else {
      playSound(quest.xpReward >= 5 ? "xpGain" : "coin");
    }
    showToast(`✨ +${quest.xpReward} XP — ${quest.title}`, "success");

    // Rank-up celebration on quest claim
    if (newRank.rank > oldRank.rank) {
      setTimeout(() => {
        setRankUpPopup(newRank);
        playSound("levelUp");
        if (typeof confetti !== "undefined") {
          const end = Date.now() + 1500;
          const frame = () => {
            confetti({
              particleCount: 4,
              angle: 60,
              spread: 55,
              origin: { x: 0 },
              colors: ["#fbbf24", "#f97316", "#ef4444"],
            });
            confetti({
              particleCount: 4,
              angle: 120,
              spread: 55,
              origin: { x: 1 },
              colors: ["#8b5cf6", "#3b82f6", "#10b981"],
            });
            if (Date.now() < end) requestAnimationFrame(frame);
          };
          frame();
        }
      }, 800);
    }
  };

  // Award XP on key activities
  const awardXP = (amount, _label) => {
    setRpgData((prev) => ({ ...prev, totalXP: (prev.totalXP || 0) + amount }));
  };

  // 🚨 SMART ALERTS & CONDITIONS
  const alertConditions = React.useMemo(() => {
    const alerts = [];
    const s = Number(saldoAkhir) || 0;

    if (s < 0 && !dismissedAlerts.includes("deficit")) {
      alerts.push({
        id: "deficit",
        type: "danger",
        icon: "😰",
        title: "SISTEM DEFISIT!",
        message: `Kas tekor Rp ${Math.abs(s).toLocaleString("id-ID")}. Segera kumpulkan iuran!`,
        priority: 1,
      });
    }
    if (s >= 0 && s < 100000 && !dismissedAlerts.includes("low-balance")) {
      alerts.push({
        id: "low-balance",
        type: "warning",
        icon: "👀",
        title: "Saldo Menipis!",
        message: `Sisa Rp ${s.toLocaleString("id-ID")}. Hemat pengeluaran kelas ya.`,
        priority: 2,
      });
    }
    if (isBudgetWarning && !dismissedAlerts.includes("budget-warning")) {
      const pct = Math.round((totalPengeluaran / (totalPemasukan || 1)) * 100);
      alerts.push({
        id: "budget-warning",
        type: "warning",
        icon: "🫣",
        title: "Pengeluaran Tinggi!",
        message: `Sudah terpakai ${pct}% dari total pemasukan.`,
        priority: 3,
      });
    }
    if (!disabledWeeks[currentWeek]) {
      const unpaid = members.filter(
        (m) => m.no !== 0 && !kasMingguan[`${currentWeek}-${m.no}`],
      ).length;
      if (unpaid > 0 && !dismissedAlerts.includes("unpaid-members")) {
        alerts.push({
          id: "unpaid-members",
          type: "info",
          icon: "📌",
          title: "Tunggakan Kas",
          message: `${unpaid} orang belum lunas di Minggu ${currentWeek}.`,
          priority: 4,
        });
      }
    }
    return alerts.sort((a, b) => a.priority - b.priority);
  }, [
    saldoAkhir,
    isBudgetWarning,
    totalPengeluaran,
    totalPemasukan,
    kasMingguan,
    disabledWeeks,
    dismissedAlerts,
    currentWeek,
    members,
  ]);

  // Clear dismissed alerts when conditions change
  React.useEffect(() => {
    if (saldoAkhir >= 100000) {
      setDismissedAlerts((prev) => prev.filter((id) => id !== "low-balance"));
    }
    if (saldoAkhir >= 0) {
      setDismissedAlerts((prev) => prev.filter((id) => id !== "deficit"));
    }
    if (!isBudgetWarning) {
      setDismissedAlerts((prev) =>
        prev.filter((id) => id !== "budget-warning"),
      );
    }
  }, [saldoAkhir, isBudgetWarning]);

  // 🎯 ESC KEY TO CLOSE MODAL
  React.useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && confirmModal) {
        setConfirmModal(null);
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [confirmModal]);

  // 🚀 Auto-Scroll to top on tab change
  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [activeTab]);
  // 📍 Auto-scroll nav bar ke tab aktif (manual scrollLeft, no page shift)
  React.useEffect(() => {
    const nav = navScrollRef.current;
    if (!nav) return;
    const activeBtn = nav.querySelector(`[data-tab-id="${activeTab}"]`);
    if (!activeBtn) return;
    const navRect = nav.getBoundingClientRect();
    const btnRect = activeBtn.getBoundingClientRect();
    const scrollTarget =
      nav.scrollLeft +
      (btnRect.left - navRect.left) -
      navRect.width / 2 +
      btnRect.width / 2;
    nav.scrollTo({ left: scrollTarget, behavior: "smooth" });
  }, [activeTab]);

  // ✅ PERFORMANCE TUNING: MEMOIZED WEEKS DATA
  const statWeeksData = React.useMemo(() => {
    const weeksList = [];
    for (let week = 1; week <= currentWeek; week++) {
      if (disabledWeeks[week]) continue;

      const manualIncome = transactions
        .filter(
          (t) =>
            t.type === "pemasukan" &&
            (t.week == week || Number(t.week) === week),
        )
        .reduce((sum, t) => sum + (t.amount || 0), 0);

      let kasIncome = 0;
      members
        .filter((m) => m.no !== 0)
        .forEach((member) => {
          const key = `${week}-${member.no}`;
          if (kasMingguan[key] === true) {
            kasIncome += KAS_MINGGUAN_AMOUNT;
          } else {
            const cicilanKey = `kas-${week}-${member.no}`;
            kasIncome += (cicilan[cicilanKey] || []).reduce(
              (sum, c) => sum + (c.amount || 0),
              0,
            );
          }
        });

      let iuranIncome = 0;
      iuranKhusus.forEach((iuran) => {
        members
          .filter((m) => m.no !== 0)
          .forEach((member) => {
            const cicilanKey = `iuran-${iuran.id}-${member.no}`;
            const cList = cicilan[cicilanKey] || [];
            iuranIncome += cList.reduce((sum, c) => sum + (c.amount || 0), 0);

            if (
              payments[`${iuran.id}-${member.no}`] === true &&
              cList.length === 0
            ) {
              const iuranDate = iuran.createdDate;
              if (!iuranDate) return;
              const dateObj = iuranDate.includes("-")
                ? new Date(iuranDate)
                : new Date(
                    iuranDate.split("/")[2],
                    iuranDate.split("/")[1] - 1,
                    iuranDate.split("/")[0],
                  );
              const diff =
                dateObj.getTime() - new Date(START_DATE_PROJECT).getTime();
              const iuranWeek = Math.max(
                1,
                Math.ceil((diff / (1000 * 60 * 60 * 24) + 1) / 7),
              );
              if (iuranWeek === week) iuranIncome += iuran.amount;
            }
          });
      });

      const weekExpense = transactions
        .filter(
          (t) =>
            t.type === "pengeluaran" &&
            (t.week == week || Number(t.week) === week),
        )
        .reduce((sum, t) => sum + (t.amount || 0), 0);

      weeksList.push({
        week,
        income: manualIncome + kasIncome + iuranIncome,
        expense: weekExpense,
        balance: manualIncome + kasIncome + iuranIncome - weekExpense,
      });
    }
    return weeksList;
  }, [
    transactions,
    disabledWeeks,
    kasMingguan,
    cicilan,
    payments,
    iuranKhusus,
    members,
    currentWeek,
    KAS_MINGGUAN_AMOUNT,
    START_DATE_PROJECT,
  ]);

  // =========================================
  // FIXED: getTotalCicilan - Safe Return
  // =========================================
  const getTotalCicilan = React.useCallback((type, iuranId, week, memberNo) => {
    let key = "";
    if (type === "kas" && week) {
      key = `kas-${week}-${memberNo}`;
    } else if (type === "iuran" && iuranId) {
      key = `iuran-${iuranId}-${memberNo}`;
    } else {
      return 0;
    }
    const cicilanList = cicilan[key] || [];
    return cicilanList.reduce((sum, c) => sum + c.amount, 0);
  }, [cicilan]);

  // Helper: Fungsi untuk mendapatkan tanggal minggu
  const getWeekDate = React.useCallback((weekNumber) => {
    const startDate = new Date(START_DATE_PROJECT);
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
  }, []);

  // Form states
  const [transactionForm, setTransactionForm] = React.useState({
    type: "pemasukan",
    amount: "",
    description: "",
    member: "",
    category: "lainnya",
    week: currentWeek,
    customDate: new Date().toISOString().split("T")[0],
  });

  const [iuranForm, setIuranForm] = React.useState({
    name: "",
    amount: "",
    deadline: new Date().toISOString().split("T")[0],
    description: "",
  });

  // 💸 HANDLE TRANSAKSI: Tambah Pemasukan/Pengeluaran
  const handleTransactionSubmit = () => {
    if (isSubmitting) return;
    const amount = Number.parseFloat(transactionForm.amount);
    const description = transactionForm.description.trim();

    if (isNaN(amount) || amount <= 0) {
      showToast("Jumlah harus berupa angka positif!", "error");
      playSound("error");
      return;
    }
    if (!description) {
      showToast("Deskripsi tidak boleh kosong!", "error");
      playSound("error");
      return;
    }

    setIsSubmitting(true);

    const newTransaction = {
      id: `trx-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      ...transactionForm,
      description: description,
      amount: amount,
      category:
        transactionForm.type === "pengeluaran"
          ? transactionForm.category
          : null,
      memberName: transactionForm.member
        ? members.find((m) => Number(m.no) === Number(transactionForm.member))
            ?.nama
        : null,
      date:
        transactionForm.customDate || new Date().toISOString().split("T")[0],
      weekDate: getWeekDate(transactionForm.week),
    };

    setTransactions((prev) => [...prev, newTransaction]);
    triggerFinanceEffect(
      transactionForm.type === "pemasukan" ? amount : -amount,
    );
    playSound(transactionForm.type === "pemasukan" ? "coin" : "whoosh");
    logActivity(
      transactionForm.type === "pemasukan" ? "add_income" : "add_expense",
      `${transactionForm.type === "pemasukan" ? "Pemasukan" : "Pengeluaran"}: ${description}`,
      { amount, week: transactionForm.week },
    );
    awardXP(3, "transaksi");

    setTransactionForm((prev) => ({
      type: prev.type,
      amount: "",
      description: "",
      member: "",
      category: "lainnya",
      week: prev.week,
      customDate: new Date().toISOString().split("T")[0],
    }));

    setTimeout(() => setIsSubmitting(false), 500);
  };

  // 📋 HANDLE IURAN: Buat Kategori Iuran Baru
  const handleIuranSubmit = () => {
    const name = iuranForm.name.trim();
    const amount = Number.parseFloat(iuranForm.amount);

    if (!name || isNaN(amount) || amount <= 0) {
      showToast("Nama dan jumlah iuran tidak valid!", "error");
      playSound("error");
      return;
    }

    const newIuran = {
      id: Date.now() + Math.floor(Math.random() * 1000),
      ...iuranForm,
      name: name,
      amount: amount,
      createdDate: new Date().toISOString().split("T")[0],
      payments: {},
    };

    setIuranKhusus((prev) => [...prev, newIuran]);
    playSound("success");
    logActivity("add_iuran_cat", `Buat Kategori Iuran: ${name}`, { amount });

    setIuranForm({
      name: "",
      amount: "",
      deadline: new Date().toISOString().split("T")[0],
      description: "",
    });
  };

  const handleDeleteIuran = (iuranId) => {
    const iuran = iuranKhusus.find((i) => i.id === iuranId);
    setIuranKhusus((prev) => prev.filter((i) => i.id !== iuranId));
    setPayments((prev) => {
      const next = { ...prev };
      Object.keys(next).forEach((key) => {
        if (key.startsWith(`${iuranId}-`)) delete next[key];
      });
      return next;
    });
    setCicilan((prev) => {
      const next = { ...prev };
      Object.keys(next).forEach((key) => {
        if (key.startsWith(`iuran-${iuranId}-`)) delete next[key];
      });
      return next;
    });
    logActivity(
      "delete_iuran",
      `Hapus Kategori Iuran: ${iuran?.name || "Iuran"}`,
    );
    playSound("whoosh");
  };

  // NOTE: togglePayment & toggleKasMingguan sudah diganti oleh executeToggle (via confirmasi modal)

  const quickCicilLock = React.useRef(false);
  const cicilanSubmitLock = React.useRef(false);

  // FUNCTION: QUICK CICIL (shortcut dari CekBayarTab & PerAnggotaTab)
  const handleQuickCicil = (
    type,
    iuranId,
    week,
    memberNo,
    amount,
    keterangan,
  ) => {
    if (quickCicilLock.current) return;
    quickCicilLock.current = true;
    setTimeout(() => { quickCicilLock.current = false; }, 500);
    if (!amount || amount <= 0) {
      showToast("Jumlah cicilan harus lebih dari 0!", "error");
      return;
    }

    const member = members.find((m) => m.no === memberNo);
    if (!member) {
      showToast("Member tidak ditemukan!", "error");
      return;
    }

    try {
      const now = new Date();
      let key = "";
      let maxAmount = 0;
      let itemName = "";

      if (type === "kas") {
        const w = Number.parseInt(week);
        if (disabledWeeks[w]) {
          showToast(
            `Minggu ${w} adalah MINGGU LIBUR! Tidak ada tagihan kas.`,
            "error",
          );
          return;
        }
        key = `kas-${w}-${memberNo}`;
        maxAmount = KAS_MINGGUAN_AMOUNT;
        itemName = `Kas Minggu ${w}`;
        const kasKey = `${w}-${memberNo}`;
        if (kasMingguan[kasKey]) {
          showToast("Pembayaran sudah lunas! Tidak bisa cicil lagi.", "error");
          return;
        }
      } else if (type === "iuran") {
        const iuran = iuranKhusus.find((i) => i.id === iuranId);
        if (!iuran) {
          showToast("Iuran tidak ditemukan!", "error");
          return;
        }
        key = `iuran-${iuranId}-${memberNo}`;
        maxAmount = iuran.amount;
        itemName = iuran.name;
        const paymentKey = `${iuranId}-${memberNo}`;
        if (payments[paymentKey]) {
          showToast("Pembayaran sudah lunas! Tidak bisa cicil lagi.", "error");
          return;
        }
      }

      const existingCicilan = cicilan[key] || [];
      const totalPaid = existingCicilan.reduce((sum, c) => sum + c.amount, 0);
      const remaining = maxAmount - totalPaid;

      if (amount > remaining) {
        showToast(
          `Cicilan melebihi sisa! Sisa: Rp ${remaining.toLocaleString("id-ID")}`,
          "error",
        );
        return;
      }

      const newCicilan = {
        id: Date.now(),
        date: now.toLocaleDateString("id-ID"),
        time: now.toLocaleTimeString("id-ID"),
        amount: amount,
        keterangan: keterangan || "",
        memberNo: memberNo,
        memberName: member.nama,
        itemName: itemName,
        type: type,
        week: type === "kas" ? Number.parseInt(week) : null,
        iuranId: type === "iuran" ? iuranId : null,
      };

      setCicilan((prev) => ({
        ...prev,
        [key]: [...(prev[key] || []), newCicilan],
      }));
      triggerFinanceEffect(amount);

      const newTotalPaid = totalPaid + amount;
      if (newTotalPaid >= maxAmount) {
        if (type === "kas") {
          const w = Number.parseInt(week);
          const kasKey = `${w}-${memberNo}`;
          setKasMingguan((prev) => ({ ...prev, [kasKey]: true }));
          showToast(
            `🎉 ${member.nama} - ${itemName}: LUNAS via cicilan!`,
            "success",
          );
          playSound("lunas");
        } else if (type === "iuran") {
          const paymentKey = `${iuranId}-${memberNo}`;
          setPayments((prev) => ({ ...prev, [paymentKey]: true }));
          showToast(
            `🎉 ${member.nama} - ${itemName}: LUNAS via cicilan!`,
            "success",
          );
          playSound("lunas");
        }
      } else {
        showToast(
          `✅ Cicilan Rp ${amount.toLocaleString("id-ID")} ditambahkan! Sisa: Rp ${(remaining - amount).toLocaleString("id-ID")}`,
          "success",
        );
        playSound("coin");
      }

      logActivity(
        "cicilan",
        `Cicilan ${type === "kas" ? `Kas Minggu ${week}` : itemName} dari ${member.nama}`,
        {
          action: "add_cicilan",
          type: type,
          week: type === "kas" ? Number.parseInt(week) : null,
          iuranId: type === "iuran" ? iuranId : null,
          memberNo: memberNo,
          memberName: member.nama,
          amount: amount,
          keterangan: keterangan || "",
        },
      );
      setCekBayarKey(Date.now());
    } catch (error) {
      console.error("Error quick cicil:", error);
      showToast("Gagal menambahkan cicilan!", "error");
    }
  };

  // FUNCTION: SUBMIT CICILAN
  const handleCicilanSubmit = () => {
    if (cicilanSubmitLock.current) return;
    cicilanSubmitLock.current = true;
    setTimeout(() => { cicilanSubmitLock.current = false; }, 500);
    const parsedAmount = Number(cicilanForm.amount) || 0;
    if (!parsedAmount || parsedAmount <= 0) {
      showToast("Jumlah cicilan harus lebih dari 0!", "error");
      return;
    }
    if (!cicilanForm.memberNo) {
      showToast("Pilih anggota terlebih dahulu!", "error");
      return;
    }

    const memberNo = Number.parseInt(cicilanForm.memberNo);
    const member = members.find((m) => m.no === memberNo);
    if (!member) {
      showToast("Member tidak ditemukan!", "error");
      return;
    }

    try {
      const now = new Date();
      let key = "";
      let maxAmount = 0;
      let itemName = "";
      let transactionDesc = "";

      if (cicilanForm.type === "kas") {
        if (!cicilanForm.week) {
          showToast("Pilih minggu terlebih dahulu!", "error");
          return;
        }
        const week = Number.parseInt(cicilanForm.week);
        if (disabledWeeks[week]) {
          showToast(
            `Minggu ${week} adalah MINGGU LIBUR! Tidak ada tagihan kas.`,
            "error",
          );
          return;
        }
        key = `kas-${week}-${memberNo}`;
        maxAmount = KAS_MINGGUAN_AMOUNT;
        itemName = `Kas Minggu ${week}`;
        transactionDesc = `Cicilan Kas Minggu ${week} - ${member.nama}`;
        const kasKey = `${week}-${memberNo}`;
        if (kasMingguan[kasKey]) {
          showToast("Pembayaran sudah lunas! Tidak bisa cicil lagi.", "error");
          return;
        }
      } else if (cicilanForm.type === "iuran") {
        if (!cicilanForm.iuranId) {
          showToast("Pilih iuran terlebih dahulu!", "error");
          return;
        }
        const iuranId = Number.parseInt(cicilanForm.iuranId);
        const iuran = iuranKhusus.find((i) => i.id === iuranId);
        if (!iuran) {
          showToast("Iuran tidak ditemukan!", "error");
          return;
        }
        key = `iuran-${iuranId}-${memberNo}`;
        maxAmount = iuran.amount;
        itemName = iuran.name;
        transactionDesc = `Cicilan ${iuran.name} - ${member.nama}`;
        const paymentKey = `${iuranId}-${memberNo}`;
        if (payments[paymentKey]) {
          showToast("Pembayaran sudah lunas! Tidak bisa cicil lagi.", "error");
          return;
        }
      }

      const existingCicilan = cicilan[key] || [];
      const totalPaid = existingCicilan.reduce((sum, c) => sum + c.amount, 0);
      const remaining = maxAmount - totalPaid;

      if (parsedAmount > remaining) {
        showToast(
          `Cicilan melebihi sisa! Sisa: Rp ${remaining.toLocaleString("id-ID")}`,
          "error",
        );
        return;
      }

      const newCicilan = {
        id: Date.now(),
        date: now.toLocaleDateString("id-ID"),
        time: now.toLocaleTimeString("id-ID"),
        amount: parsedAmount,
        keterangan: cicilanForm.keterangan || "",
        memberNo: memberNo,
        memberName: member.nama,
        itemName: itemName,
        type: cicilanForm.type,
        week:
          cicilanForm.type === "kas" ? Number.parseInt(cicilanForm.week) : null,
        iuranId:
          cicilanForm.type === "iuran"
            ? Number.parseInt(cicilanForm.iuranId)
            : null,
      };

      setCicilan((prev) => ({
        ...prev,
        [key]: [...(prev[key] || []), newCicilan],
      }));
      triggerFinanceEffect(parsedAmount);

      const newTotalPaid = totalPaid + parsedAmount;
      if (newTotalPaid >= maxAmount) {
        if (cicilanForm.type === "kas") {
          const week = Number.parseInt(cicilanForm.week);
          const kasKey = `${week}-${memberNo}`;
          setKasMingguan((prev) => ({ ...prev, [kasKey]: true }));
          showToast(
            `🎉 ${member.nama} - ${itemName}: LUNAS via cicilan!`,
            "success",
          );
          playSound("lunas");
        } else if (cicilanForm.type === "iuran") {
          const iuranId = Number.parseInt(cicilanForm.iuranId);
          const paymentKey = `${iuranId}-${memberNo}`;
          setPayments((prev) => ({ ...prev, [paymentKey]: true }));
          showToast(
            `🎉 ${member.nama} - ${itemName}: LUNAS via cicilan!`,
            "success",
          );
          playSound("lunas");
        }
      } else {
        showToast(
          `✅ Cicilan Rp ${parsedAmount.toLocaleString("id-ID")} ditambahkan! Sisa: Rp ${(remaining - parsedAmount).toLocaleString("id-ID")}`,
          "success",
        );
        playSound("coin");
      }

      setCicilanForm((prev) => ({ ...prev, amount: "", keterangan: "" }));
      logActivity(
        "cicilan",
        `Cicilan ${cicilanForm.type === "kas" ? `Kas Minggu ${cicilanForm.week}` : itemName} dari ${member.nama}`,
        {
          action: "add_cicilan",
          type: cicilanForm.type,
          week:
            cicilanForm.type === "kas"
              ? Number.parseInt(cicilanForm.week)
              : null,
          iuranId:
            cicilanForm.type === "iuran"
              ? Number.parseInt(cicilanForm.iuranId)
              : null,
          memberNo: memberNo,
          memberName: member.nama,
          amount: parsedAmount,
          keterangan: cicilanForm.keterangan || "",
        },
      );
      setCekBayarKey(Date.now());
    } catch (error) {
      console.error("Error add cicilan:", error);
      showToast("Gagal menambahkan cicilan!", "error");
    }
  };

  const handleDeleteTransaction = (transactionId) => {
    const transaction = transactions.find((t) => t.id === transactionId);
    if (transaction) {
      logActivity("delete_trx", `Hapus Transaksi: ${transaction.description}`, {
        amount: transaction.amount,
        type: transaction.type,
      });
    }
    setTransactions((prev) => prev.filter((t) => t.id !== transactionId));
    playSound("whoosh");
  };

  const handleToggleConfirm = (type, iuranId = null, week = null, memberNo) => {
    if (type === "iuran" && !iuranId) return;
    let currentStatus;
    if (type === "kas") {
      currentStatus = kasMingguan[`${week}-${memberNo}`];
    } else {
      currentStatus = payments[`${iuranId}-${memberNo}`];
    }
    const member = members.find((m) => m.no === memberNo);
    const itemName =
      type === "kas"
        ? `Kas Minggu ${week}`
        : iuranKhusus.find((i) => i.id === iuranId)?.name || "Iuran";

    setToggleConfirm({
      type,
      iuranId,
      week,
      memberNo,
      currentStatus: !!currentStatus,
      memberName: member?.nama || "Anggota",
      itemName,
    });
  };

  const executeToggle = () => {
    if (!toggleConfirm) return;
    setIsToggling(true);

    const { type, iuranId, week, memberNo } = toggleConfirm;

    try {
      if (type === "kas") {
        const key = `${week}-${memberNo}`;
        const currentStatus = kasMingguan[key] === true;
        const newStatus = !currentStatus;
        setKasMingguan((prev) => ({ ...prev, [key]: newStatus }));
        const member = members.find((m) => m.no === memberNo);
        showToast(
          `${member?.nama} - Kas Minggu ${week} ${newStatus ? "LUNAS!" : "Dibatalkan"}`,
          "success",
        );
        playSound(newStatus ? "lunas" : "error");
        triggerFinanceEffect(
          newStatus ? KAS_MINGGUAN_AMOUNT : -KAS_MINGGUAN_AMOUNT,
        );
        logActivity(
          newStatus ? "lunas/kas" : "batal/lunas/kas",
          `${member?.nama} - Kas M${week} ${newStatus ? "LUNAS" : "Dibatalkan"} (via konfirmasi)`,
          {
            week,
            memberNo,
            memberName: member?.nama,
            amount: KAS_MINGGUAN_AMOUNT,
          },
        );
      } else if (type === "iuran") {
        const key = `${iuranId}-${memberNo}`;
        const currentStatus = payments[key] === true;
        const newStatus = !currentStatus;
        const iuran = iuranKhusus.find((i) => i.id === iuranId);

        if (!iuran) {
          showToast("Iuran tidak ditemukan!", "error");
          setIsToggling(false);
          setToggleConfirm(null);
          return;
        }

        setPayments((prev) => ({ ...prev, [key]: newStatus }));
        const member = members.find((m) => m.no === memberNo);
        showToast(
          `${member?.nama} - ${iuran.name} ${newStatus ? "LUNAS!" : "Dibatalkan"}`,
          "success",
        );
        playSound(newStatus ? "lunas" : "error");
        triggerFinanceEffect(newStatus ? iuran.amount : -iuran.amount);
        logActivity(
          newStatus ? "lunas/iuran" : "batal/lunas/iuran",
          `${member?.nama} - ${iuran.name} ${newStatus ? "LUNAS" : "Dibatalkan"} (via konfirmasi)`,
          {
            memberNo,
            memberName: member?.nama,
            iuranName: iuran.name,
            amount: iuran.amount,
          },
        );
      }

      setCekBayarKey(Date.now());
    } catch (error) {
      console.error("Error toggle:", error);
      showToast("Gagal mengubah status pembayaran!", "error");
    } finally {
      setIsToggling(false);
      setToggleConfirm(null);
    }
  };

  // ════════════════════════════════════════════════════════════════
  // 💾 BACKUP & RESTORE SYSTEM
  // ════════════════════════════════════════════════════════════════

  const handleBackupData = () => {
    try {
      const backupData = {
        version: "1.2",
        timestamp: new Date().toISOString(),
        data: {
          transactions,
          saldo: saldoAkhir.toString(),
          iuranKhusus,
          payments,
          disabledWeeks,
          kasMingguan,
          cicilan,
          activities: globalActivities,
          members,
          appConfig,
          rpgData,
          soundEnabled,
        },
      };
      const jsonString = JSON.stringify(backupData, null, 2);
      const blob = new Blob([jsonString], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      const dateStr = new Date().toISOString().slice(0, 10);
      link.download = `KasKelas-Backup-${dateStr}.json`;
      link.href = url;
      link.click();
      URL.revokeObjectURL(url);
      showToast("☁️ Backup berhasil! File tersimpan di Downloads", "success");
      playSound("backup");
      localStorage.setItem("kasKelas/lastBackupDate", new Date().toISOString());
      awardXP(5, "backup");
      // Track backup count for backup_5x achievement
      setRpgData((prev) => ({
        ...prev,
        backupCount: (prev.backupCount || 0) + 1,
      }));
      logActivity("backup", "Ekspor Backup Data (JSON)", {
        filename: link.download,
      });
    } catch (error) {
      console.error("Backup error:", error);
      showToast("💔 Backup gagal: " + error.message, "error");
    }
  };

  const handleRestoreData = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const backupData = JSON.parse(e.target.result);
        const requiredKeys = [
          "transactions",
          "members",
          "appConfig",
          "kasMingguan",
          "cicilan",
          "payments",
          "iuranKhusus",
          "disabledWeeks",
        ];
        const hasAllKeys = requiredKeys.every(
          (key) => backupData.data && key in backupData.data,
        );

        if (!hasAllKeys) {
          throw new Error("File backup tidak valid atau rusak!");
        }

        setConfirmModal({
          title: "🔄 Konfirmasi Restore",
          message:
            "Seluruh data saat ini akan diganti dengan data dari file backup. Lanjutkan?",
          icon: "👀",
          type: "warning",
          confirmText: "Ya, Restore Sekarang",
          cancelText: "Batal",
          onConfirm: () => {
            setIsDataLoaded(false);
            isSavingDisabled.current = true;
            const data = backupData.data;
            const storageMap = {
              kasKelas_transactions: data.transactions || [],
              kasKelas_iuranKhusus: data.iuranKhusus || [],
              kasKelas_payments: data.payments || {},
              kasKelas_disabledWeeks: data.disabledWeeks || {},
              kasKelas_kasMingguan: data.kasMingguan || {},
              kasKelas_cicilan: data.cicilan || {},
              kasKelas_activities: data.activities || [],
              kasKelas_config: data.appConfig || data.config || {},
              kasKelas_members: data.members || [],
            };
            // Restore RPG data if present in backup
            if (data.rpgData) {
              storageMap["kasKelas_rpg"] = data.rpgData;
            }
            if (data.soundEnabled !== undefined) {
              storageMap["kasKelas_sound"] = data.soundEnabled
                ? "true"
                : "false";
            }
            Object.entries(storageMap).forEach(([key, val]) => {
              if (key === "kasKelas_sound") {
                localStorage.setItem(key, val); // plain string, not JSON-encoded
              } else {
                localStorage.setItem(key, JSON.stringify(val));
              }
            });
            // Clean up legacy keys
            localStorage.removeItem("kasKelasActivities");
            showToast(
              "✅ Restore berhasil! Sistem akan dimuat ulang...",
              "success",
            );
            playSound("success");
            setTimeout(() => window.location.reload(), 1000);
          },
        });
      } catch (error) {
        console.error("Restore error:", error);
        playSound("error");
        showToast(`💔 Gagal: ${error.message}`, "error");
      }
    };
    reader.readAsText(file);
    event.target.value = "";
  };

  // 🗑️ HAPUS SEMUA DATA
  const handleDeleteAllData = () => {
    setConfirmModal({
      title: "🔥 Zona Bahaya: Reset Total",
      message:
        "Tindakan ini akan MENGHAPUS SELURUH DATA termasuk Transaksi, Anggota, Kas Mingguan, Iuran, Cicilan, Pengaturan, RPG/Quest, dan Activity Log secara PERMANEN.\n\nAplikasi akan kembali ke First Setup seperti baru install.",
      icon: <div className="text-6xl animate-pulse">💀</div>,
      type: "danger",
      confirmText: "Hapus Semuanya",
      cancelText: "Batal",
      withInput: true,
      expectedInput: appConfig.className,
      inputPlaceholder: `Ketik "${appConfig.className}" untuk konfirmasi`,
      onConfirm: () => {
        try {
          // 1. Block save effect from writing back
          setIsDataLoaded(false);
          isSavingDisabled.current = true;

          // 2. Wipe ALL known localStorage keys
          const appKeys = [
            "kasKelas_transactions",
            "kasKelas_iuranKhusus",
            "kasKelas_payments",
            "kasKelas_disabledWeeks",
            "kasKelas_kasMingguan",
            "kasKelas_cicilan",
            "kasKelas_activities",
            "kasKelas_members",
            "kasKelas_config",
            "kasKelasActivities",
            "kasKelas_rpg",
            "kasKelas_sound",
            "kasKelas/lastBackupDate",
          ];
          appKeys.forEach((key) => localStorage.removeItem(key));

          // 3. Also wipe any future keys that start with kasKelas
          const allKeys = Object.keys(localStorage);
          allKeys.forEach((key) => {
            if (key.startsWith("kasKelas")) {
              localStorage.removeItem(key);
            }
          });

          showToast("🫧 Reset total berhasil! Memulai ulang...", "success");
          setTimeout(() => window.location.reload(), 1200);
        } catch (error) {
          console.error("Reset error:", error);
          showToast("Gagal reset data", "error");
        }
      },
    });
  };

  // =========================================
  // FIXED: getPaymentStatusDetail - Complete
  // =========================================
  const getPaymentStatusDetail = React.useCallback((type, targetId, week, memberNo) => {
    const totalCicilanVal = getTotalCicilan(type, targetId, week, memberNo);
    let targetAmount = 0;

    if (type === "kas") {
      targetAmount = KAS_MINGGUAN_AMOUNT;
    } else {
      const iuran = iuranKhusus.find((i) => i.id === targetId);
      if (!iuran) {
        return {
          status: "error",
          label: "Error",
          color: "bg-gray-400",
          textColor: "text-white",
          icon: "👀",
          detail: null,
          totalCicilan: 0,
          sisa: 0,
          persen: 0,
        };
      }
      targetAmount = iuran.amount;
    }

    const isLunas =
      type === "kas"
        ? kasMingguan[`${week}-${memberNo}`]
        : payments[`${targetId}-${memberNo}`];

    if (isLunas) {
      // Cek apakah ini deposit (lunas di minggu libur)
      const isDeposit = type === "kas" && disabledWeeks[week];
      const depositTarget = isDeposit ? depositCarryForward.depositSourceMap[`${week}-${memberNo}`] : null;
      return {
        status: isDeposit ? "deposit" : "lunas",
        label: isDeposit ? "💰 Deposit" : "✓ Lunas",
        color: isDeposit ? "bg-yellow-500" : "bg-green-500",
        textColor: "text-white",
        icon: isDeposit ? "💰" : "✓",
        detail: depositTarget ? `Di-carry ke Minggu ${depositTarget.targetWeek}` : null,
        totalCicilan: totalCicilanVal,
        sisa: 0,
        persen: 100,
      };
    }

    // Cek apakah minggu ini di-cover oleh deposit carry-forward
    if (type === "kas" && depositCarryForward.carryMap[`${week}-${memberNo}`]) {
      const fromWeek = depositCarryForward.carryMap[`${week}-${memberNo}`].fromWeek;
      return {
        status: "lunas",
        label: "✓ Lunas",
        color: "bg-green-500",
        textColor: "text-white",
        icon: "✓",
        detail: `Lunas dari deposit Minggu ${fromWeek}`,
        totalCicilan: 0,
        sisa: 0,
        persen: 100,
      };
    }
    if (totalCicilanVal > 0 && totalCicilanVal < targetAmount) {
      const sisa = targetAmount - totalCicilanVal;
      const persen = Math.round((totalCicilanVal / targetAmount) * 100);
      return {
        status: "cicil",
        label: `◐ Cicil ${persen}%`,
        detail: `Bayar Rp ${totalCicilanVal.toLocaleString("id-ID")} • Sisa Rp ${sisa.toLocaleString("id-ID")}`,
        color: "bg-yellow-500",
        textColor: "text-white",
        icon: "◐",
        totalCicilan: totalCicilanVal,
        sisa,
        persen,
      };
    }
    if (totalCicilanVal >= targetAmount && !isLunas) {
      return {
        status: "lunas-otomatis",
        label: "✓ Lunas Auto",
        detail: "Klik untuk konfirmasi",
        color: "bg-emerald-400",
        textColor: "text-white",
        icon: "✓",
        needsConfirm: true,
        totalCicilan: totalCicilanVal,
        sisa: 0,
        persen: 100,
      };
    }
    return {
      status: "belum",
      label: "○ Belum",
      color: "bg-red-500",
      textColor: "text-white",
      icon: "○",
      detail: null,
      totalCicilan: 0,
      sisa: targetAmount,
      persen: 0,
    };
  }, [kasMingguan, payments, iuranKhusus, disabledWeeks, depositCarryForward, getTotalCicilan]);

  // 📄 PDF REPORT GENERATOR (V4 — Professional)
  const generatePDFReport = () => {
    try {
      if (!window.jspdf) {
        showToast("jsPDF library belum dimuat. Coba refresh halaman.", "error");
        return;
      }
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 14;
      const contentWidth = pageWidth - margin * 2;
      let pageNum = 1;

      const today = new Date().toLocaleDateString("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      });

      const totalSiswa = members.filter((m) => m.no !== 0).length;
      const siswaL = members.filter((m) => m.no !== 0 && m.jk === "L").length;
      const siswaP = totalSiswa - siswaL;
      const waliKelasName = appConfig.waliKelas || members.find((m) => m.no === 0)?.nama || "-";
      const bendaharaName = appConfig.bendahara || "________________";
      const activeWeeks = Array.from({ length: currentWeek }, (_, i) => i + 1).filter((w) => !disabledWeeks[w]);

      // Color palette
      const colors = {
        primary: [15, 23, 42],
        accent: [6, 78, 59],
        blue: [30, 64, 175],
        purple: [88, 28, 135],
        danger: [185, 28, 28],
        warning: [180, 83, 9],
        muted: [100, 116, 139],
        light: [241, 245, 249],
        white: [255, 255, 255],
      };

      // ── Helpers ──
      const addFooter = () => {
        doc.setDrawColor(200, 200, 200);
        doc.line(margin, pageHeight - 16, pageWidth - margin, pageHeight - 16);
        doc.setFontSize(7);
        doc.setTextColor(...colors.muted);
        doc.text(
          `${appConfig.appTitle} — Kelas ${appConfig.className}`,
          margin,
          pageHeight - 10,
        );
        doc.text(
          `Halaman ${pageNum}`,
          pageWidth - margin,
          pageHeight - 10,
          { align: "right" },
        );
      };

      const newPage = (topBarColor = null) => {
        addFooter();
        doc.addPage();
        pageNum++;
        if (topBarColor) {
          doc.setFillColor(...topBarColor);
          doc.rect(0, 0, pageWidth, 10, "F");
        }
      };

      const sectionHeader = (title, y, color = colors.primary) => {
        if (y > pageHeight - 40) {
          newPage(color);
          y = 18;
        }
        doc.setFillColor(...color);
        doc.roundedRect(margin, y, contentWidth, 10, 2, 2, "F");
        doc.setFontSize(11);
        doc.setTextColor(255, 255, 255);
        doc.text(title, margin + 4, y + 7);
        return y + 14;
      };

      const checkY = (y, needed = 30) => {
        if (y > pageHeight - needed) {
          newPage();
          return 18;
        }
        return y;
      };

      // ═══════════════════════════════════════
      // PAGE 1: COVER + RINGKASAN KEUANGAN
      // ═══════════════════════════════════════

      // Dark header block
      doc.setFillColor(...colors.primary);
      doc.rect(0, 0, pageWidth, 52, "F");
      // Accent line
      doc.setFillColor(...colors.accent);
      doc.rect(0, 52, pageWidth, 2, "F");

      doc.setFontSize(10);
      doc.setTextColor(120, 150, 180);
      doc.text("DOKUMEN RESMI", pageWidth / 2, 14, { align: "center" });

      doc.setFontSize(22);
      doc.setTextColor(255, 255, 255);
      doc.text("LAPORAN KEUANGAN KELAS", pageWidth / 2, 28, { align: "center" });

      doc.setFontSize(12);
      doc.setTextColor(200, 220, 240);
      doc.text(
        `${appConfig.appTitle} — ${appConfig.className}`,
        pageWidth / 2,
        38,
        { align: "center" },
      );

      doc.setFontSize(8);
      doc.setTextColor(150, 170, 190);
      doc.text(
        `Wali Kelas: ${waliKelasName}  |  Bendahara: ${bendaharaName}  |  ${today}`,
        pageWidth / 2,
        47,
        { align: "center" },
      );

      // ── Section: Ringkasan Keuangan ──
      let y = sectionHeader("RINGKASAN KEUANGAN", 62, colors.accent);

      const netFlow = totalPemasukan - totalPengeluaran;
      const summaryBody = [
        ["Total Pemasukan", formatCurrency(totalPemasukan)],
        ["Total Pengeluaran", formatCurrency(totalPengeluaran)],
        ["Saldo Akhir (Bersih)", formatCurrency(saldoAkhir)],
        ["", ""],
        ["Kas Mingguan Terkumpul", formatCurrency(totalKasMingguan)],
        ["Iuran Khusus Terkumpul", formatCurrency(totalIuranKhusus)],
        ["Cicilan Terbayar (Akumulasi)", formatCurrency(totalCicilanTerbayar)],
      ];

      doc.autoTable({
        startY: y,
        head: [["Indikator Keuangan", "Nominal"]],
        body: summaryBody,
        theme: "grid",
        headStyles: { fillColor: colors.accent, fontSize: 10, fontStyle: "bold" },
        styles: { fontSize: 10, cellPadding: 5 },
        columnStyles: { 0: { cellWidth: 100 }, 1: { halign: "right" } },
        alternateRowStyles: { fillColor: [240, 253, 244] },
        didParseCell: (data) => {
          if (data.section === "body") {
            // Bold saldo row
            if (data.row.index === 2) {
              data.cell.styles.fontStyle = "bold";
              if (data.column.index === 1) {
                data.cell.styles.textColor = saldoAkhir >= 0 ? colors.accent : colors.danger;
              }
            }
            // Empty separator row
            if (data.row.index === 3) {
              data.cell.styles.lineWidth = 0;
              data.cell.styles.cellPadding = 1;
              data.cell.styles.fillColor = colors.white;
            }
          }
        },
      });

      // ── Section: Pengeluaran per Kategori ──
      y = sectionHeader(
        "ALOKASI PENGELUARAN PER KATEGORI",
        doc.lastAutoTable.finalY + 10,
        colors.purple,
      );

      const catData = EXPENSE_CATEGORIES.map((cat) => {
        const total = transactions
          .filter((t) => t.type === "pengeluaran" && t.category === cat.id)
          .reduce((sum, t) => sum + (t.amount || 0), 0);
        const persen = totalPengeluaran > 0
          ? `${Math.round((total / totalPengeluaran) * 100)}%`
          : "0%";
        return [cat.label, formatCurrency(total), persen];
      }).filter((row) => row[1] !== "Rp 0");

      doc.autoTable({
        startY: y,
        head: [["Kategori", "Total Nominal", "%"]],
        body: catData.length > 0 ? catData : [["Belum ada pengeluaran", "-", "-"]],
        theme: "grid",
        headStyles: { fillColor: colors.purple, fontSize: 9 },
        styles: { fontSize: 9, cellPadding: 4 },
        columnStyles: {
          1: { halign: "right" },
          2: { halign: "center", cellWidth: 20 },
        },
      });

      // ── Section: Info Kelas ──
      y = sectionHeader(
        "INFORMASI KELAS",
        doc.lastAutoTable.finalY + 10,
        colors.primary,
      );

      const disabledCount = Object.values(disabledWeeks).filter(Boolean).length;
      doc.autoTable({
        startY: y,
        body: [
          ["Nama Kelas", appConfig.className],
          ["Wali Kelas", waliKelasName],
          ["Bendahara", bendaharaName],
          ["Total Siswa", `${totalSiswa} orang (${siswaL}L / ${siswaP}P)`],
          ["Periode Aktif", `Minggu ke-1 s/d ke-${currentWeek} (${activeWeeks.length} aktif, ${disabledCount} libur)`],
          ["Tarif Kas Mingguan", `${formatCurrency(KAS_MINGGUAN_AMOUNT)} / siswa / minggu`],
          ["Total Iuran Khusus", `${iuranKhusus.length} iuran terdaftar`],
          ["Total Transaksi", `${transactions.length} transaksi tercatat`],
        ],
        theme: "plain",
        styles: { fontSize: 9, cellPadding: 3 },
        columnStyles: {
          0: { fontStyle: "bold", cellWidth: 55, textColor: colors.muted },
        },
      });

      addFooter();

      // ═══════════════════════════════════════
      // PAGE 2: REKAPITULASI KAS MINGGUAN
      // ═══════════════════════════════════════
      doc.addPage();
      pageNum++;
      doc.setFillColor(...colors.accent);
      doc.rect(0, 0, pageWidth, 10, "F");

      y = sectionHeader("REKAPITULASI KAS MINGGUAN", 18, colors.accent);

      const kasRows = [];
      let totalLunasAll = 0;
      let totalTerkumpulKas = 0;
      let totalTunggakanKas = 0;
      for (let week = 1; week <= currentWeek; week++) {
        if (disabledWeeks[week]) {
          kasRows.push([`M${week}`, getWeekDate(week), "LIBUR", "-", "-", "-"]);
          continue;
        }
        const paidCount = members.filter(
          (m) => m.no !== 0 && kasMingguan[`${week}-${m.no}`] === true,
        ).length;
        totalLunasAll += paidCount;
        const terkumpul = paidCount * KAS_MINGGUAN_AMOUNT;
        const tunggakan = (totalSiswa - paidCount) * KAS_MINGGUAN_AMOUNT;
        totalTerkumpulKas += terkumpul;
        totalTunggakanKas += tunggakan;
        const percentage = totalSiswa > 0 ? Math.round((paidCount / totalSiswa) * 100) : 0;
        kasRows.push([
          `M${week}`,
          getWeekDate(week),
          `${paidCount}/${totalSiswa}`,
          `${percentage}%`,
          formatCurrency(terkumpul),
          formatCurrency(tunggakan),
        ]);
      }

      // Add total row
      const avgRate = activeWeeks.length > 0 && totalSiswa > 0
        ? Math.round((totalLunasAll / (activeWeeks.length * totalSiswa)) * 100)
        : 0;
      kasRows.push([
        "TOTAL",
        `${activeWeeks.length} minggu aktif`,
        `Rata-rata`,
        `${avgRate}%`,
        formatCurrency(totalTerkumpulKas),
        formatCurrency(totalTunggakanKas),
      ]);

      doc.autoTable({
        startY: y,
        head: [["Minggu", "Periode", "Lunas", "%", "Terkumpul", "Tunggakan"]],
        body: kasRows,
        theme: "grid",
        headStyles: { fillColor: colors.accent, fontSize: 9, fontStyle: "bold" },
        styles: { fontSize: 8, cellPadding: 3 },
        columnStyles: {
          0: { cellWidth: 16, halign: "center", fontStyle: "bold" },
          2: { halign: "center" },
          3: { halign: "center" },
          4: { halign: "right" },
          5: { halign: "right" },
        },
        didParseCell: (data) => {
          if (data.section === "body") {
            // LIBUR row
            if (data.column.index === 2 && data.cell.raw === "LIBUR") {
              data.cell.styles.textColor = colors.warning;
              data.cell.styles.fontStyle = "italic";
            }
            // TOTAL row (last)
            if (data.row.index === kasRows.length - 1) {
              data.cell.styles.fontStyle = "bold";
              data.cell.styles.fillColor = [220, 252, 231];
            }
            // Color red for high tunggakan
            if (data.column.index === 3 && data.cell.raw !== "-" && data.cell.raw !== `${avgRate}%`) {
              const pct = parseInt(data.cell.raw);
              if (!isNaN(pct) && pct < 50) data.cell.styles.textColor = colors.danger;
              else if (!isNaN(pct) && pct < 80) data.cell.styles.textColor = colors.warning;
              else if (!isNaN(pct)) data.cell.styles.textColor = colors.accent;
            }
          }
        },
      });

      addFooter();

      // ═══════════════════════════════════════
      // PAGE 3: DAFTAR TUNGGAKAN MINGGU INI
      // ═══════════════════════════════════════
      doc.addPage();
      pageNum++;
      doc.setFillColor(...colors.danger);
      doc.rect(0, 0, pageWidth, 10, "F");

      y = sectionHeader(
        `DAFTAR TUNGGAKAN — MINGGU KE-${currentWeek} (${getWeekDate(currentWeek)})`,
        18,
        colors.danger,
      );

      const debtors = members
        .filter((m) => m.no !== 0)
        .map((m) => {
          const status = getPaymentStatusDetail("kas", null, currentWeek, m.no);
          if (status.status !== "lunas" && status.status !== "deposit") {
            return [
              m.no,
              m.nama,
              m.jk,
              status.status === "cicil" ? `Cicil (${status.persen}%)` : "Belum Bayar",
              status.status === "cicil" ? formatCurrency(status.totalCicilan) : "-",
              formatCurrency(status.sisa),
            ];
          }
          return null;
        })
        .filter((row) => row !== null);

      doc.autoTable({
        startY: y,
        head: [["No", "Nama Siswa", "JK", "Status", "Dibayar", "Sisa"]],
        body:
          debtors.length > 0
            ? debtors
            : [["-", "Alhamdulillah! Semua siswa sudah lunas minggu ini.", "-", "LUNAS", "-", "-"]],
        theme: "grid",
        headStyles: { fillColor: colors.danger, fontSize: 9 },
        styles: { fontSize: 9, cellPadding: 4 },
        columnStyles: {
          0: { cellWidth: 12, halign: "center" },
          2: { cellWidth: 12, halign: "center" },
          3: { halign: "center" },
          4: { halign: "right" },
          5: { halign: "right" },
        },
        didParseCell: (data) => {
          if (data.section === "body" && data.column.index === 3) {
            if (data.cell.raw === "Belum Bayar") {
              data.cell.styles.textColor = colors.danger;
              data.cell.styles.fontStyle = "bold";
            } else if (data.cell.raw?.startsWith("Cicil")) {
              data.cell.styles.textColor = colors.warning;
            }
          }
        },
      });

      // Summary box
      const totalTunggakan = debtors.length;
      const lunasCount = totalSiswa - totalTunggakan;
      const lunasPercent = totalSiswa > 0 ? Math.round((lunasCount / totalSiswa) * 100) : 0;
      y = doc.lastAutoTable.finalY + 4;
      doc.setFillColor(...colors.light);
      doc.roundedRect(margin, y, contentWidth, 12, 2, 2, "F");
      doc.setFontSize(9);
      doc.setTextColor(...colors.primary);
      doc.text(
        `Lunas: ${lunasCount}/${totalSiswa} siswa (${lunasPercent}%)  |  Tunggakan: ${totalTunggakan} siswa  |  Total Sisa: ${formatCurrency(totalTunggakan * KAS_MINGGUAN_AMOUNT)}`,
        margin + 4,
        y + 8,
      );
      y += 18;

      // ═══════════════════════════════════════
      // SECTION: REKAP TUNGGAKAN SELURUH MINGGU (Per Siswa)
      // ═══════════════════════════════════════
      y = sectionHeader("REKAP TUNGGAKAN KUMULATIF PER SISWA", y, colors.blue);

      const cumulativeDebtors = members
        .filter((m) => m.no !== 0)
        .map((m) => {
          let unpaidWeeks = 0;
          let totalDebt = 0;
          activeWeeks.forEach((week) => {
            const isLunas = kasMingguan[`${week}-${m.no}`] === true;
            const cicilanPaid = getTotalCicilan("kas", null, week, m.no);
            if (!isLunas && cicilanPaid === 0) {
              unpaidWeeks++;
              totalDebt += KAS_MINGGUAN_AMOUNT;
            } else if (!isLunas && cicilanPaid > 0) {
              totalDebt += Math.max(0, KAS_MINGGUAN_AMOUNT - cicilanPaid);
            }
          });
          return { no: m.no, nama: m.nama, jk: m.jk, unpaidWeeks, totalDebt };
        })
        .filter((m) => m.totalDebt > 0)
        .sort((a, b) => b.totalDebt - a.totalDebt);

      const debtorRows = cumulativeDebtors.map((m, idx) => [
        idx + 1,
        m.nama,
        m.jk,
        `${m.unpaidWeeks} minggu`,
        formatCurrency(m.totalDebt),
      ]);

      doc.autoTable({
        startY: y,
        head: [["#", "Nama Siswa", "JK", "Belum Bayar", "Total Tunggakan"]],
        body: debtorRows.length > 0
          ? debtorRows
          : [["-", "Tidak ada tunggakan! Semua siswa sudah lunas.", "-", "-", "-"]],
        theme: "grid",
        headStyles: { fillColor: colors.blue, fontSize: 9 },
        styles: { fontSize: 9, cellPadding: 4 },
        columnStyles: {
          0: { cellWidth: 10, halign: "center" },
          2: { cellWidth: 12, halign: "center" },
          3: { halign: "center" },
          4: { halign: "right" },
        },
        didParseCell: (data) => {
          if (data.section === "body" && data.column.index === 4 && data.cell.raw !== "-") {
            data.cell.styles.textColor = colors.danger;
            data.cell.styles.fontStyle = "bold";
          }
        },
      });

      if (cumulativeDebtors.length > 0) {
        const grandTotalDebt = cumulativeDebtors.reduce((s, m) => s + m.totalDebt, 0);
        y = doc.lastAutoTable.finalY + 4;
        y = checkY(y, 14);
        doc.setFillColor(254, 242, 242);
        doc.roundedRect(margin, y, contentWidth, 12, 2, 2, "F");
        doc.setFontSize(9);
        doc.setTextColor(...colors.danger);
        doc.text(
          `Total seluruh tunggakan: ${formatCurrency(grandTotalDebt)} dari ${cumulativeDebtors.length} siswa`,
          margin + 4,
          y + 8,
        );
      }

      addFooter();

      // ═══════════════════════════════════════
      // PAGE: IURAN KHUSUS (if any)
      // ═══════════════════════════════════════
      if (iuranKhusus.length > 0) {
        doc.addPage();
        pageNum++;
        doc.setFillColor(...colors.purple);
        doc.rect(0, 0, pageWidth, 10, "F");

        y = sectionHeader("REKAPITULASI IURAN KHUSUS", 18, colors.purple);

        const iuranRows = iuranKhusus.map((iuran) => {
          const paidCount = members.filter(
            (m) => m.no !== 0 && payments[`${iuran.id}-${m.no}`] === true,
          ).length;
          const cicilanTotal = members
            .filter((m) => m.no !== 0 && !payments[`${iuran.id}-${m.no}`])
            .reduce(
              (sum, m) => sum + getTotalCicilan("iuran", iuran.id, null, m.no),
              0,
            );
          const terkumpul = paidCount * iuran.amount + cicilanTotal;
          const target = totalSiswa * iuran.amount;
          const persen = target > 0 ? Math.round((terkumpul / target) * 100) : 0;
          return [
            iuran.name,
            formatCurrency(iuran.amount),
            `${paidCount}/${totalSiswa}`,
            `${persen}%`,
            formatCurrency(terkumpul),
            formatCurrency(target - terkumpul),
            iuran.deadline || "-",
          ];
        });

        doc.autoTable({
          startY: y,
          head: [["Nama Iuran", "Nominal", "Lunas", "%", "Terkumpul", "Sisa", "Deadline"]],
          body: iuranRows,
          theme: "grid",
          headStyles: { fillColor: colors.purple, fontSize: 8 },
          styles: { fontSize: 8, cellPadding: 3 },
          columnStyles: {
            1: { halign: "right" },
            2: { halign: "center" },
            3: { halign: "center" },
            4: { halign: "right" },
            5: { halign: "right" },
            6: { halign: "center", cellWidth: 24 },
          },
          didParseCell: (data) => {
            if (data.section === "body" && data.column.index === 3) {
              const pct = parseInt(data.cell.raw);
              if (!isNaN(pct) && pct >= 100) data.cell.styles.textColor = colors.accent;
              else if (!isNaN(pct) && pct >= 70) data.cell.styles.textColor = colors.warning;
              else if (!isNaN(pct)) data.cell.styles.textColor = colors.danger;
            }
          },
        });

        // Per-iuran debtor detail for each iuran
        iuranKhusus.forEach((iuran) => {
          const iuranDebtors = members
            .filter((m) => m.no !== 0)
            .map((m) => {
              const status = getPaymentStatusDetail("iuran", iuran.id, null, m.no);
              if (status.status !== "lunas" && status.status !== "deposit") {
                return [
                  m.no,
                  m.nama,
                  status.status === "cicil" ? `Cicil (${status.persen}%)` : "Belum",
                  status.status === "cicil" ? formatCurrency(status.totalCicilan) : "-",
                  formatCurrency(status.sisa),
                ];
              }
              return null;
            })
            .filter(Boolean);

          if (iuranDebtors.length > 0) {
            y = doc.lastAutoTable.finalY + 6;
            y = checkY(y, 40);
            doc.setFontSize(9);
            doc.setTextColor(...colors.primary);
            doc.text(`Tunggakan: ${iuran.name}`, margin, y);
            y += 3;

            doc.autoTable({
              startY: y,
              head: [["No", "Nama", "Status", "Dibayar", "Sisa"]],
              body: iuranDebtors,
              theme: "grid",
              headStyles: { fillColor: colors.purple, fontSize: 8 },
              styles: { fontSize: 8, cellPadding: 3 },
              columnStyles: {
                0: { cellWidth: 12, halign: "center" },
                2: { halign: "center" },
                3: { halign: "right" },
                4: { halign: "right" },
              },
            });
          }
        });

        addFooter();
      }

      // ═══════════════════════════════════════
      // PAGE: DAFTAR ANGGOTA KELAS
      // ═══════════════════════════════════════
      doc.addPage();
      pageNum++;
      doc.setFillColor(...colors.primary);
      doc.rect(0, 0, pageWidth, 10, "F");

      y = sectionHeader("DAFTAR ANGGOTA KELAS", 18, colors.primary);

      const memberRows = members
        .filter((m) => m.no !== 0)
        .sort((a, b) => a.no - b.no)
        .map((m) => {
          // Count weeks paid
          const weeksPaid = activeWeeks.filter((w) => kasMingguan[`${w}-${m.no}`] === true).length;
          const kasRate = activeWeeks.length > 0 ? Math.round((weeksPaid / activeWeeks.length) * 100) : 0;
          // Count iuran paid
          const iuranPaid = iuranKhusus.filter((i) => payments[`${i.id}-${m.no}`] === true).length;
          return [
            m.no,
            m.nama,
            m.jk,
            `${weeksPaid}/${activeWeeks.length}`,
            `${kasRate}%`,
            iuranKhusus.length > 0 ? `${iuranPaid}/${iuranKhusus.length}` : "-",
          ];
        });

      doc.autoTable({
        startY: y,
        head: [["No", "Nama Lengkap", "JK", "Kas Lunas", "Rate", "Iuran"]],
        body: memberRows,
        theme: "striped",
        headStyles: { fillColor: colors.primary, fontSize: 9 },
        styles: { fontSize: 8, cellPadding: 3 },
        columnStyles: {
          0: { cellWidth: 12, halign: "center" },
          2: { cellWidth: 12, halign: "center" },
          3: { halign: "center" },
          4: { halign: "center", cellWidth: 16 },
          5: { halign: "center", cellWidth: 18 },
        },
        didParseCell: (data) => {
          if (data.section === "body" && data.column.index === 4) {
            const pct = parseInt(data.cell.raw);
            if (!isNaN(pct) && pct >= 100) data.cell.styles.textColor = colors.accent;
            else if (!isNaN(pct) && pct >= 70) data.cell.styles.textColor = colors.warning;
            else if (!isNaN(pct)) data.cell.styles.textColor = colors.danger;
          }
        },
      });

      addFooter();

      // ═══════════════════════════════════════
      // PAGE: RIWAYAT TRANSAKSI
      // ═══════════════════════════════════════
      doc.addPage();
      pageNum++;
      doc.setFillColor(...colors.primary);
      doc.rect(0, 0, pageWidth, 10, "F");

      const maxTrx = 80;
      y = sectionHeader(
        `RIWAYAT TRANSAKSI (${Math.min(transactions.length, maxTrx)} terakhir dari ${transactions.length})`,
        18,
        colors.primary,
      );

      const transactionRows = transactions
        .slice(-maxTrx)
        .reverse()
        .map((t, idx) => {
          const memberName =
            t.memberName ||
            (t.member ? members.find((m) => m.no == t.member)?.nama : null) ||
            "-";
          return [
            idx + 1,
            formatDateShort(t.date),
            t.description?.length > 40
              ? t.description.substring(0, 40) + "..."
              : t.description || "-",
            t.type === "pemasukan" ? "Masuk" : "Keluar",
            formatCurrency(t.amount || 0),
            memberName?.length > 18
              ? memberName.substring(0, 18) + "..."
              : memberName,
          ];
        });

      doc.autoTable({
        startY: y,
        head: [["#", "Tanggal", "Keterangan", "Tipe", "Jumlah", "Anggota"]],
        body: transactionRows.length > 0
          ? transactionRows
          : [["-", "-", "Belum ada transaksi tercatat", "-", "-", "-"]],
        theme: "striped",
        headStyles: { fillColor: colors.primary, fontSize: 8 },
        styles: { fontSize: 7, cellPadding: 2.5, overflow: "linebreak" },
        columnStyles: {
          0: { cellWidth: 9, halign: "center" },
          1: { cellWidth: 24 },
          3: { cellWidth: 14, halign: "center" },
          4: { halign: "right", cellWidth: 28 },
          5: { cellWidth: 28 },
        },
        didParseCell: (data) => {
          if (data.section === "body" && data.column.index === 3) {
            if (data.cell.raw === "Masuk") {
              data.cell.styles.textColor = [22, 163, 74];
              data.cell.styles.fontStyle = "bold";
            } else if (data.cell.raw === "Keluar") {
              data.cell.styles.textColor = colors.danger;
              data.cell.styles.fontStyle = "bold";
            }
          }
        },
      });

      addFooter();

      // ═══════════════════════════════════════
      // LAST PAGE: TANDA TANGAN + DISCLAIMER
      // ═══════════════════════════════════════
      const sigY = doc.lastAutoTable.finalY + 25;
      const needNewPage = sigY > pageHeight - 75;

      if (needNewPage) {
        doc.addPage();
        pageNum++;
      }

      const signatureY = needNewPage ? 30 : sigY;

      // Separator
      doc.setDrawColor(200, 200, 200);
      doc.line(margin, signatureY - 10, pageWidth - margin, signatureY - 10);

      // Disclaimer
      doc.setFontSize(8);
      doc.setTextColor(...colors.muted);
      doc.text(
        `Laporan ini dibuat secara otomatis oleh sistem ${appConfig.appTitle} pada ${today}.`,
        pageWidth / 2,
        signatureY - 3,
        { align: "center" },
      );
      doc.text(
        "Data bersumber dari pencatatan digital kelas dan belum diaudit secara eksternal.",
        pageWidth / 2,
        signatureY + 2,
        { align: "center" },
      );

      // Two signature columns
      const col1X = margin + 15;
      const col2X = pageWidth - margin - 55;
      const sigStartY = signatureY + 16;

      doc.setTextColor(...colors.primary);
      doc.setFontSize(10);
      doc.text("Mengetahui,", col1X, sigStartY);
      doc.setFontSize(9);
      doc.text(`Wali Kelas ${appConfig.className}`, col1X, sigStartY + 6);

      doc.setFontSize(10);
      doc.text("Dibuat oleh,", col2X, sigStartY);
      doc.setFontSize(9);
      doc.text("Bendahara Kelas", col2X, sigStartY + 6);

      // Signature lines
      doc.setDrawColor(80, 80, 80);
      doc.line(col1X - 5, sigStartY + 32, col1X + 55, sigStartY + 32);
      doc.line(col2X - 5, sigStartY + 32, col2X + 55, sigStartY + 32);

      doc.setFontSize(10);
      doc.setTextColor(...colors.primary);
      doc.text(
        `( ${waliKelasName === "-" ? "________________" : waliKelasName} )`,
        col1X,
        sigStartY + 38,
      );
      doc.text(
        `( ${bendaharaName} )`,
        col2X,
        sigStartY + 38,
      );

      // Stamp area
      doc.setFontSize(7);
      doc.setTextColor(...colors.muted);
      doc.text("NIP: ________________", col1X, sigStartY + 44);

      addFooter();

      // ── Save ──
      doc.save(
        `LAPORAN_RESMI_${appConfig.className}_${new Date().toISOString().slice(0, 10)}.pdf`,
      );
      showToast("Laporan PDF berhasil dibuat!", "success");
      playSound("success");
      awardXP(5, "export_pdf");
      if (!rpgData.achievements?.includes("first_pdf")) {
        setRpgData((prev) => ({
          ...prev,
          totalXP: (prev.totalXP || 0) + 10,
          achievements: [...(prev.achievements || []), "first_pdf"],
        }));
        showToast("🏆 Achievement: Bendahara Teladan (+10 XP)", "success");
      }
      logActivity("export_pdf", "Cetak Master Report PDF");
    } catch (error) {
      console.error("PDF Error:", error);
      showToast("Gagal membuat PDF: " + error.message, "error");
    }
  };

  // 📱 SMART GROUP REPORT
  const copyGroupReport = async () => {
    try {
      let reportText = "";
      const isKas = cekBayarMode === "kas";

      if (isKas) {
        reportText = `📊 *LAPORAN KAS MINGGUAN - M${selectedCekWeek}*\n`;
        reportText += `🗓️ ${getWeekDate(selectedCekWeek)}\n`;
      } else {
        const iuran = iuranKhusus.find((i) => i.id === selectedCekWeek);
        reportText = `📋 *LAPORAN IURAN: ${iuran?.name || "Iuran"}*\n`;
        reportText += `💰 Nominal: ${formatCurrency(iuran?.amount)}\n`;
      }
      reportText += `------------------------------------------\n\n`;

      const lunas = [];
      const cicil = [];
      const belum = [];

      members
        .filter((m) => m.no !== 0)
        .forEach((m) => {
          const statusDetail = getPaymentStatusDetail(
            isKas ? "kas" : "iuran",
            isKas ? null : selectedCekWeek,
            isKas ? selectedCekWeek : null,
            m.no,
          );
          if (
            statusDetail.status === "lunas" ||
            statusDetail.status === "deposit"
          ) {
            lunas.push(m.nama);
          } else if (statusDetail.status === "cicil") {
            cicil.push(
              `${m.nama} (Sisa: ${formatCurrency(statusDetail.sisa)})`,
            );
          } else {
            belum.push(m.nama);
          }
        });

      reportText += `✅ *LUNAS (${lunas.length})*\n`;
      reportText +=
        lunas.length > 0
          ? lunas.map((n) => `• ${n}`).join("\n")
          : "_Belum ada_";
      reportText += `\n\n⏳ *MENYICIL (${cicil.length})*\n`;
      reportText +=
        cicil.length > 0
          ? cicil.map((n) => `• ${n}`).join("\n")
          : "_Belum ada_";
      reportText += `\n\n❌ *BELUM BAYAR (${belum.length})*\n`;
      reportText +=
        belum.length > 0
          ? belum.map((n) => `• ${n}`).join("\n")
          : "_Semua sudah bayar!_";
      reportText += `\n\n------------------------------------------\n`;
      reportText += `_Generated by ${appConfig.appTitle} ${appConfig.className}_`;

      await navigator.clipboard.writeText(reportText);
      showToast("📨 Laporan Grup berhasil disalin!", "success");
      playSound("pop");
    } catch (e) {
      showToast("Gagal menyalin laporan. Coba lagi.", "error");
      playSound("error");
    }
  };

  // ==========================================
  // 📦 EXPORT FUNCTIONS - MODULAR CSV EXPORTS
  // ==========================================
  const [isExportOpen, setIsExportOpen] = React.useState(false);

  const convertToCSV = (data) => {
    if (!data || data.length === 0) return "";
    const headers = Object.keys(data[0]);
    const BOM = "\uFEFF";
    const csvRows = [headers.map((h) => `"${h}"`).join(",")];
    for (const row of data) {
      const values = headers.map((header) => {
        const value = row[header] ?? "";
        const escaped = String(value).replace(/"/g, '""');
        return `"${escaped}"`;
      });
      csvRows.push(values.join(","));
    }
    return BOM + csvRows.join("\n");
  };

  const downloadFile = (content, filename) => {
    const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  const exportTransaksiCSV = () => {
    if (transactions.length === 0) {
      showToast("Tidak ada transaksi untuk di-export!", "error");
      playSound("error");
      return;
    }
    const data = transactions.map((t) => {
      const mId = t.member || t.memberNo;
      const memberName =
        t.memberName ||
        (mId ? members.find((m) => Number(m.no) === Number(mId))?.nama : "-");
      return {
        Tanggal: formatDateShort(t.date) || "-",
        Waktu: t.time || "-",
        Tipe: t.type === "pemasukan" ? "Pemasukan" : "Pengeluaran",
        Jumlah: t.amount || 0,
        Keterangan: t.description || "-",
        Member: memberName,
        Minggu: t.week || "-",
        Cicilan: t.isCicilan ? "Ya" : "Tidak",
      };
    });
    const csvContent = convertToCSV(data);
    const currentDate = new Date().toISOString().split("T")[0];
    downloadFile(csvContent, `Transaksi_KasKelas_${currentDate}.csv`);
    showToast("📦 Data transaksi berhasil di-export!", "success");
    playSound("backup");
  };

  const exportKasMingguanCSV = () => {
    const data = [];
    for (let week = 1; week <= currentWeek; week++) {
      if (disabledWeeks[week]) continue;
      const weekDate = getWeekDate(week);
      members
        .filter((m) => m.no !== 0)
        .forEach((member) => {
          const key = `${week}-${member.no}`;
          const isLunas = kasMingguan[key] === true;
          const totalCicilan = getTotalCicilan("kas", null, week, member.no);
          const sisa = isLunas
            ? 0
            : Math.max(0, KAS_MINGGUAN_AMOUNT - totalCicilan);
          let status = "Belum Bayar";
          let jumlahBayar = 0;
          if (isLunas) {
            status = "Lunas";
            jumlahBayar = KAS_MINGGUAN_AMOUNT;
          } else if (totalCicilan > 0) {
            status = "Cicil";
            jumlahBayar = totalCicilan;
          }
          data.push({
            Minggu: week,
            Tanggal: weekDate,
            No: member.no,
            Nama: member.nama,
            "Jenis Kelamin": member.jk,
            Status: status,
            "Jumlah Bayar": jumlahBayar,
            Sisa: sisa,
          });
        });
    }
    if (data.length === 0) {
      showToast("Tidak ada data kas mingguan untuk di-export!", "error");
      playSound("error");
      return;
    }
    const csvContent = convertToCSV(data);
    const currentDate = new Date().toISOString().split("T")[0];
    downloadFile(csvContent, `KasMingguan_KasKelas_${currentDate}.csv`);
    showToast("📦 Data kas mingguan berhasil di-export!", "success");
    playSound("backup");
  };

  const exportIuranKhususCSV = () => {
    if (iuranKhusus.length === 0) {
      showToast("Tidak ada Iuran untuk di-export!", "error");
      playSound("error");
      return;
    }
    const data = [];
    iuranKhusus.forEach((iuran) => {
      members
        .filter((m) => m.no !== 0)
        .forEach((member) => {
          const key = `${iuran.id}-${member.no}`;
          const isLunas = payments[key] === true;
          const totalCicilan = getTotalCicilan(
            "iuran",
            iuran.id,
            null,
            member.no,
          );
          const sisa = isLunas ? 0 : Math.max(0, iuran.amount - totalCicilan);
          let status = "Belum Bayar";
          let jumlahBayar = 0;
          if (isLunas) {
            status = "Lunas";
            jumlahBayar = iuran.amount;
          } else if (totalCicilan > 0) {
            status = "Cicil";
            jumlahBayar = totalCicilan;
          }
          data.push({
            "Nama Iuran": iuran.name,
            "Jumlah per Siswa": iuran.amount,
            Deadline: iuran.deadline || "Tidak ada",
            Deskripsi: iuran.description || "-",
            No: member.no,
            Nama: member.nama,
            Status: status,
            "Jumlah Bayar": jumlahBayar,
            Sisa: sisa,
          });
        });
    });
    const csvContent = convertToCSV(data);
    const currentDate = new Date().toISOString().split("T")[0];
    downloadFile(csvContent, `IuranKhusus_KasKelas_${currentDate}.csv`);
    showToast("📦 Data Iuran berhasil di-export!", "success");
    playSound("backup");
  };

  const exportSummaryCSV = () => {
    const currentDate = new Date().toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    const totalTransactions = transactions.length;
    const totalSiswa = members.filter((m) => m.no !== 0).length;
    const data = [
      { Item: "Total Pemasukan", Nilai: totalPemasukan },
      { Item: "Total Pengeluaran", Nilai: totalPengeluaran },
      { Item: "Saldo Akhir", Nilai: saldoAkhir },
      { Item: "---", Nilai: "---" },
      { Item: "Kas Mingguan Terkumpul", Nilai: totalKasMingguan },
      { Item: "Iuran Khusus Terkumpul", Nilai: totalIuranKhusus },
      { Item: "Cicilan Terbayar", Nilai: totalCicilanTerbayar },
      { Item: "---", Nilai: "---" },
      { Item: "Total Transaksi", Nilai: totalTransactions },
      { Item: "Total Siswa", Nilai: totalSiswa },
      { Item: "Minggu Aktif", Nilai: currentWeek },
      { Item: "Tanggal Export", Nilai: currentDate },
    ];
    const csvContent = convertToCSV(data);
    const fileDate = new Date().toISOString().split("T")[0];
    downloadFile(csvContent, `Summary_KasKelas_${fileDate}.csv`);
    showToast("📦 Summary berhasil di-export!", "success");
    playSound("backup");
  };

  const exportAllCSV = () => {
    const currentDate = new Date().toISOString().split("T")[0];
    const now = new Date().toLocaleString("id-ID");
    const totalSiswa = members.filter((m) => m.no !== 0).length;
    const kelas = appConfig.className || "XII-F5";
    const BOM = "\uFEFF";
    let c = BOM;

    // ========== HEADER ==========
    c += `LAPORAN LENGKAP KAS KELAS ${kelas}\n`;
    c += `Digenerate: ${now}\n`;
    c += `Minggu Aktif: Ke-${currentWeek}\n`;
    if (appConfig.waliKelas) c += `Wali Kelas: ${appConfig.waliKelas}\n`;
    if (appConfig.bendahara) c += `Bendahara: ${appConfig.bendahara}\n`;
    c += "\n";

    // ========== 1. RINGKASAN KEUANGAN ==========
    c += "=== RINGKASAN KEUANGAN ===\n";
    c += "Indikator,Nominal\n";
    c += `Saldo Akhir,${formatCurrency(saldoAkhir)}\n`;
    c += `Total Pemasukan,${formatCurrency(totalPemasukan)}\n`;
    c += `Total Pengeluaran,${formatCurrency(totalPengeluaran)}\n`;
    c += `Kas Mingguan Terkumpul,${formatCurrency(totalKasMingguan)}\n`;
    c += `Iuran Khusus Terkumpul,${formatCurrency(totalIuranKhusus)}\n`;
    c += `Cicilan Terbayar,${formatCurrency(totalCicilanTerbayar)}\n`;
    c += `Total Siswa,${totalSiswa}\n`;
    c += `Total Transaksi,${transactions.length}\n`;
    c += "\n";

    // ========== 2. PENGELUARAN PER KATEGORI ==========
    c += "=== PENGELUARAN PER KATEGORI ===\n";
    c += "Kategori,Total,Proporsi\n";
    EXPENSE_CATEGORIES.forEach((cat) => {
      const total = transactions
        .filter((t) => t.type === "pengeluaran" && t.category === cat.id)
        .reduce((sum, t) => sum + (t.amount || 0), 0);
      if (total > 0) {
        const persen =
          totalPengeluaran > 0
            ? Math.round((total / totalPengeluaran) * 100)
            : 0;
        c += `${cat.label},${formatCurrency(total)},${persen}%\n`;
      }
    });
    c += "\n";

    // ========== 3. TRANSAKSI LENGKAP ==========
    if (transactions.length > 0) {
      c += "=== RIWAYAT TRANSAKSI ===\n";
      c += "No,Tanggal,Waktu,Tipe,Kategori,Jumlah,Keterangan,Anggota,Minggu\n";
      transactions.forEach((t, idx) => {
        const mId = t.member || t.memberNo;
        const memberName =
          t.memberName ||
          (mId
            ? members.find((m) => Number(m.no) === Number(mId))?.nama
            : "-") ||
          "-";
        const cat = t.category
          ? EXPENSE_CATEGORIES.find((ct) => ct.id === t.category)?.label ||
            t.category
          : "-";
        c += `${idx + 1},${formatDateShort(t.date) || "-"},${t.time || "-"},${t.type === "pemasukan" ? "Pemasukan" : "Pengeluaran"},"${cat}",${formatCurrency(t.amount)},"${(t.description || "-").replace(/"/g, "'")}","${memberName}",${t.week || "-"}\n`;
      });
      c += "\n";
    }

    // ========== 4. KAS MINGGUAN PER MINGGU ==========
    c += "=== REKAPITULASI KAS MINGGUAN ===\n";
    c += "Minggu,Periode,Status,Lunas,Belum,Terkumpul,Tunggakan\n";
    for (let week = 1; week <= currentWeek; week++) {
      if (disabledWeeks[week]) {
        c += `M${week},${getWeekDate(week)},LIBUR,-,-,-,-\n`;
        continue;
      }
      const paidCount = members.filter(
        (m) => m.no !== 0 && kasMingguan[`${week}-${m.no}`],
      ).length;
      const belum = totalSiswa - paidCount;
      c += `M${week},${getWeekDate(week)},Aktif,${paidCount},${belum},${formatCurrency(paidCount * KAS_MINGGUAN_AMOUNT)},${formatCurrency(belum * KAS_MINGGUAN_AMOUNT)}\n`;
    }
    c += "\n";

    // ========== 5. DETAIL KAS PER ANGGOTA ==========
    c += "=== DETAIL KAS PER ANGGOTA ===\n";
    c += "No,Nama,JK";
    for (let w = 1; w <= currentWeek; w++) {
      if (!disabledWeeks[w]) c += `,M${w}`;
    }
    c += ",Total Lunas,Total Tunggak\n";
    members
      .filter((m) => m.no !== 0)
      .forEach((m) => {
        let lunasCount = 0;
        let tunggakCount = 0;
        c += `${m.no},"${m.nama}",${m.jk}`;
        for (let w = 1; w <= currentWeek; w++) {
          if (disabledWeeks[w]) continue;
          const isLunas = kasMingguan[`${w}-${m.no}`];
          c += `,${isLunas ? "LUNAS" : "BELUM"}`;
          if (isLunas) lunasCount++;
          else tunggakCount++;
        }
        c += `,${lunasCount},${tunggakCount}\n`;
      });
    c += "\n";

    // ========== 6. IURAN KHUSUS ==========
    if (iuranKhusus.length > 0) {
      c += "=== REKAPITULASI IURAN KHUSUS ===\n";
      iuranKhusus.forEach((iuran) => {
        const lunasCount = members.filter(
          (m) => m.no !== 0 && payments[`${iuran.id}-${m.no}`],
        ).length;
        const target = totalSiswa * iuran.amount;
        const terkumpul = lunasCount * iuran.amount;
        c += `\n--- ${iuran.name} ---\n`;
        c += `Nominal: ${formatCurrency(iuran.amount)}/siswa | Deadline: ${iuran.deadline || "Tidak ada"} | Lunas: ${lunasCount}/${totalSiswa} | Terkumpul: ${formatCurrency(terkumpul)} dari ${formatCurrency(target)}\n`;
        c += "No,Nama,Status,Dibayar,Sisa\n";
        members
          .filter((m) => m.no !== 0)
          .forEach((m) => {
            const isLunas = payments[`${iuran.id}-${m.no}`];
            const totalCicilan = getTotalCicilan("iuran", iuran.id, null, m.no);
            let status = "Belum";
            let dibayar = 0;
            if (isLunas) {
              status = "Lunas";
              dibayar = iuran.amount;
            } else if (totalCicilan > 0) {
              status = "Cicil";
              dibayar = totalCicilan;
            }
            c += `${m.no},"${m.nama}",${status},${formatCurrency(dibayar)},${formatCurrency(iuran.amount - dibayar)}\n`;
          });
      });
      c += "\n";
    }

    // ========== 7. CICILAN DETAIL ==========
    if (Object.keys(cicilan).length > 0) {
      c += "=== RIWAYAT CICILAN ===\n";
      c += "Anggota,Tipe,Target,Tanggal,Jumlah,Keterangan\n";
      Object.entries(cicilan).forEach(([key, cicilanList]) => {
        cicilanList.forEach((ci) => {
          const memberName =
            ci.memberName ||
            members.find((m) => m.no === ci.memberNo)?.nama ||
            "-";
          const target =
            ci.type === "kas" ? `Kas M${ci.week}` : ci.itemName || "Iuran";
          c += `"${memberName}",${ci.type},"${target}",${ci.date},${formatCurrency(ci.amount)},"${ci.keterangan || "-"}"\n`;
        });
      });
    }

    downloadFile(c, `LaporanLengkap_${kelas}_${currentDate}.csv`);
    showToast("Laporan CSV lengkap berhasil di-export!", "success");
    playSound("backup");
    logActivity("export_csv", "Export CSV Lengkap");
  };

  // ============================================================
  // RENDER
  // ============================================================
  return (
    <div className="min-h-screen relative transition-all duration-300">
      {/* 🚀 FIRST SETUP WIZARD */}
      {showFirstSetup && <FirstSetup onComplete={handleFirstSetupComplete} />}

      {/* 🔒 SECURITY LOCK */}
      {isLocked && (
        <div className="fixed inset-0 z-[99999] bg-slate-900 flex flex-col items-center justify-center p-6">
          <div className="w-full max-w-sm bg-white rounded-2xl p-8 shadow-2xl animate-scale-in">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <LucideIcon name="Lock" size={32} className="text-slate-800" />
              </div>
              <h2 className="text-xl font-bold text-slate-800">Masukkan PIN</h2>
              <p className="text-sm text-slate-500 mt-1">
                Akses terbatas untuk Bendahara
              </p>
            </div>
            <div className="relative mb-6">
              <input
                type="password"
                maxLength="4"
                value={pinInput}
                onChange={(e) => {
                  const val = e.target.value.replace(/[^0-9]/g, "");
                  setPinInput(val);
                  if (val.length === 4) {
                    if (val === appConfig.pin) {
                      playSound("success");
                      showToast("Akses diterima", "success");
                      setTimeout(() => setIsLocked(false), 200);
                    } else {
                      playSound("error");
                      setIsShaking(true);
                      setTimeout(() => {
                        setIsShaking(false);
                        setPinInput("");
                      }, 400);
                    }
                  }
                }}
                className={`w-full text-center text-4xl font-bold tracking-[0.5em] py-4 border-b-2 border-slate-200 focus:border-slate-800 outline-none text-slate-800 transition-colors bg-transparent placeholder-slate-200 ${isShaking ? "animate-shake" : ""}`}
                placeholder="••••"
                autoFocus
              />
            </div>
            <p className="text-center text-xs text-slate-400">
              Lupa PIN? Reset data aplikasi.
            </p>
          </div>
        </div>
      )}

      {/* 🔔 TOAST NOTIFICATION */}
      {toast.show && (
        <div
          className={`fixed top-4 left-4 right-4 z-[9999] max-w-sm w-auto ${toast.closing ? "toast-container closing" : "toast-container"}`}
        >
          <div className="relative overflow-hidden rounded-3xl bg-white/95 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.2)] p-4 flex items-center gap-4 border border-slate-200">
            <div
              className={`flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm ${toast.type === "success" ? "bg-emerald-50 text-emerald-500" : toast.type === "error" ? "bg-rose-50 text-rose-500" : "bg-blue-50 text-blue-500"}`}
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
              />
            </div>
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
            <button
              onClick={() => setToast({ ...toast, closing: true })}
              className="flex-shrink-0 w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center transition-all text-slate-300 hover:text-slate-600"
            >
              <LucideIcon name="X" size={16} />
            </button>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-100">
              <div
                className={`h-full ${toast.type === "success" ? "bg-emerald-400" : toast.type === "error" ? "bg-rose-400" : "bg-blue-400"}`}
                style={{ animation: "toastProgress 2.7s linear forwards" }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="glass-header text-white p-4 shadow-lg">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-3">
            <SchoolLogo size={40} />
            <div>
              <h1 className="text-xl font-bold flex items-center gap-2">
                {appConfig.appTitle} 🔥
              </h1>
              <p className="text-blue-100 text-sm">
                Kas Kelas {appConfig.className}
              </p>
            </div>
          </div>
          <button
            onClick={handleBackupData}
            className="bg-white/15 hover:bg-white/25 active:bg-white/30 px-3 py-2 rounded-xl flex items-center gap-2 transition-all border border-white/10"
          >
            <Download size={16} />
            <span className="text-xs font-medium">Backup</span>
          </button>
        </div>

        <div className="inline-flex items-center gap-1.5 bg-white/10 text-white/80 text-[11px] px-2.5 py-1 rounded-lg border border-white/10 mb-2">
          <LucideIcon name="Calendar" size={11} color="rgba(255,255,255,0.6)" />
          <span className="font-medium">
            Minggu {currentWeek} – {getWeekDate(currentWeek)}
          </span>
        </div>

        {/* STATS CARD */}
        <div className="grid grid-cols-2 gap-2 mb-2">
          {/* Total Pemasukan */}
          <div className="bg-white/15 rounded-xl p-3 text-center relative card-interactive transition-all duration-300">
            <div className="flex justify-center mb-1">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/25 flex items-center justify-center">
                <LucideIcon name="ArrowUpRight" size={14} color="#6ee7b7" />
              </div>
            </div>
            <div className="text-[10px] text-white/60 font-medium">
              Pemasukan
            </div>
            <div className="font-bold text-sm mt-0.5">
              <AnimatedNumber value={totalPemasukan} id="pemasukan" />
            </div>
            <div className="flex gap-1.5 mt-2 flex-wrap justify-center">
              <div className="flex items-center gap-1">
                <span className="text-[10px]">💰</span>
                <span className="text-emerald-300/80 text-[9px] font-bold">
                  {totalPemasukan > 0
                    ? Math.round((totalKasMingguan / totalPemasukan) * 100)
                    : 0}
                  %
                </span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-[10px]">📋</span>
                <span className="text-teal-300/80 text-[9px] font-bold">
                  {totalPemasukan > 0
                    ? Math.round((totalIuranKhusus / totalPemasukan) * 100)
                    : 0}
                  %
                </span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-[10px]">💳</span>
                <span className="text-cyan-300/80 text-[9px] font-bold">
                  {totalPemasukan > 0
                    ? Math.round((totalCicilanTerbayar / totalPemasukan) * 100)
                    : 0}
                  %
                </span>
              </div>
            </div>
          </div>

          {/* Total Pengeluaran */}
          <div
            className={`bg-white/15 rounded-xl p-3 text-center relative card-interactive transition-all duration-300 ${isBudgetWarning ? "animate-warning-flash border border-red-400/50" : ""}`}
          >
            {isBudgetWarning && (
              <div className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-400 animate-pulse" />
            )}
            <div className="flex justify-center mb-1">
              <div className="w-7 h-7 rounded-lg bg-rose-500/25 flex items-center justify-center">
                <LucideIcon name="ArrowDownLeft" size={14} color="#fca5a5" />
              </div>
            </div>
            <div className="text-[10px] text-white/60 font-medium">
              Pengeluaran
            </div>
            <div
              className={`font-bold text-sm mt-0.5 ${isBudgetWarning ? "text-red-200" : ""}`}
            >
              <AnimatedNumber value={totalPengeluaran} id="pengeluaran" />
            </div>
          </div>
        </div>

        {/* Saldo Akhir - RPG TREASURE SYSTEM */}
        <div className="col-span-2 relative">
          {showChangeIndicator && (
            <div
              className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[9999] pointer-events-none font-black text-lg whitespace-nowrap ${saldoEffect === "positive" ? "text-emerald-300 animate-float-up-rpg" : "text-rose-300 animate-float-down-rpg"}`}
            >
              {saldoEffect === "positive" ? "+" : "-"}Rp{" "}
              {saldoChange.toLocaleString("id-ID")}
            </div>
          )}

          <div
            className={`bg-white/15 rounded-xl p-3 text-center relative overflow-hidden transition-all duration-500 card-interactive border border-white/10 ${saldoEffect === "positive" ? "ring-2 ring-emerald-400/50 shadow-lg" : ""} ${saldoEffect === "negative" ? "ring-2 ring-rose-400/50 shadow-lg" : ""} ${showCelebration ? "ring-2 ring-yellow-300/50 shadow-lg" : ""}`}
          >
            {/* 🏷️ RPG RANK BADGE */}
            <div
              className={`absolute top-2 left-2 px-2 py-1 rounded-lg ${financeRank.color} ${financeRank.textColor} text-[10px] font-black uppercase tracking-widest flex items-center gap-1 shadow-lg rank-badge`}
            >
              <LucideIcon name={financeRank.icon} size={12} />
              {financeRank.rank}
            </div>
            <div className="absolute top-2 right-2 text-[10px] font-bold text-white/60 italic">
              {financeRank.title}
            </div>

            {showCelebration && (
              <>
                <div className="absolute top-0 left-1/4 text-2xl animate-confetti-1">
                  🎉
                </div>
                <div className="absolute top-0 right-1/4 text-2xl animate-confetti-2">
                  🎊
                </div>
                <div className="absolute top-1/2 left-0 text-xl animate-confetti-3">
                  ⭐
                </div>
                <div className="absolute top-1/2 right-0 text-xl animate-confetti-4">
                  💰
                </div>
                <div className="absolute bottom-0 left-1/3 text-lg animate-confetti-5">
                  ✨
                </div>
                <div className="absolute bottom-0 right-1/3 text-lg animate-confetti-6">
                  🏆
                </div>
              </>
            )}

            <div className="flex justify-center mb-1">
              <div className="w-7 h-7 rounded-lg bg-amber-500/25 flex items-center justify-center">
                <LucideIcon name="Wallet" size={14} color="#fcd34d" />
              </div>
            </div>
            <div className="text-[10px] text-white/60 font-medium">Saldo</div>
            <div
              className={`font-bold text-lg transition-all duration-300 ${showCelebration ? "text-yellow-200 scale-110" : "text-white"} ${saldoAkhir < 0 ? "text-red-200" : ""}`}
            >
              <AnimatedNumber value={saldoAkhir} id="saldo" />
            </div>
            {showCelebration && (
              <div className="text-[10px] text-yellow-200 mt-1">
                🎉 Saldo naik banyak!
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div
        className="sticky top-0 z-10 bg-white/95 border-b border-gray-200 shadow-sm"
        style={{
          WebkitBackdropFilter: "blur(12px)",
          backdropFilter: "blur(12px)",
        }}
      >
        <div
          ref={navScrollRef}
          className="flex overflow-x-auto no-scrollbar px-2 py-2 gap-1"
        >
          {[
            { id: "dashboard", label: "Home", icon: DollarSign },
            { id: "transaksi", label: "Transaksi", icon: Plus },
            { id: "cek-bayar", label: "Cek", icon: Eye },
            { id: "per-anggota", label: "Anggota", icon: Users },
            { id: "cicilan", label: "Cicilan", icon: Calendar },
            { id: "iuran", label: "Iuran", icon: ClipboardList },
            {
              id: "quest",
              label: "Quest",
              icon: ({ size }) => <LucideIcon name="Swords" size={size} />,
            },
            { id: "statistik", label: "Statistik", icon: TrendingUp },
            {
              id: "pengaturan",
              label: "Setting",
              icon: ({ size }) => <LucideIcon name="Settings" size={size} />,
            },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                data-tab-id={tab.id}
                onClick={() => {
                  playSound("whoosh");
                  setActiveTab(tab.id);
                }}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-200 shrink-0 ${
                  isActive
                    ? "bg-slate-800 text-white shadow-md"
                    : "text-gray-500 hover:bg-gray-100 active:bg-gray-200"
                }`}
              >
                <Icon size={16} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-4">
        {/* Dashboard Tab */}
        {activeTab === "dashboard" && (
          <DashboardTab
            randomTip={randomTip}
            setRandomTip={setRandomTip}
            alertConditions={alertConditions}
            dismissAlert={dismissAlert}
            saldoAkhir={saldoAkhir}
            transactions={transactions}
            members={members}
            iuranKhusus={iuranKhusus}
            payments={payments}
            getTotalCicilan={getTotalCicilan}
            setActiveTab={setActiveTab}
            isExportOpen={isExportOpen}
            setIsExportOpen={setIsExportOpen}
            exportTransaksiCSV={exportTransaksiCSV}
            exportKasMingguanCSV={exportKasMingguanCSV}
            exportIuranKhususCSV={exportIuranKhususCSV}
            exportSummaryCSV={exportSummaryCSV}
            exportAllCSV={exportAllCSV}
            generatePDFReport={generatePDFReport}
            rpgCurrentRank={rpgCurrentRank}
            rpgXpProgress={rpgXpProgress}
            rpgTotalXP={rpgData.totalXP}
          />
        )}

        {/* Transaksi Tab */}
        {activeTab === "transaksi" && (
          <TransaksiTab
            transactionForm={transactionForm}
            setTransactionForm={setTransactionForm}
            handleTransactionSubmit={handleTransactionSubmit}
            filteredTransactions={filteredTransactions}
            transactions={transactions}
            members={members}
            transactionPage={transactionPage}
            setTransactionPage={setTransactionPage}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            filterType={filterType}
            setFilterType={setFilterType}
            sortBy={sortBy}
            setSortBy={setSortBy}
            isFilterOpen={isFilterOpen}
            setIsFilterOpen={setIsFilterOpen}
            handleDeleteTransaction={handleDeleteTransaction}
            setConfirmModal={setConfirmModal}
          />
        )}

        {/* Iuran Tab */}
        {activeTab === "iuran" && (
          <IuranTab
            iuranForm={iuranForm}
            setIuranForm={setIuranForm}
            handleIuranSubmit={handleIuranSubmit}
            iuranKhusus={iuranKhusus}
            members={members}
            payments={payments}
            cicilan={cicilan}
            getTotalCicilan={getTotalCicilan}
            handleDeleteIuran={handleDeleteIuran}
            setConfirmModal={setConfirmModal}
          />
        )}

        {/* Cek Bayar Tab */}
        {activeTab === "cek-bayar" && (
          <CekBayarTab
            cekBayarMode={cekBayarMode}
            setCekBayarMode={setCekBayarMode}
            selectedCekWeek={selectedCekWeek}
            setSelectedCekWeek={setSelectedCekWeek}
            getCurrentWeek={currentWeek}
            getWeekDate={getWeekDate}
            KAS_MINGGUAN_AMOUNT={KAS_MINGGUAN_AMOUNT}
            members={members}
            kasMingguan={kasMingguan}
            payments={payments}
            disabledWeeks={disabledWeeks}
            cicilan={cicilan}
            transactions={transactions}
            iuranKhusus={iuranKhusus}
            getTotalCicilan={getTotalCicilan}
            filterStatus={filterStatus}
            setFilterStatus={setFilterStatus}
            memberSearch={memberSearch}
            setMemberSearch={setMemberSearch}
            selectedMemberView={selectedMemberView}
            setSelectedMemberView={setSelectedMemberView}
            handleToggleConfirm={handleToggleConfirm}
            isToggling={isToggling}
            setConfirmModal={setConfirmModal}
            copyGroupReport={copyGroupReport}
            cekBayarKey={cekBayarKey}
            onQuickCicil={handleQuickCicil}
            depositCarryForward={depositCarryForward}
          />
        )}

        {/* Cicilan Tab */}
        {activeTab === "cicilan" && (
          <CicilanTab
            cicilanForm={cicilanForm}
            setCicilanForm={setCicilanForm}
            handleCicilanSubmit={handleCicilanSubmit}
            cicilan={cicilan}
            members={members}
            kasMingguan={kasMingguan}
            payments={payments}
            iuranKhusus={iuranKhusus}
            getCurrentWeek={currentWeek}
            KAS_MINGGUAN_AMOUNT={KAS_MINGGUAN_AMOUNT}
            getTotalCicilan={getTotalCicilan}
            disabledWeeks={disabledWeeks}
            getWeekDate={getWeekDate}
          />
        )}

        {/* Per Anggota Tab */}
        {activeTab === "per-anggota" && (
          <PerAnggotaTab
            members={members}
            kasMingguan={kasMingguan}
            payments={payments}
            cicilan={cicilan}
            disabledWeeks={disabledWeeks}
            getCurrentWeek={currentWeek}
            KAS_MINGGUAN_AMOUNT={KAS_MINGGUAN_AMOUNT}
            iuranKhusus={iuranKhusus}
            getTotalCicilan={getTotalCicilan}
            getPaymentStatusDetail={getPaymentStatusDetail}
            selectedMemberView={selectedMemberView}
            setSelectedMemberView={setSelectedMemberView}
            cekBayarMode={cekBayarMode}
            selectedCekWeek={selectedCekWeek}
            setSelectedCekWeek={setSelectedCekWeek}
            filterStatus={filterStatus}
            setFilterStatus={setFilterStatus}
            toggleConfirm={toggleConfirm}
            setToggleConfirm={setToggleConfirm}
            handleToggleConfirm={handleToggleConfirm}
            executeToggle={executeToggle}
            isToggling={isToggling}
            onQuickCicil={handleQuickCicil}
            depositCarryForward={depositCarryForward}
          />
        )}

        {/* Statistik Tab */}
        {activeTab === "statistik" && (
          <StatistikTab
            statView={statView}
            setStatView={setStatView}
            saldoAkhir={saldoAkhir}
            totalPemasukan={totalPemasukan}
            totalPengeluaran={totalPengeluaran}
            transactions={transactions}
            disabledWeeks={disabledWeeks}
            globalActivities={globalActivities}
            activitySearch={activitySearch}
            setActivitySearch={setActivitySearch}
            activityPage={activityPage}
            setActivityPage={setActivityPage}
            statWeeksData={statWeeksData}
            getWeekDate={getWeekDate}
          />
        )}

        {/* Pengaturan Tab */}
        {activeTab === "quest" && (
          <QuestTab
            rpgData={rpgData}
            currentRank={rpgCurrentRank}
            xpProgress={rpgXpProgress}
            dailyQuests={rpgDailyQuests}
            weeklyQuests={rpgWeeklyQuests}
            achievements={rpgAchievements}
            claimQuest={claimQuest}
            totalXP={rpgData.totalXP}
          />
        )}

        {activeTab === "pengaturan" && (
          <PengaturanTab
            appConfig={appConfig}
            setAppConfig={setAppConfig}
            members={members}
            setMembers={setMembers}
            currentWeek={currentWeek}
            disabledWeeks={disabledWeeks}
            setDisabledWeeks={setDisabledWeeks}
            KAS_MINGGUAN_AMOUNT={KAS_MINGGUAN_AMOUNT}
            showToast={showToast}
            logActivity={logActivity}
            setTransactions={setTransactions}
            setGlobalActivities={setGlobalActivities}
            setKasMingguan={setKasMingguan}
            setPayments={setPayments}
            setCicilan={setCicilan}
            setConfirmModal={setConfirmModal}
            handleBackupData={handleBackupData}
            handleRestoreData={handleRestoreData}
            handleDeleteAllData={handleDeleteAllData}
            generatePDFReport={generatePDFReport}
            soundEnabled={soundEnabled}
            setSoundEnabled={setSoundEnabled}
          />
        )}
      </div>

      {/* ======================================== */}
      {/* MODAL KONFIRMASI TOGGLE STATUS - FIXED   */}
      {/* ======================================== */}
      {toggleConfirm &&
        (() => {
          let currentRealStatus = false;
          if (toggleConfirm.type === "kas") {
            const key = `${toggleConfirm.week}-${toggleConfirm.memberNo}`;
            currentRealStatus = kasMingguan[key] === true;
          } else if (toggleConfirm.type === "iuran") {
            const key = `${toggleConfirm.iuranId}-${toggleConfirm.memberNo}`;
            currentRealStatus = payments[key] === true;
          }

          const actionText = currentRealStatus ? "Batalkan" : "Lunaskan";
          const statusChangeText = currentRealStatus ? "BELUM BAYAR" : "LUNAS";

          return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
              <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-scale-in">
                <div
                  className={`p-6 ${currentRealStatus ? "bg-gradient-to-r from-red-50 to-orange-50" : "bg-gradient-to-r from-green-50 to-emerald-50"}`}
                >
                  <div className="flex items-center justify-center mb-4">
                    <div
                      className={`w-20 h-20 rounded-full ${currentRealStatus ? "bg-red-100" : "bg-green-100"} flex items-center justify-center`}
                    >
                      {currentRealStatus ? (
                        <LucideIcon
                          name="X"
                          size={40}
                          className="text-red-600"
                        />
                      ) : (
                        <LucideIcon
                          name="Check"
                          size={40}
                          className="text-green-600"
                        />
                      )}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-center text-gray-800 mb-2">
                    {actionText} Status Pembayaran?
                  </h3>
                  <p className="text-center text-gray-600 text-sm">
                    Status akan berubah menjadi{" "}
                    <span
                      className={`font-bold ${currentRealStatus ? "text-red-600" : "text-green-600"}`}
                    >
                      {statusChangeText}
                    </span>
                    . Pastikan sudah diterima!
                  </p>
                </div>

                <div className="p-6 space-y-3">
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex items-center gap-3 mb-3">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${members.find((m) => m.no === toggleConfirm.memberNo)?.jk === "L" ? "bg-blue-100 text-blue-600" : "bg-pink-100 text-pink-600"}`}
                      >
                        <Users size={20} />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-800 text-lg">
                          {toggleConfirm.memberName}
                        </h4>
                        <p className="text-xs text-gray-500">
                          No. {toggleConfirm.memberNo}
                        </p>
                      </div>
                    </div>
                    <div className="bg-white rounded-lg p-3 border border-gray-200">
                      <div className="flex items-center gap-2 text-sm">
                        <ClipboardList size={16} className="text-gray-500" />
                        <span className="font-semibold text-gray-700">
                          {toggleConfirm.itemName}
                        </span>
                      </div>
                    </div>
                  </div>

                  {currentRealStatus && (
                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded">
                      <div className="flex items-start gap-2">
                        <span className="flex-shrink-0 mt-0.5">
                          <LucideIcon
                            name="AlertTriangle"
                            size={20}
                            className="text-yellow-600"
                          />
                        </span>
                        <p className="text-xs text-yellow-800">
                          <span className="font-semibold">Peringatan:</span>{" "}
                          Transaksi terkait akan dihapus dan saldo akan
                          berkurang.
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-6 bg-gray-50 flex gap-3">
                  <button
                    onClick={() => {
                      setToggleConfirm(null);
                      setIsToggling(false);
                    }}
                    disabled={isToggling}
                    className="flex-1 py-3 px-4 bg-white border-2 border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Batal
                  </button>
                  <button
                    onClick={executeToggle}
                    disabled={isToggling}
                    className={`flex-1 py-3 px-4 rounded-xl font-semibold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg ${currentRealStatus ? "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700" : "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"}`}
                  >
                    {isToggling ? (
                      <>
                        <LucideIcon
                          name="Loader2"
                          size={20}
                          className="animate-spin"
                        />
                        <span>Proses...</span>
                      </>
                    ) : (
                      <>
                        {currentRealStatus ? (
                          <LucideIcon name="X" size={20} />
                        ) : (
                          <LucideIcon name="Check" size={20} />
                        )}
                        <span>Ya, {actionText}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })()}

      {/* 🎨 CUSTOM CONFIRMATION MODAL */}
      {confirmModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0, 0, 0, 0.6)",
            WebkitBackdropFilter: "blur(8px)",
            backdropFilter: "blur(8px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 99999,
            padding: "20px",
            animation: "fadeIn 0.2s ease-out",
          }}
          onClick={() => {
            playSound("pop");
            setConfirmModal(null);
            setConfirmInput("");
          }}
        >
          <div
            style={{
              background: "rgba(255, 255, 255, 0.95)",
              WebkitBackdropFilter: "blur(20px)",
              backdropFilter: "blur(20px)",
              borderRadius: "24px",
              padding: "32px",
              maxWidth: "480px",
              width: "100%",
              boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
              border: "1px solid rgba(255, 255, 255, 0.3)",
              animation: "modalSlideUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
              position: "relative",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                fontSize: "56px",
                textAlign: "center",
                marginBottom: "16px",
                animation: "iconBounce 0.5s ease-out",
              }}
            >
              {confirmModal.icon}
            </div>
            <h3
              style={{
                fontSize: "24px",
                fontWeight: "700",
                color: confirmModal.type === "danger" ? "#dc2626" : "#f59e0b",
                textAlign: "center",
                marginBottom: "12px",
                lineHeight: "1.2",
              }}
            >
              {confirmModal.title}
            </h3>
            <p
              style={{
                fontSize: "15px",
                color: "#4b5563",
                textAlign: "center",
                lineHeight: "1.6",
                marginBottom: "28px",
              }}
            >
              {confirmModal.message}
            </p>

            {confirmModal.withInput && (
              <div style={{ marginBottom: "24px" }}>
                <input
                  type="text"
                  value={confirmInput}
                  onChange={(e) => setConfirmInput(e.target.value)}
                  placeholder={
                    confirmModal.inputPlaceholder || "Ketik konfirmasi..."
                  }
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    borderRadius: "12px",
                    border: "2px solid #e5e7eb",
                    fontSize: "16px",
                    textAlign: "center",
                    outline: "none",
                    transition: "all 0.2s",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#3b82f6")}
                  onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
                />
                <p
                  style={{
                    fontSize: "12px",
                    color: "#6b7280",
                    textAlign: "center",
                    marginTop: "8px",
                  }}
                >
                  Ketik{" "}
                  <strong style={{ color: "#ef4444" }}>
                    {confirmModal.expectedInput}
                  </strong>{" "}
                  untuk melanjutkan
                </p>
              </div>
            )}

            <div
              style={{ display: "flex", gap: "12px", flexDirection: "column" }}
            >
              <button
                onClick={() => {
                  playSound(
                    confirmModal.type === "danger" ? "error" : "success",
                  );
                  confirmModal.onConfirm();
                  setConfirmModal(null);
                  setConfirmInput("");
                }}
                disabled={
                  confirmModal.withInput &&
                  confirmInput !== confirmModal.expectedInput
                }
                style={{
                  width: "100%",
                  padding: "16px",
                  background:
                    confirmModal.withInput &&
                    confirmInput !== confirmModal.expectedInput
                      ? "#e5e7eb"
                      : confirmModal.type === "danger"
                        ? "linear-gradient(135deg, #dc2626, #991b1b)"
                        : "linear-gradient(135deg, #f59e0b, #d97706)",
                  color:
                    confirmModal.withInput &&
                    confirmInput !== confirmModal.expectedInput
                      ? "#9ca3af"
                      : "white",
                  border: "none",
                  borderRadius: "14px",
                  fontSize: "16px",
                  fontWeight: "600",
                  cursor:
                    confirmModal.withInput &&
                    confirmInput !== confirmModal.expectedInput
                      ? "not-allowed"
                      : "pointer",
                  transition: "all 0.2s",
                  boxShadow:
                    confirmModal.withInput &&
                    confirmInput !== confirmModal.expectedInput
                      ? "none"
                      : "0 4px 12px rgba(0, 0, 0, 0.15)",
                  opacity:
                    confirmModal.withInput &&
                    confirmInput !== confirmModal.expectedInput
                      ? 0.7
                      : 1,
                }}
              >
                {confirmModal.confirmText}
              </button>
              <button
                onClick={() => {
                  playSound("pop");
                  setConfirmModal(null);
                  setConfirmInput("");
                }}
                style={{
                  width: "100%",
                  padding: "16px",
                  background: "#f3f4f6",
                  color: "#374151",
                  border: "2px solid #e5e7eb",
                  borderRadius: "14px",
                  fontSize: "16px",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                {confirmModal.cancelText}
              </button>
            </div>

            <button
              onClick={() => {
                playSound("pop");
                setConfirmModal(null);
                setConfirmInput("");
              }}
              style={{
                position: "absolute",
                top: "16px",
                right: "16px",
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                background: "#f3f4f6",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "18px",
                color: "#6b7280",
                transition: "all 0.2s",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = "#dc2626";
                e.currentTarget.style.color = "white";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = "#f3f4f6";
                e.currentTarget.style.color = "#6b7280";
              }}
            >
              ✕
            </button>
          </div>
        </div>
      )}
      {/* 🏆 ACHIEVEMENT UNLOCK POPUP */}
      {achievementPopup && (
        <div
          className="fixed inset-0 z-[99998] flex items-center justify-center p-6"
          onClick={() => setAchievementPopup(null)}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div
            className="relative bg-white rounded-2xl shadow-2xl max-w-xs w-full overflow-hidden"
            style={{
              animation:
                "achievePopIn 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top accent bar */}
            <div
              className={`h-2 w-full ${
                achievementPopup.rarity === "legendary"
                  ? "bg-gradient-to-r from-amber-400 via-rose-500 to-purple-500"
                  : achievementPopup.rarity === "epic"
                    ? "bg-gradient-to-r from-purple-500 to-indigo-500"
                    : achievementPopup.rarity === "rare"
                      ? "bg-gradient-to-r from-blue-500 to-cyan-500"
                      : "bg-gradient-to-r from-slate-400 to-slate-500"
              }`}
            />
            <div className="p-6 text-center">
              {/* Icon */}
              <div
                className={`w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-3 ${
                  achievementPopup.rarity === "legendary"
                    ? "bg-amber-100"
                    : achievementPopup.rarity === "epic"
                      ? "bg-purple-100"
                      : achievementPopup.rarity === "rare"
                        ? "bg-blue-100"
                        : "bg-slate-100"
                }`}
                style={{
                  animation: "achieveIconBounce 0.6s ease-out 0.3s both",
                }}
              >
                <LucideIcon
                  name={achievementPopup.icon || "Trophy"}
                  size={32}
                  color={
                    achievementPopup.rarity === "legendary"
                      ? "#d97706"
                      : achievementPopup.rarity === "epic"
                        ? "#7c3aed"
                        : achievementPopup.rarity === "rare"
                          ? "#2563eb"
                          : "#475569"
                  }
                />
              </div>
              <div
                className="text-xs font-black uppercase tracking-wider mb-1"
                style={{
                  color:
                    achievementPopup.rarity === "legendary"
                      ? "#d97706"
                      : achievementPopup.rarity === "epic"
                        ? "#7c3aed"
                        : achievementPopup.rarity === "rare"
                          ? "#2563eb"
                          : "#64748b",
                }}
              >
                {achievementPopup.rarity === "legendary"
                  ? "✨ Legendary"
                  : achievementPopup.rarity === "epic"
                    ? "💎 Epic"
                    : achievementPopup.rarity === "rare"
                      ? "🔵 Rare"
                      : "Common"}{" "}
                Achievement
              </div>
              <h3 className="text-lg font-black text-gray-800 mb-1">
                {achievementPopup.title}
              </h3>
              <p className="text-sm text-gray-500 mb-3">
                {achievementPopup.description}
              </p>
              <div className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-bold">
                <LucideIcon name="Zap" size={14} color="#15803d" />+
                {achievementPopup.xpReward} XP
              </div>
            </div>
            <button
              onClick={() => {
                playSound("pop");
                setAchievementPopup(null);
              }}
              className="w-full py-3 bg-gray-50 hover:bg-gray-100 text-gray-600 text-sm font-semibold transition-colors border-t border-gray-200"
            >
              Keren! 🎉
            </button>
          </div>
        </div>
      )}

      {/* 🌟 RANK UP POPUP */}
      {rankUpPopup && (
        <div
          className="fixed inset-0 z-[99999] flex items-center justify-center p-6"
          onClick={() => setRankUpPopup(null)}
        >
          <div className="absolute inset-0 bg-black/70 backdrop-blur-md" />
          <div
            className={`relative rounded-2xl shadow-2xl max-w-xs w-full overflow-hidden bg-gradient-to-br ${rankUpPopup.color || "from-slate-400 to-slate-500"}`}
            style={{
              animation:
                "rankUpPopIn 0.6s cubic-bezier(0.34,1.56,0.64,1) forwards",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Decorative circles */}
            <div className="absolute top-[-20px] right-[-20px] w-32 h-32 rounded-full bg-white/10 pointer-events-none" />
            <div className="absolute bottom-[-15px] left-[-15px] w-24 h-24 rounded-full bg-black/10 pointer-events-none" />
            <div className="relative z-10 p-6 text-center">
              <div className="text-xs font-black uppercase tracking-widest text-white/70 mb-2">
                ⬆️ RANK UP!
              </div>
              <div
                className="w-20 h-20 mx-auto bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-3"
                style={{ animation: "rankUpIconSpin 0.8s ease-out 0.3s both" }}
              >
                <LucideIcon
                  name={rankUpPopup.icon || "Star"}
                  size={44}
                  color="white"
                />
              </div>
              <h2
                className="text-2xl font-black text-white mb-1"
                style={{ animation: "rankUpTextSlide 0.5s ease-out 0.5s both" }}
              >
                {rankUpPopup.title}
              </h2>
              <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-1 inline-block mb-2">
                <span className="text-white text-sm font-bold">
                  Rank {rankUpPopup.rank}
                </span>
              </div>
              <p className="text-white/70 text-xs">
                Terus semangat, perjalanan masih panjang!
              </p>
            </div>
            <button
              onClick={() => {
                playSound("pop");
                setRankUpPopup(null);
              }}
              className="relative z-10 w-full py-3.5 bg-white/15 hover:bg-white/25 text-white text-sm font-bold transition-colors border-t border-white/20"
            >
              Lanjutkan! 🚀
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
