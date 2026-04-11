'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'

interface ExamQuestionProps {
  questionNumber: number
  totalQuestions: number
  question: string
  options: string[]
  selectedOption: number | null
  onSelectOption: (index: number) => void
}

const BANGLA_OPTIONS = ['ক', 'খ', 'গ', 'ঘ']

export default function ExamQuestion({
  questionNumber,
  totalQuestions,
  question,
  options,
  selectedOption,
  onSelectOption
}: ExamQuestionProps) {
  const [hoveredOption, setHoveredOption] = useState<number | null>(null)

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="w-full"
    >
      {/* Question Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <span className="sotota-stat text-sm font-bold text-sotota-accent">
            প্রশ্ন {questionNumber} / {totalQuestions}
          </span>
          <div className="h-1 flex-1 mx-4 bg-sotota-card2 rounded-full overflow-hidden">
            <motion.div
              animate={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
              transition={{ duration: 0.3 }}
              className="h-full bg-gradient-to-r from-sotota-accent to-sotota-accentl"
            />
          </div>
        </div>

        {/* Question Text */}
        <h2 className="text-2xl font-bold text-sotota-text mb-8 leading-relaxed">
          {question}
        </h2>
      </div>

      {/* Options */}
      <div className="space-y-4">
        {options.map((option, index) => {
          const isSelected = selectedOption === index
          const banglaLabel = BANGLA_OPTIONS[index]
          const isHovered = hoveredOption === index

          return (
            <motion.button
              key={index}
              whileHover={{ x: 8 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelectOption(index)}
              onMouseEnter={() => setHoveredOption(index)}
              onMouseLeave={() => setHoveredOption(null)}
              className={`w-full text-left p-5 rounded-lg border-2 transition flex items-start gap-4 group ${
                isSelected
                  ? 'bg-sotota-accent bg-opacity-10 border-sotota-accent shadow-lg'
                  : isHovered
                  ? 'bg-sotota-card2 border-sotota-accentd'
                  : 'bg-sotota-card border-sotota-border hover:border-sotota-accent'
              }`}
            >
              {/* Option Label - Bangla Letter */}
              <div
                className={`flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center font-bold text-lg transition ${
                  isSelected
                    ? 'bg-sotota-accent text-white'
                    : isHovered
                    ? 'bg-sotota-accentd text-white'
                    : 'bg-sotota-card2 text-sotota-accent'
                }`}
              >
                {banglaLabel}
              </div>

              {/* Option Text */}
              <div className="flex-1 pt-1">
                <p className="text-sotota-text font-medium group-hover:text-sotota-accent transition">
                  {option}
                </p>
              </div>

              {/* Check Icon */}
              {isSelected && (
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  className="flex-shrink-0 w-6 h-6 rounded-full bg-sotota-accent flex items-center justify-center"
                >
                  <span className="text-white font-bold text-sm">✓</span>
                </motion.div>
              )}
            </motion.button>
          )
        })}
      </div>

      {/* Question Info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mt-8 p-4 bg-sotota-card2 rounded-lg border border-sotota-border"
      >
        <p className="text-sm text-sotota-muted">
          💡 {selectedOption === null ? 'এখনও কোনো উত্তর নির্বাচন করেননি' : 'আপনার উত্তর সংরক্ষিত হয়েছে'}
        </p>
      </motion.div>
    </motion.div>
  )
}
