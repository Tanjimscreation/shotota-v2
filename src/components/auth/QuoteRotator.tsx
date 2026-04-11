'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const QUOTES = [
  {
    text: 'প্রতিদিন একটু একটু করে শিখলে, এক দিন বড় কিছু হতে পারবে।',
    author: 'অজানা'
  },
  {
    text: 'সফলতা আসে যখন আপনি আপনার স্বপ্নকে লক্ষ্যে রূপান্তরিত করেন।',
    author: 'অজানা'
  },
  {
    text: 'কঠোর পরিশ্রম সবসময় ফল দেয়, শুধু ধৈর্য ধরতে হবে।',
    author: 'অজানা'
  },
  {
    text: 'আপনার যাত্রা শুরু হোক আজ থেকেই, কাল নয়।',
    author: 'অজানা'
  },
  {
    text: 'প্রতিটি পরীক্ষা একটি নতুন সুযোগ, একটি চ্যালেঞ্জ নয়।',
    author: 'অজানা'
  }
]

export default function QuoteRotator() {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % QUOTES.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const current = QUOTES[currentIndex]

  return (
    <div className="min-h-[200px] flex flex-col justify-center items-center px-8">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <p className="text-xl md:text-2xl font-semibold text-sotota-text mb-4 leading-relaxed">
            "{current.text}"
          </p>
          <p className="text-sotota-muted text-sm">— {current.author}</p>
        </motion.div>
      </AnimatePresence>

      {/* Indicator dots */}
      <div className="flex gap-2 mt-8">
        {QUOTES.map((_, index) => (
          <motion.div
            key={index}
            className={`h-2 rounded-full transition-all ${
              index === currentIndex ? 'bg-sotota-accent w-6' : 'bg-sotota-border w-2'
            }`}
            animate={{
              width: index === currentIndex ? 24 : 8
            }}
          />
        ))}
      </div>
    </div>
  )
}
