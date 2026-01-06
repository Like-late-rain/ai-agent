/**
 * @file Task Routes
 * @description Define task-related routes
 */

import * as taskController from '@/controllers/task.controller'
import { authMiddleware, optionalAuthMiddleware } from '@/middlewares/auth.middleware'
import Router from 'koa-router'

const router = new Router({
  prefix: '/api/tasks',
})

/**
 * GET /api/tasks/attractions
 * List attractions (optional authentication for personalized results)
 */
router.get('/attractions', optionalAuthMiddleware, taskController.listAttractions)

/**
 * GET /api/tasks/attractions/:id
 * Get attraction detail (optional authentication)
 */
router.get('/attractions/:id', optionalAuthMiddleware, taskController.getAttractionDetail)

/**
 * POST /api/tasks/:id/join
 * Join attraction task (requires authentication)
 */
router.post('/:id/join', authMiddleware, taskController.joinTask)

export default router
