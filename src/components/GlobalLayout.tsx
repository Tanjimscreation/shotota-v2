'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
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

  return (
    <div className="relative min-h-screen">
      {/* Logo - Top Left */}
      <Link href="/" className="fixed top-4 left-4 z-50 hover:opacity-80 transition-opacity">
        <div className="relative w-12 h-12 md:w-16 md:h-16">
          <Image
            src="/logo.png"
            alt="Shotota Logo"
            fill
            className="object-contain"
            priority
          />
        </div>
      </Link>

      {/* Animated Watermark - Full Page Background */}
      <motion.div
        variants={watermarkVariants}
        animate="animate"
        className="fixed inset-0 pointer-events-none flex items-center justify-center"
      >
        <div className="text-4xl md:text-6xl font-bold text-center select-none">
          <span className="text-black">কাট মার্ক </span>
          <span className="text-red-600">তুলতে</span>
          <span className="text-black"> আমরাই </span>
          <span className="text-red-600">সেরা</span>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
}
