/**
 * @file Crypto Utilities
 * @description Signature verification and cryptographic operations
 */

import { ethers } from 'ethers'

/**
 * Verify wallet signature
 * @param message - Original message that was signed
 * @param signature - Signature to verify
 * @param address - Expected wallet address
 * @returns true if signature is valid
 */
export function verifySignature(message: string, signature: string, address: string): boolean {
  try {
    const recoveredAddress = ethers.verifyMessage(message, signature)
    return recoveredAddress.toLowerCase() === address.toLowerCase()
  } catch (_error) {
    return false
  }
}

/**
 * Hash a message using keccak256
 * @param message - Message to hash
 * @returns Hashed message
 */
export function hashMessage(message: string): string {
  return ethers.id(message)
}

/**
 * Generate a random nonce
 * @returns Random nonce string
 */
export function generateNonce(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

/**
 * Validate Ethereum address
 * @param address - Address to validate
 * @returns true if valid
 */
export function isValidAddress(address: string): boolean {
  return ethers.isAddress(address)
}
