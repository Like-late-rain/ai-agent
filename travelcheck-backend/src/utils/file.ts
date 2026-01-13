/**
 * @file 文件工具
 * @description 文件上传和管理操作
 */

import * as fs from 'node:fs/promises'
import * as path from 'node:path'
import { UPLOAD } from '@/constants/config'

/**
 * 保存上传的文件
 * @param file - 文件缓冲区
 * @param filename - 期望的文件名
 * @returns 相对文件路径
 */
export async function saveFile(file: Buffer, filename: string): Promise<string> {
  // 确保上传目录存在
  await fs.mkdir(UPLOAD.UPLOAD_DIR, { recursive: true })

  // 生成唯一文件名
  const timestamp = Date.now()
  const ext = path.extname(filename)
  const name = path.basename(filename, ext)
  const uniqueFilename = `${name}-${timestamp}${ext}`

  // 完整路径
  const filePath = path.join(UPLOAD.UPLOAD_DIR, uniqueFilename)

  // 保存文件
  await fs.writeFile(filePath, file)

  // 返回相对路径
  return path.join('uploads', uniqueFilename)
}

/**
 * 删除文件
 * @param filepath - 要删除的文件路径
 * @returns 成功删除返回true
 */
export async function deleteFile(filepath: string): Promise<boolean> {
  try {
    await fs.unlink(filepath)
    return true
  } catch (_error) {
    return false
  }
}

/**
 * 获取文件URL
 * @param filepath - 文件路径
 * @returns 文件的公共URL
 */
export function getFileUrl(filepath: string): string {
  // 生产环境中，这里应该返回带域名的完整URL
  // 目前返回相对路径
  return `/${filepath}`
}

/**
 * 验证文件类型
 * @param mimetype - 要验证的MIME类型
 * @returns 允许返回true
 */
export function isAllowedFileType(mimetype: string): boolean {
  return (UPLOAD.ALLOWED_TYPES as readonly string[]).includes(mimetype)
}

/**
 * 验证文件大小
 * @param size - 文件大小(字节)
 * @returns 在限制内返回true
 */
export function isAllowedFileSize(size: number): boolean {
  return size <= UPLOAD.MAX_FILE_SIZE
}
