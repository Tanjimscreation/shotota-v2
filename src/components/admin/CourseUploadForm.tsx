'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

export default function CourseUploadForm() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [instructor, setInstructor] = useState('')
  const [category, setCategory] = useState('')
  const [duration, setDuration] = useState('')
  const [lessons, setLessons] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess(false)
    setLoading(true)

    try {
      const response = await fetch('/api/admin/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          instructor: instructor.trim(),
          category: category.trim(),
          duration: parseInt(duration) || 0,
          lessons: parseInt(lessons) || 0,
        })
      })

      const result = await response.json()

      if (!response.ok) {
        setError(result.error || 'কোর্স তৈরি করতে ব্যর্থ')
        setLoading(false)
        return
      }

      setSuccess(true)
      setTitle('')
      setDescription('')
      setInstructor('')
      setCategory('')
      setDuration('')
      setLessons('')
      setLoading(false)

      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setError('কোর্স আপলোড করতে সমস্যা হয়েছে')
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-sotota-card rounded-2xl p-8 shadow-lg border border-sotota-border"
    >
      <h2 className="text-2xl font-bold text-sotota-text mb-6">নতুন কোর্স আপলোড করুন</h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-sotota-text mb-2">কোর্স শিরোনাম *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="যেমন: MBBS Anatomy 101"
            className="w-full bg-sotota-card2 border border-sotota-border rounded-lg py-3 px-4 text-sotota-text placeholder:text-sotota-dim focus:outline-none focus:border-sotota-accent"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-sotota-text mb-2">বর্ণনা *</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="কোর্সের বিবরণ লিখুন..."
            className="w-full bg-sotota-card2 border border-sotota-border rounded-lg py-3 px-4 text-sotota-text placeholder:text-sotota-dim focus:outline-none focus:border-sotota-accent resize-none"
            rows={4}
            required
          />
        </div>

        {/* Instructor */}
        <div>
          <label className="block text-sm font-medium text-sotota-text mb-2">প্রশিক্ষক *</label>
          <input
            type="text"
            value={instructor}
            onChange={(e) => setInstructor(e.target.value)}
            placeholder="প্রশিক্ষকের নাম"
            className="w-full bg-sotota-card2 border border-sotota-border rounded-lg py-3 px-4 text-sotota-text placeholder:text-sotota-dim focus:outline-none focus:border-sotota-accent"
            required
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-sotota-text mb-2">বিভাগ *</label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="যেমন: Medical, Engineering"
            className="w-full bg-sotota-card2 border border-sotota-border rounded-lg py-3 px-4 text-sotota-text placeholder:text-sotota-dim focus:outline-none focus:border-sotota-accent"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Duration */}
          <div>
            <label className="block text-sm font-medium text-sotota-text mb-2">সময়কাল (ঘণ্টা)</label>
            <input
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="0"
              className="w-full bg-sotota-card2 border border-sotota-border rounded-lg py-3 px-4 text-sotota-text placeholder:text-sotota-dim focus:outline-none focus:border-sotota-accent"
            />
          </div>

          {/* Lessons */}
          <div>
            <label className="block text-sm font-medium text-sotota-text mb-2">পাঠের সংখ্যা</label>
            <input
              type="number"
              value={lessons}
              onChange={(e) => setLessons(e.target.value)}
              placeholder="0"
              className="w-full bg-sotota-card2 border border-sotota-border rounded-lg py-3 px-4 text-sotota-text placeholder:text-sotota-dim focus:outline-none focus:border-sotota-accent"
            />
          </div>
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
            ✅ কোর্স সফলভাবে তৈরি করা হয়েছে!
          </motion.div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-sotota-accent to-sotota-accentd text-white font-bold py-3 rounded-lg transition disabled:opacity-50 hover:shadow-lg"
        >
          {loading ? 'আপলোড হচ্ছে...' : '📚 কোর্স আপলোড করুন'}
        </button>
      </form>
    </motion.div>
  )
}
