// app/courses/[id]/page.tsx

'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'

interface Course {
  id: string
  title: string
  description: string
  thumbnail?: string
  instructor: string
  category: string
  duration: number
  price: number
  createdAt: string
  updatedAt: string
}

interface CourseDetailPageProps {
  params: { id: string }
}

export default function CourseDetailPage({ params }: CourseDetailPageProps) {
  const courseId = params.id

  const [course, setCourse] = useState<Course | null>(null)
  const [loading, setLoading] = useState(true)
  const [enrolled, setEnrolled] = useState(false)

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true)
        const res = await fetch(`/api/courses/${courseId}`)

        if (!res.ok) {
          setCourse(null)
          return
        }

        const data = await res.json()
        setCourse(data)
      } catch (error) {
        console.error('Failed to fetch course:', error)
        setCourse(null)
      } finally {
        setLoading(false)
      }
    }

    if (courseId) {
      fetchCourse()
    }
  }, [courseId])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-teal-50 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full"
        />
      </div>
    )
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Course Not Found</h2>
          <Link href="/courses" className="text-emerald-600 font-semibold hover:underline">
            View All Courses
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-teal-50">
      {/* Hero Section with Course Image */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="relative h-96 bg-gradient-to-br from-emerald-600 via-teal-500 to-green-600 overflow-hidden"
      >
        {course.thumbnail && (
          <Image
            src={course.thumbnail}
            alt={course.title}
            fill
            className="object-cover opacity-40"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/90 via-teal-500/90 to-green-600/90"></div>

        {/* Back Button */}
        <div className="absolute top-6 left-6 z-10">
          <Link
            href="/courses"
            className="flex items-center gap-2 text-white hover:text-emerald-100 transition-colors font-semibold"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </Link>
        </div>

        {/* Title Section */}
        <div className="absolute inset-0 flex items-end">
          <div className="w-full px-6 sm:px-8 lg:px-12 pb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="inline-block bg-emerald-500 text-white px-4 py-2 rounded-full text-sm font-semibold mb-4">
                {course.category}
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4">
                {course.title}
              </h1>
              <p className="text-emerald-50 font-semibold text-lg">by {course.instructor}</p>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Content Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="lg:col-span-2"
          >
            {/* Description */}
            <section className="bg-white rounded-2xl p-8 shadow-lg border border-emerald-100 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <span className="w-1 h-8 bg-emerald-600 rounded-full"></span>
                About This Course
              </h2>
              <p className="text-gray-700 leading-relaxed text-lg whitespace-pre-wrap">
                {course.description}
              </p>
            </section>

            {/* Course Highlights */}
            <section className="bg-white rounded-2xl p-8 shadow-lg border border-emerald-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <span className="w-1 h-8 bg-green-600 rounded-full"></span>
                Course Highlights
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  {
                    icon: '⏱️',
                    label: 'Duration',
                    value: `${course.duration} hours`,
                  },
                  {
                    icon: '📚',
                    label: 'Category',
                    value: course.category,
                  },
                  {
                    icon: '👨‍🏫',
                    label: 'Instructor',
                    value: course.instructor,
                  },
                  {
                    icon: '🎓',
                    label: 'Certificate',
                    value: 'Included',
                  },
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ translateY: -4 }}
                    transition={{ duration: 0.3 }}
                    className="flex items-center gap-4 p-4 rounded-lg bg-emerald-50 border border-emerald-200"
                  >
                    <span className="text-3xl">{item.icon}</span>
                    <div>
                      <p className="text-sm text-gray-600 font-medium">{item.label}</p>
                      <p className="text-lg font-bold text-gray-900">{item.value}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>
          </motion.div>

          {/* Sidebar - Enrollment Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="h-fit"
          >
            <div className="bg-gradient-to-br from-emerald-500 via-teal-500 to-green-600 rounded-2xl p-8 text-white shadow-xl sticky top-20">
              {/* Price */}
              <div className="mb-6">
                <p className="text-emerald-100 text-sm font-semibold mb-2">PRICE</p>
                <h3 className="text-4xl font-black">
                  ${course.price.toFixed(2)}
                </h3>
              </div>

              {/* Enrollment Button */}
              <button
                onClick={() => setEnrolled(!enrolled)}
                className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 mb-4 ${
                  enrolled
                    ? 'bg-white text-emerald-600 hover:bg-emerald-50'
                    : 'bg-white text-emerald-600 hover:bg-emerald-50'
                }`}
              >
                {enrolled ? '✓ Enrolled' : 'Enroll Now'}
              </button>

              {/* Features */}
              <div className="space-y-3 border-t border-emerald-400 pt-6">
                {[
                  'Lifetime access',
                  'Downloadable resources',
                  'Community support',
                  'Certificate of completion',
                ].map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-emerald-200" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="font-medium">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
