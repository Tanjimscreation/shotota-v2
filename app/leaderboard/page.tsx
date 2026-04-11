'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { FiRefreshCw } from 'react-icons/fi'
import { DashboardLayout } from '@/components/DashboardLayout'
import Podium from '@/components/leaderboard/Podium'
import FilterPills from '@/components/leaderboard/FilterPills'
import LiveTable from '@/components/leaderboard/LiveTable'

interface LeaderboardEntry {
  rank: number
  name: string
  score: number
  change: number
  batch: string
  streak: number
  avatar: string
}

export default function LeaderboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [activeFilter, setActiveFilter] = useState('সবাই')
  const [loading, setLoading] = useState(false)
  const [isLive, setIsLive] = useState(true)
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([
    { rank: 1, name: 'আহমেদ হাসান', score: 3210, change: 2, batch: 'MBBS-2025', streak: 12, avatar: 'আ' },
    { rank: 2, name: 'ফাতিমা খান', score: 3085, change: -1, batch: 'MBBS-2025', streak: 8, avatar: 'ফ' },
    { rank: 3, name: 'করিম সাহেব', score: 2780, change: 3, batch: 'MBBS-2026', streak: 15, avatar: 'ক' },
    { rank: 4, name: 'সিদ্ধার্থ রায়', score: 2645, change: 0, batch: 'MBBS-2025', streak: 5, avatar: 'সি' },
    { rank: 5, name: 'রিনা ভট্টাচার্য', score: 2580, change: 5, batch: 'MBBS-2026', streak: 7, avatar: 'রি' },
    { rank: 6, name: 'জাহীদ হোসেন', score: 2450, change: -2, batch: 'MBBS-2027', streak: 3, avatar: 'জা' },
    { rank: 7, name: 'মীনা দাস', score: 2385, change: 1, batch: 'MBBS-2025', streak: 9, avatar: 'মী' },
    { rank: 8, name: 'তৌহিদ খান', score: 2320, change: 4, batch: 'MBBS-2026', streak: 6, avatar: 'তৌ' },
    { rank: 9, name: 'শামা খাতুন', score: 2245, change: -3, batch: 'MBBS-2025', streak: 2, avatar: 'শা' },
    { rank: 10, name: 'রহিম আহমেদ', score: 2180, change: 2, batch: 'MBBS-2027', streak: 4, avatar: 'রহ' }
  ])

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  const filters = ['সবাই', 'MBBS-2025', 'MBBS-2026', 'MBBS-2027']

  const filteredData = leaderboardData.filter(entry => 
    activeFilter === 'সবাই' || entry.batch === activeFilter
  )

  const topThree = [
    leaderboardData[0],
    leaderboardData[1],
    leaderboardData[2]
  ] as [LeaderboardEntry, LeaderboardEntry, LeaderboardEntry]

  const handleRefresh = async () => {
    setLoading(true)
    // Simulate API call
    setTimeout(() => {
      // Randomly shuffle some scores
      const newData = [...leaderboardData]
      for (let i = 0; i < newData.length; i++) {
        newData[i].score += Math.floor(Math.random() * 100) - 25
        newData[i].change = Math.floor(Math.random() * 5) - 2
      }
      setLeaderboardData(newData.sort((a, b) => b.score - a.score).map((d, i) => ({ ...d, rank: i + 1 })))
      setLoading(false)
    }, 800)
  }

  if (status === 'loading') {
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

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold text-sotota-text mb-2">লিডারবোর্ড</h1>
              <p className="text-sotota-muted">শীর্ষ পারফরমারদের দেখুন এবং আপনার র‍্যাঙ্ক খুঁজে বের করুন</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleRefresh}
              disabled={loading}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
                loading
                  ? 'bg-sotota-card2 text-sotota-muted cursor-not-allowed'
                  : 'bg-sotota-accent text-white hover:bg-sotota-accentl'
              }`}
            >
              <motion.span
                animate={{ rotate: loading ? 360 : 0 }}
                transition={{ duration: 1, repeat: loading ? Infinity : 0 }}
              >
                <FiRefreshCw size={18} />
              </motion.span>
              রিফ্রেশ করুন
            </motion.button>
          </div>
        </motion.div>

        {/* Podium */}
        <Podium topThree={topThree} />

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="mb-6">
            <h2 className="text-lg font-bold text-sotota-text mb-4">ফিল্টার</h2>
            <FilterPills 
              filters={filters}
              activeFilter={activeFilter}
              onFilterChange={setActiveFilter}
            />
          </div>
        </motion.div>

        {/* Live Toggle */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mb-6 flex items-center gap-3"
        >
          <motion.label 
            className="flex items-center gap-2 cursor-pointer"
            whileHover={{ scale: 1.05 }}
          >
            <input
              type="checkbox"
              checked={isLive}
              onChange={(e) => setIsLive(e.target.checked)}
              className="w-4 h-4 rounded border-sotota-border bg-sotota-card2 cursor-pointer accent-sotota-accent"
            />
            <span className="text-sotota-text font-medium">লাইভ আপডেট চালু করুন</span>
          </motion.label>
        </motion.div>

        {/* Live Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <LiveTable data={filteredData} isLive={isLive} />
        </motion.div>

        {/* Stats Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <div className="bg-sotota-card border border-sotota-border rounded-lg p-4 text-center">
            <p className="text-sotota-muted text-sm mb-1">সক্রিয় ব্যবহারকারী</p>
            <p className="text-3xl font-bold text-sotota-accent sotota-stat">२,४५०</p>
          </div>
          <div className="bg-sotota-card border border-sotota-border rounded-lg p-4 text-center">
            <p className="text-sotota-muted text-sm mb-1">শীর্ষ স্কোর</p>
            <p className="text-3xl font-bold text-sotota-accent sotota-stat">३,२१०</p>
          </div>
          <div className="bg-sotota-card border border-sotota-border rounded-lg p-4 text-center">
            <p className="text-sotota-muted text-sm mb-1">গড় স্কোর</p>
            <p className="text-3xl font-bold text-sotota-accent sotota-stat">२,२०८</p>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  )
}
