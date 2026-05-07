'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

export default function GlobalLayout({ children }: { children: React.ReactNode }) {
  // Watermark animation - oscillating fade and drift
  const watermarkVariants = {
    animate: {
      opacity: [0.03, 0.08, 0.03],
      y: [0, 8, 0],
      transition: {
        duration: 8,
        repeat: Infinity,
        ease: 'easeInOut' as any,
      },
    },
  }

  // Logo animation - entrance and hover
  const logoVariants = {
    initial: { opacity: 0, x: -20 },
    animate: { 
      opacity: 1, 
      x: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut' as any,
      }
    },
    hover: {
      scale: 1.1,
      transition: { duration: 0.3 }
    }
  }

  return (
    <div className="relative min-h-screen">
      {/* Logo - Top Left with Animation */}
      <motion.div
        initial="initial"
        animate="animate"
        whileHover="hover"
        variants={logoVariants}
        className="fixed top-4 left-4 z-50"
      >
        <Link href="/" className="block">
          {/* Shotota Logo - Bengali Only with Color Palette */}
          <div className="flex items-center gap-1 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
            <div className="text-3xl font-bold tracking-tight">
              <span className="text-red-600">স</span>
              <span className="text-blue-600">ত</span>
              <span className="text-red-600">ত</span>
              <span className="text-green-600">া</span>
            </div>
          </div>
        </Link>
      </motion.div>

      {/* Animated Watermark - Full Page Background */}
      <motion.div
        variants={watermarkVariants}
        animate="animate"
        className="fixed inset-0 pointer-events-none flex items-center justify-center"
      >
        <motion.div 
          className="text-4xl md:text-6xl font-bold text-center select-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <span className="text-black">কাট মার্ক </span>
          <span className="text-red-600">তুলতে</span>
          <span className="text-black"> আমরাই </span>
          <span className="text-red-600">সেরা</span>
        </motion.div>
      </motion.div>

      {/* Main Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
}
