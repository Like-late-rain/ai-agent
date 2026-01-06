/**
 * @file Staking Routes
 * @description Define staking-related routes
 */

import * as stakingController from '@/controllers/staking.controller'
import { authMiddleware } from '@/middlewares/auth.middleware'
import Router from 'koa-router'

const router = new Router({
  prefix: '/api/staking',
})

// All staking routes require authentication
router.use(authMiddleware)

/**
 * POST /api/staking/daily
 * Create daily stake
 */
router.post('/daily', stakingController.createDaily)

/**
 * GET /api/staking/my
 * Get my stakes
 */
router.get('/my', stakingController.getMyStakes)

/**
 * GET /api/staking/:id
 * Get stake by ID
 */
router.get('/:id', stakingController.getStake)

/**
 * PUT /api/staking/:id/milestone
 * Switch milestone
 */
router.put('/:id/milestone', stakingController.updateMilestone)

/**
 * POST /api/staking/:id/withdraw
 * Withdraw stake
 */
router.post('/:id/withdraw', stakingController.withdraw)

export default router
