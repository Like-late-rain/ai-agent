/**
 * @file Reward Repository
 * @description Data access layer for reward operations
 */

import type { Reward } from '@/types/models.types'
import { BaseRepository } from './base.repository'

/**
 * Reward repository class
 */
export class RewardRepository extends BaseRepository<Reward> {
  constructor() {
    super('rewards.json')
  }

  /**
   * Find rewards by user ID
   */
  async findByUserId(userId: string): Promise<Reward[]> {
    return await this.findMany((reward) => reward.userId === userId)
  }

  /**
   * Find unclaimed rewards by user ID
   */
  async findUnclaimedByUserId(userId: string): Promise<Reward[]> {
    return await this.findMany((reward) => reward.userId === userId && !reward.claimed)
  }

  /**
   * Find rewards by stake ID
   */
  async findByStakeId(stakeId: string): Promise<Reward[]> {
    return await this.findMany((reward) => reward.stakeId === stakeId)
  }

  /**
   * Find rewards by type
   */
  async findByType(userId: string, type: 'redpacket' | 'lottery' | 'badge'): Promise<Reward[]> {
    return await this.findMany((reward) => reward.userId === userId && reward.type === type)
  }

  /**
   * Find unclaimed red packets
   */
  async findUnclaimedRedPackets(userId: string): Promise<Reward[]> {
    const now = new Date()

    return await this.findMany(
      (reward) =>
        reward.userId === userId &&
        reward.type === 'redpacket' &&
        !reward.claimed &&
        (!reward.expireAt || new Date(reward.expireAt) > now)
    )
  }

  /**
   * Claim a reward
   */
  async claim(id: string): Promise<Reward | null> {
    return await this.update(id, {
      claimed: true,
      claimedAt: new Date(),
    })
  }

  /**
   * Count claimed rewards by type
   */
  async countClaimedByType(
    userId: string,
    type: 'redpacket' | 'lottery' | 'badge'
  ): Promise<number> {
    return await this.countWhere(
      (reward) => reward.userId === userId && reward.type === type && reward.claimed
    )
  }

  /**
   * Get total reward amount by type
   */
  async getTotalAmountByType(
    userId: string,
    type: 'redpacket' | 'lottery' | 'badge'
  ): Promise<number> {
    const rewards = await this.findByType(userId, type)

    return rewards
      .filter((reward) => reward.claimed && reward.amount !== null)
      .reduce((total, reward) => total + (reward.amount || 0), 0)
  }

  /**
   * Delete expired unclaimed rewards
   */
  async deleteExpired(): Promise<number> {
    const rewards = await this.findAll()
    const now = new Date()
    let deletedCount = 0

    for (const reward of rewards) {
      if (!reward.claimed && reward.expireAt && new Date(reward.expireAt) < now) {
        await this.delete(reward.id)
        deletedCount++
      }
    }

    return deletedCount
  }
}

export const rewardRepository = new RewardRepository()
