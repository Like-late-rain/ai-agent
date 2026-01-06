/**
 * @file Checkin Repository
 * @description Data access layer for checkin operations
 */

import type { Checkin } from '@/types/models.types'
import { BaseRepository } from './base.repository'

/**
 * Checkin repository class
 */
export class CheckinRepository extends BaseRepository<Checkin> {
  constructor() {
    super('checkins.json')
  }

  /**
   * Find checkins by stake ID
   */
  async findByStakeId(stakeId: string): Promise<Checkin[]> {
    return await this.findMany((checkin) => checkin.stakeId === stakeId)
  }

  /**
   * Find checkins by user ID
   */
  async findByUserId(userId: string): Promise<Checkin[]> {
    return await this.findMany((checkin) => checkin.userId === userId)
  }

  /**
   * Find checkin by stake ID and date
   */
  async findByStakeIdAndDate(stakeId: string, date: string): Promise<Checkin | null> {
    return await this.findOne((checkin) => checkin.stakeId === stakeId && checkin.date === date)
  }

  /**
   * Find checkins by date range
   */
  async findByDateRange(userId: string, startDate: string, endDate: string): Promise<Checkin[]> {
    return await this.findMany(
      (checkin) => checkin.userId === userId && checkin.date >= startDate && checkin.date <= endDate
    )
  }

  /**
   * Count checkins for stake
   */
  async countByStakeId(stakeId: string): Promise<number> {
    return await this.countWhere((checkin) => checkin.stakeId === stakeId)
  }

  /**
   * Count makeup checkins for stake
   */
  async countMakeupByStakeId(stakeId: string): Promise<number> {
    return await this.countWhere(
      (checkin) => checkin.stakeId === stakeId && checkin.type === 'makeup'
    )
  }

  /**
   * Get checkin streak for user
   */
  async getCheckinStreak(userId: string): Promise<number> {
    const checkins = await this.findByUserId(userId)

    if (checkins.length === 0) {
      return 0
    }

    // Sort by date descending
    checkins.sort((a, b) => b.date.localeCompare(a.date))

    let streak = 0
    const currentDate = new Date()
    currentDate.setHours(0, 0, 0, 0)

    for (const checkin of checkins) {
      const checkinDate = new Date(checkin.date)
      checkinDate.setHours(0, 0, 0, 0)

      const diffDays = Math.floor(
        (currentDate.getTime() - checkinDate.getTime()) / (1000 * 60 * 60 * 24)
      )

      if (diffDays === streak) {
        streak++
      } else if (diffDays > streak) {
        break
      }
    }

    return streak
  }

  /**
   * Get monthly checkin calendar
   */
  async getMonthlyCalendar(userId: string, year: number, month: number): Promise<Checkin[]> {
    const startDate = `${year}-${String(month).padStart(2, '0')}-01`
    const endDate = `${year}-${String(month).padStart(2, '0')}-31`

    return await this.findByDateRange(userId, startDate, endDate)
  }
}

export const checkinRepository = new CheckinRepository()
