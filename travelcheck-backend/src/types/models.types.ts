/**
 * @file 数据模型类型定义
 * @description 定义所有数据库模型的TypeScript类型
 */

/**
 * 用户模型
 */
export interface User {
  id: string
  walletAddress: string
  nickname: string | null
  avatar: string | null
  totalCheckins: number
  currentStreak: number
  maxStreak: number
  lotteryChances: number
  badges: string[]
  createdAt: Date
}

/**
 * 质押模式
 */
export type StakeMode = 'sealed' | 'anytime'

/**
 * 质押状态
 */
export type StakeStatus = 'active' | 'completed' | 'withdrawn'

/**
 * 质押记录模型
 */
export interface Stake {
  id: string
  userId: string
  type: 'daily' | 'attraction'
  amount: number
  milestone: 30 | 100 | 200 | 365
  mode: StakeMode
  checkedDays: number
  isPerfect: boolean
  accumulatedInterest: number
  status: StakeStatus
  startDate: Date
  endDate: Date
  completedAt: Date | null
  withdrawnAt: Date | null
  createdAt: Date
}

/**
 * 打卡记录模型
 */
export interface Checkin {
  id: string
  stakeId: string
  userId: string
  type: 'daily' | 'attraction' | 'makeup'
  content: string
  images: string[]
  location: {
    lat: number
    lng: number
  } | null
  date: string
  createdAt: Date
}

/**
 * 景点任务模型
 */
export interface AttractionTask {
  id: string
  name: string
  description: string
  location: {
    name: string
    address: string
    lat: number
    lng: number
    radius: number
  }
  coverImage: string
  overviewImage: string
  duration: number
  difficulty: 'easy' | 'medium' | 'hard'
  rewardApy: number
  minStake: number
  startDate: Date
  endDate: Date
  status: 'upcoming' | 'active' | 'expiring' | 'completed'
  createdAt: Date
}

/**
 * 奖励记录模型
 */
export interface Reward {
  id: string
  userId: string
  stakeId: string
  type: 'redpacket' | 'lottery' | 'badge'
  amount: number | null
  badgeId: string | null
  expireAt: Date | null
  claimed: boolean
  claimedAt: Date | null
  createdAt: Date
}

/**
 * 徽章模型
 */
export interface Badge {
  id: string
  name: string
  description: string
  icon: string
  requirement: string
  createdAt: Date
}

/**
 * 抽奖奖品模型
 */
export interface LotteryPrize {
  id: string
  name: string
  type: 'token' | 'physical'
  amount: number | null
  probability: number
  image: string | null
  createdAt: Date
}
