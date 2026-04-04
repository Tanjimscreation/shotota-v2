// src/lib/utils/formatters.ts

/**
 * Formatting utilities for display
 */

export const formatters = {
  /**
   * Format currency (BDT)
   */
  formatCurrency: (amount: number): string => {
    return new Intl.NumberFormat('bn-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0,
    }).format(amount)
  },

  /**
   * Format percentage
   */
  formatPercentage: (value: number, decimals = 2): string => {
    return `${value.toFixed(decimals)}%`
  },

  /**
   * Format time from seconds
   */
  formatTime: (seconds: number): string => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`
    }
    return `${minutes}m ${secs}s`
  },

  /**
   * Format date
   */
  formatDate: (date: Date | string): string => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  },

  /**
   * Format date and time
   */
  formatDateTime: (date: Date | string): string => {
    return new Date(date).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  },

  /**
   * Format name (capitalize first letter of each word)
   */
  formatName: (name: string): string => {
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ')
  },

  /**
   * Format question text (add numbering)
   */
  formatQuestionNumber: (number: number): string => {
    return `Q${number}.`
  },

  /**
   * Format score with negative marking
   */
  formatScore: (correct: number, wrong: number, negativeMarking: number): number => {
    return correct * 1 - wrong * negativeMarking
  },

  /**
   * Format phone number
   */
  formatPhone: (phone: string): string => {
    return phone.replace(/(\d{2})(\d{4})(\d{6})/, '$1-$2-$3')
  },

  /**
   * Truncate text
   */
  truncateText: (text: string, maxLength: number): string => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength - 3) + '...'
  },
}
