/**
 * @file Koa应用配置
 * @description 配置Koa应用、中间件和路由
 */

import Koa from 'koa'
import bodyparser from 'koa-bodyparser'
import cors from 'koa-cors'
import helmet from 'koa-helmet'
import logger from 'koa-logger'
import Router from 'koa-router'

const app = new Koa()
const router = new Router()

/**
 * 错误处理中间件
 * @description 捕获所有错误并返回统一格式
 */
app.use(async (ctx, next) => {
  try {
    await next()
  } catch (err: unknown) {
    const error = err as Error & { status?: number; expose?: boolean }

    // 记录错误日志
    console.error('Error:', error.message)
    console.error('Stack:', error.stack)

    // 设置状态码
    ctx.status = error.status || 500

    // 返回统一格式的错误响应
    ctx.body = {
      code: ctx.status,
      message: error.expose ? error.message : 'Internal Server Error',
      data: null,
      timestamp: new Date().toISOString(),
    }
  }
})

/**
 * CORS配置
 * @description 允许前端跨域访问
 */
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3001',
    credentials: true,
  } as cors.Options)
)

/**
 * 安全头配置
 */
app.use(helmet())

/**
 * 请求日志中间件
 * @description 记录所有HTTP请求
 */
app.use(logger())

/**
 * Body解析中间件
 */
app.use(bodyparser())

/**
 * 健康检查接口
 * @route GET /health
 * @description 用于检查服务是否正常运行
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
 * 根路由
 */
router.get('/', async (ctx) => {
  ctx.body = {
    name: 'TravelCheck API',
    version: '1.0.0',
    description: '区块链旅行打卡DApp后端API',
    timestamp: new Date().toISOString(),
  }
})

// 注册路由
app.use(router.routes()).use(router.allowedMethods())

export default app
