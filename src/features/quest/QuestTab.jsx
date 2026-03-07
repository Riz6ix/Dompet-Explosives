/**
 * QuestTab.jsx
 * RPG "Quest & Rank" tab for KasKelas
 * Fantasy RPG meets finance app — gacha-style character screen
 * Round 2: better animations, no blink, cozy XP effects
 */

import React from "react";
import { LucideIcon } from "../../components/ui/index.js";

// ============================================================
// RANK TIERS DATA — exported so App.jsx can import too
// ============================================================
export const RANK_TIERS = [
  {
    rank: 1,
    title: "Warga Biasa",
    icon: "User",
    xpRequired: 0,
    color: "from-slate-400 to-slate-500",
    textColor: "text-slate-100",
  },
  {
    rank: 2,
    title: "Prajurit Kas",
    icon: "Sword",
    xpRequired: 100,
    color: "from-blue-500 to-blue-600",
    textColor: "text-blue-100",
  },
  {
    rank: 3,
    title: "Ksatria Emas",
    icon: "Shield",
    xpRequired: 300,
    color: "from-emerald-500 to-emerald-600",
    textColor: "text-emerald-100",
  },
  {
    rank: 4,
    title: "Bendahara Agung",
    icon: "Crown",
    xpRequired: 600,
    color: "from-purple-500 to-purple-700",
    textColor: "text-purple-100",
  },
  {
    rank: 5,
    title: "Raja Keuangan",
    icon: "Sparkles",
    xpRequired: 1000,
    color: "from-amber-400 to-amber-600",
    textColor: "text-amber-100",
  },
  {
    rank: 6,
    title: "Legenda Sigma",
    icon: "Flame",
    xpRequired: 1500,
    color: "from-yellow-400 via-rose-500 to-purple-600",
    textColor: "text-yellow-50",
  },
];

// ============================================================
// RANK BORDER EFFECT — per tier (toned down, less eye-strain)
// ============================================================
const getRankBorderEffect = (rank) => {
  switch (rank) {
    case 1:
      return { className: "border border-slate-300", style: {} };
    case 2:
      return {
        className: "border-2 border-blue-400",
        style: { boxShadow: "0 0 12px rgba(59,130,246,0.35)" },
      };
    case 3:
      return {
        className: "border-2 border-emerald-400 rank-glow-green",
        style: { boxShadow: "0 0 14px rgba(16,185,129,0.4)" },
      };
    case 4:
      return {
        className: "border-2 border-purple-400 rank-pulse-purple",
        style: { boxShadow: "0 0 16px rgba(168,85,247,0.45)" },
      };
    case 5:
      return {
        className: "border-2 border-amber-400 rank-shimmer-gold",
        style: {},
      };
    case 6:
      return {
        className: "border-2 rank-rainbow",
        style: {},
      };
    default:
      return { className: "border border-gray-200", style: {} };
  }
};

// ============================================================
// RARITY CONFIG
// ============================================================
const RARITY_CONFIG = {
  common: {
    label: "Common",
    bg: "bg-slate-100",
    text: "text-slate-700",
    border: "border-slate-300",
    iconBg: "bg-slate-200",
    starColor: "#94a3b8",
  },
  rare: {
    label: "Rare",
    bg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-300",
    iconBg: "bg-blue-100",
    starColor: "#2563eb",
  },
  epic: {
    label: "Epic",
    bg: "bg-purple-50",
    text: "text-purple-700",
    border: "border-purple-300",
    iconBg: "bg-purple-100",
    starColor: "#7c3aed",
  },
  legendary: {
    label: "Legendary",
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-300",
    iconBg: "bg-amber-100",
    starColor: "#d97706",
  },
};

