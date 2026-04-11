'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { FiHome, FiDownload, FiShare2 } from 'react-icons/fi'

interface Question {
  id: string
  questionText: string
  optionA: string
  optionB: string
  optionC: string
  optionD: string
  correctAnswer: string
  explanation: string
}

function ExamResultsContent() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const examId = searchParams.get('examId')
  const score = parseInt(searchParams.get('score') || '0')
  const total = parseInt(searchParams.get('total') || '0')
  const percentage = parseInt(searchParams.get('percentage') || '0')

  const [exam, setExam] = useState<any>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [displayScore, setDisplayScore] = useState(0)
  const [loading, setLoading] = useState(true)
  const [expandedReviews, setExpandedReviews] = useState<Record<number, boolean>>({})

  const isPassed = percentage >= 60
  const gradeLetters = ['F', 'D', 'C', 'B', 'A']
  const grade = gradeLetters[Math.floor(percentage / 20)]

  useEffect(() => {
    if (!examId) return

    const fetchExam = async () => {
      try {
        const response = await fetch(`/api/exams/${examId}`)
        if (!response.ok) throw new Error('Failed to load exam')

        const data = await response.json()
        setExam(data.exam)
        setQuestions(data.questions)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchExam()
  }, [examId])

  // Animate score counter
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
      }, 50)
      return () => clearInterval(interval)
    }, 300)
    return () => clearTimeout(timer)
  }, [score])

  const getResultMessage = () => {
    if (percentage >= 90) return 'অসাধারণ পারফরম্যান্স!'
    if (percentage >= 80) return 'খুব ভালো ফলাফল!'
    if (percentage >= 60) return 'উত্তীর্ণ হয়েছেন!'
    return 'পুনরায় চেষ্টা করুন'
  }

  const toggleReview = (index: number) => {
    setExpandedReviews((prev) => ({
      ...prev,
      [index]: !prev[index],
    }))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-sotota-bg flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-sotota-accent border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sotota-text">ফলাফল লোড হচ্ছে...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-sotota-bg py-8 px-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto">
        {/* Result Header Card */}
        <div className="bg-gradient-to-b from-sotota-card to-sotota-card2 border border-sotota-border rounded-lg p-8 md:p-12 mb-8">
          {/* Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="flex justify-center mb-8"
          >
            <div
              className={`w-24 h-24 rounded-full flex items-center justify-center text-5xl ${
                isPassed ? 'bg-sotota-accent/20' : 'bg-sotota-error/20'
              }`}
            >
              {isPassed ? '🎉' : '📚'}
            </div>
          </motion.div>

          {/* Message */}
          <h1 className="text-3xl md:text-4xl font-bold text-center text-sotota-text mb-2">{getResultMessage()}</h1>
          <p className="text-center text-sotota-muted mb-8">{exam?.title}</p>

          {/* Score Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {/* Score */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-sotota-surface rounded-lg p-4 border border-sotota-border text-center"
            >
              <p className="text-sotota-muted text-xs font-semibold mb-2">স্কোর</p>
              <p className="text-3xl font-bold text-sotota-accent">
                {displayScore}/{total}
              </p>
            </motion.div>

            {/* Percentage */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-sotota-surface rounded-lg p-4 border border-sotota-border text-center"
            >
              <p className="text-sotota-muted text-xs font-semibold mb-2">শতাংশ</p>
              <p className="text-3xl font-bold text-sotota-text">{percentage}%</p>
            </motion.div>

            {/* Grade */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-sotota-surface rounded-lg p-4 border border-sotota-border text-center"
            >
              <p className="text-sotota-muted text-xs font-semibold mb-2">গ্রেড</p>
              <p className="text-3xl font-bold text-sotota-accent">{grade}</p>
            </motion.div>

            {/* Status */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className={`rounded-lg p-4 border text-center ${
                isPassed ? 'bg-sotota-accent/10 border-sotota-accent' : 'bg-sotota-error/10 border-sotota-error'
              }`}
            >
              <p className="text-sotota-muted text-xs font-semibold mb-2">অবস্থা</p>
              <p className={`text-lg font-bold ${isPassed ? 'text-sotota-accent' : 'text-sotota-error'}`}>
                {isPassed ? 'উত্তীর্ণ' : 'অনুত্তীর্ণ'}
              </p>
            </motion.div>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-sotota-muted">শতাংশ</span>
              <span className="text-sm font-semibold text-sotota-text">{percentage}%</span>
            </div>
            <div className="w-full h-3 bg-sotota-surface rounded-full overflow-hidden border border-sotota-border">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                transition={{ duration: 1.5, ease: 'easeOut' }}
                className={`h-full ${
                  isPassed ? 'bg-gradient-to-r from-sotota-accent to-sotota-accentl' : 'bg-sotota-error'
                }`}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 rounded-lg border border-sotota-border text-sotota-text font-semibold hover:bg-sotota-card2 transition flex items-center justify-center gap-2"
            >
              <FiDownload className="w-4 h-4" />
              ডাউনলোড
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 rounded-lg border border-sotota-border text-sotota-text font-semibold hover:bg-sotota-card2 transition flex items-center justify-center gap-2"
            >
              <FiShare2 className="w-4 h-4" />
              শেয়ার করুন
            </motion.button>
          </div>
        </div>

        {/* Answer Review Section */}
        {questions.length > 0 && (
          <div className="bg-sotota-card border border-sotota-border rounded-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-sotota-text mb-6">প্রশ্ন পর্যালোচনা</h2>
            <div className="space-y-4">
              {questions.map((question, index) => (
                <motion.div
                  key={question.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="border border-sotota-border rounded-lg overflow-hidden"
                >
                  <button
                    onClick={() => toggleReview(index)}
                    className="w-full px-6 py-4 bg-sotota-card2 hover:bg-sotota-surface transition flex items-center justify-between"
                  >
                    <div className="text-left flex-1">
                      <p className="text-sm text-sotota-muted mb-1">প্রশ্ন {index + 1}</p>
                      <p className="text-sotota-text font-semibold">{question.questionText}</p>
                    </div>
                    <div className="ml-4 flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                          index < displayScore
                            ? 'bg-sotota-accent text-white'
                            : 'bg-sotota-card border border-sotota-border text-sotota-text'
                        }`}
                      >
                        {index < displayScore ? '✓' : '✗'}
                      </div>
                      <motion.div
                        animate={{ rotate: expandedReviews[index] ? 180 : 0 }}
                        className="text-sotota-muted"
                      >
                        ▼
                      </motion.div>
                    </div>
                  </button>

                  {/* Expanded Content */}
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{
                      height: expandedReviews[index] ? 'auto' : 0,
                      opacity: expandedReviews[index] ? 1 : 0,
                    }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 py-4 bg-sotota-surface border-t border-sotota-border">
                      <div className="space-y-3 mb-4">
                        <div>
                          <p className="text-sm text-sotota-muted mb-1">সঠিক উত্তর</p>
                          <p className="text-sotota-accent font-semibold">{question.correctAnswer}</p>
                        </div>
                      </div>
                      <div className="p-4 rounded-lg bg-sotota-card2 border border-sotota-border">
                        <p className="text-sm text-sotota-muted mb-2">ব্যাখ্যা:</p>
                        <p className="text-sotota-text">{question.explanation}</p>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Navigation Footer */}
        <div className="flex gap-4 justify-center">
          <Link
            href="/exams"
            className="px-8 py-3 rounded-lg bg-sotota-card border border-sotota-border text-sotota-text font-semibold hover:bg-sotota-card2 transition flex items-center gap-2"
          >
            <FiHome className="w-4 h-4" />
            আরও পরীক্ষা নিন
          </Link>
          <Link
            href="/dashboard"
            className="px-8 py-3 rounded-lg bg-gradient-to-r from-sotota-accent to-sotota-accentd text-white font-semibold hover:shadow-lg transition"
          >
            ড্যাশবোর্ডে যান
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
export default function ExamResultsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-sotota-bg flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-sotota-accent border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-sotota-text">ফলাফল লোড হচ্ছে...</p>
          </div>
        </div>
      }
    >
      <ExamResultsContent />
    </Suspense>
  )
}