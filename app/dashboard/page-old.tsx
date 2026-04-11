'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { FiBook, FiCheckCircle, FiClock, FiTrendingUp, FiZap } from 'react-icons/fi'

interface DashboardData {
  user: {
    id: string
    name: string
    email: string
  }
  stats: {
    totalCourses: number
    completedCourses: number
    inProgressCourses: number
    totalHours: number
    completionRate: number
    streak: number
  }
  enrolledCourses: Array<{
    id: string
    title: string
    description: string
    instructor: string
    thumbnail?: string
    category: string
    duration: number
    progress: number
  }>
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
      return
    }

    if (status === 'authenticated') {
      const fetchDashboard = async () => {
        try {
          setLoading(true)
          const res = await fetch('/api/dashboard')
          if (!res.ok) throw new Error('Failed to fetch dashboard')
          const dashboardData = await res.json()
          setData(dashboardData)
        } catch (error) {
          console.error('Dashboard error:', error)
        } finally {
          setLoading(false)
        }
      }

      fetchDashboard()
    }
  }, [status, router])

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full"
        />
      </div>
    )
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-emerald-300 mb-4">Failed to Load Dashboard</h2>
          <Link href="/courses" className="text-teal-400 font-semibold hover:text-teal-300 transition">
            Go to Courses
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h1 className="text-5xl font-black bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent mb-2">
            Welcome back, {data.user.name}!
          </h1>
          <p className="text-emerald-200 text-lg">
            Keep learning and growing. You're doing great!
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
        >
          {/* Total Courses */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-emerald-500 border-opacity-30 p-6 hover:border-opacity-60 transition">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-emerald-200 font-semibold">Enrolled Courses</h3>
              <FiBook className="text-emerald-400 text-2xl" />
            </div>
            <p className="text-4xl font-black text-emerald-300">{data.stats.totalCourses}</p>
            <p className="text-emerald-300 text-sm mt-2">{data.stats.inProgressCourses} in progress</p>
          </div>

          {/* Completed */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-teal-500 border-opacity-30 p-6 hover:border-opacity-60 transition">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-emerald-200 font-semibold">Completed</h3>
              <FiCheckCircle className="text-teal-400 text-2xl" />
            </div>
            <p className="text-4xl font-black text-teal-300">{data.stats.completedCourses}</p>
            <p className="text-teal-300 text-sm mt-2">{data.stats.completionRate}% overall</p>
          </div>

          {/* Total Hours */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-cyan-500 border-opacity-30 p-6 hover:border-opacity-60 transition">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-emerald-200 font-semibold">Total Hours</h3>
              <FiClock className="text-cyan-400 text-2xl" />
            </div>
            <p className="text-4xl font-black text-cyan-300">{data.stats.totalHours}h</p>
            <p className="text-cyan-300 text-sm mt-2">Learning time invested</p>
          </div>

          {/* Streak */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-orange-500 border-opacity-30 p-6 hover:border-opacity-60 transition">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-emerald-200 font-semibold">Learn Streak</h3>
              <FiZap className="text-orange-400 text-2xl" />
            </div>
            <p className="text-4xl font-black text-orange-300">{data.stats.streak}</p>
            <p className="text-orange-300 text-sm mt-2">Days in a row</p>
          </div>
        </motion.div>

        {/* Continue Learning Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-black text-emerald-300 mb-6">Continue Learning</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.enrolledCourses.slice(0, 3).map((course, index) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl border border-emerald-500 border-opacity-30 overflow-hidden hover:border-opacity-60 transition group cursor-pointer"
              >
                <Link href={`/courses/${course.id}`} className="block">
                  {/* Progress Bar */}
                  <div className="h-1 bg-slate-700">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-300"
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>

                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-lg font-bold text-emerald-300 group-hover:text-teal-300 transition line-clamp-2">
                          {course.title}
                        </h3>
                        <p className="text-emerald-200 text-sm mt-1">{course.instructor}</p>
                      </div>
                      <span className="text-xs font-semibold text-emerald-400 bg-emerald-900 bg-opacity-50 px-3 py-1 rounded-full whitespace-nowrap">
                        {course.progress}%
                      </span>
                    </div>

                    <p className="text-emerald-200 text-sm line-clamp-2 mb-4">{course.description}</p>

                    <div className="flex items-center justify-between text-xs text-emerald-300">
                      <span>{course.category}</span>
                      <span>{course.duration}h</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* All Enrolled Courses */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-black text-emerald-300">All Enrolled Courses</h2>
            <Link
              href="/courses"
              className="text-teal-400 hover:text-teal-300 font-semibold transition flex items-center gap-2"
            >
              View all <FiTrendingUp />
            </Link>
          </div>

          <div className="space-y-4">
            {data.enrolledCourses.map((course) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-lg border border-emerald-500 border-opacity-20 p-6 hover:border-opacity-50 transition group cursor-pointer"
              >
                <Link href={`/courses/${course.id}`} className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-emerald-300 group-hover:text-teal-300 transition mb-1">
                      {course.title}
                    </h3>
                    <p className="text-emerald-200 text-sm">{course.instructor}</p>
                  </div>

                  <div className="flex items-center gap-8">
                    {/* Progress */}
                    <div className="text-right">
                      <div className="w-48 h-2 bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-emerald-500 to-teal-500"
                          style={{ width: `${course.progress}%` }}
                        />
                      </div>
                      <p className="text-emerald-300 text-xs mt-2 font-semibold">{course.progress}% complete</p>
                    </div>

                    <span className="text-emerald-400 font-bold text-lg">{course.category}</span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
