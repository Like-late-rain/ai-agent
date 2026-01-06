/**
 * @file Task Controller
 * @description Handle task-related requests
 */

import { ValidationError } from '@/middlewares/error.middleware'
import {
  getAttractionById,
  getAttractions,
  joinAttraction,
  searchAttractions,
} from '@/services/task.service'
import { success } from '@/utils/response'
import type { Context } from 'koa'

/**
 * List attractions
 * GET /api/tasks/attractions
 */
export async function listAttractions(ctx: Context): Promise<void> {
  const { status, difficulty, lat, lng, radius, search } = ctx.query as {
    status?: 'upcoming' | 'active' | 'expiring' | 'completed'
    difficulty?: 'easy' | 'medium' | 'hard'
    lat?: string
    lng?: string
    radius?: string
    search?: string
  }

  // Handle search
  if (search) {
    const attractions = await searchAttractions(search)
    ctx.body = success(attractions)
    return
  }

  // Build filters
  type FilterType = {
    status?: 'upcoming' | 'active' | 'expiring' | 'completed'
    difficulty?: 'easy' | 'medium' | 'hard'
    lat?: number
    lng?: number
    radius?: number
  }

  const filters: FilterType = {}

  if (status) {
    filters.status = status
  }

  if (difficulty) {
    filters.difficulty = difficulty
  }

  if (lat && lng) {
    filters.lat = Number.parseFloat(lat)
    filters.lng = Number.parseFloat(lng)

    if (Number.isNaN(filters.lat) || Number.isNaN(filters.lng)) {
      throw new ValidationError('Invalid latitude or longitude')
    }

    if (radius) {
      filters.radius = Number.parseFloat(radius)
      if (Number.isNaN(filters.radius)) {
        throw new ValidationError('Invalid radius')
      }
    }
  }

  const attractions = await getAttractions(filters)

  ctx.body = success(attractions)
}

/**
 * Get attraction detail
 * GET /api/tasks/attractions/:id
 */
export async function getAttractionDetail(ctx: Context): Promise<void> {
  const { id } = ctx.params

  const attraction = await getAttractionById(id)

  if (!attraction) {
    ctx.status = 404
    ctx.body = success(null, 'Attraction not found')
    return
  }

  ctx.body = success(attraction)
}

/**
 * Join attraction task
 * POST /api/tasks/:id/join
 */
export async function joinTask(ctx: Context): Promise<void> {
  const { userId } = ctx.state.user
  const { id } = ctx.params
  const { amount, mode } = ctx.request.body as {
    amount?: number
    mode?: 'sealed' | 'anytime'
  }

  if (!amount || !mode) {
    throw new ValidationError('Amount and mode are required')
  }

  if (typeof amount !== 'number' || amount <= 0) {
    throw new ValidationError('Amount must be a positive number')
  }

  if (mode !== 'sealed' && mode !== 'anytime') {
    throw new ValidationError('Mode must be either "sealed" or "anytime"')
  }

  const stake = await joinAttraction(userId, id, { amount, mode })

  ctx.status = 201
  ctx.body = success(stake, 'Successfully joined attraction task')
}
