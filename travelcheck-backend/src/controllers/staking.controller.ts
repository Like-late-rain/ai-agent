/**
 * @file Staking Controller
 * @description Handle staking-related requests
 */

import type { Milestone } from '@/constants/business'
import { NotFoundError } from '@/middlewares/error.middleware'
import {
  createDailyStake,
  getActiveStakes,
  getStakeById,
  getStakesByUserId,
  switchMilestone,
  withdrawStake,
} from '@/services/staking.service'
import type { StakeMode } from '@/types/models.types'
import { success } from '@/utils/response'
import { validateCreateStake, validateSwitchMilestone } from '@/validators/staking.validator'
import type { Context } from 'koa'

/**
 * Create daily stake
 * POST /api/staking/daily
 */
export async function createDaily(ctx: Context): Promise<void> {
  const { userId } = ctx.state.user
  const body = ctx.request.body as {
    amount: number
    milestone: Milestone
    mode: StakeMode
  }

  // Validate input
  validateCreateStake(body)

  // Create stake
  const stake = await createDailyStake(userId, body)

  ctx.status = 201
  ctx.body = success(stake, 'Daily stake created successfully')
}

/**
 * Get my stakes
 * GET /api/staking/my
 */
export async function getMyStakes(ctx: Context): Promise<void> {
  const { userId } = ctx.state.user
  const { status } = ctx.query as { status?: string }

  const stakes =
    status === 'active' ? await getActiveStakes(userId) : await getStakesByUserId(userId)

  ctx.body = success(stakes)
}

/**
 * Get stake by ID
 * GET /api/staking/:id
 */
export async function getStake(ctx: Context): Promise<void> {
  const { id } = ctx.params
  const stake = await getStakeById(id)

  if (!stake) {
    throw new NotFoundError('Stake not found')
  }

  ctx.body = success(stake)
}

/**
 * Switch milestone
 * PUT /api/staking/:id/milestone
 */
export async function updateMilestone(ctx: Context): Promise<void> {
  const { userId } = ctx.state.user
  const { id } = ctx.params
  const { milestone } = ctx.request.body as { milestone: Milestone }

  // Get current stake to validate
  const currentStake = await getStakeById(id)
  if (!currentStake) {
    throw new NotFoundError('Stake not found')
  }

  // Validate milestone switch
  validateSwitchMilestone({
    milestone,
    currentMilestone: currentStake.milestone,
  })

  // Switch milestone
  const stake = await switchMilestone(id, userId, milestone)

  ctx.body = success(stake, 'Milestone updated successfully')
}

/**
 * Withdraw stake
 * POST /api/staking/:id/withdraw
 */
export async function withdraw(ctx: Context): Promise<void> {
  const { userId } = ctx.state.user
  const { id } = ctx.params

  const result = await withdrawStake(id, userId)

  ctx.body = success(result, 'Stake withdrawn successfully')
}
