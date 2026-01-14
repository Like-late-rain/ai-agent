/**
 * @file AttractionsPage Component
 * @description Page for browsing attraction tasks
 */

import { TaskCard } from '@/components/business/TaskCard'
import { Button } from '@/components/common/Button'
import { Card } from '@/components/common/Card'
import type { AttractionTask } from '@/types/models.types'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

/**
 * AttractionsPage Component
 */
export function AttractionsPage() {
  const { t } = useTranslation()
  const [filter, setFilter] = useState<'all' | 'active' | 'upcoming' | 'expiring'>('all')

  // Mock attraction tasks
  const tasks: AttractionTask[] = [
    {
      id: '1',
      name: t('attractionsPage.tasks.greatWall.name'),
      description: t('attractionsPage.tasks.greatWall.description'),
      location: {
        name: t('attractionsPage.tasks.greatWall.locationName'),
        address: t('attractionsPage.tasks.greatWall.locationAddress'),
        lat: 40.4319,
        lng: 116.5704,
        radius: 500,
      },
      coverImage: 'https://picsum.photos/400/300?random=1',
      overviewImage: 'https://picsum.photos/800/600?random=1',
      duration: 7,
      difficulty: 'hard',
      rewardApy: 25,
      minStake: 100,
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-02-01'),
      status: 'active',
      createdAt: new Date('2023-12-01'),
    },
    {
      id: '2',
      name: t('attractionsPage.tasks.cherryBlossom.name'),
      description: t('attractionsPage.tasks.cherryBlossom.description'),
      location: {
        name: t('attractionsPage.tasks.cherryBlossom.locationName'),
        address: t('attractionsPage.tasks.cherryBlossom.locationAddress'),
        lat: 35.6852,
        lng: 139.7103,
        radius: 300,
      },
      coverImage: 'https://picsum.photos/400/300?random=2',
      overviewImage: 'https://picsum.photos/800/600?random=2',
      duration: 5,
      difficulty: 'easy',
      rewardApy: 15,
      minStake: 50,
      startDate: new Date('2024-03-01'),
      endDate: new Date('2024-04-15'),
      status: 'upcoming',
      createdAt: new Date('2023-12-15'),
    },
    {
      id: '3',
      name: t('attractionsPage.tasks.alpineAdventure.name'),
      description: t('attractionsPage.tasks.alpineAdventure.description'),
      location: {
        name: t('attractionsPage.tasks.alpineAdventure.locationName'),
        address: t('attractionsPage.tasks.alpineAdventure.locationAddress'),
        lat: 45.9763,
        lng: 7.6586,
        radius: 1000,
      },
      coverImage: 'https://picsum.photos/400/300?random=3',
      overviewImage: 'https://picsum.photos/800/600?random=3',
      duration: 10,
      difficulty: 'medium',
      rewardApy: 20,
      minStake: 200,
      startDate: new Date('2024-01-10'),
      endDate: new Date('2024-01-25'),
      status: 'expiring',
      createdAt: new Date('2023-11-01'),
    },
  ]

  const filteredTasks = tasks.filter((task) => {
    if (filter === 'all') return true
    return task.status === filter
  })

  const handleJoinTask = (task: AttractionTask) => {
    alert(t('attractionsPage.alerts.joining', { name: task.name }))
  }

  const handleViewDetails = (task: AttractionTask) => {
    alert(t('attractionsPage.alerts.viewing', { name: task.name }))
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">{t('attractionsPage.title')}</h1>
        <p className="text-text-muted">{t('attractionsPage.subtitle')}</p>
      </div>

      {/* Filter Tabs */}
      <Card>
        <Card.Body>
          <div className="flex gap-2 overflow-x-auto">
            {[
              { value: 'all', label: t('attractionsPage.filters.all'), icon: '🗺️' },
              { value: 'active', label: t('attractionsPage.filters.active'), icon: '🔥' },
              { value: 'upcoming', label: t('attractionsPage.filters.upcoming'), icon: '📅' },
              { value: 'expiring', label: t('attractionsPage.filters.expiring'), icon: '⏰' },
            ].map((tab) => (
              <button
                key={tab.value}
                type="button"
                onClick={() => setFilter(tab.value as typeof filter)}
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

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <Card.Body>
            <p className="text-sm text-text-muted mb-1">
              {t('attractionsPage.stats.availableTasks')}
            </p>
            <p className="text-2xl font-bold text-white">{tasks.length}</p>
          </Card.Body>
        </Card>
        <Card>
          <Card.Body>
            <p className="text-sm text-text-muted mb-1">
              {t('attractionsPage.stats.totalRewards')}
            </p>
            <p className="text-2xl font-bold text-primary">
              {tasks.reduce((sum, task) => sum + task.minStake, 0)} TCK
            </p>
          </Card.Body>
        </Card>
        <Card>
          <Card.Body>
            <p className="text-sm text-text-muted mb-1">{t('attractionsPage.stats.avgApy')}</p>
            <p className="text-2xl font-bold text-white">
              {(tasks.reduce((sum, task) => sum + task.rewardApy, 0) / tasks.length).toFixed(1)}%
            </p>
          </Card.Body>
        </Card>
      </div>

      {/* Task Grid */}
      {filteredTasks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onJoin={handleJoinTask}
              onViewDetails={handleViewDetails}
            />
          ))}
        </div>
      ) : (
        <Card>
          <Card.Body>
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🗺️</div>
              <h3 className="text-xl font-semibold text-white mb-2">
                {t('attractionsPage.empty.title')}
              </h3>
              <p className="text-text-muted mb-6">
                {t('attractionsPage.empty.description')}
              </p>
              <Button variant="primary" onClick={() => setFilter('all')}>
                {t('attractionsPage.empty.cta')}
              </Button>
            </div>
          </Card.Body>
        </Card>
      )}
    </div>
  )
}
