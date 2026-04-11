'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { FiX } from 'react-icons/fi'

interface EnrollmentModalProps {
  isOpen: boolean
  courseTitle: string
  onEnroll: () => void
  onClose: () => void
}

export default function EnrollmentModal({ isOpen, courseTitle, onEnroll, onClose }: EnrollmentModalProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleEnroll = async () => {
    setIsLoading(true)
    setTimeout(() => {
      onEnroll()
      setIsLoading(false)
      onClose()
    }, 1000)
  }

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
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-sotota-muted hover:text-sotota-text transition"
            >
              <FiX size={24} />
            </button>

            {/* Content */}
            <h2 className="text-2xl font-bold text-sotota-text mb-3">কোর্সে নথিভুক্ত হন?</h2>
            <p className="text-sotota-muted mb-6">
              আপনি "{courseTitle}" কোর্সে নথিভুক্ত হতে চলেছেন। এই কোর্সটি আপনার শিক্ষা যাত্রার একটি গুরুত্বপূর্ণ অংশ হবে।
            </p>

            {/* Benefits */}
            <div className="bg-sotota-card2 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-sotota-text mb-3">আপনি পাবেন:</h3>
              <ul className="space-y-2 text-sotota-muted text-sm">
                <li>✓ সম্পূর্ণ ভিডিও পাঠ অ্যাক্সেস</li>
                <li>✓ নোট এবং রিসোর্স ডাউনলোড</li>
                <li>✓ কুইজ এবং অ্যাসাইনমেন্ট</li>
                <li>✓ সার্টিফিকেট সম্পূর্ণ করার পরে</li>
              </ul>
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="flex-1 px-4 py-3 border border-sotota-border rounded-lg text-sotota-text font-semibold hover:bg-sotota-card2 transition"
              >
                বাতিল করুন
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleEnroll}
                disabled={isLoading}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-sotota-accent to-sotota-accentd text-white rounded-lg font-semibold transition disabled:opacity-50"
              >
                {isLoading ? 'প্রক্রিয়াধীন...' : 'নথিভুক্ত করুন'}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
