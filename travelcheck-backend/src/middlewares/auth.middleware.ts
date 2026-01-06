/**
 * @file Authentication Middleware
 * @description JWT authentication middleware
 */

import { verifyToken } from '@/utils/jwt'
import { ErrorResponses } from '@/utils/response'
import type { Context, Next } from 'koa'

/**
 * Authentication middleware
 * Verifies JWT token and attaches user info to context
 */
export async function authMiddleware(ctx: Context, next: Next): Promise<void> {
  try {
    // Extract token from Authorization header
    const authHeader = ctx.headers.authorization

    if (!authHeader) {
      ctx.status = 401
      ctx.body = ErrorResponses.unauthorized('Authorization header required')
      return
    }

    // Check Bearer format
    const parts = authHeader.split(' ')
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      ctx.status = 401
      ctx.body = ErrorResponses.unauthorized('Invalid authorization format')
      return
    }

    const token = parts[1]

    // Verify token
    const payload = verifyToken(token)

    if (!payload) {
      ctx.status = 401
      ctx.body = ErrorResponses.unauthorized('Invalid or expired token')
      return
    }

    // Attach user info to context state
    ctx.state.user = payload

    await next()
  } catch (_error) {
    ctx.status = 401
    ctx.body = ErrorResponses.unauthorized('Authentication failed')
  }
}

/**
 * Optional authentication middleware
 * Attaches user info if token is present, but doesn't require it
 */
export async function optionalAuthMiddleware(ctx: Context, next: Next): Promise<void> {
  try {
    const authHeader = ctx.headers.authorization

    if (authHeader) {
      const parts = authHeader.split(' ')
      if (parts.length === 2 && parts[0] === 'Bearer') {
        const token = parts[1]
        const payload = verifyToken(token)

        if (payload) {
          ctx.state.user = payload
        }
      }
    }

    await next()
  } catch (_error) {
    // Ignore errors in optional auth
    await next()
  }
}
