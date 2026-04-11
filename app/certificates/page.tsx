'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { FiAward, FiTrendingUp } from 'react-icons/fi'
import { DashboardLayout } from '@/components/DashboardLayout'

interface LeaderboardEntry {
  id: string
  userId: string
  userName: string
  batch: string
  totalScore: number
  examCount: number
  avgScore: number
  rank: number
  streak: number
}

export default function CertificatesPage() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedBatch, setSelectedBatch] = useState<string | null>(null)
  const [batches, setBatches] = useState<string[]>([])

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch('/api/leaderboard')
        if (!response.ok) throw new Error('Failed to fetch leaderboard')

        const data = await response.json()
        setEntries(data.entries)

        // Extract unique batches
        const uniqueBatches = [...new Set(data.entries.map((e: LeaderboardEntry) => e.batch))] as string[]
        setBatches(uniqueBatches)
        if (uniqueBatches.length > 0) setSelectedBatch(uniqueBatches[0] as string)
      } catch (err) {
        console.error('Error fetching leaderboard:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchLeaderboard()
  }, [])

  const filteredEntries = selectedBatch ? entries.filter((e) => e.batch === selectedBatch) : entries

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-sotota-bg">
      {/* Header */}
      <div className="bg-gradient-to-r from-sotota-accent to-sotota-accentd py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-4">
            <FiAward className="w-12 h-12 text-white" />
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">আমার শংসাপত্র</h1>
              <p className="text-white/80">আপনার অর্জন এবং উপলব্ধি প্রদর্শন করুন</p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="py-12 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Batch Filter */}
          {batches.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-sotota-text mb-4">ব্যাচ নির্বাচন করুন</h3>
              <div className="flex flex-wrap gap-3">
                {batches.map((batch) => (
                  <motion.button
                    key={batch}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedBatch(batch)}
                    className={`px-6 py-3 rounded-lg font-semibold transition ${
                      selectedBatch === batch
                        ? 'bg-sotota-accent text-white'
                        : 'bg-sotota-card border border-sotota-border text-sotota-text hover:border-sotota-accent'
                    }`}
                  >
                    {batch}
                  </motion.button>
                ))}
              </div>
            </div>
          )}

          {/* Top 3 Podium */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-sotota-text mb-6">শীর্ষ পারফরমার</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {filteredEntries.slice(0, 3).map((entry, index) => {
                const medals = ['🥇', '🥈', '🥉']
                const podiumHeights = ['h-48', 'h-40', 'h-32']

                return (
                  <motion.div
                    key={entry.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`${podiumHeights[index]} bg-gradient-to-b from-sotota-card to-sotota-card2 border border-sotota-border rounded-lg p-6 flex flex-col justify-end relative`}
                  >
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-5xl">{medals[index]}</div>
                    <h3 className="text-xl font-bold text-sotota-text mb-1">{entry.userName}</h3>
                    <p className="text-sm text-sotota-muted mb-3">{entry.batch}</p>
                    <div className="flex items-center gap-2 text-sotota-accent font-bold text-lg">
                      <FiTrendingUp className="w-5 h-5" />
                      স্কোর: {entry.totalScore}
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>

          {/* Full Leaderboard Table */}
          <div>
            <h2 className="text-2xl font-bold text-sotota-text mb-6">সম্পূর্ণ লিডারবোর্ড</h2>
            <div className="bg-sotota-card border border-sotota-border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-sotota-card2 border-b border-sotota-border">
                    <th className="px-6 py-4 text-left text-sotota-muted font-semibold">#</th>
                    <th className="px-6 py-4 text-left text-sotota-muted font-semibold">নাম</th>
                    <th className="px-6 py-4 text-left text-sotota-muted font-semibold">ব্যাচ</th>
                    <th className="px-6 py-4 text-center text-sotota-muted font-semibold">মোট স্কোর</th>
                    <th className="px-6 py-4 text-center text-sotota-muted font-semibold">পরীক্ষা সংখ্যা</th>
                    <th className="px-6 py-4 text-center text-sotota-muted font-semibold">গড় স্কোর</th>
                    <th className="px-6 py-4 text-center text-sotota-muted font-semibold">স্ট্রীক</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-8 text-center text-sotota-muted">
                        লোড হচ্ছে...
                      </td>
                    </tr>
                  ) : filteredEntries.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-8 text-center text-sotota-muted">
                        কোনো তথ্য পাওয়া যায়নি
                      </td>
                    </tr>
                  ) : (
                    filteredEntries.map((entry, index) => (
                      <motion.tr
                        key={entry.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.05 }}
                        className="border-b border-sotota-border hover:bg-sotota-card2 transition"
                      >
                        <td className="px-6 py-4">
                          <span className="inline-block w-8 h-8 rounded-full bg-sotota-accent text-white flex items-center justify-center font-bold text-sm">
                            {entry.rank}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-semibold text-sotota-text">{entry.userName}</td>
                        <td className="px-6 py-4 text-sotota-muted">{entry.batch}</td>
                        <td className="px-6 py-4 text-center font-bold text-sotota-accent">{entry.totalScore.toFixed(1)}</td>
                        <td className="px-6 py-4 text-center text-sotota-text">{entry.examCount}</td>
                        <td className="px-6 py-4 text-center text-sotota-text">{entry.avgScore.toFixed(2)}</td>
                        <td className="px-6 py-4 text-center">
                          <span className="inline-block px-3 py-1 rounded-full bg-sotota-accent/20 text-sotota-accent font-semibold">
                            🔥 {entry.streak}
                          </span>
                        </td>
                      </motion.tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
    </DashboardLayout>
  )
}
