/**
 * @file Stake Repository
 * @description Data access layer for stake operations
 */

import type { Stake, StakeStatus } from '@/types/models.types'
import { BaseRepository } from './base.repository'

/**
 * Stake repository class
 */
export class StakeRepository extends BaseRepository<Stake> {
  constructor() {
    super('stakes.json')
  }

  /**
   * Find stakes by user ID
   */
  async findByUserId(userId: string): Promise<Stake[]> {
    return await this.findMany((stake) => stake.userId === userId)
  }

  /**
   * Find active stakes by user ID
   */
  async findActiveByUserId(userId: string): Promise<Stake[]> {
    return await this.findMany((stake) => stake.userId === userId && stake.status === 'active')
  }

  /**
   * Find stake by user ID and type
   */
  async findByUserIdAndType(userId: string, type: 'daily' | 'attraction'): Promise<Stake[]> {
    return await this.findMany((stake) => stake.userId === userId && stake.type === type)
  }

  /**
   * Find active daily stake for user
   */
  async findActiveDailyStake(userId: string): Promise<Stake | null> {
    return await this.findOne(
      (stake) => stake.userId === userId && stake.type === 'daily' && stake.status === 'active'
    )
  }

  /**
   * Update stake status
   */
  async updateStatus(id: string, status: StakeStatus): Promise<Stake | null> {
    const updates: Partial<Stake> = { status }

    if (status === 'completed') {
      updates.completedAt = new Date()
    } else if (status === 'withdrawn') {
      updates.withdrawnAt = new Date()
    }

    return await this.update(id, updates)
  }

  /**
   * Increment checked days
   */
  async incrementCheckedDays(id: string): Promise<Stake | null> {
    const stake = await this.findById(id)
    if (!stake) {
      return null
    }

    return await this.update(id, {
      checkedDays: stake.checkedDays + 1,
    })
  }

  /**
   * Add accumulated interest
   */
  async addInterest(id: string, interest: number): Promise<Stake | null> {
    const stake = await this.findById(id)
    if (!stake) {
      return null
    }

    return await this.update(id, {
      accumulatedInterest: stake.accumulatedInterest + interest,
    })
  }

  /**
   * Mark stake as imperfect
   */
  async markImperfect(id: string): Promise<Stake | null> {
    return await this.update(id, {
      isPerfect: false,
    })
  }

  /**
   * Update milestone
   */
  async updateMilestone(id: string, milestone: 30 | 100 | 200 | 365): Promise<Stake | null> {
    const stake = await this.findById(id)
    if (!stake) {
      return null
    }

    // Calculate new end date
    const startDate = new Date(stake.startDate)
    const endDate = new Date(startDate)
    endDate.setDate(endDate.getDate() + milestone)

    return await this.update(id, {
      milestone,
      endDate,
    })
  }
}

export const stakeRepository = new StakeRepository()
