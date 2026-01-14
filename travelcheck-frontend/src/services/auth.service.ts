/**
 * @file Authentication Service
 * @description API calls for authentication operations
 */

import { STORAGE_KEYS } from '@/constants/config'
import type {
  GetNonceRequest,
  GetNonceResponse,
  VerifySignatureRequest,
  VerifySignatureResponse,
} from '@/types/api.types'
import { setItem } from '@/utils/storage'
import api, { extractData } from './api'

/**
 * Get a nonce for wallet signature
 *
 * @param walletAddress - User's wallet address
 * @returns Promise resolving to nonce response (nonce and message)
 *
 * @example
 * const { nonce, message } = await getNonce('0x1234...')
 * console.log('Nonce:', nonce)
 * console.log('Message:', message)
 */
export async function getNonce(walletAddress: string): Promise<GetNonceResponse> {
  const request: GetNonceRequest = {
    address: walletAddress,
  }

  const response = await api.post<never, never, GetNonceRequest>('/api/auth/nonce', request)

  const data = extractData<GetNonceResponse>(response)
  return data
}

/**
 * Verify signature and get authentication token
 *
 * @param walletAddress - User's wallet address
 * @param signature - Signed message
 * @param nonce - Nonce from getNonce
 * @returns Promise resolving to user data and token
 *
 * @example
 * const { user, token } = await verifySignature(
 *   '0x1234...',
 *   'signature',
 *   'nonce'
 * )
 */
export async function verifySignature(
  walletAddress: string,
  signature: string,
  nonce: string
): Promise<VerifySignatureResponse> {
  const request: VerifySignatureRequest = {
    address: walletAddress,
    signature,
    nonce,
  }

  const response = await api.post<never, never, VerifySignatureRequest>('/api/auth/verify', request)

  const data = extractData<VerifySignatureResponse>(response)

  // Store token in localStorage
  setItem(STORAGE_KEYS.TOKEN, data.token)

  return data
}

/**
 * Logout user (client-side only, clears stored data)
 *
 * @example
 * logout()
 */
export function logout(): void {
  // Clear stored authentication data
  // The actual clearing is handled by clearUserAtom in user.atom.ts
  // This function is here for API consistency
}

/**
 * Get current user info
 *
 * @returns Promise resolving to user data
 *
 * @example
 * const user = await getCurrentUser()
 * console.log('User:', user)
 */
export async function getCurrentUser() {
  const response = await api.get('/api/auth/me')
  const data = extractData(response)
  return data
}

/**
 * Update user profile
 *
 * @param profileData - Profile data to update
 * @returns Promise resolving to updated user data
 *
 * @example
 * const user = await updateUserProfile({ nickname: 'New Name', avatar: 'url' })
 */
export async function updateUserProfile(profileData: { nickname?: string; avatar?: string }) {
  const response = await api.put('/api/auth/me', profileData)
  const data = extractData(response)
  
  // Update user in localStorage
  setItem(STORAGE_KEYS.USER, data)
  
  return data
}
