"use client";

import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import AchievementBadge, { Achievement } from "./achievement-badge";

type FilterType = "all" | "unlocked" | "locked";
type RarityFilter = "all" | "common" | "rare" | "epic" | "legendary";

export default function AchievementsPage() {
  const { t } = useTranslation();
  const [filter, setFilter] = useState<FilterType>("all");
  const [rarityFilter, setRarityFilter] = useState<RarityFilter>("all");

  // 模拟成就数据
  const achievements = useMemo<Achievement[]>(
    () => [
      {
        id: "1",
        name: t("achievementsData.travelSeed.name"),
        description: t("achievementsData.travelSeed.description"),
        icon: "🌱",
        requirement: t("achievementsData.travelSeed.requirement"),
        rarity: "common",
        unlocked: true,
        unlockedAt: "2026-01-01"
      },
      {
        id: "2",
        name: t("achievementsData.sevenDays.name"),
        description: t("achievementsData.sevenDays.description"),
        icon: "📅",
        requirement: t("achievementsData.sevenDays.requirement"),
        rarity: "common",
        unlocked: true,
        unlockedAt: "2026-01-07"
      },
      {
        id: "3",
        name: t("achievementsData.thirtyDays.name"),
        description: t("achievementsData.thirtyDays.description"),
        icon: "⭐",
        requirement: t("achievementsData.thirtyDays.requirement"),
        rarity: "rare",
        unlocked: true,
        unlockedAt: "2026-01-20"
      },
      {
        id: "4",
        name: t("achievementsData.explorer.name"),
        description: t("achievementsData.explorer.description"),
        icon: "🌟",
        requirement: t("achievementsData.explorer.requirement"),
        rarity: "epic",
        unlocked: false,
        progress: 45,
        maxProgress: 100
      },
      {
        id: "5",
        name: t("achievementsData.master.name"),
        description: t("achievementsData.master.description"),
        icon: "👑",
        requirement: t("achievementsData.master.requirement"),
        rarity: "legendary",
        unlocked: false,
        progress: 15,
        maxProgress: 365
      },
      {
        id: "6",
        name: t("achievementsData.collector.name"),
        description: t("achievementsData.collector.description"),
        icon: "📍",
        requirement: t("achievementsData.collector.requirement"),
        rarity: "rare",
        unlocked: false,
        progress: 2,
        maxProgress: 5
      },
      {
        id: "7",
        name: t("achievementsData.worldTour.name"),
        description: t("achievementsData.worldTour.description"),
        icon: "🌍",
        requirement: t("achievementsData.worldTour.requirement"),
        rarity: "epic",
        unlocked: false,
        progress: 2,
        maxProgress: 20
      },
      {
        id: "8",
        name: t("achievementsData.wealth.name"),
        description: t("achievementsData.wealth.description"),
        icon: "💰",
        requirement: t("achievementsData.wealth.requirement"),
        rarity: "rare",
        unlocked: false,
        progress: 356,
        maxProgress: 1000
      },
      {
        id: "9",
        name: t("achievementsData.luckyStar.name"),
        description: t("achievementsData.luckyStar.description"),
        icon: "🎰",
        requirement: t("achievementsData.luckyStar.requirement"),
        rarity: "epic",
        unlocked: false,
        progress: 3,
        maxProgress: 10
      },
      {
        id: "10",
        name: t("achievementsData.perfectionist.name"),
        description: t("achievementsData.perfectionist.description"),
        icon: "💯",
        requirement: t("achievementsData.perfectionist.requirement"),
        rarity: "epic",
        unlocked: false,
        progress: 7,
        maxProgress: 30
      },
      {
        id: "11",
        name: t("achievementsData.communityStar.name"),
        description: t("achievementsData.communityStar.description"),
        icon: "🌟",
        requirement: t("achievementsData.communityStar.requirement"),
        rarity: "rare",
        unlocked: false,
        progress: 0,
        maxProgress: 10
      },
      {
        id: "12",
        name: t("achievementsData.legendaryTraveler.name"),
        description: t("achievementsData.legendaryTraveler.description"),
        icon: "🏆",
        requirement: t("achievementsData.legendaryTraveler.requirement"),
        rarity: "legendary",
        unlocked: false,
        progress: 3,
        maxProgress: 11
      }
    ],
    [t]
  );

  const filteredAchievements = achievements.filter((achievement) => {
    if (filter === "unlocked" && !achievement.unlocked) return false;
    if (filter === "locked" && achievement.unlocked) return false;
    if (rarityFilter !== "all" && achievement.rarity !== rarityFilter)
      return false;
    return true;
  });

  const stats = {
    total: achievements.length,
    unlocked: achievements.filter((a) => a.unlocked).length,
    progress: Math.round(
      (achievements.filter((a) => a.unlocked).length / achievements.length) *
        100
    )
  };

  return (
    <div className="min-h-screen">
      {/* Main Content */}
      <main className="mx-auto max-w-7xl ">
        <div className="space-y-6">
          {/* 统计卡片 */}
          <div className="glass-panel p-6 rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold mb-1">
                  {stats.unlocked} / {stats.total}
                </h2>
                <p className="text-sm text-gray-400">{t("achievementsPage.stats.unlocked")}</p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-primary">
                  {stats.progress}%
                </p>
                <p className="text-sm text-gray-400">{t("achievementsPage.stats.progress")}</p>
              </div>
            </div>

            {/* 进度条 */}
            <div className="relative h-3 bg-black/30 rounded-full overflow-hidden border border-white/10">
              <div
                className="h-full bg-gradient-to-r from-primary to-primary-hover transition-all duration-500"
                style={{ width: `${stats.progress}%` }}
              />
            </div>
          </div>

          {/* 筛选器 */}
          <div className="glass-panel p-4 rounded-xl">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
              {/* 状态筛选 */}
              <div className="flex gap-2">
                <button
                  onClick={() => setFilter("all")}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                    filter === "all"
                      ? "bg-primary text-background-dark"
                      : "text-gray-400 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {t("achievementsPage.filters.all")} ({achievements.length})
                </button>
                <button
                  onClick={() => setFilter("unlocked")}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                    filter === "unlocked"
                      ? "bg-primary text-background-dark"
                      : "text-gray-400 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {t("achievementsPage.filters.unlocked")} ({stats.unlocked})
                </button>
                <button
                  onClick={() => setFilter("locked")}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                    filter === "locked"
                      ? "bg-primary text-background-dark"
                      : "text-gray-400 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {t("achievementsPage.filters.locked")} ({stats.total - stats.unlocked})
                </button>
              </div>

              {/* 稀有度筛选 */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-400">{t("achievementsPage.filters.rarity")}</span>
                <select
                  value={rarityFilter}
                  onChange={(e) =>
                    setRarityFilter(e.target.value as RarityFilter)
                  }
                  className="bg-black/30 border border-white/20 rounded-lg px-3 py-1.5 text-sm text-white focus:border-primary focus:outline-none"
                >
                  <option value="all">{t("achievementsPage.rarity.all")}</option>
                  <option value="common">{t("achievementsPage.rarity.common")}</option>
                  <option value="rare">{t("achievementsPage.rarity.rare")}</option>
                  <option value="epic">{t("achievementsPage.rarity.epic")}</option>
                  <option value="legendary">{t("achievementsPage.rarity.legendary")}</option>
                </select>
              </div>
            </div>
          </div>

          {/* 成就网格 */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {filteredAchievements.map((achievement) => (
              <div
                key={achievement.id}
                className="glass-panel p-4 rounded-xl hover:border-primary transition-all cursor-pointer"
              >
                <AchievementBadge achievement={achievement} size="medium" />

                {/* 要求说明 */}
                <div className="mt-4 pt-4 border-t border-white/10">
                  <p className="text-xs text-gray-500 text-center">
                    {achievement.requirement}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* 空状态 */}
          {filteredAchievements.length === 0 && (
            <div className="glass-panel p-12 rounded-xl text-center">
              <span className="material-symbols-outlined text-6xl text-white/20 mb-4">
                search_off
              </span>
              <p className="text-gray-400">{t("achievementsPage.empty")}</p>
            </div>
          )}

          {/* 提示 */}
          <div className="glass-panel p-6 rounded-xl">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">
                emoji_events
              </span>
              {t("achievementsPage.howToEarn.title")}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="text-sm font-bold text-white">
                  {t("achievementsPage.howToEarn.daily.title")}
                </h4>
                <ul className="space-y-1 text-xs text-gray-400">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>{t("achievementsPage.howToEarn.daily.item1")}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>{t("achievementsPage.howToEarn.daily.item2")}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>{t("achievementsPage.howToEarn.daily.item3")}</span>
                  </li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-bold text-white">
                  {t("achievementsPage.howToEarn.attraction.title")}
                </h4>
                <ul className="space-y-1 text-xs text-gray-400">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>{t("achievementsPage.howToEarn.attraction.item1")}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>{t("achievementsPage.howToEarn.attraction.item2")}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>{t("achievementsPage.howToEarn.attraction.item3")}</span>
                  </li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-bold text-white">
                  {t("achievementsPage.howToEarn.earnings.title")}
                </h4>
                <ul className="space-y-1 text-xs text-gray-400">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>{t("achievementsPage.howToEarn.earnings.item1")}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>{t("achievementsPage.howToEarn.earnings.item2")}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>{t("achievementsPage.howToEarn.earnings.item3")}</span>
                  </li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-bold text-white">
                  {t("achievementsPage.howToEarn.community.title")}
                </h4>
                <ul className="space-y-1 text-xs text-gray-400">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>{t("achievementsPage.howToEarn.community.item1")}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>{t("achievementsPage.howToEarn.community.item2")}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>{t("achievementsPage.howToEarn.community.item3")}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
