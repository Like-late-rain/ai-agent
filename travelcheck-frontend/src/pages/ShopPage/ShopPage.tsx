/**
 * @file ShopPage Component
 * @description Page for viewing and redeeming prizes
 */

import { LotteryWheel } from '@/components/business/LotteryWheel'
import { Badge } from '@/components/common/Badge'
import { Button } from '@/components/common/Button'
import { Card } from '@/components/common/Card'
import type { LotteryPrize } from '@/types/models.types'
import { formatAmount } from '@/utils/format'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

/**
 * Prize item interface
 */
interface PrizeItem extends LotteryPrize {
  stock: number
  pointsCost?: number
}

/**
 * ShopPage Component
 */
export function ShopPage() {
  const { t } = useTranslation()
  const [userPoints] = useState(1250) // Mock user points
  const [lotteryChances] = useState(3) // Mock lottery chances
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'physical' | 'token' | 'lottery'>(
    'all'
  )

  // Mock prizes data
  const [prizes] = useState<PrizeItem[]>([
    {
      id: '1',
      name: 'Travel Backpack',
      type: 'physical',
      amount: null,
      probability: 0,
      image: 'https://picsum.photos/300/300?random=1',
      pointsCost: 500,
      stock: 10,
      createdAt: new Date('2024-01-01'),
    },
    {
      id: '2',
      name: 'Wireless Headphones',
      type: 'physical',
      amount: null,
      probability: 0,
      image: 'https://picsum.photos/300/300?random=2',
      pointsCost: 800,
      stock: 5,
      createdAt: new Date('2024-01-01'),
    },
    {
      id: '3',
      name: 'Smart Watch',
      type: 'physical',
      amount: null,
      probability: 0,
      image: 'https://picsum.photos/300/300?random=3',
      pointsCost: 1500,
      stock: 3,
      createdAt: new Date('2024-01-01'),
    },
    {
      id: '4',
      name: '50 TCK Tokens',
      type: 'token',
      amount: 50,
      probability: 0,
      image: null,
      pointsCost: 400,
      stock: 999,
      createdAt: new Date('2024-01-01'),
    },
    {
      id: '5',
      name: '100 TCK Tokens',
      type: 'token',
      amount: 100,
      probability: 0,
      image: null,
      pointsCost: 750,
      stock: 999,
      createdAt: new Date('2024-01-01'),
    },
    {
      id: '6',
      name: '500 TCK Tokens',
      type: 'token',
      amount: 500,
      probability: 0,
      image: null,
      pointsCost: 3500,
      stock: 999,
      createdAt: new Date('2024-01-01'),
    },
  ])

  const filteredPrizes = prizes.filter((prize) => {
    if (selectedCategory === 'all') return true
    return prize.type === selectedCategory
  })

  const handleRedeem = (prizeId: string, cost: number) => {
    if (cost > userPoints) {
      alert(t('shop.insufficientPoints', { defaultValue: 'Insufficient points' }))
      return
    }
    alert(`Redeeming prize ${prizeId}`)
  }

  const handleSpin = async (): Promise<LotteryPrize> => {
    if (lotteryChances <= 0) {
      alert(t('shop.noChances', { defaultValue: 'No lottery chances available' }))
    }

    // Mock lottery spin - return a random prize
    const mockPrizes: LotteryPrize[] = [
      {
        id: 'lottery-1',
        name: '100 TCK Tokens',
        type: 'token',
        amount: 100,
        probability: 0.3,
        image: null,
        createdAt: new Date(),
      },
      {
        id: 'lottery-2',
        name: 'Travel Voucher',
        type: 'physical',
        amount: null,
        probability: 0.1,
        image: 'https://picsum.photos/200/200?random=10',
        createdAt: new Date(),
      },
    ]

    const randomPrize = mockPrizes[Math.floor(Math.random() * mockPrizes.length)]
    return randomPrize
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">{t('shop.title')}</h1>
        <p className="text-text-muted">{t('shop.subtitle')}</p>
      </div>

      {/* User Points Card */}
      <Card>
        <Card.Body>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-muted mb-1">{t('shop.myPoints')}</p>
              <p className="text-3xl font-bold text-primary">{formatAmount(userPoints)}</p>
            </div>
            <div className="text-5xl">🎁</div>
          </div>
        </Card.Body>
      </Card>

      {/* Lottery Section */}
      <Card>
        <Card.Header>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">{t('shop.lottery')}</h2>
            <Badge variant="primary">
              {lotteryChances} {t('shop.chances', { defaultValue: 'chances' })}
            </Badge>
          </div>
        </Card.Header>
        <Card.Body>
          <div className="flex flex-col items-center">
            <LotteryWheel
              chances={lotteryChances}
              onSpin={handleSpin}
            />
            <p className="mt-4 text-sm text-text-muted text-center">
              {t('shop.lotteryDesc', {
                defaultValue: 'Spin the wheel to win amazing prizes! You get lottery chances from perfect check-in streaks.',
              })}
            </p>
          </div>
        </Card.Body>
      </Card>

      {/* Category Filter */}
      <Card>
        <Card.Body>
          <div className="flex gap-2 overflow-x-auto">
            {[
              { value: 'all' as const, label: t('common.all'), icon: '🎁' },
              { value: 'physical' as const, label: t('shop.physicalItems'), icon: '📦' },
              { value: 'token' as const, label: t('shop.tokenRewards'), icon: '💰' },
            ].map((tab) => (
              <button
                key={tab.value}
                type="button"
                onClick={() => setSelectedCategory(tab.value)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                  selectedCategory === tab.value
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

      {/* Prizes Grid */}
      {filteredPrizes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPrizes.map((prize) => (
            <Card key={prize.id} className="hover:border-primary transition-colors">
              {prize.image && (
                <div className="relative h-48 -m-4 mb-4 overflow-hidden rounded-t-lg">
                  <img
                    src={prize.image}
                    alt={prize.name}
                    className="w-full h-full object-cover"
                  />
                  {prize.stock < 5 && prize.stock > 0 && (
                    <div className="absolute top-4 right-4">
                      <Badge variant="danger">
                        {t('shop.limitedStock', { defaultValue: 'Limited Stock' })}
                      </Badge>
                    </div>
                  )}
                  {prize.stock === 0 && (
                    <div className="absolute inset-0 bg-background-dark/80 flex items-center justify-center">
                      <Badge variant="default" size="lg">
                        {t('shop.soldOut', { defaultValue: 'Sold Out' })}
                      </Badge>
                    </div>
                  )}
                </div>
              )}

              <Card.Header>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-1">{prize.name}</h3>
                    <Badge variant={prize.type === 'physical' ? 'info' : 'success'}>
                      {prize.type === 'physical' ? '📦 Physical' : '💰 Token'}
                    </Badge>
                  </div>
                  {!prize.image && <div className="text-4xl ml-2">💎</div>}
                </div>
              </Card.Header>

              <Card.Body>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-text-muted">
                      {t('shop.cost', { defaultValue: 'Cost' })}
                    </span>
                    <span className="text-lg font-bold text-primary">
                      {formatAmount(prize.pointsCost || 0)} pts
                    </span>
                  </div>

                  {prize.type === 'token' && prize.amount && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-text-muted">
                        {t('shop.value', { defaultValue: 'Value' })}
                      </span>
                      <span className="text-sm font-semibold text-white">
                        {formatAmount(prize.amount)} TCK
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-text-muted">
                      {t('shop.stock', { defaultValue: 'Stock' })}
                    </span>
                    <span className="text-sm font-semibold text-white">{prize.stock}</span>
                  </div>
                </div>
              </Card.Body>

              <Card.Footer>
                <Button
                  variant="primary"
                  size="md"
                  fullWidth
                  disabled={prize.stock === 0 || (prize.pointsCost || 0) > userPoints}
                  onClick={() => handleRedeem(prize.id, prize.pointsCost || 0)}
                >
                  {prize.stock === 0
                    ? t('shop.soldOut', { defaultValue: 'Sold Out' })
                    : (prize.pointsCost || 0) > userPoints
                      ? t('shop.insufficientPoints', { defaultValue: 'Insufficient Points' })
                      : t('shop.redeem')}
                </Button>
              </Card.Footer>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <Card.Body>
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🎁</div>
              <h3 className="text-xl font-semibold text-white mb-2">{t('shop.noPrizes')}</h3>
              <p className="text-text-muted">{t('shop.checkBackLater')}</p>
            </div>
          </Card.Body>
        </Card>
      )}
    </div>
  )
}
