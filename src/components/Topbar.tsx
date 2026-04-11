'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useSession } from 'next-auth/react'
import Image from 'next/image'

export const Topbar: React.FC = () => {
  const { data: session } = useSession()
  const [greeting, setGreeting] = useState('')
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    // Update time
    const timer = setInterval(() => {
      setTime(new Date())
    }, 60000) // Update every minute

    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    // Set greeting based on time of day
    const hour = time.getHours()
    if (hour < 12) {
      setGreeting('সুপ্রভাত')
    } else if (hour < 17) {
      setGreeting('শুভ অপরাহ্ন')
    } else {
      setGreeting('শুভ সন্ধ্যা')
    }
  }, [time])

  const userName = session?.user?.name || 'শিক্ষার্থী'
  const userBatch = (session?.user as any)?.batch || 'MBBS'

  return (
    <header
      className="hidden md:flex md:fixed md:left-[190px] md:right-0 md:top-0 md:h-20 md:items-center md:justify-between md:px-8 md:border-b"
      style={{
        backgroundColor: 'var(--sotota-surface)',
        borderColor: 'var(--sotota-border)',
      }}
    >
      {/* Left: Greeting */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h2 
          className="text-lg font-bold"
          style={{ color: 'var(--sotota-accentl)' }}
        >
          {greeting}, {userName}! 👋
        </h2>
        <p 
          className="text-xs font-medium"
          style={{ color: 'var(--sotota-muted)' }}
        >
          আপনার শেখার যাত্রা চালিয়ে যান
        </p>
      </motion.div>

      {/* Right: User Info & Avatar */}
      <motion.div
        className="flex items-center gap-4"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="text-right">
          <p 
            className="text-sm font-semibold"
            style={{ color: 'var(--sotota-text)' }}
          >
            {userName}
          </p>
          <p 
            className="text-xs"
            style={{ color: 'var(--sotota-muted)' }}
          >
            {userBatch}
          </p>
        </div>

        {/* Avatar */}
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white"
          style={{ backgroundColor: 'var(--sotota-accent)' }}
        >
          {userName.charAt(0)}
        </div>
      </motion.div>
    </header>
  )
}
