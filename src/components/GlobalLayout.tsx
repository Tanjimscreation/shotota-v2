'use client'

import { motion, Variants } from 'framer-motion'

export default function GlobalLayout({ children }: { children: React.ReactNode }) {
  // Floating watermark animation - hardware accelerated
  const watermarkVariants: Variants = {
    animate: {
      x: [0, 30, 0, -30, 0],
      y: [0, -15, 0, 15, 0],
      opacity: [0.05, 0.08, 0.05, 0.08, 0.05],
      transition: {
        duration: 12,
        repeat: Infinity,
        ease: 'easeInOut' as const,
      },
    },
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      {/* Animated Watermark Background Layer */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {/* Multiple floating text instances for depth */}
        {[0, 1, 2].map((index) => (
          <motion.div
            key={index}
            variants={watermarkVariants}
            animate="animate"
            className="absolute"
            style={{
              top: `${20 + index * 30}%`,
              left: `${10 + index * 25}%`,
              transform: `rotate(${index % 2 === 0 ? -5 : 5}deg)`,
            }}
          >
            <div className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight whitespace-nowrap">
              <span className="text-red-500">কাট মার্ক</span>
              <span className="text-gray-900"> তুলতে আমরাই </span>
              <span className="text-red-500">সেরা</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Content - above watermark */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
}
