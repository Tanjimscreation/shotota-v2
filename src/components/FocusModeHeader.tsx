'use client'

import React from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { FiArrowLeft, FiClock, FiBook } from 'react-icons/fi'

interface FocusModeHeaderProps {
  examTitle: string
  courseTitle: string
  timeLeft: number
  totalQuestions: number
  currentQuestion: number
  onExit: () => void
}

export const FocusModeHeader: React.FC<FocusModeHeaderProps> = ({
  examTitle,
  courseTitle,
  timeLeft,
  totalQuestions,
  currentQuestion,
  onExit,
}) => {
  // Format time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <motion.header
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="fixed top-0 left-0 right-0 z-40 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 shadow-2xl border-b border-emerald-500/30"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left - Back to Dashboard */}
          <motion.button
            onClick={onExit}
            whileHover={{ scale: 1.05, x: -3 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 text-emerald-300 hover:text-emerald-100 transition-colors px-3 py-2 rounded-lg hover:bg-white/5"
          >
            <FiArrowLeft className="w-5 h-5" />
            <span className="font-semibold hidden sm:inline">ড্যাশবোর্ডে ফিরুন</span>
          </motion.button>

          {/* Center - Exam Info */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="flex-1 text-center px-4"
          >
            <div className="flex items-center justify-center gap-2 text-emerald-400">
              <FiBook className="w-4 h-4" />
              <span className="text-sm font-medium">{courseTitle}</span>
            </div>
            <h1 className="text-lg md:text-xl font-bold text-white truncate max-w-md mx-auto">
              {examTitle}
            </h1>
          </motion.div>

          {/* Right - Timer & Progress */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-center gap-4"
          >
            {/* Progress */}
            <div className="hidden sm:block text-right">
              <p className="text-xs text-emerald-300/70">প্রশ্ন</p>
              <p className="text-sm font-bold text-emerald-300">
                {currentQuestion + 1} <span className="text-emerald-400/50">/ {totalQuestions}</span>
              </p>
            </div>

            {/* Timer */}
            <motion.div
              animate={timeLeft < 300 ? { scale: [1, 1.05, 1] } : {}}
              transition={{ duration: 1, repeat: timeLeft < 300 ? Infinity : 0 }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-mono font-bold ${
                timeLeft < 300
                  ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                  : 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30'
              }`}
            >
              <FiClock className="w-4 h-4" />
              <span className="text-lg">{formatTime(timeLeft)}</span>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="h-1 bg-slate-700/50">
        <motion.div
          className="h-full bg-gradient-to-r from-emerald-400 to-cyan-400"
          initial={{ width: 0 }}
          animate={{ width: `${((currentQuestion + 1) / totalQuestions) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>
    </motion.header>
  )
}
