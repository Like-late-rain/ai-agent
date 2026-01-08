/**
 * @file HomePage Component
 * @description Home page with user stats and quick actions
 */

import { Button } from '@/components/common/Button'
import { Card } from '@/components/common/Card'
import { Loading } from '@/components/common/Loading'
import { useWallet } from '@/hooks/useWallet'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

/**
 * HomePage Component
 */
export function HomePage() {
  const { isConnected, address } = useWallet()
  const { t } = useTranslation()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalStakes: 0,
    activeStakes: 0,
    totalCheckins: 0,
    currentStreak: 0,
  })

  /**
   * Load user stats
   */
  useEffect(() => {
    // Simulate loading stats
    const timer = setTimeout(() => {
      if (isConnected) {
        setStats({
          totalStakes: 3,
          activeStakes: 2,
          totalCheckins: 45,
          currentStreak: 12,
        })
      }
      setLoading(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [isConnected])

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Card className="max-w-md text-center">
          <Card.Body>
            <div className="text-6xl mb-4">✈️</div>
            <h1 className="text-3xl font-bold text-primary mb-4">{t('home.welcomeTitle')}</h1>
            <p className="text-text-muted mb-6">{t('home.welcomeDescription')}</p>
            <div className="bg-background-dark rounded-lg p-4 mb-6">
              <p className="text-sm text-text-muted">{t('home.connectWalletPrompt')}</p>
            </div>
          </Card.Body>
        </Card>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loading size="lg" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">{t('home.welcomeBack')}</h1>
        <p className="text-text-muted">
          {address?.slice(0, 6)}...{address?.slice(-4)}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <Card.Body>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-muted">{t('home.totalStakes')}</p>
                <p className="text-2xl font-bold text-white mt-1">{stats.totalStakes}</p>
              </div>
              <div className="text-3xl">💰</div>
            </div>
          </Card.Body>
        </Card>

        <Card>
          <Card.Body>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-muted">{t('home.activeStakes')}</p>
                <p className="text-2xl font-bold text-primary mt-1">{stats.activeStakes}</p>
              </div>
              <div className="text-3xl">🔥</div>
            </div>
          </Card.Body>
        </Card>

        <Card>
          <Card.Body>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-muted">{t('home.totalCheckins')}</p>
                <p className="text-2xl font-bold text-white mt-1">{stats.totalCheckins}</p>
              </div>
              <div className="text-3xl">✅</div>
            </div>
          </Card.Body>
        </Card>

        <Card>
          <Card.Body>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-muted">{t('home.currentStreak')}</p>
                <p className="text-2xl font-bold text-primary mt-1">
                  {stats.currentStreak} {t('common.days')}
                </p>
              </div>
              <div className="text-3xl">🏆</div>
            </div>
          </Card.Body>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <Card.Header>
          <h2 className="text-xl font-semibold text-white">{t('home.quickActions')}</h2>
        </Card.Header>
        <Card.Body>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link to="/stake">
              <Button variant="primary" fullWidth size="lg">
                {t('home.createNewStake')}
              </Button>
            </Link>
            <Link to="/attractions">
              <Button variant="outline" fullWidth size="lg">
                {t('home.exploreAttractions')}
              </Button>
            </Link>
            <Link to="/rewards">
              <Button variant="outline" fullWidth size="lg">
                {t('home.viewRewards')}
              </Button>
            </Link>
          </div>
        </Card.Body>
      </Card>

      {/* Info Card */}
      <Card>
        <Card.Header>
          <h2 className="text-xl font-semibold text-white">{t('home.howItWorks')}</h2>
        </Card.Header>
        <Card.Body>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="text-2xl">1️⃣</div>
              <div>
                <h3 className="font-semibold text-white mb-1">{t('home.step1.title')}</h3>
                <p className="text-sm text-text-muted">{t('home.step1.description')}</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="text-2xl">2️⃣</div>
              <div>
                <h3 className="font-semibold text-white mb-1">{t('home.step2.title')}</h3>
                <p className="text-sm text-text-muted">{t('home.step2.description')}</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="text-2xl">3️⃣</div>
              <div>
                <h3 className="font-semibold text-white mb-1">{t('home.step3.title')}</h3>
                <p className="text-sm text-text-muted">{t('home.step3.description')}</p>
              </div>
            </div>
          </div>
        </Card.Body>
      </Card>
    </div>
  )
}
