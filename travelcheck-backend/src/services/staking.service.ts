/**
 * @file Staking Service
 * @description Handle staking operations
 */

import type { Milestone } from '@/constants/business'
import { ConflictError, NotFoundError, ValidationError } from '@/middlewares/error.middleware'
import { stakeRepository } from '@/repositories/stake.repository'
import type { Stake, StakeMode } from '@/types/models.types'
import { calculateInterest, calculateWithdrawalPenalty } from './interest.service'

/**
 * Create a daily stake
 * @param userId - User ID
 * @param data - Stake data
 * @returns Created stake
 */
export async function createDailyStake(
  userId: string,
  data: {
    amount: number
    milestone: Milestone
    mode: StakeMode
  }
): Promise<Stake> {
  // Check if user already has an active daily stake
  const existingStake = await stakeRepository.findActiveDailyStake(userId)

  if (existingStake) {
    throw new ConflictError('You already have an active daily stake')
  }

  // Calculate end date
  const startDate = new Date()
  const endDate = new Date(startDate)
  endDate.setDate(endDate.getDate() + data.milestone)

  // Create stake
  const stake = await stakeRepository.create({
    userId,
    type: 'daily',
    amount: data.amount,
    milestone: data.milestone,
    mode: data.mode,
    checkedDays: 0,
    isPerfect: true,
    accumulatedInterest: 0,
    status: 'active',
    startDate,
    endDate,
    completedAt: null,
    withdrawnAt: null,
    createdAt: new Date(),
  })

  return stake
}

/**
 * Get stakes by user ID
 * @param userId - User ID
 * @returns List of stakes
 */
export async function getStakesByUserId(userId: string): Promise<Stake[]> {
  return await stakeRepository.findByUserId(userId)
}

/**
 * Get active stakes by user ID
 * @param userId - User ID
 * @returns List of active stakes
 */
export async function getActiveStakes(userId: string): Promise<Stake[]> {
  return await stakeRepository.findActiveByUserId(userId)
}

/**
 * Get stake by ID
 * @param id - Stake ID
 * @returns Stake or null
 */
export async function getStakeById(id: string): Promise<Stake | null> {
  return await stakeRepository.findById(id)
}

/**
 * Switch milestone for a stake
 * @param id - Stake ID
 * @param userId - User ID
 * @param newMilestone - New milestone
 * @returns Updated stake
 */
export async function switchMilestone(
  id: string,
  userId: string,
  newMilestone: Milestone
): Promise<Stake> {
  const stake = await stakeRepository.findById(id)

  if (!stake) {
    throw new NotFoundError('Stake not found')
  }

  if (stake.userId !== userId) {
    throw new ConflictError('This stake does not belong to you')
  }

  if (stake.status !== 'active') {
    throw new ConflictError('Can only switch milestone for active stakes')
  }

  if (newMilestone <= stake.milestone) {
    throw new ValidationError('New milestone must be greater than current milestone')
  }

  // Update milestone
  const updated = await stakeRepository.updateMilestone(id, newMilestone)

  if (!updated) {
    throw new NotFoundError('Failed to update milestone')
  }

  return updated
}

/**
 * Withdraw a stake
 * @param id - Stake ID
 * @param userId - User ID
 * @returns Withdrawal result
 */
export async function withdrawStake(
  id: string,
  userId: string
): Promise<{ amount: number; stake: Stake }> {
  const stake = await stakeRepository.findById(id)

  if (!stake) {
    throw new NotFoundError('Stake not found')
  }

  if (stake.userId !== userId) {
    throw new ConflictError('This stake does not belong to you')
  }

  if (stake.status !== 'active') {
    throw new ConflictError('Stake is not active')
  }

  if (stake.mode === 'sealed') {
    // Check if milestone is reached
    if (stake.checkedDays < stake.milestone) {
      throw new ConflictError(
        'Cannot withdraw sealed stake before milestone is reached. Consider switching to anytime mode.'
      )
    }
  }

  // Calculate final interest
  const interest = calculateInterest(
    stake.amount,
    stake.milestone,
    stake.mode,
    stake.checkedDays,
    stake.isPerfect
  )

  // Calculate penalty if applicable
  const penalty = calculateWithdrawalPenalty(stake.amount, stake.accumulatedInterest, stake.mode)

  // Total amount to return
  const totalAmount = stake.amount + interest - penalty

  // Update stake status
  const updated = await stakeRepository.update(id, {
    status: 'withdrawn',
    withdrawnAt: new Date(),
    accumulatedInterest: interest,
  })

  if (!updated) {
    throw new NotFoundError('Failed to withdraw stake')
  }

  return {
    amount: totalAmount,
    stake: updated,
  }
}

/**
 * Complete a stake when milestone is reached
 * @param id - Stake ID
 * @returns Completed stake
 */
export async function completeStake(id: string): Promise<Stake> {
  const stake = await stakeRepository.findById(id)

  if (!stake) {
    throw new NotFoundError('Stake not found')
  }

  if (stake.status !== 'active') {
    throw new ConflictError('Stake is not active')
  }

  if (stake.checkedDays < stake.milestone) {
    throw new ConflictError('Milestone not reached yet')
  }

  // Update status
  const updated = await stakeRepository.updateStatus(id, 'completed')

  if (!updated) {
    throw new NotFoundError('Failed to complete stake')
  }

  return updated
}
