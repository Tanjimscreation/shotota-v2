import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface NegativeMarksStats {
  daily: { negativeMarks: number; percentage: number }
  weekly: { negativeMarks: number; percentage: number }
  monthly: { negativeMarks: number; percentage: number }
  overall: {
    totalNegativeMarks: number
    totalExamsAttempted: number
    avgNegativePercentage: number
  }
}

export default function NegativeMarksAnalytics() {
  const [stats, setStats] = useState<NegativeMarksStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'daily' | 'weekly' | 'monthly' | 'overall'>('overall')

  useEffect(() => {
    fetchNegativeMarksData()
  }, [])

  const fetchNegativeMarksData = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/student/negative-marks')
      if (!response.ok) throw new Error('Failed to fetch negative marks')
      const data = await response.json()
      setStats(data)
    } catch (error) {
      console.error('Error fetching negative marks:', error)
    } finally {
      setLoading(false)
    }
  }

  const StatCard = ({
    title,
    marks,
    percentage,
    icon
  }: {
    title: string
    marks: number
    percentage: number
    icon: string
  }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-sotota-card border border-sotota-border rounded-lg p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-sotota-text font-medium">{title}</h4>
        <span className="text-3xl">{icon}</span>
      </div>

      <div className="space-y-2">
        <div>
          <p className="text-sotota-muted text-sm mb-1">নেগেটিভ মার্কস:</p>
          <p className="text-2xl font-bold text-red-500">{marks.toFixed(2)}</p>
        </div>

        <div>
          <p className="text-sotota-muted text-sm mb-1">শতাংশ:</p>
          <div className="flex items-center gap-2">
            <div className="flex-1 h-2 bg-sotota-card2 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(percentage, 100)}%` }}
                transition={{ duration: 1 }}
                className="h-full bg-gradient-to-r from-red-500 to-orange-500"
              />
            </div>
            <span className="text-red-500 font-bold text-sm w-12">
              {percentage.toFixed(1)}%
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  )

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

  if (!stats) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-sotota-card border border-sotota-border rounded-lg p-6 text-center"
      >
        <p className="text-sotota-muted">নেগেটিভ মার্কস ডেটা উপলব্ধ নয়</p>
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
        <h3 className="text-xl font-bold text-sotota-text mb-2">📊 নেগেটিভ মার্কস ট্র্যাকিং</h3>
        <p className="text-sotota-muted">আপনার নেগেটিভ মার্কস এবং তাদের প্রভাব ট্র্যাক করুন</p>
      </div>

      {/* Tab Switcher */}
      <div className="flex flex-wrap gap-2">
        {(['daily', 'weekly', 'monthly', 'overall'] as const).map((tab) => (
          <motion.button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              activeTab === tab
                ? 'bg-sotota-accent text-white'
                : 'bg-sotota-card border border-sotota-border text-sotota-text hover:border-sotota-accent'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {tab === 'daily' && 'দৈনিক'}
            {tab === 'weekly' && 'সাপ্তাহিক'}
            {tab === 'monthly' && 'মাসিক'}
            {tab === 'overall' && 'মোট'}
          </motion.button>
        ))}
      </div>

      {/* Stats Display */}
      {activeTab === 'daily' && (
        <StatCard
          title="আজকের নেগেটিভ মার্কস"
          marks={stats.daily.negativeMarks}
          percentage={stats.daily.percentage}
          icon="📅"
        />
      )}

      {activeTab === 'weekly' && (
        <StatCard
          title="সাপ্তাহিক নেগেটিভ মার্কস"
          marks={stats.weekly.negativeMarks}
          percentage={stats.weekly.percentage}
          icon="📈"
        />
      )}

      {activeTab === 'monthly' && (
        <StatCard
          title="মাসিক নেগেটিভ মার্কস"
          marks={stats.monthly.negativeMarks}
          percentage={stats.monthly.percentage}
          icon="📊"
        />
      )}

      {activeTab === 'overall' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          <StatCard
            title="আজকের নেগেটিভ মার্কস"
            marks={stats.daily.negativeMarks}
            percentage={stats.daily.percentage}
            icon="📅"
          />
          <StatCard
            title="সাপ্তাহিক নেগেটিভ মার্কস"
            marks={stats.weekly.negativeMarks}
            percentage={stats.weekly.percentage}
            icon="📈"
          />
          <StatCard
            title="মাসিক নেগেটিভ মার্কস"
            marks={stats.monthly.negativeMarks}
            percentage={stats.monthly.percentage}
            icon="📊"
          />
        </motion.div>
      )}

      {activeTab === 'overall' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-sotota-card border border-sotota-border rounded-lg p-6"
        >
          <h4 className="text-lg font-bold text-sotota-text mb-4">সামগ্রিক পরিসংখ্যান</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sotota-muted text-sm mb-2">মোট নেগেটিভ মার্কস</p>
              <p className="text-3xl font-bold text-red-500">
                {stats.overall.totalNegativeMarks.toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-sotota-muted text-sm mb-2">পরীক্ষা সংখ্যা</p>
              <p className="text-3xl font-bold text-sotota-accent">
                {stats.overall.totalExamsAttempted}
              </p>
            </div>
            <div>
              <p className="text-sotota-muted text-sm mb-2">গড় নেগেটিভ মার্কস শতাংশ</p>
              <p className="text-3xl font-bold text-orange-500">
                {stats.overall.avgNegativePercentage.toFixed(1)}%
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Advice Card */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="bg-sotota-card2 border border-sotota-border rounded-lg p-4"
      >
        <p className="text-sotota-text font-medium mb-2">💡 টিপস:</p>
        <ul className="space-y-2 text-sotota-muted text-sm">
          <li>• নেগেটিভ মার্কস এড়াতে অনিশ্চিত প্রশ্নে অনুমান এড়ান</li>
          <li>• সঠিক উত্তরের জন্য আপনার আত্মবিশ্বাসী হন</li>
          <li>• ভুল উত্তরগুলি পর্যালোচনা করুন এবং উন্নতি করুন</li>
          <li>• নেগেটিভ মার্কস কমাতে বেশি অনুশীলন করুন</li>
        </ul>
      </motion.div>
    </motion.div>
  )
}
