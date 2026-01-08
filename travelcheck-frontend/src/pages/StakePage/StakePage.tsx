/**
 * @file StakePage Component
 * @description Page for creating and managing stakes
 */

import { StakeCard } from '@/components/business/StakeCard'
import { Button } from '@/components/common/Button'
import { Card } from '@/components/common/Card'
import { Input } from '@/components/common/Input'
import { MILESTONES } from '@/constants/business'
import type { Stake } from '@/types/models.types'
import { type FormEvent, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

/**
 * StakePage Component
 */
export function StakePage() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    type: 'daily' as 'daily' | 'attraction',
    amount: '',
    milestone: 30 as 30 | 100 | 200 | 365,
    mode: 'sealed' as 'sealed' | 'anytime',
  })

  // Mock existing stakes
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
  ])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Simulate API call
    setTimeout(() => {
      setLoading(false)
      alert('Stake created successfully!')
      setFormData({ type: 'daily', amount: '', milestone: 30, mode: 'sealed' })
    }, 1500)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">{t('stake.title')}</h1>
        <p className="text-text-muted">{t('stake.subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Create Stake Form */}
        <Card>
          <Card.Header>
            <h2 className="text-xl font-semibold text-white">{t('stake.newStake')}</h2>
          </Card.Header>
          <Card.Body>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Type Selection */}
              <div>
                <div className="block text-sm font-medium text-white mb-2">{t('stake.stakeType')}</div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, type: 'daily' })}
                    className={`p-3 rounded-lg border-2 transition-colors ${
                      formData.type === 'daily'
                        ? 'border-primary bg-primary/20 text-primary'
                        : 'border-border-dark text-text-muted hover:border-primary'
                    }`}
                  >
                    <div className="text-2xl mb-1">📅</div>
                    <div className="font-medium">{t('stake.dailyTask')}</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, type: 'attraction' })}
                    className={`p-3 rounded-lg border-2 transition-colors ${
                      formData.type === 'attraction'
                        ? 'border-primary bg-primary/20 text-primary'
                        : 'border-border-dark text-text-muted hover:border-primary'
                    }`}
                  >
                    <div className="text-2xl mb-1">🗺️</div>
                    <div className="font-medium">{t('stake.attraction')}</div>
                  </button>
                </div>
              </div>

              {/* Amount Input */}
              <div>
                <label htmlFor="amount" className="block text-sm font-medium text-white mb-2">
                  {t('stake.stakeAmount')}
                </label>
                <Input
                  id="amount"
                  type="number"
                  placeholder={t('stake.enterAmount')}
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  min="1"
                  max="1000"
                  required
                />
                <p className="text-xs text-text-muted mt-1">{t('stake.minMaxAmount')}</p>
              </div>

              {/* Milestone Selection */}
              <div>
                <div className="block text-sm font-medium text-white mb-2">{t('stake.milestone')}</div>
                <div className="grid grid-cols-4 gap-2">
                  {MILESTONES.map((days) => (
                    <button
                      key={days}
                      type="button"
                      onClick={() => setFormData({ ...formData, milestone: days })}
                      className={`p-2 rounded-lg border-2 transition-colors ${
                        formData.milestone === days
                          ? 'border-primary bg-primary/20 text-primary'
                          : 'border-border-dark text-text-muted hover:border-primary'
                      }`}
                    >
                      <div className="font-bold">{days}</div>
                      <div className="text-xs">{t('common.days')}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Mode Selection */}
              <div>
                <div className="block text-sm font-medium text-white mb-2">{t('stake.lockMode')}</div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, mode: 'sealed' })}
                    className={`p-3 rounded-lg border-2 transition-colors text-left ${
                      formData.mode === 'sealed'
                        ? 'border-primary bg-primary/20'
                        : 'border-border-dark hover:border-primary'
                    }`}
                  >
                    <div className="font-medium text-white mb-1">🔒 {t('stake.sealed')}</div>
                    <div className="text-xs text-text-muted">{t('stake.sealedDescription')}</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, mode: 'anytime' })}
                    className={`p-3 rounded-lg border-2 transition-colors text-left ${
                      formData.mode === 'anytime'
                        ? 'border-primary bg-primary/20'
                        : 'border-border-dark hover:border-primary'
                    }`}
                  >
                    <div className="font-medium text-white mb-1">🔓 {t('stake.anytime')}</div>
                    <div className="text-xs text-text-muted">{t('stake.anytimeDescription')}</div>
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                fullWidth
                size="lg"
                loading={loading}
                disabled={loading || !formData.amount}
              >
                {loading ? t('stake.creating') : t('stake.createStake')}
              </Button>
            </form>
          </Card.Body>
        </Card>

        {/* Info Card */}
        <div className="space-y-4">
          <Card>
            <Card.Header>
              <h2 className="text-xl font-semibold text-white">{t('stake.interestRates')}</h2>
            </Card.Header>
            <Card.Body>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-text-muted">30 {t('common.days')}</span>
                  <div className="flex gap-4">
                    <span className="text-primary font-medium">5%</span>
                    <span className="text-text-muted">2.5%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-text-muted">100 {t('common.days')}</span>
                  <div className="flex gap-4">
                    <span className="text-primary font-medium">8%</span>
                    <span className="text-text-muted">4%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-text-muted">200 {t('common.days')}</span>
                  <div className="flex gap-4">
                    <span className="text-primary font-medium">14%</span>
                    <span className="text-text-muted">7%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-text-muted">365 {t('common.days')}</span>
                  <div className="flex gap-4">
                    <span className="text-primary font-medium">20%</span>
                    <span className="text-text-muted">10%</span>
                  </div>
                </div>
                <div className="pt-2 border-t border-border-dark">
                  <div className="flex gap-4 text-xs">
                    <span className="text-primary">{t('stake.sealedMode')}</span>
                    <span className="text-text-muted">{t('stake.anytimeMode')}</span>
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>

          <Card>
            <Card.Header>
              <h2 className="text-xl font-semibold text-white">{t('stake.rewards')}</h2>
            </Card.Header>
            <Card.Body>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🧧</span>
                  <span className="text-text-muted">{t('stake.dailyRedPackets')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🎰</span>
                  <span className="text-text-muted">{t('stake.lotteryChances')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🏆</span>
                  <span className="text-text-muted">{t('stake.achievementBadges')}</span>
                </div>
              </div>
            </Card.Body>
          </Card>
        </div>
      </div>

      {/* Existing Stakes */}
      {stakes.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">{t('stake.yourStakes')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {stakes.map((stake) => (
              <StakeCard
                key={stake.id}
                stake={stake}
                onCheckin={() => navigate(`/checkin/${stake.id}`)}
                onViewDetails={() => navigate(`/calendar/${stake.id}`)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
