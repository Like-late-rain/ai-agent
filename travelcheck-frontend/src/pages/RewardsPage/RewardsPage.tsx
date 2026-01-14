/**
 * @file RewardsPage Component
 * @description Page for viewing and claiming rewards
 */

import { LotteryWheel } from '@/components/business/LotteryWheel'
import { RedPacket } from '@/components/business/RedPacket'
import { Badge } from '@/components/common/Badge'
import { Card } from '@/components/common/Card'
import type { LotteryPrize, Reward } from '@/types/models.types'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

/**
 * RewardsPage Component
 */
export function RewardsPage() {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState<'redpackets' | 'lottery' | 'badges'>('redpackets')
  const [lotteryChances] = useState(3)

  // Mock red packets
  const redPackets: Reward[] = [
    {
      id: '1',
      userId: 'user1',
      stakeId: 'stake1',
      type: 'redpacket',
      amount: 5.5,
      badgeId: null,
      expireAt: new Date(Date.now() + 12 * 60 * 60 * 1000),
      claimed: false,
      claimedAt: null,
      createdAt: new Date(),
    },
    {
      id: '2',
      userId: 'user1',
      stakeId: 'stake1',
      type: 'redpacket',
      amount: 3.2,
      badgeId: null,
      expireAt: null,
      claimed: true,
      claimedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
      createdAt: new Date(Date.now() - 25 * 60 * 60 * 1000),
    },
  ]

  // Mock badges
  const badges = [
    { id: '1', name: t('rewardsPage.badges.firstCheckin'), icon: '🎯', earned: true },
    { id: '2', name: t('rewardsPage.badges.sevenDayStreak'), icon: '🔥', earned: true },
    { id: '3', name: t('rewardsPage.badges.thirtyDayStreak'), icon: '⭐', earned: false },
    { id: '4', name: t('rewardsPage.badges.perfectMonth'), icon: '💯', earned: false },
  ]

  const handleSpin = async (): Promise<LotteryPrize> => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: '1',
          name: '50 TCK',
          type: 'token',
          amount: 50,
          probability: 0.9,
          image: null,
          createdAt: new Date(),
        })
      }, 1000)
    })
  }

  const handleClaimRedPacket = (reward: Reward) => {
    alert(t('rewardsPage.alerts.claimed', { amount: reward.amount }))
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">{t('rewardsPage.title')}</h1>
        <p className="text-text-muted">{t('rewardsPage.subtitle')}</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <Card.Body>
            <p className="text-sm text-text-muted mb-1">{t('rewardsPage.stats.totalEarned')}</p>
            <p className="text-2xl font-bold text-primary">125.5 TCK</p>
          </Card.Body>
        </Card>
        <Card>
          <Card.Body>
            <p className="text-sm text-text-muted mb-1">{t('rewardsPage.stats.unclaimed')}</p>
            <p className="text-2xl font-bold text-white">8.7 TCK</p>
          </Card.Body>
        </Card>
        <Card>
          <Card.Body>
            <p className="text-sm text-text-muted mb-1">{t('rewardsPage.stats.lotteryChances')}</p>
            <p className="text-2xl font-bold text-primary">{lotteryChances}</p>
          </Card.Body>
        </Card>
        <Card>
          <Card.Body>
            <p className="text-sm text-text-muted mb-1">{t('rewardsPage.stats.badgesEarned')}</p>
            <p className="text-2xl font-bold text-white">
              {badges.filter((b) => b.earned).length} / {badges.length}
            </p>
          </Card.Body>
        </Card>
      </div>

      {/* Tabs */}
      <Card>
        <Card.Body>
          <div className="flex gap-2 overflow-x-auto">
            {[
              { value: 'redpackets', label: t('rewardsPage.tabs.redPackets'), icon: '🧧' },
              { value: 'lottery', label: t('rewardsPage.tabs.lottery'), icon: '🎰' },
              { value: 'badges', label: t('rewardsPage.tabs.badges'), icon: '🏆' },
            ].map((tab) => (
              <button
                key={tab.value}
                type="button"
                onClick={() => setActiveTab(tab.value as typeof activeTab)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === tab.value
                    ? 'bg-primary text-background-dark'
                    : 'bg-background-dark text-text-muted hover:text-primary'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </Card.Body>
      </Card>

      {/* Red Packets Tab */}
      {activeTab === 'redpackets' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {redPackets.map((packet) => (
            <RedPacket key={packet.id} reward={packet} onClaim={handleClaimRedPacket} />
          ))}
        </div>
      )}

      {/* Lottery Tab */}
      {activeTab === 'lottery' && (
        <div className="flex justify-center">
          <LotteryWheel chances={lotteryChances} onSpin={handleSpin} />
        </div>
      )}

      {/* Badges Tab */}
      {activeTab === 'badges' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {badges.map((badge) => (
            <Card key={badge.id} className={badge.earned ? '' : 'opacity-50'}>
              <Card.Body>
                <div className="text-center">
                  <div className="text-6xl mb-3">{badge.icon}</div>
                  <h3 className="font-semibold text-white mb-1">{badge.name}</h3>
                  {badge.earned ? (
                    <Badge variant="success">{t('rewardsPage.badges.earned')}</Badge>
                  ) : (
                    <Badge variant="default">{t('rewardsPage.badges.locked')}</Badge>
                  )}
                </div>
              </Card.Body>
            </Card>
          ))}
        </div>
      )}

      {/* Reward History */}
      <Card>
        <Card.Header>
          <h2 className="text-xl font-semibold text-white">{t('rewardsPage.recent.title')}</h2>
        </Card.Header>
        <Card.Body>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 bg-background-dark rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="text-2xl">🎁</div>
                  <div>
                    <p className="font-medium text-white">{t('rewardsPage.recent.dailyRedPacket')}</p>
                    <p className="text-xs text-text-muted">
                      {t('rewardsPage.recent.daysAgo', { count: i })}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-primary">+5.5 TCK</p>
                  <Badge variant="success" size="sm">
                    {t('rewardsPage.recent.claimed')}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </Card.Body>
      </Card>
    </div>
  )
}
