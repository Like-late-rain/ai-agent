/**
 * @file Checkin Routes
 * @description Define checkin-related routes
 */

import * as checkinController from '@/controllers/checkin.controller'
import { authMiddleware } from '@/middlewares/auth.middleware'
import Router from 'koa-router'

const router = new Router({
  prefix: '/api/checkin',
})

// All checkin routes require authentication
router.use(authMiddleware)

/**
 * POST /api/checkin/daily/submit
 * Submit daily checkin
 */
router.post('/daily/submit', checkinController.submitDaily)

/**
 * POST /api/checkin/daily/makeup
 * Submit makeup checkin
 */
router.post('/daily/makeup', checkinController.submitMakeupCheckin)

/**
 * GET /api/checkin/daily/calendar
 * Get checkin calendar
 */
router.get('/daily/calendar', checkinController.getCheckinCalendar)

/**
 * GET /api/checkin/daily/can-makeup
 * Check if can makeup a date
 */
router.get('/daily/can-makeup', checkinController.checkCanMakeup)

/**
 * GET /api/checkin/stake/:stakeId
 * Get checkins by stake ID
 */
router.get('/stake/:stakeId', checkinController.getStakeCheckins)

export default router
