/**
 * @file Upload Middleware
 * @description File upload middleware using koa-multer
 */

import * as path from 'node:path'
import { UPLOAD } from '@/constants/config'
import multer from 'koa-multer'
import { ValidationError } from './error.middleware'

/**
 * Configure storage
 */
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, UPLOAD.UPLOAD_DIR)
  },
  filename: (_req, file, cb) => {
    const timestamp = Date.now()
    const ext = path.extname(file.originalname)
    const name = path.basename(file.originalname, ext)
    cb(null, `${name}-${timestamp}${ext}`)
  },
})

/**
 * File filter
 */
const fileFilter = (_req: any, file: any, cb: any) => {
  if (UPLOAD.ALLOWED_TYPES.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new ValidationError(`File type ${file.mimetype} not allowed`), false)
  }
}

/**
 * Multer configuration
 */
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: UPLOAD.MAX_FILE_SIZE,
  },
})

/**
 * Single file upload middleware
 */
export const uploadSingle = (fieldName: string) => upload.single(fieldName)

/**
 * Multiple files upload middleware
 */
export const uploadMultiple = (fieldName: string, maxCount = 10) =>
  upload.array(fieldName, maxCount)

/**
 * Multiple fields upload middleware
 */
export const uploadFields = (fields: { name: string; maxCount: number }[]) => upload.fields(fields)

export default upload
