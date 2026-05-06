'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { DashboardLayout } from '@/components/DashboardLayout'
import CourseCard from '@/components/courses/CourseCard'
import EnrollmentModal from '@/components/courses/EnrollmentModal'

interface Course {
  id: string
  title: string
  description: string
  thumbnail: string
  instructor: string
  progress: number
  enrolled: boolean
  locked: boolean
  category: string
  lessons: number
}

export default function CoursesPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  useEffect(() => {
    if (status === 'authenticated') {
      fetchCourses()
    }
  }, [status])

  const fetchCourses = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/courses')
      if (!response.ok) throw new Error('Failed to fetch courses')
      const data = await response.json()
      setCourses(data.courses || data)
      setError(null)
    } catch (err) {
      console.error('Courses fetch error:', err)
      setError('Failed to load courses')
      // Fallback to empty array
      setCourses([])
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

  const handleEnrollClick = (course: Course) => {
    setSelectedCourse(course)
    setIsModalOpen(true)
  }

  const handleEnroll = () => {
    if (!selectedCourse) return
    setCourses(
      courses.map(c =>
        c.id === selectedCourse.id
          ? { ...c, enrolled: true, progress: 0 }
          : c
      )
    )
  }

  const handleStartCourse = (course: Course) => {
    console.log('Starting course:', course.id)
  }

  const stats = {
    total: courses.length,
    enrolled: courses.filter(c => c.enrolled).length,
    completed: courses.filter(c => c.enrolled && c.progress === 100).length
  }

  return (
    <DashboardLayout>
      <div className="p-6 md:p-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-sotota-text mb-2">আমার কোর্স</h1>
          <p className="text-sotota-muted">আপনার শিক্ষা যাত্রার জন্য বিশেষভাবে তৈরি কোর্স</p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {[
            { label: 'মোট কোর্স', value: stats.total, icon: '📚' },
            { label: 'নথিভুক্ত', value: stats.enrolled, icon: '✅' },
            { label: 'সম্পন্ন', value: stats.completed, icon: '🏆' }
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-sotota-card border border-sotota-border rounded-lg p-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sotota-muted text-sm">{stat.label}</p>
                  <p className="sotota-stat text-3xl font-bold text-sotota-text">{stat.value}</p>
                </div>
                <span className="text-3xl">{stat.icon}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Courses Grid */}
        {courses.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {courses.map((course, index) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <CourseCard
                  {...course}
                  onEnroll={() => handleEnrollClick(course)}
                  onStart={() => handleStartCourse(course)}
                />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <p className="text-sotota-muted text-lg">কোন কোর্স পাওয়া যায়নি</p>
          </motion.div>
        )}
      </div>

      {/* Enrollment Modal */}
      <EnrollmentModal
        isOpen={isModalOpen}
        courseTitle={selectedCourse?.title || ''}
        onEnroll={handleEnroll}
        onClose={() => setIsModalOpen(false)}
      />
    </DashboardLayout>
  )
}
