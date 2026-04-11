'use client'

import { useState, useEffect, Suspense } from 'react'
import { motion } from 'framer-motion'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { DashboardLayout } from '@/components/DashboardLayout'
import ExamQuestion from '@/components/exam/ExamQuestion'
import ExamTimer from '@/components/exam/ExamTimer'
import NavigationDots from '@/components/exam/NavigationDots'
import SubmitModal from '@/components/exam/SubmitModal'
import { FiArrowLeft, FiAlertCircle } from 'react-icons/fi'

interface Question {
  id: string
  questionText: string
  optionA: string
  optionB: string
  optionC: string
  optionD: string
  correctAnswer: string
  explanation: string
  order: number
}

interface Exam {
  id: string
  title: string
  description: string
  duration: number
  totalQuestions: number
  negativeMarking: number
  passingScore: number
  course: {
    id: string
    title: string
  }
}

function ExamContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const examId = searchParams.get('id')

  const [exam, setExam] = useState<Exam | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<(string | null)[]>([])
  const [timeLeft, setTimeLeft] = useState(0)
  const [showSubmitModal, setShowSubmitModal] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isExamActive, setIsExamActive] = useState(true)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load exam data
  useEffect(() => {
    if (!examId) {
      setError('পরীক্ষা খুঁজে পাওয়া যায়নি')
      setLoading(false)
      return
    }

    const fetchExam = async () => {
      try {
        const response = await fetch(`/api/exams/${examId}`)
        if (!response.ok) throw new Error('Failed to load exam')

        const data = await response.json()
        setExam(data.exam)
        setQuestions(data.questions)
        setTimeLeft(data.exam.duration * 60)
        setAnswers(new Array(data.questions.length).fill(null))
      } catch (err) {
        setError('পরীক্ষা লোড করতে ব্যর্থ হয়েছে')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchExam()
  }, [examId])

  const handleSelectOption = (option: string) => {
    const newAnswers = [...answers]
    newAnswers[currentQuestion] = option
    setAnswers(newAnswers)
  }

  const handleNavigateQuestion = (questionIndex: number) => {
    setCurrentQuestion(questionIndex)
  }

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
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
    if (!exam) return

    setIsSubmitting(true)

    // Calculate score
    let correctAnswers = 0
    let wrongAnswers = 0
    let unattempted = 0

    questions.forEach((question, index) => {
      const userAnswer = answers[index]
      const correctAnswer = question.correctAnswer

      if (userAnswer === null) {
        unattempted++
      } else if (userAnswer === correctAnswer) {
        correctAnswers++
      } else {
        wrongAnswers++
      }
    })

    const score = correctAnswers - wrongAnswers * exam.negativeMarking
    const percentage = Math.round((correctAnswers / questions.length) * 100)

    try {
      // Save exam result
      const resultResponse = await fetch('/api/exams/results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 'user-id-placeholder', // This should come from session
          examId: exam.id,
          answers,
          totalQuestions: questions.length,
          correctAnswers,
          wrongAnswers,
          unattempted,
          score,
          percentage,
          timeTaken: exam.duration * 60 - timeLeft,
        }),
      })

      if (!resultResponse.ok) throw new Error('Failed to save result')

      // Redirect to results page
      router.push(`/exam-results?examId=${exam.id}&score=${correctAnswers}&total=${questions.length}&percentage=${percentage}`)
    } catch (err) {
      console.error('Error submitting exam:', err)
      setError('পরীক্ষা জমা দিতে ব্যর্থ হয়েছে')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleTimeUp = () => {
    setIsExamActive(false)
    setShowSubmitModal(true)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-sotota-bg flex items-center justify-center">
        <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity }}>
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-sotota-accent border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-sotota-text text-lg">পরীক্ষা লোড হচ্ছে...</p>
          </div>
        </motion.div>
      </div>
    )
  }

  if (error || !exam || questions.length === 0) {
    return (
      <div className="min-h-screen bg-sotota-bg flex items-center justify-center">
        <div className="max-w-md">
          <div className="bg-sotota-card border border-sotota-border rounded-lg p-8 text-center">
            <FiAlertCircle className="w-16 h-16 mx-auto mb-4 text-sotota-error" />
            <h1 className="text-2xl font-bold text-sotota-text mb-2">{error || 'পরীক্ষা খুঁজে পাওয়া যায়নি'}</h1>
            <p className="text-sotota-muted mb-6">দয়া করে একটি বৈধ পরীক্ষা নির্বাচন করুন</p>
            <Link
              href="/courses"
              className="inline-block px-6 py-3 rounded-lg bg-gradient-to-r from-sotota-accent to-sotota-accentd text-white font-semibold hover:shadow-lg transition"
            >
              কোর্সে ফিরুন
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const answeredQuestions = answers.filter((a) => a !== null).length
  const unansweredQuestions = answers
    .map((a, i) => (a === null ? i + 1 : null))
    .filter((q) => q !== null) as number[]

  const question = questions[currentQuestion]

  // Convert database options to array format for ExamQuestion component
  const questionOptions = [question.optionA, question.optionB, question.optionC, question.optionD]
  const optionLetters = ['A', 'B', 'C', 'D']
  const selectedOptionIndex = answers[currentQuestion]
    ? optionLetters.indexOf(answers[currentQuestion] as string)
    : null

  return (
    <div className="min-h-screen bg-sotota-bg">
      {/* Back Button */}
      <div className="sticky top-0 z-50 bg-sotota-surface border-b border-sotota-border">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            href="/courses"
            className="flex items-center gap-2 text-sotota-accent hover:text-sotota-accentl transition"
          >
            <FiArrowLeft className="w-5 h-5" />
            <span>ফিরুন</span>
          </Link>

          {/* Exam Title */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex-1 text-center">
            <h1 className="text-2xl font-bold text-sotota-text">{exam.title}</h1>
            <p className="text-sm text-sotota-muted">{exam.course.title}</p>
          </motion.div>

          {/* Timer */}
          <ExamTimer totalSeconds={exam.duration * 60} onTimeUp={handleTimeUp} isActive={isExamActive} />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left - Question */}
          <motion.div className="lg:col-span-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="bg-sotota-card border border-sotota-border rounded-lg p-8">
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-sotota-text">প্রশ্ন {currentQuestion + 1}/{questions.length}</h2>
                  <span className="text-sm text-sotota-muted">
                    {exam.negativeMarking > 0 && `নেতিবাচক চিহ্ন: ${exam.negativeMarking}`}
                  </span>
                </div>

                <p className="text-xl font-semibold text-sotota-text mb-6">{question.questionText}</p>

                {/* Options */}
                <div className="space-y-3">
                  {questionOptions.map((option, index) => {
                    const isSelected = selectedOptionIndex === index
                    const letter = optionLetters[index]

                    return (
                      <motion.button
                        key={index}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleSelectOption(letter)}
                        className={`w-full p-4 rounded-lg border-2 text-left font-semibold transition ${
                          isSelected
                            ? 'border-sotota-accent bg-sotota-accent/10 text-sotota-accent'
                            : 'border-sotota-border text-sotota-text hover:border-sotota-accent/50'
                        }`}
                      >
                        <span className="inline-block w-8 h-8 rounded-full border-2 border-current flex items-center justify-center mr-4">
                          {letter}
                        </span>
                        {option}
                      </motion.button>
                    )
                  })}
                </div>

                {/* Explanation */}
                {selectedOptionIndex !== null && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 p-4 rounded-lg bg-sotota-card2 border border-sotota-border"
                  >
                    <p className="text-sm text-sotota-muted mb-2">ব্যাখ্যা:</p>
                    <p className="text-sotota-text">{question.explanation}</p>
                  </motion.div>
                )}
              </div>

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
                  disabled={currentQuestion === questions.length - 1}
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
                  <span className="sotota-stat font-bold text-sotota-accent">{answeredQuestions}/{questions.length}</span>
                </div>
                <div className="w-full h-2 bg-sotota-card2 rounded-full overflow-hidden">
                  <motion.div
                    animate={{ width: `${(answeredQuestions / questions.length) * 100}%` }}
                    transition={{ duration: 0.3 }}
                    className="h-full bg-gradient-to-r from-sotota-accent to-sotota-accentl"
                  />
                </div>
              </div>
            </div>

            {/* Navigation Dots */}
            <div className="bg-sotota-card border border-sotota-border rounded-lg p-6">
              <h3 className="font-bold text-sotota-text mb-4">প্রশ্নগুলি</h3>
              <div className="grid grid-cols-5 gap-2">
                {answers.map((answer, index) => {
                  let bgColor = 'bg-sotota-card2'
                  if (answer !== null) bgColor = 'bg-sotota-accent'
                  if (index === currentQuestion) bgColor = 'bg-sotota-accentl ring-2 ring-sotota-accent'

                  return (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleNavigateQuestion(index)}
                      className={`aspect-square rounded-lg ${bgColor} text-sotota-text font-bold transition`}
                    >
                      {index + 1}
                    </motion.button>
                  )
                })}
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-sotota-card2 border border-sotota-border rounded-lg p-6">
              <h3 className="font-bold text-sotota-text mb-3">নির্দেশনা</h3>
              <ul className="space-y-2 text-sm text-sotota-muted">
                <li>✓ প্রতিটি প্রশ্নের একটি সঠিক উত্তর আছে</li>
                <li>✓ আপনি যেকোনো সময় উত্তর পরিবর্তন করতে পারেন</li>
                <li>✓ সময় শেষ হলে পরীক্ষা স্বয়ংক্রিয় জমা হবে</li>
                {exam.negativeMarking > 0 && <li>⚠ ভুল উত্তরে {exam.negativeMarking} চিহ্ন কাটা যাবে</li>}
              </ul>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Submit Modal */}
      <SubmitModal
        isOpen={showSubmitModal}
        totalQuestions={questions.length}
        answeredQuestions={answeredQuestions}
        unansweredQuestions={unansweredQuestions}
        onSubmit={handleSubmitExam}
        onClose={() => setShowSubmitModal(false)}
        isSubmitting={isSubmitting}
      />
    </div>
  )
}
export default function ExamPage() {
  return (
    <DashboardLayout>
      <Suspense
        fallback={
          <div className="min-h-screen bg-sotota-bg flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-sotota-accent border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-sotota-text">পরীক্ষা লোড হচ্ছে...</p>
            </div>
          </div>
        }
      >
        <ExamContent />
      </Suspense>
    </DashboardLayout>
  )
}