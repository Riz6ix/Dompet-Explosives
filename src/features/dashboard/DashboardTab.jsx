import React from "react";
import { LucideIcon } from "../../components/ui/index.js";
import { Download, DollarSign } from "../../components/ui/Icons.jsx";
import { formatDateWithDay } from "../../utils/formatters.js";

const DashboardTab = ({
  // Random tip
  randomTip,
  setRandomTip,
  // Alerts
  alertConditions,
  dismissAlert,
  saldoAkhir,
  // Recent transactions
  transactions,
  members,
  formatDateWithDay: formatDateWithDayProp,
  // Iuran berjalan
  iuranKhusus,
  payments,
  getTotalCicilan,
  setActiveTab,
  // Export panel
  isExportOpen,
  setIsExportOpen,
  exportTransaksiCSV,
  exportKasMingguanCSV,
  exportIuranKhususCSV,
  exportSummaryCSV,
  exportAllCSV,
  generatePDFReport,
  // RPG props
  rpgCurrentRank,
  rpgXpProgress,
  rpgTotalXP,
}) => {
  const _formatDateWithDay = formatDateWithDayProp || formatDateWithDay;

  return (
    <div className="space-y-4 tab-content">
      {/* 🎮 RPG RANK WIDGET */}
      {rpgCurrentRank && (
        <div
          className={`relative w-full rounded-xl border shadow-sm bg-gradient-to-r ${rpgCurrentRank.color} ${rpgCurrentRank.textColor} overflow-hidden`}
        >
          <div className="p-4 pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                  <LucideIcon name={rpgCurrentRank.icon} size={22} />
                </div>
                <div className="text-left">
                  <div className="text-xs opacity-80 font-medium">Rank {rpgCurrentRank.rank}</div>
                  <div className="font-bold text-sm">{rpgCurrentRank.title}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs opacity-80">Total XP</div>
                <div className="font-black text-lg">{rpgTotalXP || 0}</div>
              </div>
            </div>
            {/* XP Progress Bar */}
            <div className="mt-3 bg-black/20 rounded-full h-2 overflow-hidden">
              <div
                className="h-full bg-white/60 rounded-full transition-all duration-700"
                style={{ width: `${rpgXpProgress || 0}%` }}
              />
            </div>
            {rpgCurrentRank.nextRank && (
              <div className="text-[10px] mt-1 opacity-70 text-right">
                {rpgCurrentRank.nextRank.xpRequired - (rpgTotalXP || 0)} XP lagi → {rpgCurrentRank.nextRank.title}
              </div>
            )}
          </div>
          {/* Centered button at bottom */}
          <button
            onClick={() => setActiveTab("quest")}
            className="w-full py-2.5 bg-black/15 hover:bg-black/25 active:bg-black/30 transition-colors flex items-center justify-center gap-1.5 border-t border-white/15"
          >
            <LucideIcon name="Swords" size={13} />
            <span className="text-xs font-bold opacity-90" aria-label="Lihat detail rank RPG">Lihat</span>
            <LucideIcon name="ChevronRight" size={13} className="opacity-60" />
          </button>
        </div>
      )}

      {/* 🎲 RANDOM TIP CARD */}
      {randomTip && (
        <div
          className={`relative p-4 rounded-xl border shadow-sm flex items-start gap-3 animate-fade-in-up ${randomTip.color}`}
        >
          <div className="p-2 bg-white/50 rounded-lg backdrop-blur-sm">
            <LucideIcon name={randomTip.icon} size={18} />
          </div>
          <div className="flex-1">
            <p className="text-xs font-bold leading-relaxed">
              {randomTip.text}
            </p>
          </div>
          <button
            onClick={() => setRandomTip(null)}
            className="opacity-50 hover:opacity-100 transition-opacity"
          >
            <LucideIcon name="X" size={14} />
          </button>
        </div>
      )}

      {/* SMART ALERTS BANNER - IMPROVEMENT #5 */}
      {alertConditions.length > 0 && (
        <div className="space-y-2">
          {alertConditions.map((alert) => (
            <div
              key={alert.id}
              role="alert"
              aria-live="polite"
              className={`
              alert-banner sticky-alert
              ${alert.type === "warning" ? "alert-warning" : ""}
              ${alert.type === "danger" ? "alert-danger alert-shake" : ""}
              ${alert.type === "info" ? "alert-info" : ""}
            `}
            >
              <div className="flex items-start gap-3">
                {/* Icon */}
                <div className="flex-shrink-0 text-2xl alert-icon-pulse">
                  {alert.icon}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-sm mb-1">
                    {alert.title}
                  </div>
                  <div className="text-xs opacity-90">
                    {alert.message}
                  </div>

                  {/* Progress bar for deficit */}
                  {alert.id === "deficit" && (
                    <div className="alert-progress">
                      <div
                        className="alert-progress-fill bg-white"
                        style={{ width: "100%" }}
                      ></div>
                    </div>
                  )}

                  {/* Progress bar for low balance */}
                  {alert.id === "low-balance" && (
                    <div className="alert-progress">
                      <div
                        className="alert-progress-fill"
                        style={{
                          width: `${Math.min(Math.max((saldoAkhir / 100000) * 100, 0), 100)}%`,
                        }}
                      ></div>
                    </div>
                  )}
                </div>

                {/* Dismiss Button */}
                <button
                  onClick={() => dismissAlert(alert.id)}
                  className="alert-dismiss flex-shrink-0"
                  aria-label="Dismiss"
                >
<LucideIcon name="X" size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="glass-card rounded-2xl shadow-sm p-4">
        <h2 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <DollarSign className="text-blue-600" size={20} />
          Transaksi Terbaru
        </h2>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {transactions
            .slice(-5)
            .reverse()
            .map((transaction) => (
              <div
                key={transaction.id}
                className="flex justify-between text-white items-center p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex-1">
                  <div className="font-medium text-sm">
                    {transaction.description}
                  </div>
                  <div className="text-xs text-gray-500">
                    {_formatDateWithDay(transaction.date)} • Minggu{" "}
                    {transaction.week}
                    {transaction.member &&
                      ` • ${
                        members.find(
                          (m) =>
                            Number(m.no) ===
                            Number(transaction.member),
                        )?.nama ?? ""
                      }`}{" "}
                  </div>
                </div>
                <div
                  className={`font-bold text-sm ${
                    transaction.type === "pemasukan"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {transaction.type === "pemasukan" ? "+" : "-"}Rp{" "}
                  {(transaction.amount || 0).toLocaleString("id-ID")}
                </div>
              </div>
            ))}
          {transactions.length === 0 && (
            <div className="text-center py-6">
              <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-2">
                <span className="text-2xl">📭</span>
              </div>
              <p className="font-semibold text-gray-700 text-sm mb-0.5">Belum Ada Transaksi</p>
              <p className="text-xs text-gray-400">Mulai catat pemasukan atau pengeluaran pertama</p>
            </div>
          )}
        </div>
      </div>

      {/* 📋 Iuran Berjalan - SOLID COLOR */}
      {iuranKhusus.length > 0 && (
        <div className="glass-card bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-gray-800 flex items-center gap-2">
              <span className="text-lg">📋</span>
              <span>Iuran Berjalan</span>
            </h3>
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-semibold">
              {iuranKhusus.length}
            </span>
          </div>

          <div className="space-y-3">
            {iuranKhusus.map((iuran) => {
              const totalMembers = members.filter(
                (m) => m.no !== 0,
              ).length;
              const paidMembers = members.filter(
                (m) =>
                  m.no !== 0 && payments[`${iuran.id}-${m.no}`],
              ).length;
              const cicilMembers = members.filter((m) => {
                if (m.no === 0) return false;
                const isLunas = payments[`${iuran.id}-${m.no}`];
                const totalCicilan = getTotalCicilan(
                  "iuran",
                  iuran.id,
                  null,
                  m.no,
                );
                return !isLunas && totalCicilan > 0;
              }).length;
              const belumMembers =
                totalMembers - paidMembers - cicilMembers;
              const totalCollected =
                paidMembers * iuran.amount +
                members
                  .filter((m) => m.no !== 0 && !payments[`${iuran.id}-${m.no}`])
                  .reduce(
                    (sum, m) =>
                      sum + getTotalCicilan("iuran", iuran.id, null, m.no),
                    0,
                  );
              const percentage = totalMembers > 0
                ? Math.round((totalCollected / (totalMembers * iuran.amount)) * 100)
                : 0;

              return (
                <div
                  key={iuran.id}
                  className="bg-gray-50 rounded-lg p-3 border border-gray-200 hover:border-gray-300 transition-colors"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800 text-sm">
                        {iuran.name}
                      </h4>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Rp {iuran.amount.toLocaleString("id-ID")}{" "}
                        per siswa
                      </p>
                    </div>
                    <div className="text-right ml-2">
                      <div className="text-lg font-bold text-blue-600">
                        {percentage}%
                      </div>
                      <div className="text-xs text-gray-500">
                        {paidMembers}/{totalMembers}
                      </div>
                    </div>
                  </div>

                  {/* Simple Progress Bar */}
                  <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden mb-2">
                    <div
                      className="h-full transition-all duration-500 rounded-full"
                      style={{
                        width: `${percentage}%`,
                        backgroundColor:
                          percentage === 100
                            ? "#10b981"
                            : percentage >= 80
                              ? "#f59e0b"
                              : "#3b82f6",
                      }}
                    ></div>
                  </div>

                  {/* Status Info */}
                  <div className="flex items-center gap-2 text-xs">
                    {paidMembers > 0 && (
                      <span className="text-green-600 font-medium">
                        ✓ {paidMembers} lunas
                      </span>
                    )}
                    {cicilMembers > 0 && (
                      <span className="text-yellow-600 font-medium">
                        ◐ {cicilMembers} cicil
                      </span>
                    )}
                    {belumMembers > 0 && (
                      <span className="text-red-600 font-medium">
                        ✗ {belumMembers} belum
                      </span>
                    )}
                  </div>

                  {/* Total & Deadline */}
                  <div className="mt-2 pt-2 border-t border-gray-200 flex items-center justify-between text-xs">
                    <span className="text-gray-600">
                      Terkumpul:
                    </span>
                    <span className="font-bold text-green-600">
                      Rp {totalCollected.toLocaleString("id-ID")}
                    </span>
                  </div>

                  {iuran.deadline && (
                    <div className="mt-1 text-xs text-red-600 flex items-center gap-1">
                      <span>⏰</span>
                      <span>
                        {new Date(
                          iuran.deadline,
                        ).toLocaleDateString("id-ID")}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* View All Button */}
          <button
            onClick={() => setActiveTab("iuran")}
            className="w-full mt-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 text-sm font-medium transition-colors"
          >
            Lihat Semua Iuran →
          </button>
        </div>
      )}

      {/* 📦 EXPORT DATA PANEL - COLLAPSED */}
      <div className="glass-card rounded-2xl p-4 mt-4">
        <button
          onClick={() => setIsExportOpen(!isExportOpen)}
          className="w-full flex items-center justify-between text-left"
        >
          <div className="flex items-center gap-2">
            <Download size={20} className="text-gray-700" />
            <h3 className="font-semibold text-gray-800">
              Export Options
            </h3>
          </div>
          <span className={`transition-transform ${isExportOpen ? "rotate-180" : ""}`}>
            <LucideIcon name="ChevronDown" size={20} className="text-gray-600" />
          </span>
        </button>

        {/* Collapsed Content */}
        {isExportOpen && (
          <div className="mt-4 space-y-3" style={{ animation: 'exportReveal 0.3s ease-out forwards' }}>
            <p className="text-sm text-gray-600 mb-3">
              Download data dalam format CSV untuk backup atau
              analisis lebih lanjut.
            </p>

            {/* Export Buttons Grid */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={exportTransaksiCSV}
                className="px-3 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
              >
<LucideIcon name="FileText" size={16} />
                <span>Transaksi</span>
              </button>

              <button
                onClick={exportKasMingguanCSV}
                className="px-3 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
              >
<LucideIcon name="CircleDollarSign" size={16} />
                <span>Uang Kas</span>
              </button>

              <button
                onClick={exportIuranKhususCSV}
                className="px-3 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
              >
<LucideIcon name="ClipboardList" size={16} />
                <span>Iuran</span>
              </button>

              <button
                onClick={exportSummaryCSV}
                className="px-3 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
              >
<LucideIcon name="BarChart3" size={16} />
                <span>Summary</span>
              </button>
            </div>

            {/* Export All Button */}
            <button
              onClick={exportAllCSV}
              className="w-full px-4 py-3 bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
            >
<LucideIcon name="Download" size={20} />
              <span>Export Semua Data (CSV)</span>
            </button>

            {/* PDF Export Button */}
            <button
              onClick={generatePDFReport}
              className="w-full px-4 py-3 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
            >
              <LucideIcon name="FileText" size={18} />
              <span>Cetak Laporan PDF (Resmi)</span>
            </button>


          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(DashboardTab);
