/**
 * @file Authentication Service
 * @description Handle wallet authentication and session management
 */

import { UnauthorizedError } from '@/middlewares/error.middleware'
import { userRepository } from '@/repositories/user.repository'
import type { User } from '@/types/models.types'
import { generateNonce, verifySignature } from '@/utils/crypto'
import { generateToken } from '@/utils/jwt'

/**
 * Store for nonces (in production, use Redis or similar)
 */
const nonceStore = new Map<string, string>()

/**
 * Generate nonce for wallet address
 */
export function generateNonceForAddress(address: string): string {
  const nonce = generateNonce()
  nonceStore.set(address.toLowerCase(), nonce)

  // Auto-delete after 5 minutes
  setTimeout(
    () => {
      nonceStore.delete(address.toLowerCase())
    },
    5 * 60 * 1000
  )

  return nonce
}

/**
 * Verify wallet signature and create session
 */
export async function verifyWalletSignature(
  address: string,
  signature: string,
  nonce: string
): Promise<{ token: string; user: User }> {
  // Get stored nonce
  const storedNonce = nonceStore.get(address.toLowerCase())

  if (!storedNonce || storedNonce !== nonce) {
    throw new UnauthorizedError('Invalid or expired nonce')
  }

  // Construct message that was signed
  const message = `Sign this message to authenticate with TravelCheck.\n\nNonce: ${nonce}`

  // Verify signature
  const isValid = verifySignature(message, signature, address)

  if (!isValid) {
    throw new UnauthorizedError('Invalid signature')
  }

  // Delete used nonce
  nonceStore.delete(address.toLowerCase())

  // Get or create user
  let user = await userRepository.findByWalletAddress(address)

  if (!user) {
    user = await userRepository.create({
      walletAddress: address,
      nickname: null,
      avatar: null,
      totalCheckins: 0,
      currentStreak: 0,
      maxStreak: 0,
      lotteryChances: 0,
      badges: [],
      createdAt: new Date(),
    })
  }

  // Generate JWT token
  const token = generateToken({
    userId: user.id,
    walletAddress: user.walletAddress,
  })

  return {
    token,
    user,
  }
}

/**
 * Get user by ID
 */
export async function getUserById(userId: string): Promise<User | null> {
  return await userRepository.findById(userId)
}

/**
 * Update user profile
 */
export async function updateUserProfile(
  userId: string,
  data: { nickname?: string; avatar?: string }
): Promise<User | null> {
  return await userRepository.update(userId, data)
}
