/**
 * @file Checkin Validators
 * @description Validation functions for checkin operations
 */

import { ValidationError } from '@/middlewares/error.middleware'

/**
 * Validate checkin content
 */
export function validateCheckinContent(content: string): void {
  if (!content || typeof content !== 'string') {
    throw new ValidationError('Content is required and must be a string')
  }

  const trimmed = content.trim()

  if (trimmed.length === 0) {
    throw new ValidationError('Content cannot be empty')
  }

  if (trimmed.length < 10) {
    throw new ValidationError('Content must be at least 10 characters')
  }

  if (trimmed.length > 1000) {
    throw new ValidationError('Content must not exceed 1000 characters')
  }
}

/**
 * Validate checkin images
 */
export function validateCheckinImages(images: string[]): void {
  if (!Array.isArray(images)) {
    throw new ValidationError('Images must be an array')
  }

  if (images.length === 0) {
    throw new ValidationError('At least one image is required')
  }

  if (images.length > 9) {
    throw new ValidationError('Maximum 9 images allowed')
  }

  for (const image of images) {
    if (typeof image !== 'string' || image.trim().length === 0) {
      throw new ValidationError('All images must be valid strings')
    }
  }
}

/**
 * Validate location data
 */
export function validateLocation(location: { lat?: number; lng?: number } | null): void {
  if (location === null) {
    return
  }

  if (typeof location !== 'object') {
    throw new ValidationError('Location must be an object')
  }

  if (typeof location.lat !== 'number' || typeof location.lng !== 'number') {
    throw new ValidationError('Location must have lat and lng as numbers')
  }

  if (location.lat < -90 || location.lat > 90) {
    throw new ValidationError('Latitude must be between -90 and 90')
  }

  if (location.lng < -180 || location.lng > 180) {
    throw new ValidationError('Longitude must be between -180 and 180')
  }
}

/**
 * Validate makeup checkin date
 */
export function validateMakeupDate(date: string, stakeStartDate: Date): void {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/

  if (!dateRegex.test(date)) {
    throw new ValidationError('Invalid date format. Expected YYYY-MM-DD')
  }

  const makeupDate = new Date(date)
  const now = new Date()
  now.setHours(0, 0, 0, 0)

  if (Number.isNaN(makeupDate.getTime())) {
    throw new ValidationError('Invalid date')
  }

  // Cannot makeup future dates
  if (makeupDate >= now) {
    throw new ValidationError('Cannot makeup future dates')
  }

  // Cannot makeup dates before stake started
  const stakeStart = new Date(stakeStartDate)
  stakeStart.setHours(0, 0, 0, 0)

  if (makeupDate < stakeStart) {
    throw new ValidationError('Cannot makeup dates before stake started')
  }
}
