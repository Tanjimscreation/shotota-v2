'use client'

import { motion } from 'framer-motion'

interface AnswerItem {
  questionNumber: number
  question: string
  yourAnswerIndex: number | null
  correctAnswerIndex: number
  explanation: string
  isCorrect: boolean
  questionOptions: string[]
}

export default function AnswerReview({ answers }: { answers: AnswerItem[] }) {
  const correctCount = answers.filter((a) => a.isCorrect).length

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
      className="space-y-4"
    >
      {/* Summary */}
      <div className="bg-sotota-card2 border border-sotota-border rounded-lg p-6 mb-6">
        <h3 className="text-lg font-bold text-sotota-text mb-4">উত্তর পর্যালোচনা</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sotota-muted text-sm mb-1">সঠিক উত্তর</p>
            <p className="sotota-stat text-2xl font-bold text-sotota-accent">{correctCount}/{answers.length}</p>
          </div>
          <div>
            <p className="text-sotota-muted text-sm mb-1">ভুল উত্তর</p>
            <p className="sotota-stat text-2xl font-bold text-red-500">{answers.length - correctCount}/{answers.length}</p>
          </div>
        </div>
      </div>

      {/* Questions */}
      {answers.map((answer, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 + index * 0.05 }}
          className={`rounded-lg border-2 overflow-hidden ${
            answer.isCorrect
              ? 'bg-sotota-accent/5 border-sotota-accent'
              : 'bg-red-500/5 border-red-500/30'
          }`}
        >
          {/* Header */}
          <div className="p-4 bg-sotota-card2 border-b border-sotota-border">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm text-sotota-muted mb-2">প্রশ্ন {answer.questionNumber}</p>
                <p className="font-semibold text-sotota-text">{answer.question}</p>
              </div>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5 + index * 0.05 }}
                className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold ml-4 ${
                  answer.isCorrect
                    ? 'bg-sotota-accent text-white'
                    : 'bg-red-500 text-white'
                }`}
              >
                {answer.isCorrect ? '✓' : '✗'}
              </motion.div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4">
            {/* Your Answer */}
            <div>
              <p className="text-sm font-semibold text-sotota-text mb-2">আপনার উত্তর</p>
              <div
                className={`p-4 rounded-lg border-2 ${
                  answer.isCorrect
                    ? 'bg-sotota-accent/10 border-sotota-accent text-sotota-accent'
                    : 'bg-red-500/10 border-red-500/30 text-red-600'
                }`}
              >
                {answer.yourAnswerIndex !== null ? (
                  <>
                    <span className="font-bold text-lg">
                      {String.fromCharCode(65 + answer.yourAnswerIndex)}
                    </span>
                    {' — '}
                    <span>{answer.questionOptions[answer.yourAnswerIndex]}</span>
                  </>
                ) : (
                  <span className="italic text-sotota-muted">কোনো উত্তর দেওয়া হয়নি</span>
                )}
              </div>
            </div>

            {/* Correct Answer */}
            {!answer.isCorrect && (
              <div>
                <p className="text-sm font-semibold text-sotota-text mb-2">সঠিক উত্তর</p>
                <div className="p-4 rounded-lg bg-sotota-accent/10 border-2 border-sotota-accent text-sotota-accent">
                  <span className="font-bold text-lg">
                    {String.fromCharCode(65 + answer.correctAnswerIndex)}
                  </span>
                  {' — '}
                  <span>{answer.questionOptions[answer.correctAnswerIndex]}</span>
                </div>
              </div>
            )}

            {/* Explanation */}
            <div className="bg-sotota-card border border-sotota-border rounded-lg p-4">
              <p className="text-sm font-semibold text-sotota-text mb-2">ব্যাখ্যা</p>
              <p className="text-sotota-muted text-sm leading-relaxed">{answer.explanation}</p>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  )
}
