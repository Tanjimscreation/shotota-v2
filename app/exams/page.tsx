'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { FiArrowRight, FiClock, FiBook } from 'react-icons/fi'

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

export default function ExamsPage() {
  const [exams, setExams] = useState<Exam[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const response = await fetch('/api/exams')
        if (!response.ok) throw new Error('Failed to fetch exams')

        const data = await response.json()
        setExams(data.exams)
      } catch (err) {
        setError('পরীক্ষা লোড করতে ব্যর্থ হয়েছে')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchExams()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-sotota-bg py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="h-64 bg-sotota-card rounded-lg border border-sotota-border animate-pulse"
              />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-sotota-bg py-12 px-6 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-sotota-text mb-2">{error}</h1>
          <Link href="/courses" className="text-sotota-accent hover:text-sotota-accentl">
            কোর্সে ফিরুন
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-sotota-bg">
      {/* Header */}
      <div className="bg-sotota-surface border-b border-sotota-border py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl font-bold text-sotota-text mb-2">সকল পরীক্ষা</h1>
            <p className="text-sotota-muted">আপনার দক্ষতা পরীক্ষা করুন এবং মূল্যায়ন পান</p>
          </motion.div>
        </div>
      </div>

      {/* Exams Grid */}
      <div className="py-12 px-6">
        <div className="max-w-6xl mx-auto">
          {exams.length === 0 ? (
            <div className="text-center py-12">
              <FiBook className="w-16 h-16 mx-auto mb-4 text-sotota-muted opacity-50" />
              <p className="text-sotota-muted text-lg">কোনো পরীক্ষা পাওয়া যায়নি</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {exams.map((exam, index) => (
                <motion.div
                  key={exam.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <Link href={`/exam?id=${exam.id}`}>
                    <div className="h-full bg-sotota-card border border-sotota-border rounded-lg p-6 hover:border-sotota-accent transition cursor-pointer">
                      {/* Course Tag */}
                      <div className="inline-block px-3 py-1 rounded-full bg-sotota-accent/20 text-sotota-accent text-xs font-semibold mb-4">
                        {exam.course.title}
                      </div>

                      {/* Title & Description */}
                      <h3 className="text-xl font-bold text-sotota-text mb-2">{exam.title}</h3>
                      <p className="text-sotota-muted text-sm mb-4 line-clamp-2">{exam.description}</p>

                      {/* Stats */}
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="bg-sotota-card2 rounded-lg p-3">
                          <div className="text-xs text-sotota-muted mb-1">সময়</div>
                          <div className="flex items-center gap-2 text-sotota-text font-semibold">
                            <FiClock className="w-4 h-4" />
                            {exam.duration} মিনিট
                          </div>
                        </div>
                        <div className="bg-sotota-card2 rounded-lg p-3">
                          <div className="text-xs text-sotota-muted mb-1">প্রশ্ন</div>
                          <div className="font-semibold text-sotota-text">{exam.totalQuestions}টি</div>
                        </div>
                      </div>

                      {/* More Info */}
                      <div className="space-y-2 text-sm mb-6">
                        <div className="flex justify-between">
                          <span className="text-sotota-muted">উত্তীর্ণ হওয়ার চিহ্ন</span>
                          <span className="text-sotota-text font-semibold">{exam.passingScore}%</span>
                        </div>
                        {exam.negativeMarking > 0 && (
                          <div className="flex justify-between">
                            <span className="text-sotota-muted">নেতিবাচক চিহ্ন</span>
                            <span className="text-sotota-text font-semibold">{exam.negativeMarking}</span>
                          </div>
                        )}
                      </div>

                      {/* Button */}
                      <div className="flex items-center gap-2 text-sotota-accent font-semibold group">
                        পরীক্ষা শুরু করুন
                        <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
