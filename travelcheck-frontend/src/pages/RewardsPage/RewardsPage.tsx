/**
 * @file RewardsPage Component
 * @description Page for viewing and claiming rewards
 */

import { Badge } from '@/components/common/Badge'
import { Button } from '@/components/common/Button'
import { Card } from '@/components/common/Card'
import { LotteryWheel } from '@/components/business/LotteryWheel'
import { RedPacket } from '@/components/business/RedPacket'
import type { LotteryPrize, Reward } from '@/types/models.types'
import { useState } from 'react'

/**
 * RewardsPage Component
 */
export function RewardsPage() {
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
    { id: '1', name: 'First Check-in', icon: '🎯', earned: true },
    { id: '2', name: '7-Day Streak', icon: '🔥', earned: true },
    { id: '3', name: '30-Day Streak', icon: '⭐', earned: false },
    { id: '4', name: 'Perfect Month', icon: '💯', earned: false },
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
    alert(`Claimed ${reward.amount} TCK!`)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Rewards</h1>
        <p className="text-text-muted">View and claim your earned rewards</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <Card.Body>
            <p className="text-sm text-text-muted mb-1">Total Earned</p>
            <p className="text-2xl font-bold text-primary">125.5 TCK</p>
          </Card.Body>
        </Card>
        <Card>
          <Card.Body>
            <p className="text-sm text-text-muted mb-1">Unclaimed</p>
            <p className="text-2xl font-bold text-white">8.7 TCK</p>
          </Card.Body>
        </Card>
        <Card>
          <Card.Body>
            <p className="text-sm text-text-muted mb-1">Lottery Chances</p>
            <p className="text-2xl font-bold text-primary">{lotteryChances}</p>
          </Card.Body>
        </Card>
        <Card>
          <Card.Body>
            <p className="text-sm text-text-muted mb-1">Badges Earned</p>
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
              { value: 'redpackets', label: 'Red Packets', icon: '🧧' },
              { value: 'lottery', label: 'Lottery', icon: '🎰' },
              { value: 'badges', label: 'Badges', icon: '🏆' },
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
                    <Badge variant="success">Earned</Badge>
                  ) : (
                    <Badge variant="default">Locked</Badge>
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
          <h2 className="text-xl font-semibold text-white">Recent Rewards</h2>
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
                    <p className="font-medium text-white">Daily Red Packet</p>
                    <p className="text-xs text-text-muted">{i} days ago</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-primary">+5.5 TCK</p>
                  <Badge variant="success" size="sm">
                    Claimed
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
