/**
 * @file Reward Controller
 * @description Handle reward-related requests
 */

import { NotFoundError } from '@/middlewares/error.middleware'
import { userRepository } from '@/repositories/user.repository'
import { executeSpin, getLotteryChances, getLotteryHistory } from '@/services/lottery.service'
import { claimRedPacket, getUnclaimedRedPackets } from '@/services/redpacket.service'
import { success } from '@/utils/response'
import type { Context } from 'koa'

/**
 * Claim red packet
 * POST /api/rewards/redpacket/claim
 */
export async function claimRedPacketReward(ctx: Context): Promise<void> {
  const { userId } = ctx.state.user
  const { rewardId } = ctx.request.body as { rewardId?: string }

  if (!rewardId) {
    ctx.status = 400
    ctx.body = success(null, 'Reward ID is required')
    return
  }

  const reward = await claimRedPacket(rewardId, userId)

  ctx.body = success(reward, 'Red packet claimed successfully')
}

/**
 * Get unclaimed red packets
 * GET /api/rewards/redpacket/unclaimed
 */
export async function getUnclaimedRedPacket(ctx: Context): Promise<void> {
  const { userId } = ctx.state.user

  const rewards = await getUnclaimedRedPackets(userId)

  ctx.body = success(rewards)
}

/**
 * Get lottery chances
 * GET /api/rewards/lottery/chances
 */
export async function getChances(ctx: Context): Promise<void> {
  const { userId } = ctx.state.user

  const chances = await getLotteryChances(userId)

  ctx.body = success({ chances })
}

/**
 * Spin lottery
 * POST /api/rewards/lottery/spin
 */
export async function spin(ctx: Context): Promise<void> {
  const { userId } = ctx.state.user

  const result = await executeSpin(userId)

  ctx.body = success(result, `Congratulations! You won ${result.prize.name}`)
}

/**
 * Get lottery history
 * GET /api/rewards/lottery/history
 */
export async function getHistory(ctx: Context): Promise<void> {
  const { userId } = ctx.state.user

  const history = await getLotteryHistory(userId)

  ctx.body = success(history)
}

/**
 * Get badges
 * GET /api/rewards/badges
 */
export async function getBadges(ctx: Context): Promise<void> {
  const { userId } = ctx.state.user

  const user = await userRepository.findById(userId)

  if (!user) {
    throw new NotFoundError('User not found')
  }

  ctx.body = success({ badges: user.badges })
}
