/**
 * @file CalendarPage Component
 * @description Page displaying check-in calendar
 */

import { Button } from '@/components/common/Button'
import { Card } from '@/components/common/Card'
import { CalendarGrid } from '@/components/business/CalendarGrid'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

/**
 * CalendarPage Component
 */
export function CalendarPage() {
  const { stakeId } = useParams<{ stakeId: string }>()
  const navigate = useNavigate()
  const [year] = useState(2024)
  const [month] = useState(1)

  // Mock checkin data
  const checkins = {
    '2024-01-01': { status: 'checked' as const, canMakeup: false },
    '2024-01-02': { status: 'checked' as const, canMakeup: false },
    '2024-01-03': { status: 'missed' as const, canMakeup: true },
    '2024-01-04': { status: 'checked' as const, canMakeup: false },
    '2024-01-05': { status: 'makeup' as const, canMakeup: false },
  }

  const handleDayClick = (date: Date) => {
    console.log('Clicked date:', date)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Check-In Calendar</h1>
          <p className="text-text-muted">Track your check-in history</p>
        </div>
        <Button variant="primary" onClick={() => navigate(`/checkin/${stakeId}`)}>
          Check In Today
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <Card.Body>
            <p className="text-sm text-text-muted mb-1">Total Check-ins</p>
            <p className="text-2xl font-bold text-white">15</p>
          </Card.Body>
        </Card>
        <Card>
          <Card.Body>
            <p className="text-sm text-text-muted mb-1">Current Streak</p>
            <p className="text-2xl font-bold text-primary">12 days</p>
          </Card.Body>
        </Card>
        <Card>
          <Card.Body>
            <p className="text-sm text-text-muted mb-1">Makeup Chances</p>
            <p className="text-2xl font-bold text-white">2 / 3</p>
          </Card.Body>
        </Card>
        <Card>
          <Card.Body>
            <p className="text-sm text-text-muted mb-1">Completion</p>
            <p className="text-2xl font-bold text-primary">50%</p>
          </Card.Body>
        </Card>
      </div>

      {/* Calendar */}
      <Card>
        <Card.Body>
          <CalendarGrid year={year} month={month} checkins={checkins} onDayClick={handleDayClick} />
        </Card.Body>
      </Card>

      {/* Recent Activity */}
      <Card>
        <Card.Header>
          <h2 className="text-xl font-semibold text-white">Recent Check-Ins</h2>
        </Card.Header>
        <Card.Body>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-start gap-3 p-3 bg-background-dark rounded-lg">
                <div className="text-2xl">✅</div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-white">Check-in Day {i}</span>
                    <span className="text-xs text-text-muted">2 days ago</span>
                  </div>
                  <p className="text-sm text-text-muted line-clamp-2">
                    Amazing day exploring the city center. Visited the historic district and enjoyed
                    local cuisine...
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card.Body>
      </Card>
    </div>
  )
}
