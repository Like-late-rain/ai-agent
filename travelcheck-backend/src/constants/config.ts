/**
 * Application Configuration
 */

// Server Configuration
export const SERVER_PORT = process.env.PORT || 3000
export const SERVER_HOST = process.env.HOST || 'localhost'
export const NODE_ENV = process.env.NODE_ENV || 'development'

// Database Configuration
export const DATABASE = {
  HOST: process.env.DB_HOST || 'localhost',
  PORT: Number.parseInt(process.env.DB_PORT || '5432'),
  NAME: process.env.DB_NAME || 'travelcheck',
  USER: process.env.DB_USER || 'postgres',
  PASSWORD: process.env.DB_PASSWORD || 'password',
} as const

// JWT Configuration
export const JWT = {
  SECRET: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
  EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key',
  REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
} as const

// CORS Configuration
export const CORS_ORIGINS = process.env.CORS_ORIGINS?.split(',') || ['http://localhost:5173']

// Rate Limiting
export const RATE_LIMIT = {
  WINDOW_MS: 15 * 60 * 1000, // 15 minutes
  MAX_REQUESTS: 100,
} as const

// Pagination
export const DEFAULT_PAGE = 1
export const DEFAULT_PAGE_SIZE = 10
export const MAX_PAGE_SIZE = 100

// File Upload
export const UPLOAD = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/gif'],
  UPLOAD_DIR: process.env.UPLOAD_DIR || './uploads',
} as const

// Email Configuration
export const EMAIL = {
  SERVICE: process.env.EMAIL_SERVICE || 'gmail',
  USER: process.env.EMAIL_USER || '',
  PASSWORD: process.env.EMAIL_PASSWORD || '',
  FROM: process.env.EMAIL_FROM || 'noreply@travelcheck.com',
} as const

// Redis Configuration
export const REDIS = {
  HOST: process.env.REDIS_HOST || 'localhost',
  PORT: Number.parseInt(process.env.REDIS_PORT || '6379'),
  PASSWORD: process.env.REDIS_PASSWORD || '',
  DB: Number.parseInt(process.env.REDIS_DB || '0'),
} as const

// Logging
export const LOG_LEVEL = process.env.LOG_LEVEL || 'info'

// Application Info
export const APP_NAME = 'TravelCheck'
export const APP_VERSION = '1.0.0'

// Environment Flags
export const IS_DEVELOPMENT = NODE_ENV === 'development'
export const IS_PRODUCTION = NODE_ENV === 'production'
export const IS_TEST = NODE_ENV === 'test'
