'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { FiHome } from 'react-icons/fi'

function ExamResultsContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const score = parseInt(searchParams.get('score') || '0')
  const total = parseInt(searchParams.get('total') || '5')
  const [displayScore, setDisplayScore] = useState(0)

  const percentage = Math.round((score / total) * 100)
  const isPassed = percentage >= 60
  const gradeLetters = ['F', 'D', 'C', 'B', 'A']
  const grade = gradeLetters[Math.floor(percentage / 20)]

  useEffect(() => {
    const timer = setTimeout(() => {
      let current = 0
      const interval = setInterval(() => {
        if (current < score) {
          current++
          setDisplayScore(current)
        } else {
          clearInterval(interval)
        }
      }, 100)
      return () => clearInterval(interval)
    }, 500)
    return () => clearTimeout(timer)
  }, [score])

  const getResultMessage = () => {
    if (percentage >= 90) return 'অসাধারণ পারফরম্যান্স!'
    if (percentage >= 80) return 'খুব ভালো ফলাফল!'
    if (percentage >= 60) return 'উত্তীর্ণ হয়েছেন!'
    return 'পুনরায় চেষ্টা করুন'
  }

  return (
    <div className="min-h-screen bg-sotota-bg flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl"
      >
        {/* Result Card */}
        <div className="bg-sotota-card border border-sotota-border rounded-lg p-8 md:p-12">
          {/* Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="flex justify-center mb-8"
          >
            <div
              className={`w-24 h-24 rounded-full flex items-center justify-center text-4xl ${
                isPassed ? 'bg-sotota-accent/20' : 'bg-red-500/20'
              }`}
            >
              {isPassed ? '🎉' : '📚'}
            </div>
          </motion.div>

          {/* Message */}
          <h1 className="text-4xl md:text-5xl font-bold text-center text-sotota-text mb-2">
            {getResultMessage()}
          </h1>
          <p className="text-center text-sotota-muted text-lg mb-8">
            জীববিজ্ঞান পরীক্ষা সম্পন্ন
          </p>

          {/* Score Display */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-8"
          >
            {/* Score */}
            <div className="bg-sotota-card2 rounded-lg p-6 text-center border border-sotota-border">
              <p className="text-sotota-muted text-sm mb-2">স্কোর</p>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="sotota-stat text-3xl font-bold text-sotota-accent"
              >
                {displayScore}/{total}
              </motion.div>
            </div>

            {/* Percentage */}
            <div className="bg-sotota-card2 rounded-lg p-6 text-center border border-sotota-border">
              <p className="text-sotota-muted text-sm mb-2">শতাংশ</p>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="sotota-stat text-3xl font-bold text-sotota-accentl"
              >
                {percentage}%
              </motion.div>
            </div>

            {/* Grade */}
            <div className="bg-sotota-card2 rounded-lg p-6 text-center border border-sotota-border md:col-span-1">
              <p className="text-sotota-muted text-sm mb-2">গ্রেড</p>
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1, duration: 0.4 }}
                className="sotota-stat text-3xl font-bold text-sotota-accent"
              >
                {grade}
              </motion.div>
            </div>
          </motion.div>

          {/* Progress Bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mb-8"
          >
            <div className="w-full h-3 bg-sotota-card2 rounded-full overflow-hidden border border-sotota-border">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                transition={{ duration: 1.5, delay: 0.8, ease: 'easeOut' }}
                className="h-full bg-gradient-to-r from-sotota-accent to-sotota-accentl"
              />
            </div>
          </motion.div>

          {/* Feedback */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className={`p-4 rounded-lg border mb-8 ${
              isPassed
                ? 'bg-sotota-accent/10 border-sotota-accent text-sotota-accent'
                : 'bg-red-500/10 border-red-500 text-red-600'
            }`}
          >
            <p className="font-semibold mb-2">
              {isPassed
                ? '✓ আপনি উত্তীর্ণ হয়েছেন!'
                : 'পুনরায় চেষ্টা করার পরামর্শ দেওয়া হচ্ছে'}
            </p>
            <p className="text-sm">
              {isPassed
                ? 'পরবর্তী পাঠে যান এবং আপনার শেখা চালিয়ে যান।'
                : 'বিষয়গুলি পর্যালোচনা করুন এবং আবার চেষ্টা করুন।'}
            </p>
          </motion.div>

          {/* Answer Review - Coming Soon */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4 }}
            className="bg-sotota-card2 rounded-lg p-6 border border-sotota-border mb-8"
          >
            <h3 className="font-bold text-sotota-text mb-3">আপনার কর্মক্ষমতা</h3>
            <div className="space-y-2 text-sm text-sotota-muted">
              <p>📊 সঠিক উত্তর: <span className="text-sotota-accent font-semibold">{score}</span></p>
              <p>❌ ভুল উত্তর: <span className="text-red-500 font-semibold">{total - score}</span></p>
              <p>⏱️ সময় নেওয়া: <span className="font-semibold">4 মিনিট 32 সেকেন্ড</span></p>
            </div>
          </motion.div>

          {/* Buttons */}
          <div className="flex gap-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push('/dashboard')}
              className="flex-1 px-6 py-3 rounded-lg border border-sotota-border text-sotota-text font-semibold hover:bg-sotota-card2 transition flex items-center justify-center gap-2"
            >
              <FiHome size={20} /> ড্যাশবোর্ডে যান
            </motion.button>
            {!isPassed && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push('/exam')}
                className="flex-1 px-6 py-3 rounded-lg bg-gradient-to-r from-sotota-accent to-sotota-accentd text-white font-semibold transition"
              >
                পুনরায় চেষ্টা করুন
              </motion.button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default function ExamResultsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-sotota-bg" />}>
      <ExamResultsContent />
    </Suspense>
  )
}
