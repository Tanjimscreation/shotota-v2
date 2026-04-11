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

  // Server-side render without animations
  if (!isClient) {
    return (
      <section className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gradient-to-br from-blue-600 via-blue-500 to-purple-600 relative overflow-hidden">
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Master Your Exams
          </h1>

          <p className="text-xl md:text-2xl text-blue-100 mb-8">
            Practice, compete, and achieve excellence with Shotota
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/courses"
              className="px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition shadow-lg"
            >
              Explore Courses
            </Link>
            <Link
              href="/leaderboard"
              className="px-8 py-3 bg-blue-700 text-white font-semibold rounded-lg hover:bg-blue-800 transition shadow-lg"
            >
              View Leaderboard
            </Link>
          </div>
        </div>
      </section>
    )
  }

  // Client-side render with animations
  return (
    <section className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gradient-to-br from-emerald-400 via-green-500 to-teal-600 relative overflow-hidden">
      {/* Animated Background Elements */}
      <motion.div
        className="absolute top-10 left-10 w-72 h-72 bg-green-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
        animate={{ y: [0, 50, 0] }}
        transition={{ duration: 5, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-10 right-10 w-72 h-72 bg-teal-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
        animate={{ y: [0, -50, 0] }}
        transition={{ duration: 5, repeat: Infinity }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
        <motion.h1
          className="text-6xl md:text-7xl font-black text-white mb-2 tracking-tight"
          style={{ fontFamily: '"Poppins", "Segoe UI", sans-serif' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          সততা
        </motion.h1>
        
        <motion.div
          className="h-1 w-24 bg-white rounded-full mx-auto mb-6"
          initial={{ opacity: 0, width: 0 }}
          animate={{ opacity: 1, width: 96 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        />

        <motion.h2
          className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-wide"
          style={{ fontFamily: '"Poppins", "Segoe UI", sans-serif' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          আপনার পরীক্ষায় আয়ত্ত করুন
        </motion.h2>

        <motion.p
          className="text-lg md:text-xl text-emerald-50 mb-8 font-medium max-w-2xl mx-auto leading-relaxed"
          style={{ fontFamily: '"Poppins", "Segoe UI", sans-serif' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          হাজারো শিক্ষার্থীদের সাথে অনুশীলন করুন, প্রতিযোগিতা করুন এবং উৎকর্ষতা অর্জন করুন
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <Link
            href="/courses"
            className="px-8 py-3 bg-white text-emerald-600 font-bold rounded-lg hover:bg-emerald-50 transition shadow-lg hover:shadow-xl transform hover:scale-105"
            style={{ fontFamily: '"Poppins", "Segoe UI", sans-serif' }}
          >
            কোর্স অন্বেষণ করুন
          </Link>
          <Link
            href="/leaderboard"
            className="px-8 py-3 bg-white bg-opacity-20 text-white font-bold rounded-lg hover:bg-opacity-30 transition shadow-lg hover:shadow-xl transform hover:scale-105 border border-white border-opacity-50"
            style={{ fontFamily: '"Poppins", "Segoe UI", sans-serif' }}
          >
            লিডারবোর্ড দেখুন
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
