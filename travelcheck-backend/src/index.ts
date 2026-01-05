/**
 * @file 应用入口文件
 * @description 启动Koa服务器
 */

import 'dotenv/config'
import app from './app'

const PORT = process.env.PORT || 3000

/**
 * 启动服务器
 */
const server = app.listen(PORT, () => {
  console.log('=================================')
  console.log('🚀 TravelCheck API Server')
  console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`)
  console.log(`🌍 Server running on port: ${PORT}`)
  console.log(`🔗 Health check: http://localhost:${PORT}/health`)
  console.log('=================================')
})

/**
 * 优雅关闭
 */
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server')
  server.close(() => {
    console.log('HTTP server closed')
    process.exit(0)
  })
})

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server')
  server.close(() => {
    console.log('HTTP server closed')
    process.exit(0)
  })
})

export default app
