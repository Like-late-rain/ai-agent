/**
 * Error Code Definitions
 */

export enum ErrorCode {
  // General Errors (1000-1999)
  INTERNAL_SERVER_ERROR = 1000,
  BAD_REQUEST = 1001,
  VALIDATION_ERROR = 1002,
  NOT_FOUND = 1003,
  UNAUTHORIZED = 1004,
  FORBIDDEN = 1005,
  CONFLICT = 1006,
  TOO_MANY_REQUESTS = 1007,

  // Authentication Errors (2000-2999)
  AUTH_INVALID_CREDENTIALS = 2000,
  AUTH_USER_NOT_FOUND = 2001,
  AUTH_EMAIL_ALREADY_EXISTS = 2002,
  AUTH_INVALID_TOKEN = 2003,
  AUTH_TOKEN_EXPIRED = 2004,
  AUTH_REFRESH_TOKEN_INVALID = 2005,
  AUTH_EMAIL_NOT_VERIFIED = 2006,
  AUTH_PASSWORD_RESET_INVALID = 2007,
  AUTH_INVALID_PASSWORD = 2008,
  AUTH_ACCOUNT_LOCKED = 2009,

  // User Errors (3000-3999)
  USER_NOT_FOUND = 3000,
  USER_ALREADY_EXISTS = 3001,
  USER_INVALID_EMAIL = 3002,
  USER_INVALID_PHONE = 3003,
  USER_INSUFFICIENT_BALANCE = 3004,
  USER_PROFILE_INCOMPLETE = 3005,

  // Stake Errors (4000-4999)
  STAKE_NOT_FOUND = 4000,
  STAKE_INVALID_AMOUNT = 4001,
  STAKE_AMOUNT_TOO_LOW = 4002,
  STAKE_AMOUNT_TOO_HIGH = 4003,
  STAKE_INVALID_MILESTONE = 4004,
  STAKE_ALREADY_EXISTS = 4005,
  STAKE_ALREADY_COMPLETED = 4006,
  STAKE_ALREADY_FAILED = 4007,
  STAKE_CANNOT_WITHDRAW_SEALED = 4008,
  STAKE_NOT_ACTIVE = 4009,
  STAKE_UNAUTHORIZED_ACCESS = 4010,

  // Check-in Errors (5000-5999)
  CHECKIN_NOT_FOUND = 5000,
  CHECKIN_ALREADY_EXISTS = 5001,
  CHECKIN_TOO_EARLY = 5002,
  CHECKIN_TOO_LATE = 5003,
  CHECKIN_NO_ACTIVE_STAKE = 5004,
  CHECKIN_MAKEUP_LIMIT_REACHED = 5005,
  CHECKIN_MAKEUP_DEADLINE_PASSED = 5006,
  CHECKIN_ALREADY_MADE_UP = 5007,
  CHECKIN_CANNOT_MAKEUP_TODAY = 5008,
  CHECKIN_INVALID_DATE = 5009,

  // Wallet Errors (6000-6999)
  WALLET_NOT_FOUND = 6000,
  WALLET_INSUFFICIENT_BALANCE = 6001,
  WALLET_INVALID_AMOUNT = 6002,
  WALLET_WITHDRAWAL_FAILED = 6003,
  WALLET_DEPOSIT_FAILED = 6004,
  WALLET_TRANSACTION_NOT_FOUND = 6005,
  WALLET_DAILY_LIMIT_EXCEEDED = 6006,
  WALLET_MONTHLY_LIMIT_EXCEEDED = 6007,

  // Red Packet Errors (7000-7999)
  REDPACKET_NOT_FOUND = 7000,
  REDPACKET_ALREADY_CLAIMED = 7001,
  REDPACKET_EXPIRED = 7002,
  REDPACKET_NO_AVAILABLE = 7003,
  REDPACKET_CLAIM_FAILED = 7004,

  // Lottery Errors (8000-8999)
  LOTTERY_NOT_ENOUGH_BALANCE = 8000,
  LOTTERY_INVALID_TICKET = 8001,
  LOTTERY_DRAW_FAILED = 8002,
  LOTTERY_PRIZE_NOT_FOUND = 8003,
  LOTTERY_ALREADY_CLAIMED = 8004,
  LOTTERY_NO_TICKETS_AVAILABLE = 8005,

