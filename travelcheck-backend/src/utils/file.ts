/**
 * @file File Utilities
 * @description File upload and management operations
 */

import * as fs from 'node:fs/promises'
import * as path from 'node:path'
import { UPLOAD } from '@/constants/config'

/**
 * Save uploaded file
 * @param file - File buffer
 * @param filename - Desired filename
 * @returns Relative file path
 */
export async function saveFile(file: Buffer, filename: string): Promise<string> {
  // Ensure upload directory exists
  await fs.mkdir(UPLOAD.UPLOAD_DIR, { recursive: true })

  // Generate unique filename
  const timestamp = Date.now()
  const ext = path.extname(filename)
  const name = path.basename(filename, ext)
  const uniqueFilename = `${name}-${timestamp}${ext}`

  // Full path
  const filePath = path.join(UPLOAD.UPLOAD_DIR, uniqueFilename)

  // Save file
  await fs.writeFile(filePath, file)

  // Return relative path
  return path.join('uploads', uniqueFilename)
}

/**
 * Delete file
 * @param filepath - File path to delete
 * @returns true if deleted successfully
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
 * Get file URL
 * @param filepath - File path
 * @returns Public URL for file
 */
export function getFileUrl(filepath: string): string {
  // In production, this would return a full URL with domain
  // For now, return relative path
  return `/${filepath}`
}

/**
 * Validate file type
 * @param mimetype - MIME type to validate
 * @returns true if allowed
 */
export function isAllowedFileType(mimetype: string): boolean {
  return (UPLOAD.ALLOWED_TYPES as readonly string[]).includes(mimetype)
}

/**
 * Validate file size
 * @param size - File size in bytes
 * @returns true if within limits
 */
export function isAllowedFileSize(size: number): boolean {
  return size <= UPLOAD.MAX_FILE_SIZE
}
