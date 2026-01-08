/**
 * @file MyCheckinsPage Component
 * @description Page for viewing and managing all user check-ins and stakes
 */

import { StakeCard } from '@/components/business/StakeCard'
import { Button } from '@/components/common/Button'
import { Card } from '@/components/common/Card'
import type { Stake } from '@/types/models.types'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

/**
 * MyCheckinsPage Component
 */
export function MyCheckinsPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all')

  // Mock user stakes data
  const [stakes] = useState<Stake[]>([
    {
      id: '1',
      userId: 'user1',
      type: 'daily',
      amount: 100,
      milestone: 30,
      mode: 'sealed',
      checkedDays: 15,
      isPerfect: true,
      accumulatedInterest: 2.5,
      status: 'active',
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-01-31'),
      completedAt: null,
      withdrawnAt: null,
      createdAt: new Date('2024-01-01'),
    },
    {
      id: '2',
      userId: 'user1',
      type: 'attraction',
      amount: 200,
      milestone: 100,
      mode: 'anytime',
      checkedDays: 50,
      isPerfect: false,
      accumulatedInterest: 5.0,
      status: 'active',
      startDate: new Date('2023-12-01'),
      endDate: new Date('2024-04-10'),
      completedAt: null,
      withdrawnAt: null,
      createdAt: new Date('2023-12-01'),
    },
    {
      id: '3',
      userId: 'user1',
      type: 'daily',
      amount: 50,
      milestone: 30,
      mode: 'sealed',
      checkedDays: 30,
      isPerfect: true,
      accumulatedInterest: 3.0,
      status: 'completed',
      startDate: new Date('2023-11-01'),
      endDate: new Date('2023-12-01'),
      completedAt: new Date('2023-12-01'),
      withdrawnAt: null,
      createdAt: new Date('2023-11-01'),
    },
  ])

  const filteredStakes = stakes.filter((stake) => {
    if (filter === 'all') return true
    return stake.status === filter
  })

  const activeStakes = stakes.filter((s) => s.status === 'active')
  const completedStakes = stakes.filter((s) => s.status === 'completed')

  const handleCheckin = (stakeId: string) => {
    navigate(`/checkin/${stakeId}`)
  }

  const handleViewDetails = (stakeId: string) => {
    navigate(`/calendar/${stakeId}`)
  }

  const handleCreateStake = () => {
    navigate('/stake')
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">{t('checkins.title')}</h1>
        <p className="text-text-muted">{t('checkins.subtitle')}</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <Card.Body>
            <p className="text-sm text-text-muted mb-1">{t('checkins.myStakes')}</p>
            <p className="text-2xl font-bold text-white">{stakes.length}</p>
          </Card.Body>
        </Card>
        <Card>
          <Card.Body>
            <p className="text-sm text-text-muted mb-1">{t('checkins.activeStakes')}</p>
            <p className="text-2xl font-bold text-primary">{activeStakes.length}</p>
          </Card.Body>
        </Card>
        <Card>
          <Card.Body>
            <p className="text-sm text-text-muted mb-1">{t('checkins.completedStakes')}</p>
            <p className="text-2xl font-bold text-white">{completedStakes.length}</p>
          </Card.Body>
        </Card>
      </div>

      {/* Filter Tabs */}
      <Card>
        <Card.Body>
          <div className="flex gap-2 overflow-x-auto">
            {[
              { value: 'all' as const, label: t('common.all', { defaultValue: 'All' }), icon: '📋' },
              { value: 'active' as const, label: t('checkins.activeStakes'), icon: '🔥' },
              { value: 'completed' as const, label: t('checkins.completedStakes'), icon: '✅' },
            ].map((tab) => (
              <button
                key={tab.value}
                type="button"
                onClick={() => setFilter(tab.value)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === tab.value
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

      {/* Stakes Grid */}
      {filteredStakes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStakes.map((stake) => (
            <StakeCard
              key={stake.id}
              stake={stake}
              onCheckin={stake.status === 'active' ? () => handleCheckin(stake.id) : undefined}
              onViewDetails={() => handleViewDetails(stake.id)}
            />
          ))}
        </div>
      ) : (
        <Card>
          <Card.Body>
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-xl font-semibold text-white mb-2">
                {t('checkins.noActiveStakes')}
              </h3>
              <p className="text-text-muted mb-6">{t('checkins.createFirstStake')}</p>
              <Button variant="primary" onClick={handleCreateStake}>
                {t('home.createNewStake')}
              </Button>
            </div>
          </Card.Body>
        </Card>
      )}
    </div>
  )
}
