/**
 * @file Lottery Service
 * @description Handle lottery operations
 */

import { LOTTERY_PRIZES } from '@/constants/business'
import { ConflictError, NotFoundError } from '@/middlewares/error.middleware'
import { rewardRepository } from '@/repositories/reward.repository'
import { userRepository } from '@/repositories/user.repository'
import type { Reward } from '@/types/models.types'

/**
 * Get lottery chances for user
 * @param userId - User ID
 * @returns Number of lottery chances
 */
export async function getLotteryChances(userId: string): Promise<number> {
  const user = await userRepository.findById(userId)

  if (!user) {
    throw new NotFoundError('User not found')
  }

  return user.lotteryChances
}

/**
 * Execute lottery spin
 * @param userId - User ID
 * @returns Prize and reward
 */
export async function executeSpin(userId: string): Promise<{
  prize: {
    id: string
    name: string
    value: number
    type: 'cash' | 'voucher' | 'physical'
    description?: string
  }
  reward: Reward
}> {
  const user = await userRepository.findById(userId)

  if (!user) {
    throw new NotFoundError('User not found')
  }

  if (user.lotteryChances <= 0) {
    throw new ConflictError('No lottery chances available')
  }

  // Decrement lottery chances
  await userRepository.decrementLotteryChances(userId, 1)

  // Select prize based on probability
  const prize = selectPrize()

  // Create reward
  const reward = await rewardRepository.create({
    userId,
    stakeId: '', // Empty for lottery rewards
    type: 'lottery',
    amount: prize.value,
    badgeId: null,
    expireAt: null,
    claimed: false,
    claimedAt: null,
    createdAt: new Date(),
  })

  // Auto-claim the reward
  await rewardRepository.claim(reward.id)

  return {
    prize,
    reward,
  }
}

/**
 * Select a prize based on probability
 */
function selectPrize(): {
  id: string
  name: string
  value: number
  type: 'cash' | 'voucher' | 'physical'
  description?: string
} {
  const random = Math.random()
  let cumulativeProbability = 0

  for (const prize of LOTTERY_PRIZES) {
    cumulativeProbability += prize.probability

    if (random <= cumulativeProbability) {
      return prize
    }
  }

  // Fallback to last prize
  return LOTTERY_PRIZES[LOTTERY_PRIZES.length - 1]
}

/**
 * Get lottery history for user
 * @param userId - User ID
 * @returns List of lottery rewards
 */
export async function getLotteryHistory(userId: string): Promise<Reward[]> {
  return await rewardRepository.findByType(userId, 'lottery')
}

/**
 * Get total lottery winnings for user
 * @param userId - User ID
 * @returns Total amount won from lottery
 */
export async function getTotalLotteryWinnings(userId: string): Promise<number> {
  return await rewardRepository.getTotalAmountByType(userId, 'lottery')
}
