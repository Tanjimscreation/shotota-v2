'use client'

import { motion } from 'framer-motion'

interface NavigationDotsProps {
  total: number
  current: number
  answered: number[]
  onDotClick: (index: number) => void
}

export default function NavigationDots({
  total,
  current,
  answered,
  onDotClick
}: NavigationDotsProps) {
  const banglaLetters = ['ক', 'খ', 'গ', 'ঘ', 'ঙ', 'চ', 'ছ', 'জ', 'ঝ', 'ঞ']

  return (
    <div className="flex flex-wrap gap-2">
      {Array.from({ length: total }).map((_, index) => {
        const isAnswered = answered.includes(index)
        const isCurrent = index === current

        return (
          <motion.button
            key={index}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onDotClick(index)}
            className={`w-12 h-12 rounded-lg font-bold transition flex items-center justify-center relative ${
              isCurrent
                ? 'bg-sotota-accent text-white shadow-lg ring-2 ring-sotota-accentl'
                : isAnswered
                ? 'bg-sotota-accentd text-white hover:bg-sotota-accent'
                : 'bg-sotota-card2 text-sotota-text hover:bg-sotota-card border border-sotota-border'
            }`}
          >
            {/* Question number */}
            <span className="sotota-stat text-sm">{index + 1}</span>

            {/* Answered checkmark */}
            {isAnswered && !isCurrent && (
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                className="absolute top-1 right-1 w-4 h-4 bg-sotota-accent rounded-full flex items-center justify-center"
              >
                <span className="text-white text-xs font-bold">✓</span>
              </motion.div>
            )}

            {/* Current indicator */}
            {isCurrent && (
              <motion.div
                layoutId="currentDot"
                className="absolute inset-0 rounded-lg border-2 border-sotota-accentl"
              />
            )}
          </motion.button>
        )
      })}
    </div>
  )
}
