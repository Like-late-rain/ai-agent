/**
 * @file Validation Middleware
 * @description Request validation middleware
 */

import type { Context, Next } from 'koa'
import { ValidationError } from './error.middleware'

/**
 * Validation schema interface
 */
export interface ValidationSchema {
  [key: string]: {
    type: 'string' | 'number' | 'boolean' | 'array' | 'object'
    required?: boolean
    min?: number
    max?: number
    pattern?: RegExp
    custom?: (value: unknown) => boolean
  }
}

/**
 * Validate data against schema
 */
function validate(data: Record<string, unknown>, schema: ValidationSchema): string[] {
  const errors: string[] = []

  for (const [field, rules] of Object.entries(schema)) {
    const value = data[field]

    // Check required
    if (rules.required && (value === undefined || value === null || value === '')) {
      errors.push(`${field} is required`)
      continue
    }

    // Skip validation if not required and no value
    if (!rules.required && (value === undefined || value === null)) {
      continue
    }

    // Type validation
    const actualType = Array.isArray(value) ? 'array' : typeof value
    if (actualType !== rules.type) {
      errors.push(`${field} must be ${rules.type}`)
      continue
    }

    // Min/Max for numbers
    if (rules.type === 'number' && typeof value === 'number') {
      if (rules.min !== undefined && value < rules.min) {
        errors.push(`${field} must be at least ${rules.min}`)
      }
      if (rules.max !== undefined && value > rules.max) {
        errors.push(`${field} must be at most ${rules.max}`)
      }
    }

    // Min/Max for strings (length)
    if (rules.type === 'string' && typeof value === 'string') {
      if (rules.min !== undefined && value.length < rules.min) {
        errors.push(`${field} must be at least ${rules.min} characters`)
      }
      if (rules.max !== undefined && value.length > rules.max) {
        errors.push(`${field} must be at most ${rules.max} characters`)
      }
    }

    // Pattern validation for strings
    if (
      rules.type === 'string' &&
      typeof value === 'string' &&
      rules.pattern &&
      !rules.pattern.test(value)
    ) {
      errors.push(`${field} format is invalid`)
    }

    // Custom validation
    if (rules.custom && !rules.custom(value)) {
      errors.push(`${field} validation failed`)
    }
  }

  return errors
}

/**
 * Validate request body
 */
export function validateBody(schema: ValidationSchema) {
  return async (ctx: Context, next: Next): Promise<void> => {
    const errors = validate(ctx.request.body as Record<string, unknown>, schema)

    if (errors.length > 0) {
      throw new ValidationError(errors.join(', '))
    }

    await next()
  }
}

/**
 * Validate query parameters
 */
export function validateQuery(schema: ValidationSchema) {
  return async (ctx: Context, next: Next): Promise<void> => {
    const errors = validate(ctx.query as Record<string, unknown>, schema)

    if (errors.length > 0) {
      throw new ValidationError(errors.join(', '))
    }

    await next()
  }
}

/**
 * Validate route parameters
 */
export function validateParams(schema: ValidationSchema) {
  return async (ctx: Context, next: Next): Promise<void> => {
    const errors = validate(ctx.params as Record<string, unknown>, schema)

    if (errors.length > 0) {
      throw new ValidationError(errors.join(', '))
    }

    await next()
  }
}
