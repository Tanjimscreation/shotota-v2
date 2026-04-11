'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { FiLock, FiCheckCircle, FiPlay } from 'react-icons/fi'

interface CourseCardProps {
  id: string
  title: string
  description: string
  thumbnail: string
  instructor: string
  progress: number
  enrolled: boolean
  locked: boolean
  category: string
  lessons: number
  onEnroll?: () => void
  onStart?: () => void
}

export default function CourseCard({
  id,
  title,
  description,
  thumbnail,
  instructor,
  progress,
  enrolled,
  locked,
  category,
  lessons,
  onEnroll,
  onStart
}: CourseCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`bg-sotota-card border border-sotota-border rounded-lg overflow-hidden transition ${
        locked ? 'opacity-60' : ''
      }`}>
        {/* Image */}
        <div className="relative h-40 bg-gradient-to-br from-sotota-accent to-sotota-accentd overflow-hidden">
          <motion.div
            initial={{ scale: 1 }}
            animate={{ scale: isHovered && !locked ? 1.05 : 1 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full flex items-center justify-center text-white text-sm font-bold"
          >
            {thumbnail}
          </motion.div>

          {/* Lock Badge */}
          {locked && (
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
              <FiLock className="text-white" size={40} />
            </div>
          )}

          {/* Category Badge */}
          <div className="absolute top-3 left-3">
            <span className="bg-sotota-accent text-white text-xs font-bold px-3 py-1 rounded-full">
              {category}
            </span>
          </div>

          {/* Progress Badge */}
          {enrolled && progress > 0 && (
            <div className="absolute top-3 right-3">
              <span className="bg-white text-sotota-bg text-xs font-bold px-3 py-1 rounded-full sotota-stat">
                {progress}%
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5">
          <h3 className="text-lg font-bold text-sotota-text mb-2 line-clamp-2">{title}</h3>
          <p className="text-sotota-muted text-sm mb-3 line-clamp-2">{description}</p>

          {/* Meta */}
          <div className="flex justify-between items-center text-xs text-sotota-muted mb-4">
            <span>শিক্ষক: {instructor}</span>
            <span>📚 {lessons} পাঠ</span>
          </div>

          {/* Progress Bar */}
          {enrolled && progress > 0 && (
            <div className="mb-4">
              <div className="w-full h-2 bg-sotota-card2 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="h-full bg-gradient-to-r from-sotota-accent to-sotota-accentl"
                />
              </div>
            </div>
          )}

          {/* Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={enrolled ? onStart : onEnroll}
            disabled={locked}
            className={`w-full py-2.5 rounded-lg font-semibold transition flex items-center justify-center gap-2 ${
              locked
                ? 'bg-sotota-card2 text-sotota-muted cursor-not-allowed'
                : enrolled
                ? 'bg-sotota-accent text-white hover:bg-sotota-accentl'
                : 'bg-sotota-card2 text-sotota-accent border border-sotota-accent hover:bg-sotota-accent hover:text-white'
            }`}
          >
            {locked ? (
              <>
                <FiLock size={16} /> লক করা
              </>
            ) : enrolled ? (
              <>
                <FiPlay size={16} /> চালু করুন
              </>
            ) : (
              <>
                <FiCheckCircle size={16} /> নথিভুক্ত হন
              </>
            )}
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}
