'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { motion } from 'framer-motion'
import { FiArrowLeft, FiCheck, FiX, FiPlus } from 'react-icons/fi'
import Link from 'next/link'
import { DashboardLayout } from '@/components/DashboardLayout'

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

interface Exam {
  id: string
  title: string
  description: string
  courseId: string
  duration: number
  passingScore: number
  negativeMarkPercentage: number
  questions: Question[]
}

export default function AdminDashboard() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [exams, setExams] = useState<Exam[]>([])
  const [loading, setLoading] = useState(true)
  const [showUploadForm, setShowUploadForm] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    courseId: '',
    duration: 120,
    passingScore: 60,
    negativeMarkPercentage: 25,
    questions: [
      {
        questionText: '',
        optionA: '',
        optionB: '',
        optionC: '',
        optionD: '',
        correctAnswer: 'A',
        explanation: ''
      }
    ]
  })
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
      return
    }

    if (status === 'authenticated' && session?.user?.role !== 'ADMIN') {
      router.push('/dashboard')
      return
    }

    if (status === 'authenticated') {
      fetchExams()
    }
  }, [status, session, router])

  const fetchExams = async () => {
    try {
      const response = await fetch('/api/exams')
      if (response.ok) {
        const data = await response.json()
        setExams(data || [])
      }
    } catch (error) {
      console.error('Failed to fetch exams:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddQuestion = () => {
    setFormData({
      ...formData,
      questions: [
        ...formData.questions,
        {
          questionText: '',
          optionA: '',
          optionB: '',
          optionC: '',
          optionD: '',
          correctAnswer: 'A',
          explanation: ''
        }
      ]
    })
  }

  const handleRemoveQuestion = (index: number) => {
    setFormData({
      ...formData,
      questions: formData.questions.filter((_, i) => i !== index)
    })
  }

  const handleQuestionChange = (index: number, field: string, value: string) => {
    const newQuestions = [...formData.questions]
    ;(newQuestions[index] as any)[field] = value
    setFormData({
      ...formData,
      questions: newQuestions
    })
  }

  const handleSubmitExam = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setMessage('')

    try {
      // Validate form
      if (!formData.title.trim()) {
        setMessage('পরীক্ষার শিরোনাম প্রয়োজন')
        setSubmitting(false)
        return
      }

      if (formData.questions.length === 0) {
        setMessage('কমপক্ষে একটি প্রশ্ন যোগ করুন')
        setSubmitting(false)
        return
      }

      // Validate questions
      for (let i = 0; i < formData.questions.length; i++) {
        const q = formData.questions[i]
        if (!q.questionText.trim()) {
          setMessage(`প্রশ্ন ${i + 1}: প্রশ্ন টেক্সট প্রয়োজন`)
          setSubmitting(false)
          return
        }
        if (!q.optionA.trim() || !q.optionB.trim() || !q.optionC.trim() || !q.optionD.trim()) {
          setMessage(`প্রশ্ন ${i + 1}: সমস্ত বিকল্প পূরণ করুন`)
          setSubmitting(false)
          return
        }
      }

      const response = await fetch('/api/admin/exams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'পরীক্ষা তৈরি করতে ব্যর্থ')
      }

      setMessage('✅ পরীক্ষা সফলভাবে তৈরি হয়েছে')
      setShowUploadForm(false)
      setFormData({
        title: '',
        description: '',
        courseId: '',
        duration: 120,
        passingScore: 60,
        negativeMarkPercentage: 25,
        questions: [
          {
            questionText: '',
            optionA: '',
            optionB: '',
            optionC: '',
            optionD: '',
            correctAnswer: 'A',
            explanation: ''
          }
        ]
      })
      fetchExams()
    } catch (error) {
      setMessage(`❌ ${error instanceof Error ? error.message : 'একটি ত্রুটি ঘটেছে'}`)
    } finally {
      setSubmitting(false)
    }
  }

  if (status === 'loading') {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-sotota-bg flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-sotota-accent border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-sotota-text">লোড হচ্ছে...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (!session || session.user?.role !== 'ADMIN') {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-sotota-bg flex items-center justify-center p-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-sotota-text mb-4">প্রবেশাধিকার নেই</h1>
            <p className="text-sotota-muted mb-6">শুধুমাত্র অ্যাডমিনরা এই পৃষ্ঠা অ্যাক্সেস করতে পারেন</p>
            <Link
              href="/dashboard"
              className="inline-block px-6 py-2 bg-sotota-accent text-white rounded-lg hover:bg-sotota-accentd transition"
            >
              ড্যাশবোর্ডে ফিরুন
            </Link>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-sotota-bg p-4 md:p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 text-sotota-accent hover:text-sotota-accentl transition mb-4"
            >
              <FiArrowLeft /> ড্যাশবোর্ডে ফিরুন
            </Link>
            <h1 className="text-4xl font-bold text-sotota-text mb-2">অ্যাডমিন প্যানেল</h1>
            <p className="text-sotota-muted">পরীক্ষা এবং প্রশ্ন পরিচালনা করুন</p>
          </motion.div>

          {/* Add Exam Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowUploadForm(!showUploadForm)}
            className="mb-8 flex items-center gap-2 px-6 py-3 bg-sotota-accent text-white rounded-lg hover:bg-sotota-accentd transition font-semibold"
          >
            <FiPlus /> নতুন পরীক্ষা যোগ করুন
          </motion.button>

          {/* Upload Form */}
          {showUploadForm && (
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              onSubmit={handleSubmitExam}
              className="bg-sotota-card border border-sotota-border rounded-xl p-8 mb-8"
            >
              <h2 className="text-2xl font-bold text-sotota-text mb-6">পরীক্ষার বিবরণ</h2>

              {/* Basic Info */}
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div>
                  <label className="block text-sm font-medium text-sotota-text mb-2">পরীক্ষার শিরোনাম *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. বায়োলজি মিড টার্ম পরীক্ষা"
                    className="w-full bg-sotota-card2 border border-sotota-border rounded-lg px-4 py-2 text-sotota-text placeholder:text-sotota-dim focus:outline-none focus:ring-2 focus:ring-sotota-accent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-sotota-text mb-2">কোর্স আইডি</label>
                  <input
                    type="text"
                    value={formData.courseId}
                    onChange={(e) => setFormData({ ...formData, courseId: e.target.value })}
                    placeholder="course-001"
                    className="w-full bg-sotota-card2 border border-sotota-border rounded-lg px-4 py-2 text-sotota-text placeholder:text-sotota-dim focus:outline-none focus:ring-2 focus:ring-sotota-accent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-sotota-text mb-2">সময়কাল (মিনিট)</label>
                  <input
                    type="number"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                    className="w-full bg-sotota-card2 border border-sotota-border rounded-lg px-4 py-2 text-sotota-text focus:outline-none focus:ring-2 focus:ring-sotota-accent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-sotota-text mb-2">উত্তীর্ণ স্কোর (%)</label>
                  <input
                    type="number"
                    value={formData.passingScore}
                    onChange={(e) => setFormData({ ...formData, passingScore: parseInt(e.target.value) })}
                    className="w-full bg-sotota-card2 border border-sotota-border rounded-lg px-4 py-2 text-sotota-text focus:outline-none focus:ring-2 focus:ring-sotota-accent"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-sotota-text mb-2">বর্ণনা</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="পরীক্ষার বর্ণনা এবং নির্দেশনা..."
                    rows={3}
                    className="w-full bg-sotota-card2 border border-sotota-border rounded-lg px-4 py-2 text-sotota-text placeholder:text-sotota-dim focus:outline-none focus:ring-2 focus:ring-sotota-accent resize-none"
                  />
                </div>
              </div>

              {/* Questions */}
              <h3 className="text-xl font-bold text-sotota-text mb-6">প্রশ্নসমূহ</h3>
              <div className="space-y-8 mb-8">
                {formData.questions.map((q, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-sotota-card2 border border-sotota-border rounded-lg p-6"
                  >
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="font-semibold text-sotota-text">প্রশ্ন {index + 1}</h4>
                      {formData.questions.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveQuestion(index)}
                          className="text-sotota-red hover:text-sotota-redl transition"
                        >
                          <FiX size={20} />
                        </button>
                      )}
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-medium text-sotota-muted mb-1">প্রশ্ন টেক্সট *</label>
                        <textarea
                          value={q.questionText}
                          onChange={(e) => handleQuestionChange(index, 'questionText', e.target.value)}
                          placeholder="আপনার প্রশ্ন লিখুন..."
                          rows={2}
                          className="w-full bg-sotota-card border border-sotota-border rounded px-3 py-2 text-sotota-text placeholder:text-sotota-dim focus:outline-none focus:ring-2 focus:ring-sotota-accent text-sm resize-none"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        {['optionA', 'optionB', 'optionC', 'optionD'].map((option) => (
                          <div key={option}>
                            <label className="block text-xs font-medium text-sotota-muted mb-1">
                              বিকল্প {option.slice(-1)} *
                            </label>
                            <input
                              type="text"
                              value={(q as any)[option]}
                              onChange={(e) => handleQuestionChange(index, option, e.target.value)}
                              placeholder="বিকল্প লিখুন"
                              className="w-full bg-sotota-card border border-sotota-border rounded px-3 py-2 text-sotota-text placeholder:text-sotota-dim focus:outline-none focus:ring-2 focus:ring-sotota-accent text-sm"
                            />
                          </div>
                        ))}
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-sotota-muted mb-1">সঠিক উত্তর</label>
                          <select
                            value={q.correctAnswer}
                            onChange={(e) => handleQuestionChange(index, 'correctAnswer', e.target.value)}
                            className="w-full bg-sotota-card border border-sotota-border rounded px-3 py-2 text-sotota-text focus:outline-none focus:ring-2 focus:ring-sotota-accent text-sm"
                          >
                            <option value="A">A</option>
                            <option value="B">B</option>
                            <option value="C">C</option>
                            <option value="D">D</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-sotota-muted mb-1">ব্যাখ্যা</label>
                        <textarea
                          value={q.explanation}
                          onChange={(e) => handleQuestionChange(index, 'explanation', e.target.value)}
                          placeholder="সঠিক উত্তরের ব্যাখ্যা..."
                          rows={2}
                          className="w-full bg-sotota-card border border-sotota-border rounded px-3 py-2 text-sotota-text placeholder:text-sotota-dim focus:outline-none focus:ring-2 focus:ring-sotota-accent text-sm resize-none"
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Add Question Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={handleAddQuestion}
                className="mb-6 w-full py-2 border-2 border-dashed border-sotota-accent text-sotota-accent rounded-lg hover:bg-sotota-accent hover:text-white transition font-semibold"
              >
                + প্রশ্ন যোগ করুন
              </motion.button>

              {/* Message */}
              {message && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`mb-6 p-4 rounded-lg ${
                    message.includes('✅')
                      ? 'bg-green-500/20 border border-green-500 text-green-400'
                      : 'bg-sotota-red/20 border border-sotota-red text-sotota-red'
                  }`}
                >
                  {message}
                </motion.div>
              )}

              {/* Submit Buttons */}
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={submitting}
                  className="flex-1 px-6 py-3 bg-sotota-accent text-white rounded-lg hover:bg-sotota-accentd transition font-semibold disabled:opacity-50"
                >
                  {submitting ? 'তৈরি করা হচ্ছে...' : 'পরীক্ষা তৈরি করুন'}
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={() => setShowUploadForm(false)}
                  className="flex-1 px-6 py-3 bg-sotota-card2 border border-sotota-border text-sotota-text rounded-lg hover:border-sotota-accent transition font-semibold"
                >
                  বাতিল করুন
                </motion.button>
              </div>
            </motion.form>
          )}

          {/* Exams List */}
          <div>
            <h2 className="text-2xl font-bold text-sotota-text mb-6">সমস্ত পরীক্ষা ({exams.length})</h2>

            {loading ? (
              <div className="text-center py-12 text-sotota-muted">লোড হচ্ছে...</div>
            ) : exams.length === 0 ? (
              <div className="text-center py-12 text-sotota-muted">কোনো পরীক্ষা পাওয়া যায়নি</div>
            ) : (
              <div className="grid gap-4">
                {exams.map((exam) => (
                  <motion.div
                    key={exam.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-sotota-card border border-sotota-border rounded-lg p-6 hover:border-sotota-accent transition"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-bold text-sotota-text">{exam.title}</h3>
                        <p className="text-sotota-muted text-sm">{exam.description}</p>
                        <div className="flex gap-4 mt-3 text-sm text-sotota-muted">
                          <span>⏱️ {exam.duration} মিনিট</span>
                          <span>📝 {exam.questions?.length || 0} প্রশ্ন</span>
                          <span>✅ {exam.passingScore}% উত্তীর্ণ</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="inline-block px-3 py-1 rounded-full bg-sotota-accent/20 text-sotota-accent text-xs font-semibold">
                          সক্রিয়
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
