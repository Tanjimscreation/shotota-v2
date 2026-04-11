'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

interface ExamTimerProps {
  totalSeconds: number
  onTimeUp: () => void
  isActive: boolean
}

const CIRCUMFERENCE = 2 * Math.PI * 45

export default function ExamTimer({ totalSeconds, onTimeUp, isActive }: ExamTimerProps) {
  const [timeLeft, setTimeLeft] = useState(totalSeconds)
  const [hasWarned30, setHasWarned30] = useState(false)
  const [hasWarned10, setHasWarned10] = useState(false)

  useEffect(() => {
    if (!isActive) return

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          onTimeUp()
          return 0
        }

        // Warn at 30 seconds
        if (prev === 31 && !hasWarned30) {
          setHasWarned30(true)
        }

        // Warn at 10 seconds
        if (prev === 11 && !hasWarned10) {
          setHasWarned10(true)
        }

        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [isActive, onTimeUp, hasWarned30, hasWarned10])

  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60
  const percentage = timeLeft / totalSeconds

  const strokeDashoffset = CIRCUMFERENCE * (1 - percentage)
  const isLowTime = timeLeft <= 30
  const isCritical = timeLeft <= 10

  const displayColor = isCritical
    ? '#C0392B'
    : isLowTime
    ? '#F0B429'
    : '#1DB954'

  const bgColor = isCritical
    ? 'bg-red-500/10'
    : isLowTime
    ? 'bg-yellow-500/10'
    : 'bg-sotota-accent/10'

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`flex flex-col items-center ${bgColor} rounded-full p-4 w-fit`}
    >
      <div className="relative w-28 h-28">
        {/* Background circle */}
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="rgba(29,185,84,0.1)"
            strokeWidth="2"
          />
          {/* Progress circle */}
          <motion.circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke={displayColor}
            strokeWidth="3"
            strokeLinecap="round"
            initial={{ strokeDashoffset: CIRCUMFERENCE }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1, ease: 'linear' }}
            style={{
              strokeDasharray: CIRCUMFERENCE,
              filter: isCritical ? 'drop-shadow(0 0 8px #C0392B)' : 'none'
            }}
          />
        </svg>

        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="sotota-stat text-2xl font-bold" style={{ color: displayColor }}>
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </div>
          <div className="text-xs text-sotota-muted mt-1">বাকি সময়</div>
        </div>
      </div>

      {/* Warnings */}
      {isCritical && (
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 0.5, repeat: Infinity }}
          className="mt-3 text-sm font-bold text-red-500"
        >
          সমাপ্তি সময় ঘনিয়ে আসছে!
        </motion.div>
      )}
      {isLowTime && !isCritical && (
        <motion.div className="mt-3 text-sm font-semibold text-yellow-600">
          ৩০ সেকেন্ড বাকি
        </motion.div>
      )}
    </motion.div>
  )
}
