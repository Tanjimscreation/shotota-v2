// src/components/home/Hero.tsx

'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'

export const Hero: React.FC = () => {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  return (
    <section suppressHydrationWarning className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gradient-to-br from-slate-900 via-emerald-800 to-teal-900 relative overflow-hidden">
      {/* Animated Background Elements - only render on client */}
      {isClient && (
        <>
          <motion.div
            className="absolute top-10 left-10 w-96 h-96 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl opacity-15"
            animate={{ y: [0, 50, 0] }}
            transition={{ duration: 5, repeat: Infinity }}
          />
          <motion.div
            className="absolute bottom-10 right-10 w-96 h-96 bg-teal-500 rounded-full mix-blend-multiply filter blur-3xl opacity-15"
            animate={{ y: [0, -50, 0] }}
            transition={{ duration: 5, repeat: Infinity }}
          />
        </>
      )}

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
        <motion.h1
          suppressHydrationWarning
          className="text-6xl md:text-7xl font-black bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent mb-8 tracking-tight drop-shadow-lg"
          style={{ fontFamily: '"Poppins", "Segoe UI", sans-serif' }}
          initial={isClient ? { opacity: 0, y: 20 } : false}
          animate={isClient ? { opacity: 1, y: 0 } : false}
          transition={{ duration: 0.8 }}
        >
          Shatota
        </motion.h1>

        <motion.div
          suppressHydrationWarning
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={isClient ? { opacity: 0, y: 20 } : false}
          animate={isClient ? { opacity: 1, y: 0 } : false}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Link
            href="/courses"
            className="px-8 py-3 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white font-bold rounded-lg hover:shadow-2xl hover:shadow-emerald-500/50 transition shadow-lg hover:scale-105"
            style={{ fontFamily: '"Poppins", "Segoe UI", sans-serif' }}
          >
            Explore Courses
          </Link>
          <Link
            href="/leaderboard"
            className="px-8 py-3 bg-slate-700 bg-opacity-50 text-emerald-300 font-bold rounded-lg hover:bg-opacity-70 transition shadow-lg hover:shadow-xl hover:scale-105 border-2 border-emerald-500 border-opacity-50 hover:border-opacity-100"
            style={{ fontFamily: '"Poppins", "Segoe UI", sans-serif' }}
          >
            View Leaderboard
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
