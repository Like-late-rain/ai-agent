/**
 * @file Common Validators
 * @description Common validation functions
 */

import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE } from '@/constants/config'
import { ValidationError } from '@/middlewares/error.middleware'

/**
 * Validate pagination parameters
 */
export function validatePagination(
  page?: string | number,
  pageSize?: string | number
): {
  page: number
  pageSize: number
} {
  const parsedPage = Number(page) || DEFAULT_PAGE
  const parsedPageSize = Number(pageSize) || DEFAULT_PAGE_SIZE

  if (parsedPage < 1) {
    throw new ValidationError('Page must be greater than 0')
  }

  if (parsedPageSize < 1) {
    throw new ValidationError('Page size must be greater than 0')
  }

  if (parsedPageSize > MAX_PAGE_SIZE) {
    throw new ValidationError(`Page size must not exceed ${MAX_PAGE_SIZE}`)
  }

  return {
    page: parsedPage,
    pageSize: parsedPageSize,
  }
}

/**
 * Validate ID format (UUID)
 */
export function validateId(id: string): void {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

  if (!uuidRegex.test(id)) {
    throw new ValidationError('Invalid ID format')
  }
}

/**
 * Validate date format (YYYY-MM-DD)
 */
export function validateDate(date: string): void {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/

  if (!dateRegex.test(date)) {
    throw new ValidationError('Invalid date format. Expected YYYY-MM-DD')
  }

  const parsed = new Date(date)
  if (Number.isNaN(parsed.getTime())) {
    throw new ValidationError('Invalid date')
  }
}

/**
 * Validate wallet address
 */
export function validateWalletAddress(address: string): void {
  const addressRegex = /^0x[a-fA-F0-9]{40}$/

  if (!addressRegex.test(address)) {
    throw new ValidationError('Invalid wallet address')
  }
}

/**
 * Validate amount
 */
export function validateAmount(amount: number, min = 0, max = Number.POSITIVE_INFINITY): void {
  if (typeof amount !== 'number' || Number.isNaN(amount)) {
    throw new ValidationError('Amount must be a number')
  }

  if (amount < min) {
    throw new ValidationError(`Amount must be at least ${min}`)
  }

  if (amount > max) {
    throw new ValidationError(`Amount must not exceed ${max}`)
  }
}
