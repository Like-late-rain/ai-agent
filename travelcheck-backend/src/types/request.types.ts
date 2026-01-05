/**
 * @file 请求参数类型定义
 * @description 定义所有API请求的参数类型
 */

import type { Context } from 'koa'

/**
 * 扩展Koa Context，添加认证用户信息
 */
export interface AuthContext extends Context {
  state: {
    /** 当前认证用户 */
    user: {
      id: string
      walletAddress: string
    }
  }
}

/**
 * 分页查询参数
 */
export interface PaginationQuery {
  page?: string
  pageSize?: string
}

/**
 * 获取Nonce请求体
 */
export interface GetNonceBody {
  walletAddress: string
}

/**
 * 验证签名请求体
 */
export interface VerifySignatureBody {
  walletAddress: string
  signature: string
  nonce: string
}

/**
 * 创建质押请求体
 */
export interface CreateStakeBody {
  type: 'daily' | 'attraction'
  amount: number
  milestone: 30 | 100 | 200 | 365
  mode: 'sealed' | 'anytime'
  taskId?: string
}

/**
 * 切换里程碑请求体
 */
export interface SwitchMilestoneBody {
  milestone: 30 | 100 | 200 | 365
}

/**
 * 提交打卡请求体
 */
export interface SubmitCheckinBody {
  stakeId: string
  content: string
  images: string[]
  location?: {
    lat: number
    lng: number
  }
}

/**
 * 提交补卡请求体
 */
export interface SubmitMakeupBody {
  stakeId: string
  date: string
  content: string
  images: string[]
}

/**
 * 获取景点任务列表查询参数
 */
export interface GetAttractionsQuery extends PaginationQuery {
  difficulty?: string
  status?: string
}

/**
 * 参与景点任务请求体
 */
export interface JoinAttractionBody {
  amount: number
  milestone: 30 | 100 | 200 | 365
  mode: 'sealed' | 'anytime'
}
