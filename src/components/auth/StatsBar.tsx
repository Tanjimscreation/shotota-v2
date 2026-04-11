'use client'

import { motion } from 'framer-motion'

const STATS = [
  { value: '৫০,০০০+', label: 'শিক্ষার্থী' },
  { value: '২০০+', label: 'পরীক্ষা' },
  { value: 'MBBS', label: 'প্রস্তুতি' }
]

export default function StatsBar() {
  return (
    <div className="grid grid-cols-3 gap-4 mt-12">
      {STATS.map((stat, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-sotota-card bg-opacity-50 backdrop-blur rounded-lg p-4 text-center border border-sotota-border"
        >
          <p className="text-sotota-accent font-bold text-lg">{stat.value}</p>
          <p className="text-sotota-muted text-xs mt-1">{stat.label}</p>
        </motion.div>
      ))}
    </div>
  )
}
