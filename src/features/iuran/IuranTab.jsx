import React from "react";
import { LucideIcon } from "../../components/ui/index.js";

const IuranTab = ({
  // Form state
  iuranForm,
  setIuranForm,
  handleIuranSubmit,
  // Data
  iuranKhusus,
  members,
  payments,
  cicilan,
  getTotalCicilan,
  // Delete
  handleDeleteIuran,
  // Modal
  setConfirmModal,
}) => {
  // Local state
  const [expandedIuran, setExpandedIuran] = React.useState(null);
  const [iuranMemberSearch, setIuranMemberSearch] = React.useState("");
  const [showForm, setShowForm] = React.useState(false);
  const [memberFilter, setMemberFilter] = React.useState("semua"); // semua | lunas | cicil | belum

  const toggleExpand = (id) => {
    setExpandedIuran((prev) => (prev === id ? null : id));
    setIuranMemberSearch("");
    setMemberFilter("semua");
  };

  // Deadline helpers
  const getDaysUntilDeadline = (deadline) => {
    if (!deadline) return null;
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const dl = new Date(deadline);
    dl.setHours(0, 0, 0, 0);
    return Math.ceil((dl - now) / (1000 * 60 * 60 * 24));
  };

  // Grand summary — memoised to avoid nested reduce on every render
  const grandSummary = React.useMemo(() => {
    if (iuranKhusus.length === 0) return null;
    const totalSiswa = members.filter(m => m.no !== 0).length;
    const grandTarget = iuranKhusus.reduce((s, i) => s + (totalSiswa * i.amount), 0);
    const grandCollected = iuranKhusus.reduce((s, iuran) => {
      const siswa = members.filter(m => m.no !== 0);
      const fromLunas = siswa.filter(m => payments[`${iuran.id}-${m.no}`] === true).length * iuran.amount;
      const fromCicilan = siswa.reduce((cs, m) => {
        if (payments[`${iuran.id}-${m.no}`] === true) return cs;
        return cs + getTotalCicilan("iuran", iuran.id, null, m.no);
      }, 0);
      return s + fromLunas + fromCicilan;
    }, 0);
    const grandPct = grandTarget > 0 ? Math.round((grandCollected / grandTarget) * 100) : 0;
    const completedIuran = iuranKhusus.filter(iuran => {
      const t = totalSiswa * iuran.amount;
      const siswa = members.filter(m => m.no !== 0);
      const c = siswa.filter(m => payments[`${iuran.id}-${m.no}`] === true).length * iuran.amount
        + siswa.reduce((cs, m) => payments[`${iuran.id}-${m.no}`] === true ? cs : cs + getTotalCicilan("iuran", iuran.id, null, m.no), 0);
      return t > 0 && c >= t;
    }).length;
    const totalLunasCount = iuranKhusus.reduce((s, iuran) => s + members.filter(m => m.no !== 0 && payments[`${iuran.id}-${m.no}`] === true).length, 0);
    const totalSlots = totalSiswa * iuranKhusus.length;
    const nearestDeadline = iuranKhusus
      .filter(i => i.deadline && getDaysUntilDeadline(i.deadline) !== null && getDaysUntilDeadline(i.deadline) >= 0)
      .sort((a, b) => getDaysUntilDeadline(a.deadline) - getDaysUntilDeadline(b.deadline))[0];
    const overdueCount = iuranKhusus.filter(i => i.deadline && getDaysUntilDeadline(i.deadline) !== null && getDaysUntilDeadline(i.deadline) < 0).length;
    const descLines = [];
    if (iuranKhusus.length === 1) {
      descLines.push(`1 iuran aktif untuk ${totalSiswa} siswa`);
    } else {
      descLines.push(`${iuranKhusus.length} iuran aktif untuk ${totalSiswa} siswa`);
    }
    if (completedIuran > 0) descLines.push(`${completedIuran} iuran sudah lunas semua 🎉`);
    if (overdueCount > 0) descLines.push(`${overdueCount} iuran melewati deadline`);
    return { grandTarget, grandCollected, grandPct, totalLunasCount, totalSlots, nearestDeadline, descLines };
  }, [iuranKhusus, members, cicilan, payments, getTotalCicilan]);

  // Form validation
  const isFormValid =
    iuranForm.name?.trim() &&
    iuranForm.amount &&
    Number(iuranForm.amount) > 0;

  /* ─── normalized input class ─── */
  const inputBase =
    "w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-700 placeholder-gray-400 focus:ring-0 focus:border-indigo-500 transition-all text-sm";

  const getDeadlineBadge = (deadline) => {
    const days = getDaysUntilDeadline(deadline);
    if (days === null) return null;
    if (days < 0) return { text: `${Math.abs(days)} hari lewat`, color: "bg-red-100 text-red-700 border-red-200", icon: "AlertTriangle" };
    if (days === 0) return { text: "Hari ini!", color: "bg-red-100 text-red-700 border-red-200", icon: "AlertTriangle" };
    if (days <= 3) return { text: `${days} hari lagi`, color: "bg-orange-100 text-orange-700 border-orange-200", icon: "Clock" };
    if (days <= 7) return { text: `${days} hari lagi`, color: "bg-yellow-100 text-yellow-700 border-yellow-200", icon: "Clock" };
    return { text: `${days} hari lagi`, color: "bg-gray-100 text-gray-600 border-gray-200", icon: "Calendar" };
  };

  return (
    <div className="space-y-4 tab-content">
      {/* ══════ TOMBOL BUAT IURAN / FORM ══════ */}
      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          className="w-full py-3 bg-gray-800 hover:bg-gray-900 text-white rounded-xl font-semibold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
        >
          <LucideIcon name="Plus" size={18} />
          Buat Iuran Baru
        </button>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-scale-in">
          {/* Dark header */}
          <div className="bg-gradient-to-r from-gray-800 to-gray-900 px-4 py-3 flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <LucideIcon name="ClipboardList" size={16} className="text-indigo-400" />
              Form Iuran Baru
            </h3>
            <button
              onClick={() => setShowForm(false)}
              className="p-1 hover:bg-white/10 rounded-lg transition-colors text-white/60 hover:text-white"
            >
              <LucideIcon name="X" size={16} />
            </button>
          </div>

          <div className="p-4 space-y-4">
            {/* Nama Iuran */}
            <div>
              <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">
                Nama Iuran
              </label>
              <input
                type="text"
                placeholder="Contoh: Kas Wisuda, Perpisahan, dll"
                value={iuranForm.name}
                onChange={(e) =>
                  setIuranForm({ ...iuranForm, name: e.target.value })
                }
                className={inputBase}
                maxLength={60}
              />
            </div>

            {/* Jumlah */}
            <div>
              <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">
                Jumlah per Siswa (Rp)
              </label>
              <input
                type="number"
                inputMode="numeric"
                placeholder="Contoh: 50000"
                value={iuranForm.amount}
                min="0"
                onChange={(e) =>
                  setIuranForm({ ...iuranForm, amount: e.target.value })
                }
                className={inputBase}
              />
              {/* Live preview */}
              {iuranForm.amount && (
                <p className={`mt-1.5 text-xs font-semibold italic px-1 ${
                  Number(iuranForm.amount) > 0 ? "text-gray-500" : "text-red-400"
                }`}>
                  {Number(iuranForm.amount) > 0
                    ? `Rp ${Number(iuranForm.amount).toLocaleString("id-ID")} × ${members.filter(m => m.no !== 0).length} siswa = Rp ${(Number(iuranForm.amount) * members.filter(m => m.no !== 0).length).toLocaleString("id-ID")}`
                    : "Jumlah harus lebih dari 0"}
                </p>
              )}
            </div>

            {/* Deadline */}
            <div>
              <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">
                Deadline (Opsional)
              </label>
              <input
                type="date"
                value={iuranForm.deadline}
                onChange={(e) =>
                  setIuranForm({ ...iuranForm, deadline: e.target.value })
                }
                className={inputBase}
              />
            </div>

            {/* Deskripsi */}
            <div>
              <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">
                Deskripsi (Opsional)
              </label>
              <textarea
                placeholder="Keterangan tambahan tentang iuran ini..."
                value={iuranForm.description}
                onChange={(e) =>
                  setIuranForm({ ...iuranForm, description: e.target.value })
                }
                className={`${inputBase} resize-none`}
                rows="2"
                maxLength={150}
              />
              {iuranForm.description && (
                <p className="mt-1 text-[10px] text-gray-400 px-1 text-right">
                  {iuranForm.description.length}/150
                </p>
              )}
            </div>

            {/* Buttons */}
            <div className="flex gap-2 pt-1">
              <button
                onClick={() => setShowForm(false)}
                className="flex-1 py-2.5 px-4 bg-gray-100 text-gray-600 rounded-xl font-semibold text-sm hover:bg-gray-200 transition-all"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  handleIuranSubmit();
                  setShowForm(false);
                }}
                disabled={!isFormValid}
                className={`flex-1 py-2.5 px-4 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
                  isFormValid
                    ? "bg-gray-800 hover:bg-gray-900 text-white shadow-md active:scale-[0.98]"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                <LucideIcon name="Check" size={16} />
                Buat Iuran
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════ RINGKASAN IURAN ══════ */}
      {grandSummary && (() => {
        const { grandTarget, grandCollected, grandPct, totalLunasCount, totalSlots, nearestDeadline, descLines } = grandSummary;
        return (
          <div className="bg-gradient-to-br from-indigo-50 via-purple-50/50 to-violet-50/30 rounded-2xl border border-indigo-200 overflow-hidden">
            {/* Header */}
            <div className="px-4 pt-4 pb-3">
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-xs font-bold text-indigo-700 uppercase tracking-wider flex items-center gap-2">
                  <LucideIcon name="LayoutDashboard" size={14} className="text-indigo-500" />
                  Ringkasan Iuran
                </h3>
                <span className="text-[10px] font-bold text-indigo-600 bg-indigo-100 px-2 py-0.5 rounded-full">
                  {grandPct}% terkumpul
                </span>
              </div>
              {/* Deskripsi kontekstual */}
              <div className="space-y-0.5 mt-2">
                {descLines.map((line, i) => (
                  <p key={i} className="text-[11px] text-gray-600 leading-relaxed flex items-start gap-1.5">
                    <span className="text-indigo-400 mt-0.5 flex-shrink-0">•</span>
                    {line}
                  </p>
                ))}
                {nearestDeadline && (
                  <p className="text-[11px] text-orange-600 leading-relaxed flex items-start gap-1.5 font-medium">
                    <LucideIcon name="Clock" size={11} className="mt-0.5 flex-shrink-0" />
                    Deadline terdekat: <span className="font-bold">{nearestDeadline.name}</span> ({getDaysUntilDeadline(nearestDeadline.deadline)} hari lagi)
                  </p>
                )}
              </div>
            </div>

            {/* Progress bar */}
            <div className="px-4 pb-3">
              <div className="relative w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`absolute h-full rounded-full transition-all duration-700 ${
                    grandPct >= 100 ? "bg-gradient-to-r from-green-400 to-emerald-500" : "bg-gradient-to-r from-indigo-400 to-purple-500"
                  }`}
                  style={{ width: `${Math.min(grandPct, 100)}%` }}
                />
              </div>
            </div>

            {/* Stats grid */}
            <div className="px-4 pb-4 grid grid-cols-3 gap-2">
              <div className="bg-white/80 rounded-xl px-2.5 py-2 border border-indigo-100 text-center">
                <div className="text-[10px] text-gray-500 font-medium">Target</div>
                <div className="text-[11px] font-bold text-gray-800">Rp {grandTarget.toLocaleString("id-ID")}</div>
              </div>
              <div className="bg-white/80 rounded-xl px-2.5 py-2 border border-indigo-100 text-center">
                <div className="text-[10px] text-green-600 font-medium">Terkumpul</div>
                <div className="text-[11px] font-bold text-green-700">Rp {grandCollected.toLocaleString("id-ID")}</div>
              </div>
              <div className="bg-white/80 rounded-xl px-2.5 py-2 border border-indigo-100 text-center">
                <div className="text-[10px] text-gray-500 font-medium">Lunas</div>
                <div className="text-[11px] font-bold text-gray-800">{totalLunasCount}<span className="text-[10px] font-medium text-gray-400">/{totalSlots}</span></div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ══════ DAFTAR IURAN ══════ */}

      {iuranKhusus.length === 0 ? (
        /* Empty State — modern */
        <div className="bg-gradient-to-br from-slate-50 via-indigo-50/50 to-purple-50/30 rounded-2xl p-6 border border-indigo-100 relative overflow-hidden">
          <div className="absolute top-3 right-6 w-20 h-20 bg-indigo-200/20 rounded-full blur-xl" />
          <div className="relative z-10 text-center">
            <div className="w-14 h-14 mx-auto mb-3 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl flex items-center justify-center shadow-sm">
              <LucideIcon name="ClipboardList" size={28} className="text-indigo-400" />
            </div>
            <h3 className="text-sm font-bold text-gray-800 mb-1">Belum Ada Iuran</h3>
            <p className="text-[11px] text-gray-500 leading-relaxed">
              Buat iuran pertama menggunakan tombol di atas
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Grand overview removed — replaced by top-level Ringkasan card */}

          {/* Each Iuran Card */}
          {iuranKhusus.map((iuran) => {
            // ─── Data computation ───
            const totalMembers = members.filter((m) => m.no !== 0).length;

            const paidMembers = members.filter((m) => {
              if (m.no === 0) return false;
              return payments[`${iuran.id}-${m.no}`] === true;
            }).length;

            const cicilMembers = members.filter((m) => {
              if (m.no === 0) return false;
              const isLunas = payments[`${iuran.id}-${m.no}`] === true;
              const tc = getTotalCicilan("iuran", iuran.id, null, m.no);
              return !isLunas && tc > 0;
            }).length;

            const belumMembers = totalMembers - paidMembers - cicilMembers;

            const totalFromLunas = paidMembers * iuran.amount;
            const totalFromCicilan = members
              .filter((m) => m.no !== 0)
              .reduce((sum, m) => {
                if (payments[`${iuran.id}-${m.no}`] === true) return sum;
                return sum + getTotalCicilan("iuran", iuran.id, null, m.no);
              }, 0);

            const totalCollected = totalFromLunas + totalFromCicilan;
            const targetTotal = totalMembers * iuran.amount;
            const percentage = targetTotal > 0 ? Math.round((totalCollected / targetTotal) * 100) : 0;
            const remaining = targetTotal - totalCollected;
            const isComplete = percentage >= 100;

            const deadlineBadge = getDeadlineBadge(iuran.deadline);
            const isExpanded = expandedIuran === iuran.id;

            // ─── Render ───
            return (
              <div
                key={iuran.id}
                className={`bg-white rounded-2xl shadow-sm overflow-hidden transition-all ${
                  isExpanded ? "border-2 border-indigo-300 shadow-md shadow-indigo-100" : "border border-gray-100"
                }`}
              >
                {/* ─── Card Header ─── */}
                <div className="p-4">
                  <div className="flex justify-between items-start gap-3 mb-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-gray-800 text-[15px] truncate">{iuran.name}</h3>
                        {isComplete && (
                          <span className="flex-shrink-0 bg-green-100 text-green-700 text-[9px] font-black px-2 py-0.5 rounded-full border border-green-200">
                            LUNAS
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs text-gray-500 font-medium">
                          Rp {iuran.amount.toLocaleString("id-ID")} / siswa
                        </span>
                        {iuran.createdDate && (
                          <>
                            <span className="text-gray-300">·</span>
                            <span className="text-[10px] text-gray-400">
                              {new Date(iuran.createdDate).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Delete */}
                    <button
                      onClick={() =>
                        setConfirmModal({
                          title: "Hapus Iuran",
                          message: `Yakin hapus iuran "${iuran.name}"? Semua data pembayaran & cicilan terkait iuran ini akan ikut terhapus.`,
                          icon: "🗑️",
                          type: "danger",
                          confirmText: "Ya, Hapus",
                          cancelText: "Batal",
                          onConfirm: () => handleDeleteIuran(iuran.id),
                        })
                      }
                      className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all flex-shrink-0"
                      title="Hapus Iuran"
                    >
                      <LucideIcon name="Trash2" size={16} />
                    </button>
                  </div>

                  {/* Badges row — deadline + description */}
                  <div className="flex items-center gap-2 flex-wrap mb-3">
                    {deadlineBadge && (
                      <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-lg border ${deadlineBadge.color}`}>
                        <LucideIcon name={deadlineBadge.icon} size={10} />
                        {iuran.deadline && new Date(iuran.deadline).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                        <span className="opacity-70">({deadlineBadge.text})</span>
                      </span>
                    )}
                    {iuran.description && (
                      <span className="text-[10px] text-gray-500 italic truncate max-w-[200px]" title={iuran.description}>
                        "{iuran.description}"
                      </span>
                    )}
                  </div>

                  {/* ─── Progress Bar ─── */}
                  <div className="mb-3">
                    <div className="flex justify-between items-center text-[10px] mb-1.5">
                      <span className="text-gray-500 font-medium uppercase tracking-wider">Progress</span>
                      <span className={`font-bold ${isComplete ? "text-green-600" : "text-indigo-600"}`}>
                        {percentage}%
                      </span>
                    </div>
                    <div className="relative w-full h-2.5 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`absolute h-full rounded-full transition-all duration-700 ease-out ${
                          isComplete
                            ? "bg-gradient-to-r from-green-400 to-emerald-500"
                            : percentage >= 70
                              ? "bg-gradient-to-r from-indigo-400 to-purple-500"
                              : "bg-gradient-to-r from-indigo-300 to-indigo-500"
                        }`}
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                      />
                    </div>
                    <div className="flex justify-between items-center mt-1.5 text-[10px]">
                      <span className="text-gray-400">{paidMembers}/{totalMembers} lunas</span>
                      <span className="text-green-600 font-semibold">
                        Rp {totalCollected.toLocaleString("id-ID")}
                      </span>
                    </div>
                  </div>

                  {/* ─── Status Breakdown ─── */}
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    <div className="bg-green-50 rounded-xl p-2 text-center border border-green-100">
                      <div className="flex items-center justify-center gap-1 mb-0.5">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                        <span className="text-[10px] text-green-700 font-semibold">Lunas</span>
                      </div>
                      <div className="text-base font-bold text-green-700">{paidMembers}</div>
                    </div>
                    <div className="bg-yellow-50 rounded-xl p-2 text-center border border-yellow-100">
                      <div className="flex items-center justify-center gap-1 mb-0.5">
                        <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full" />
                        <span className="text-[10px] text-yellow-700 font-semibold">Cicil</span>
                      </div>
                      <div className="text-base font-bold text-yellow-700">{cicilMembers}</div>
                    </div>
                    <div className="bg-red-50 rounded-xl p-2 text-center border border-red-100">
                      <div className="flex items-center justify-center gap-1 mb-0.5">
                        <div className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                        <span className="text-[10px] text-red-700 font-semibold">Belum</span>
                      </div>
                      <div className="text-base font-bold text-red-700">{belumMembers}</div>
                    </div>
                  </div>

                  {/* ─── Financial Summary ─── */}
                  <div className={`rounded-xl p-3 border ${isComplete ? "bg-green-50 border-green-200" : "bg-gray-50 border-gray-200"}`}>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <div className="text-[10px] text-gray-500 font-medium mb-0.5">Target Total</div>
                        <div className="text-xs font-bold text-gray-800">
                          Rp {targetTotal.toLocaleString("id-ID")}
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] text-gray-500 font-medium mb-0.5">Sisa</div>
                        <div className={`text-xs font-bold ${remaining <= 0 ? "text-green-600" : "text-orange-600"}`}>
                          Rp {Math.max(remaining, 0).toLocaleString("id-ID")}
                        </div>
                      </div>
                    </div>
                    {isComplete && (
                      <div className="mt-2.5 pt-2.5 border-t border-green-200 flex items-center justify-center gap-2 text-green-700">
                        <LucideIcon name="CheckCircle2" size={16} />
                        <span className="text-xs font-bold">Target Tercapai!</span>
                        <span>🎉</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* ─── Expand Toggle ─── */}
                <button
                  onClick={() => toggleExpand(iuran.id)}
                  className={`w-full py-2.5 text-xs font-semibold transition-all flex items-center justify-center gap-2 border-t ${
                    isExpanded
                      ? "bg-indigo-50 text-indigo-700 border-indigo-200"
                      : "bg-gray-50 text-gray-500 border-gray-100 hover:bg-gray-100"
                  }`}
                >
                  <LucideIcon
                    name={isExpanded ? "ChevronUp" : "ChevronDown"}
                    size={14}
                  />
                  {isExpanded ? "Sembunyikan Detail" : `Lihat Detail Anggota (${totalMembers})`}
                </button>

                {/* ─── Expanded Member Detail ─── */}
                {isExpanded && (
                  <div className="border-t border-gray-100 bg-gray-50/50">
                    <div className="p-4 space-y-3">
                      {/* Filter chips + Search */}
                      <div className="space-y-2">
                        <div className="flex gap-1.5">
                          {[
                            { key: "semua", label: "Semua", color: "bg-gray-700" },
                            { key: "lunas", label: "Lunas", color: "bg-green-500" },
                            { key: "cicil", label: "Cicil", color: "bg-yellow-500" },
                            { key: "belum", label: "Belum", color: "bg-red-500" },
                          ].map(f => (
                            <button
                              key={f.key}
                              onClick={() => setMemberFilter(f.key)}
                              className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${
                                memberFilter === f.key
                                  ? `${f.color} text-white shadow-sm`
                                  : "bg-white text-gray-500 hover:bg-gray-100 border border-gray-200"
                              }`}
                            >
                              {f.label}
                            </button>
                          ))}
                        </div>

                        <div className="relative">
                          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                            <LucideIcon name="Search" size={14} />
                          </div>
                          <input
                            type="text"
                            placeholder="Cari nama siswa..."
                            value={iuranMemberSearch}
                            onChange={(e) => setIuranMemberSearch(e.target.value)}
                            className="w-full pl-9 pr-9 py-2 bg-white border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-400 focus:bg-white transition-all outline-none placeholder-gray-400"
                          />
                          {iuranMemberSearch && (
                            <button
                              onClick={() => setIuranMemberSearch("")}
                              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                            >
                              <LucideIcon name="X" size={12} />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Member List */}
                      <div className="space-y-1.5 max-h-72 overflow-y-auto pr-0.5 it-member-scroll">
                        {(() => {
                          const filteredMembers = members
                            .filter((m) => m.no !== 0)
                            .filter((m) =>
                              m.nama.toLowerCase().includes(iuranMemberSearch.toLowerCase())
                            )
                            .filter((m) => {
                              if (memberFilter === "semua") return true;
                              const isLunas = payments[`${iuran.id}-${m.no}`] === true;
                              const tc = getTotalCicilan("iuran", iuran.id, null, m.no);
                              if (memberFilter === "lunas") return isLunas;
                              if (memberFilter === "cicil") return !isLunas && tc > 0;
                              if (memberFilter === "belum") return !isLunas && tc === 0;
                              return true;
                            });

                          if (filteredMembers.length === 0) {
                            return (
                              <div className="text-center py-6">
                                <div className="text-xl mb-1">🔍</div>
                                <p className="text-xs text-gray-400">Tidak ada data yang cocok</p>
                              </div>
                            );
                          }

                          return filteredMembers.map((m) => {
                            const payKey = `${iuran.id}-${m.no}`;
                            const isLunas = payments[payKey] === true;
                            const tc = getTotalCicilan("iuran", iuran.id, null, m.no);
                            const cicilanList = cicilan[`iuran-${iuran.id}-${m.no}`] || [];

                            return (
                              <div
                                key={m.no}
                                className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm transition-all ${
                                  isLunas
                                    ? "bg-green-50 border border-green-100"
                                    : tc > 0
                                      ? "bg-yellow-50 border border-yellow-100"
                                      : "bg-white border border-gray-100"
                                }`}
                              >
                                {/* Gender dot + Number */}
                                <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                                  m.jk === "L" ? "bg-blue-400" : "bg-pink-400"
                                }`} />
                                <span className="text-[10px] text-gray-400 font-mono w-5 flex-shrink-0">
                                  {m.no}
                                </span>

                                {/* Name */}
                                <span className="font-medium text-[13px] text-gray-700 truncate flex-1 min-w-0">
                                  {m.nama}
                                </span>

                                {/* Status badge */}
                                <div className="flex-shrink-0">
                                  {isLunas ? (
                                    <span className="text-[10px] font-bold text-green-700 bg-green-100 px-2.5 py-1 rounded-lg border border-green-200 flex items-center gap-1">
                                      <LucideIcon name="CheckCircle2" size={10} />
                                      Lunas
                                    </span>
                                  ) : tc > 0 ? (
                                    <span className="text-[10px] font-bold text-yellow-700 bg-yellow-100 px-2.5 py-1 rounded-lg border border-yellow-200">
                                      Rp {tc.toLocaleString("id-ID")}
                                      <span className="text-yellow-500 ml-0.5">
                                        /{iuran.amount.toLocaleString("id-ID")}
                                      </span>
                                    </span>
                                  ) : (
                                    <span className="text-[10px] font-bold text-red-500 bg-red-50 px-2.5 py-1 rounded-lg border border-red-200">
                                      Belum
                                    </span>
                                  )}
                                </div>
                              </div>
                            );
                          });
                        })()}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};

export default React.memo(IuranTab);
