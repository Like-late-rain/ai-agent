/**
 * @file Task Service
 * @description Handle attraction task operations
 */

import { ConflictError, NotFoundError, ValidationError } from '@/middlewares/error.middleware'
import { stakeRepository } from '@/repositories/stake.repository'
import { taskRepository } from '@/repositories/task.repository'
import type { AttractionTask, Stake } from '@/types/models.types'

/**
 * Get attractions with filters
 * @param filters - Filter options
 * @returns List of attractions
 */
export async function getAttractions(filters?: {
  status?: 'upcoming' | 'active' | 'expiring' | 'completed'
  difficulty?: 'easy' | 'medium' | 'hard'
  lat?: number
  lng?: number
  radius?: number
}): Promise<AttractionTask[]> {
  // Update task statuses first
  await taskRepository.updateTaskStatuses()

  let tasks: AttractionTask[]

  // Filter by status
  if (filters?.status) {
    tasks = await taskRepository.findByStatus(filters.status)
  } else {
    tasks = await taskRepository.findAll()
  }

  // Filter by difficulty
  if (filters?.difficulty) {
    tasks = tasks.filter((task) => task.difficulty === filters.difficulty)
  }

  // Filter by location
  if (filters?.lat !== undefined && filters?.lng !== undefined) {
    const radius = filters.radius || 10000 // Default 10km
    tasks = await taskRepository.findByLocation(filters.lat, filters.lng, radius)
  }

  return tasks
}

/**
 * Get attraction by ID
 * @param id - Attraction ID
 * @returns Attraction task or null
 */
export async function getAttractionById(id: string): Promise<AttractionTask | null> {
  return await taskRepository.findById(id)
}

/**
 * Join an attraction task (create attraction stake)
 * @param userId - User ID
 * @param taskId - Attraction task ID
 * @param stakeData - Stake data
 * @returns Created stake
 */
export async function joinAttraction(
  userId: string,
  taskId: string,
  stakeData: {
    amount: number
    mode: 'sealed' | 'anytime'
  }
): Promise<Stake> {
  // Get attraction task
  const task = await taskRepository.findById(taskId)

  if (!task) {
    throw new NotFoundError('Attraction task not found')
  }

  if (task.status !== 'active') {
    throw new ConflictError('This attraction task is not active')
  }

  // Validate stake amount
  if (stakeData.amount < task.minStake) {
    throw new ValidationError(`Minimum stake amount is ${task.minStake}`)
  }

  // For simplicity, we'll allow multiple attraction stakes
  // You can add more complex logic here if needed to check for existing stakes

  // Calculate end date based on task duration
  const startDate = new Date()
  const endDate = new Date(startDate)
  endDate.setDate(endDate.getDate() + task.duration)

  // Create attraction stake
  const stake = await stakeRepository.create({
    userId,
    type: 'attraction',
    amount: stakeData.amount,
    milestone: task.duration as 30 | 100 | 200 | 365,
    mode: stakeData.mode,
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
 * Get active attractions
 * @returns List of active attractions
 */
export async function getActiveAttractions(): Promise<AttractionTask[]> {
  await taskRepository.updateTaskStatuses()
  return await taskRepository.findActive()
}

/**
 * Search attractions by name or location
 * @param query - Search query
 * @returns Matching attractions
 */
export async function searchAttractions(query: string): Promise<AttractionTask[]> {
  const allTasks = await taskRepository.findAll()

  const lowerQuery = query.toLowerCase()

  return allTasks.filter(
    (task) =>
      task.name.toLowerCase().includes(lowerQuery) ||
      task.description.toLowerCase().includes(lowerQuery) ||
      task.location.name.toLowerCase().includes(lowerQuery) ||
      task.location.address.toLowerCase().includes(lowerQuery)
  )
}
