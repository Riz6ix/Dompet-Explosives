import React from "react";
import { LucideIcon } from "../../components/ui/index.js";
import { Plus } from "../../components/ui/Icons.jsx";

const CicilanTab = ({
  cicilanForm,
  setCicilanForm,
  handleCicilanSubmit,
  cicilan,
  members,
  kasMingguan,
  payments,
  iuranKhusus,
  getCurrentWeek,
  KAS_MINGGUAN_AMOUNT,
  getTotalCicilan,
  disabledWeeks,
  getWeekDate,
}) => {
  const [expandedKey, setExpandedKey] = React.useState(null);
  const [searchCicilan, setSearchCicilan] = React.useState("");
  const [filterCicilanType, setFilterCicilanType] = React.useState("semua"); // semua | kas | iuran

  React.useEffect(() => {
    const id = 'cicilan-tab-styles';
    if (!document.getElementById(id)) {
      const style = document.createElement('style');
      style.id = id;
      style.textContent = `.ct-scroll::-webkit-scrollbar { width: 3px; } .ct-scroll::-webkit-scrollbar-track { background: transparent; } .ct-scroll::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 99px; }`;
      document.head.appendChild(style);
    }
  }, []);

  // Hitung total overview — memoised so Object.entries isn’t called on every render
  const { allCicilanEntries, totalCicilanAmount, totalCicilanCount } = React.useMemo(() => {
    const entries = Object.entries(cicilan).filter(([_, list]) => list && list.length > 0);
    const amount = entries.reduce(
      (total, [_, list]) => total + list.reduce((sum, c) => sum + (c.amount || 0), 0),
      0,
    );
    const count = entries.reduce(
      (total, [_, list]) => total + list.length,
      0,
    );
    return { allCicilanEntries: entries, totalCicilanAmount: amount, totalCicilanCount: count };
  }, [cicilan]);

  // Check if form valid
  const isFormReady =
    cicilanForm.memberNo &&
    cicilanForm.amount &&
    Number(cicilanForm.amount) > 0 &&
    ((cicilanForm.type === "kas" && cicilanForm.week) ||
      (cicilanForm.type === "iuran" && cicilanForm.iuranId));

  return (
    <div className="space-y-4 tab-content">
       {/* ══════ TOMBOL TAMBAH CICILAN ══════ */}
      {cicilanForm.memberNo === undefined ? (
        <button
          onClick={() => {
            setCicilanForm({
              type: "kas",
              memberNo: "",
              week: "",
              iuranId: "",
              amount: "",
              keterangan: "",
            });
          }}
          className="w-full py-3 bg-gray-800 hover:bg-gray-900 text-white rounded-xl font-semibold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
        >
          <Plus size={18} />
          Tambah Cicilan Baru
        </button>
      ) : (
        /* ══════ FORM CICILAN — REFORMED ══════ */
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-scale-in">
          {/* Header */}
          <div className="bg-gradient-to-r from-gray-800 to-gray-900 px-4 py-3 flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <LucideIcon name="Banknote" size={16} className="text-orange-400" />
              Form Cicilan
            </h3>
            <button
              onClick={() => setCicilanForm({ memberNo: undefined })}
              className="p-1 hover:bg-white/10 rounded-lg transition-colors text-white/60 hover:text-white"
            >
              <LucideIcon name="X" size={16} />
            </button>
          </div>

          <div className="p-4 space-y-4">
            {/* TIPE PEMBAYARAN */}
            <div>
              <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">
                Tipe Pembayaran
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() =>
                    setCicilanForm({ ...cicilanForm, type: "kas", iuranId: "" })
                  }
                  className={`py-2.5 px-3 rounded-xl font-medium text-sm transition-all flex items-center justify-center gap-2 border-2 ${
                    cicilanForm.type === "kas"
                      ? "bg-blue-50 border-blue-400 text-blue-700 shadow-sm"
                      : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"
                  }`}
                >
                  <LucideIcon name="Wallet" size={16} />
                  Kas Mingguan
                </button>
                <button
                  onClick={() =>
                    setCicilanForm({ ...cicilanForm, type: "iuran", week: "" })
                  }
                  className={`py-2.5 px-3 rounded-xl font-medium text-sm transition-all flex items-center justify-center gap-2 border-2 ${
                    cicilanForm.type === "iuran"
                      ? "bg-purple-50 border-purple-400 text-purple-700 shadow-sm"
                      : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"
                  }`}
                >
                  <LucideIcon name="ClipboardList" size={16} />
                  Iuran
                </button>
              </div>
            </div>

            {/* PILIH MEMBER */}
            <div>
              <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">
                Pilih Anggota
              </label>
              <select
                value={cicilanForm.memberNo}
                onChange={(e) =>
                  setCicilanForm({ ...cicilanForm, memberNo: e.target.value })
                }
                className="w-full p-2.5 border-2 border-gray-200 rounded-xl focus:ring-0 focus:border-gray-400 text-sm bg-white transition-all"
              >
                <option value="">-- Pilih Anggota --</option>
                {members
                  .filter((m) => m.no !== 0)
                  .map((member) => (
                    <option key={member.no} value={member.no}>
                      {member.no}. {member.nama}
                    </option>
                  ))}
              </select>
            </div>

            {/* PILIH MINGGU (KAS) */}
            {cicilanForm.type === "kas" && (
              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">
                  Pilih Minggu
                </label>
                <select
                  value={cicilanForm.week}
                  onChange={(e) =>
                    setCicilanForm({ ...cicilanForm, week: e.target.value })
                  }
                  className="w-full p-2.5 border-2 border-gray-200 rounded-xl focus:ring-0 focus:border-gray-400 text-sm bg-white transition-all"
                >
                  <option value="">-- Pilih Minggu --</option>
                  {Array.from({ length: getCurrentWeek }, (_, i) => i + 1)
                    .reverse()
                    .map((week) => (
                      <option
                        key={week}
                        value={week}
                        disabled={disabledWeeks[week]}
                      >
                        Minggu {week}{" "}
                        {disabledWeeks[week]
                          ? "(🛑 LIBUR)"
                          : `- ${getWeekDate(week)}`}
                      </option>
                    ))}
                </select>
              </div>
            )}

            {/* PILIH IURAN */}
            {cicilanForm.type === "iuran" && (
              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">
                  Pilih Iuran
                </label>
                {iuranKhusus.length === 0 ? (
                  <div className="text-center py-5 text-gray-400 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                    <LucideIcon name="ClipboardList" size={28} className="mx-auto mb-2 text-gray-300" />
                    <p className="text-xs font-medium">Belum ada iuran</p>
                  </div>
                ) : (
                  <select
                    value={cicilanForm.iuranId}
                    onChange={(e) =>
                      setCicilanForm({ ...cicilanForm, iuranId: e.target.value })
                    }
                    className="w-full p-2.5 border-2 border-gray-200 rounded-xl focus:ring-0 focus:border-gray-400 text-sm bg-white transition-all"
                  >
                    <option value="">-- Pilih Iuran --</option>
                    {iuranKhusus.map((iuran) => (
                      <option key={iuran.id} value={iuran.id}>
                        {iuran.name} - Rp {iuran.amount.toLocaleString("id-ID")}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            )}

            {/* INFO PEMBAYARAN — improved card */}
            {cicilanForm.memberNo &&
              ((cicilanForm.type === "kas" && cicilanForm.week) ||
                (cicilanForm.type === "iuran" && cicilanForm.iuranId)) &&
              (() => {
                const memberNo = Number.parseInt(cicilanForm.memberNo);
                const member = members.find((m) => m.no === memberNo);

                let key = "";
                let maxAmount = 0;
                let itemName = "";
                let isLunas = false;

                if (cicilanForm.type === "kas") {
                  const week = Number.parseInt(cicilanForm.week);
                  key = `kas-${week}-${memberNo}`;
                  maxAmount = KAS_MINGGUAN_AMOUNT;
                  itemName = `Kas Minggu ${week}`;
                  isLunas = kasMingguan[`${week}-${memberNo}`] === true;
                } else {
                  const iuranId = Number.parseInt(cicilanForm.iuranId);
                  const iuran = iuranKhusus.find((i) => i.id === iuranId);
                  key = `iuran-${iuranId}-${memberNo}`;
                  maxAmount = iuran?.amount || 0;
                  itemName = iuran?.name || "";
                  isLunas = payments[`${iuranId}-${memberNo}`] === true;
                }

                const existingCicilan = cicilan[key] || [];
                const totalCicilan = existingCicilan.reduce(
                  (sum, c) => sum + c.amount,
                  0,
                );
                const totalPaid = isLunas ? maxAmount : totalCicilan;
                const remaining = maxAmount - totalPaid;
                const progress = maxAmount > 0 ? Math.round((totalPaid / maxAmount) * 100) : 0;

                return (
                  <div className={`rounded-xl overflow-hidden border-2 ${
                    isLunas ? "border-green-300 bg-green-50" : "border-gray-200 bg-gray-50"
                  }`}>
                    {/* Mini header */}
                    <div className={`px-3 py-2 ${
                      isLunas 
                        ? "bg-green-100 border-b border-green-200" 
                        : "bg-gray-100 border-b border-gray-200"
                    }`}>
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-gray-600 flex items-center gap-1.5">
                          <LucideIcon name="Info" size={12} />
                          Info Pembayaran
                        </span>
                        {isLunas && (
                          <span className="text-[10px] font-black text-green-700 bg-green-200 px-2 py-0.5 rounded-full">
                            LUNAS
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="p-3 space-y-2.5">
                      {/* Member & Item */}
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-gray-500">Anggota</span>
                        <span className="font-semibold text-gray-800">{member?.nama}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-gray-500">Item</span>
                        <span className="font-semibold text-gray-800">{itemName}</span>
                      </div>

                      {/* Progress bar */}
                      <div>
                        <div className="flex justify-between text-[10px] mb-1">
                          <span className="text-green-600 font-bold">
                            Rp {totalPaid.toLocaleString("id-ID")}
                          </span>
                          <span className={`font-bold ${progress >= 100 ? "text-green-600" : "text-gray-500"}`}>
                            {Math.min(progress, 100)}%
                          </span>
                          <span className="text-orange-600 font-bold">
                            Sisa Rp {Math.max(remaining, 0).toLocaleString("id-ID")}
                          </span>
                        </div>
                        <div className="relative h-2.5 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={`absolute h-full rounded-full transition-all duration-500 ${
                              progress >= 100
                                ? "bg-gradient-to-r from-green-400 to-emerald-500"
                                : "bg-gradient-to-r from-orange-400 to-amber-500"
                            }`}
                            style={{ width: `${Math.min(progress, 100)}%` }}
                          />
                        </div>
                      </div>

                      {/* Target info */}
                      <div className="flex justify-between text-xs pt-1 border-t border-gray-200">
                        <span className="text-gray-500">Target</span>
                        <span className="font-bold text-gray-800">
                          Rp {maxAmount.toLocaleString("id-ID")}
                        </span>
                      </div>

                      {/* Existing cicilan mini list */}
                      {existingCicilan.length > 0 && (
                        <div className="pt-1 border-t border-gray-200">
                          <div className="text-[10px] text-gray-500 font-semibold mb-1">
                            Riwayat ({existingCicilan.length}x)
                          </div>
                          <div className="space-y-1 max-h-24 overflow-y-auto">
                            {existingCicilan.map((c, idx) => (
                              <div
                                key={c.id}
                                className="flex justify-between text-[10px] bg-white rounded-lg px-2 py-1.5 border border-gray-100"
                              >
                                <span className="text-gray-500">
                                  #{idx + 1} {c.date}
                                </span>
                                <span className="font-bold text-green-600">
                                  +Rp {c.amount.toLocaleString("id-ID")}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })()}

            {/* JUMLAH CICILAN */}
            <div>
              <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">
                Jumlah Cicilan (Rp)
              </label>
              <input
                type="number"
                inputMode="numeric"
                value={cicilanForm.amount}
                onChange={(e) =>
                  setCicilanForm({
                    ...cicilanForm,
                    amount: e.target.value === "" ? "" : Number.parseInt(e.target.value),
                  })
                }
                placeholder="Masukkan jumlah cicilan"
                className="w-full p-2.5 border-2 border-gray-200 rounded-xl focus:ring-0 focus:border-gray-400 text-sm bg-white transition-all"
              />
              {cicilanForm.amount && Number(cicilanForm.amount) > 0 && (
                <p className="mt-1.5 text-[10px] font-bold text-emerald-600 italic px-1">
                  Rp {Number(cicilanForm.amount).toLocaleString("id-ID")}
                </p>
              )}
            </div>

            {/* KETERANGAN */}
            <div>
              <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">
                Keterangan (Opsional)
              </label>
              <input
                type="text"
                value={cicilanForm.keterangan}
                onChange={(e) =>
                  setCicilanForm({ ...cicilanForm, keterangan: e.target.value })
                }
                placeholder="Catatan tambahan..."
                maxLength={80}
                className="w-full p-2.5 border-2 border-gray-200 rounded-xl focus:ring-0 focus:border-gray-400 text-sm bg-white transition-all"
              />
            </div>

            {/* SUBMIT BUTTONS */}
            <div className="flex gap-2 pt-1">
              <button
                onClick={() => setCicilanForm({ memberNo: undefined })}
                className="flex-1 py-2.5 px-4 bg-gray-100 text-gray-600 rounded-xl font-semibold text-sm hover:bg-gray-200 transition-all"
              >
                Batal
              </button>
              <button
                onClick={handleCicilanSubmit}
                disabled={!isFormReady}
                className={`flex-1 py-2.5 px-4 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
                  isFormReady
                    ? "bg-gray-800 hover:bg-gray-900 text-white shadow-md active:scale-[0.98]"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                <LucideIcon name="Check" size={16} />
                Simpan Cicilan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════ OVERVIEW CARD ══════ */}
      {allCicilanEntries.length > 0 && (
        <div className="bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 rounded-2xl p-4 border border-orange-200 relative overflow-hidden">
          <div className="absolute top-2 right-3 w-16 h-16 bg-orange-200/20 rounded-full blur-xl" />
          <div className="relative z-10">
            <h3 className="text-xs font-bold text-orange-700 uppercase tracking-wider mb-3 flex items-center gap-2">
              <LucideIcon name="Banknote" size={14} className="text-orange-500" />
              Ringkasan Cicilan
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-3 border border-orange-100">
                <div className="text-[10px] text-orange-600 font-semibold mb-0.5">Total Terkumpul</div>
                <div className="text-base font-bold text-orange-800">
                  Rp {totalCicilanAmount.toLocaleString("id-ID")}
                </div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-3 border border-orange-100">
                <div className="text-[10px] text-orange-600 font-semibold mb-0.5">Total Pembayaran</div>
                <div className="text-base font-bold text-orange-800">
                  {totalCicilanCount}x
                  <span className="text-xs font-medium text-orange-500 ml-1">
                    dari {allCicilanEntries.length} item
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

     

      {/* ══════ RIWAYAT CICILAN — REFORMED ══════ */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-4 pt-4 pb-2">
          <h3 className="font-semibold text-gray-800 text-sm flex items-center gap-2">
            <LucideIcon name="History" size={16} className="text-gray-500" />
            Riwayat Cicilan
            {allCicilanEntries.length > 0 && (
              <span className="ml-auto bg-orange-100 text-orange-600 text-[10px] font-bold px-2 py-0.5 rounded-full">
                {allCicilanEntries.length} item
              </span>
            )}
          </h3>
        </div>

        {/* Search & Type Filter */}
        {allCicilanEntries.length > 0 && (
          <div className="px-4 pb-2 space-y-2">
            {/* Type filter chips */}
            <div className="flex gap-1.5">
              {["semua", "kas", "iuran"].map((t) => (
                <button
                  key={t}
                  onClick={() => setFilterCicilanType(t)}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${
                    filterCicilanType === t
                      ? t === "kas"
                        ? "bg-blue-500 text-white shadow-sm"
                        : t === "iuran"
                          ? "bg-purple-500 text-white shadow-sm"
                          : "bg-gray-700 text-white shadow-sm"
                      : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                  }`}
                >
                  {t === "semua" ? "Semua" : t === "kas" ? "Kas" : "Iuran"}
                </button>
              ))}
            </div>
            {/* Search input */}
            {allCicilanEntries.length > 3 && (
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                  <LucideIcon name="Search" size={14} />
                </div>
                <input
                  type="text"
                  placeholder="Cari nama siswa..."
                  value={searchCicilan}
                  onChange={(e) => setSearchCicilan(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-orange-400 focus:bg-white transition-all outline-none placeholder-gray-400"
                />
              </div>
            )}
          </div>
        )}

        <div className="px-4 pb-4">
          {allCicilanEntries.length === 0 ? (
            <div className="text-center py-10">
              <div className="w-14 h-14 mx-auto mb-3 bg-gray-100 rounded-2xl flex items-center justify-center">
                <LucideIcon name="Banknote" size={28} className="text-gray-300" />
              </div>
              <p className="text-sm font-semibold text-gray-500">
                Belum ada cicilan
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Tambah cicilan pertama untuk memulai
              </p>
            </div>
          ) : (
            <div className="space-y-2.5 max-h-[400px] overflow-y-auto pr-0.5 ct-scroll">
              {allCicilanEntries
                .filter(([key]) => {
                  // Type filter
                  if (filterCicilanType !== "semua") {
                    const keyType = key.split("-")[0];
                    if (keyType !== filterCicilanType) return false;
                  }
                  // Search filter
                  if (!searchCicilan) return true;
                  const memberNo = Number.parseInt(key.split("-").pop());
                  const member = members.find((m) => m.no === memberNo);
                  return member?.nama?.toLowerCase().includes(searchCicilan.toLowerCase());
                })
                .map(([key, cicilanList]) => {
                  const [type, ...rest] = key.split("-");
                  const memberNo = Number.parseInt(rest[rest.length - 1]);
                  const member = members.find((m) => m.no === memberNo);

                  const firstCicilan = cicilanList[0];
                  const itemName = firstCicilan?.itemName || "Item tidak diketahui";
                  const totalCicilan = cicilanList.reduce(
                    (sum, c) => sum + c.amount,
                    0,
                  );

                  const isExpanded = expandedKey === key;
                  const isKas = type === "kas";

                  return (
                    <div
                      key={key}
                      className={`rounded-xl overflow-hidden border transition-all ${
                        isExpanded
                          ? "border-orange-300 shadow-md shadow-orange-100"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      {/* Clickable Header */}
                      <button
                        onClick={() => setExpandedKey(isExpanded ? null : key)}
                        className="w-full text-left p-3 flex items-center gap-3 bg-white hover:bg-gray-50/50 transition-colors"
                      >
                        {/* Type badge */}
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                          isKas
                            ? "bg-blue-100 text-blue-600"
                            : "bg-purple-100 text-purple-600"
                        }`}>
                          <LucideIcon name={isKas ? "Wallet" : "ClipboardList"} size={16} />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                              member?.jk === "L" ? "bg-blue-400" : "bg-pink-400"
                            }`} />
                            <span className="font-semibold text-[13px] text-gray-800 truncate">
                              {firstCicilan?.memberName || member?.nama || "Unknown"}
                            </span>
                          </div>
                          <div className="text-[11px] text-gray-400 mt-0.5 truncate">{itemName}</div>
                        </div>

                        <div className="text-right flex-shrink-0">
                          <div className="text-xs font-bold text-gray-800">
                            Rp {totalCicilan.toLocaleString("id-ID")}
                          </div>
                          <div className="text-[10px] text-gray-400">
                            {cicilanList.length}x bayar
                          </div>
                        </div>

                        <div className={`ml-1 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}>
                          <LucideIcon name="ChevronDown" size={14} className="text-gray-400" />
                        </div>
                      </button>

                      {/* Expanded Detail */}
                      {isExpanded && (
                        <div className="border-t border-gray-100 bg-gray-50/50 px-3 pb-3 pt-2 space-y-1.5 animate-fade-in-up">
                          {cicilanList.map((c, idx) => (
                            <div
                              key={c.id}
                              className="bg-white border border-gray-100 rounded-lg px-3 py-2 flex items-center gap-2"
                            >
                              <div className="w-5 h-5 bg-orange-100 rounded-md flex items-center justify-center flex-shrink-0">
                                <span className="text-[9px] font-black text-orange-600">
                                  {idx + 1}
                                </span>
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="text-[11px] font-medium text-gray-700">
                                  {c.date} {c.time && <span className="text-gray-400">• {c.time}</span>}
                                </div>
                                {c.keterangan && (
                                  <div className="text-[10px] text-gray-400 italic truncate">
                                    "{c.keterangan}"
                                  </div>
                                )}
                              </div>
                              <div className="font-bold text-green-600 text-xs flex-shrink-0">
                                +Rp {c.amount.toLocaleString("id-ID")}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

export default CicilanTab;