// ============================================================
// QUEST TAB COMPONENT
// ============================================================
const QuestTab = ({
  rpgData,
  currentRank,
  xpProgress,
  dailyQuests,
  weeklyQuests,
  achievements,
  claimQuest,
  totalXP,
}) => {
  // ── Safe defaults ──
  const safeRpgData = rpgData || {
    totalXP: 0,
    completedQuests: 0,
    achievements: 0,
    streakDays: 0,
  };

  const safeRank = currentRank || RANK_TIERS[0];
  const safeXpProgress = xpProgress ?? 0;
  const safeDailyQuests = dailyQuests || [];
  const safeWeeklyQuests = weeklyQuests || [];
  const safeAchievements = achievements || [];
  const safeTotalXP = totalXP ?? safeRpgData.totalXP ?? 0;

  // ── Local state ──
  const [achievementFilter, setAchievementFilter] = React.useState("semua");
  // XP float animation state
  const [xpFloats, setXpFloats] = React.useState([]);

  // Streak
  const streakDays = safeRpgData.streakDays || 0;

  // XP to next rank
  const nextRankObj =
    safeRank.nextRank ||
    RANK_TIERS.find((r) => r.rank === (safeRank.rank || 1) + 1) ||
    null;
  const nextRankTitle = nextRankObj?.title || "Rank Tertinggi";
  const nextRankXP = nextRankObj?.xpRequired ?? null;
  const xpToNext = nextRankXP != null ? Math.max(0, nextRankXP - safeTotalXP) : null;

  // Border effect for current rank
  const borderEffect = getRankBorderEffect(safeRank.rank || 1);

  // Achievement stats
  const completedAchievements = safeAchievements.filter((a) => a.completed);
  const lockedAchievements = safeAchievements.filter((a) => !a.completed);

  // Filtered achievements
  const filteredAchievements =
    achievementFilter === "completed"
      ? completedAchievements
      : achievementFilter === "locked"
        ? lockedAchievements
        : safeAchievements;

  // Quest summary
  const totalDailyDone = safeDailyQuests.filter((q) => q.completed).length;
  const totalWeeklyDone = safeWeeklyQuests.filter((q) => q.completed).length;
  const totalClaimable = [...safeDailyQuests, ...safeWeeklyQuests].filter(
    (q) => q.claimable
  ).length;

  // ── Inject CSS keyframes once on mount ──
  React.useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes rainbow-border {
          0%   { border-color: #f59e0b; box-shadow: 0 0 14px #f59e0b66; }
          16%  { border-color: #ef4444; box-shadow: 0 0 14px #ef444466; }
          33%  { border-color: #8b5cf6; box-shadow: 0 0 14px #8b5cf666; }
          50%  { border-color: #3b82f6; box-shadow: 0 0 14px #3b82f666; }
          66%  { border-color: #10b981; box-shadow: 0 0 14px #10b98166; }
          83%  { border-color: #f59e0b; box-shadow: 0 0 14px #f59e0b66; }
          100% { border-color: #f59e0b; box-shadow: 0 0 14px #f59e0b66; }
        }
        @keyframes xp-fill {
          from { width: 0%; }
          to   { width: var(--xp-width); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px);  }
          50%       { transform: translateY(-6px); }
        }
        @keyframes glow-green-subtle {
          0%, 100% { box-shadow: 0 0 10px rgba(16,185,129,0.3); }
          50%       { box-shadow: 0 0 18px rgba(16,185,129,0.55); }
        }
        @keyframes gold-shimmer-subtle {
          0%   { box-shadow: 0 0 8px rgba(245,158,11,0.3); border-color: #fbbf24; }
          50%  { box-shadow: 0 0 20px rgba(245,158,11,0.6); border-color: #f59e0b; }
          100% { box-shadow: 0 0 8px rgba(245,158,11,0.3); border-color: #fbbf24; }
        }
        @keyframes purple-pulse-subtle {
          0%, 100% { box-shadow: 0 0 10px rgba(168,85,247,0.3); border-color: #a855f7; }
          50%       { box-shadow: 0 0 22px rgba(168,85,247,0.55); border-color: #c084fc; }
        }
        .rank-glow-green {
          animation: glow-green-subtle 2.5s ease-in-out infinite;
        }
        .rank-pulse-purple {
          animation: purple-pulse-subtle 2.2s ease-in-out infinite;
        }
        .rank-shimmer-gold {
          animation: gold-shimmer-subtle 2.2s ease-in-out infinite;
        }
        .rank-rainbow {
          animation: rainbow-border 4s linear infinite;
        }
        .xp-bar-fill {
          animation: xp-fill 1.2s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        .rank-icon-float {
          animation: float 3.5s ease-in-out infinite;
        }
        .quest-claim-btn {
          background: linear-gradient(135deg, #10b981, #059669);
          box-shadow: 0 0 10px rgba(16,185,129,0.35);
          transition: all 0.2s;
        }
        .quest-claim-btn:hover {
          box-shadow: 0 0 18px rgba(16,185,129,0.6);
          transform: translateY(-1px);
        }
        .quest-claim-btn:active {
          transform: translateY(0) scale(0.97);
        }
        .quest-claim-btn-weekly {
          background: linear-gradient(135deg, #8b5cf6, #7c3aed);
          box-shadow: 0 0 10px rgba(139,92,246,0.35);
          transition: all 0.2s;
        }
        .quest-claim-btn-weekly:hover {
          box-shadow: 0 0 18px rgba(139,92,246,0.6);
          transform: translateY(-1px);
        }
        .quest-claim-btn-weekly:active {
          transform: translateY(0) scale(0.97);
        }
        .shimmer-text {
          background: linear-gradient(
            90deg,
            #fbbf24 0%, #fef3c7 40%,
            #fbbf24 60%, #fef3c7 80%, #fbbf24 100%
          );
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 2.4s linear infinite;
        }
        .legendary-text {
          background: linear-gradient(
            90deg,
            #f59e0b 0%, #ef4444 25%,
            #8b5cf6 50%, #3b82f6 75%, #10b981 100%
          );
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 3s linear infinite;
        }

        /* ── CLAIMABLE GLOW: subtle steady glow, NO BLINK ── */
        .claimable-glow {
          box-shadow: 0 0 12px rgba(16,185,129,0.2), 0 1px 3px rgba(0,0,0,0.08);
          transition: box-shadow 0.3s ease;
        }

        /* ── XP FLOAT ANIMATION ── */
        @keyframes xp-float-up {
          0%   { opacity: 1; transform: translateY(0) scale(1); }
          30%  { opacity: 1; transform: translateY(-20px) scale(1.15); }
          100% { opacity: 0; transform: translateY(-70px) scale(0.8); }
        }
        .xp-float-item {
          animation: xp-float-up 1.6s cubic-bezier(0.22, 1, 0.36, 1) forwards;
          pointer-events: none;
        }

        /* ── CARD APPEAR ANIMATION ── */
        @keyframes card-slide-up {
          0%   { opacity: 0; transform: translateY(12px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .quest-card-appear {
          animation: card-slide-up 0.4s cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        /* ── QUEST ITEM CLAIM RIPPLE ── */
        @keyframes claim-ripple {
          0%   { transform: scale(0.95); background-color: rgba(16,185,129,0.1); }
          50%  { transform: scale(1); background-color: rgba(16,185,129,0.05); }
          100% { transform: scale(1); background-color: transparent; }
        }
        .quest-claimed-ripple {
          animation: claim-ripple 0.5s ease-out;
        }

        /* ── BADGE SPARKLE ── */
        @keyframes badge-sparkle {
          0%, 100% { filter: brightness(1); }
          50% { filter: brightness(1.15); }
        }
        .achievement-unlocked {
          animation: badge-sparkle 3s ease-in-out infinite;
        }

        /* ── STREAK FIRE WIGGLE ── */
        @keyframes fire-wiggle {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-3deg); }
          75% { transform: rotate(3deg); }
        }
        .streak-fire {
          animation: fire-wiggle 2s ease-in-out infinite;
          display: inline-block;
        }
      `;
    document.head.appendChild(style);
    return () => style.remove();
  }, []);

  // ── Claim with XP float ──
  const handleClaimWithAnimation = (questId) => {
      const allQuests = [...safeDailyQuests, ...safeWeeklyQuests];
      const quest = allQuests.find((q) => q.id === questId);
      if (!quest) {
        claimQuest(questId);
        return;
      }
      // Show floating XP
      const floatId = Date.now() + Math.random();
      setXpFloats((prev) => [
        ...prev,
        { id: floatId, xp: quest.xpReward, icon: quest.icon },
      ]);
      // Remove after animation
      setTimeout(() => {
        setXpFloats((prev) => prev.filter((f) => f.id !== floatId));
      }, 1800);
      claimQuest(questId);
  };

  return (
    <div className="space-y-4 tab-content pb-6">
      {/* ── XP FLOAT OVERLAY ── */}
      {xpFloats.length > 0 && (
        <div className="fixed inset-0 z-[99990] pointer-events-none flex items-center justify-center">
          {xpFloats.map((f, index) => (
            <div
              key={f.id}
              className="xp-float-item absolute flex items-center gap-1.5 bg-emerald-500/90 text-white px-4 py-2 rounded-full shadow-lg"
              style={{ top: `${35 + (index * 5)}%` }}
            >
              <LucideIcon name="Zap" size={16} color="white" />
              <span className="text-base font-black">+{f.xp} XP</span>
            </div>
          ))}
        </div>
      )}

      {/* ══════════════════════════════════════════
          1. RANK CARD — HERO SECTION
      ══════════════════════════════════════════ */}
      <div
        className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${safeRank.color || "from-slate-400 to-slate-500"} ${borderEffect.className} quest-card-appear`}
        style={{ ...borderEffect.style, animationDelay: "0.05s" }}
      >
        {/* Background decorative circles */}
        <div className="absolute top-[-30px] right-[-30px] w-40 h-40 rounded-full bg-white/10 pointer-events-none" />
        <div className="absolute bottom-[-20px] left-[-20px] w-28 h-28 rounded-full bg-black/10 pointer-events-none" />

        <div className="relative z-10 p-5">
          {/* Rank badge top-right */}
          <div className="absolute top-4 right-4 bg-black/20 backdrop-blur-sm px-3 py-1 rounded-full">
            <span className="text-white/90 font-black text-sm tracking-widest">
              RANK {safeRank.rank || "?"}
            </span>
          </div>

          {/* Center: icon + title */}
          <div className="flex flex-col items-center pt-2 pb-1">
            {/* Floating rank icon */}
            <div className="rank-icon-float mb-3">
              <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
                <LucideIcon
                  name={safeRank.icon || "User"}
                  size={44}
                  className={safeRank.textColor || "text-white"}
                  color="white"
                />
              </div>
            </div>

            {/* Rank title */}
            <h2
              className={`text-xl font-black tracking-wide mb-0.5 ${
                safeRank.rank === 6
                  ? "legendary-text"
                  : safeRank.rank === 5
                    ? "shimmer-text"
                    : "text-white"
              }`}
            >
              {safeRank.title || "Warga Biasa"}
            </h2>

            {/* Total XP pill */}
            <div className="flex items-center gap-1 bg-black/20 backdrop-blur-sm rounded-full px-3 py-1 mb-4">
              <LucideIcon name="Zap" size={13} color="rgba(255,255,255,0.9)" />
              <span className="text-white/90 text-xs font-bold">
                {safeTotalXP.toLocaleString("id-ID")} XP
              </span>
            </div>

            {/* XP Progress Bar */}
            {nextRankXP != null && (
              <div className="w-full max-w-xs">
                <div className="h-3 bg-black/25 rounded-full overflow-hidden mb-1.5">
                  <div
                    className="h-full rounded-full xp-bar-fill bg-white/80"
                    style={{
                      "--xp-width": `${safeXpProgress}%`,
                      width: `${safeXpProgress}%`,
                    }}
                  />
                </div>
                <p className="text-white/75 text-xs text-center font-medium">
                  {xpToNext != null && xpToNext > 0
                    ? `${xpToNext.toLocaleString("id-ID")} XP lagi menuju ${nextRankTitle}`
                    : safeRank.rank >= 6
                      ? "Rank Tertinggi Dicapai! \ud83c\udfc6"
                      : `${safeXpProgress}% menuju ${nextRankTitle}`}
                </p>
              </div>
            )}

            {/* Stats row */}
            <div className="flex gap-3 sm:gap-6 mt-4 pt-3 border-t border-white/20 w-full justify-center">
              <div className="text-center min-w-0 flex-1">
                <div className="text-white font-black text-base sm:text-lg leading-none">
                  {Array.isArray(safeRpgData.completedQuests)
                    ? safeRpgData.completedQuests.length
                    : safeRpgData.completedQuests || 0}
                </div>
                <div className="text-white/65 text-[10px] sm:text-xs mt-0.5">
                  Misi
                </div>
              </div>
              <div className="w-px bg-white/20 flex-shrink-0" />
              <div className="text-center min-w-0 flex-1">
                <div className="text-white font-black text-base sm:text-lg leading-none">
                  {completedAchievements.length}
                </div>
                <div className="text-white/65 text-[10px] sm:text-xs mt-0.5">
                  Pencapaian
                </div>
              </div>
              <div className="w-px bg-white/20 flex-shrink-0" />
              <div className="text-center min-w-0 flex-1">
                <div className="text-white font-black text-base sm:text-lg leading-none flex items-center justify-center gap-1">
                  {streakDays}
                  {streakDays > 0 && (
                    <span className="text-xs streak-fire">🔥</span>
                  )}
                </div>
                <div className="text-white/65 text-[10px] sm:text-xs mt-0.5">
                  Streak
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════
          2. QUEST SUMMARY BAR (claimable indicator)
          Fixed: no longer looks like a button, just an info bar
      ══════════════════════════════════════════ */}
      {totalClaimable > 0 && (
        <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-2xl p-3 border border-emerald-200 flex items-center gap-3 claimable-glow quest-card-appear" style={{ animationDelay: "0.1s" }}>
          <div className="w-9 h-9 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <LucideIcon name="Gift" size={18} color="#059669" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-bold text-emerald-800">
              {totalClaimable} Reward Tersedia
            </p>
            <p className="text-[11px] text-emerald-600">
              Scroll ke bawah untuk klaim XP
            </p>
          </div>
          {/* Changed: indicator dot instead of misleading "KLAIM" button */}
          <div className="flex items-center gap-1 text-emerald-500">
            <span className="text-[11px] font-semibold">{totalClaimable}</span>
            <LucideIcon name="ChevronDown" size={14} color="#059669" />
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════
          3. STREAK + QUICK STATS
      ══════════════════════════════════════════ */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden quest-card-appear" style={{ animationDelay: "0.15s" }}>
        <div className="p-3.5 flex items-center gap-3">
          <div className="text-2xl flex-shrink-0 leading-none streak-fire">🔥</div>
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-1.5">
              <span className={`font-black text-xl ${
                streakDays > 30
                  ? "text-rose-500"
                  : streakDays > 7
                    ? "text-orange-500"
                    : "text-gray-700"
              }`}>
                {streakDays}
              </span>
              <span className="font-semibold text-gray-500 text-xs">
                Hari Berturut-turut
              </span>
            </div>
            <p className="text-[11px] text-gray-400 mt-0.5">
              {streakDays === 0
                ? "Mulai streak harianmu hari ini!"
                : streakDays > 30
                  ? "Luar biasa! Streak legenda!"
                  : streakDays > 7
                    ? "Streak mingguan mantap!"
                    : "Pertahankan streak-mu!"}
            </p>
          </div>
          {/* Mini quest progress — symmetric columns */}
          <div className="flex gap-2 flex-shrink-0">
            <div className="text-center min-w-[52px]">
              <div className="text-[10px] text-blue-500 font-bold uppercase">Harian</div>
              <div className="text-sm font-black text-gray-800">{totalDailyDone}/{safeDailyQuests.length}</div>
            </div>
            <div className="w-px bg-gray-200" />
            <div className="text-center min-w-[52px]">
              <div className="text-[10px] text-purple-500 font-bold uppercase">Mingguan</div>
              <div className="text-sm font-black text-gray-800">{totalWeeklyDone}/{safeWeeklyQuests.length}</div>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════
          4. DAILY QUESTS
      ══════════════════════════════════════════ */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden quest-card-appear" style={{ animationDelay: "0.2s" }}>
        <div className="px-4 pt-3.5 pb-2.5 border-b border-gray-100 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <LucideIcon name="Sword" size={16} color="#2563eb" />
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-gray-800 text-[13px]">
                Misi Harian
              </h3>
              <p className="text-[11px] text-gray-400">Reset setiap hari</p>
            </div>
          </div>
          <span className="text-[11px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-bold flex-shrink-0">
            {totalDailyDone}/{safeDailyQuests.length}
          </span>
        </div>

        <div className="divide-y divide-gray-50">
          {safeDailyQuests.length === 0 ? (
            <div className="py-8 text-center">
              <div className="text-3xl mb-2">⚔️</div>
              <p className="text-sm text-gray-500 font-medium">
                Belum ada misi harian
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Misi akan muncul setelah aktivitas
              </p>
            </div>
          ) : (
            safeDailyQuests.map((quest, idx) => (
              <QuestCard
                key={quest.id}
                quest={quest}
                onClaim={handleClaimWithAnimation}
                accentColor="blue"
                animDelay={idx * 0.06}
              />
            ))
          )}
        </div>
      </div>

      {/* ══════════════════════════════════════════
          5. WEEKLY QUESTS
      ══════════════════════════════════════════ */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden quest-card-appear" style={{ animationDelay: "0.25s" }}>
        <div className="px-4 pt-3.5 pb-2.5 border-b border-gray-100 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <LucideIcon name="Calendar" size={16} color="#7c3aed" />
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-gray-800 text-[13px]">
                Misi Mingguan
              </h3>
              <p className="text-[11px] text-gray-400">Reset setiap minggu</p>
            </div>
          </div>
          <span className="text-[11px] bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-bold flex-shrink-0">
            {totalWeeklyDone}/{safeWeeklyQuests.length}
          </span>
        </div>

        <div className="divide-y divide-gray-50">
          {safeWeeklyQuests.length === 0 ? (
            <div className="py-8 text-center">
              <div className="text-3xl mb-2">📅</div>
              <p className="text-sm text-gray-500 font-medium">
                Belum ada misi mingguan
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Selesaikan misi harian untuk unlock
              </p>
            </div>
          ) : (
            safeWeeklyQuests.map((quest, idx) => (
              <QuestCard
                key={quest.id}
                quest={quest}
                onClaim={handleClaimWithAnimation}
                accentColor="purple"
                animDelay={idx * 0.06}
              />
            ))
          )}
        </div>
      </div>

      {/* ══════════════════════════════════════════
          6. ACHIEVEMENTS
      ══════════════════════════════════════════ */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden quest-card-appear" style={{ animationDelay: "0.3s" }}>
        <div className="px-4 pt-3.5 pb-2.5 border-b border-gray-100 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <LucideIcon name="Trophy" size={16} color="#d97706" />
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-gray-800 text-[13px]">
                Pencapaian
              </h3>
              <p className="text-[11px] text-gray-400">
                Koleksi lencana prestasi
              </p>
            </div>
          </div>
          <span className="text-[11px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-bold flex-shrink-0">
            {completedAchievements.length}/{safeAchievements.length}
          </span>
        </div>

        {/* Filter chips — equal width, symmetric */}
        {safeAchievements.length > 0 && (
          <div className="px-4 pt-3 pb-1 grid grid-cols-3 gap-1.5">
            {[
              { key: "semua", label: "Semua", count: safeAchievements.length },
              { key: "completed", label: "Didapat", count: completedAchievements.length },
              { key: "locked", label: "Terkunci", count: lockedAchievements.length },
            ].map((f) => (
              <button
                key={f.key}
                onClick={() => setAchievementFilter(f.key)}
                aria-pressed={achievementFilter === f.key}
                className={`py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all text-center ${
                  achievementFilter === f.key
                    ? "bg-gray-800 text-white shadow-sm"
                    : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                }`}
              >
                {f.label} ({f.count})
              </button>
            ))}
          </div>
        )}

        {safeAchievements.length === 0 ? (
          <div className="py-8 text-center">
            <div className="text-3xl mb-2">🏆</div>
            <p className="text-sm text-gray-500 font-medium">
              Belum ada pencapaian
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Selesaikan misi untuk dapat pencapaian
            </p>
          </div>
        ) : filteredAchievements.length === 0 ? (
          <div className="py-6 text-center">
            <p className="text-xs text-gray-400">
              {achievementFilter === "completed"
                ? "Belum ada yang didapat"
                : "Semua sudah di-unlock!"}
            </p>
          </div>
        ) : (
          <div className="p-3 grid grid-cols-2 gap-2">
            {filteredAchievements.map((achievement, idx) => (
              <AchievementBadge
                key={achievement.id}
                achievement={achievement}
                animDelay={idx * 0.04}
              />
            ))}
          </div>
        )}
      </div>

      {/* ══════════════════════════════════════════
          7. RANK TIERS PREVIEW
      ══════════════════════════════════════════ */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden quest-card-appear" style={{ animationDelay: "0.35s" }}>
        <div className="px-4 pt-3.5 pb-2.5 border-b border-gray-100 flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <LucideIcon name="Star" size={16} color="#4f46e5" />
          </div>
          <div>
            <h3 className="font-bold text-gray-800 text-[13px]">
              Semua Rank
            </h3>
            <p className="text-[11px] text-gray-400">
              Perjalanan menuju puncak
            </p>
          </div>
        </div>

        {/* Horizontal scroll */}
        <div className="overflow-x-auto overscroll-x-contain">
          <div
            className="flex gap-3 px-4 py-4"
            style={{ width: "max-content" }}
          >
            {RANK_TIERS.map((tier) => {
              const isCurrent = tier.rank === (safeRank.rank || 1);
              const isUnlocked = safeTotalXP >= tier.xpRequired;

              return (
                <div
                  key={tier.rank}
                  className={`
                    relative flex flex-col items-center rounded-xl p-3 w-24 border-2 transition-all duration-300
                    ${
                      isCurrent
                        ? `bg-gradient-to-br ${tier.color} border-white shadow-lg scale-105`
                        : isUnlocked
                          ? `bg-gradient-to-br ${tier.color} border-transparent opacity-75`
                          : "bg-gray-50 border-gray-200 opacity-40 grayscale"
                    }
                  `}
                >
                  {/* Current badge */}
                  {isCurrent && (
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-yellow-400 text-yellow-900 text-[9px] font-black px-2 py-0.5 rounded-full whitespace-nowrap shadow">
                      ← KAMU
                    </div>
                  )}

                  {/* Icon */}
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center mb-1.5 ${
                      isCurrent || isUnlocked ? "bg-white/20" : "bg-gray-200"
                    }`}
                  >
                    {!isUnlocked && !isCurrent ? (
                      <LucideIcon name="Lock" size={18} color="#9ca3af" />
                    ) : (
                      <LucideIcon
                        name={tier.icon}
                        size={20}
                        color={isCurrent || isUnlocked ? "white" : "#6b7280"}
                      />
                    )}
                  </div>

                  {/* Rank number */}
                  <span
                    className={`text-[10px] font-black mb-0.5 ${
                      isCurrent || isUnlocked
                        ? "text-white/70"
                        : "text-gray-400"
                    }`}
                  >
                    RANK {tier.rank}
                  </span>

                  {/* Tier title */}
                  <span
                    className={`text-[11px] font-bold text-center leading-tight ${
                      isCurrent || isUnlocked ? "text-white" : "text-gray-500"
                    }`}
                  >
                    {tier.title}
                  </span>

                  {/* XP Required */}
                  <span
                    className={`text-[9px] mt-1 font-semibold ${
                      isCurrent || isUnlocked
                        ? "text-white/60"
                        : "text-gray-400"
                    }`}
                  >
                    {tier.xpRequired === 0
                      ? "Awal"
                      : `${tier.xpRequired} XP`}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// QUEST CARD SUB-COMPONENT
// ============================================================
const QuestCard = ({ quest, onClaim, accentColor = "blue", animDelay = 0 }) => {
  const isCompleted = quest.completed;
  const isClaimable = quest.claimable && typeof onClaim === "function";
  const [justClaimed, setJustClaimed] = React.useState(false);

  const handleClaim = () => {
    setJustClaimed(true);
    onClaim(quest.id);
    setTimeout(() => setJustClaimed(false), 600);
  };

  const accentMap = {
    blue: {
      xpBg: "bg-blue-100",
      xpText: "text-blue-700",
      iconBg: "bg-blue-50",
      doneBg: "bg-green-100",
      doneText: "text-green-700",
      pendingBg: "bg-gray-100",
      pendingText: "text-gray-500",
      claimClass: "quest-claim-btn",
    },
    purple: {
      xpBg: "bg-purple-100",
      xpText: "text-purple-700",
      iconBg: "bg-purple-50",
      doneBg: "bg-green-100",
      doneText: "text-green-700",
      pendingBg: "bg-gray-100",
      pendingText: "text-gray-500",
      claimClass: "quest-claim-btn-weekly",
    },
  };

  const colors = accentMap[accentColor] || accentMap.blue;

  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 transition-all duration-200 ${
        justClaimed
          ? "quest-claimed-ripple"
          : isCompleted && !isClaimable
            ? "bg-green-50/40"
            : isClaimable
              ? "bg-emerald-50/60"
              : "bg-white hover:bg-gray-50/70"
      }`}
      style={animDelay > 0 ? { animationDelay: `${animDelay}s` } : undefined}
    >
      {/* Icon — vertically centered */}
      <div
        className={`w-9 h-9 rounded-xl flex-shrink-0 flex items-center justify-center transition-transform duration-200 ${
          isClaimable ? "scale-110" : ""
        } ${
          isCompleted && !isClaimable
            ? "bg-green-100"
            : isClaimable
              ? "bg-emerald-100"
              : colors.iconBg
        }`}
      >
        {isCompleted && !isClaimable ? (
          <LucideIcon name="CheckCircle" size={18} color="#16a34a" />
        ) : isClaimable ? (
          <LucideIcon name="Gift" size={18} color="#059669" />
        ) : (
          <LucideIcon
            name={quest.icon || "Target"}
            size={18}
            color={accentColor === "purple" ? "#7c3aed" : "#2563eb"}
          />
        )}
      </div>

      {/* Content — middle */}
      <div className="flex-1 min-w-0">
        <p
          className={`text-[13px] font-semibold leading-tight ${
            isCompleted && !isClaimable
              ? "text-gray-400 line-through"
              : "text-gray-800"
          }`}
        >
          {quest.title}
        </p>
        {quest.description && (
          <p className="text-[11px] text-gray-400 mt-0.5 leading-snug">
            {quest.description}
          </p>
        )}

        {/* XP badge inline */}
        <div className="flex items-center gap-1.5 mt-1.5">
          <div
            className={`flex items-center gap-1 ${colors.xpBg} rounded-full px-2 py-0.5`}
          >
            <LucideIcon
              name="Zap"
              size={10}
              color={accentColor === "purple" ? "#7c3aed" : "#2563eb"}
            />
            <span
              className={`text-[11px] font-bold ${colors.xpText}`}
            >
              +{quest.xpReward} XP
            </span>
          </div>
        </div>
      </div>

      {/* Right side — claim/status badge, fixed width for alignment */}
      <div className="flex-shrink-0 flex items-center">
        {isClaimable ? (
          <button
            onClick={handleClaim}
            className={`${colors.claimClass} text-white text-[11px] font-bold px-3 py-1.5 rounded-full active:scale-95`}
          >
            Klaim
          </button>
        ) : isCompleted ? (
          <div
            className={`flex items-center gap-1 ${colors.doneBg} rounded-full px-2.5 py-1`}
          >
            <LucideIcon name="Check" size={10} color="#16a34a" />
            <span
              className={`text-[11px] font-bold ${colors.doneText}`}
            >
              Selesai
            </span>
          </div>
        ) : (
          <div
            className={`flex items-center gap-1 ${colors.pendingBg} rounded-full px-2.5 py-1`}
          >
            <LucideIcon name="Clock" size={10} color="#9ca3af" />
            <span
              className={`text-[11px] font-semibold ${colors.pendingText}`}
            >
              Belum
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================================
// ACHIEVEMENT BADGE SUB-COMPONENT
// ============================================================
const AchievementBadge = ({ achievement, animDelay = 0 }) => {
  const rarity = achievement.rarity || "common";
  const cfg = RARITY_CONFIG[rarity] || RARITY_CONFIG.common;
  const isCompleted = achievement.completed;

  return (
    <div
      className={`relative rounded-xl border p-3 flex flex-col items-center text-center transition-all quest-card-appear ${
        isCompleted
          ? `${cfg.bg} ${cfg.border} achievement-unlocked`
          : "bg-gray-50 border-gray-200 grayscale opacity-50"
      }`}
      style={{
        minHeight: "120px",
        ...(animDelay > 0 ? { animationDelay: `${animDelay}s` } : {}),
      }}
    >
      {/* Rarity corner badge */}
      <div
        className={`absolute top-1.5 right-1.5 text-[8px] font-black px-1.5 py-0.5 rounded-full ${
          isCompleted ? `${cfg.bg} ${cfg.text}` : "bg-gray-100 text-gray-400"
        }`}
      >
        {cfg.label}
      </div>

      {/* Icon circle */}
      <div
        className={`relative w-10 h-10 rounded-2xl flex items-center justify-center mb-2 ${
          isCompleted ? cfg.iconBg : "bg-gray-200"
        }`}
      >
        <LucideIcon
          name={achievement.icon || "Star"}
          size={22}
          color={isCompleted ? cfg.starColor : "#9ca3af"}
        />
        {/* Lock overlay if not completed */}
        {!isCompleted && (
          <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-gray-300/50">
            <LucideIcon name="Lock" size={14} color="#6b7280" />
          </div>
        )}
        {/* Check overlay if completed */}
        {isCompleted && (
          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center border-2 border-white">
            <LucideIcon name="Check" size={10} color="white" />
          </div>
        )}
      </div>

      {/* Title */}
      <p
        className={`text-[11px] font-bold leading-tight mb-0.5 ${
          isCompleted ? cfg.text : "text-gray-400"
        }`}
      >
        {achievement.title}
      </p>

      {/* Description or hidden */}
      <p className="text-[9px] text-gray-400 leading-snug min-h-[24px]">
        {isCompleted ? achievement.description : "???"}
      </p>

      {/* XP reward — push to bottom */}
      <div className="mt-auto pt-1.5">
        {isCompleted ? (
          <div
            className={`flex items-center gap-0.5 ${cfg.bg} rounded-full px-2 py-0.5`}
          >
            <LucideIcon name="Zap" size={9} color={cfg.starColor} />
            <span className={`text-[10px] font-bold ${cfg.text}`}>
              +{achievement.xpReward} XP
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-0.5 bg-gray-100 rounded-full px-2 py-0.5">
            <LucideIcon name="Lock" size={9} color="#9ca3af" />
            <span className="text-[10px] font-bold text-gray-400">
              Terkunci
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestTab;
