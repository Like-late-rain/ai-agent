/**
 * @file AttractionsPage Component
 * @description Page for browsing attraction tasks
 */

import { Button } from '@/components/common/Button'
import { Card } from '@/components/common/Card'
import { TaskCard } from '@/components/business/TaskCard'
import type { AttractionTask } from '@/types/models.types'
import { useState } from 'react'

/**
 * AttractionsPage Component
 */
export function AttractionsPage() {
  const [filter, setFilter] = useState<'all' | 'active' | 'upcoming' | 'expiring'>('all')

  // Mock attraction tasks
  const tasks: AttractionTask[] = [
    {
      id: '1',
      name: 'Great Wall Challenge',
      description: 'Visit and check in at the magnificent Great Wall of China',
      location: 'Beijing, China',
      coverImage: 'https://picsum.photos/400/300?random=1',
      overviewImage: 'https://picsum.photos/800/600?random=1',
      duration: 7,
      difficulty: 'hard',
      rewardApy: 25,
      minStake: 100,
      participants: 156,
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-02-01'),
      status: 'active',
      createdAt: new Date('2023-12-01'),
    },
    {
      id: '2',
      name: 'Cherry Blossom Tour',
      description: 'Experience the beauty of Japanese cherry blossoms in spring',
      location: 'Tokyo, Japan',
      coverImage: 'https://picsum.photos/400/300?random=2',
      overviewImage: 'https://picsum.photos/800/600?random=2',
      duration: 5,
      difficulty: 'easy',
      rewardApy: 15,
      minStake: 50,
      participants: 234,
      startDate: new Date('2024-03-01'),
      endDate: new Date('2024-04-15'),
      status: 'upcoming',
      createdAt: new Date('2023-12-15'),
    },
    {
      id: '3',
      name: 'Alpine Adventure',
      description: 'Explore the stunning Swiss Alps and mountain villages',
      location: 'Zermatt, Switzerland',
      coverImage: 'https://picsum.photos/400/300?random=3',
      overviewImage: 'https://picsum.photos/800/600?random=3',
      duration: 10,
      difficulty: 'medium',
      rewardApy: 20,
      minStake: 200,
      participants: 89,
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
    alert(`Joining task: ${task.name}`)
  }

  const handleViewDetails = (task: AttractionTask) => {
    alert(`Viewing details for: ${task.name}`)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Attraction Tasks</h1>
        <p className="text-text-muted">Explore amazing destinations and earn rewards</p>
      </div>

      {/* Filter Tabs */}
      <Card>
        <Card.Body>
          <div className="flex gap-2 overflow-x-auto">
            {[
              { value: 'all', label: 'All Tasks', icon: '🗺️' },
              { value: 'active', label: 'Active', icon: '🔥' },
              { value: 'upcoming', label: 'Upcoming', icon: '📅' },
              { value: 'expiring', label: 'Expiring Soon', icon: '⏰' },
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
            <p className="text-sm text-text-muted mb-1">Available Tasks</p>
            <p className="text-2xl font-bold text-white">{tasks.length}</p>
          </Card.Body>
        </Card>
        <Card>
          <Card.Body>
            <p className="text-sm text-text-muted mb-1">Total Participants</p>
            <p className="text-2xl font-bold text-primary">
              {tasks.reduce((sum, task) => sum + task.participants, 0)}
            </p>
          </Card.Body>
        </Card>
        <Card>
          <Card.Body>
            <p className="text-sm text-text-muted mb-1">Avg. Reward APY</p>
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
              <h3 className="text-xl font-semibold text-white mb-2">No tasks found</h3>
              <p className="text-text-muted mb-6">
                Try selecting a different filter or check back later for new attractions
              </p>
              <Button variant="primary" onClick={() => setFilter('all')}>
                View All Tasks
              </Button>
            </div>
          </Card.Body>
        </Card>
      )}
    </div>
  )
}
