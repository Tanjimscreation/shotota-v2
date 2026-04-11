'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { FiAlertCircle } from 'react-icons/fi'

interface SubmitModalProps {
  isOpen: boolean
  totalQuestions: number
  answeredQuestions: number
  unansweredQuestions: number[]
  onSubmit: () => void
  onClose: () => void
  isSubmitting: boolean
}

export default function SubmitModal({
  isOpen,
  totalQuestions,
  answeredQuestions,
  unansweredQuestions,
  onSubmit,
  onClose,
  isSubmitting
}: SubmitModalProps) {
  const isAllAnswered = answeredQuestions === totalQuestions
  const percentage = Math.round((answeredQuestions / totalQuestions) * 100)

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-sotota-card border border-sotota-border rounded-lg p-8 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Icon */}
            <div className="flex justify-center mb-6">
              {isAllAnswered ? (
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.5 }}
                  className="w-16 h-16 rounded-full bg-sotota-accent/20 flex items-center justify-center"
                >
                  <span className="text-3xl">✓</span>
                </motion.div>
              ) : (
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 0.5 }}
                  className="w-16 h-16 rounded-full bg-yellow-500/20 flex items-center justify-center"
                >
                  <FiAlertCircle className="w-8 h-8 text-yellow-600" />
                </motion.div>
              )}
            </div>

            {/* Title */}
            <h2 className="text-2xl font-bold text-sotota-text text-center mb-4">
              পরীক্ষা জমা দেবেন?
            </h2>

            {/* Progress */}
            <div className="mb-6 bg-sotota-card2 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sotota-muted text-sm">উত্তর অগ্রগতি</span>
                <span className="sotota-stat font-bold text-sotota-accent">{percentage}%</span>
              </div>
              <div className="w-full h-2 bg-sotota-card rounded-full overflow-hidden">
                <motion.div
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 0.5 }}
                  className="h-full bg-gradient-to-r from-sotota-accent to-sotota-accentl"
                />
              </div>
              <div className="mt-3 text-sm text-sotota-muted">
                {answeredQuestions} / {totalQuestions} প্রশ্নের উত্তর দিয়েছেন
              </div>
            </div>

            {/* Warning for unanswered */}
            {!isAllAnswered && unansweredQuestions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg"
              >
                <p className="text-sm text-red-600 font-semibold mb-2">
                  ⚠️ {unansweredQuestions.length}টি প্রশ্নের উত্তর নেই
                </p>
                <p className="text-xs text-red-500">
                  প্রশ্ন: {unansweredQuestions.join(', ')}
                </p>
              </motion.div>
            )}

            {/* Info */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mb-6 p-3 bg-sotota-card2 rounded-lg text-center"
            >
              <p className="text-sm text-sotota-muted">
                জমা দেওয়ার পরে আপনি আপনার ফলাফল এবং ব্যাখ্যা দেখতে পারবেন।
              </p>
            </motion.div>

            {/* Buttons */}
            <div className="flex gap-3">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                disabled={isSubmitting}
                className="flex-1 px-4 py-3 border border-sotota-border rounded-lg text-sotota-text font-semibold hover:bg-sotota-card2 transition disabled:opacity-50"
              >
                বাতিল করুন
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.95 }}
                onClick={onSubmit}
                disabled={isSubmitting}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-sotota-accent to-sotota-accentd text-white rounded-lg font-semibold transition disabled:opacity-50"
              >
                {isSubmitting ? 'প্রক্রিয়াধীন...' : 'জমা দিন'}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
