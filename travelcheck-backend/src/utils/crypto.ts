/**
 * @file 加密工具
 * @description 签名验证和加密操作
 */

import { ethers } from 'ethers'

/**
 * 验证钱包签名
 * @param message - 被签名的原始消息
 * @param signature - 要验证的签名
 * @param address - 期望的钱包地址
 * @returns 签名有效返回true
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
 * 使用keccak256哈希消息
 * @param message - 要哈希的消息
 * @returns 哈希后的消息
 */
export function hashMessage(message: string): string {
  return ethers.id(message)
}

/**
 * 生成随机nonce
 * @returns 随机nonce字符串
 */
export function generateNonce(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

/**
 * 验证以太坊地址
 * @param address - 要验证的地址
 * @returns 有效返回true
 */
export function isValidAddress(address: string): boolean {
  return ethers.isAddress(address)
}
