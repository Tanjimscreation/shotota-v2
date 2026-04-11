'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiTrendingUp, FiTrendingDown } from 'react-icons/fi'

interface LeaderboardEntry {
  rank: number
  name: string
  score: number
  change: number
  batch: string
  streak: number
}

interface LiveTableProps {
  data: LeaderboardEntry[]
  isLive: boolean
}

export default function LiveTable({ data, isLive }: LiveTableProps) {
  const [displayData, setDisplayData] = useState(data)
  const [updated, setUpdated] = useState(false)

  useEffect(() => {
    if (isLive) {
      const interval = setInterval(() => {
        setUpdated(true)
        setTimeout(() => setUpdated(false), 500)
      }, 30000)
      return () => clearInterval(interval)
    }
  }, [isLive])

  return (
    <div className="bg-sotota-card border border-sotota-border rounded-lg overflow-hidden">
      {/* Header */}
      <div className="bg-sotota-card2 px-6 py-4 border-b border-sotota-border">
        <div className="grid grid-cols-12 gap-4 text-sotota-muted text-sm font-medium">
          <div className="col-span-1">র‍্যাংক</div>
          <div className="col-span-3">নাম</div>
          <div className="col-span-2 text-right">স্কোর</div>
          <div className="col-span-2 text-center">পরিবর্তন</div>
          <div className="col-span-2">ব্যাচ</div>
          <div className="col-span-2 text-right">সিরিজ</div>
        </div>
      </div>

      {/* Rows */}
      <div className="divide-y divide-sotota-border">
        <AnimatePresence>
          {displayData.map((entry, idx) => (
            <motion.div
              key={entry.rank}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ delay: idx * 0.05 }}
              className={`px-6 py-4 transition ${
                updated && idx < 3 ? 'bg-sotota-accent bg-opacity-10' : ''
              }`}
            >
              <div className="grid grid-cols-12 gap-4 items-center">
                {/* Rank */}
                <div className="col-span-1">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-sotota-card2 text-sotota-accent font-bold text-sm">
                    {entry.rank}
                  </span>
                </div>

                {/* Name */}
                <div className="col-span-3">
                  <p className="text-sotota-text font-medium truncate">{entry.name}</p>
                </div>

                {/* Score */}
                <div className="col-span-2 text-right">
                  <p className="text-sotota-accent font-bold sotota-stat">{entry.score}</p>
                </div>

                {/* Change */}
                <div className="col-span-2 text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
                      entry.change > 0
                        ? 'bg-sotota-accent bg-opacity-20 text-sotota-accent'
                        : entry.change < 0
                        ? 'bg-sotota-red bg-opacity-20 text-sotota-red'
                        : 'bg-sotota-card2 text-sotota-muted'
                    }`}
                  >
                    {entry.change > 0 ? <FiTrendingUp size={14} /> : entry.change < 0 ? <FiTrendingDown size={14} /> : null}
                    <span>{entry.change > 0 ? '+' : ''}{entry.change}</span>
                  </motion.div>
                </div>

                {/* Batch */}
                <div className="col-span-2">
                  <span className="text-sotota-muted text-sm">{entry.batch}</span>
                </div>

                {/* Streak */}
                <div className="col-span-2 text-right">
                  <span className="text-sotota-text font-semibold">🔥 {entry.streak}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Live indicator */}
      {isLive && (
        <div className="bg-sotota-card2 px-6 py-3 border-t border-sotota-border text-sm text-sotota-muted flex items-center gap-2">
          <motion.span
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-2 h-2 rounded-full bg-sotota-accent"
          />
          লাইভ আপডেট: প্রতি ३० সেকেন্ডে রিফ্রেশ হচ্ছে
        </div>
      )}
    </div>
  )
}
