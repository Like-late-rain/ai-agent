/**
 * @file Authentication Controller
 * @description Handle authentication-related requests
 */

import { NotFoundError, ValidationError } from '@/middlewares/error.middleware'
import {
  generateNonceForAddress,
  getUserById,
  updateUserProfile,
  verifyWalletSignature,
} from '@/services/auth.service'
import { success } from '@/utils/response'
import { validateWalletAddress } from '@/validators/common.validator'
import type { Context } from 'koa'

/**
 * Get nonce for wallet authentication
 * POST /api/auth/nonce
 */
export async function getNonce(ctx: Context): Promise<void> {
  const { address } = ctx.request.body as { address?: string }

  if (!address) {
    throw new ValidationError('Wallet address is required')
  }

  validateWalletAddress(address)

  const nonce = generateNonceForAddress(address)

  ctx.body = success({
    nonce,
    message: `Sign this message to authenticate with TravelCheck.\n\nNonce: ${nonce}`,
  })
}

/**
 * Verify wallet signature and get JWT token
 * POST /api/auth/verify
 */
export async function verifySignature(ctx: Context): Promise<void> {
  const { address, signature, nonce } = ctx.request.body as {
    address?: string
    signature?: string
    nonce?: string
  }

  if (!address || !signature || !nonce) {
    throw new ValidationError('Address, signature, and nonce are required')
  }

  validateWalletAddress(address)

  const result = await verifyWalletSignature(address, signature, nonce)

  ctx.body = success(result, 'Authentication successful')
}

/**
 * Get current user info
 * GET /api/auth/me
 */
export async function getCurrentUser(ctx: Context): Promise<void> {
  const { userId } = ctx.state.user

  const user = await getUserById(userId)

  if (!user) {
    throw new NotFoundError('User not found')
  }

  ctx.body = success(user)
}

/**
 * Update current user profile
 * PUT /api/auth/me
 */
export async function updateProfile(ctx: Context): Promise<void> {
  const { userId } = ctx.state.user
  const { nickname, avatar } = ctx.request.body as {
    nickname?: string
    avatar?: string
  }

  const user = await updateUserProfile(userId, { nickname, avatar })

  if (!user) {
    throw new NotFoundError('User not found')
  }

  ctx.body = success(user, 'Profile updated successfully')
}
