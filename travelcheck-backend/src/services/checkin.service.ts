/**
 * @file Checkin Service
 * @description Handle checkin operations
 */

import { MAKEUP_DEADLINE_DAYS, MAX_MAKEUP_CHANCES } from '@/constants/business'
import { ConflictError, NotFoundError } from '@/middlewares/error.middleware'
import { checkinRepository } from '@/repositories/checkin.repository'
import { stakeRepository } from '@/repositories/stake.repository'
import { userRepository } from '@/repositories/user.repository'
import type { Checkin, Reward } from '@/types/models.types'
import { createRedPacket } from './redpacket.service'

/**
 * Submit daily checkin
 * @param userId - User ID
 * @param stakeId - Stake ID
 * @param data - Checkin data
 * @returns Checkin and optional reward
 */
export async function submitCheckin(
  userId: string,
  stakeId: string,
  data: {
    content: string
    images: string[]
    location: { lat: number; lng: number } | null
  }
): Promise<{ checkin: Checkin; reward?: Reward }> {
  // Get stake
  const stake = await stakeRepository.findById(stakeId)

  if (!stake) {
    throw new NotFoundError('Stake not found')
  }

  if (stake.userId !== userId) {
    throw new ConflictError('This stake does not belong to you')
  }

  if (stake.status !== 'active') {
    throw new ConflictError('Stake is not active')
  }

  // Check if already checked in today
  const today = new Date().toISOString().split('T')[0]
  const existingCheckin = await checkinRepository.findByStakeIdAndDate(stakeId, today)

  if (existingCheckin) {
    throw new ConflictError('Already checked in today')
  }

  // Create checkin
  const checkin = await checkinRepository.create({
    stakeId,
    userId,
    type: stake.type === 'attraction' ? 'attraction' : 'daily',
    content: data.content,
    images: data.images,
    location: data.location,
    date: today,
    createdAt: new Date(),
  })

  // Update stake
  await stakeRepository.incrementCheckedDays(stakeId)

  // Update user stats
  const user = await userRepository.findById(userId)
  if (user) {
    await userRepository.update(userId, {
      totalCheckins: user.totalCheckins + 1,
    })

    // Update streak
    const currentStreak = await checkinRepository.getCheckinStreak(userId)
    await userRepository.updateStreak(userId, currentStreak)
  }

  // Create red packet (10% chance)
  let reward: Reward | undefined
  if (Math.random() < 0.1) {
    reward = await createRedPacket(stakeId, userId)
  }

  // Check if milestone reached
  const updatedStake = await stakeRepository.findById(stakeId)
  if (updatedStake && updatedStake.checkedDays >= updatedStake.milestone) {
    await stakeRepository.updateStatus(stakeId, 'completed')
  }

  return { checkin, reward }
}

/**
 * Submit makeup checkin
 * @param userId - User ID
 * @param stakeId - Stake ID
 * @param date - Date to makeup (YYYY-MM-DD)
 * @param data - Checkin data
 * @returns Created checkin
 */
export async function submitMakeup(
  userId: string,
  stakeId: string,
  date: string,
  data: {
    content: string
    images: string[]
    location: { lat: number; lng: number } | null
  }
): Promise<Checkin> {
  // Get stake
  const stake = await stakeRepository.findById(stakeId)

  if (!stake) {
    throw new NotFoundError('Stake not found')
  }

  if (stake.userId !== userId) {
    throw new ConflictError('This stake does not belong to you')
  }

  if (stake.status !== 'active') {
    throw new ConflictError('Stake is not active')
  }

  // Check if can makeup
  const canMakeupResult = await canMakeup(userId, stakeId, date)
  if (!canMakeupResult.allowed) {
    throw new ConflictError(canMakeupResult.reason || 'Cannot makeup this date')
  }

  // Check if already checked in on this date
  const existingCheckin = await checkinRepository.findByStakeIdAndDate(stakeId, date)

  if (existingCheckin) {
    throw new ConflictError('Already checked in on this date')
  }

  // Create makeup checkin
  const checkin = await checkinRepository.create({
    stakeId,
    userId,
    type: 'makeup',
    content: data.content,
    images: data.images,
    location: data.location,
    date,
    createdAt: new Date(),
  })

  // Update stake
  await stakeRepository.incrementCheckedDays(stakeId)

  // Mark stake as imperfect
  await stakeRepository.markImperfect(stakeId)

  return checkin
}

/**
 * Check if user can makeup a checkin
 * @param userId - User ID
 * @param stakeId - Stake ID
 * @param date - Date to makeup
 * @returns Whether makeup is allowed
 */
export async function canMakeup(
  _userId: string,
  stakeId: string,
  date: string
): Promise<{ allowed: boolean; reason?: string }> {
  const stake = await stakeRepository.findById(stakeId)

  if (!stake) {
    return { allowed: false, reason: 'Stake not found' }
  }

  // Count makeup checkins used
  const makeupCount = await checkinRepository.countMakeupByStakeId(stakeId)

  if (makeupCount >= MAX_MAKEUP_CHANCES) {
    return { allowed: false, reason: 'Maximum makeup chances used' }
  }

  // Check if date is within deadline
  const makeupDate = new Date(date)
  const now = new Date()
  now.setHours(0, 0, 0, 0)

  const diffDays = Math.floor((now.getTime() - makeupDate.getTime()) / (1000 * 60 * 60 * 24))

  if (diffDays > MAKEUP_DEADLINE_DAYS) {
    return { allowed: false, reason: `Can only makeup within ${MAKEUP_DEADLINE_DAYS} days` }
  }

  // Check if date is not in future
  if (makeupDate >= now) {
    return { allowed: false, reason: 'Cannot makeup future dates' }
  }

  // Check if date is after stake start
  const stakeStart = new Date(stake.startDate)
  stakeStart.setHours(0, 0, 0, 0)

  if (makeupDate < stakeStart) {
    return { allowed: false, reason: 'Cannot makeup dates before stake started' }
  }

  return { allowed: true }
}

/**
 * Get checkin calendar for a month
 * @param userId - User ID
 * @param year - Year
 * @param month - Month (1-12)
 * @returns Calendar data
 */
export async function getCalendar(
  userId: string,
  year: number,
  month: number
): Promise<{
  year: number
  month: number
  checkins: Checkin[]
  dates: { [date: string]: Checkin }
}> {
  const checkins = await checkinRepository.getMonthlyCalendar(userId, year, month)

  // Create date map
  const dates: { [date: string]: Checkin } = {}
  for (const checkin of checkins) {
    dates[checkin.date] = checkin
  }

  return {
    year,
    month,
    checkins,
    dates,
  }
}

/**
 * Get checkins by stake ID
 * @param stakeId - Stake ID
 * @returns List of checkins
 */
export async function getCheckinsByStakeId(stakeId: string): Promise<Checkin[]> {
  return await checkinRepository.findByStakeId(stakeId)
}
