// src/lib/utils/validators.ts

/**
 * Validation utilities for forms and API requests
 */

export const validators = {
  /**
   * Validate email format
   */
  isValidEmail: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  },

  /**
   * Validate password strength
   * Requirements: min 8 chars, 1 uppercase, 1 lowercase, 1 number
   */
  isStrongPassword: (password: string): boolean => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/
    return passwordRegex.test(password)
  },

  /**
   * Validate phone number (Bangladesh format)
   */
  isValidPhone: (phone: string): boolean => {
    const phoneRegex = /^(\+880|0)?1[3-9]\d{8}$/
    return phoneRegex.test(phone.replace(/\s/g, ''))
  },

  /**
   * Validate course title
   */
  isValidCourseTitle: (title: string): boolean => {
    return title.length >= 3 && title.length <= 100
  },

  /**
   * Validate course price
   */
  isValidPrice: (price: number): boolean => {
    return price > 0 && price <= 1000000
  },

  /**
   * Validate exam duration
   */
  isValidDuration: (duration: number): boolean => {
    return duration > 0 && duration <= 480 // 8 hours max
  },

  /**
   * Validate file size
   */
  isValidFileSize: (fileSize: number, maxSize = 10485760): boolean => {
    return fileSize > 0 && fileSize <= maxSize
  },

  /**
   * Validate file type
   */
  isValidFileType: (
    fileType: string,
    allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
  ): boolean => {
    return allowedTypes.includes(fileType)
  },
}

/**
 * Type for validation errors
 */
export type ValidationErrors = Record<string, string>

/**
 * Validation error messages
 */
export const errorMessages = {
  INVALID_EMAIL: 'Please enter a valid email address',
  WEAK_PASSWORD: 'Password must be at least 8 characters with uppercase, lowercase, and number',
  INVALID_PHONE: 'Please enter a valid phone number',
  INVALID_TITLE: 'Title must be between 3 and 100 characters',
  INVALID_PRICE: 'Price must be between 0 and 1000000',
  INVALID_DURATION: 'Duration must be between 1 and 480 minutes',
  FILE_TOO_LARGE: 'File size exceeds maximum limit',
  INVALID_FILE_TYPE: 'Invalid file type. Please upload PDF or Word document',
  REQUIRED_FIELD: 'This field is required',
}
