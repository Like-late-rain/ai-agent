/**
 * @file 响应数据类型定义
 * @description 定义所有API响应的数据类型
 */

/**
 * 统一API响应格式
 */
export interface ApiResponse<T = unknown> {
  code: number
  message: string
  data: T | null
  timestamp: string
}

/**
 * 分页响应数据
 */
export interface PaginationResponse<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

/**
 * 成功响应构造器
 */
export function success<T>(data: T, message = 'Success'): ApiResponse<T> {
  return {
    code: 200,
    message,
    data,
    timestamp: new Date().toISOString(),
  }
}

/**
 * 错误响应构造器
 */
export function error(code: number, message: string): ApiResponse<null> {
  return {
    code,
    message,
    data: null,
    timestamp: new Date().toISOString(),
  }
}

/**
 * 常用错误响应
 */
export const ErrorResponses = {
  badRequest: (message = 'Bad Request') => error(400, message),
  unauthorized: (message = 'Unauthorized') => error(401, message),
  forbidden: (message = 'Forbidden') => error(403, message),
  notFound: (message = 'Not Found') => error(404, message),
  conflict: (message = 'Conflict') => error(409, message),
  internal: (message = 'Internal Server Error') => error(500, message),
}
