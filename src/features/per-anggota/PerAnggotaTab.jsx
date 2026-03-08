import React from "react";
import { LucideIcon, CustomSelect } from "../../components/ui/index.js";
import { formatDateShort } from "../../utils/index.js";

const PerAnggotaTab = ({
  members,
  kasMingguan,
  payments,
  cicilan,
  disabledWeeks,
  getCurrentWeek,
  KAS_MINGGUAN_AMOUNT,
  iuranKhusus,
  getTotalCicilan,
  getPaymentStatusDetail,
  selectedMemberView,
  setSelectedMemberView,
  cekBayarMode,
  selectedCekWeek,
  setSelectedCekWeek,
  filterStatus,
  setFilterStatus,
  toggleConfirm,
  setToggleConfirm,
  handleToggleConfirm,
  executeToggle,
  isToggling,
  onQuickCicil,
  depositCarryForward = { carryMap: {}, depositSourceMap: {} },
}) => {
  // Quick Cicil local state
  const [selectedIuranDetail, setSelectedIuranDetail] = React.useState(null);
  const [quickCicilOpen, setQuickCicilOpen] = React.useState(null);
  const [quickCicilAmount, setQuickCicilAmount] = React.useState("");
  const [quickCicilKet, setQuickCicilKet] = React.useState("");
  const [memberSearchLocal, setMemberSearchLocal] = React.useState("");

  // Memoised filtered member list for the selector grid
  const filteredSelectorMembers = React.useMemo(
    () =>
      members
        .filter((m) => m.no !== 0)
        .filter((m) =>
          m.nama.toLowerCase().includes(memberSearchLocal.toLowerCase()),
        ),
    [members, memberSearchLocal],
  );

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
      {/* EMPTY STATE — COMPACT & COZY */}
      {!selectedMemberView && (
        <div className="bg-gradient-to-br from-slate-50 via-indigo-50/50 to-purple-50/30 rounded-2xl p-5 pb-4 border border-indigo-100 relative overflow-hidden">
          {/* Subtle floating orbs */}
          <div className="absolute top-3 right-6 w-20 h-20 bg-indigo-200/20 rounded-full blur-xl es-float"></div>
          <div className="absolute bottom-2 left-8 w-16 h-16 bg-purple-200/20 rounded-full blur-xl es-float-alt"></div>

          <div className="relative z-10 text-center">
            {/* Icon — compact, no bounce */}
            <div className="mb-2.5 flex justify-center">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl flex items-center justify-center shadow-sm es-breathe">
                <span className="text-xl">👥</span>
              </div>
            </div>

            <h3 className="text-sm font-bold text-gray-800 mb-0.5">
              Cek Data Anggota
            </h3>
            <p className="text-[11px] text-gray-500 mb-3 leading-relaxed">
              Pilih anggota untuk lihat detail pembayaran
            </p>

            {/* Quick Stats — compact */}
            <div className="grid grid-cols-3 gap-2 mb-3">
              <div className="bg-white/70 backdrop-blur-sm rounded-xl p-2 border border-white/80 shadow-sm">
                <div className="text-base font-bold text-blue-600">
                  {members.filter((m) => m.no !== 0).length}
                </div>
                <div className="text-[10px] text-gray-500 font-medium">
                  Anggota
                </div>
              </div>
              <div className="bg-white/70 backdrop-blur-sm rounded-xl p-2 border border-white/80 shadow-sm">
                <div className="text-base font-bold text-green-600">
                  {getCurrentWeek}
                </div>
                <div className="text-[10px] text-gray-500 font-medium">
                  Minggu
                </div>
              </div>
              <div className="bg-white/70 backdrop-blur-sm rounded-xl p-2 border border-white/80 shadow-sm">
                <div className="text-base font-bold text-purple-600">
                  {iuranKhusus.length}
                </div>
                <div className="text-[10px] text-gray-500 font-medium">
                  Iuran
                </div>
              </div>
            </div>

            {/* Hint arrow — FIXED: more visible color + better spacing */}
            <div className="inline-flex items-center gap-1.5 bg-indigo-100/80 text-indigo-600 text-[11px] font-semibold px-3 py-1.5 rounded-full es-hint">
              <LucideIcon name="ChevronDown" size={12} />
              Pilih di bawah
            </div>
          </div>


        </div>
      )}
      {/* Member Selector with Search */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        {/* Header — clean, matches other cards */}
        <div className="px-4 pt-4 pb-1">
          <h2 className="font-semibold text-gray-800 text-sm flex items-center gap-2">
            <LucideIcon name="Users" size={16} className="text-gray-500" />
            Pilih Anggota
            <span className="ml-auto bg-gray-100 text-gray-500 text-[10px] font-bold px-2 py-0.5 rounded-full">
              {members.filter((m) => m.no !== 0).length} siswa
            </span>
          </h2>
        </div>

        <div className="p-4">
          {/* 🔍 Search Nama — Fixed alignment */}
          <div className="mb-3 relative">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
              <LucideIcon name="Search" size={16} />
            </div>
            <input
              type="text"
              placeholder="Cari nama siswa..."
              value={memberSearchLocal}
              onChange={(e) => setMemberSearchLocal(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none placeholder-gray-400"
            />
            {memberSearchLocal && (
              <button
                onClick={() => setMemberSearchLocal("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
              >
                <LucideIcon name="X" size={14} />
              </button>
            )}
          </div>

          {/* Member Grid — filtered by search query, memoised via filteredSelectorMembers */}
          <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto pr-0.5 pa-member-grid">
            {filteredSelectorMembers.map((member) => {
                const isSelected =
                  String(selectedMemberView) === String(member.no);
                const isL = member.jk === "L";
                return (
                  <button
                    key={member.no}
                    onClick={() =>
                      setSelectedMemberView(isSelected ? "" : String(member.no))
                    }
                    className={`relative p-2.5 rounded-xl text-left transition-all border-2 group overflow-hidden ${
                      isSelected
                        ? "bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-400 shadow-md shadow-blue-100"
                        : "bg-white border-gray-100 hover:border-gray-200 hover:shadow-sm active:scale-[0.97]"
                    }`}
                  >
                    {/* Selected indicator dot */}
                    {isSelected && (
                      <div className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-500 rounded-full pa-pulse" />
                    )}
                    <div className="flex items-center gap-2.5">
                      {/* Avatar circle */}
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                          isSelected
                            ? "bg-blue-500 text-white"
                            : isL
                              ? "bg-blue-100 text-blue-600"
                              : "bg-pink-100 text-pink-600"
                        }`}
                      >
                        {member.nama.charAt(0)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div
                          className={`text-xs font-semibold truncate ${
                            isSelected ? "text-blue-700" : "text-gray-700"
                          }`}
                        >
                          {member.nama}
                        </div>
                        <div
                          className={`text-[10px] font-medium ${
                            isSelected ? "text-blue-400" : "text-gray-400"
                          }`}
                        >
                          No. {member.no}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
          </div>

          {memberSearchLocal && filteredSelectorMembers.length === 0 && (
            <div className="text-center py-6">
              <div className="text-2xl mb-1">🔍</div>
              <p className="text-sm text-gray-400">
                Tidak ditemukan "{memberSearchLocal}"
              </p>
            </div>
          )}
        </div>


      </div>

      {/* Member Details */}
      {selectedMemberView &&
        (() => {
          const memberNo = Number.parseInt(selectedMemberView);
          const member = members.find((m) => m.no === memberNo);
          if (!member) return null;

          // HITUNG KAS MINGGUAN
          const kasData = [];
          let totalKasLunas = 0;
          let totalKasCicilan = 0;
          let totalKasBelum = 0;

          for (let week = 1; week <= getCurrentWeek; week++) {
            const isWeekDisabled = disabledWeeks[week];
            const kasKey = `${week}-${memberNo}`;
            const isLunas = kasMingguan[kasKey] === true;
            const carryInfo = depositCarryForward.carryMap[kasKey];
            const depositTarget = depositCarryForward.depositSourceMap[kasKey];

            if (isWeekDisabled && !isLunas) continue; // Minggu libur tanpa deposit → skip

            const totalCicilan = getTotalCicilan("kas", null, week, memberNo);

            if (isWeekDisabled && isLunas) {
              // Deposit: bayar di minggu libur
              kasData.push({
                week,
                status: "deposit",
                label: depositTarget
                  ? `💰 Deposit → M${depositTarget.targetWeek}`
                  : "💰 Deposit (belum carry)",
                cicilan: 0,
                sisa: 0,
                isLunas: true,
              });
              totalKasLunas += KAS_MINGGUAN_AMOUNT;
            } else if (carryInfo) {
              // Minggu aktif yang di-cover deposit
              kasData.push({
                week,
                status: "lunas",
                label: `✓ Lunas (deposit M${carryInfo.fromWeek})`,
                cicilan: 0,
                sisa: 0,
                isLunas: false,
              });
              // Tidak tambah totalKasLunas karena sudah dihitung di deposit source
            } else {
              // Minggu aktif normal
              const statusDetail = getPaymentStatusDetail(
                "kas",
                null,
                week,
                memberNo,
              );

              kasData.push({
                week,
                status: statusDetail.status,
                label: statusDetail.label,
                cicilan: totalCicilan,
                sisa: Math.max(0, KAS_MINGGUAN_AMOUNT - totalCicilan),
                isLunas,
              });

              if (isLunas) {
                totalKasLunas += KAS_MINGGUAN_AMOUNT;
              } else if (totalCicilan > 0) {
                totalKasCicilan += totalCicilan;
              } else {
                totalKasBelum += KAS_MINGGUAN_AMOUNT;
              }
            }
          }

          // HITUNG IURAN KHUSUS
          const iuranData = [];
          let totalIuranLunas = 0;
          let totalIuranCicilan = 0;
          let totalIuranBelum = 0;

          iuranKhusus.forEach((iuran) => {
            const isLunas = payments[`${iuran.id}-${memberNo}`] === true;
            const totalCicilan = getTotalCicilan(
              "iuran",
              iuran.id,
              null,
              memberNo,
            );
            const statusDetail = getPaymentStatusDetail(
              "iuran",
              iuran.id,
              null,
              memberNo,
            );

            iuranData.push({
              iuran,
              status: statusDetail.status,
              label: statusDetail.label,
              cicilan: totalCicilan,
              sisa: Math.max(0, iuran.amount - totalCicilan),
              isLunas,
            });

            if (isLunas) {
              totalIuranLunas += iuran.amount;
            } else if (totalCicilan > 0) {
              totalIuranCicilan += totalCicilan;
            } else {
              totalIuranBelum += iuran.amount;
            }
          });

          // KAS progress stats (computed before filter)
          const totalActiveWeeks = kasData.length;
          const totalLunasWeeks = kasData.filter((k) => k.isLunas).length;

          // IURAN progress stats (computed before filter)
          const totalActiveIuran = iuranData.length;
          const totalLunasIuran = iuranData.filter((i) => i.isLunas).length;

          // FILTER: Only show yang belum lunas atau cicil
          const kasDataFiltered = kasData.filter((item) => !item.isLunas);
          const iuranDataFiltered = iuranData.filter((item) => !item.isLunas);

          const totalTerbayar =
            totalKasLunas +
            totalKasCicilan +
            totalIuranLunas +
            totalIuranCicilan;
          const totalBelum = totalKasBelum + totalIuranBelum;

          return (
            <div className="space-y-4">
              {/* Header Info Card */}
              <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-blue-500">
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold ${
                      member.jk === "L"
                        ? "bg-blue-100 text-blue-600"
                        : "bg-pink-100 text-pink-600"
                    }`}
                  >
                    {member.nama.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                      {member.nama}
                      {(() => {
                        // Cari semua deposit aktif
                        const deposits = Object.keys(disabledWeeks).filter(
                          (w) =>
                            disabledWeeks[w] &&
                            kasMingguan[`${w}-${member.no}`] === true,
                        );
                        if (deposits.length > 0) {
                          return (
                            <div className="bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full text-[10px] font-black uppercase flex items-center gap-1 border border-yellow-200 shadow-sm">
                              <LucideIcon name="PiggyBank" size={10} />
                              <span>{deposits.length} Deposit Aktif</span>
                            </div>
                          );
                        }
                        return null;
                      })()}
                    </h3>
                    <p className="text-sm text-gray-500">No. {member.no}</p>
                  </div>
                </div>

                {/* Summary Stats */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                    <div className="text-xs text-green-600 font-medium mb-1">
                      💰 Total Terbayar
                    </div>
                    <div className="text-lg font-bold text-green-700">
                      Rp {totalTerbayar.toLocaleString("id-ID")}
                    </div>
                  </div>
                  <div className="bg-red-50 rounded-lg p-3 border border-red-200">
                    <div className="text-xs text-red-600 font-medium mb-1">
                      🔴 Total Belum
                    </div>
                    <div className="text-lg font-bold text-red-700">
                      Rp {totalBelum.toLocaleString("id-ID")}
                    </div>
                  </div>
                </div>
              </div>

              {/* Kas Mingguan Section */}
              {kasDataFiltered.length > 0 ? (
                <div className="bg-white rounded-xl shadow-sm p-4">
                  <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <LucideIcon
                      name="Calendar"
                      size={16}
                      className="text-blue-600"
                    />
                    Kas Mingguan (Belum Lunas)
                  </h3>
                  {/* Member Kas Progress */}
                  <div className="mb-3">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs text-gray-500">Progress Pembayaran Kas</span>
                      <span className="text-xs font-bold text-blue-600">
                        {totalLunasWeeks}/{totalActiveWeeks} minggu
                      </span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full transition-all duration-500"
                        style={{ width: `${totalActiveWeeks > 0 ? Math.round(totalLunasWeeks / totalActiveWeeks * 100) : 0}%` }}
                      />
                    </div>
                  </div>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {kasDataFiltered.map((item) => (
                      <React.Fragment key={item.week}>
                        <div
                          id={`kas-${item.week}-${memberNo}`}
                          className={`p-3 rounded-lg transition-all ${
                            item.status === "cicil"
                              ? "bg-yellow-50 border border-yellow-200"
                              : item.status === "deposit"
                                ? "bg-amber-50 border border-amber-200"
                                : "bg-gray-50 border border-gray-200"
                          }`}
                        >
                          <div className="flex justify-between items-center mb-2">
                            <div className="font-semibold text-sm text-gray-800">
                              Minggu {item.week}
                            </div>
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                item.status === "lunas" ? "bg-green-500 text-white"
                                  : item.status === "deposit" ? "bg-amber-500 text-white"
                                  : item.status === "cicil" ? "bg-yellow-500 text-white"
                                  : "bg-gray-400 text-white"
                              }`}
                            >
                              {item.status === "deposit" ? "💰 Deposit" : item.label}
                            </span>
                          </div>
                          {item.status === "deposit" && item.label && (
                            <p className="text-[10px] text-amber-600 mb-2">{item.label}</p>
                          )}
                          {item.cicilan > 0 && (
                            <div className="mb-2">
                              <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full"
                                  style={{ width: `${Math.min(100, Math.round(item.cicilan / KAS_MINGGUAN_AMOUNT * 100))}%` }}
                                />
                              </div>
                              <div className="flex justify-between mt-1">
                                <span className="text-[10px] text-gray-500">Terbayar: Rp {item.cicilan.toLocaleString("id-ID")}</span>
                                <span className="text-[10px] text-orange-600 font-semibold">Sisa: Rp {item.sisa.toLocaleString("id-ID")}</span>
                              </div>
                            </div>
                          )}
                          {item.status !== "lunas" && item.status !== "deposit" && (
                            <div className="grid grid-cols-3 gap-1.5">
                              <span className="flex items-center justify-center gap-1 py-1.5 bg-gray-400 text-white text-[11px] font-semibold rounded-lg">
                                ○ Belum
                              </span>
                              <button
                                onClick={() => {
                                  const qKey = `kas-${item.week}-${memberNo}`;
                                  if (quickCicilOpen === qKey) {
                                    closeQuickCicil();
                                  } else {
                                    openQuickCicil(qKey);
                                  }
                                }}
                                className="flex items-center justify-center gap-1 py-1.5 bg-orange-400 hover:bg-orange-500 text-white text-[11px] font-semibold rounded-lg transition-colors"
                                title="Quick Cicil"
                              >
                                <LucideIcon name="Banknote" size={11} />
                                Cicil
                              </button>
                              <button
                                onClick={() =>
                                  handleToggleConfirm(
                                    "kas",
                                    null,
                                    item.week,
                                    memberNo,
                                  )
                                }
                                className="flex items-center justify-center gap-1 py-1.5 bg-green-500 hover:bg-green-600 text-white text-[11px] font-semibold rounded-lg transition-colors"
                                title="Tandai Lunas"
                              >
                                ✓ Lunasin
                              </button>
                            </div>
                          )}
                        </div>
                        {/* Quick Cicil Inline Form - kas */}
                        {quickCicilOpen === `kas-${item.week}-${memberNo}` && (
                          <div className="mt-2 mb-2 bg-orange-50 rounded-lg p-3 border-2 border-orange-300">
                            <div className="flex items-center gap-2 mb-2">
                              <LucideIcon
                                name="Banknote"
                                size={14}
                                className="text-orange-600"
                              />
                              <span className="text-xs font-bold text-orange-700">
                                Quick Cicil — Minggu {item.week}
                              </span>
                            </div>
                            <div className="flex gap-2 items-end">
                              <div className="flex-1">
                                <label className="text-xs text-gray-600 mb-1 block">
                                  Jumlah (Rp)
                                </label>
                                <input
                                  type="number"
                                  min="1"
                                  placeholder={`Maks Rp ${(KAS_MINGGUAN_AMOUNT - item.cicilan).toLocaleString("id-ID")}`}
                                  value={quickCicilAmount}
                                  onChange={(e) =>
                                    setQuickCicilAmount(e.target.value)
                                  }
                                  className="w-full p-2 border border-orange-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-400 outline-none"
                                  autoFocus
                                />
                              </div>
                              <div className="flex-1">
                                <label className="text-xs text-gray-600 mb-1 block">
                                  Keterangan (opsional)
                                </label>
                                <input
                                  type="text"
                                  placeholder="Catatan..."
                                  value={quickCicilKet}
                                  onChange={(e) =>
                                    setQuickCicilKet(e.target.value)
                                  }
                                  className="w-full p-2 border border-orange-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-400 outline-none"
                                />
                              </div>
                            </div>
                            <div className="flex gap-2 mt-2">
                              <button
                                onClick={() =>
                                  submitQuickCicil(
                                    "kas",
                                    null,
                                    item.week,
                                    memberNo,
                                  )
                                }
                                disabled={
                                  !quickCicilAmount ||
                                  Number(quickCicilAmount) <= 0
                                }
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
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-sm p-4">
                  <div className="text-center py-6 text-gray-500">
                    <div className="text-3xl mb-2">🎉</div>
                    <p className="font-medium">
                      Semua Kas Mingguan Sudah Lunas!
                    </p>
                  </div>
                </div>
              )}

              {/* Iuran Khusus Section */}
              {iuranKhusus.length > 0 &&
                (iuranDataFiltered.length > 0 ? (
                  <div className="bg-white rounded-xl shadow-sm p-4">
                    <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <LucideIcon
                        name="ClipboardList"
                        size={16}
                        className="text-purple-600"
                      />
                      Iuran (Belum Lunas)
                    </h3>
                    {/* Member Iuran Progress */}
                    <div className="mb-3">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs text-gray-500">Progress Pembayaran Iuran</span>
                        <span className="text-xs font-bold text-purple-600">
                          {totalLunasIuran}/{totalActiveIuran} iuran
                        </span>
                      </div>
                      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-purple-400 to-purple-600 rounded-full transition-all duration-500"
                          style={{ width: `${totalActiveIuran > 0 ? Math.round(totalLunasIuran / totalActiveIuran * 100) : 0}%` }}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      {iuranDataFiltered.map((item) => (
                        <React.Fragment key={item.iuran.id}>
                          <div
                            id={`iuran-${item.iuran.id}-${memberNo}`}
                            className={`p-3 rounded-lg transition-all ${
                              item.status === "cicil"
                                ? "bg-yellow-50 border border-yellow-200"
                                : "bg-gray-50 border border-gray-200"
                            }`}
                          >
                            <div className="flex justify-between items-center mb-1">
                              <div className="font-semibold text-sm text-gray-800">
                                {item.iuran.name}
                              </div>
                              <span
                                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                  item.status === "lunas" ? "bg-green-500 text-white"
                                    : item.status === "cicil" ? "bg-yellow-500 text-white"
                                    : "bg-gray-400 text-white"
                                }`}
                              >
                                {item.label}
                              </span>
                            </div>
                            <div className="text-xs text-gray-500 mb-2">
                              Rp {item.iuran.amount.toLocaleString("id-ID")}
                            </div>
                            {item.cicilan > 0 && (
                              <div className="mb-2">
                                <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full"
                                    style={{ width: `${Math.min(100, Math.round(item.cicilan / item.iuran.amount * 100))}%` }}
                                  />
                                </div>
                                <div className="flex justify-between mt-1">
                                  <span className="text-[10px] text-gray-500">Terbayar: Rp {item.cicilan.toLocaleString("id-ID")}</span>
                                  <span className="text-[10px] text-orange-600 font-semibold">Sisa: Rp {item.sisa.toLocaleString("id-ID")}</span>
                                </div>
                              </div>
                            )}
                            {item.status !== "lunas" && (
                              <div className="grid grid-cols-3 gap-1.5">
                                <span className="flex items-center justify-center gap-1 py-1.5 bg-gray-400 text-white text-[11px] font-semibold rounded-lg">
                                  ○ Belum
                                </span>
                                <button
                                  onClick={() => {
                                    const qKey = `iuran-${item.iuran.id}-${memberNo}`;
                                    if (quickCicilOpen === qKey) {
                                      closeQuickCicil();
                                    } else {
                                      openQuickCicil(qKey);
                                    }
                                  }}
                                  className="flex items-center justify-center gap-1 py-1.5 bg-orange-400 hover:bg-orange-500 text-white text-[11px] font-semibold rounded-lg transition-colors"
                                  title="Quick Cicil"
                                >
                                  <LucideIcon name="Banknote" size={11} />
                                  Cicil
                                </button>
                                <button
                                  onClick={() =>
                                    handleToggleConfirm(
                                      "iuran",
                                      item.iuran.id,
                                      null,
                                      memberNo,
                                    )
                                  }
                                  className="flex items-center justify-center gap-1 py-1.5 bg-green-500 hover:bg-green-600 text-white text-[11px] font-semibold rounded-lg transition-colors"
                                  title="Tandai Lunas"
                                >
                                  ✓ Lunasin
                                </button>
                              </div>
                            )}
                          </div>
                          {/* Quick Cicil Inline Form - iuran */}
                          {quickCicilOpen ===
                            `iuran-${item.iuran.id}-${memberNo}` && (
                            <div className="mt-2 mb-2 bg-orange-50 rounded-lg p-3 border-2 border-orange-300">
                              <div className="flex items-center gap-2 mb-2">
                                <LucideIcon
                                  name="Banknote"
                                  size={14}
                                  className="text-orange-600"
                                />
                                <span className="text-xs font-bold text-orange-700">
                                  Quick Cicil — {item.iuran.name}
                                </span>
                              </div>
                              <div className="flex gap-2 items-end">
                                <div className="flex-1">
                                  <label className="text-xs text-gray-600 mb-1 block">
                                    Jumlah (Rp)
                                  </label>
                                  <input
                                    type="number"
                                    min="1"
                                    placeholder={`Maks Rp ${(item.iuran.amount - item.cicilan).toLocaleString("id-ID")}`}
                                    value={quickCicilAmount}
                                    onChange={(e) =>
                                      setQuickCicilAmount(e.target.value)
                                    }
                                    className="w-full p-2 border border-orange-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-400 outline-none"
                                    autoFocus
                                  />
                                </div>
                                <div className="flex-1">
                                  <label className="text-xs text-gray-600 mb-1 block">
                                    Keterangan (opsional)
                                  </label>
                                  <input
                                    type="text"
                                    placeholder="Catatan..."
                                    value={quickCicilKet}
                                    onChange={(e) =>
                                      setQuickCicilKet(e.target.value)
                                    }
                                    className="w-full p-2 border border-orange-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-400 outline-none"
                                  />
                                </div>
                              </div>
                              <div className="flex gap-2 mt-2">
                                <button
                                  onClick={() =>
                                    submitQuickCicil(
                                      "iuran",
                                      item.iuran.id,
                                      null,
                                      memberNo,
                                    )
                                  }
                                  disabled={
                                    !quickCicilAmount ||
                                    Number(quickCicilAmount) <= 0
                                  }
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
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="bg-white rounded-xl shadow-sm p-4">
                    <div className="text-center py-6 text-gray-500">
                      <div className="text-3xl mb-2">🎉</div>
                      <p className="font-medium">Semua Iuran Sudah Lunas!</p>
                    </div>
                  </div>
                ))}
            </div>
          );
        })()}

      {/* MODE IURAN KHUSUS - FIXED COMPLETE */}
      {cekBayarMode === "iuran" && (
        <div className="space-y-4">
          {/* Iuran Selector */}
          <div className="bg-white rounded-xl shadow-sm p-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              📋 Pilih Iuran
            </label>
            {iuranKhusus.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>Belum ada iuran yang dibuat.</p>
                <p className="text-sm mt-2">Buat iuran baru di tab "Iuran"</p>
              </div>
            ) : (
              <CustomSelect
                value={selectedCekWeek}
                onChange={(e) =>
                  setSelectedCekWeek(Number.parseInt(e.target.value))
                }
                placeholder="-- Pilih Iuran --"
                options={iuranKhusus.map((iuran) => ({
                  value: iuran.id,
                  label: `${iuran.name} - Rp ${iuran.amount.toLocaleString("id-ID")}`,
                }))}
              />
            )}
          </div>

          {/* Display Iuran Details & Member Status */}
          {selectedCekWeek &&
            iuranKhusus.find((i) => i.id === selectedCekWeek) &&
            (() => {
              const selectedIuran = iuranKhusus.find(
                (i) => i.id === selectedCekWeek,
              );

              return (
                <>
                  {/* Filter Status */}
                  <div className="bg-white rounded-xl shadow-sm p-4">
                    <h3 className="font-semibold text-gray-800 mb-3">
                      🔍 Filter Status
                    </h3>
                    <div className="flex gap-2 flex-wrap">
                      {[
                        {
                          value: "semua",
                          label: "Semua",
                          bg: "bg-gray-500",
                        },
                        {
                          value: "lunas",
                          label: "Lunas",
                          bg: "bg-green-500",
                        },
                        {
                          value: "cicil",
                          label: "Cicil",
                          bg: "bg-yellow-500",
                        },
                        {
                          value: "belum",
                          label: "Belum",
                          bg: "bg-red-500",
                        },
                      ].map((config) => (
                        <button
                          key={config.value}
                          onClick={() => setFilterStatus(config.value)}
                          className={`flex-1 py-2 px-4 rounded-lg text-xs font-bold transition-all ${
                            filterStatus === config.value
                              ? `${config.bg} text-white`
                              : "bg-gray-200 text-gray-700"
                          }`}
                        >
                          {config.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Iuran Info Card */}
                  <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl shadow-sm p-4 border border-indigo-200">
                    <h3 className="font-bold text-indigo-800 mb-2">
                      {selectedIuran.name}
                    </h3>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-gray-600">Jumlah:</span>
                        <span className="font-bold text-indigo-700 ml-2">
                          Rp {selectedIuran.amount.toLocaleString("id-ID")}
                        </span>
                      </div>
                      {selectedIuran.deadline && (
                        <div>
                          <span className="text-gray-600">Deadline:</span>
                          <span className="font-bold text-indigo-700 ml-2">
                            {formatDateShort(selectedIuran.deadline)}
                          </span>
                        </div>
                      )}
                    </div>
                    {selectedIuran.description && (
                      <p className="text-sm text-gray-600 mt-2 italic">
                        "{selectedIuran.description}"
                      </p>
                    )}
                  </div>

                  {/* Member Payment Status List */}
                  <div className="bg-white rounded-xl shadow-sm p-4">
                    <h3 className="font-semibold text-gray-800 mb-4">
                      Status Pembayaran Anggota
                    </h3>

                    <div className="space-y-2">
                      {members
                        .filter((m) => m.no !== 0)
                        .map((member) => {
                          const key = `${selectedIuran.id}-${member.no}`;
                          const isLunas = payments[key] === true;
                          const totalCicilan = getTotalCicilan(
                            "iuran",
                            selectedIuran.id,
                            null,
                            member.no,
                          );

                          // Hitung status REAL
                          let status = "belum";
                          let statusLabel = "Belum";
                          let statusColor = "bg-red-500";
                          let detailText = "";

                          if (isLunas) {
                            status = "lunas";
                            statusLabel = "Lunas";
                            statusColor = "bg-green-500";
                          } else if (totalCicilan > 0) {
                            status = "cicil";
                            statusLabel = "Cicil";
                            statusColor = "bg-yellow-500";
                            const sisa = selectedIuran.amount - totalCicilan;
                            detailText = `Terbayar: Rp ${totalCicilan.toLocaleString(
                              "id-ID",
                            )} | Sisa: Rp ${sisa.toLocaleString("id-ID")}`;
                          }

                          // Filter Logic
                          if (
                            filterStatus !== "semua" &&
                            status !== filterStatus
                          ) {
                            return null;
                          }

                          // Get cicilan list untuk detail
                          const cicilanList =
                            cicilan[`iuran-${selectedIuran.id}-${member.no}`] ||
                            [];

                          return (
                            <div
                              key={member.no}
                              className="bg-gray-50 text-white rounded-lg p-3 hover:bg-gray-100 transition-colors"
                            >
                              <div className="flex items-center justify-between gap-3">
                                {/* Member Info */}
                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                  <div
                                    className={`w-3 h-3 rounded-full flex-shrink-0 ${
                                      member.jk === "L"
                                        ? "bg-blue-400"
                                        : "bg-pink-400"
                                    }`}
                                  />
                                  <div className="flex-1 min-w-0">
                                    <div className="font-medium text-sm truncate">
                                      {member.nama}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                      No. {member.no}
                                    </div>
                                  </div>
                                </div>

                                {/* Button & Status */}
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
                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${statusColor} hover:opacity-90 text-white`}
                                  >
                                    {statusLabel}
                                  </button>

                                  {/* Cicil Button */}
                                  {!isLunas && (
                                    <button
                                      onClick={() => {
                                        const qKey = `iuran-${selectedIuran.id}-${member.no}`;
                                        if (quickCicilOpen === qKey) closeQuickCicil();
                                        else openQuickCicil(qKey);
                                      }}
                                      className="px-3 py-1.5 bg-orange-400 hover:bg-orange-500 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1"
                                      title="Quick Cicil"
                                    >
                                      <LucideIcon name="Banknote" size={12} />
                                      Cicil
                                    </button>
                                  )}

                                  {/* Detail Button - Show jika ada cicilan */}
                                  {cicilanList.length > 0 && (
                                    <button
                                      onClick={() => {
                                        const viewKey = `iuran-${selectedIuran.id}-${member.no}`;
                                        setSelectedIuranDetail(
                                          selectedIuranDetail === viewKey
                                            ? null
                                            : viewKey,
                                        );
                                      }}
                                      className="p-2 bg-indigo-100 hover:bg-indigo-200 rounded-lg transition-colors"
                                    >
                                      <LucideIcon name="Eye" size={16} />
                                    </button>
                                  )}
                                </div>
                              </div>

                              {/* Detail Info */}
                              {detailText && (
                                <div className="mt-2 text-xs text-gray-600 bg-white rounded p-2">
                                  {detailText}
                                </div>
                              )}

                              {/* Cicilan Detail Dropdown */}
                              {selectedIuranDetail ===
                                `iuran-${selectedIuran.id}-${member.no}` &&
                                cicilanList.length > 0 && (
                                  <div className="mt-3 bg-white rounded-lg p-3 border border-indigo-200">
                                    <div className="flex items-center justify-between mb-2">
                                      <h4 className="font-semibold text-xs text-indigo-700">
                                        📝 Riwayat Cicilan
                                      </h4>
                                      <span className="text-xs font-bold text-indigo-600">
                                        Total: Rp{" "}
                                        {totalCicilan.toLocaleString("id-ID")}
                                      </span>
                                    </div>
                                    <div className="space-y-1 max-h-48 overflow-y-auto">
                                      {cicilanList.map((c, idx) => (
                                        <div
                                          key={c.id}
                                          className="flex justify-between items-start py-2 border-b border-indigo-100 last:border-0"
                                        >
                                          <div className="flex-1">
                                            <div className="font-semibold text-xs text-gray-800">
                                              #{idx + 1} - {c.date}
                                            </div>
                                            {c.keterangan && (
                                              <div className="text-gray-600 text-xs mt-1">
                                                "{c.keterangan}"
                                              </div>
                                            )}
                                          </div>
                                          <div className="font-bold text-green-600 text-sm ml-3">
                                            Rp{" "}
                                            {c.amount.toLocaleString("id-ID")}
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}

                              {/* Quick Cicil Inline Form - iuran mode */}
                              {quickCicilOpen === `iuran-${selectedIuran.id}-${member.no}` && (
                                <div className="mt-2 mb-2 bg-orange-50 rounded-lg p-3 border-2 border-orange-300">
                                  <div className="flex items-center gap-2 mb-2">
                                    <LucideIcon
                                      name="Banknote"
                                      size={14}
                                      className="text-orange-600"
                                    />
                                    <span className="text-xs font-bold text-orange-700">
                                      Quick Cicil — {member.nama}
                                    </span>
                                  </div>
                                  <div className="flex gap-2 items-end">
                                    <div className="flex-1">
                                      <label className="text-xs text-gray-600 mb-1 block">
                                        Jumlah (Rp)
                                      </label>
                                      <input
                                        type="number"
                                        min="1"
                                        placeholder={`Maks Rp ${(selectedIuran.amount - totalCicilan).toLocaleString("id-ID")}`}
                                        value={quickCicilAmount}
                                        onChange={(e) => setQuickCicilAmount(e.target.value)}
                                        className="w-full p-2 border border-orange-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-400 outline-none"
                                        autoFocus
                                      />
                                    </div>
                                    <div className="flex-1">
                                      <label className="text-xs text-gray-600 mb-1 block">
                                        Keterangan (opsional)
                                      </label>
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
                                      onClick={() =>
                                        submitQuickCicil(
                                          "iuran",
                                          selectedIuran.id,
                                          null,
                                          member.no,
                                        )
                                      }
                                      disabled={
                                        !quickCicilAmount ||
                                        Number(quickCicilAmount) <= 0
                                      }
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
                            </div>
                          );
                        })}
                    </div>

                    {/* Summary Stats */}
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="grid grid-cols-3 gap-3 text-center">
                        <div className="bg-green-50 rounded-lg p-3">
                          <div className="text-xs text-green-600 font-medium">
                            🟢 Lunas
                          </div>
                          <div className="text-lg font-bold text-green-700">
                            {
                              members.filter((m) => {
                                if (m.no === 0) return false;
                                return payments[`${selectedIuran.id}-${m.no}`];
                              }).length
                            }
                          </div>
                        </div>
                        <div className="bg-yellow-50 rounded-lg p-3">
                          <div className="text-xs text-yellow-600 font-medium">
                            🟡 Cicil
                          </div>
                          <div className="text-lg font-bold text-yellow-700">
                            {
                              members.filter((m) => {
                                if (m.no === 0) return false;
                                const isLunas =
                                  payments[`${selectedIuran.id}-${m.no}`];
                                const totalCicilan = getTotalCicilan(
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
                        <div className="bg-red-50 rounded-lg p-3">
                          <div className="text-xs text-red-600 font-medium">
                            🔴 Belum
                          </div>
                          <div className="text-lg font-bold text-red-700">
                            {
                              members.filter((m) => {
                                if (m.no === 0) return false;
                                const isLunas =
                                  payments[`${selectedIuran.id}-${m.no}`];
                                const totalCicilan = getTotalCicilan(
                                  "iuran",
                                  selectedIuran.id,
                                  null,
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
                </>
              );
            })()}
        </div>
      )}

      {/* MODAL KONFIRMASI LUNAS */}
      {toggleConfirm &&
        (() => {
          const member = members.find((m) => m.no === toggleConfirm.memberNo);
          const itemName =
            toggleConfirm.type === "kas"
              ? `Kas Minggu ${toggleConfirm.week}`
              : iuranKhusus.find((i) => i.id === toggleConfirm.iuranId)?.name ||
                "Iuran";

          const handleConfirmLunas = () => {
            if (!toggleConfirm) return;

            const { type, iuranId, week, memberNo } = toggleConfirm;
            const elementId =
              type === "kas"
                ? `kas-${week}-${memberNo}`
                : `iuran-${iuranId}-${memberNo}`;
            const element = document.getElementById(elementId);

            if (element) {
              element.classList.add("success-pulse");
              setTimeout(() => {
                element.classList.add("animate-fade-out-item");
              }, 600);
              setTimeout(() => {
                executeToggle(); // ✅ PANGGIL executeToggle!
              }, 1000);
            } else {
              executeToggle(); // ✅ Fallback: langsung execute
            }
          };

          return (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
              role="dialog"
              aria-modal="true"
              aria-labelledby="confirm-lunas-title"
            >
              <div className="bg-white rounded-xl shadow-xl max-w-sm w-full">
                <div className="p-6">
                  <h3 id="confirm-lunas-title" className="font-semibold text-gray-800 mb-2">
                    Konfirmasi Lunas
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Tandai <span className="font-bold">{itemName}</span> untuk{" "}
                    <span className="font-bold">{member?.nama}</span> sebagai
                    lunas?
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setToggleConfirm(null)}
                      className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Batal
                    </button>
                    <button
                      onClick={handleConfirmLunas}
                      className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      ✓ Lunasin
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}
    </div>
  );
};

export default React.memo(PerAnggotaTab);
