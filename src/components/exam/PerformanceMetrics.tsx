'use client'

import { motion } from 'framer-motion'

interface PerformanceMetricsProps {
  score: number
  total: number
  timeSpent: string
  avgTimePerQuestion: string
  difficulty: 'সহজ' | 'মাঝারি' | 'কঠিন'
  category: string
  previousScore?: number
  improvement?: number
}

export default function PerformanceMetrics({
  score,
  total,
  timeSpent,
  avgTimePerQuestion,
  difficulty,
  category,
  previousScore,
  improvement
}: PerformanceMetricsProps) {
  const percentage = Math.round((score / total) * 100)
  const hasImproved = improvement && improvement > 0

  const difficultyColor = {
    'সহজ': 'text-green-500',
    'মাঝারি': 'text-yellow-500',
    'কঠিন': 'text-red-500'
  }

  const difficultyBg = {
    'সহজ': 'bg-green-500/10 border-green-500/30',
    'মাঝারি': 'bg-yellow-500/10 border-yellow-500/30',
    'কঠিন': 'bg-red-500/10 border-red-500/30'
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.4 }}
      className="space-y-4"
    >
      <h3 className="text-lg font-bold text-sotota-text">আপনার কর্মক্ষমতা</h3>

      {/* Grid of metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Score */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-sotota-card2 border border-sotota-border rounded-lg p-4 text-center"
        >
          <p className="text-sotota-muted text-xs mb-2">স্কোর</p>
          <p className="sotota-stat text-2xl font-bold text-sotota-accent">
            {score}/{total}
          </p>
        </motion.div>

        {/* Percentage */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          className="bg-sotota-card2 border border-sotota-border rounded-lg p-4 text-center"
        >
          <p className="text-sotota-muted text-xs mb-2">শতাংশ</p>
          <p className="sotota-stat text-2xl font-bold text-sotota-accentl">{percentage}%</p>
        </motion.div>

        {/* Time Spent */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-sotota-card2 border border-sotota-border rounded-lg p-4 text-center"
        >
          <p className="text-sotota-muted text-xs mb-2">সময় নেওয়া</p>
          <p className="sotota-stat text-lg font-bold text-sotota-text">{timeSpent}</p>
        </motion.div>

        {/* Avg per Question */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65 }}
          className="bg-sotota-card2 border border-sotota-border rounded-lg p-4 text-center"
        >
          <p className="text-sotota-muted text-xs mb-2">প্রতি প্রশ্ন</p>
          <p className="sotota-stat text-lg font-bold text-sotota-text">{avgTimePerQuestion}</p>
        </motion.div>
      </div>

      {/* Details Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Difficulty */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className={`rounded-lg border-2 p-4 ${difficultyBg[difficulty]}`}
        >
          <p className="text-sotota-muted text-sm mb-1">কঠিনতা স্তর</p>
          <p className={`font-bold text-lg ${difficultyColor[difficulty]}`}>{difficulty}</p>
        </motion.div>

        {/* Category */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75 }}
          className="bg-sotota-card2 border border-sotota-border rounded-lg p-4"
        >
          <p className="text-sotota-muted text-sm mb-1">বিষয়</p>
          <p className="font-bold text-lg text-sotota-accent">{category}</p>
        </motion.div>
      </div>

      {/* Improvement - if available */}
      {previousScore !== undefined && improvement !== undefined && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className={`rounded-lg border-2 p-4 ${
            hasImproved
              ? 'bg-sotota-accent/10 border-sotota-accent'
              : 'bg-red-500/10 border-red-500/30'
          }`}
        >
          <p className="text-sotota-muted text-sm mb-2">পূর্ববর্তী প্রচেষ্টার তুলনায়</p>
          <div className="flex items-center gap-3">
            <span className="sotota-stat text-2xl font-bold text-sotota-accent">
              {previousScore}/{total}
            </span>
            <span className={`text-lg font-bold ${hasImproved ? 'text-sotota-accent' : 'text-red-500'}`}>
              {hasImproved ? '↑' : '↓'} {Math.abs(improvement)} পয়েন্ট
            </span>
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}
