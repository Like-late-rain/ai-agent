/**
 * @file Reward Routes
 * @description Define reward-related routes
 */

import * as rewardController from '@/controllers/reward.controller'
import { authMiddleware } from '@/middlewares/auth.middleware'
import Router from 'koa-router'

const router = new Router({
  prefix: '/api/rewards',
})

// All reward routes require authentication
router.use(authMiddleware)

/**
 * POST /api/rewards/redpacket/claim
 * Claim red packet
 */
router.post('/redpacket/claim', rewardController.claimRedPacketReward)

/**
 * GET /api/rewards/redpacket/unclaimed
 * Get unclaimed red packets
 */
router.get('/redpacket/unclaimed', rewardController.getUnclaimedRedPacket)

/**
 * GET /api/rewards/lottery/chances
 * Get lottery chances
 */
router.get('/lottery/chances', rewardController.getChances)

/**
 * POST /api/rewards/lottery/spin
 * Spin lottery
 */
router.post('/lottery/spin', rewardController.spin)

/**
 * GET /api/rewards/lottery/history
 * Get lottery history
 */
router.get('/lottery/history', rewardController.getHistory)

/**
 * GET /api/rewards/badges
 * Get user badges
 */
router.get('/badges', rewardController.getBadges)

export default router
