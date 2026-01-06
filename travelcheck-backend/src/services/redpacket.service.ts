/**
 * @file Red Packet Service
 * @description Handle red packet creation and claiming
 */

import { ConflictError, NotFoundError } from '@/middlewares/error.middleware'
import { rewardRepository } from '@/repositories/reward.repository'
import { stakeRepository } from '@/repositories/stake.repository'
import type { Reward } from '@/types/models.types'
import { calculateRedPacket } from './interest.service'

/**
 * Create red packet reward for a stake
 * @param stakeId - Stake ID
 * @param userId - User ID
 * @returns Created reward
 */
export async function createRedPacket(stakeId: string, userId: string): Promise<Reward> {
  const stake = await stakeRepository.findById(stakeId)

  if (!stake) {
    throw new NotFoundError('Stake not found')
  }

  // Calculate red packet amount
  const amount = calculateRedPacket(stake.amount, stake.mode)

  // Set expiration date (24 hours from now)
  const expireAt = new Date()
  expireAt.setHours(expireAt.getHours() + 24)

  // Create reward
  const reward = await rewardRepository.create({
    userId,
    stakeId,
    type: 'redpacket',
    amount,
    badgeId: null,
    expireAt,
    claimed: false,
    claimedAt: null,
    createdAt: new Date(),
  })

  return reward
}

/**
 * Claim a red packet
 * @param rewardId - Reward ID
 * @param userId - User ID
 * @returns Claimed reward
 */
export async function claimRedPacket(rewardId: string, userId: string): Promise<Reward> {
  const reward = await rewardRepository.findById(rewardId)

  if (!reward) {
    throw new NotFoundError('Red packet not found')
  }

  if (reward.userId !== userId) {
    throw new ConflictError('This red packet does not belong to you')
  }

  if (reward.claimed) {
    throw new ConflictError('Red packet already claimed')
  }

  // Check expiration
  if (reward.expireAt && new Date(reward.expireAt) < new Date()) {
    throw new ConflictError('Red packet has expired')
  }

  // Claim the reward
  const claimedReward = await rewardRepository.claim(rewardId)

  if (!claimedReward) {
    throw new NotFoundError('Failed to claim red packet')
  }

  return claimedReward
}

/**
 * Get unclaimed red packets for user
 * @param userId - User ID
 * @returns List of unclaimed red packets
 */
export async function getUnclaimedRedPackets(userId: string): Promise<Reward[]> {
  return await rewardRepository.findUnclaimedRedPackets(userId)
}

/**
 * Get total red packet earnings for user
 * @param userId - User ID
 * @returns Total amount earned from red packets
 */
export async function getTotalRedPacketEarnings(userId: string): Promise<number> {
  return await rewardRepository.getTotalAmountByType(userId, 'redpacket')
}

/**
 * Auto-expire old red packets (should be run periodically)
 */
export async function expireOldRedPackets(): Promise<number> {
  return await rewardRepository.deleteExpired()
}
