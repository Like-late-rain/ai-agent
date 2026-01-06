/**
 * @file Authentication Routes
 * @description Define authentication-related routes
 */

import * as authController from '@/controllers/auth.controller'
import { authMiddleware } from '@/middlewares/auth.middleware'
import Router from 'koa-router'

const router = new Router({
  prefix: '/api/auth',
})

/**
 * POST /api/auth/nonce
 * Get nonce for wallet authentication
 */
router.post('/nonce', authController.getNonce)

/**
 * POST /api/auth/verify
 * Verify wallet signature and get JWT token
 */
router.post('/verify', authController.verifySignature)

/**
 * GET /api/auth/me
 * Get current user info (requires authentication)
 */
router.get('/me', authMiddleware, authController.getCurrentUser)

/**
 * PUT /api/auth/me
 * Update current user profile (requires authentication)
 */
router.put('/me', authMiddleware, authController.updateProfile)

export default router
