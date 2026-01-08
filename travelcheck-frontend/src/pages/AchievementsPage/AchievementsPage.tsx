/**
 * @file AchievementsPage Component
 * @description Page for viewing user achievements and badges
 */

import { Badge } from '@/components/common/Badge'
import { Card } from '@/components/common/Card'
import type { Badge as BadgeType } from '@/types/models.types'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

/**
 * User statistics interface
 */
interface UserStats {
  totalBadges: number
  totalCheckins: number
  longestStreak: number
  perfectDays: number
  currentStreak: number
  totalStakes: number
}

/**
 * AchievementsPage Component
 */
export function AchievementsPage() {
  const { t } = useTranslation()

  // Mock user statistics
  const [stats] = useState<UserStats>({
    totalBadges: 8,
    totalCheckins: 127,
    longestStreak: 45,
    perfectDays: 38,
    currentStreak: 15,
    totalStakes: 12,
  })

  // Mock badges data
  const [badges] = useState<BadgeType[]>([
    {
      id: '1',
      name: 'Early Bird',
      description: 'Check-in for 7 consecutive days',
      icon: '🌅',
      requirement: '7 day streak',
      createdAt: new Date('2024-01-01'),
    },
    {
      id: '2',
      name: 'Perfect Month',
      description: 'Complete 30 consecutive perfect check-ins',
      icon: '🏆',
      requirement: '30 perfect days',
      createdAt: new Date('2024-01-15'),
    },
    {
      id: '3',
      name: 'World Explorer',
      description: 'Visit 10 different attractions',
      icon: '🌍',
      requirement: '10 attractions',
      createdAt: new Date('2024-02-01'),
    },
    {
      id: '4',
      name: 'High Roller',
      description: 'Stake over 1000 TCK total',
      icon: '💎',
      requirement: '1000 TCK staked',
      createdAt: new Date('2024-02-10'),
    },
    {
      id: '5',
      name: 'Marathon Runner',
      description: 'Maintain a 100 day streak',
      icon: '🏃',
      requirement: '100 day streak',
      createdAt: new Date('2024-03-01'),
    },
    {
      id: '6',
      name: 'Lucky Winner',
      description: 'Win the lottery 5 times',
      icon: '🎰',
      requirement: '5 lottery wins',
      createdAt: new Date('2024-03-15'),
    },
    {
      id: '7',
      name: 'Red Packet Master',
      description: 'Collect 50 red packets',
      icon: '🧧',
      requirement: '50 red packets',
      createdAt: new Date('2024-04-01'),
    },
    {
      id: '8',
      name: 'Community Leader',
      description: 'Invite 10 friends',
      icon: '👥',
      requirement: '10 referrals',
      createdAt: new Date('2024-04-10'),
    },
  ])

  const statCards = [
    {
      label: t('achievements.totalBadges'),
      value: stats.totalBadges,
      icon: '🏅',
      color: 'text-yellow-400',
    },
    {
      label: t('achievements.totalCheckins'),
      value: stats.totalCheckins,
      icon: '📝',
      color: 'text-blue-400',
    },
    {
      label: t('achievements.longestStreak'),
      value: `${stats.longestStreak} ${t('common.days')}`,
      icon: '🔥',
      color: 'text-orange-400',
    },
    {
      label: t('achievements.perfectDays'),
      value: stats.perfectDays,
      icon: '✨',
      color: 'text-purple-400',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">{t('achievements.title')}</h1>
        <p className="text-text-muted">{t('achievements.subtitle')}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <Card key={stat.label}>
            <Card.Body>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-muted mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                </div>
                <div className={`text-4xl ${stat.color}`}>{stat.icon}</div>
              </div>
            </Card.Body>
          </Card>
        ))}
      </div>

      {/* Badges Section */}
      <Card>
        <Card.Header>
          <h2 className="text-xl font-semibold text-white">{t('achievements.badges')}</h2>
        </Card.Header>
        <Card.Body>
          {badges.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {badges.map((badge) => (
                <div
                  key={badge.id}
                  className="group p-4 bg-background-dark rounded-lg border border-border-dark hover:border-primary transition-all cursor-pointer"
                >
                  <div className="text-center">
                    <div className="text-5xl mb-3">{badge.icon}</div>
                    <h3 className="font-semibold text-white mb-1 group-hover:text-primary transition-colors">
                      {badge.name}
                    </h3>
                    <p className="text-sm text-text-muted mb-2">{badge.description}</p>
                    <Badge variant="default" size="sm">
                      {badge.requirement}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🏅</div>
              <h3 className="text-xl font-semibold text-white mb-2">
                {t('achievements.noBadges')}
              </h3>
              <p className="text-text-muted">{t('achievements.startEarning')}</p>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Progress Section */}
      <Card>
        <Card.Header>
          <h2 className="text-xl font-semibold text-white">
            {t('achievements.stats', { defaultValue: 'Statistics' })}
          </h2>
        </Card.Header>
        <Card.Body>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-text-muted">Current Streak</span>
                <span className="text-sm font-semibold text-white">
                  {stats.currentStreak} / {stats.longestStreak} days
                </span>
              </div>
              <div className="w-full bg-background-dark rounded-full h-2">
                <div
                  className="bg-primary rounded-full h-2 transition-all"
                  style={{
                    width: `${(stats.currentStreak / stats.longestStreak) * 100}%`,
                  }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-text-muted">Perfect Days Progress</span>
                <span className="text-sm font-semibold text-white">
                  {stats.perfectDays} / {stats.totalCheckins} check-ins
                </span>
              </div>
              <div className="w-full bg-background-dark rounded-full h-2">
                <div
                  className="bg-purple-500 rounded-full h-2 transition-all"
                  style={{
                    width: `${(stats.perfectDays / stats.totalCheckins) * 100}%`,
                  }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-text-muted">Badges Collected</span>
                <span className="text-sm font-semibold text-white">
                  {stats.totalBadges} / 20
                </span>
              </div>
              <div className="w-full bg-background-dark rounded-full h-2">
                <div
                  className="bg-yellow-500 rounded-full h-2 transition-all"
                  style={{ width: `${(stats.totalBadges / 20) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </Card.Body>
      </Card>
    </div>
  )
}
