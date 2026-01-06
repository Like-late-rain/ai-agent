/**
 * @file Error Handling Middleware
 * @description Global error handling
 */

import { error } from '@/utils/response'
import type { Context, Next } from 'koa'

/**
 * Error types
 */
export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string
  ) {
    super(message)
    this.name = 'AppError'
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(400, message)
    this.name = 'ValidationError'
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized') {
    super(401, message)
    this.name = 'UnauthorizedError'
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Forbidden') {
    super(403, message)
    this.name = 'ForbiddenError'
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Not Found') {
    super(404, message)
    this.name = 'NotFoundError'
  }
}

export class ConflictError extends AppError {
  constructor(message = 'Conflict') {
    super(409, message)
    this.name = 'ConflictError'
  }
}

/**
 * Global error handling middleware
 */
export async function errorMiddleware(ctx: Context, next: Next): Promise<void> {
  try {
    await next()
  } catch (err: unknown) {
    const typedErr = err as Error & { status?: number; statusCode?: number }
    // Log error
    console.error('Error:', typedErr)

    // Determine status code and message
    let statusCode = 500
    let message = 'Internal Server Error'

    if (typedErr instanceof AppError) {
      statusCode = typedErr.statusCode
      message = typedErr.message
    } else if (typedErr.status) {
      // Koa error
      statusCode = typedErr.status
      message = typedErr.message || message
    }

    // Set response
    ctx.status = statusCode
    ctx.body = error(statusCode, message)

    // Emit error event for logging
    ctx.app.emit('error', typedErr, ctx)
  }
}
