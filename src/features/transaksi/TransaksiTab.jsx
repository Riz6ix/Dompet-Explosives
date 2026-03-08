import React from "react";
import { LucideIcon, CustomSelect } from "../../components/ui/index.js";
import { formatDateWithDay } from "../../utils/formatters.js";
import { EXPENSE_CATEGORIES, ITEMS_PER_PAGE } from "../../constants/config.js";

const TransaksiTab = ({
  // Form state
  transactionForm,
  setTransactionForm,
  handleTransactionSubmit,
  // List & filter
  filteredTransactions,
  transactions,
  members,
  transactionPage,
  setTransactionPage,
  searchQuery,
  setSearchQuery,
  filterType,
  setFilterType,
  sortBy,
  setSortBy,
  isFilterOpen,
  setIsFilterOpen,
  // Delete
  handleDeleteTransaction,
  // Modal
  setConfirmModal,
  // Utils (optional overrides)
  formatDateWithDay: formatDateWithDayProp,
}) => {
  const _formatDateWithDay = formatDateWithDayProp || formatDateWithDay;

  // Reset page when filters change
  React.useEffect(() => {
    setTransactionPage(1);
  }, [searchQuery, filterType, sortBy, setTransactionPage]);

  /* ─── shared input class (normalized) ─── */
  const inputBase =
    "w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-700 placeholder-gray-400 focus:ring-0 focus:border-cyan-500 transition-all";

  /* ─── derived data ─── */
  const totalPages = Math.ceil(filteredTransactions.length / ITEMS_PER_PAGE);
  const pageStart = (transactionPage - 1) * ITEMS_PER_PAGE;
  const pageEnd = transactionPage * ITEMS_PER_PAGE;
  const currentPageItems = filteredTransactions.slice(pageStart, pageEnd);

  // Quick summary untuk header card riwayat
  const { totalIncome, totalExpense } = React.useMemo(() => ({
    totalIncome: filteredTransactions.filter(t => t.type === "pemasukan").reduce((s, t) => s + (t.amount || 0), 0),
    totalExpense: filteredTransactions.filter(t => t.type === "pengeluaran").reduce((s, t) => s + (t.amount || 0), 0),
  }), [filteredTransactions]);

  // Cek apakah form valid (untuk disabled state submit button)
  const isFormValid =
    transactionForm.amount &&
    Number(transactionForm.amount) > 0 &&
    transactionForm.description?.trim();

  // Hitung jumlah filter aktif
  const activeFilterCount =
    (filterType !== "semua" ? 1 : 0) +
    (sortBy !== "terbaru" ? 1 : 0) +
    (searchQuery ? 1 : 0);

  return (
    <div className="space-y-4 tab-content">
      {/* ═══════ CARD 1 — FORM TAMBAH TRANSAKSI ═══════ */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <h2 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <LucideIcon name="PlusCircle" size={18} className="text-cyan-600" />
          Tambah Transaksi
        </h2>

        <div className="space-y-3">
          {/* Tipe toggle */}
          <div className="flex gap-2">
            <button
              onClick={() =>
                setTransactionForm({
                  ...transactionForm,
                  type: "pemasukan",
                })
              }
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-medium transition-all ${
                transactionForm.type === "pemasukan"
                  ? "bg-green-100 text-green-700 border-2 border-green-300"
                  : "bg-gray-100 text-gray-600 border-2 border-gray-200"
              }`}
            >
              <LucideIcon name="ArrowUpRight" size={16} />
              Pemasukan
            </button>
            <button
              onClick={() =>
                setTransactionForm({
                  ...transactionForm,
                  type: "pengeluaran",
                })
              }
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-medium transition-all ${
                transactionForm.type === "pengeluaran"
                  ? "bg-red-100 text-red-700 border-2 border-red-300"
                  : "bg-gray-100 text-gray-600 border-2 border-gray-200"
              }`}
            >
              <LucideIcon name="ArrowDownLeft" size={16} />
              Pengeluaran
            </button>
          </div>

          {/* Jumlah */}
          <div>
            <input
              type="number"
              inputMode="numeric"
              placeholder="Jumlah (Rp)"
              value={transactionForm.amount}
              min="0"
              onChange={(e) =>
                setTransactionForm({
                  ...transactionForm,
                  amount: e.target.value,
                })
              }
              className={inputBase}
            />
            {/* Live preview nominal */}
            {transactionForm.amount && (
              <p className={`mt-1.5 text-xs font-semibold italic px-1 ${
                Number(transactionForm.amount) > 0 ? "text-gray-500" : "text-red-400"
              }`}>
                {Number(transactionForm.amount) > 0
                  ? `Rp ${Number(transactionForm.amount).toLocaleString("id-ID")}`
                  : "Jumlah harus lebih dari 0"}
              </p>
            )}
          </div>

          {/* Keterangan */}
          <input
            type="text"
            placeholder="Keterangan"
            value={transactionForm.description}
            onChange={(e) =>
              setTransactionForm({
                ...transactionForm,
                description: e.target.value,
              })
            }
            className={inputBase}
            maxLength={100}
          />

          {/* Dropdown Kategori (Hanya untuk Pengeluaran) */}
          {transactionForm.type === "pengeluaran" && (
            <div className="animate-fade-in-up">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 px-1">
                Pilih Kategori Pengeluaran
              </label>
              <div className="grid grid-cols-2 gap-2">
                {EXPENSE_CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() =>
                      setTransactionForm({
                        ...transactionForm,
                        category: cat.id,
                      })
                    }
                    className={`flex items-center gap-2 p-3 rounded-xl border-2 transition-all text-xs font-bold ${
                      transactionForm.category === cat.id
                        ? "border-cyan-500 bg-cyan-50 text-cyan-700 shadow-md transform scale-[1.02]"
                        : "border-gray-100 bg-gray-50 text-gray-500 hover:border-gray-200"
                    }`}
                  >
                    <LucideIcon name={cat.icon} size={14} />
                    <span className="truncate">{cat.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Pilihan anggota (hanya pemasukan) */}
          {transactionForm.type === "pemasukan" && (
            <CustomSelect
              value={transactionForm.member}
              onChange={(e) =>
                setTransactionForm({
                  ...transactionForm,
                  member: e.target.value,
                })
              }
              placeholder="Pilih Anggota (Opsional)"
              options={[
                ...members.filter((m) => m.no === 0).map((m) => ({
                  value: m.no,
                  label: `🧑‍🏫 ${m.nama}`,
                })),
                ...members.filter((m) => m.no !== 0).map((member) => ({
                  value: member.no,
                  label: `${member.no}. ${member.nama}`,
                })),
              ]}
            />
          )}

          {/* Date picker */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5 px-1">
              Tanggal (Opsional)
            </label>
            <input
              type="date"
              value={transactionForm.customDate}
              onChange={(e) =>
                setTransactionForm({
                  ...transactionForm,
                  customDate: e.target.value,
                })
              }
              className={inputBase}
            />
            <p className="text-xs text-gray-400 mt-1.5 px-1">
              Default: Hari ini (
              {new Date().toLocaleDateString("id-ID")})
            </p>
          </div>

          {/* Submit */}
          <button
            onClick={handleTransactionSubmit}
            disabled={!isFormValid}
            className={`w-full py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
              isFormValid
                ? "bg-gray-800 hover:bg-gray-900 text-white active:scale-[0.98]"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            <LucideIcon name="Plus" size={18} />
            Tambah Transaksi
          </button>
        </div>
      </div>

      {/* ═══════ CARD 2 — SEARCH & FILTER + RIWAYAT ═══════ */}
      <div className="bg-white rounded-xl shadow-sm p-4" id="tt-riwayat">
        <h2 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <LucideIcon name="Receipt" size={18} className="text-cyan-600" />
          Riwayat Transaksi
          <span className="ml-auto bg-gray-100 text-gray-500 text-[10px] font-bold px-2 py-0.5 rounded-full">
            {filteredTransactions.length} item
          </span>
        </h2>

        {/* === QUICK SUMMARY STRIP — symmetrical design === */}
        {filteredTransactions.length > 0 && (
          <>
            <div className="grid grid-cols-2 gap-2.5 mb-2">
              <div className="flex items-center gap-2.5 px-3 py-2.5 bg-green-50 rounded-xl border border-green-100">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <LucideIcon name="TrendingUp" size={14} className="text-green-600" />
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] text-green-600 font-semibold uppercase tracking-wider">Masuk</div>
                  <div className="text-xs font-bold text-green-700 truncate">
                    Rp {totalIncome.toLocaleString("id-ID")}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2.5 px-3 py-2.5 bg-red-50 rounded-xl border border-red-100">
                <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <LucideIcon name="TrendingDown" size={14} className="text-red-600" />
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] text-red-600 font-semibold uppercase tracking-wider">Keluar</div>
                  <div className="text-xs font-bold text-red-700 truncate">
                    Rp {totalExpense.toLocaleString("id-ID")}
                  </div>
                </div>
              </div>
            </div>
            {/* Net Balance */}
            <div className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold mb-4 ${
              totalIncome - totalExpense >= 0
                ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                : "bg-red-50 text-red-700 border border-red-100"
            }`}>
              <span className="uppercase tracking-wider text-[10px] opacity-70">Selisih Bersih</span>
              <span>{totalIncome - totalExpense >= 0 ? "+" : ""}Rp {(totalIncome - totalExpense).toLocaleString("id-ID")}</span>
            </div>
          </>
        )}

        {/* === SEARCH & FILTER BAR === */}
        <div className="space-y-2.5 mb-4">
          {/* Search Bar */}
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <LucideIcon name="Search" size={16} className="text-gray-400 group-focus-within:text-cyan-500 transition-colors" />
            </div>
            <input
              type="text"
              placeholder="Cari transaksi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-2.5 border-2 border-gray-200 rounded-xl search-focus focus:ring-0 focus:border-cyan-500 transition-all text-sm text-gray-700 placeholder-gray-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
              >
                <LucideIcon name="X" size={16} />
              </button>
            )}
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all duration-300 text-sm ${
              isFilterOpen
                ? "bg-cyan-500 text-white shadow-lg shadow-cyan-500/20"
                : "bg-gray-50 border border-gray-200 text-gray-600 hover:border-cyan-300 hover:bg-cyan-50/30"
            }`}
          >
            <LucideIcon name="SlidersHorizontal" size={15} />
            <span>Filter & Urutkan</span>
            {activeFilterCount > 0 && !isFilterOpen && (
              <span className="bg-cyan-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
            <span className={`transition-transform duration-300 ml-auto ${isFilterOpen ? "rotate-180" : ""}`}>
              <LucideIcon name="ChevronDown" size={15} />
            </span>
          </button>

          {/* Collapsible Filter Panel */}
          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              isFilterOpen
                ? "max-h-96 opacity-100"
                : "max-h-0 opacity-0"
            }`}
          >
            <div className="bg-gradient-to-br from-gray-50 to-blue-50/30 rounded-xl p-4 border border-gray-200 space-y-4">
              {/* Filter Type */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-2 flex items-center gap-2">
                  <LucideIcon name="LayoutGrid" size={14} />
                  Tipe Transaksi
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setFilterType("semua")}
                    className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl font-medium transition-all duration-200 text-sm ${
                      filterType === "semua"
                        ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-md"
                        : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
                    }`}
                  >
                    <LucideIcon name="BarChart3" size={14} />
                    Semua
                  </button>
                  <button
                    onClick={() => setFilterType("pemasukan")}
                    className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl font-medium transition-all duration-200 text-sm ${
                      filterType === "pemasukan"
                        ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-md"
                        : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
                    }`}
                  >
                    <LucideIcon name="ArrowUpRight" size={14} />
                    Masuk
                  </button>
                  <button
                    onClick={() => setFilterType("pengeluaran")}
                    className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl font-medium transition-all duration-200 text-sm ${
                      filterType === "pengeluaran"
                        ? "bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-md"
                        : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
                    }`}
                  >
                    <LucideIcon name="ArrowDownLeft" size={14} />
                    Keluar
                  </button>
                </div>
              </div>

              {/* Sort */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-2 flex items-center gap-2">
                  <LucideIcon name="ArrowDownUp" size={14} />
                  Urutkan Berdasarkan
                </label>
                <CustomSelect
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  options={[
                    { value: "terbaru", label: "🕐 Terbaru" },
                    { value: "terlama", label: "🕰️ Terlama" },
                    { value: "terbesar", label: "💎 Terbesar" },
                    { value: "terkecil", label: "🪙 Terkecil" },
                  ]}
                />
              </div>

              {/* Reset Button */}
              {(filterType !== "semua" ||
                sortBy !== "terbaru" ||
                searchQuery) && (
                <button
                  onClick={() => {
                    setFilterType("semua");
                    setSortBy("terbaru");
                    setSearchQuery("");
                  }}
                  className="w-full py-2.5 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <LucideIcon name="RotateCcw" size={16} />
                  Reset Filter
                </button>
              )}
            </div>
          </div>
        </div>

        {/* === TRANSACTION LIST === */}
        <div className="space-y-2 max-h-[420px] overflow-y-auto pr-0.5 tt-scroll">
          {filteredTransactions.length === 0 ? (
            <div className="text-center py-10 px-4">
              <div className="w-14 h-14 mx-auto mb-3 bg-gray-100 rounded-2xl flex items-center justify-center">
                <LucideIcon name="FileSearch" size={28} className="text-gray-400" />
              </div>
              <div className="text-sm font-semibold text-gray-700 mb-1">
                Tidak ada transaksi
              </div>
              <div className="text-xs text-gray-500">
                {searchQuery || filterType !== "semua"
                  ? "Coba ubah filter atau kata kunci"
                  : "Tambah transaksi baru di atas"}
              </div>
            </div>
          ) : (
            currentPageItems.map((transaction, idx) => (
                <div
                  key={transaction.id}
                  className={`relative flex items-center gap-3 p-3 rounded-xl transition-all duration-300 hover-scale fade-in-up border ${
                    searchQuery &&
                    transaction.description
                      ?.toLowerCase()
                      .includes(searchQuery.toLowerCase())
                      ? "highlight-match"
                      : "bg-gray-50/80 border-gray-100 hover:bg-gray-100/80 hover:border-gray-200"
                  }`}
                  style={{
                    // NOTE: idx resets to 0 on each page, so stagger is page-relative—intentional for cosmetic effect
                    animationDelay: `${idx * 0.05}s`,
                  }}
                >
                  {/* Type icon circle */}
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    transaction.type === "pemasukan" 
                      ? "bg-green-100 text-green-600" 
                      : "bg-red-100 text-red-600"
                  }`}>
                    <LucideIcon name={transaction.type === "pemasukan" ? "ArrowUpRight" : "ArrowDownLeft"} size={16} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-[13px] text-gray-800 flex items-center gap-1.5">
                      <span className="truncate">{transaction.description}</span>
                      {transaction.category && (
                        <span className="shrink-0 bg-blue-100 text-blue-600 text-[8px] px-1.5 py-0.5 rounded font-black uppercase tracking-tight">
                          {EXPENSE_CATEGORIES.find(
                            (c) => c.id === transaction.category,
                          )?.label || "Lainnya"}
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-gray-400 mt-0.5 flex items-center gap-1">
                      <span>{_formatDateWithDay(transaction.date)}</span>
                      <span className="text-gray-300">·</span>
                      <span>W{transaction.week}</span>
                      {transaction.member && (
                        <>
                          <span className="text-gray-300">·</span>
                          <span className="truncate">
                            {members.find(
                              (m) => Number(m.no) === Number(transaction.member),
                            )?.nama || "—"}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <div
                      className={`font-bold text-sm tabular-nums ${
                        transaction.type === "pemasukan"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {transaction.type === "pemasukan" ? "+" : "-"}
                      Rp {(transaction.amount || 0).toLocaleString("id-ID")}
                    </div>
                    <button
                      onClick={() =>
                        setConfirmModal({
                          title: "🗑️ Hapus Transaksi",
                          message: `Yakin hapus transaksi "${transaction.description}" senilai Rp ${(transaction.amount || 0).toLocaleString("id-ID")}?`,
                          icon: "🗑️",
                          type: "danger",
                          confirmText: "Ya, Hapus",
                          cancelText: "Batal",
                          onConfirm: () => handleDeleteTransaction(transaction.id),
                        })
                      }
                      className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                      title="Hapus"
                      aria-label="Hapus transaksi"
                    >
                      <LucideIcon name="Trash2" size={14} />
                    </button>
                  </div>
                </div>
              ))
          )}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center pt-4 border-t border-gray-100 mt-4">
            <button
              onClick={() =>
                setTransactionPage((p) => Math.max(1, p - 1))
              }
              disabled={transactionPage === 1}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-gray-600 bg-white border-2 border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <LucideIcon name="ChevronLeft" size={16} />
              Sebelumnya
            </button>
            <span className="text-sm text-gray-600 font-semibold">
              {transactionPage} / {totalPages}
            </span>
            <button
              onClick={() =>
                setTransactionPage((p) =>
                  Math.min(totalPages, p + 1),
                )
              }
              disabled={transactionPage >= totalPages}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-gray-600 bg-white border-2 border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              Berikutnya
              <LucideIcon name="ChevronRight" size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(TransaksiTab);
