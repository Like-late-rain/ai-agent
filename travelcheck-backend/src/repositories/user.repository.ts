/**
 * @file User Repository
 * @description Data access layer for user operations
 */

import type { User } from '@/types/models.types'
import { BaseRepository } from './base.repository'

/**
 * User repository class
 */
export class UserRepository extends BaseRepository<User> {
  constructor() {
    super('users.json')
  }

  /**
   * Find user by wallet address
   */
  async findByWalletAddress(walletAddress: string): Promise<User | null> {
    return await this.findOne(
      (user) => user.walletAddress.toLowerCase() === walletAddress.toLowerCase()
    )
  }

  /**
   * Create or update user
   */
  async upsertByWalletAddress(
    walletAddress: string,
    data: Partial<Omit<User, 'id' | 'walletAddress'>>
  ): Promise<User> {
    const existingUser = await this.findByWalletAddress(walletAddress)

    if (existingUser) {
      const updated = await this.update(existingUser.id, data)
      if (!updated) {
        throw new Error('Failed to update user')
      }
      return updated
    }

    return await this.create({
      walletAddress,
      nickname: null,
      avatar: null,
      totalCheckins: 0,
      currentStreak: 0,
      maxStreak: 0,
      lotteryChances: 0,
      badges: [],
      createdAt: new Date(),
      ...data,
    })
  }

  /**
   * Increment lottery chances
   */
  async incrementLotteryChances(userId: string, amount = 1): Promise<User | null> {
    const user = await this.findById(userId)
    if (!user) {
      return null
    }

    return await this.update(userId, {
      lotteryChances: user.lotteryChances + amount,
    })
  }

  /**
   * Decrement lottery chances
   */
  async decrementLotteryChances(userId: string, amount = 1): Promise<User | null> {
    const user = await this.findById(userId)
    if (!user || user.lotteryChances < amount) {
      return null
    }

    return await this.update(userId, {
      lotteryChances: user.lotteryChances - amount,
    })
  }

  /**
   * Add badge to user
   */
  async addBadge(userId: string, badgeId: string): Promise<User | null> {
    const user = await this.findById(userId)
    if (!user) {
      return null
    }

    if (user.badges.includes(badgeId)) {
      return user
    }

    return await this.update(userId, {
      badges: [...user.badges, badgeId],
    })
  }

  /**
   * Update user streak
   */
  async updateStreak(userId: string, currentStreak: number): Promise<User | null> {
    const user = await this.findById(userId)
    if (!user) {
      return null
    }

    const maxStreak = Math.max(user.maxStreak, currentStreak)

    return await this.update(userId, {
      currentStreak,
      maxStreak,
    })
  }
}

export const userRepository = new UserRepository()
