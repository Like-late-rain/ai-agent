/**
 * @file Checkin Controller
 * @description Handle checkin-related requests
 */

import { ValidationError } from '@/middlewares/error.middleware'
import {
  canMakeup,
  getCalendar,
  getCheckinsByStakeId,
  submitCheckin,
  submitMakeup,
} from '@/services/checkin.service'
import { getStakeById } from '@/services/staking.service'
import { success } from '@/utils/response'
import {
  validateCheckinContent,
  validateCheckinImages,
  validateLocation,
  validateMakeupDate,
} from '@/validators/checkin.validator'
import type { Context } from 'koa'

/**
 * Submit daily checkin
 * POST /api/checkin/daily/submit
 */
export async function submitDaily(ctx: Context): Promise<void> {
  const { userId } = ctx.state.user
  const { stakeId, content, images, location } = ctx.request.body as {
    stakeId: string
    content: string
    images: string[]
    location: { lat: number; lng: number } | null
  }

  if (!stakeId) {
    throw new ValidationError('Stake ID is required')
  }

  // Validate input
  validateCheckinContent(content)
  validateCheckinImages(images)
  validateLocation(location)

  // Submit checkin
  const result = await submitCheckin(userId, stakeId, { content, images, location })

  ctx.status = 201
  ctx.body = success(result, 'Checkin submitted successfully')
}

/**
 * Submit makeup checkin
 * POST /api/checkin/daily/makeup
 */
export async function submitMakeupCheckin(ctx: Context): Promise<void> {
  const { userId } = ctx.state.user
  const { stakeId, date, content, images, location } = ctx.request.body as {
    stakeId: string
    date: string
    content: string
    images: string[]
    location: { lat: number; lng: number } | null
  }

  if (!stakeId || !date) {
    throw new ValidationError('Stake ID and date are required')
  }

  // Get stake to validate date
  const stake = await getStakeById(stakeId)
  if (!stake) {
    throw new ValidationError('Stake not found')
  }

  // Validate input
  validateCheckinContent(content)
  validateCheckinImages(images)
  validateLocation(location)
  validateMakeupDate(date, stake.startDate)

  // Submit makeup
  const checkin = await submitMakeup(userId, stakeId, date, { content, images, location })

  ctx.status = 201
  ctx.body = success(checkin, 'Makeup checkin submitted successfully')
}

/**
 * Get checkin calendar
 * GET /api/checkin/daily/calendar
 */
export async function getCheckinCalendar(ctx: Context): Promise<void> {
  const { userId } = ctx.state.user
  const { year, month } = ctx.query as { year?: string; month?: string }

  if (!year || !month) {
    throw new ValidationError('Year and month are required')
  }

  const yearNum = Number.parseInt(year, 10)
  const monthNum = Number.parseInt(month, 10)

  if (Number.isNaN(yearNum) || Number.isNaN(monthNum)) {
    throw new ValidationError('Year and month must be numbers')
  }

  if (monthNum < 1 || monthNum > 12) {
    throw new ValidationError('Month must be between 1 and 12')
  }

  const calendar = await getCalendar(userId, yearNum, monthNum)

  ctx.body = success(calendar)
}

/**
 * Check if can makeup
 * GET /api/checkin/daily/can-makeup
 */
export async function checkCanMakeup(ctx: Context): Promise<void> {
  const { userId } = ctx.state.user
  const { stakeId, date } = ctx.query as { stakeId?: string; date?: string }

  if (!stakeId || !date) {
    throw new ValidationError('Stake ID and date are required')
  }

  const result = await canMakeup(userId, stakeId, date)

  ctx.body = success(result)
}

/**
 * Get checkins by stake
 * GET /api/checkin/stake/:stakeId
 */
export async function getStakeCheckins(ctx: Context): Promise<void> {
  const { stakeId } = ctx.params

  const checkins = await getCheckinsByStakeId(stakeId)

  ctx.body = success(checkins)
}
