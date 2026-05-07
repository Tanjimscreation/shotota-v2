'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { motion } from 'framer-motion'
import CourseUploadForm from '@/components/admin/CourseUploadForm'
import ExamUploadForm from '@/components/admin/ExamUploadForm'

export default function AdminDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'courses' | 'exams'>('courses')

  // Loading state
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-sotota-bg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sotota-accent mx-auto mb-4"></div>
          <p className="text-sotota-text">লোড হচ্ছে...</p>
        </div>
      </div>
    )
  }

  // Not authenticated - redirect to login
  if (!session) {
    router.push('/login')
    return null
  }

  // Not admin - show access denied
  if ((session.user as any)?.role !== 'ADMIN') {
    return (
      <div className="min-h-screen bg-sotota-bg flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-sotota-card rounded-2xl p-8 max-w-md w-full text-center shadow-lg border border-sotota-border"
        >
          <div className="text-5xl mb-4">🔒</div>
          <h1 className="text-2xl font-bold text-sotota-text mb-2">অ্যাক্সেস নিষিদ্ধ</h1>
          <p className="text-sotota-muted mb-6">শুধুমাত্র প্রশিক্ষকরা এই পৃষ্ঠা অ্যাক্সেস করতে পারেন</p>
          <button
            onClick={() => router.push('/dashboard')}
            className="w-full bg-sotota-accent text-white font-bold py-3 rounded-lg hover:bg-sotota-accentd transition"
          >
            ড্যাশবোর্ডে ফিরে যান
          </button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-sotota-bg">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-sotota-accent to-sotota-accentd text-white py-8 px-4 shadow-lg"
      >
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold mb-2">👨‍🏫 প্রশিক্ষক ড্যাশবোর্ড</h1>
          <p className="text-lg opacity-90">স্বাগতম, {session.user?.name}!</p>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto p-4 md:p-8">
        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex gap-4 mb-8"
        >
          <button
            onClick={() => setActiveTab('courses')}
            className={`px-6 py-3 rounded-lg font-bold transition ${
              activeTab === 'courses'
                ? 'bg-sotota-accent text-white shadow-lg'
                : 'bg-sotota-card text-sotota-text border border-sotota-border hover:bg-sotota-card2'
            }`}
          >
            📚 কোর্স আপলোড করুন
          </button>
          <button
            onClick={() => setActiveTab('exams')}
            className={`px-6 py-3 rounded-lg font-bold transition ${
              activeTab === 'exams'
                ? 'bg-sotota-accent text-white shadow-lg'
                : 'bg-sotota-card text-sotota-text border border-sotota-border hover:bg-sotota-card2'
            }`}
          >
            📝 পরীক্ষা আপলোড করুন
          </button>
        </motion.div>

        {/* Content Areas */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'courses' && <CourseUploadForm />}
          {activeTab === 'exams' && <ExamUploadForm />}
        </motion.div>
      </div>
    </div>
  )
}
