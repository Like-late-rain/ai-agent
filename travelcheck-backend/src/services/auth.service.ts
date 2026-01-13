/**
 * @file 认证服务
 * @description 处理钱包认证和会话管理
 */

import { UnauthorizedError } from '@/middlewares/error.middleware'
import { userRepository } from '@/repositories/user.repository'
import type { User } from '@/types/models.types'
import { generateNonce, verifySignature } from '@/utils/crypto'
import { generateToken } from '@/utils/jwt'

/**
 * Nonce存储 (生产环境建议使用Redis等缓存)
 */
const nonceStore = new Map<string, string>()

/**
 * 为钱包地址生成nonce
 */
export function generateNonceForAddress(address: string): string {
  const nonce = generateNonce()
  nonceStore.set(address.toLowerCase(), nonce)

  // 5分钟后自动删除
  setTimeout(
    () => {
      nonceStore.delete(address.toLowerCase())
    },
    5 * 60 * 1000
  )

  return nonce
}

/**
 * 验证钱包签名并创建会话
 */
export async function verifyWalletSignature(
  address: string,
  signature: string,
  nonce: string
): Promise<{ token: string; user: User }> {
  // 获取存储的nonce
  const storedNonce = nonceStore.get(address.toLowerCase())

  if (!storedNonce || storedNonce !== nonce) {
    throw new UnauthorizedError('Invalid or expired nonce')
  }

  // 构建被签名的消息
  const message = `Sign this message to authenticate with TravelCheck.\n\nNonce: ${nonce}`

  // 验证签名
  const isValid = verifySignature(message, signature, address)

  if (!isValid) {
    throw new UnauthorizedError('Invalid signature')
  }

  // 删除已使用的nonce
  nonceStore.delete(address.toLowerCase())

  // 获取或创建用户
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

  // 生成JWT token
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
 * 通过ID获取用户
 */
export async function getUserById(userId: string): Promise<User | null> {
  return await userRepository.findById(userId)
}

/**
 * 更新用户资料
 */
export async function updateUserProfile(
  userId: string,
  data: { nickname?: string; avatar?: string }
): Promise<User | null> {
  return await userRepository.update(userId, data)
}
