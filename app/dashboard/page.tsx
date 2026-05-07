'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FiBook, FiCheckCircle, FiTrendingUp, FiAward, FiZap, FiSettings } from 'react-icons/fi'
import { DashboardLayout } from '@/components/DashboardLayout'
import WrongAnswerCollection from '@/components/student/WrongAnswerCollection'
import NegativeMarksAnalytics from '@/components/student/NegativeMarksAnalytics'

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'progress' | 'exams' | 'certs'>('progress')
  const [dashboardData, setDashboardData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  useEffect(() => {
    if (status === 'authenticated') {
      fetchDashboardData()
    }
  }, [status])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/dashboard')
      if (!response.ok) throw new Error('Failed to fetch dashboard data')
      const data = await response.json()
      setDashboardData(data)
      setError(null)
    } catch (err) {
      console.error('Dashboard fetch error:', err)
      setError('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-12 h-12 border-4 border-sotota-accent border-t-transparent rounded-full"
          />
        </div>
      </DashboardLayout>
    )
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-red-500 text-lg">{error}</p>
        </div>
      </DashboardLayout>
    )
  }

  const stats = dashboardData || {
    totalCourses: 0,
    completedCourses: 0,
    inProgressCourses: 0,
    totalHours: 0,
    completionRate: 0,
    upcomingExams: [],
    enrolledCourses: []
  }

  // Stats Cards with Counter Animation
  const StatsCard = ({ value, label, icon: Icon }: { value: string; label: string; icon: any }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-sotota-card border border-sotota-border rounded-lg p-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sotota-muted text-sm mb-2">{label}</p>
          <p className="text-3xl font-bold text-sotota-accent sotota-stat">{value}</p>
        </div>
        <Icon className="text-sotota-accent opacity-50" size={40} />
      </div>
    </motion.div>
  )

  // Progress Item
  const ProgressItem = ({ title, progress }: { title: string; progress: number }) => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mb-6"
    >
      <div className="flex justify-between items-center mb-2">
        <p className="text-sotota-text font-medium">{title}</p>
        <span className="text-sotota-accent text-sm">{progress}%</span>
      </div>
      <div className="w-full h-2 bg-sotota-card2 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1, delay: 0.2 }}
          className="h-full bg-gradient-to-r from-sotota-accent to-sotota-accentl"
        />
      </div>
    </motion.div>
  )

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        {/* Admin Panel Link - Only show for admins */}
        {(session?.user as any)?.role === 'ADMIN' && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <Link
              href="/admin"
              className="inline-flex items-center gap-2 px-4 py-2 bg-sotota-accent/10 border border-sotota-accent rounded-lg text-sotota-accent hover:bg-sotota-accent hover:text-white transition font-semibold"
            >
              <FiSettings size={18} />
              অ্যাডমিন প্যানেলে যান
            </Link>
          </motion.div>
        )}

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          <StatsCard value={String(stats.completionRate)} label="সম্পূর্ণতার হার" icon={FiTrendingUp} />
          <StatsCard value={String(stats.totalCourses)} label="মোট কোর্স" icon={FiBook} />
          <StatsCard value={String(stats.completedCourses)} label="সম্পন্ন কোর্স" icon={FiCheckCircle} />
          <StatsCard value={String(stats.totalHours || 0)} label="মোট ঘন্টা" icon={FiAward} />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Tabs */}
          <div className="lg:col-span-2">
            {/* Tab Switcher */}
            <div className="flex gap-2 mb-6 border-b border-sotota-border pb-4">
              {['progress', 'exams', 'certs'].map((tab) => (
                <motion.button
                  key={tab}
                  onClick={() => setActiveTab(tab as any)}
                  className={`px-4 py-2 rounded-lg font-medium transition ${
                    activeTab === tab
                      ? 'bg-sotota-accent text-white'
                      : 'text-sotota-muted hover:text-sotota-text'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {tab === 'progress' && 'অগ্রগতি'}
                  {tab === 'exams' && 'পরীক্ষা'}
                  {tab === 'certs' && 'সার্টিফিকেট'}
                </motion.button>
              ))}
            </div>

            {/* Tab Content */}
            <motion.div
              key={activeTab}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="bg-sotota-card border border-sotota-border rounded-lg p-6"
            >
              {activeTab === 'progress' && (
                <div>
                  <h3 className="text-xl font-bold text-sotota-text mb-6">আপনার কোর্স প্রগতি</h3>
                  <ProgressItem title="বায়োলজি ফাউন্ডেশন" progress={85} />
                  <ProgressItem title="অর্গানিক কেমিস্ট্রি" progress={72} />
                  <ProgressItem title="ফিজিক্স এডভান্সড" progress={60} />
                  <ProgressItem title="মেডিকেল জিনেটিক্স" progress={45} />
                </div>
              )}

              {activeTab === 'exams' && (
                <div>
                  <h3 className="text-xl font-bold text-sotota-text mb-6">সাম্প্রতিক পরীক্ষা</h3>
                  {[
                    { name: 'বায়োলজি মক টেস্ট', score: '৭৮/১০০', difficulty: 'মধ্যম' },
                    { name: 'কেমিস্ট্রি চ্যালেঞ্জ', score: '৬৫/১০০', difficulty: 'কঠিন' },
                    { name: 'ফিজিক্স প্র্যাকটিস', score: '৯২/১০০', difficulty: 'সহজ' }
                  ].map((exam, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="flex justify-between items-center py-3 border-b border-sotota-border last:border-0"
                    >
                      <div>
                        <p className="text-sotota-text font-medium">{exam.name}</p>
                        <p className="text-sotota-muted text-sm">{exam.difficulty}</p>
                      </div>
                      <p className="text-sotota-accent font-bold">{exam.score}</p>
                    </motion.div>
                  ))}
                </div>
              )}

              {activeTab === 'certs' && (
                <div>
                  <h3 className="text-xl font-bold text-sotota-text mb-6">আপনার সার্টিফিকেট</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {['বায়োলজি মাস্টার', 'কেমিস্ট্রি এক্সপার্ট'].map((cert, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.1 }}
                        className="bg-sotota-card2 border border-sotota-accent border-opacity-50 rounded-lg p-4 text-center"
                      >
                        <FiCheckCircle className="mx-auto text-sotota-accent mb-2" size={32} />
                        <p className="text-sotota-text font-medium text-sm">{cert}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </div>

          {/* Right Panel - Mini Leaderboard & Streak */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            {/* Lost Inspiration Button */}
            <motion.a
              href="/inspiration"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative block bg-gradient-to-r from-sotota-accent to-sotota-accentl p-6 rounded-lg overflow-hidden group cursor-pointer"
            >
              {/* Pulse glow effect */}
              <motion.div
                animate={{
                  boxShadow: ['0 0 20px rgba(255, 99, 71, 0.5)', '0 0 40px rgba(255, 99, 71, 0.8)', '0 0 20px rgba(255, 99, 71, 0.5)']
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
                className="absolute inset-0 rounded-lg pointer-events-none"
              />
              <div className="relative z-10 text-center">
                <p className="text-white font-bold text-lg mb-2">😢 হারিয়ে ফেলেছেন অনুপ্রেরণা?</p>
                <p className="text-white/90 text-sm">অনুপ্রেরণামূলক ভিডিও দেখুন</p>
                <div className="mt-3 flex justify-center gap-2">
                  <span className="text-lg">🎬</span>
                  <span className="text-lg animate-bounce">▶️</span>
                </div>
              </div>
            </motion.a>

            {/* Leaderboard */}
            <div className="bg-sotota-card border border-sotota-border rounded-lg p-6">
              <h3 className="text-lg font-bold text-sotota-text mb-4">শীর্ষ ৩ জন</h3>
              <div className="space-y-3">
                {[
                  { rank: '১', name: 'আহমেদ হাসান', score: '৩,২১০' },
                  { rank: '२', name: 'ফাতিমা খান', score: '३,०৮৫' },
                  { rank: '३', name: 'করিম সাহেব', score: '२,७८०' }
                ].map((user, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
                      idx === 0 ? 'bg-sotota-gold' :
                      idx === 1 ? 'bg-gray-400' :
                      'bg-amber-600'
                    }`}>
                      {user.rank}
                    </div>
                    <div className="flex-1">
                      <p className="text-sotota-text text-sm font-medium">{user.name}</p>
                    </div>
                    <p className="text-sotota-accent font-bold text-sm">{user.score}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Streak */}
            <div className="bg-sotota-card border border-sotota-border rounded-lg p-6">
              <h3 className="text-lg font-bold text-sotota-text mb-4">আপনার সপ্তাহ</h3>
              <div className="grid grid-cols-7 gap-2">
                {['বা', 'মঙ', 'বু', 'বৃ', 'শু', 'শ', 'র'].map((day, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: idx * 0.05 }}
                    className={`aspect-square rounded-lg flex items-center justify-center font-bold text-sm transition ${
                      idx < 5
                        ? 'bg-sotota-accent text-white'
                        : 'bg-sotota-card2 text-sotota-muted'
                    }`}
                  >
                    {day}
                  </motion.div>
                ))}
              </div>
              <p className="text-sotota-muted text-sm mt-4 text-center">৫ দিনের ধারাবাহিকতা চলছে! 🔥</p>
            </div>
          </motion.div>
        </div>

        {/* Negative Marks Analytics Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12 pt-8 border-t border-sotota-border"
        >
          <NegativeMarksAnalytics />
        </motion.div>

        {/* Wrong Answer Collection Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-12 pt-8 border-t border-sotota-border"
        >
          {session?.user?.id && (
            <WrongAnswerCollection userId={session.user.id as string} />
          )}
        </motion.div>
      </div>
    </DashboardLayout>
  )
}
