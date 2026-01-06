/**
 * @file JWT Utilities
 * @description JWT token generation and verification
 */

import { JWT } from '@/constants/config'
import jwt from 'jsonwebtoken'

/**
 * Generate JWT token
 * @param payload - Data to encode in token
 * @returns JWT token string
 */
export function generateToken(payload: object): string {
  return jwt.sign(payload, JWT.SECRET, {
    expiresIn: JWT.EXPIRES_IN,
  } as jwt.SignOptions)
}

/**
 * Verify JWT token
 * @param token - JWT token to verify
 * @returns Decoded payload or null if invalid
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
 * Decode JWT token without verification
 * @param token - JWT token to decode
 * @returns Decoded payload or null if invalid
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
 * Generate refresh token
 * @param payload - Data to encode in token
 * @returns Refresh token string
 */
export function generateRefreshToken(payload: object): string {
  return jwt.sign(payload, JWT.REFRESH_SECRET, {
    expiresIn: JWT.REFRESH_EXPIRES_IN,
  } as jwt.SignOptions)
}

/**
 * Verify refresh token
 * @param token - Refresh token to verify
 * @returns Decoded payload or null if invalid
 */
export function verifyRefreshToken(token: string): jwt.JwtPayload | null {
  try {
    const payload = jwt.verify(token, JWT.REFRESH_SECRET)
    return payload as jwt.JwtPayload
  } catch (_error) {
    return null
  }
}
