'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { FiHome, FiChevronDown } from 'react-icons/fi'
import AnswerReview from '@/components/exam/AnswerReview'
import PerformanceMetrics from '@/components/exam/PerformanceMetrics'

// Mock questions with explanations
const mockQuestionsWithExplanations = [
  {
    questionNumber: 1,
    question: 'মানুষের শরীরে কয়টি হাড় আছে?',
    options: ['১৮০', '২০৬', '২৫০', '৩০০'],
    correctAnswerIndex: 1,
    explanation:
      'একজন প্রাপ্তবয়স্ক মানুষের শরীরে ২০৬টি হাড় থাকে। জন্মের সময় শিশুদের প্রায় ২৭০টি হাড় থাকে, কিন্তু বৃদ্ধির সাথে সাথে কিছু হাড় একত্রিত হয়ে ২০৬টিতে পরিণত হয়।'
  },
  {
    questionNumber: 2,
    question: 'হিমোগ্লোবিনের প্রধান কাজ কী?',
    options: ['পুষ্টি সরবরাহ', 'অক্সিজেন পরিবহন', 'রোগ প্রতিরোধ', 'তাপমাত্রা নিয়ন্ত্রণ'],
    correctAnswerIndex: 1,
    explanation:
      'হিমোগ্লোবিন লোহিত রক্তকণিকায় থাকে এবং ফুসফুস থেকে অক্সিজেন সংগ্রহ করে শরীরের সমস্ত কোষে পরিবহন করে। এটি একটি প্রোটিন যা আয়রন ধারণ করে যা অক্সিজেন বহনে সাহায্য করে।'
  },
  {
    questionNumber: 3,
    question: 'ডিএনএ-এর সম্পূর্ণ রূপ কী?',
    options: [
      'Deoxyribose Nucleic Acid',
      'Deoxyribonucleic Acid',
      'Dioxid Nucleic Acid',
      'Deoxid Nucleotic Acid'
    ],
    correctAnswerIndex: 1,
    explanation:
      'DNA-এর সম্পূর্ণ রূপ Deoxyribonucleic Acid। এটি একটি জটিল জৈব অণু যা জীবন্ত প্রাণীদের মধ্যে জেনেটিক তথ্য বহন করে এবং সংরক্ষণ করে।'
  },
  {
    questionNumber: 4,
    question: 'মাইটোকন্ড্রিয়াকে কী বলা হয়?',
    options: ['ঘুম কেন্দ্র', 'শক্তির কেন্দ্র', 'চিন্তার কেন্দ্র', 'স্মৃতির কেন্দ্র'],
    correctAnswerIndex: 1,
    explanation:
      'মাইটোকন্ড্রিয়াকে কোষের "শক্তির কেন্দ্র" বা "পাওয়ার হাউস" বলা হয়। এটি ATP তৈরি করে যা কোষের সমস্ত কাজের জন্য শক্তি সরবরাহ করে।'
  },
  {
    questionNumber: 5,
    question: 'সবুজ উদ্ভিদ কী প্রক্রিয়ায় খাদ্য তৈরি করে?',
    options: ['শ্বসন', 'প্রস্বেদন', 'সালোকসংশ্লেষণ', 'রূপান্তর'],
    correctAnswerIndex: 2,
    explanation:
      'সালোকসংশ্লেষণ এমন একটি প্রক্রিয়া যেখানে সবুজ উদ্ভিদ সূর্যালোক, জল এবং কার্বন ডাইঅক্সাইড ব্যবহার করে গ্লুকোজ এবং অক্সিজেন তৈরি করে। এটি জীবনের জন্য অত্যন্ত গুরুত্বপূর্ণ কারণ এটি অক্সিজেন উৎপাদন করে।'
  }
]

function ExamResultsContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const score = parseInt(searchParams.get('score') || '0')
  const total = parseInt(searchParams.get('total') || '5')
  const [displayScore, setDisplayScore] = useState(0)
  const [expandedReview, setExpandedReview] = useState(false)

  const percentage = Math.round((score / total) * 100)
  const isPassed = percentage >= 60
  const gradeLetters = ['F', 'D', 'C', 'B', 'A']
  const grade = gradeLetters[Math.floor(percentage / 20)]

  // Mock student answers
  const studentAnswers = [0, null, 1, 1, 2] // Some correct, some wrong/empty

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

  // Prepare answer review data
  const answerReviewData = mockQuestionsWithExplanations.map((q, index) => ({
    questionNumber: q.questionNumber,
    question: q.question,
    yourAnswerIndex: studentAnswers[index],
    correctAnswerIndex: q.correctAnswerIndex,
    explanation: q.explanation,
    isCorrect: studentAnswers[index] === q.correctAnswerIndex,
    questionOptions: q.options
  }))

  return (
    <div className="min-h-screen bg-sotota-bg p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        {/* Result Header Card */}
        <div className="bg-sotota-card border border-sotota-border rounded-lg p-8 md:p-12 mb-8">
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

        {/* Tabs Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6 }}
          className="mt-8"
        >
          {/* Tab Navigation */}
          <div className="flex gap-2 mb-6 border-b border-sotota-border">
            {[
              { id: 'performance', label: 'কর্মক্ষমতা' },
              { id: 'answers', label: 'উত্তর পর্যালোচনা' }
            ].map((tab) => (
              <motion.button
                key={tab.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setExpandedReview(tab.id === 'answers')}
                className={`px-6 py-3 font-semibold transition border-b-2 ${
                  (expandedReview && tab.id === 'answers') || (!expandedReview && tab.id === 'performance')
                    ? 'text-sotota-accent border-sotota-accent'
                    : 'text-sotota-muted border-transparent hover:text-sotota-text'
                }`}
              >
                {tab.label}
              </motion.button>
            ))}
          </div>

          {/* Tab Content */}
          {!expandedReview ? (
            // Performance Metrics Tab
            <div className="bg-sotota-card border border-sotota-border rounded-lg p-8">
              <PerformanceMetrics
                score={score}
                total={total}
                timeSpent="4 মিনিট 32 সেকেন্ড"
                avgTimePerQuestion="54 সেকেন্ড"
                difficulty="মাঝারি"
                category="জীববিজ্ঞান"
                previousScore={3}
                improvement={score - 3}
              />
            </div>
          ) : (
            // Answer Review Tab
            <div className="bg-sotota-card border border-sotota-border rounded-lg p-8">
              <AnswerReview answers={answerReviewData} />
            </div>
          )}
        </motion.div>
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
