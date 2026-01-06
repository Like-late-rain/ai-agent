/**
 * @file Routes Index
 * @description Combine all route modules
 */

import Router from 'koa-router'
import authRoutes from './auth.route'
import checkinRoutes from './checkin.route'
import rewardRoutes from './reward.route'
import stakingRoutes from './staking.route'
import taskRoutes from './task.route'

const router = new Router()

/**
 * Register all routes
 */
router.use(authRoutes.routes())
router.use(stakingRoutes.routes())
router.use(checkinRoutes.routes())
router.use(taskRoutes.routes())
router.use(rewardRoutes.routes())

export default router
