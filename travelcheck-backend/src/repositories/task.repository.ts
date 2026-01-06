/**
 * @file Task Repository
 * @description Data access layer for attraction task operations
 */

import type { AttractionTask } from '@/types/models.types'
import { BaseRepository } from './base.repository'

/**
 * Task repository class
 */
export class TaskRepository extends BaseRepository<AttractionTask> {
  constructor() {
    super('tasks.json')
  }

  /**
   * Find active tasks
   */
  async findActive(): Promise<AttractionTask[]> {
    return await this.findMany((task) => task.status === 'active')
  }

  /**
   * Find tasks by status
   */
  async findByStatus(
    status: 'upcoming' | 'active' | 'expiring' | 'completed'
  ): Promise<AttractionTask[]> {
    return await this.findMany((task) => task.status === status)
  }

  /**
   * Find tasks by difficulty
   */
  async findByDifficulty(difficulty: 'easy' | 'medium' | 'hard'): Promise<AttractionTask[]> {
    return await this.findMany((task) => task.difficulty === difficulty)
  }

  /**
   * Find tasks by location (within radius)
   */
  async findByLocation(lat: number, lng: number, maxDistance = 10000): Promise<AttractionTask[]> {
    const tasks = await this.findAll()

    return tasks.filter((task) => {
      const distance = this.calculateDistance(lat, lng, task.location.lat, task.location.lng)
      return distance <= maxDistance
    })
  }

  /**
   * Calculate distance between two coordinates (Haversine formula)
   */
  private calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371e3 // Earth's radius in meters
    const φ1 = (lat1 * Math.PI) / 180
    const φ2 = (lat2 * Math.PI) / 180
    const Δφ = ((lat2 - lat1) * Math.PI) / 180
    const Δλ = ((lng2 - lng1) * Math.PI) / 180

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2)

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

    return R * c
  }

  /**
   * Update task status based on dates
   */
  async updateTaskStatuses(): Promise<void> {
    const tasks = await this.findAll()
    const now = new Date()

    for (const task of tasks) {
      const startDate = new Date(task.startDate)
      const endDate = new Date(task.endDate)

      let newStatus: AttractionTask['status'] = task.status

      if (now < startDate) {
        newStatus = 'upcoming'
      } else if (now > endDate) {
        newStatus = 'completed'
      } else if (now > new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000)) {
        // 7 days before end
        newStatus = 'expiring'
      } else {
        newStatus = 'active'
      }

      if (newStatus !== task.status) {
        await this.update(task.id, { status: newStatus })
      }
    }
  }
}

export const taskRepository = new TaskRepository()
