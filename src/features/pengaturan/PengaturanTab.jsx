import React from "react";
import { LucideIcon } from "../../components/ui/index.js";

const PengaturanTab = ({
  appConfig,
  setAppConfig,
  members,
  setMembers,
  currentWeek,
  disabledWeeks,
  setDisabledWeeks,
  KAS_MINGGUAN_AMOUNT,
  showToast,
  logActivity,
  setTransactions,
  setGlobalActivities,
  setKasMingguan,
  setPayments,
  setCicilan,
  setConfirmModal,
  handleBackupData,
  handleRestoreData,
  handleDeleteAllData,
  generatePDFReport,
  soundEnabled,
  setSoundEnabled,
}) => {
  // ─── Local State ───
  const [showAddMember, setShowAddMember] = React.useState(false);
  const [newMemberName, setNewMemberName] = React.useState("");
  const [newMemberJk, setNewMemberJk] = React.useState("L");
  const [memberSearch, setMemberSearch] = React.useState("");
  const [editingMember, setEditingMember] = React.useState(null); // { no, nama }
  const [editName, setEditName] = React.useState("");

  React.useEffect(() => {
    const id = 'pengaturan-tab-styles';
    if (!document.getElementById(id)) {
      const style = document.createElement('style');
      style.id = id;
      style.textContent = `.pengaturan-scroll::-webkit-scrollbar { width: 3px; } .pengaturan-scroll::-webkit-scrollbar-track { background: transparent; } .pengaturan-scroll::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 99px; }`;
      document.head.appendChild(style);
    }
  }, []);

  /* ─── Normalized input class ─── */
  const inputBase =
    "w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-700 placeholder-gray-400 focus:ring-0 focus:border-indigo-500 transition-all text-sm";

  /* ─── Member stats ─── */
  const activeMembersAll = members.filter((m) => m.no !== 0);
  const countL = activeMembersAll.filter((m) => m.jk === "L").length;
  const countP = activeMembersAll.filter((m) => m.jk === "P").length;

  /* ─── Filtered members ─── */
  const filteredMembers = activeMembersAll.filter((m) =>
    m.nama.toLowerCase().includes(memberSearch.toLowerCase())
  );

  /* ─── Add member handler ─── */
  const handleAddMember = () => {
    if (!newMemberName.trim()) return;
    const nextNo =
      members.length > 0 ? members.reduce((max, m) => Math.max(max, m.no), 0) + 1 : 1;
    const newMember = {
      no: nextNo,
      nama: newMemberName.trim().toUpperCase(),
      jk: newMemberJk,
    };
    setMembers([...members, newMember]);
    showToast(`${newMember.nama} ditambahkan!`, "success");
    logActivity("manage_member", `Tambah Anggota: ${newMember.nama}`);
    setNewMemberName("");
    setNewMemberJk("L");
    setShowAddMember(false);
  };

  /* ─── Edit member handler ─── */
  const handleEditMember = (memberNo) => {
    if (!editName.trim()) return;
    const updatedName = editName.trim().toUpperCase();
    const oldMember = members.find((m) => m.no === memberNo);

    setMembers(
      members.map((m) =>
        m.no === memberNo ? { ...m, nama: updatedName } : m
      )
    );

    // Cascade update transactions
    setTransactions((prev) =>
      prev.map((t) =>
        Number(t.member) === Number(memberNo)
          ? { ...t, memberName: updatedName }
          : t
      )
    );

    // Cascade update activity logs
    setGlobalActivities((prev) =>
      prev.map((log) =>
        log.memberNo === memberNo
          ? { ...log, memberName: updatedName }
          : log
      )
    );

    // Cascade update cicilan entries
    setCicilan((prev) => {
      const next = {};
      Object.entries(prev).forEach(([key, list]) => {
        next[key] = list.map((c) =>
          c.memberNo === memberNo ? { ...c, memberName: updatedName } : c
        );
      });
      return next;
    });

    showToast("Nama & riwayat diperbarui", "success");
    logActivity(
      "manage_member",
      `Edit Nama: ${oldMember?.nama} → ${updatedName}`
    );
    setEditingMember(null);
    setEditName("");
  };

  return (
    <div className="space-y-4 tab-content animate-fade-in-up pb-20">
      {/* ══════ IDENTITAS KELAS ══════ */}
      <div className="bg-white rounded-2xl shadow-sm p-5 border border-gray-100">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center">
            <LucideIcon name="GraduationCap" size={20} />
          </div>
          <div>
            <h2 className="text-base font-bold text-gray-800">
              Identitas Kelas
            </h2>
            <p className="text-[11px] text-gray-500">
              Tampil di header, PDF, dan export
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
              Nama Aplikasi
            </label>
            <input
              type="text"
              value={appConfig.appTitle}
              onChange={(e) =>
                setAppConfig((prev) => ({ ...prev, appTitle: e.target.value }))
              }
              placeholder="Dompet Explosives"
              className={inputBase}
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
              Nama Kelas
            </label>
            <input
              type="text"
              value={appConfig.className}
              onChange={(e) =>
                setAppConfig((prev) => ({
                  ...prev,
                  className: e.target.value,
                }))
              }
              placeholder="XII-F5"
              className={inputBase}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                Wali Kelas
                <span className="text-gray-300 font-normal normal-case ml-1">(Opsional)</span>
              </label>
              <input
                type="text"
                value={appConfig.waliKelas}
                onChange={(e) =>
                  setAppConfig((prev) => ({
                    ...prev,
                    waliKelas: e.target.value,
                  }))
                }
                placeholder="Nama Wali"
                className={inputBase}
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                Bendahara
              </label>
              <input
                type="text"
                value={appConfig.bendahara}
                onChange={(e) =>
                  setAppConfig((prev) => ({
                    ...prev,
                    bendahara: e.target.value,
                  }))
                }
                placeholder="Nama Bendahara"
                className={inputBase}
              />
            </div>
          </div>
          <p className="text-[10px] text-gray-400 italic">
            Wali Kelas & Bendahara tampil di tanda tangan laporan PDF
          </p>
        </div>
      </div>

      {/* ══════ KONFIGURASI KAS ══════ */}
      <div className="bg-white rounded-2xl shadow-sm p-5 border border-gray-100">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
            <LucideIcon name="Settings" size={20} />
          </div>
          <div>
            <h2 className="text-base font-bold text-gray-800">
              Konfigurasi Kas
            </h2>
            <p className="text-[11px] text-gray-500">
              Parameter dasar kas kelas
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
              Nominal Kas Mingguan
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">
                Rp
              </span>
              <input
                type="number"
                inputMode="numeric"
                value={appConfig.kasAmount}
                onChange={(e) =>
                  setAppConfig((prev) => ({
                    ...prev,
                    kasAmount: e.target.value === "" ? "" : Number.parseInt(e.target.value),
                  }))
                }
                className={`${inputBase} pl-10`}
              />
            </div>
            {appConfig.kasAmount > 0 && (
              <p className="mt-1 text-[10px] text-gray-400 italic px-1">
                Rp {appConfig.kasAmount.toLocaleString("id-ID")} × {activeMembersAll.length} siswa = Rp {(appConfig.kasAmount * activeMembersAll.length).toLocaleString("id-ID")}/minggu
              </p>
            )}
          </div>

          <div>
            <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
              Tanggal Mulai Proyek
            </label>
            <input
              type="date"
              value={appConfig.startDate}
              onChange={(e) =>
                setAppConfig((prev) => ({
                  ...prev,
                  startDate: e.target.value,
                }))
              }
              className={inputBase}
            />
            <p className="text-[10px] text-orange-500 mt-1.5 flex items-center gap-1 px-1">
              <LucideIcon name="AlertTriangle" size={10} />
              Mengubah tanggal akan mereset perhitungan minggu berjalan
            </p>
          </div>
        </div>
      </div>

      {/* ══════ EFEK SUARA ══════ */}
      <div className="bg-white rounded-2xl shadow-sm p-5 border border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center">
              <LucideIcon name={soundEnabled ? "Volume2" : "VolumeX"} size={20} />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-800">Efek Suara</h2>
              <p className="text-[11px] text-gray-500">
                {soundEnabled ? "Ding saat lunas, coin saat cicilan" : "Efek suara dimatikan"}
              </p>
            </div>
          </div>
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            role="switch"
            aria-checked={soundEnabled}
            className={`relative w-14 h-7 rounded-full transition-all duration-300 ${
              soundEnabled ? "bg-amber-500" : "bg-gray-300"
            }`}
          >
            <div
              className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow-md transition-transform duration-300 ${
                soundEnabled ? "translate-x-7" : "translate-x-0.5"
              }`}
            />
          </button>
        </div>
      </div>

      {/* ══════ MANAJEMEN MINGGU LIBUR ══════ */}
      <div className="bg-white rounded-2xl shadow-sm p-5 border border-gray-100">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center">
            <LucideIcon name="CalendarOff" size={20} />
          </div>
          <div>
            <h2 className="text-base font-bold text-gray-800">
              Minggu Libur
            </h2>
            <p className="text-[11px] text-gray-500">
              Nonaktifkan minggu tertentu (Libur/Ujian)
            </p>
          </div>
        </div>

        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
          <div className="flex justify-between items-center mb-3">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              Daftar Minggu ({currentWeek})
            </span>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
              {currentWeek -
                Object.keys(disabledWeeks).filter((k) => disabledWeeks[k])
                  .length}{" "}
              Aktif
            </span>
          </div>

          <div className="grid grid-cols-5 gap-2 max-h-40 overflow-y-auto pr-1 pengaturan-scroll">
            {Array.from({ length: currentWeek }, (_, i) => i + 1).map(
              (week) => {
                const isDisabled = disabledWeeks[week];
                return (
                  <button
                    key={week}
                    aria-pressed={!!isDisabled}
                    onClick={() => {
                      setDisabledWeeks((prev) => {
                        const newState = { ...prev, [week]: !prev[week] };
                        const totalSiswa = members.filter(
                          (m) => m.no !== 0
                        ).length;
                        const diffTarget = totalSiswa * KAS_MINGGUAN_AMOUNT;

                        if (!prev[week]) {
                          showToast(
                            `Minggu ${week} dinonaktifkan (Target -Rp ${diffTarget.toLocaleString()})`,
                            "success"
                          );
                          logActivity(
                            "disable_week",
                            `Minggu ${week} dinonaktifkan (Libur)`
                          );
                        } else {
                          showToast(
                            `Minggu ${week} diaktifkan kembali`,
                            "success"
                          );
                          logActivity(
                            "enable_week",
                            `Minggu ${week} diaktifkan kembali`
                          );
                        }
                        return newState;
                      });
                    }}
                    className={`flex flex-col items-center justify-center p-2 rounded-lg transition-all duration-200 border ${
                      isDisabled
                        ? "bg-slate-200 border-slate-300 text-slate-400 grayscale"
                        : "bg-white border-emerald-200 text-emerald-700 shadow-sm hover:border-emerald-400 hover:shadow-md"
                    }`}
                  >
                    <span className="text-[10px] font-black uppercase">
                      M{week}
                    </span>
                    <LucideIcon
                      name={isDisabled ? "XCircle" : "CheckCircle2"}
                      size={12}
                      className="mt-1"
                    />
                  </button>
                );
              }
            )}
          </div>
          <p className="text-[10px] text-slate-400 mt-3 text-center italic">
            Minggu nonaktif tidak dihitung dalam target saldo & tunggakan
          </p>
        </div>
      </div>

      {/* ══════ DATA ANGGOTA ══════ */}
      <div className="bg-white rounded-2xl shadow-sm p-5 border border-gray-100">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-violet-100 text-violet-600 rounded-xl flex items-center justify-center">
              <LucideIcon name="Users" size={20} />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-800">
                Data Anggota
              </h2>
              <p className="text-[11px] text-gray-500">
                {activeMembersAll.length} Siswa
                <span className="text-blue-500 ml-1">({countL} L</span>
                <span className="text-gray-400"> · </span>
                <span className="text-pink-500">{countP} P)</span>
              </p>
            </div>
          </div>
          {!showAddMember && (
            <button
              onClick={() => setShowAddMember(true)}
              className="bg-gray-800 hover:bg-gray-900 text-white px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 active:scale-[0.97]"
            >
              <LucideIcon name="Plus" size={14} />
              Tambah
            </button>
          )}
        </div>

        {/* ─── Inline Add Member Form ─── */}
        {showAddMember && (
          <div className="bg-gray-50 rounded-xl p-3 border border-gray-200 mb-3 animate-scale-in">
            <div className="flex gap-2 items-end">
              <div className="flex-1 min-w-0">
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                  Nama
                </label>
                <input
                  type="text"
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                  placeholder="Nama lengkap..."
                  className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg text-sm text-gray-700 placeholder-gray-400 focus:ring-0 focus:border-indigo-500 transition-all"
                  onKeyDown={(e) => e.key === "Enter" && handleAddMember()}
                  autoFocus
                />
              </div>
              <div className="flex-shrink-0">
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                  JK
                </label>
                <div className="flex gap-1">
                  {["L", "P"].map((jk) => (
                    <button
                      key={jk}
                      onClick={() => setNewMemberJk(jk)}
                      className={`px-3 py-2 rounded-lg text-xs font-bold transition-all border ${
                        newMemberJk === jk
                          ? jk === "L"
                            ? "bg-blue-500 text-white border-blue-500"
                            : "bg-pink-500 text-white border-pink-500"
                          : "bg-white text-gray-400 border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      {jk}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-2 mt-2.5">
              <button
                onClick={() => {
                  setShowAddMember(false);
                  setNewMemberName("");
                }}
                className="flex-1 py-2 bg-white text-gray-500 rounded-lg text-xs font-semibold border border-gray-200 hover:bg-gray-100 transition-all"
              >
                Batal
              </button>
              <button
                onClick={handleAddMember}
                disabled={!newMemberName.trim()}
                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  newMemberName.trim()
                    ? "bg-gray-800 hover:bg-gray-900 text-white shadow-sm active:scale-[0.97]"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                <LucideIcon name="Check" size={14} />
                Tambah
              </button>
            </div>
          </div>
        )}

        {/* ─── Search Bar ─── */}
        {activeMembersAll.length > 5 && (
          <div className="relative mb-3">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
              <LucideIcon name="Search" size={14} />
            </div>
            <input
              type="text"
              placeholder="Cari nama siswa..."
              value={memberSearch}
              onChange={(e) => setMemberSearch(e.target.value)}
              className="w-full pl-9 pr-9 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-400 focus:bg-white transition-all outline-none placeholder-gray-400"
            />
            {memberSearch && (
              <button
                onClick={() => setMemberSearch("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
              >
                <LucideIcon name="X" size={12} />
              </button>
            )}
          </div>
        )}

        {/* ─── Member List ─── */}
        <div className="space-y-1.5 max-h-[400px] overflow-y-auto pengaturan-scroll pr-0.5">
          {filteredMembers.length === 0 ? (
            <div className="text-center py-6">
              <div className="text-xl mb-1">🔍</div>
              <p className="text-xs text-gray-400">
                {memberSearch ? "Tidak ditemukan" : "Belum ada anggota"}
              </p>
            </div>
          ) : (
            filteredMembers.map((member) => (
              <div
                key={member.no}
                className="group flex items-center justify-between p-2.5 bg-gray-50 hover:bg-white border border-gray-100 hover:border-indigo-200 rounded-xl transition-all duration-200"
              >
                <div className="flex items-center gap-2.5 overflow-hidden flex-1 min-w-0">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-black flex-shrink-0 ${
                      member.jk === "L"
                        ? "bg-blue-100 text-blue-600"
                        : "bg-pink-100 text-pink-600"
                    }`}
                  >
                    {member.no}
                  </div>

                  {editingMember?.no === member.no ? (
                    /* ─── Inline Edit Mode ─── */
                    <div className="flex items-center gap-1.5 flex-1 min-w-0">
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleEditMember(member.no);
                          if (e.key === "Escape") {
                            setEditingMember(null);
                            setEditName("");
                          }
                        }}
                        className="flex-1 min-w-0 px-2 py-1 border-2 border-indigo-400 rounded-lg text-xs font-semibold text-gray-800 focus:ring-0 outline-none"
                        autoFocus
                      />
                      <button
                        onClick={() => handleEditMember(member.no)}
                        className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-all flex-shrink-0"
                      >
                        <LucideIcon name="Check" size={14} />
                      </button>
                      <button
                        onClick={() => {
                          setEditingMember(null);
                          setEditName("");
                        }}
                        className="p-1.5 text-gray-400 hover:bg-gray-100 rounded-lg transition-all flex-shrink-0"
                      >
                        <LucideIcon name="X" size={14} />
                      </button>
                    </div>
                  ) : (
                    /* ─── Normal Mode ─── */
                    <div className="min-w-0 flex-1">
                      <div className="font-semibold text-gray-800 text-[13px] truncate">
                        {member.nama}
                      </div>
                      <span
                        className={`text-[10px] font-medium ${
                          member.jk === "L" ? "text-blue-400" : "text-pink-400"
                        }`}
                      >
                        {member.jk === "L" ? "Laki-laki" : "Perempuan"}
                      </span>
                    </div>
                  )}
                </div>

                {/* ─── Action Buttons ─── */}
                {editingMember?.no !== member.no && (
                  <div className="flex gap-0.5 flex-shrink-0 opacity-100 sm:opacity-70 sm:hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => {
                        const newJk = member.jk === "L" ? "P" : "L";
                        setMembers(
                          members.map((m) =>
                            m.no === member.no ? { ...m, jk: newJk } : m
                          )
                        );
                        showToast(
                          `${member.nama} → ${newJk === "L" ? "Laki-laki" : "Perempuan"}`,
                          "success"
                        );
                      }}
                      className={`p-1.5 rounded-lg transition-colors ${
                        member.jk === "L"
                          ? "text-blue-400 hover:text-pink-500 hover:bg-pink-50"
                          : "text-pink-400 hover:text-blue-500 hover:bg-blue-50"
                      }`}
                      title={`Ganti ke ${member.jk === "L" ? "Perempuan" : "Laki-laki"}`}
                    >
                      <LucideIcon name="ArrowLeftRight" size={14} />
                    </button>
                    <button
                      onClick={() => {
                        setEditingMember(member);
                        setEditName(member.nama);
                      }}
                      className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit Nama"
                    >
                      <LucideIcon name="Edit2" size={14} />
                    </button>
                    <button
                      onClick={() => {
                        setConfirmModal({
                          title: "Hapus Anggota?",
                          message: `Menghapus ${member.nama} akan menghapus semua data pembayaran (kas/iuran/cicilan) terkait.\n\nAksi ini tidak bisa dibatalkan.`,
                          icon: "🗑️",
                          type: "danger",
                          confirmText: "Ya, Hapus",
                          cancelText: "Batal",
                          onConfirm: () => {
                            const memberNo = member.no;

                            setMembers(
                              members.filter((m) => m.no !== memberNo)
                            );

                            setKasMingguan((prev) => {
                              const next = { ...prev };
                              Object.keys(next).forEach((key) => {
                                if (key.endsWith(`-${memberNo}`))
                                  delete next[key];
                              });
                              return next;
                            });

                            setPayments((prev) => {
                              const next = { ...prev };
                              Object.keys(next).forEach((key) => {
                                if (key.endsWith(`-${memberNo}`))
                                  delete next[key];
                              });
                              return next;
                            });

                            setCicilan((prev) => {
                              const next = { ...prev };
                              Object.keys(next).forEach((key) => {
                                if (key.endsWith(`-${memberNo}`))
                                  delete next[key];
                              });
                              return next;
                            });

                            showToast(
                              "Anggota & data terkait dihapus",
                              "success"
                            );
                            logActivity(
                              "manage_member",
                              `Hapus Anggota: ${member.nama}`
                            );
                          },
                        });
                      }}
                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Hapus Anggota"
                    >
                      <LucideIcon name="Trash2" size={14} />
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* ══════ KEAMANAN PIN ══════ */}
      <div className="bg-white rounded-2xl shadow-sm p-5 border border-gray-100">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-slate-100 text-slate-600 rounded-xl flex items-center justify-center">
            <LucideIcon name="ShieldCheck" size={20} />
          </div>
          <div>
            <h2 className="text-base font-bold text-gray-800">
              Keamanan PIN
            </h2>
            <p className="text-[11px] text-gray-500">
              Kunci aplikasi dengan 4 digit angka
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="password"
            maxLength="4"
            inputMode="numeric"
            placeholder="••••"
            value={appConfig.pin}
            onChange={(e) => {
              const val = e.target.value.replace(/[^0-9]/g, "");
              setAppConfig((prev) => ({ ...prev, pin: val }));
            }}
            className={`${inputBase} flex-1 text-center tracking-[0.5em] font-bold`}
          />
          <button
            onClick={() => {
              if (appConfig.pin.length === 4 || appConfig.pin === "") {
                // Read from appConfig state (not localStorage) to avoid stale data
                const newConfig = { ...appConfig };
                localStorage.setItem(
                  "kasKelas_config",
                  JSON.stringify(newConfig)
                );

                showToast(
                  appConfig.pin
                    ? "PIN Diaktifkan! Mengunci..."
                    : "PIN Dinonaktifkan",
                  "success"
                );

                if (appConfig.pin.length === 4) {
                  setTimeout(() => window.location.reload(), 1500);
                }
              } else {
                showToast("PIN harus 4 digit!", "error");
              }
            }}
            className="px-5 py-3 bg-gray-800 hover:bg-gray-900 text-white rounded-xl text-sm font-bold transition-all active:scale-[0.97]"
          >
            Simpan
          </button>
        </div>
        <p className="text-[10px] text-gray-400 mt-2 italic px-1">
          Kosongkan dan simpan untuk menonaktifkan PIN
        </p>
      </div>

      {/* ══════ CETAK LAPORAN ══════ */}
      <div className="bg-white rounded-2xl shadow-sm p-5 border border-gray-100">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-red-100 text-red-600 rounded-xl flex items-center justify-center">
            <LucideIcon name="FileText" size={20} />
          </div>
          <div>
            <h2 className="text-base font-bold text-gray-800">
              Cetak Laporan
            </h2>
            <p className="text-[11px] text-gray-500">
              Generate laporan PDF resmi
            </p>
          </div>
        </div>
        <button
          onClick={generatePDFReport}
          className="w-full py-3 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white rounded-xl font-semibold shadow-md transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
        >
          <LucideIcon name="Download" size={18} />
          Cetak Laporan PDF
        </button>
        <p className="text-[10px] text-gray-400 mt-2 italic px-1">
          Berisi rekap kas mingguan, iuran, transaksi, dan tanda tangan
        </p>
      </div>

      {/* ══════ MANAJEMEN DATA ══════ */}
      <div className="bg-white rounded-2xl shadow-sm p-5 border border-gray-100">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center">
            <LucideIcon name="Database" size={20} />
          </div>
          <div>
            <h2 className="text-base font-bold text-gray-800">
              Manajemen Data
            </h2>
            <p className="text-[11px] text-gray-500">
              Backup, restore, dan reset
            </p>
          </div>
        </div>

        <div className="space-y-2.5">
          <button
            onClick={handleBackupData}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold shadow-md transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
          >
            <LucideIcon name="Download" size={18} />
            Backup Data (Export JSON)
          </button>

          <label className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]">
            <LucideIcon name="Upload" size={18} />
            Restore Data (Import JSON)
            <input
              type="file"
              accept=".json"
              onChange={handleRestoreData}
              className="hidden"
            />
          </label>

          {/* Zona Bahaya */}
          <div className="pt-3 mt-1 border-t border-gray-100">
            <h3 className="text-[10px] font-bold text-red-500 uppercase tracking-wider mb-2 flex items-center gap-1">
              <LucideIcon name="AlertTriangle" size={10} />
              Zona Bahaya
            </h3>
            <button
              onClick={handleDeleteAllData}
              className="w-full bg-red-50 text-red-600 hover:bg-red-600 hover:text-white py-2.5 rounded-xl text-sm font-bold transition-all border border-red-200"
            >
              Reset Semua Data Aplikasi
            </button>
          </div>
        </div>

        {/* Warning box */}
        <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-700 leading-relaxed">
          <div className="font-bold flex items-center gap-1.5 mb-1">
            <LucideIcon name="AlertCircle" size={12} />
            PENTING
          </div>
          Backup data secara berkala! Data tersimpan di browser ini saja. Jika
          browser di-clear atau ganti device, data hilang.
        </div>
      </div>

    </div>
  );
};

export default PengaturanTab;
