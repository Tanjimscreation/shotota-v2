'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import ExamQuestion from '@/components/exam/ExamQuestion'
import ExamTimer from '@/components/exam/ExamTimer'
import NavigationDots from '@/components/exam/NavigationDots'
import SubmitModal from '@/components/exam/SubmitModal'

interface Question {
  id: string
  text: string
  options: string[]
  correctAnswer: number
}

const mockExam: Question[] = [
  {
    id: '1',
    text: 'মানুষের শরীরে কয়টি হাড় আছে?',
    options: ['১৮০', '২০৬', '২৫০', '৩০০'],
    correctAnswer: 1
  },
  {
    id: '2',
    text: 'হিমোগ্লোবিনের প্রধান কাজ কী?',
    options: ['পুষ্টি সরবরাহ', 'অক্সিজেন পরিবহন', 'রোগ প্রতিরোধ', 'তাপমাত্রা নিয়ন্ত্রণ'],
    correctAnswer: 1
  },
  {
    id: '3',
    text: 'ডিএনএ-এর সম্পূর্ণ রূপ কী?',
    options: [
      'Deoxyribose Nucleic Acid',
      'Deoxyribonucleic Acid',
      'Dioxid Nucleic Acid',
      'Deoxid Nucleotic Acid'
    ],
    correctAnswer: 1
  },
  {
    id: '4',
    text: 'মাইটোকন্ড্রিয়াকে কী বলা হয়?',
    options: ['ঘুম কেন্দ্র', 'শক্তির কেন্দ্র', 'চিন্তার কেন্দ্র', 'স্মৃতির কেন্দ্র'],
    correctAnswer: 1
  },
  {
    id: '5',
    text: 'সবুজ উদ্ভিদ কী প্রক্রিয়ায় খাদ্য তৈরি করে?',
    options: ['শ্বসন', 'প্রস্বেদন', 'সালোকসংশ্লেষণ', 'রূপান্তর'],
    correctAnswer: 2
  }
]

export default function ExamPage() {
  const router = useRouter()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<(number | null)[]>(new Array(mockExam.length).fill(null))
  const [timeLeft, setTimeLeft] = useState(10 * 60) // 10 minutes
  const [showSubmitModal, setShowSubmitModal] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isExamActive, setIsExamActive] = useState(true)

  const handleSelectOption = (optionIndex: number) => {
    const newAnswers = [...answers]
    newAnswers[currentQuestion] = optionIndex
    setAnswers(newAnswers)
  }

  const handleNavigateQuestion = (questionIndex: number) => {
    setCurrentQuestion(questionIndex)
  }

  const handleNext = () => {
    if (currentQuestion < mockExam.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const handleOpenSubmit = () => {
    setShowSubmitModal(true)
  }

  const handleSubmitExam = async () => {
    setIsSubmitting(true)
    // Simulate submission delay
    setTimeout(() => {
      // Calculate score
      let score = 0
      answers.forEach((answer, index) => {
        if (answer === mockExam[index].correctAnswer) {
          score++
        }
      })

      // Redirect to results page
      router.push(`/exam-results?score=${score}&total=${mockExam.length}`)
    }, 1500)
  }

  const handleTimeUp = () => {
    setIsExamActive(false)
    setShowSubmitModal(true)
  }

  const answeredQuestions = answers.filter((a) => a !== null).length
  const unansweredQuestions = answers
    .map((a, i) => (a === null ? i + 1 : null))
    .filter((q) => q !== null) as number[]

  const question = mockExam[currentQuestion]

  return (
    <div className="min-h-screen bg-sotota-bg">
      {/* Top Bar */}
      <div className="sticky top-0 z-40 bg-sotota-surface border-b border-sotota-border">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Exam Title */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h1 className="text-2xl font-bold text-sotota-text">জীববিজ্ঞান পরীক্ষা</h1>
            <p className="text-sm text-sotota-muted">মোট প্রশ্ন: {mockExam.length}</p>
          </motion.div>

          {/* Timer */}
          <ExamTimer totalSeconds={10 * 60} onTimeUp={handleTimeUp} isActive={isExamActive} />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left - Question */}
          <motion.div className="lg:col-span-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="bg-sotota-card border border-sotota-border rounded-lg p-8">
              <ExamQuestion
                key={currentQuestion}
                questionNumber={currentQuestion + 1}
                totalQuestions={mockExam.length}
                question={question.text}
                options={question.options}
                selectedOption={answers[currentQuestion]}
                onSelectOption={handleSelectOption}
              />

              {/* Navigation Buttons */}
              <div className="mt-8 flex gap-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handlePrevious}
                  disabled={currentQuestion === 0}
                  className="px-6 py-3 rounded-lg border border-sotota-border text-sotota-text font-semibold hover:bg-sotota-card2 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ← পূর্ববর্তী
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleNext}
                  disabled={currentQuestion === mockExam.length - 1}
                  className="px-6 py-3 rounded-lg border border-sotota-border text-sotota-text font-semibold hover:bg-sotota-card2 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  পরবর্তী →
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleOpenSubmit}
                  className="ml-auto px-8 py-3 rounded-lg bg-gradient-to-r from-sotota-accent to-sotota-accentd text-white font-semibold transition"
                >
                  পরীক্ষা জমা দিন
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Right Sidebar - Navigation & Info */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            {/* Progress Card */}
            <div className="bg-sotota-card border border-sotota-border rounded-lg p-6">
              <h3 className="font-bold text-sotota-text mb-4">অগ্রগতি</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-sotota-muted">উত্তর দেওয়া হয়েছে</span>
                  <span className="sotota-stat font-bold text-sotota-accent">{answeredQuestions}/{mockExam.length}</span>
                </div>
                <div className="w-full h-2 bg-sotota-card2 rounded-full overflow-hidden">
                  <motion.div
                    animate={{ width: `${(answeredQuestions / mockExam.length) * 100}%` }}
                    transition={{ duration: 0.3 }}
                    className="h-full bg-gradient-to-r from-sotota-accent to-sotota-accentl"
                  />
                </div>
              </div>
            </div>

            {/* Navigation Dots */}
            <div className="bg-sotota-card border border-sotota-border rounded-lg p-6">
              <h3 className="font-bold text-sotota-text mb-4">প্রশ্নগুলি</h3>
              <NavigationDots
                total={mockExam.length}
                current={currentQuestion}
                answered={answers
                  .map((a, i) => (a !== null ? i : null))
                  .filter((i) => i !== null) as number[]}
                onDotClick={handleNavigateQuestion}
              />
            </div>

            {/* Instructions */}
            <div className="bg-sotota-card2 border border-sotota-border rounded-lg p-6">
              <h3 className="font-bold text-sotota-text mb-3">নির্দেশনা</h3>
              <ul className="space-y-2 text-sm text-sotota-muted">
                <li>✓ প্রতিটি প্রশ্নের একটি সঠিক উত্তর আছে</li>
                <li>✓ আপনি যেকোনো সময় উত্তর পরিবর্তন করতে পারেন</li>
                <li>✓ সময় শেষ হলে পরীক্ষা স্বয়ংক্রিয়ভাবে জমা হবে</li>
              </ul>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Submit Modal */}
      <SubmitModal
        isOpen={showSubmitModal}
        totalQuestions={mockExam.length}
        answeredQuestions={answeredQuestions}
        unansweredQuestions={unansweredQuestions}
        onSubmit={handleSubmitExam}
        onClose={() => setShowSubmitModal(false)}
        isSubmitting={isSubmitting}
      />
    </div>
  )
}
