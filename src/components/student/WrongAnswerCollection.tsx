import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiX, FiCheckCircle, FiAlertCircle } from 'react-icons/fi'

interface WrongAnswer {
  id: string
  questionText: string
  userAnswer: string
  correctAnswer: string
  explanation?: string
  subject?: string
  createdAt: string
}

interface WrongAnswerCollectionProps {
  userId: string
}

export default function WrongAnswerCollection({ userId }: WrongAnswerCollectionProps) {
  const [wrongAnswers, setWrongAnswers] = useState<WrongAnswer[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedAnswer, setSelectedAnswer] = useState<WrongAnswer | null>(null)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    fetchWrongAnswers()
  }, [userId])

  const fetchWrongAnswers = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/student/wrong-answers')
      if (!response.ok) throw new Error('Failed to fetch wrong answers')
      const data = await response.json()
      setWrongAnswers(data.wrongAnswers || [])
    } catch (error) {
      console.error('Error fetching wrong answers:', error)
    } finally {
      setLoading(false)
    }
  }

  const subjects = ['all', ...new Set(wrongAnswers.map(a => a.subject || 'Other'))]
  const filteredAnswers = filter === 'all' 
    ? wrongAnswers 
    : wrongAnswers.filter(a => (a.subject || 'Other') === filter)

  const getAnswerLabel = (answer: string) => {
    return answer.toUpperCase()
  }

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-sotota-card border border-sotota-border rounded-lg p-6"
      >
        <div className="flex items-center justify-center py-8">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-8 h-8 border-2 border-sotota-accent border-t-transparent rounded-full"
          />
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div>
        <h3 className="text-xl font-bold text-sotota-text mb-2">❌ ভুল উত্তর সংগ্রহ</h3>
        <p className="text-sotota-muted">আপনার ভুল উত্তর গুলি এখানে সংরক্ষিত আছে। এগুলি পর্যালোচনা করুন এবং উন্নতি করুন।</p>
      </div>

      {/* Stats */}
      {wrongAnswers.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <div className="bg-sotota-card2 border border-sotota-border rounded-lg p-4">
            <p className="text-sotota-muted text-sm">মোট ভুল উত্তর</p>
            <p className="text-2xl font-bold text-sotota-accent">{wrongAnswers.length}</p>
          </div>
          <div className="bg-sotota-card2 border border-sotota-border rounded-lg p-4">
            <p className="text-sotota-muted text-sm">বিভিন্ন বিষয়</p>
            <p className="text-2xl font-bold text-sotota-accent">{subjects.length - 1}</p>
          </div>
          <div className="bg-sotota-card2 border border-sotota-border rounded-lg p-4">
            <p className="text-sotota-muted text-sm">পর্যালোচনা প্রয়োজন</p>
            <p className="text-2xl font-bold text-sotota-accent">{filteredAnswers.length}</p>
          </div>
        </motion.div>
      )}

      {/* Filters */}
      {wrongAnswers.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {subjects.map((subject, index) => (
            <motion.button
              key={subject}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => setFilter(subject)}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filter === subject
                  ? 'bg-sotota-accent text-white'
                  : 'bg-sotota-card border border-sotota-border text-sotota-text hover:border-sotota-accent'
              }`}
            >
              {subject === 'all' ? 'সব' : subject}
            </motion.button>
          ))}
        </div>
      )}

      {/* Wrong Answers List */}
      {filteredAnswers.length > 0 ? (
        <div className="space-y-3">
          {filteredAnswers.map((answer, index) => (
            <motion.div
              key={answer.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => setSelectedAnswer(answer)}
              className="bg-sotota-card border border-sotota-border rounded-lg p-4 cursor-pointer hover:border-sotota-accent transition"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-red-100">
                    <FiAlertCircle className="text-red-600" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sotota-text font-medium line-clamp-2">
                    {answer.questionText.substring(0, 100)}...
                  </p>
                  <div className="flex gap-4 mt-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-sotota-muted">আপনার উত্তর:</span>
                      <span className="px-3 py-1 bg-red-100 text-red-700 rounded font-bold text-sm">
                        {getAnswerLabel(answer.userAnswer)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-sotota-muted">সঠিক উত্তর:</span>
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded font-bold text-sm">
                        {getAnswerLabel(answer.correctAnswer)}
                      </span>
                    </div>
                  </div>
                  {answer.subject && (
                    <p className="text-sm text-sotota-muted mt-2">{answer.subject}</p>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12 bg-sotota-card border border-sotota-border rounded-lg"
        >
          <FiCheckCircle className="mx-auto text-4xl text-sotota-accent mb-3" />
          <p className="text-sotota-muted text-lg">কোন ভুল উত্তর নেই 🎉</p>
          <p className="text-sotota-muted text-sm">আপনি সব প্রশ্নের সঠিক উত্তর দিয়েছেন!</p>
        </motion.div>
      )}

      {/* Detail Modal */}
      {selectedAnswer && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedAnswer(null)}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={e => e.stopPropagation()}
            className="bg-sotota-card border border-sotota-border rounded-lg p-6 max-w-2xl w-full"
          >
            <div className="flex items-start justify-between mb-4">
              <h4 className="text-lg font-bold text-sotota-text flex-1">প্রশ্নের বিস্তারিত</h4>
              <button
                onClick={() => setSelectedAnswer(null)}
                className="text-sotota-muted hover:text-sotota-text"
              >
                <FiX size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sotota-muted text-sm mb-2">প্রশ্ন:</p>
                <p className="text-sotota-text font-medium">{selectedAnswer.questionText}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sotota-muted text-sm mb-2">আপনার উত্তর:</p>
                  <div className="px-4 py-3 bg-red-100 rounded border border-red-300">
                    <p className="text-red-700 font-bold text-lg">
                      {getAnswerLabel(selectedAnswer.userAnswer)}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-sotota-muted text-sm mb-2">সঠিক উত্তর:</p>
                  <div className="px-4 py-3 bg-green-100 rounded border border-green-300">
                    <p className="text-green-700 font-bold text-lg">
                      {getAnswerLabel(selectedAnswer.correctAnswer)}
                    </p>
                  </div>
                </div>
              </div>

              {selectedAnswer.explanation && (
                <div>
                  <p className="text-sotota-muted text-sm mb-2">ব্যাখ্যা:</p>
                  <div className="bg-sotota-card2 border border-sotota-border rounded p-4">
                    <p className="text-sotota-text">{selectedAnswer.explanation}</p>
                  </div>
                </div>
              )}

              <button
                onClick={() => setSelectedAnswer(null)}
                className="w-full py-2 bg-sotota-accent text-white rounded font-medium hover:opacity-90 transition"
              >
                বন্ধ করুন
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  )
}
