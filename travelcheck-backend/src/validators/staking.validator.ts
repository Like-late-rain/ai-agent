/**
 * @file Staking Validators
 * @description Validation functions for staking operations
 */

import { MAX_STAKE_AMOUNT, MILESTONES, MIN_STAKE_AMOUNT } from '@/constants/business'
import { ValidationError } from '@/middlewares/error.middleware'
import type { StakeMode } from '@/types/models.types'

/**
 * Validate create stake data
 */
export function validateCreateStake(data: {
  amount?: number
  milestone?: number
  mode?: string
}): void {
  // Validate amount
  if (typeof data.amount !== 'number' || Number.isNaN(data.amount)) {
    throw new ValidationError('Amount must be a number')
  }

  if (data.amount < MIN_STAKE_AMOUNT) {
    throw new ValidationError(`Amount must be at least ${MIN_STAKE_AMOUNT}`)
  }

  if (data.amount > MAX_STAKE_AMOUNT) {
    throw new ValidationError(`Amount must not exceed ${MAX_STAKE_AMOUNT}`)
  }

  // Validate milestone
  if (typeof data.milestone !== 'number') {
    throw new ValidationError('Milestone must be a number')
  }

  if (![30, 100, 200, 365].includes(data.milestone)) {
    throw new ValidationError(`Milestone must be one of: ${MILESTONES.join(', ')}`)
  }

  // Validate mode
  if (!data.mode || !['sealed', 'anytime'].includes(data.mode)) {
    throw new ValidationError('Mode must be either "sealed" or "anytime"')
  }
}

/**
 * Validate milestone switch
 */
export function validateSwitchMilestone(data: {
  milestone?: number
  currentMilestone?: number
}): void {
  // Validate milestone
  if (typeof data.milestone !== 'number') {
    throw new ValidationError('Milestone must be a number')
  }

  if (![30, 100, 200, 365].includes(data.milestone)) {
    throw new ValidationError(`Milestone must be one of: ${MILESTONES.join(', ')}`)
  }

  // Ensure new milestone is greater than current
  if (data.currentMilestone && data.milestone <= data.currentMilestone) {
    throw new ValidationError('New milestone must be greater than current milestone')
  }
}

/**
 * Validate stake mode
 */
export function validateStakeMode(mode: string): mode is StakeMode {
  return mode === 'sealed' || mode === 'anytime'
}

/**
 * Validate milestone value
 */
export function validateMilestone(milestone: number): milestone is 30 | 100 | 200 | 365 {
  return [30, 100, 200, 365].includes(milestone)
}
