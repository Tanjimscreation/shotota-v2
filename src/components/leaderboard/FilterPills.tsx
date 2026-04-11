'use client'

import { motion } from 'framer-motion'

interface FilterPillsProps {
  filters: string[]
  activeFilter: string
  onFilterChange: (filter: string) => void
}

export default function FilterPills({ filters, activeFilter, onFilterChange }: FilterPillsProps) {
  return (
    <div className="flex gap-2 mb-6 flex-wrap">
      {filters.map((filter) => (
        <motion.button
          key={filter}
          onClick={() => onFilterChange(filter)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`px-4 py-2 rounded-full font-medium transition ${
            activeFilter === filter
              ? 'bg-sotota-accent text-white shadow-lg shadow-sotota-accent/50'
              : 'bg-sotota-card2 text-sotota-text border border-sotota-border hover:border-sotota-accent'
          }`}
        >
          {filter}
        </motion.button>
      ))}
    </div>
  )
}
