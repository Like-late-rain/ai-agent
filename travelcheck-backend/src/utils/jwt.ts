/**
 * @file JWT工具
 * @description JWT令牌生成和验证
 */

import { JWT } from '@/constants/config'
import jwt from 'jsonwebtoken'

/**
 * 生成JWT令牌
 * @param payload - 要编码到令牌中的数据
 * @returns JWT令牌字符串
 */
export function generateToken(payload: object): string {
  return jwt.sign(payload, JWT.SECRET, {
    expiresIn: JWT.EXPIRES_IN,
  } as jwt.SignOptions)
}

/**
 * 验证JWT令牌
 * @param token - 要验证的JWT令牌
 * @returns 解码后的负载，无效则返回null
 */
export function verifyToken(token: string): jwt.JwtPayload | null {
  try {
    const payload = jwt.verify(token, JWT.SECRET)
    return payload as jwt.JwtPayload
  } catch (_error) {
    return null
  }
}

/**
 * 解码JWT令牌(不验证)
 * @param token - 要解码的JWT令牌
 * @returns 解码后的负载，无效则返回null
 */
export function decodeToken(token: string): jwt.JwtPayload | null {
  try {
    const payload = jwt.decode(token)
    return payload as jwt.JwtPayload
  } catch (_error) {
    return null
  }
}

/**
 * 生成刷新令牌
 * @param payload - 要编码到令牌中的数据
 * @returns 刷新令牌字符串
 */
export function generateRefreshToken(payload: object): string {
  return jwt.sign(payload, JWT.REFRESH_SECRET, {
    expiresIn: JWT.REFRESH_EXPIRES_IN,
  } as jwt.SignOptions)
}

/**
 * 验证刷新令牌
 * @param token - 要验证的刷新令牌
 * @returns 解码后的负载，无效则返回null
 */
export function verifyRefreshToken(token: string): jwt.JwtPayload | null {
  try {
    const payload = jwt.verify(token, JWT.REFRESH_SECRET)
    return payload as jwt.JwtPayload
  } catch (_error) {
    return null
  }
}
