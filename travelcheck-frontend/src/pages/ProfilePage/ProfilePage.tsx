/**
 * @file ProfilePage Component
 * @description User profile and account management page
 */

import Achievement from "@/components/common/Achievement";
import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import { updateUserProfile } from "@/services/auth.service";
import { updateUserAtom, userAtom } from "@/store/user.atom";
import { formatAmount } from "@/utils/format";
import { useAtom, useSetAtom } from "jotai";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

/**
 * ProfilePage Component
 */
export function ProfilePage() {
  const { t } = useTranslation();
  //   const { address } = useWallet();

  //   // Mock user data
  //   const [user] = useState<User>({
  //     id: "user1",
  //     walletAddress: address || "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
  //     nickname: "Travel Enthusiast",
  //     avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=TravelCheck",
  //     totalCheckins: 127,
  //     currentStreak: 15,
  //     maxStreak: 45,
  //     lotteryChances: 3,
  //     badges: ["early-bird", "perfect-month", "world-explorer"],
  //     createdAt: new Date("2023-11-01")
  //   });

  const [user] = useAtom(userAtom);
  const updateUser = useSetAtom(updateUserAtom);

  const [stats] = useState({
    totalStaked: 1500,
    totalEarned: 125.5,
    activeStakes: 4,
    completedStakes: 8,
    perfectDays: 38,
    attractionsVisited: 12
  });

  const [isEditing, setIsEditing] = useState(false);
  const [nickname, setNickname] = useState(user?.nickname || "");
  const [avatar, setAvatar] = useState(user?.avatar || "");
  const [isUpdating, setIsUpdating] = useState(false);

  // 同步用户数据到本地状态
  useEffect(() => {
    if (user) {
      setNickname(user.nickname || "");
      setAvatar(user.avatar || "");
    }
  }, [user]);

  const handleEditProfile = () => {
    setIsEditing(true);
  };

  const handleSaveProfile = async () => {
    if (!nickname.trim()) {
      alert(t("profile.alerts.nicknameRequired"));
      return;
    }

    setIsUpdating(true);
    try {
      // 调用后端API更新用户资料
      await updateUserProfile({ nickname, avatar });

      // 更新本地状态
      updateUser({ nickname, avatar });
      setIsEditing(false);
      alert(t("profile.alerts.updateSuccess"));
    } catch (error) {
      console.error("Failed to update profile:", error);
      alert(t("profile.alerts.updateFailed"));
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancelEdit = () => {
    setNickname(user?.nickname || "");
    setAvatar(user?.avatar || "");
    setIsEditing(false);
  };

  const handleChangeAvatar = async () => {
    const newAvatar = prompt(t("profile.alerts.avatarPrompt"));
    if (newAvatar && newAvatar.trim()) {
      setIsUpdating(true);
      try {
        // 直接调用API更新头像
        await updateUserProfile({ avatar: newAvatar.trim() });
        updateUser({ avatar: newAvatar.trim() });
        setAvatar(newAvatar.trim());
        alert(t("profile.alerts.avatarUpdateSuccess"));
      } catch (error) {
        console.error("Failed to update avatar:", error);
        alert(t("profile.alerts.avatarUpdateFailed"));
      } finally {
        setIsUpdating(false);
      }
    }
  };

  const formatWalletAddress = (address: string) => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const getDaysAsMember = () => {
    if (!user) return 0;
    const now = new Date();
    const created = new Date(user.createdAt);
    const days = Math.floor(
      (now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24)
    );
    return days;
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-xl text-text-muted mb-4">{t("profile.connectWalletPrompt")}</p>
          <Button onClick={() => (window.location.href = "/")}>
            {t("profile.connectWallet")}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">
          {t("profile.title")}
        </h1>
        <p className="text-text-muted">{t("profile.subtitle")}</p>
      </div>

      {/* Profile Card */}
      <Card>
        <Card.Body>
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <div className="relative">
                <img
                  src={
                    user.avatar ||
                    "https://api.dicebear.com/7.x/avataaars/svg?seed=default"
                  }
                  alt={user.nickname || "User"}
                  className="w-32 h-32 rounded-full border-4 border-primary"
                />
                <button
                  onClick={handleChangeAvatar}
                  disabled={isUpdating}
                  className="absolute bottom-0 right-0 bg-primary hover:bg-primary/80 text-background-dark rounded-full p-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  type="button"
                  aria-label={t("profile.changeAvatar")}
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* User Info */}
            <div className="flex-1 text-center md:text-left">
              {isEditing ? (
                <div className="mb-4">
                  <input
                    type="text"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    className="text-2xl font-bold bg-background-card text-white border border-primary rounded px-3 py-1"
                    placeholder={t("profile.nicknamePlaceholder")}
                  />
                </div>
              ) : (
                <h2 className="text-2xl font-bold text-white mb-2">
                  {user.nickname || t("profile.anonymous")}
                </h2>
              )}
              <div className="space-y-2">
                <div className="flex items-center justify-center md:justify-start gap-2 text-text-muted">
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6z" />
                  </svg>
                  <span className="font-mono text-sm">
                    {formatWalletAddress(user.walletAddress)}
                  </span>
                </div>
                <div className="flex items-center justify-center md:justify-start gap-2 text-text-muted">
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-sm">
                    {t("profile.memberSince")}: {getDaysAsMember()} {t("common.days")}
                  </span>
                </div>
              </div>
              <div className="mt-4 space-x-2">
                {isEditing ? (
                  <>
                    <Button onClick={handleSaveProfile} disabled={isUpdating}>
                      {isUpdating ? t("profile.saving") : t("common.save")}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleCancelEdit}
                      disabled={isUpdating}
                    >
                      {t("common.cancel")}
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="outline"
                    onClick={handleEditProfile}
                    disabled={isUpdating}
                  >
                    {t("profile.editProfile")}
                  </Button>
                )}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4 md:gap-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">
                  {user.totalCheckins}
                </p>
                <p className="text-xs text-text-muted">
                  {t("achievements.totalCheckins")}
                </p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">
                  {user.currentStreak}
                </p>
                <p className="text-xs text-text-muted">
                  {t("home.currentStreak", { defaultValue: "Streak" })}
                </p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">
                  {user.badges.length}
                </p>
                <p className="text-xs text-text-muted">
                  {t("achievements.badges", { defaultValue: "Badges" })}
                </p>
              </div>
            </div>
          </div>
        </Card.Body>
      </Card>

      {/* Statistics Grid */}
      <div>
        <h2 className="text-xl font-semibold text-white mb-4">
          {t("profile.statistics")}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card>
            <Card.Body>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-muted mb-1">
                    {t("profile.totalStaked")}
                  </p>
                  <p className="text-2xl font-bold text-white">
                    {formatAmount(stats.totalStaked)} TCK
                  </p>
                </div>
                <div className="text-4xl">💰</div>
              </div>
            </Card.Body>
          </Card>

          <Card>
            <Card.Body>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-muted mb-1">
                    {t("profile.totalEarned")}
                  </p>
                  <p className="text-2xl font-bold text-primary">
                    {formatAmount(stats.totalEarned)} TCK
                  </p>
                </div>
                <div className="text-4xl">📈</div>
              </div>
            </Card.Body>
          </Card>

          <Card>
            <Card.Body>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-muted mb-1">
                    {t("checkins.activeStakes")}
                  </p>
                  <p className="text-2xl font-bold text-white">
                    {stats.activeStakes}
                  </p>
                </div>
                <div className="text-4xl">🔥</div>
              </div>
            </Card.Body>
          </Card>

          <Card>
            <Card.Body>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-muted mb-1">
                    {t("checkins.completedStakes")}
                  </p>
                  <p className="text-2xl font-bold text-white">
                    {stats.completedStakes}
                  </p>
                </div>
                <div className="text-4xl">✅</div>
              </div>
            </Card.Body>
          </Card>

          <Card>
            <Card.Body>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-muted mb-1">
                    {t("achievements.perfectDays")}
                  </p>
                  <p className="text-2xl font-bold text-white">
                    {stats.perfectDays}
                  </p>
                </div>
                <div className="text-4xl">✨</div>
              </div>
            </Card.Body>
          </Card>

          <Card>
            <Card.Body>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-muted mb-1">
                    {t("profile.attractionsVisited", {
                      defaultValue: "Attractions"
                    })}
                  </p>
                  <p className="text-2xl font-bold text-white">
                    {stats.attractionsVisited}
                  </p>
                </div>
                <div className="text-4xl">🗺️</div>
              </div>
            </Card.Body>
          </Card>
        </div>
      </div>

      {/* Activity Summary */}
      <Card>
        <Card.Header>
          <h2 className="text-xl font-semibold text-white">{t("profile.achievementsWall")}</h2>
        </Card.Header>
        <Card.Body>
          <Achievement />
        </Card.Body>
      </Card>
    </div>
  );
}
