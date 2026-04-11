'use client'

import { motion } from 'framer-motion'
import { FiAward } from 'react-icons/fi'

interface PodiumUser {
  rank: number
  name: string
  score: number
  avatar: string
  change?: number
}

interface PodiumProps {
  topThree: [PodiumUser, PodiumUser, PodiumUser]
}

export default function Podium({ topThree }: PodiumProps) {
  const medalColors = ['bg-sotota-gold', 'bg-gray-400', 'bg-amber-600']
  const heights = ['h-48', 'h-40', 'h-32']
  const ranks = [1, 0, 2]

  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold text-sotota-text mb-8 text-center">শীর্ষ তিন চ্যাম্পিয়ন</h2>
      
      <div className="flex items-end justify-center gap-4 md:gap-8 h-80">
        {ranks.map((idx, position) => {
          const user = topThree[idx]
          const isCenter = position === 1
          
          return (
            <motion.div
              key={user.rank}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: position * 0.2 }}
              className="flex flex-col items-center"
            >
              {/* Medal */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: position * 0.2 + 0.1 }}
                className={`${medalColors[position]} rounded-full p-4 mb-4 shadow-lg`}
              >
                <FiAward className="text-white" size={32} />
              </motion.div>

              {/* Avatar */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: position * 0.2 + 0.15 }}
                className={`${medalColors[position]} rounded-full w-16 h-16 flex items-center justify-center font-bold text-white text-xl mb-3 shadow-lg ${
                  isCenter ? 'ring-4 ring-sotota-accent ring-opacity-50' : ''
                }`}
              >
                {user.avatar}
              </motion.div>

              {/* Podium */}
              <motion.div
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ delay: position * 0.2 + 0.2 }}
                className={`${heights[position]} ${medalColors[position]} rounded-t-lg w-24 md:w-32 flex flex-col items-center justify-end pb-4 shadow-xl`}
              >
                <p className="text-white font-bold text-lg sotota-stat">{user.score}</p>
                <p className="text-white text-xs mt-1">#{user.rank}</p>
              </motion.div>

              {/* Name */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: position * 0.2 + 0.3 }}
                className="mt-4 text-center"
              >
                <p className="text-sotota-text font-bold text-sm md:text-base">{user.name}</p>
                {user.change && (
                  <p className={`text-xs mt-1 ${user.change > 0 ? 'text-sotota-accent' : 'text-sotota-red'}`}>
                    {user.change > 0 ? '↑' : '↓'} {Math.abs(user.change)} পর্যায়
                  </p>
                )}
              </motion.div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
