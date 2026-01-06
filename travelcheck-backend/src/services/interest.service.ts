/**
 * @file Interest Calculation Service
 * @description Calculate interest for stakes based on mode and performance
 */

import {
  INTEREST_RATES_ANYTIME,
  INTEREST_RATES_SEALED,
  type Milestone,
  REDPACKET_RATE_ANYTIME,
  REDPACKET_RATE_SEALED,
} from '@/constants/business'
import type { StakeMode } from '@/types/models.types'

/**
 * Calculate interest for a stake
 * @param amount - Stake amount
 * @param milestone - Milestone (30, 100, 200, 365)
 * @param mode - Stake mode (sealed or anytime)
 * @param days - Number of days checked in
 * @param isPerfect - Whether all checkins were perfect
 * @returns Calculated interest amount
 */
export function calculateInterest(
  amount: number,
  milestone: Milestone,
  mode: StakeMode,
  days: number,
  isPerfect: boolean
): number {
  // Get base interest rate based on mode
  const baseRate =
    mode === 'sealed' ? INTEREST_RATES_SEALED[milestone] : INTEREST_RATES_ANYTIME[milestone]

  // Calculate base interest
  let interest = amount * baseRate

  // Apply penalties or bonuses
  if (mode === 'sealed') {
    // Sealed mode: full rate if perfect, 50% if not
    if (!isPerfect) {
      interest = interest * 0.5
    }
  }
  // Anytime mode always gets half the sealed rate (already reflected in INTEREST_RATES_ANYTIME)

  // Pro-rate interest based on actual days checked
  const completionRatio = days / milestone
  interest = interest * completionRatio

  return Math.floor(interest * 100) / 100 // Round to 2 decimal places
}

/**
 * Calculate total return for a stake
 * @param amount - Stake amount
 * @param milestone - Milestone (30, 100, 200, 365)
 * @param mode - Stake mode (sealed or anytime)
 * @param days - Number of days checked in
 * @param isPerfect - Whether all checkins were perfect
 * @returns Total return (principal + interest)
 */
export function calculateTotalReturn(
  amount: number,
  milestone: Milestone,
  mode: StakeMode,
  days: number,
  isPerfect: boolean
): number {
  const interest = calculateInterest(amount, milestone, mode, days, isPerfect)
  return amount + interest
}

/**
 * Calculate penalty for early withdrawal
 * @param amount - Stake amount
 * @param accumulatedInterest - Interest accumulated so far
 * @param mode - Stake mode
 * @returns Penalty amount
 */
export function calculateWithdrawalPenalty(
  _amount: number,
  accumulatedInterest: number,
  mode: StakeMode
): number {
  if (mode === 'anytime') {
    // No penalty for anytime mode
    return 0
  }

  // Sealed mode: lose all accumulated interest
  return accumulatedInterest
}

/**
 * Calculate red packet amount
 * @param amount - Stake amount
 * @param mode - Stake mode
 * @returns Random red packet amount within range
 */
export function calculateRedPacket(amount: number, mode: StakeMode): number {
  const rate = mode === 'sealed' ? REDPACKET_RATE_SEALED : REDPACKET_RATE_ANYTIME

  // Generate random amount between min and max
  const min = amount * rate.min
  const max = amount * rate.max
  const randomAmount = min + Math.random() * (max - min)

  return Math.floor(randomAmount * 100) / 100 // Round to 2 decimal places
}

/**
 * Get interest rate for display
 * @param milestone - Milestone (30, 100, 200, 365)
 * @param mode - Stake mode
 * @returns Interest rate as percentage
 */
export function getInterestRate(milestone: Milestone, mode: StakeMode): number {
  const rate =
    mode === 'sealed' ? INTEREST_RATES_SEALED[milestone] : INTEREST_RATES_ANYTIME[milestone]
  return rate * 100
}
