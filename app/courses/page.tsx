// app/courses/page.tsx

'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { CourseCard } from '@/components/courses/CourseCard'

interface Course {
  id: string
  title: string
  description: string
  thumbnail?: string
  instructor: string
  category: string
  duration: number
  price: number
}

interface PaginationInfo {
  total: number
  page: number
  limit: number
  pages: number
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [pagination, setPagination] = useState<PaginationInfo | null>(null)
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true)
        const params = new URLSearchParams({
          page: currentPage.toString(),
          limit: '12',
          ...(search && { search }),
        })

        const res = await fetch(`/api/courses?${params}`)
        const data = await res.json()

        setCourses(data.courses)
        setPagination(data.pagination)
      } catch (error) {
        console.error('Failed to fetch courses:', error)
      } finally {
        setLoading(false)
      }
    }

    const timer = setTimeout(fetchCourses, 500)
    return () => clearTimeout(timer)
  }, [search, currentPage])

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      {/* Header Section */}
      <div className="bg-gradient-to-br from-emerald-700 via-teal-600 to-cyan-700 text-white py-20 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-teal-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-6xl font-black mb-4 tracking-tight">
              Explore Courses
            </h1>
            <p className="text-xl text-emerald-50 font-medium">
              Master your skills with world-class education
            </p>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12"
        >
          <div className="relative max-w-md">
            <input
              type="text"
              placeholder="Search courses..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setCurrentPage(1)
              }}
              className="w-full px-6 py-3 bg-white border-2 border-emerald-200 rounded-xl focus:outline-none focus:border-emerald-500 transition-colors text-gray-900 placeholder-gray-500 font-medium"
            />
            <svg
              className="absolute right-4 top-3.5 w-5 h-5 text-emerald-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </motion.div>

        {/* Courses Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="h-96 bg-gradient-to-br from-gray-200 to-gray-300 rounded-2xl"
              />
            ))}
          </div>
        ) : courses.length > 0 ? (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12"
            >
              {courses.map((course, index) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <CourseCard {...course} />
                </motion.div>
              ))}
            </motion.div>

            {/* Pagination */}
            {pagination && pagination.pages > 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="flex justify-center items-center gap-2"
              >
                {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                      currentPage === page
                        ? 'bg-emerald-600 text-white shadow-lg'
                        : 'bg-white text-gray-700 hover:bg-emerald-50 border border-emerald-200'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </motion.div>
            )}
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center py-16"
          >
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No Courses Found</h3>
            <p className="text-gray-600">No courses match your search. Try different keywords.</p>
          </motion.div>
        )}
      </div>
    </div>
  )
}
