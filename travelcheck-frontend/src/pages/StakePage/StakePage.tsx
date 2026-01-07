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
import { useNavigate } from 'react-router-dom'

/**
 * StakePage Component
 */
export function StakePage() {
  const navigate = useNavigate()
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
        <h1 className="text-3xl font-bold text-white mb-2">Create Stake</h1>
        <p className="text-text-muted">Stake TCK tokens and start your journey</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Create Stake Form */}
        <Card>
          <Card.Header>
            <h2 className="text-xl font-semibold text-white">New Stake</h2>
          </Card.Header>
          <Card.Body>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Type Selection */}
              <div>
                <div className="block text-sm font-medium text-white mb-2">Stake Type</div>
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
                    <div className="font-medium">Daily Task</div>
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
                    <div className="font-medium">Attraction</div>
                  </button>
                </div>
              </div>

              {/* Amount Input */}
              <div>
                <label htmlFor="amount" className="block text-sm font-medium text-white mb-2">
                  Stake Amount (TCK)
                </label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="Enter amount (1-1000)"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  min="1"
                  max="1000"
                  required
                />
                <p className="text-xs text-text-muted mt-1">Minimum: 1 TCK, Maximum: 1000 TCK</p>
              </div>

              {/* Milestone Selection */}
              <div>
                <div className="block text-sm font-medium text-white mb-2">Milestone (Days)</div>
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
                      <div className="text-xs">days</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Mode Selection */}
              <div>
                <div className="block text-sm font-medium text-white mb-2">Lock Mode</div>
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
                    <div className="font-medium text-white mb-1">🔒 Sealed</div>
                    <div className="text-xs text-text-muted">Higher rewards, locked period</div>
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
                    <div className="font-medium text-white mb-1">🔓 Anytime</div>
                    <div className="text-xs text-text-muted">Lower rewards, withdraw anytime</div>
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
                {loading ? 'Creating...' : 'Create Stake'}
              </Button>
            </form>
          </Card.Body>
        </Card>

        {/* Info Card */}
        <div className="space-y-4">
          <Card>
            <Card.Header>
              <h2 className="text-xl font-semibold text-white">Interest Rates</h2>
            </Card.Header>
            <Card.Body>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-text-muted">30 Days</span>
                  <div className="flex gap-4">
                    <span className="text-primary font-medium">5%</span>
                    <span className="text-text-muted">2.5%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-text-muted">100 Days</span>
                  <div className="flex gap-4">
                    <span className="text-primary font-medium">8%</span>
                    <span className="text-text-muted">4%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-text-muted">200 Days</span>
                  <div className="flex gap-4">
                    <span className="text-primary font-medium">14%</span>
                    <span className="text-text-muted">7%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-text-muted">365 Days</span>
                  <div className="flex gap-4">
                    <span className="text-primary font-medium">20%</span>
                    <span className="text-text-muted">10%</span>
                  </div>
                </div>
                <div className="pt-2 border-t border-border-dark">
                  <div className="flex gap-4 text-xs">
                    <span className="text-primary">Sealed Mode</span>
                    <span className="text-text-muted">Anytime Mode</span>
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>

          <Card>
            <Card.Header>
              <h2 className="text-xl font-semibold text-white">Rewards</h2>
            </Card.Header>
            <Card.Body>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🧧</span>
                  <span className="text-text-muted">Daily red packets (0.1%-0.3%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🎰</span>
                  <span className="text-text-muted">Lottery chances for prizes</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🏆</span>
                  <span className="text-text-muted">Achievement badges</span>
                </div>
              </div>
            </Card.Body>
          </Card>
        </div>
      </div>

      {/* Existing Stakes */}
      {stakes.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Your Stakes</h2>
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
