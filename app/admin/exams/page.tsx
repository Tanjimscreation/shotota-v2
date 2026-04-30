'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { motion } from 'framer-motion'
import { FiArrowLeft, FiUpload, FiX, FiCheck, FiAlertCircle } from 'react-icons/fi'
import Link from 'next/link'
import { DashboardLayout } from '@/components/DashboardLayout'

interface Question {
  questionText: string
  optionA: string
  optionB: string
  optionC: string
  optionD: string
  correctAnswer: 'A' | 'B' | 'C' | 'D'
  explanation: string
}

export default function AdminExamsPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [activeTab, setActiveTab] = useState<'upload' | 'monitor'>('upload')
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const [submitting, setSubmitting] = useState(false)

  // Upload form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    courseId: 'medical',
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
        correctAnswer: 'A' as const,
        explanation: ''
      }
    ]
  })

  // Monitor state
  const [activeExams, setActiveExams] = useState<any[]>([])

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
      return
    }

    if (status === 'authenticated' && session?.user?.role !== 'ADMIN') {
      router.push('/dashboard')
      return
    }

    setLoading(false)
  }, [status, session, router])

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
    setFormData({ ...formData, questions: newQuestions })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setMessage(null)

    try {
      const response = await fetch('/api/admin/exams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (response.ok) {
        setMessage({ type: 'success', text: 'Exam uploaded successfully!' })
        // Reset form
        setFormData({
          title: '',
          description: '',
          courseId: 'medical',
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
        setTimeout(() => setMessage(null), 3000)
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to upload exam' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error uploading exam' })
    } finally {
      setSubmitting(false)
    }
  }

  const handleCSVUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const text = await file.text()
      const lines = text.split('\n').filter(line => line.trim())
      
      // Expected CSV format: questionText,optionA,optionB,optionC,optionD,correctAnswer,explanation
      const questions: Question[] = []
      
      for (let i = 1; i < lines.length; i++) {
        const [q, a, b, c, d, correct, exp] = lines[i].split(',').map(s => s.trim())
        if (q && a && b && c && d && correct) {
          questions.push({
            questionText: q,
            optionA: a,
            optionB: b,
            optionC: c,
            optionD: d,
            correctAnswer: correct as 'A' | 'B' | 'C' | 'D',
            explanation: exp || ''
          })
        }
      }

      setFormData((prev) => ({
        ...prev,
        questions: questions as any
      }))
      setMessage({ type: 'success', text: `Loaded ${questions.length} questions from CSV` })
      setTimeout(() => setMessage(null), 3000)
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to parse CSV file' })
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sotota-dark"></div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-sotota-dark hover:text-sotota-light mb-4">
            <FiArrowLeft className="text-xl" />
            ড্যাশবোর্ডে ফিরুন
          </Link>
          <h1 className="text-3xl font-bold text-sotota-dark">প্রশ্ন পত্র ব্যবস্থাপনা</h1>
          <p className="text-gray-600 mt-2">প্রশ্ন পত্র আপলোড করুন এবং পরীক্ষা নিরীক্ষণ করুন</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('upload')}
            className={`px-6 py-3 font-semibold transition-colors ${
              activeTab === 'upload'
                ? 'text-sotota-dark border-b-2 border-sotota-dark'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <FiUpload className="inline mr-2" />
            প্রশ্ন আপলোড করুন
          </button>
          <button
            onClick={() => setActiveTab('monitor')}
            className={`px-6 py-3 font-semibold transition-colors ${
              activeTab === 'monitor'
                ? 'text-sotota-dark border-b-2 border-sotota-dark'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            পরীক্ষা নিরীক্ষণ
          </button>
        </div>

        {/* Message */}
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
              message.type === 'success'
                ? 'bg-green-50 text-green-800 border border-green-200'
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}
          >
            {message.type === 'success' ? <FiCheck /> : <FiAlertCircle />}
            {message.text}
          </motion.div>
        )}

        {/* Upload Tab */}
        {activeTab === 'upload' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-lg shadow-lg p-8"
          >
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    পরীক্ষার শিরোনাম *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="যেমন: NEET 2026 প্র্যাকটিস টেস্ট"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-sotota-dark"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    কোর্স
                  </label>
                  <select
                    value={formData.courseId}
                    onChange={(e) => setFormData({ ...formData, courseId: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-sotota-dark"
                  >
                    <option value="medical">চিকিৎসা</option>
                    <option value="engineering">প্রকৌশল</option>
                    <option value="general">সাধারণ</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    সময়কাল (মিনিট)
                  </label>
                  <input
                    type="number"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-sotota-dark"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    উত্তীর্ণ নম্বর (%)
                  </label>
                  <input
                    type="number"
                    value={formData.passingScore}
                    onChange={(e) => setFormData({ ...formData, passingScore: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-sotota-dark"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  বিবরণ
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="পরীক্ষার বিবরণ..."
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-sotota-dark"
                />
              </div>

              {/* CSV Upload */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                <p className="text-sm font-semibold text-gray-700 mb-3">
                  CSV থেকে প্রশ্ন আপলোড করুন (ঐচ্ছিক)
                </p>
                <p className="text-xs text-gray-500 mb-4">
                  ফরম্যাট: questionText,optionA,optionB,optionC,optionD,correctAnswer,explanation
                </p>
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleCSVUpload}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-sotota-dark file:text-white hover:file:bg-sotota-light"
                />
              </div>

              {/* Questions */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">প্রশ্ন ({formData.questions.length})</h3>
                  <button
                    type="button"
                    onClick={handleAddQuestion}
                    className="px-4 py-2 bg-sotota-dark text-white rounded-lg hover:bg-sotota-light transition-colors flex items-center gap-2"
                  >
                    <FiUpload /> প্রশ্ন যোগ করুন
                  </button>
                </div>

                <div className="space-y-6">
                  {formData.questions.map((question, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="border border-gray-200 rounded-lg p-6 bg-gray-50"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <h4 className="font-semibold text-gray-800">প্রশ্ন {index + 1}</h4>
                        {formData.questions.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveQuestion(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <FiX />
                          </button>
                        )}
                      </div>

                      <textarea
                        value={question.questionText}
                        onChange={(e) => handleQuestionChange(index, 'questionText', e.target.value)}
                        placeholder="প্রশ্ন লিখুন"
                        rows={2}
                        className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:border-sotota-dark"
                        required
                      />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        {['optionA', 'optionB', 'optionC', 'optionD'].map((opt) => (
                          <input
                            key={opt}
                            type="text"
                            value={(question as any)[opt]}
                            onChange={(e) => handleQuestionChange(index, opt, e.target.value)}
                            placeholder={`বিকল্প ${opt.replace('option', '')}`}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-sotota-dark"
                            required
                          />
                        ))}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <select
                          value={question.correctAnswer}
                          onChange={(e) => handleQuestionChange(index, 'correctAnswer', e.target.value)}
                          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-sotota-dark"
                        >
                          <option value="A">সঠিক উত্তর: A</option>
                          <option value="B">সঠিক উত্তর: B</option>
                          <option value="C">সঠিক উত্তর: C</option>
                          <option value="D">সঠিক উত্তর: D</option>
                        </select>

                        <textarea
                          value={question.explanation}
                          onChange={(e) => handleQuestionChange(index, 'explanation', e.target.value)}
                          placeholder="ব্যাখ্যা (ঐচ্ছিক)"
                          rows={1}
                          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-sotota-dark"
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 bg-sotota-dark text-white font-semibold rounded-lg hover:bg-sotota-light transition-colors disabled:opacity-50"
              >
                {submitting ? 'আপলোড হচ্ছে...' : 'পরীক্ষা আপলোড করুন'}
              </button>
            </form>
          </motion.div>
        )}

        {/* Monitor Tab */}
        {activeTab === 'monitor' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-lg shadow-lg p-8"
          >
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4">কোন সক্রিয় পরীক্ষা নেই</p>
              <p className="text-sm text-gray-500">যখন শিক্ষার্থীরা পরীক্ষা দিতে শুরু করবে তখন সেগুলি এখানে প্রদর্শিত হবে</p>
            </div>
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  )
}
