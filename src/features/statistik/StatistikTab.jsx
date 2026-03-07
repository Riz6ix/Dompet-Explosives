import React from "react";
import { LucideIcon } from "../../components/ui/index.js";
import { formatCurrency } from "../../utils/index.js";
import { EXPENSE_CATEGORIES } from "../../constants/index.js";

// ============================================================
// HELPER: Initialize Chart.js dari CDN (window.Chart)
// ============================================================
const useChart = (canvasRef, configFn, deps = []) => {
  const chartRef = React.useRef(null);

  React.useEffect(() => {
    if (!canvasRef.current || !window.Chart) return;

    if (chartRef.current) {
      chartRef.current.destroy();
      chartRef.current = null;
    }

    const ctx = canvasRef.current.getContext("2d");
    const config = typeof configFn === "function" ? configFn() : configFn;
    chartRef.current = new window.Chart(ctx, config);

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
        chartRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
};

// ============================================================
// CONSTANTS
// ============================================================
const categoryColors = [
  "#1e293b", "#475569", "#64748b", "#94a3b8", "#cbd5e1", "#e2e8f0", "#f1f5f9",
];

const ITEMS_PER_PAGE = 10;

// ============================================================
// STATISTIK TAB
// ============================================================
const StatistikTab = ({
  statView,
  setStatView,
  saldoAkhir,
  totalPemasukan,
  totalPengeluaran,
  transactions,
  disabledWeeks,
  formatCurrency: formatCurrencyProp,
  globalActivities,
  activitySearch,
  setActivitySearch,
  activityPage,
  setActivityPage,
  statWeeksData,
  getWeekDate,
}) => {
  const fmtCurrency = formatCurrencyProp || formatCurrency;

  // Canvas refs
  const trendChartRef = React.useRef(null);
  const doughnutChartRef = React.useRef(null);
  const categoryChartRef = React.useRef(null);

  // Mount key for chart re-init
  const mountKeyRef = React.useRef(0);
  React.useEffect(() => {
    if (statView === "overview") mountKeyRef.current += 1;
  }, [statView]);
  const chartMountKey = statView === "overview" ? mountKeyRef.current : -1;

  // ── Data prep ──
  const displayWeeks = React.useMemo(
    () => [...statWeeksData].slice(-8),
    [statWeeksData],
  );

  const categoryTotals = React.useMemo(() => {
    return EXPENSE_CATEGORIES.map((cat) => {
      const total = transactions
        .filter((t) => t.type === "pengeluaran" && t.category === cat.id)
        .reduce((sum, t) => sum + (t.amount || 0), 0);
      return { ...cat, total };
    })
      .filter((c) => c.total > 0)
      .sort((a, b) => b.total - a.total);
  }, [transactions]);

  // ── KPI Helpers ──
  const savingsRate = totalPemasukan > 0 ? Math.round((saldoAkhir / totalPemasukan) * 100) : 0;
  const avgExpensePerWeek = statWeeksData.length > 0
    ? Math.round(totalPengeluaran / statWeeksData.length)
    : 0;
  const trendDirection = displayWeeks.length >= 2
    ? displayWeeks[displayWeeks.length - 1].balance - displayWeeks[displayWeeks.length - 2].balance
    : 0;
  const expenseRatio = totalPemasukan > 0 ? Math.round((totalPengeluaran / totalPemasukan) * 100) : 0;

  // ── Compact currency formatter for KPI cards ──
  const compactCurrency = (val) => {
    const abs = Math.abs(val);
    const sign = val < 0 ? "-" : "";
    if (abs >= 1_000_000) return `${sign}${(abs / 1_000_000).toFixed(1)}jt`;
    if (abs >= 100_000) return `${sign}${(abs / 1_000).toFixed(0)}rb`;
    if (abs >= 1_000) return `${sign}${(abs / 1_000).toFixed(0)}k`;
    return fmtCurrency(val);
  };

  // ── 1. TREND CHART CONFIG ──
  const trendChartConfig = React.useMemo(() => ({
    type: "line",
    data: {
      labels: displayWeeks.map((w) => `M${w.week}`),
      datasets: [
        {
          label: "Pemasukan",
          data: displayWeeks.map((w) => w.income),
          borderColor: "#10b981",
          backgroundColor: "rgba(16, 185, 129, 0.08)",
          fill: true,
          tension: 0.4,
          borderWidth: 2.5,
          pointRadius: 3,
          pointBackgroundColor: "#10b981",
          pointBorderColor: "#fff",
          pointBorderWidth: 2,
          pointHoverRadius: 5,
        },
        {
          label: "Pengeluaran",
          data: displayWeeks.map((w) => w.expense),
          borderColor: "#8b5cf6",
          backgroundColor: "rgba(139, 92, 246, 0.08)",
          fill: true,
          tension: 0.4,
          borderWidth: 2.5,
          pointRadius: 3,
          pointBackgroundColor: "#8b5cf6",
          pointBorderColor: "#fff",
          pointBorderWidth: 2,
          pointHoverRadius: 5,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { intersect: false, mode: "index" },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: "#1e293b",
          titleFont: { size: 11, weight: "bold" },
          bodyFont: { size: 11 },
          padding: 10,
          cornerRadius: 10,
          displayColors: true,
          boxPadding: 4,
          callbacks: {
            label: (ctx) => ` ${ctx.dataset.label}: Rp ${ctx.parsed.y.toLocaleString("id-ID")}`,
          },
        },
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { font: { size: 10, weight: "bold" }, color: "#94a3b8" },
          border: { display: false },
        },
        y: {
          grid: { color: "rgba(148, 163, 184, 0.1)", drawBorder: false },
          ticks: {
            font: { size: 9 },
            color: "#94a3b8",
            callback: (v) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v,
            maxTicksLimit: 5,
          },
          border: { display: false },
          beginAtZero: true,
        },
      },
    },
  }), [displayWeeks]);

  useChart(trendChartRef, trendChartConfig, [trendChartConfig, chartMountKey]);

  // ── 2. DOUGHNUT CHART CONFIG ──
  const doughnutChartConfig = React.useMemo(() => ({
    type: "doughnut",
    data: {
      labels: ["Pemasukan", "Pengeluaran"],
      datasets: [
        {
          data: [totalPemasukan, totalPengeluaran],
          backgroundColor: ["#10b981", "#8b5cf6"],
          borderWidth: 0,
          spacing: 4,
          borderRadius: 6,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: "72%",
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: "#1e293b",
          padding: 10,
          cornerRadius: 10,
          callbacks: {
            label: (ctx) => ` Rp ${ctx.parsed.toLocaleString("id-ID")}`,
          },
        },
      },
    },
  }), [totalPemasukan, totalPengeluaran]);

  useChart(doughnutChartRef, doughnutChartConfig, [doughnutChartConfig, chartMountKey]);

  // ── 3. CATEGORY BAR CHART CONFIG ──
  const categoryChartConfig = React.useMemo(() => ({
    type: "bar",
    data: {
      labels: categoryTotals.map((c) => c.label),
      datasets: [
        {
          data: categoryTotals.map((c) => c.total),
          backgroundColor: categoryTotals.map((_, i) => categoryColors[i % categoryColors.length]),
          borderRadius: 6,
          borderSkipped: false,
          barPercentage: 0.65,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      indexAxis: "y",
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: "#1e293b",
          padding: 10,
          cornerRadius: 10,
          callbacks: {
            label: (ctx) => ` Rp ${ctx.parsed.x.toLocaleString("id-ID")}`,
          },
        },
      },
      scales: {
        x: {
          grid: { color: "rgba(148, 163, 184, 0.1)", drawBorder: false },
          ticks: {
            font: { size: 9 },
            color: "#94a3b8",
            callback: (v) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v,
          },
          border: { display: false },
          beginAtZero: true,
        },
        y: {
          grid: { display: false },
          ticks: { font: { size: 10, weight: "bold" }, color: "#475569" },
          border: { display: false },
        },
      },
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [categoryTotals]);

  useChart(categoryChartRef, categoryChartConfig, [categoryChartConfig, chartMountKey]);

  // ── Activity data (memoized) ──
  const filteredActivities = React.useMemo(() => {
    return globalActivities.filter(
      (log) =>
        (log.description || "").toLowerCase().includes(activitySearch.toLowerCase()) ||
        (log.type && log.type.toLowerCase().includes(activitySearch.toLowerCase())),
    );
  }, [globalActivities, activitySearch]);

  const totalPages = Math.ceil(filteredActivities.length / ITEMS_PER_PAGE);
  const paginatedItems = filteredActivities.slice(
    (activityPage - 1) * ITEMS_PER_PAGE,
    activityPage * ITEMS_PER_PAGE,
  );

  const activityGroups = React.useMemo(() => {
    return paginatedItems.reduce((acc, log) => {
      const date = log.date;
      if (!acc[date]) acc[date] = [];
      acc[date].push(log);
      return acc;
    }, {});
  }, [paginatedItems]);

  // ── Best/worst week ──
  const bestWeek = React.useMemo(() => {
    if (statWeeksData.length === 0) return null;
    return statWeeksData.reduce((best, w) => w.balance > best.balance ? w : best, statWeeksData[0]);
  }, [statWeeksData]);

  const worstWeek = React.useMemo(() => {
    if (statWeeksData.length === 0) return null;
    return statWeeksData.reduce((worst, w) => w.balance < worst.balance ? w : worst, statWeeksData[0]);
  }, [statWeeksData]);

  return (
    <div className="space-y-3 tab-content">
      {/* ── VIEW SWITCHER ── */}
      <div className="bg-white p-1 rounded-2xl flex gap-1 shadow-sm border border-slate-100">
        {[
          { id: "overview", label: "Ringkasan", icon: "BarChart3" },
          { id: "activity", label: "Aktivitas", icon: "History" },
          { id: "weeks", label: "Mingguan", icon: "Calendar" },
        ].map((view) => (
          <button
            key={view.id}
            onClick={() => setStatView(view.id)}
            className={`flex-1 py-2.5 px-2 rounded-xl text-[11px] font-bold tracking-tight transition-all duration-200 flex items-center justify-center gap-1.5 ${
              statView === view.id
                ? "bg-slate-800 text-white shadow-lg"
                : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
            }`}
          >
            <LucideIcon name={view.icon} size={13} />
            {view.label}
          </button>
        ))}
      </div>

      {/* ══════════════════════════════════════════════ */}
      {/* 1. OVERVIEW                                    */}
      {/* ══════════════════════════════════════════════ */}
      {statView === "overview" && displayWeeks.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-200">
          <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <LucideIcon name="BarChart3" size={24} className="text-slate-300" />
          </div>
          <p className="text-xs font-bold text-slate-400">Belum Ada Data</p>
          <p className="text-[10px] text-slate-300 mt-1">Tambah transaksi untuk mulai melihat statistik</p>
        </div>
      )}

      {statView === "overview" && displayWeeks.length > 0 && (
        <div className="space-y-3 fade-slide-in">

          {/* ── KPI Cards: 2x2 grid (mobile friendly) ── */}
          <div className="grid grid-cols-2 gap-2.5">
            {/* Saldo */}
            <div className="bg-white rounded-2xl p-3.5 border border-slate-100 shadow-sm">
              <div className="flex items-center gap-2 mb-1.5">
                <div className="w-7 h-7 rounded-lg bg-slate-50 flex items-center justify-center">
                  <LucideIcon name="Wallet" size={14} className="text-slate-500" />
                </div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Saldo</span>
              </div>
              <p className={`text-xl font-black leading-tight ${saldoAkhir >= 0 ? "text-slate-800" : "text-rose-600"}`}>
                {compactCurrency(saldoAkhir)}
              </p>
            </div>

            {/* Savings Rate */}
            <div className="bg-white rounded-2xl p-3.5 border border-slate-100 shadow-sm">
              <div className="flex items-center gap-2 mb-1.5">
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                  savingsRate >= 50 ? "bg-emerald-50" : savingsRate >= 20 ? "bg-amber-50" : "bg-rose-50"
                }`}>
                  <LucideIcon name="PiggyBank" size={14} className={
                    savingsRate >= 50 ? "text-emerald-500" : savingsRate >= 20 ? "text-amber-500" : "text-rose-500"
                  } />
                </div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Hemat</span>
              </div>
              <p className={`text-xl font-black leading-tight ${
                savingsRate >= 50 ? "text-emerald-600" : savingsRate >= 20 ? "text-amber-600" : "text-rose-600"
              }`}>
                {savingsRate}%
              </p>
            </div>

            {/* Tren */}
            <div className="bg-white rounded-2xl p-3.5 border border-slate-100 shadow-sm">
              <div className="flex items-center gap-2 mb-1.5">
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                  trendDirection === 0 ? "bg-slate-50" : trendDirection > 0 ? "bg-emerald-50" : "bg-rose-50"
                }`}>
                  <LucideIcon
                    name={trendDirection === 0 ? "Minus" : trendDirection > 0 ? "TrendingUp" : "TrendingDown"}
                    size={14}
                    className={trendDirection === 0 ? "text-slate-400" : trendDirection > 0 ? "text-emerald-500" : "text-rose-500"}
                  />
                </div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Tren</span>
              </div>
              <p className={`text-xl font-black leading-tight ${
                trendDirection === 0 ? "text-slate-500" : trendDirection > 0 ? "text-emerald-600" : "text-rose-600"
              }`}>
                {trendDirection > 0 ? "+" : ""}{compactCurrency(trendDirection)}
              </p>
            </div>

            {/* Rata-rata Keluar / Minggu */}
            <div className="bg-white rounded-2xl p-3.5 border border-slate-100 shadow-sm">
              <div className="flex items-center gap-2 mb-1.5">
                <div className="w-7 h-7 rounded-lg bg-purple-50 flex items-center justify-center">
                  <LucideIcon name="ArrowDownLeft" size={14} className="text-purple-500" />
                </div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Avg/Mgg</span>
              </div>
              <p className="text-xl font-black text-purple-600 leading-tight">
                {compactCurrency(avgExpensePerWeek)}
              </p>
            </div>
          </div>

          {/* ── Trend Area Chart ── */}
          <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
            <div className="flex justify-between items-center mb-3">
              <div>
                <h3 className="text-xs font-bold text-slate-800">Tren Arus Kas</h3>
                <p className="text-[10px] text-slate-400">Pemasukan vs Pengeluaran per minggu</p>
              </div>
              <div className="flex gap-3">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                  <span className="text-[9px] font-bold text-slate-400">Masuk</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                  <span className="text-[9px] font-bold text-slate-400">Keluar</span>
                </div>
              </div>
            </div>
            <div className="h-44">
              <canvas ref={trendChartRef} className="w-full h-full"></canvas>
            </div>
          </div>

          {/* ── Doughnut + Breakdown (stacked on mobile) ── */}
          <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
            <h3 className="text-xs font-bold text-slate-800 mb-3">Komposisi Keuangan</h3>

            <div className="flex items-center gap-4">
              {/* Doughnut - left side */}
              <div className="w-28 h-28 flex-shrink-0 relative">
                {totalPemasukan > 0 || totalPengeluaran > 0 ? (
                  <>
                    <canvas ref={doughnutChartRef} className="w-full h-full"></canvas>
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="text-center">
                        <p className="text-[8px] text-slate-400 font-bold">RASIO</p>
                        <p className="text-sm font-black text-slate-800">{expenseRatio}%</p>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <p className="text-[10px] text-slate-300 font-bold">—</p>
                  </div>
                )}
              </div>

              {/* Breakdown - right side */}
              <div className="flex-1 space-y-2.5 min-w-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full flex-shrink-0"></span>
                    <span className="text-[11px] font-semibold text-slate-500 truncate">Pemasukan</span>
                  </div>
                  <span className="text-xs font-black text-emerald-600 ml-2 flex-shrink-0">{compactCurrency(totalPemasukan)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-2.5 h-2.5 bg-purple-500 rounded-full flex-shrink-0"></span>
                    <span className="text-[11px] font-semibold text-slate-500 truncate">Pengeluaran</span>
                  </div>
                  <span className="text-xs font-black text-purple-600 ml-2 flex-shrink-0">{compactCurrency(totalPengeluaran)}</span>
                </div>
                <div className="border-t border-slate-100 pt-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-slate-500">Sisa Bersih</span>
                    <span className={`text-xs font-black ${saldoAkhir >= 0 ? "text-slate-800" : "text-rose-600"}`}>
                      {compactCurrency(saldoAkhir)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Best/Worst Week Insight ── */}
          {bestWeek && worstWeek && statWeeksData.length >= 2 && (
            <div className="grid grid-cols-2 gap-2.5">
              <div className="bg-emerald-50 rounded-2xl p-3 border border-emerald-100">
                <div className="flex items-center gap-1.5 mb-1">
                  <LucideIcon name="Trophy" size={12} className="text-emerald-500" />
                  <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-wide">Minggu Terbaik</span>
                </div>
                <p className="text-sm font-black text-emerald-700">Minggu {bestWeek.week}</p>
                <p className="text-[10px] text-emerald-600 font-semibold">+{compactCurrency(bestWeek.balance)}</p>
              </div>
              <div className="bg-rose-50 rounded-2xl p-3 border border-rose-100">
                <div className="flex items-center gap-1.5 mb-1">
                  <LucideIcon name="AlertTriangle" size={12} className="text-rose-500" />
                  <span className="text-[9px] font-bold text-rose-600 uppercase tracking-wide">Paling Boros</span>
                </div>
                <p className="text-sm font-black text-rose-700">Minggu {worstWeek.week}</p>
                <p className="text-[10px] text-rose-600 font-semibold">{compactCurrency(worstWeek.balance)}</p>
              </div>
            </div>
          )}

          {/* ── Category Horizontal Bar ── */}
          <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-xs font-bold text-slate-800">Alokasi Pengeluaran</h3>
              <LucideIcon name="PieChart" size={14} className="text-slate-300" />
            </div>
            {categoryTotals.length > 0 ? (
              <div style={{ height: `${Math.max(categoryTotals.length * 36, 80)}px` }}>
                <canvas ref={categoryChartRef} className="w-full h-full"></canvas>
              </div>
            ) : (
              <div className="text-center py-8">
                <LucideIcon name="ShoppingBag" size={20} className="text-slate-200 mx-auto mb-2" />
                <p className="text-[10px] font-bold text-slate-300">Belum ada pengeluaran</p>
              </div>
            )}

            {/* Category legend with percentages */}
            {categoryTotals.length > 0 && (
              <div className="mt-3 pt-3 border-t border-slate-50 space-y-1.5">
                {categoryTotals.map((cat, i) => {
                  const pct = totalPengeluaran > 0 ? Math.round((cat.total / totalPengeluaran) * 100) : 0;
                  return (
                    <div key={cat.id} className="flex items-center gap-2">
                      <span
                        className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{ backgroundColor: categoryColors[i % categoryColors.length] }}
                      ></span>
                      <span className="text-[10px] text-slate-500 flex-1 truncate">{cat.label}</span>
                      <span className="text-[10px] font-bold text-slate-600">{compactCurrency(cat.total)}</span>
                      <span className="text-[9px] font-bold text-slate-400 w-8 text-right">{pct}%</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════ */}
      {/* 2. ACTIVITY LOG                                */}
      {/* ══════════════════════════════════════════════ */}
      {statView === "activity" && (
        <div className="space-y-3 fade-slide-in">
          {/* Search */}
          <div className="relative">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
              <LucideIcon name="Search" size={16} />
            </div>
            <input
              type="text"
              placeholder="Cari aktivitas..."
              value={activitySearch}
              onChange={(e) => { setActivitySearch(e.target.value); setActivityPage(1); }}
              className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-xs font-medium focus:ring-2 focus:ring-slate-100 focus:border-slate-300 transition-all shadow-sm placeholder-slate-400"
            />
            {activitySearch && (
              <button
                onClick={() => { setActivitySearch(""); setActivityPage(1); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500"
              >
                <LucideIcon name="X" size={14} />
              </button>
            )}
          </div>

          {/* Results count */}
          {activitySearch && (
            <p className="text-[10px] text-slate-400 font-medium px-1">
              {filteredActivities.length} hasil ditemukan
            </p>
          )}

          {/* Activity items */}
          <div className="space-y-3">
            {filteredActivities.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-200">
                <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <LucideIcon name="Inbox" size={24} className="text-slate-300" />
                </div>
                <p className="text-xs font-bold text-slate-400">
                  {activitySearch ? "Tidak ada hasil" : "Belum Ada Aktivitas"}
                </p>
              </div>
            ) : (
              <>
                {Object.entries(activityGroups).map(([date, logs]) => (
                  <div key={date}>
                    {/* Date header */}
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-lg">
                        <LucideIcon name="Calendar" size={10} className="text-slate-400" />
                        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">{date}</span>
                      </div>
                      <div className="h-px flex-1 bg-slate-100"></div>
                    </div>

                    {/* Log items */}
                    <div className="space-y-1.5">
                      {logs.map((log, i) => {
                        const isExpense = ["expense", "delete", "reset", "pengeluaran"].includes(log.type);
                        const isIncome = ["income", "lunas", "payment", "pemasukan"].includes(log.type);

                        return (
                          <div
                            key={log.id || i}
                            className="bg-white px-3 py-2.5 rounded-xl border border-slate-100 flex items-center gap-2.5"
                          >
                            {/* Icon */}
                            <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
                              isIncome ? "bg-emerald-50 text-emerald-600" : isExpense ? "bg-rose-50 text-rose-600" : "bg-slate-50 text-slate-500"
                            }`}>
                              <LucideIcon name={isIncome ? "TrendingUp" : isExpense ? "TrendingDown" : "Settings"} size={12} />
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              <p className="text-[11px] font-semibold text-slate-700 leading-snug truncate">{log.description}</p>
                              <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-[9px] text-slate-400">{log.time}</span>
                                {log.amount && (
                                  <span className={`text-[9px] font-bold ${isIncome ? "text-emerald-500" : "text-rose-500"}`}>
                                    {isIncome ? "+" : "-"}{fmtCurrency(log.amount)}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between pt-3">
                    <button
                      onClick={() => setActivityPage((p) => Math.max(1, p - 1))}
                      disabled={activityPage === 1}
                      className="px-3 py-2 text-[10px] font-bold text-slate-500 bg-white border border-slate-200 rounded-xl disabled:opacity-30 transition-all hover:bg-slate-50 shadow-sm"
                    >
                      <LucideIcon name="ChevronLeft" size={12} />
                    </button>
                    <span className="text-[10px] font-bold text-slate-400">
                      {activityPage} / {totalPages}
                    </span>
                    <button
                      onClick={() => setActivityPage((p) => Math.min(totalPages, p + 1))}
                      disabled={activityPage === totalPages}
                      className="px-3 py-2 text-[10px] font-bold text-slate-500 bg-white border border-slate-200 rounded-xl disabled:opacity-30 transition-all hover:bg-slate-50 shadow-sm"
                    >
                      <LucideIcon name="ChevronRight" size={12} />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════ */}
      {/* 3. WEEKLY VIEW                                 */}
      {/* ══════════════════════════════════════════════ */}
      {statView === "weeks" && (
        <div className="space-y-2.5 fade-slide-in">
          {statWeeksData.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-200">
              <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <LucideIcon name="Calendar" size={24} className="text-slate-300" />
              </div>
              <p className="text-xs font-bold text-slate-400">Belum Ada Data Minggu</p>
            </div>
          ) : (
            <>
              {/* Summary bar */}
              <div className="bg-white rounded-2xl p-3 border border-slate-100 shadow-sm flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400">Total {statWeeksData.length} minggu</span>
                <div className="flex gap-3">
                  <span className="text-[10px] font-bold text-emerald-500">
                    Masuk: {compactCurrency(statWeeksData.reduce((s, w) => s + w.income, 0))}
                  </span>
                  <span className="text-[10px] font-bold text-purple-500">
                    Keluar: {compactCurrency(statWeeksData.reduce((s, w) => s + w.expense, 0))}
                  </span>
                </div>
              </div>

              {/* Week cards */}
              {[...statWeeksData].reverse().map((data) => {
                const isDisabled = disabledWeeks[data.week];
                const maxVal = Math.max(data.income, data.expense, 1);

                return (
                  <div
                    key={data.week}
                    className={`bg-white border rounded-2xl p-3.5 shadow-sm transition-all ${
                      isDisabled ? "border-dashed border-slate-300 opacity-50" : "border-slate-100"
                    }`}
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between mb-2.5">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-[11px] ${
                          isDisabled ? "bg-slate-300 text-white" : "bg-slate-800 text-white"
                        }`}>
                          {data.week}
                        </div>
                        <div>
                          <div className="font-bold text-slate-800 text-[11px] flex items-center gap-1.5">
                            Minggu {data.week}
                            {isDisabled && (
                              <span className="bg-slate-200 text-slate-500 text-[7px] px-1.5 py-0.5 rounded font-bold">LIBUR</span>
                            )}
                          </div>
                          <div className="text-[9px] text-slate-400">{getWeekDate(data.week)}</div>
                        </div>
                      </div>
                      <div className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                        data.balance >= 0
                          ? "bg-emerald-50 text-emerald-600"
                          : "bg-rose-50 text-rose-600"
                      }`}>
                        {data.balance >= 0 ? "+" : ""}{compactCurrency(data.balance)}
                      </div>
                    </div>

                    {/* Mini bars */}
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-[8px] font-bold text-emerald-400 w-5">In</span>
                        <div className="flex-1 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                            style={{ width: `${(data.income / maxVal) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-[9px] font-bold text-slate-500 w-16 text-right">{compactCurrency(data.income)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[8px] font-bold text-purple-400 w-5">Out</span>
                        <div className="flex-1 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-purple-500 h-full rounded-full transition-all duration-500"
                            style={{ width: `${(data.expense / maxVal) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-[9px] font-bold text-slate-500 w-16 text-right">{compactCurrency(data.expense)}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default StatistikTab;
