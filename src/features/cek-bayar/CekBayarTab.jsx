import React from "react";
import { LucideIcon } from "../../components/ui/index.js";
import {
  Wallet,
  ClipboardList,
  TrendingUp,
  Filter,
  Users,
  CheckCircle,
  HalfCircle,
  XCircle,
  Eye,
} from "../../components/ui/Icons.jsx";
import { formatDateShort } from "../../utils/formatters.js";

const CekBayarTab = ({
  // Mode
  cekBayarMode,
  setCekBayarMode,
  // Week / iuran selection
  selectedCekWeek,
  setSelectedCekWeek,
  getCurrentWeek,
  getWeekDate,
  KAS_MINGGUAN_AMOUNT,
  // Data
  members,
  kasMingguan,
  payments,
  disabledWeeks,
  cicilan,
  transactions,
  iuranKhusus,
  getTotalCicilan,
  // Filter
  filterStatus,
  setFilterStatus,
  // Member search
  memberSearch,
  setMemberSearch,
  // View detail
  selectedMemberView,
  setSelectedMemberView,
  // Toggle payment
  handleToggleConfirm,
  isToggling,
  setConfirmModal,
  // Copy report
  copyGroupReport,
  // cekBayar remount key
  cekBayarKey,
  // Quick cicil callback
  onQuickCicil,
  // Deposit carry-forward
  depositCarryForward = { carryMap: {}, depositSourceMap: {} },
}) => {
  const _formatDateShort = formatDateShort;

  // Quick Cicil local state
  const [quickCicilOpen, setQuickCicilOpen] = React.useState(null); // key string
  const [quickCicilAmount, setQuickCicilAmount] = React.useState("");
  const [quickCicilKet, setQuickCicilKet] = React.useState("");

  React.useEffect(() => {
    const id = 'cekbayar-tab-styles';
    if (!document.getElementById(id)) {
      const style = document.createElement('style');
      style.id = id;
      style.textContent = `.cb-shimmer-bg { background-size: 200% 100%; animation: cbShimmerBg 3s ease-in-out infinite; } @keyframes cbShimmerBg { 0%, 100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } } .cb-particle { color: rgba(255,255,255,0.6); position: absolute; animation: cbParticleFloat 3s ease-in-out infinite; } .cb-particle-0 { top: 10%; } .cb-particle-1 { top: 60%; } .cb-particle-2 { top: 30%; } .cb-particle-3 { top: 75%; } @keyframes cbParticleFloat { 0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.3; } 25% { transform: translateY(-12px) rotate(90deg); opacity: 0.8; } 50% { transform: translateY(-6px) rotate(180deg); opacity: 0.5; } 75% { transform: translateY(-16px) rotate(270deg); opacity: 0.9; } } .cb-trophy-bounce { animation: cbTrophyBounce 2s ease-in-out infinite; } @keyframes cbTrophyBounce { 0%, 100% { transform: scale(1) rotate(0deg); } 25% { transform: scale(1.1) rotate(-5deg); } 50% { transform: scale(1) rotate(0deg); } 75% { transform: scale(1.1) rotate(5deg); } } .cb-sparkle-float { display: inline-block; animation: cbSparkle 2s ease-in-out infinite; } @keyframes cbSparkle { 0%, 100% { transform: translateY(0) scale(1); opacity: 0.7; } 50% { transform: translateY(-6px) scale(1.2); opacity: 1; } } .cb-text-glow { text-shadow: 0 0 10px rgba(255,255,255,0.5); }`;
      document.head.appendChild(style);
    }
  }, []);

  // 🎉 Confetti celebration state
  const [hasConfettiFired, setHasConfettiFired] = React.useState(null);
  const celebrationRef = React.useRef(null);

  // Derive kas progress for confetti effect (outside render path)
  const _kasIsComplete = React.useMemo(() => {
    if (cekBayarMode !== "kas" || !members || members.length === 0) return false;
    const totalSiswa = members.filter((m) => m.no !== 0).length;
    if (totalSiswa === 0) return false;
    const totalTerkumpul = members
      .filter((m) => m.no !== 0)
      .reduce((sum, member) => {
        const key = `${selectedCekWeek}-${member.no}`;
        const isLunas = kasMingguan[key] === true;
        if (isLunas) return sum + KAS_MINGGUAN_AMOUNT;
        const totalCicilan = getTotalCicilan("kas", null, selectedCekWeek, member.no);
        const transaksiPelunasan = transactions
          .filter(
            (t) =>
              t.type === "pemasukan" &&
              t.week === selectedCekWeek &&
              t.memberNo === member.no &&
              t.description.includes("Pelunasan"),
          )
          .reduce((s, t) => s + t.amount, 0);
        return sum + totalCicilan + transaksiPelunasan;
      }, 0);
    const targetTotal = totalSiswa * KAS_MINGGUAN_AMOUNT;
    return targetTotal > 0 && totalTerkumpul >= targetTotal;
  }, [cekBayarMode, members, kasMingguan, selectedCekWeek, KAS_MINGGUAN_AMOUNT, getTotalCicilan, transactions]);

  // 🎉 Confetti useEffect — triggers when week is 100% collected
  React.useEffect(() => {
    if (_kasIsComplete && hasConfettiFired !== selectedCekWeek && window.confetti) {
      setHasConfettiFired(selectedCekWeek);
      window.confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 }, colors: ['#22c55e', '#10b981', '#34d399', '#fbbf24', '#f59e0b'] });
      setTimeout(() => window.confetti({ particleCount: 40, angle: 60, spread: 55, origin: { x: 0, y: 0.65 }, colors: ['#22c55e', '#a855f7', '#3b82f6'] }), 200);
      setTimeout(() => window.confetti({ particleCount: 40, angle: 120, spread: 55, origin: { x: 1, y: 0.65 }, colors: ['#f59e0b', '#ef4444', '#ec4899'] }), 400);
    }
  }, [_kasIsComplete, selectedCekWeek, hasConfettiFired]);

  const openQuickCicil = (key) => {
    setQuickCicilOpen(key);
    setQuickCicilAmount("");
    setQuickCicilKet("");
  };

  const closeQuickCicil = () => {
    setQuickCicilOpen(null);
    setQuickCicilAmount("");
    setQuickCicilKet("");
  };

  const submitQuickCicil = (type, iuranId, week, memberNo) => {
    const amount = Number.parseInt(quickCicilAmount);
    if (!amount || amount <= 0) return;
    if (onQuickCicil) {
      onQuickCicil(type, iuranId, week, memberNo, amount, quickCicilKet);
    }
    closeQuickCicil();
  };

  return (
    <div className="space-y-4 tab-content">
      {/* Mode Selector */}
      <div className="glass-card rounded-2xl p-4">
        <div className="flex gap-2">
          <button
            onClick={() => {
              setCekBayarMode("kas");
              setFilterStatus("semua");
              setSelectedCekWeek(getCurrentWeek);
            }}
            className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${
              cekBayarMode === "kas"
                ? "bg-gray-800 hover:bg-gray-900 text-white shadow-lg"
                : "bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            <Wallet size={18} className="inline mr-2" />
            Uang Kas
          </button>
          <button
            onClick={() => {
              setCekBayarMode("iuran");
              setFilterStatus("semua");
              setSelectedCekWeek("");
            }}
            className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${
              cekBayarMode === "iuran"
                ? "bg-gray-800 hover:bg-gray-900 to-indigo-600 text-white shadow-lg"
                : "bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            <ClipboardList size={18} className="inline mr-2" />
            Iuran
          </button>
        </div>
      </div>

      {/* MODE KAS MINGGUAN */}
      {cekBayarMode === "kas" && (
        <div className="space-y-4">
          {/* Week Selector & Copy Report */}
          <div className="glass-card rounded-2xl p-4">
            <div className="flex justify-between items-end gap-3">
              <div className="flex-1 min-w-0">
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <LucideIcon name="Calendar" size={16} />
                  Pilih Minggu
                </label>
                <select
                  value={selectedCekWeek}
                  onChange={(e) =>
                    setSelectedCekWeek(Number.parseInt(e.target.value))
                  }
                  className="w-full p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                >
                  {Array.from(
                    { length: getCurrentWeek },
                    (_, i) => i + 1,
                  )
                    .reverse()
                    .map((week) => (
                      <option key={week} value={week}>
                        Minggu {week} - {getWeekDate(week)}
                      </option>
                    ))}
                </select>
              </div>

              <button
                onClick={copyGroupReport}
                className="bg-slate-900 text-white p-3.5 rounded-xl shadow-lg hover:bg-slate-800 transition-all flex items-center gap-2 h-[52px]"
                title="Salin Laporan Grup"
              >
                <LucideIcon name="Copy" size={20} />
                <span className="hidden md:inline text-[10px] font-black uppercase tracking-widest">
                  Salin Laporan
                </span>
              </button>
            </div>
          </div>

          {/* ========================================
          PROGRESS BAR - DENGAN CELEBRATION ANIMATION
          ======================================== */}
          <div className="glass-card rounded-2xl p-4 bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
              <h3 className="font-bold text-blue-800 flex items-center gap-2">
                <TrendingUp size={18} />
                Progress Minggu {selectedCekWeek}
              </h3>
              <div className="text-xs sm:text-sm font-semibold text-blue-700 bg-blue-100 px-3 py-1 rounded-full w-fit">
                Target: Rp{" "}
                {KAS_MINGGUAN_AMOUNT.toLocaleString("id-ID")}
              </div>
            </div>

            {(() => {
              const totalTerkumpul = members
                .filter((m) => m.no !== 0)
                .reduce((sum, member) => {
                  const key = `${selectedCekWeek}-${member.no}`;
                  const isLunas = kasMingguan[key] === true;

                  // ✅ FIXED: Perhitungkan status lunas dari checkbox!
                  let totalBayar = 0;

                  if (isLunas) {
                    // Jika sudah lunas via checkbox, berarti sudah bayar PENUH
                    totalBayar = KAS_MINGGUAN_AMOUNT;
                  } else {
                    // Jika belum lunas, hitung dari cicilan + transaksi pelunasan
                    const totalCicilan = getTotalCicilan(
                      "kas",
                      null,
                      selectedCekWeek,
                      member.no,
                    );
                    const transaksiPelunasan = transactions
                      .filter(
                        (t) =>
                          t.type === "pemasukan" &&
                          t.week === selectedCekWeek &&
                          t.memberNo === member.no &&
                          t.description.includes("Pelunasan"),
                      )
                      .reduce((s, t) => s + t.amount, 0);

                    totalBayar = totalCicilan + transaksiPelunasan;
                  }

                  return sum + totalBayar;
                }, 0);

              const totalSiswa = members.filter(
                (m) => m.no !== 0,
              ).length;
              const targetTotal = totalSiswa * KAS_MINGGUAN_AMOUNT;
              const persentase = targetTotal > 0 ? Math.round(
                (totalTerkumpul / targetTotal) * 100,
              ) : 0;

              // ANIMATION CLASS berdasarkan persentase
              const isComplete = persentase >= 100;
              const isAlmostComplete = persentase >= 80;

              return (
                <>
                  {/* PROGRESS BAR DENGAN ANIMASI */}
                  <div className="relative w-full h-10 bg-gray-200 rounded-full overflow-hidden shadow-inner">
                    <div
                      className={`absolute top-0 left-0 h-full transition-all duration-700 ease-out flex items-center justify-end pr-3 ${
                        isComplete
                          ? "bg-gradient-to-r from-green-400 via-emerald-500 to-green-600"
                          : isAlmostComplete
                            ? "bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500"
                            : "bg-gradient-to-r from-blue-400 via-blue-500 to-cyan-500"
                      }`}
                      style={{
                        width: `${Math.min(persentase, 100)}%`,
                      }}
                    >
                      {persentase > 10 && (
                        <span className="text-white font-bold text-sm drop-shadow-lg flex items-center gap-1">
                          {isComplete && <span>🎉</span>}
                          {persentase}%
                        </span>
                      )}
                    </div>
                    {persentase <= 10 && (
                      <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-gray-600 font-bold text-sm">
                        {persentase}%
                      </span>
                    )}
                  </div>

                  {/* CELEBRATION MESSAGE — with particles */}
                  {isComplete && (
                    <div ref={celebrationRef} className="mt-3 relative overflow-hidden rounded-xl">
                      {/* Animated gradient background */}
                      <div className="absolute inset-0 bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 cb-shimmer-bg" />
                      
                      {/* Floating particles */}
                      <div className="absolute inset-0 pointer-events-none overflow-hidden">
                        {[...Array(12)].map((_, i) => (
                          <div key={i} className={`absolute cb-particle cb-particle-${i % 4}`}
                            style={{
                              left: `${8 + (i * 7.5)}%`,
                              animationDelay: `${i * 0.3}s`,
                              fontSize: ['8px','6px','10px','7px'][i % 4],
                            }}
                          >
                            {['✦','●','✧','★','◆','♦','✦','●','✧','★','◆','♦'][i]}
                          </div>
                        ))}
                      </div>

                      {/* Content */}
                      <div className="relative z-10 p-4 flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/30 backdrop-blur-sm rounded-xl flex items-center justify-center cb-trophy-bounce">
                          <span className="text-xl">🏆</span>
                        </div>
                        <div className="text-white">
                          <div className="font-black text-sm tracking-wide cb-text-glow">TARGET TERCAPAI!</div>
                          <div className="text-xs text-white/80 font-medium">Semua pembayaran minggu ini sudah terkumpul</div>
                        </div>
                        <div className="ml-auto flex gap-1">
                          <span className="cb-sparkle-float" style={{animationDelay:'0s'}}>✨</span>
                          <span className="cb-sparkle-float" style={{animationDelay:'0.5s'}}>🎉</span>
                          <span className="cb-sparkle-float" style={{animationDelay:'1s'}}>⭐</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* STATS DETAIL */}
                  <div className="grid grid-cols-2 gap-3 mt-4">
                    <div
                      className={`rounded-lg p-3 shadow-sm transition-all ${
                        totalTerkumpul > 0
                          ? "bg-white scale-100"
                          : "bg-gray-50 scale-95"
                      }`}
                    >
                      <div className="text-xs text-gray-600 mb-1">
                        Terkumpul
                      </div>
                      <div className="font-bold text-blue-700 text-base sm:text-lg flex items-center gap-1">
                        {totalTerkumpul > 0 && <span>✓</span>}
                        Rp {totalTerkumpul.toLocaleString("id-ID")}
                      </div>
                    </div>
                    <div
                      className={`rounded-lg p-3 shadow-sm transition-all ${
                        targetTotal - totalTerkumpul > 0
                          ? "bg-white"
                          : "bg-gray-50"
                      }`}
                    >
                      <div className="text-xs text-gray-600 mb-1">
                        Sisa Target
                      </div>
                      <div className="font-bold text-orange-600 text-base sm:text-lg">
                        Rp{" "}
                        {(
                          targetTotal - totalTerkumpul
                        ).toLocaleString("id-ID")}
                      </div>
                    </div>
                  </div>
                </>
              );
            })()}

            {/* ✅ BREAKDOWN DETAIL */}
            {(() => {
              // Hitung breakdown lunas/cicilan/belum
              let countLunas = 0;
              let countCicilan = 0;
              let countBelum = 0;
              let nominalLunas = 0;
              let nominalCicilan = 0;

              members
                .filter((m) => m.no !== 0)
                .forEach((member) => {
                  const key = `${selectedCekWeek}-${member.no}`;
                  const isLunas = kasMingguan[key] === true;

                  if (isLunas) {
                    countLunas++;
                    nominalLunas += KAS_MINGGUAN_AMOUNT;
                  } else {
                    const totalCicilan = getTotalCicilan(
                      "kas",
                      null,
                      selectedCekWeek,
                      member.no,
                    );

                    if (totalCicilan > 0) {
                      countCicilan++;
                      nominalCicilan += totalCicilan;
                    } else {
                      countBelum++;
                    }
                  }
                });

              return (
                <div className="mt-4 grid grid-cols-3 gap-2">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <div className="text-xs font-semibold text-green-700 mb-1 flex items-center gap-1">
                      <span>🟢</span> Lunas
                    </div>
                    <div className="font-bold text-green-800 text-sm">
                      {countLunas} orang
                    </div>
                    <div className="text-xs text-green-600 mt-1">
                      Rp{nominalLunas.toLocaleString("id-ID")}
                    </div>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <div className="text-xs font-semibold text-yellow-700 mb-1 flex items-center gap-1">
                      <span>💰</span> Cicilan
                    </div>
                    <div className="font-bold text-yellow-800 text-sm">
                      {countCicilan} orang
                    </div>
                    <div className="text-xs text-yellow-600 mt-1">
                      Rp{nominalCicilan.toLocaleString("id-ID")}
                    </div>
                  </div>

                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                    <div className="text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1">
                      <span>⏳</span> Belum
                    </div>
                    <div className="font-bold text-gray-800 text-sm">
                      {countBelum} orang
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      Rp
                      {(
                        countBelum * KAS_MINGGUAN_AMOUNT
                      ).toLocaleString("id-ID")}
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Filter Status */}
          <div className="glass-card rounded-2xl p-4">
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <Filter size={18} />
              Filter Status
            </h3>
            <div className="grid grid-cols-4 gap-2">
              <button
                onClick={() => setFilterStatus("semua")}
                className={`py-2 px-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 ${
                  filterStatus === "semua"
                    ? "bg-gray-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <Users size={14} />
                <span className="hidden sm:inline">Semua</span>
              </button>
              <button
                onClick={() => setFilterStatus("lunas")}
                className={`py-2 px-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 ${
                  filterStatus === "lunas"
                    ? "bg-green-600 text-white shadow-md"
                    : "bg-green-50 text-green-700 hover:bg-green-100"
                }`}
              >
                <CheckCircle size={14} />
                <span className="hidden sm:inline">Lunas</span>
              </button>
              <button
                onClick={() => setFilterStatus("cicil")}
                className={`py-2 px-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 ${
                  filterStatus === "cicil"
                    ? "bg-yellow-600 text-white shadow-md"
                    : "bg-yellow-50 text-yellow-700 hover:bg-yellow-100"
                }`}
              >
                <HalfCircle size={14} />
                <span className="hidden sm:inline">Cicil</span>
              </button>
              <button
                onClick={() => setFilterStatus("belum")}
                className={`py-2 px-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 ${
                  filterStatus === "belum"
                    ? "bg-red-600 text-white shadow-md"
                    : "bg-red-50 text-red-700 hover:bg-red-100"
                }`}
              >
                <XCircle size={14} />
                <span className="hidden sm:inline">Belum</span>
              </button>
            </div>
          </div>

          {/* Member List */}
          <div className="glass-card rounded-2xl p-4">
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Users size={18} />
              Status Pembayaran - Minggu {selectedCekWeek}
            </h3>

            {/* 🔍 Member Quick Search */}
            <div className="mb-4 relative">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                <LucideIcon name="Search" size={16} />
              </div>
              <input
                type="text"
                placeholder="Cari nama siswa..."
                value={memberSearch}
                onChange={(e) => setMemberSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none placeholder-gray-400"
              />
            </div>

            <div className="space-y-2">
              {members
                .filter((m) => m.no !== 0)
                .filter((m) =>
                  m.nama
                    .toLowerCase()
                    .includes(memberSearch.toLowerCase()),
                )
                .map((member) => {
                  const key = `${selectedCekWeek}-${member.no}`;
                  const isLunas = kasMingguan[key] === true;
                  const totalCicilan = getTotalCicilan(
                    "kas",
                    null,
                    selectedCekWeek,
                    member.no,
                  );
                  const cicilanList =
                    cicilan[
                      `kas-${selectedCekWeek}-${member.no}`
                    ] || [];

                  let status = "belum";
                  let statusLabel = "Belum";
                  let statusColor = "bg-red-500 hover:bg-red-600";
                  let StatusIcon = XCircle;
                  let detailText = "";

                  // 🛡️ SMART LOGIC: Handle Disabled Week
                  const isWeekDisabled =
                    disabledWeeks[selectedCekWeek];

                  // Cek carry-forward: minggu ini di-cover deposit dari minggu libur?
                  const carryInfo = depositCarryForward.carryMap[`${selectedCekWeek}-${member.no}`];

                  if (isLunas) {
                    if (isWeekDisabled) {
                      // SKENARIO: Sudah Bayar tapi Libur (DEPOSIT)
                      const depositTarget = depositCarryForward.depositSourceMap[`${selectedCekWeek}-${member.no}`];
                      status = "deposit";
                      statusLabel = "Deposit";
                      statusColor =
                        "bg-yellow-500 text-white shadow-md shadow-yellow-200 border-2 border-yellow-300 transform hover:scale-105";
                      StatusIcon = ({ size }) => (
                        <LucideIcon name="PiggyBank" size={size} />
                      );
                      detailText = depositTarget
                        ? `💰 Di-carry ke Minggu ${depositTarget.targetWeek}`
                        : "💰 Uang aman! Belum ada minggu aktif untuk carry.";
                    } else {
                      status = "lunas";
                      statusLabel = "Lunas";
                      statusColor =
                        "bg-green-500 hover:bg-green-600";
                      StatusIcon = CheckCircle;
                      if (cicilanList.length > 0) {
                        detailText = `Lunas via cicilan (${cicilanList.length}x bayar)`;
                      } else {
                        detailText = "Lunas langsung";
                      }
                    }
                  } else if (carryInfo) {
                    // SKENARIO: Minggu ini di-cover oleh deposit dari minggu libur
                    status = "lunas";
                    statusLabel = "Lunas";
                    statusColor = "bg-green-500 hover:bg-green-600";
                    StatusIcon = CheckCircle;
                    detailText = `✨ Lunas dari deposit Minggu ${carryInfo.fromWeek}`;
                  } else if (totalCicilan > 0) {
                    status = "cicil";
                    statusLabel = "Cicil";
                    statusColor =
                      "bg-yellow-500 hover:bg-yellow-600";
                    StatusIcon = HalfCircle;
                    const sisa = KAS_MINGGUAN_AMOUNT - totalCicilan;
                    detailText = `Terbayar: Rp ${totalCicilan.toLocaleString(
                      "id-ID",
                    )} | Sisa: Rp ${sisa.toLocaleString("id-ID")}`;
                  } else if (isWeekDisabled) {
                    // SKENARIO PERFECT: Belum bayar & Minggu Libur
                    status = "libur";
                    statusLabel = "Libur";
                    statusColor =
                      "bg-slate-400 cursor-not-allowed opacity-60 shadow-none";
                    StatusIcon = ({ size }) => (
                      <LucideIcon name="Ban" size={size} />
                    );
                    detailText =
                      "Minggu ini dinonaktifkan (Bebas Tagihan).";
                  }

                  if (
                    filterStatus !== "semua" &&
                    status !== filterStatus
                  ) {
                    return null;
                  }

                  const viewKey = `kas-${selectedCekWeek}-${member.no}`;

                  return (
                    <div
                      key={member.no}
                      className="bg-gradient-to-r from-gray-50 to-white rounded-lg p-3 border border-gray-200 hover:shadow-md transition-all"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div
                            className={`w-3 h-3 rounded-full flex-shrink-0 ${
                              member.jk === "L"
                                ? "bg-blue-500"
                                : "bg-pink-500"
                            }`}
                          />
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-sm truncate text-gray-800 flex items-center gap-1">
                              {member.nama}
                              {/* Deposit Badge — hanya tampil di minggu target carry-forward */}
                              {carryInfo && (
                                <div
                                  className="bg-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 border border-yellow-200"
                                  title={`Lunas dari deposit Minggu ${carryInfo.fromWeek}`}
                                >
                                  <LucideIcon
                                    name="PiggyBank"
                                    size={10}
                                  />
                                  <span>Deposit M{carryInfo.fromWeek}</span>
                                </div>
                              )}
                            </div>
                            <div className="text-xs text-gray-500">
                              No. {member.no}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 flex-shrink-0">
                          <button
                            onClick={() => {
                              if (status === "libur" && !isLunas) {
                                setConfirmModal({
                                  title: "Minggu Diliburkan",
                                  message:
                                    "Minggu ini sedang status LIBUR (Non-Aktif). Pembayaran sebenarnya tidak diperlukan.\n\nApakah Anda yakin ingin tetap mencatat pembayaran ini (sebagai Deposit)?",
                                  icon: (
                                    <LucideIcon
                                      name="CalendarOff"
                                      size={48}
                                      className="text-yellow-500"
                                    />
                                  ),
                                  type: "warning",
                                  confirmText:
                                    "Ya, Catat Pembayaran",
                                  cancelText: "Batal",
                                  onConfirm: () => {
                                    handleToggleConfirm(
                                      "kas",
                                      null,
                                      selectedCekWeek,
                                      member.no,
                                    );
                                  },
                                });
                                return;
                              }
                              handleToggleConfirm(
                                "kas",
                                null,
                                selectedCekWeek,
                                member.no,
                              );
                            }}
                            disabled={isToggling}
                            className={`px-3 sm:px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-md text-white flex items-center gap-1 ${statusColor} ${
                              isToggling
                                ? "opacity-50 cursor-not-allowed"
                                : ""
                            }`}
                          >
                            <StatusIcon size={14} />
                            <span className="hidden sm:inline">
                              {statusLabel}
                            </span>
                          </button>

                          {/* Quick Cicil Button - hanya untuk belum/cicil */}
                          {(status === "belum" || status === "cicil") && !isWeekDisabled && (
                            <button
                              onClick={() => {
                                const qKey = `kas-${selectedCekWeek}-${member.no}`;
                                if (quickCicilOpen === qKey) {
                                  closeQuickCicil();
                                } else {
                                  openQuickCicil(qKey);
                                }
                              }}
                              className="p-2 bg-orange-100 hover:bg-orange-200 rounded-lg transition-colors"
                              title="Quick Cicil"
                            >
                              <LucideIcon name="Banknote" size={16} className="text-orange-600" />
                            </button>
                          )}

                          {(cicilanList.length > 0 || isLunas) && (
                            <button
                              onClick={() => {
                                setSelectedMemberView(
                                  selectedMemberView === viewKey
                                    ? null
                                    : viewKey,
                                );
                              }}
                              className="p-2 bg-blue-100 hover:bg-blue-200 rounded-lg transition-colors"
                            >
                              <Eye size={16} />
                            </button>
                          )}
                        </div>
                      </div>

                      {detailText && (
                        <div className="mt-2 text-xs text-gray-600 bg-blue-50 rounded p-2 border border-blue-200">
                          {detailText}
                        </div>
                      )}

                      {/* Quick Cicil Inline Form */}
                      {quickCicilOpen === `kas-${selectedCekWeek}-${member.no}` && (
                        <div className="mt-3 bg-orange-50 rounded-lg p-3 border-2 border-orange-300">
                          <div className="flex items-center gap-2 mb-2">
                            <LucideIcon name="Banknote" size={14} className="text-orange-600" />
                            <span className="text-xs font-bold text-orange-700">Quick Cicil — {member.nama}</span>
                            <span className="text-xs text-orange-500 ml-1">Minggu {selectedCekWeek}</span>
                          </div>
                          <div className="flex gap-2 items-end">
                            <div className="flex-1">
                              <label className="text-xs text-gray-600 mb-1 block">Jumlah (Rp)</label>
                              <input
                                type="number"
                                min="1"
                                placeholder={`Maks Rp ${(KAS_MINGGUAN_AMOUNT - totalCicilan).toLocaleString("id-ID")}`}
                                value={quickCicilAmount}
                                onChange={(e) => setQuickCicilAmount(e.target.value)}
                                className="w-full p-2 border border-orange-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-400 focus:border-orange-400 outline-none"
                                autoFocus
                              />
                            </div>
                            <div className="flex-1">
                              <label className="text-xs text-gray-600 mb-1 block">Keterangan (opsional)</label>
                              <input
                                type="text"
                                placeholder="Catatan..."
                                value={quickCicilKet}
                                onChange={(e) => setQuickCicilKet(e.target.value)}
                                className="w-full p-2 border border-orange-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-400 outline-none"
                              />
                            </div>
                          </div>
                          <div className="flex gap-2 mt-2">
                            <button
                              onClick={() => submitQuickCicil("kas", null, selectedCekWeek, member.no)}
                              disabled={!quickCicilAmount || Number(quickCicilAmount) <= 0}
                              className="flex-1 py-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold rounded-lg transition-colors"
                            >
                              Simpan Cicilan
                            </button>
                            <button
                              onClick={closeQuickCicil}
                              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-lg transition-colors"
                            >
                              Batal
                            </button>
                          </div>
                        </div>
                      )}

                      {selectedMemberView === viewKey &&
                        (cicilanList.length > 0 || isLunas) && (
                          <div className="mt-3 bg-white rounded-lg p-3 border-2 border-blue-300 shadow-inner">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-semibold text-xs text-blue-700 flex items-center gap-1">
                                <ClipboardList size={14} />
                                {cicilanList.length > 0
                                  ? "Riwayat Cicilan"
                                  : "Status Pembayaran"}
                              </h4>
                              {totalCicilan > 0 && (
                                <span className="text-xs font-bold text-blue-600 bg-blue-100 px-2 py-1 rounded">
                                  Total: Rp{" "}
                                  {totalCicilan.toLocaleString(
                                    "id-ID",
                                  )}
                                </span>
                              )}
                            </div>

                            {cicilanList.length > 0 ? (
                              <div className="space-y-1 max-h-48 overflow-y-auto">
                                {cicilanList.map((c, idx) => (
                                  <div
                                    key={c.id}
                                    className="flex justify-between items-start py-2 border-b border-blue-100 last:border-0"
                                  >
                                    <div className="flex-1">
                                      <div className="font-semibold text-xs text-gray-800">
                                        #{idx + 1} - {c.date}
                                      </div>
                                      {c.keterangan && (
                                        <div className="text-gray-600 text-xs mt-1 italic">
                                          "{c.keterangan}"
                                        </div>
                                      )}
                                    </div>
                                    <div className="font-bold text-green-600 text-sm ml-3">
                                      +Rp{" "}
                                      {c.amount.toLocaleString(
                                        "id-ID",
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="text-center py-2 text-xs text-gray-600">
                                ✓ Dibayar langsung tanpa cicilan
                              </div>
                            )}
                          </div>
                        )}
                    </div>
                  );
                })}
            </div>

            {/* Summary Stats */}
            <div className="mt-4 pt-4 border-t-2 border-gray-200">
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-3 border border-green-200">
                  <div className="text-xs text-green-700 font-semibold flex items-center gap-1">
                    <CheckCircle size={14} />
                    Lunas
                  </div>
                  <div className="text-2xl font-bold text-green-700 mt-1">
                    {
                      members.filter(
                        (m) =>
                          m.no !== 0 &&
                          kasMingguan[
                            `${selectedCekWeek}-${m.no}`
                          ] === true,
                      ).length
                    }
                  </div>
                </div>
                <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-3 border border-yellow-200">
                  <div className="text-xs text-yellow-700 font-semibold flex items-center gap-1">
                    <HalfCircle size={14} />
                    Cicil
                  </div>
                  <div className="text-2xl font-bold text-yellow-700 mt-1">
                    {
                      members.filter((m) => {
                        if (m.no === 0) return false;
                        const isLunas =
                          kasMingguan[
                            `${selectedCekWeek}-${m.no}`
                          ] === true;
                        const totalCicilan = getTotalCicilan(
                          "kas",
                          null,
                          selectedCekWeek,
                          m.no,
                        );
                        return !isLunas && totalCicilan > 0;
                      }).length
                    }
                  </div>
                </div>
                <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-3 border border-red-200">
                  <div className="text-xs text-red-700 font-semibold flex items-center gap-1">
                    <XCircle size={14} />
                    Belum
                  </div>
                  <div className="text-2xl font-bold text-red-700 mt-1">
                    {
                      members.filter((m) => {
                        if (m.no === 0) return false;
                        const isLunas =
                          kasMingguan[
                            `${selectedCekWeek}-${m.no}`
                          ] === true;
                        const totalCicilan = getTotalCicilan(
                          "kas",
                          null,
                          selectedCekWeek,
                          m.no,
                        );
                        return !isLunas && totalCicilan === 0;
                      }).length
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODE IURAN - SAMA SEPERTI KAS */}
      {cekBayarMode === "iuran" && (
        <div className="space-y-4">
          <div className="glass-card rounded-2xl p-4">
            <div className="flex justify-between items-end gap-3">
              <div className="flex-1 min-w-0">
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <LucideIcon name="ClipboardList" size={16} />
                  Pilih Iuran
                </label>
                {iuranKhusus.length === 0 ? (
                  <div className="text-center py-4 text-gray-500 italic text-xs">
                    Belum ada iuran
                  </div>
                ) : (
                  <select
                    value={selectedCekWeek}
                    onChange={(e) =>
                      setSelectedCekWeek(Number.parseInt(e.target.value))
                    }
                    className="w-full p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                  >
                    <option value="">-- Pilih Iuran --</option>
                    {iuranKhusus.map((iuran) => (
                      <option key={iuran.id} value={iuran.id}>
                        {iuran.name} - Rp{" "}
                        {iuran.amount.toLocaleString("id-ID")}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <button
                onClick={copyGroupReport}
                disabled={!selectedCekWeek}
                className="bg-slate-900 text-white p-3.5 rounded-xl shadow-lg hover:bg-slate-800 transition-all flex items-center gap-2 h-[52px] disabled:opacity-30 disabled:grayscale"
                title="Salin Laporan Grup"
              >
                <LucideIcon name="Copy" size={20} />
                <span className="hidden md:inline text-[10px] font-black uppercase tracking-widest">
                  Salin Laporan
                </span>
              </button>
            </div>
          </div>

          {selectedCekWeek &&
            iuranKhusus.find((i) => i.id === selectedCekWeek) &&
            (() => {
              const selectedIuran = iuranKhusus.find(
                (i) => i.id === selectedCekWeek,
              );

              const totalTerkumpul = members
                .filter((m) => m.no !== 0)
                .reduce((sum, member) => {
                  const paymentKey = `${selectedIuran.id}-${member.no}`;
                  const isLunas = payments[paymentKey] === true;

                  let totalBayar = 0;

                  if (isLunas) {
                    // Jika sudah lunas via checkbox, berarti sudah bayar PENUH
                    totalBayar = selectedIuran.amount;
                  } else {
                    // Jika belum lunas, hitung dari cicilan + transaksi pelunasan
                    const totalCicilan = getTotalCicilan(
                      "iuran",
                      selectedIuran.id,
                      null,
                      member.no,
                    );
                    const transaksiPelunasan = transactions
                      .filter(
                        (t) =>
                          t.type === "pemasukan" &&
                          t.iuranId === selectedIuran.id &&
                          t.memberNo === member.no &&
                          t.description.includes("Pelunasan"),
                      )
                      .reduce((s, t) => s + t.amount, 0);

                    totalBayar = totalCicilan + transaksiPelunasan;
                  }

                  return sum + totalBayar;
                }, 0);

              const totalSiswa = members.filter(
                (m) => m.no !== 0,
              ).length;
              const targetTotal = totalSiswa * selectedIuran.amount;
              const persentase = targetTotal > 0 ? Math.round(
                (totalTerkumpul / targetTotal) * 100,
              ) : 0;

              return (
                <>
                  {/* Progress iuran - sama seperti kas tapi warna indigo */}
                  <div className="glass-card rounded-2xl p-4 bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-200">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                      <h3 className="font-bold text-indigo-800 flex items-center gap-2">
                        <TrendingUp size={18} />
                        Progress {selectedIuran.name}
                      </h3>
                      {selectedIuran.deadline && (
                        <div className="text-xs font-semibold text-indigo-700 bg-indigo-100 px-3 py-1 rounded-full w-fit">
                          Deadline:{" "}
                          {_formatDateShort(selectedIuran.deadline)}
                        </div>
                      )}
                    </div>

                    <div className="relative w-full h-8 bg-gray-200 rounded-full overflow-hidden shadow-inner mb-3">
                      <div
                        className="absolute top-0 left-0 h-full bg-gradient-to-r from-indigo-400 via-indigo-500 to-purple-500 transition-all duration-500 ease-out flex items-center justify-end pr-3"
                        style={{
                          width: `${Math.min(persentase, 100)}%`,
                        }}
                      >
                        {persentase > 10 && (
                          <span className="text-white font-bold text-sm drop-shadow-lg">
                            {persentase}%
                          </span>
                        )}
                      </div>
                      {persentase <= 10 && (
                        <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-gray-600 font-bold text-sm">
                          {persentase}%
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <div className="bg-white rounded-lg p-2 shadow-sm">
                        <div className="text-xs text-gray-600">
                          Target/Org
                        </div>
                        <div className="font-bold text-indigo-700 text-xs sm:text-sm">
                          Rp{" "}
                          {selectedIuran.amount.toLocaleString(
                            "id-ID",
                          )}
                        </div>
                      </div>
                      <div className="bg-white rounded-lg p-2 shadow-sm">
                        <div className="text-xs text-gray-600">
                          Terkumpul
                        </div>
                        <div className="font-bold text-green-600 text-xs sm:text-sm">
                          Rp{" "}
                          {totalTerkumpul.toLocaleString("id-ID")}
                        </div>
                      </div>
                      <div className="bg-white rounded-lg p-2 shadow-sm">
                        <div className="text-xs text-gray-600">
                          Sisa
                        </div>
                        <div className="font-bold text-orange-600 text-xs sm:text-sm">
                          Rp{" "}
                          {(
                            targetTotal - totalTerkumpul
                          ).toLocaleString("id-ID")}
                        </div>
                      </div>
                    </div>

                    {/* ✅ BREAKDOWN DETAIL */}
                    {(() => {
                      // Hitung breakdown lunas/cicilan/belum
                      let countLunas = 0;
                      let countCicilan = 0;
                      let countBelum = 0;
                      let nominalLunas = 0;
                      let nominalCicilan = 0;

                      members
                        .filter((m) => m.no !== 0)
                        .forEach((member) => {
                          const paymentKey = `${selectedIuran.id}-${member.no}`;
                          const isLunas =
                            payments[paymentKey] === true;

                          if (isLunas) {
                            countLunas++;
                            nominalLunas += selectedIuran.amount;
                          } else {
                            const totalCicilan = getTotalCicilan(
                              "iuran",
                              selectedIuran.id,
                              null,
                              member.no,
                            );

                            if (totalCicilan > 0) {
                              countCicilan++;
                              nominalCicilan += totalCicilan;
                            } else {
                              countBelum++;
                            }
                          }
                        });

                      return (
                        <div className="mt-3 grid grid-cols-3 gap-2">
                          <div className="bg-green-50 border border-green-200 rounded-lg p-2">
                            <div className="text-xs font-semibold text-green-700 mb-1 flex items-center gap-1">
                              <span className="text-sm">🟢</span>
                              <span>Lunas</span>
                            </div>
                            <div className="font-bold text-green-800 text-xs">
                              {countLunas} orang
                            </div>
                            <div className="text-xs text-green-600 mt-0.5">
                              Rp
                              {nominalLunas.toLocaleString("id-ID")}
                            </div>
                          </div>

                          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-2">
                            <div className="text-xs font-semibold text-yellow-700 mb-1 flex items-center gap-1">
                              <span className="text-sm">💰</span>
                              <span>Cicilan</span>
                            </div>
                            <div className="font-bold text-yellow-800 text-xs">
                              {countCicilan} orang
                            </div>
                            <div className="text-xs text-yellow-600 mt-0.5">
                              Rp
                              {nominalCicilan.toLocaleString(
                                "id-ID",
                              )}
                            </div>
                          </div>

                          <div className="bg-gray-50 border border-gray-200 rounded-lg p-2">
                            <div className="text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1">
                              <span className="text-sm">⏳</span>
                              <span>Belum</span>
                            </div>
                            <div className="font-bold text-gray-800 text-xs">
                              {countBelum} orang
                            </div>
                            <div className="text-xs text-gray-600 mt-0.5">
                              Rp
                              {(
                                countBelum * selectedIuran.amount
                              ).toLocaleString("id-ID")}
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </div>

                  {/* Filter - sama seperti kas */}
                  <div className="glass-card rounded-2xl p-4">
                    <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <Filter size={18} />
                      Filter Status
                    </h3>
                    <div className="grid grid-cols-4 gap-2">
                      <button
                        onClick={() => setFilterStatus("semua")}
                        className={`py-2 px-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 ${
                          filterStatus === "semua"
                            ? "bg-gray-600 text-white shadow-md"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        <Users size={14} />
                        <span className="hidden sm:inline">
                          Semua
                        </span>
                      </button>
                      <button
                        onClick={() => setFilterStatus("lunas")}
                        className={`py-2 px-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 ${
                          filterStatus === "lunas"
                            ? "bg-green-600 text-white shadow-md"
                            : "bg-green-50 text-green-700 hover:bg-green-100"
                        }`}
                      >
                        <CheckCircle size={14} />
                        <span className="hidden sm:inline">
                          Lunas
                        </span>
                      </button>
                      <button
                        onClick={() => setFilterStatus("cicil")}
                        className={`py-2 px-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 ${
                          filterStatus === "cicil"
                            ? "bg-yellow-600 text-white shadow-md"
                            : "bg-yellow-50 text-yellow-700 hover:bg-yellow-100"
                        }`}
                      >
                        <HalfCircle size={14} />
                        <span className="hidden sm:inline">
                          Cicil
                        </span>
                      </button>
                      <button
                        onClick={() => setFilterStatus("belum")}
                        className={`py-2 px-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 ${
                          filterStatus === "belum"
                            ? "bg-red-600 text-white shadow-md"
                            : "bg-red-50 text-red-700 hover:bg-red-100"
                        }`}
                      >
                        <XCircle size={14} />
                        <span className="hidden sm:inline">
                          Belum
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Member List Iuran - logic sama seperti kas */}
                  <div className="glass-card rounded-2xl p-4">
                    <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <Users size={18} />
                      Status Pembayaran Anggota
                    </h3>

                    {/* 🔍 Member Search - Iuran Mode */}
                    <div className="mb-4 relative">
                      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                        <LucideIcon name="Search" size={16} />
                      </div>
                      <input
                        type="text"
                        placeholder="Cari nama siswa..."
                        value={memberSearch}
                        onChange={(e) => setMemberSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none placeholder-gray-400"
                      />
                    </div>

                    <div className="space-y-2">
                      {members
                        .filter((m) => m.no !== 0)
                        .filter((m) =>
                          m.nama
                            .toLowerCase()
                            .includes(memberSearch.toLowerCase()),
                        )
                        .map((member) => {
                          const key = `${selectedIuran.id}-${member.no}`;
                          const isLunas = payments[key] === true;
                          const totalCicilan = getTotalCicilan(
                            "iuran",
                            selectedIuran.id,
                            null,
                            member.no,
                          );
                          const cicilanList =
                            cicilan[
                              `iuran-${selectedIuran.id}-${member.no}`
                            ] || [];

                          let status = "belum";
                          let statusLabel = "Belum";
                          let statusColor =
                            "bg-red-500 hover:bg-red-600";
                          let StatusIcon = XCircle;
                          let detailText = "";

                          if (isLunas) {
                            status = "lunas";
                            statusLabel = "Lunas";
                            statusColor =
                              "bg-green-500 hover:bg-green-600";
                            StatusIcon = CheckCircle;
                            if (cicilanList.length > 0) {
                              detailText = `Lunas via cicilan (${cicilanList.length}x bayar)`;
                            } else {
                              detailText = "Lunas langsung";
                            }
                          } else if (totalCicilan > 0) {
                            status = "cicil";
                            statusLabel = "Cicil";
                            statusColor =
                              "bg-yellow-500 hover:bg-yellow-600";
                            StatusIcon = HalfCircle;
                            const sisa =
                              selectedIuran.amount - totalCicilan;
                            detailText = `Terbayar: Rp ${totalCicilan.toLocaleString(
                              "id-ID",
                            )} | Sisa: Rp ${sisa.toLocaleString(
                              "id-ID",
                            )}`;
                          }

                          if (
                            filterStatus !== "semua" &&
                            status !== filterStatus
                          ) {
                            return null;
                          }

                          const viewKey = `iuran-${selectedIuran.id}-${member.no}`;

                          return (
                            <div
                              key={member.no}
                              className="bg-gradient-to-r from-gray-50 to-white rounded-lg p-3 border border-gray-200 hover:shadow-md transition-all"
                            >
                              <div className="flex items-center justify-between gap-3">
                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                  <div
                                    className={`w-3 h-3 rounded-full flex-shrink-0 ${
                                      member.jk === "L"
                                        ? "bg-blue-500"
                                        : "bg-pink-500"
                                    }`}
                                  />
                                  <div className="flex-1 min-w-0">
                                    <div className="font-semibold text-sm truncate text-gray-800">
                                      {member.nama}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                      No. {member.no}
                                    </div>
                                  </div>
                                </div>

                                <div className="flex items-center gap-2 flex-shrink-0">
                                  <button
                                    onClick={() => {
                                      handleToggleConfirm(
                                        "iuran",
                                        selectedIuran.id,
                                        null,
                                        member.no,
                                      );
                                    }}
                                    disabled={isToggling}
                                    className={`px-3 sm:px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-md text-white flex items-center gap-1 ${statusColor} ${
                                      isToggling
                                        ? "opacity-50 cursor-not-allowed"
                                        : ""
                                    }`}
                                  >
                                    <StatusIcon size={14} />
                                    <span className="hidden sm:inline">
                                      {statusLabel}
                                    </span>
                                  </button>

                                  {/* Quick Cicil Button - iuran */}
                                  {(status === "belum" || status === "cicil") && (
                                    <button
                                      onClick={() => {
                                        const qKey = `iuran-${selectedIuran.id}-${member.no}`;
                                        if (quickCicilOpen === qKey) {
                                          closeQuickCicil();
                                        } else {
                                          openQuickCicil(qKey);
                                        }
                                      }}
                                      className="p-2 bg-orange-100 hover:bg-orange-200 rounded-lg transition-colors"
                                      title="Quick Cicil"
                                    >
                                      <LucideIcon name="Banknote" size={16} className="text-orange-600" />
                                    </button>
                                  )}

                                  {(cicilanList.length > 0 ||
                                    isLunas) && (
                                    <button
                                      onClick={() => {
                                        setSelectedMemberView(
                                          selectedMemberView ===
                                            viewKey
                                            ? null
                                            : viewKey,
                                        );
                                      }}
                                      className="p-2 bg-indigo-100 hover:bg-indigo-200 rounded-lg transition-colors"
                                    >
                                      <Eye size={16} />
                                    </button>
                                  )}
                                </div>
                              </div>

                              {detailText && (
                                <div className="mt-2 text-xs text-gray-600 bg-indigo-50 rounded p-2 border border-indigo-200">
                                  {detailText}
                                </div>
                              )}

                              {/* Quick Cicil Inline Form - iuran */}
                              {quickCicilOpen === `iuran-${selectedIuran.id}-${member.no}` && (
                                <div className="mt-3 bg-orange-50 rounded-lg p-3 border-2 border-orange-300">
                                  <div className="flex items-center gap-2 mb-2">
                                    <LucideIcon name="Banknote" size={14} className="text-orange-600" />
                                    <span className="text-xs font-bold text-orange-700">Quick Cicil — {member.nama}</span>
                                    <span className="text-xs text-orange-500 ml-1">{selectedIuran.name}</span>
                                  </div>
                                  <div className="flex gap-2 items-end">
                                    <div className="flex-1">
                                      <label className="text-xs text-gray-600 mb-1 block">Jumlah (Rp)</label>
                                      <input
                                        type="number"
                                        min="1"
                                        placeholder={`Maks Rp ${(selectedIuran.amount - totalCicilan).toLocaleString("id-ID")}`}
                                        value={quickCicilAmount}
                                        onChange={(e) => setQuickCicilAmount(e.target.value)}
                                        className="w-full p-2 border border-orange-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-400 focus:border-orange-400 outline-none"
                                        autoFocus
                                      />
                                    </div>
                                    <div className="flex-1">
                                      <label className="text-xs text-gray-600 mb-1 block">Keterangan (opsional)</label>
                                      <input
                                        type="text"
                                        placeholder="Catatan..."
                                        value={quickCicilKet}
                                        onChange={(e) => setQuickCicilKet(e.target.value)}
                                        className="w-full p-2 border border-orange-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-400 outline-none"
                                      />
                                    </div>
                                  </div>
                                  <div className="flex gap-2 mt-2">
                                    <button
                                      onClick={() => submitQuickCicil("iuran", selectedIuran.id, null, member.no)}
                                      disabled={!quickCicilAmount || Number(quickCicilAmount) <= 0}
                                      className="flex-1 py-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold rounded-lg transition-colors"
                                    >
                                      Simpan Cicilan
                                    </button>
                                    <button
                                      onClick={closeQuickCicil}
                                      className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-lg transition-colors"
                                    >
                                      Batal
                                    </button>
                                  </div>
                                </div>
                              )}

                              {selectedMemberView === viewKey &&
                                (cicilanList.length > 0 ||
                                  isLunas) && (
                                  <div className="mt-3 bg-white rounded-lg p-3 border-2 border-indigo-300 shadow-inner">
                                    <div className="flex items-center justify-between mb-2">
                                      <h4 className="font-semibold text-xs text-indigo-700 flex items-center gap-1">
                                        <ClipboardList size={14} />
                                        {cicilanList.length > 0
                                          ? "Riwayat Cicilan"
                                          : "Status Pembayaran"}
                                      </h4>
                                      {totalCicilan > 0 && (
                                        <span className="text-xs font-bold text-indigo-600 bg-indigo-100 px-2 py-1 rounded">
                                          Total: Rp{" "}
                                          {totalCicilan.toLocaleString(
                                            "id-ID",
                                          )}
                                        </span>
                                      )}
                                    </div>

                                    {cicilanList.length > 0 ? (
                                      <div className="space-y-1 max-h-48 overflow-y-auto">
                                        {cicilanList.map(
                                          (c, idx) => (
                                            <div
                                              key={c.id}
                                              className="flex justify-between items-start py-2 border-b border-indigo-100 last:border-0"
                                            >
                                              <div className="flex-1">
                                                <div className="font-semibold text-xs text-gray-800">
                                                  #{idx + 1} -{" "}
                                                  {c.date}
                                                </div>
                                                {c.keterangan && (
                                                  <div className="text-gray-600 text-xs mt-1 italic">
                                                    "{c.keterangan}"
                                                  </div>
                                                )}
                                              </div>
                                              <div className="font-bold text-green-600 text-sm ml-3">
                                                +Rp{" "}
                                                {c.amount.toLocaleString(
                                                  "id-ID",
                                                )}
                                              </div>
                                            </div>
                                          ),
                                        )}
                                      </div>
                                    ) : (
                                      <div className="text-center py-2 text-xs text-gray-600">
                                        ✓ Dibayar langsung tanpa
                                        cicilan
                                      </div>
                                    )}
                                  </div>
                                )}
                            </div>
                          );
                        })}
                    </div>

                    {/* Summary Stats */}
                    <div className="mt-4 pt-4 border-t-2 border-gray-200">
                      <div className="grid grid-cols-3 gap-3">
                        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-3 border border-green-200">
                          <div className="text-xs text-green-700 font-semibold flex items-center gap-1">
                            <CheckCircle size={14} />
                            Lunas
                          </div>
                          <div className="text-2xl font-bold text-green-700 mt-1">
                            {
                              members.filter(
                                (m) =>
                                  m.no !== 0 &&
                                  payments[
                                    `${selectedIuran.id}-${m.no}`
                                  ] === true,
                              ).length
                            }
                          </div>
                        </div>
                        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-3 border border-yellow-200">
                          <div className="text-xs text-yellow-700 font-semibold flex items-center gap-1">
                            <HalfCircle size={14} />
                            Cicil
                          </div>
                          <div className="text-2xl font-bold text-yellow-700 mt-1">
                            {
                              members.filter((m) => {
                                if (m.no === 0) return false;
                                const isLunas =
                                  payments[
                                    `${selectedIuran.id}-${m.no}`
                                  ] === true;
                                const totalCicilan =
                                  getTotalCicilan(
                                    "iuran",
                                    selectedIuran.id,
                                    null,
                                    m.no,
                                  );
                                return !isLunas && totalCicilan > 0;
                              }).length
                            }
                          </div>
                        </div>
                        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-3 border border-red-200">
                          <div className="text-xs text-red-700 font-semibold flex items-center gap-1">
                            <XCircle size={14} />
                            Belum
                          </div>
                          <div className="text-2xl font-bold text-red-700 mt-1">
                            {
                              members.filter((m) => {
                                if (m.no === 0) return false;
                                const isLunas =
                                  payments[
                                    `${selectedIuran.id}-${m.no}`
                                  ] === true;
                                const totalCicilan =
                                  getTotalCicilan(
                                    "iuran",
                                    selectedIuran.id,
                                    null,
                                    m.no,
                                  );
                                return (
                                  !isLunas && totalCicilan === 0
                                );
                              }).length
                            }
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              );
            })()}
        </div>
      )}
    </div>
  );
};

export default CekBayarTab;
