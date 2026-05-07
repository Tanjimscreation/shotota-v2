'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

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

export default function ExamUploadForm() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [duration, setDuration] = useState('120')
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: '1',
      questionText: '',
      optionA: '',
      optionB: '',
      optionC: '',
      optionD: '',
      correctAnswer: 'A',
      explanation: ''
    }
  ])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleQuestionChange = (id: string, field: string, value: string) => {
    setQuestions(questions.map(q => 
      q.id === id ? { ...q, [field]: value } : q
    ))
  }

  const addQuestion = () => {
    const newQuestion: Question = {
      id: Date.now().toString(),
      questionText: '',
      optionA: '',
      optionB: '',
      optionC: '',
      optionD: '',
      correctAnswer: 'A',
      explanation: ''
    }
    setQuestions([...questions, newQuestion])
  }

  const removeQuestion = (id: string) => {
    if (questions.length > 1) {
      setQuestions(questions.filter(q => q.id !== id))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess(false)
    setLoading(true)

    try {
      if (questions.some(q => !q.questionText || !q.optionA || !q.optionB || !q.optionC || !q.optionD)) {
        setError('সব প্রশ্ন এবং অপশন পূরণ করুন')
        setLoading(false)
        return
      }

      const response = await fetch('/api/admin/exams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          duration: parseInt(duration) || 120,
          questions: questions.map(q => ({
            questionText: q.questionText,
            optionA: q.optionA,
            optionB: q.optionB,
            optionC: q.optionC,
            optionD: q.optionD,
            correctAnswer: q.correctAnswer,
            explanation: q.explanation
          }))
        })
      })

      const result = await response.json()

      if (!response.ok) {
        setError(result.error || 'পরীক্ষা তৈরি করতে ব্যর্থ')
        setLoading(false)
        return
      }

      setSuccess(true)
      setTitle('')
      setDescription('')
      setDuration('120')
      setQuestions([{
        id: '1',
        questionText: '',
        optionA: '',
        optionB: '',
        optionC: '',
        optionD: '',
        correctAnswer: 'A',
        explanation: ''
      }])
      setLoading(false)

      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setError('পরীক্ষা আপলোড করতে সমস্যা হয়েছে')
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-sotota-card rounded-2xl p-8 shadow-lg border border-sotota-border"
    >
      <h2 className="text-2xl font-bold text-sotota-text mb-6">নতুন পরীক্ষা আপলোড করুন</h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-sotota-text mb-2">পরীক্ষা শিরোনাম *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="যেমন: Anatomy Midterm Exam"
            className="w-full bg-sotota-card2 border border-sotota-border rounded-lg py-3 px-4 text-sotota-text placeholder:text-sotota-dim focus:outline-none focus:border-sotota-accent"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-sotota-text mb-2">বর্ণনা</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="পরীক্ষার বর্ণনা লিখুন..."
            className="w-full bg-sotota-card2 border border-sotota-border rounded-lg py-3 px-4 text-sotota-text placeholder:text-sotota-dim focus:outline-none focus:border-sotota-accent resize-none"
            rows={3}
          />
        </div>

        {/* Duration */}
        <div>
          <label className="block text-sm font-medium text-sotota-text mb-2">সময়কাল (মিনিট) *</label>
          <input
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            placeholder="120"
            className="w-full bg-sotota-card2 border border-sotota-border rounded-lg py-3 px-4 text-sotota-text placeholder:text-sotota-dim focus:outline-none focus:border-sotota-accent"
            required
          />
        </div>

        {/* Questions */}
        <div className="border-t border-sotota-border pt-6">
          <h3 className="text-lg font-bold text-sotota-text mb-4">প্রশ্ন পত্র ({questions.length}টি প্রশ্ন)</h3>

          {questions.map((question, index) => (
            <motion.div
              key={question.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-sotota-card2 rounded-lg p-5 mb-5 border border-sotota-border"
            >
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-bold text-sotota-text">প্রশ্ন {index + 1}</h4>
                {questions.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeQuestion(question.id)}
                    className="text-sotota-red text-sm font-bold hover:bg-sotota-red hover:bg-opacity-10 px-3 py-1 rounded"
                  >
                    ✕ মুছুন
                  </button>
                )}
              </div>

              {/* Question Text */}
              <textarea
                value={question.questionText}
                onChange={(e) => handleQuestionChange(question.id, 'questionText', e.target.value)}
                placeholder="প্রশ্নটি লিখুন..."
                className="w-full bg-sotota-card border border-sotota-border rounded-lg py-3 px-4 text-sotota-text placeholder:text-sotota-dim focus:outline-none focus:border-sotota-accent resize-none mb-4"
                rows={2}
                required
              />

              {/* Options */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {['A', 'B', 'C', 'D'].map(option => (
                  <input
                    key={option}
                    type="text"
                    value={question[`option${option}` as keyof Question]}
                    onChange={(e) => handleQuestionChange(question.id, `option${option}`, e.target.value)}
                    placeholder={`অপশন ${option}`}
                    className="bg-sotota-card border border-sotota-border rounded-lg py-3 px-4 text-sotota-text placeholder:text-sotota-dim focus:outline-none focus:border-sotota-accent"
                    required
                  />
                ))}
              </div>

              {/* Correct Answer & Explanation */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-sotota-text mb-1">সঠিক উত্তর</label>
                  <select
                    value={question.correctAnswer}
                    onChange={(e) => handleQuestionChange(question.id, 'correctAnswer', e.target.value)}
                    className="w-full bg-sotota-card border border-sotota-border rounded-lg py-3 px-4 text-sotota-text focus:outline-none focus:border-sotota-accent"
                  >
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                    <option value="D">D</option>
                  </select>
                </div>
                <textarea
                  value={question.explanation}
                  onChange={(e) => handleQuestionChange(question.id, 'explanation', e.target.value)}
                  placeholder="ব্যাখ্যা (ঐচ্ছিক)"
                  className="bg-sotota-card border border-sotota-border rounded-lg py-3 px-4 text-sotota-text placeholder:text-sotota-dim focus:outline-none focus:border-sotota-accent resize-none"
                  rows={2}
                />
              </div>
            </motion.div>
          ))}

          <button
            type="button"
            onClick={addQuestion}
            className="px-4 py-2 bg-sotota-accent text-white rounded-lg font-bold hover:bg-sotota-accentd transition mb-6"
          >
            ➕ নতুন প্রশ্ন যোগ করুন
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-sotota-red bg-opacity-20 border border-sotota-red rounded-lg p-3 text-sotota-red text-sm"
          >
            {error}
          </motion.div>
        )}

        {/* Success Message */}
        {success && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-green-100 border border-green-400 rounded-lg p-3 text-green-700 text-sm"
          >
            ✅ পরীক্ষা সফলভাবে তৈরি করা হয়েছে!
          </motion.div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-sotota-accent to-sotota-accentd text-white font-bold py-3 rounded-lg transition disabled:opacity-50 hover:shadow-lg"
        >
          {loading ? 'আপলোড হচ্ছে...' : '📝 পরীক্ষা আপলোড করুন'}
        </button>
      </form>
    </motion.div>
  )
}
