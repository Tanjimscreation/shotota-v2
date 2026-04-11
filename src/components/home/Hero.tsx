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

  // Main render - same for server and client initially
  return (
    <section className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gradient-to-br from-emerald-400 via-green-500 to-teal-600 relative overflow-hidden">
      {/* Animated Background Elements - only render on client */}
      {isClient && (
        <>
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
        </>
      )}

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
        {isClient ? (
          <>
            <motion.h1
              className="text-6xl md:text-7xl font-black text-white mb-8 tracking-tight"
              style={{ fontFamily: '"Poppins", "Segoe UI", sans-serif' }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              সততা
            </motion.h1>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
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
          </>
        ) : (
          <>
            <h1 className="text-6xl md:text-7xl font-black text-white mb-8 tracking-tight" style={{ fontFamily: '"Poppins", "Segoe UI", sans-serif' }}>
              সততা
            </h1>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/courses"
                className="px-8 py-3 bg-white text-emerald-600 font-bold rounded-lg hover:bg-emerald-50 transition shadow-lg hover:shadow-xl"
                style={{ fontFamily: '"Poppins", "Segoe UI", sans-serif' }}
              >
                কোর্স অন্বেষণ করুন
              </Link>
              <Link
                href="/leaderboard"
                className="px-8 py-3 bg-white bg-opacity-20 text-white font-bold rounded-lg hover:bg-opacity-30 transition shadow-lg border border-white border-opacity-50"
                style={{ fontFamily: '"Poppins", "Segoe UI", sans-serif' }}
              >
                লিডারবোর্ড দেখুন
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  )
}