  // File Upload Errors (9000-9999)
  FILE_TOO_LARGE = 9000,
  FILE_INVALID_TYPE = 9001,
  FILE_UPLOAD_FAILED = 9002,
  FILE_NOT_FOUND = 9003,

  // Database Errors (10000-10999)
  DB_CONNECTION_ERROR = 10000,
  DB_QUERY_ERROR = 10001,
  DB_TRANSACTION_ERROR = 10002,
  DB_CONSTRAINT_VIOLATION = 10003,
}

export interface ErrorResponse {
  code: ErrorCode
  message: string
  details?: unknown
  timestamp: string
}

export const ERROR_MESSAGES: Record<ErrorCode, string> = {
  // General Errors
  [ErrorCode.INTERNAL_SERVER_ERROR]: 'Internal server error occurred',
  [ErrorCode.BAD_REQUEST]: 'Bad request',
  [ErrorCode.VALIDATION_ERROR]: 'Validation error',
  [ErrorCode.NOT_FOUND]: 'Resource not found',
  [ErrorCode.UNAUTHORIZED]: 'Unauthorized access',
  [ErrorCode.FORBIDDEN]: 'Access forbidden',
  [ErrorCode.CONFLICT]: 'Resource conflict',
  [ErrorCode.TOO_MANY_REQUESTS]: 'Too many requests',

  // Authentication Errors
  [ErrorCode.AUTH_INVALID_CREDENTIALS]: 'Invalid email or password',
  [ErrorCode.AUTH_USER_NOT_FOUND]: 'User not found',
  [ErrorCode.AUTH_EMAIL_ALREADY_EXISTS]: 'Email already exists',
  [ErrorCode.AUTH_INVALID_TOKEN]: 'Invalid token',
  [ErrorCode.AUTH_TOKEN_EXPIRED]: 'Token has expired',
  [ErrorCode.AUTH_REFRESH_TOKEN_INVALID]: 'Invalid refresh token',
  [ErrorCode.AUTH_EMAIL_NOT_VERIFIED]: 'Email not verified',
  [ErrorCode.AUTH_PASSWORD_RESET_INVALID]: 'Invalid password reset token',
  [ErrorCode.AUTH_INVALID_PASSWORD]: 'Invalid password format',
  [ErrorCode.AUTH_ACCOUNT_LOCKED]: 'Account is locked',

  // User Errors
  [ErrorCode.USER_NOT_FOUND]: 'User not found',
  [ErrorCode.USER_ALREADY_EXISTS]: 'User already exists',
  [ErrorCode.USER_INVALID_EMAIL]: 'Invalid email format',
  [ErrorCode.USER_INVALID_PHONE]: 'Invalid phone number',
  [ErrorCode.USER_INSUFFICIENT_BALANCE]: 'Insufficient balance',
  [ErrorCode.USER_PROFILE_INCOMPLETE]: 'User profile is incomplete',

  // Stake Errors
  [ErrorCode.STAKE_NOT_FOUND]: 'Stake not found',
  [ErrorCode.STAKE_INVALID_AMOUNT]: 'Invalid stake amount',
  [ErrorCode.STAKE_AMOUNT_TOO_LOW]: 'Stake amount is too low',
  [ErrorCode.STAKE_AMOUNT_TOO_HIGH]: 'Stake amount is too high',
  [ErrorCode.STAKE_INVALID_MILESTONE]: 'Invalid milestone selected',
  [ErrorCode.STAKE_ALREADY_EXISTS]: 'Active stake already exists',
  [ErrorCode.STAKE_ALREADY_COMPLETED]: 'Stake already completed',
  [ErrorCode.STAKE_ALREADY_FAILED]: 'Stake already failed',
  [ErrorCode.STAKE_CANNOT_WITHDRAW_SEALED]: 'Cannot withdraw from sealed stake before completion',
  [ErrorCode.STAKE_NOT_ACTIVE]: 'Stake is not active',
  [ErrorCode.STAKE_UNAUTHORIZED_ACCESS]: 'Unauthorized access to stake',

  // Check-in Errors
  [ErrorCode.CHECKIN_NOT_FOUND]: 'Check-in record not found',
  [ErrorCode.CHECKIN_ALREADY_EXISTS]: 'Already checked in today',
  [ErrorCode.CHECKIN_TOO_EARLY]: 'Too early to check in',
  [ErrorCode.CHECKIN_TOO_LATE]: 'Too late to check in',
  [ErrorCode.CHECKIN_NO_ACTIVE_STAKE]: 'No active stake found',
  [ErrorCode.CHECKIN_MAKEUP_LIMIT_REACHED]: 'Makeup chances limit reached',
  [ErrorCode.CHECKIN_MAKEUP_DEADLINE_PASSED]: 'Makeup deadline has passed',
  [ErrorCode.CHECKIN_ALREADY_MADE_UP]: 'Already made up this check-in',
  [ErrorCode.CHECKIN_CANNOT_MAKEUP_TODAY]: "Cannot makeup today's check-in",
  [ErrorCode.CHECKIN_INVALID_DATE]: 'Invalid check-in date',

  // Wallet Errors
  [ErrorCode.WALLET_NOT_FOUND]: 'Wallet not found',
  [ErrorCode.WALLET_INSUFFICIENT_BALANCE]: 'Insufficient wallet balance',
  [ErrorCode.WALLET_INVALID_AMOUNT]: 'Invalid amount',
  [ErrorCode.WALLET_WITHDRAWAL_FAILED]: 'Withdrawal failed',
  [ErrorCode.WALLET_DEPOSIT_FAILED]: 'Deposit failed',
  [ErrorCode.WALLET_TRANSACTION_NOT_FOUND]: 'Transaction not found',
  [ErrorCode.WALLET_DAILY_LIMIT_EXCEEDED]: 'Daily transaction limit exceeded',
  [ErrorCode.WALLET_MONTHLY_LIMIT_EXCEEDED]: 'Monthly transaction limit exceeded',

  // Red Packet Errors
  [ErrorCode.REDPACKET_NOT_FOUND]: 'Red packet not found',
  [ErrorCode.REDPACKET_ALREADY_CLAIMED]: 'Red packet already claimed',
  [ErrorCode.REDPACKET_EXPIRED]: 'Red packet has expired',
  [ErrorCode.REDPACKET_NO_AVAILABLE]: 'No red packets available',
  [ErrorCode.REDPACKET_CLAIM_FAILED]: 'Failed to claim red packet',

  // Lottery Errors
  [ErrorCode.LOTTERY_NOT_ENOUGH_BALANCE]: 'Not enough balance for lottery',
  [ErrorCode.LOTTERY_INVALID_TICKET]: 'Invalid lottery ticket',
  [ErrorCode.LOTTERY_DRAW_FAILED]: 'Lottery draw failed',
  [ErrorCode.LOTTERY_PRIZE_NOT_FOUND]: 'Prize not found',
  [ErrorCode.LOTTERY_ALREADY_CLAIMED]: 'Prize already claimed',
  [ErrorCode.LOTTERY_NO_TICKETS_AVAILABLE]: 'No lottery tickets available',

  // File Upload Errors
  [ErrorCode.FILE_TOO_LARGE]: 'File size exceeds limit',
  [ErrorCode.FILE_INVALID_TYPE]: 'Invalid file type',
  [ErrorCode.FILE_UPLOAD_FAILED]: 'File upload failed',
  [ErrorCode.FILE_NOT_FOUND]: 'File not found',

  // Database Errors
  [ErrorCode.DB_CONNECTION_ERROR]: 'Database connection error',
  [ErrorCode.DB_QUERY_ERROR]: 'Database query error',
  [ErrorCode.DB_TRANSACTION_ERROR]: 'Database transaction error',
  [ErrorCode.DB_CONSTRAINT_VIOLATION]: 'Database constraint violation',
}

/**
 * Create a standardized error response
 */
export const createErrorResponse = (
  code: ErrorCode,
  details?: unknown,
  customMessage?: string
): ErrorResponse => {
  return {
    code,
    message: customMessage || ERROR_MESSAGES[code],
    details,
    timestamp: new Date().toISOString(),
  }
}
