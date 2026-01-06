/**
 * @file Koa Application Configuration
 * @description Configure Koa app, middlewares, and routes
 */

import { errorMiddleware } from '@/middlewares/error.middleware'
import routes from '@/routes'
import Koa from 'koa'
import bodyparser from 'koa-bodyparser'
import cors from 'koa-cors'
import helmet from 'koa-helmet'
import logger from 'koa-logger'
import Router from 'koa-router'

const app = new Koa()
const router = new Router()

/**
 * Error handling middleware
 * Must be first to catch all errors
 */
app.use(errorMiddleware)

/**
 * CORS configuration
 * Allow frontend cross-origin access
 */
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3001',
    credentials: true,
  } as cors.Options)
)

/**
 * Security headers configuration
 */
app.use(helmet())

/**
 * Request logging middleware
 * Log all HTTP requests
 */
app.use(logger())

/**
 * Body parser middleware
 */
app.use(bodyparser())

/**
 * Health check endpoint
 * @route GET /health
 * @description Check if service is running
 */
router.get('/health', async (ctx) => {
  ctx.body = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
  }
})

/**
 * Root endpoint
 */
router.get('/', async (ctx) => {
  ctx.body = {
    name: 'TravelCheck API',
    version: '1.0.0',
    description: 'Blockchain Travel Check-in DApp Backend API',
    timestamp: new Date().toISOString(),
  }
})

// Register health check routes
app.use(router.routes()).use(router.allowedMethods())

// Register API routes
app.use(routes.routes()).use(routes.allowedMethods())

export default app
