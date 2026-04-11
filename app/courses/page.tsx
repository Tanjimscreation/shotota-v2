'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
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

const mockCourses: Course[] = [
  {
    id: '1',
    title: 'সাধারণ জীববিজ্ঞান - ১',
    description: 'কোশ, টিস্যু এবং অঙ্গ সম্পর্কে বিস্তারিত অধ্যয়ন',
    thumbnail: '🧬',
    instructor: 'ডা. রহিম',
    progress: 65,
    enrolled: true,
    locked: false,
    category: 'জীববিজ্ঞান',
    lessons: 24
  },
  {
    id: '2',
    title: 'অর্গানিক রসায়ন মৌলিক',
    description: 'কার্বনিক যৌগ এবং তাদের বৈশিষ্ট্য',
    thumbnail: '⚗️',
    instructor: 'প্রফেসর নাজমুল',
    progress: 0,
    enrolled: false,
    locked: false,
    category: 'রসায়ন',
    lessons: 32
  },
  {
    id: '3',
    title: 'পদার্থবিজ্ঞানের ভিত্তি',
    description: 'গতিবিদ্যা, তরঙ্গ এবং শক্তি নীতি',
    thumbnail: '⚡',
    instructor: 'মিস সিদ্ধান্তা',
    progress: 0,
    enrolled: false,
    locked: false,
    category: 'পদার্থবিজ্ঞান',
    lessons: 28
  },
  {
    id: '4',
    title: 'মানব শারীরবিজ্ঞান উন্নত',
    description: 'শরীরের সকল সিস্টেমের গভীর বিশ্লেষণ',
    thumbnail: '❤️',
    instructor: 'ডা. করিম',
    progress: 45,
    enrolled: true,
    locked: false,
    category: 'জীববিজ্ঞান',
    lessons: 40
  },
  {
    id: '5',
    title: 'পরীক্ষা শিল্প - মেডিকেল',
    description: 'ল্যাব পরীক্ষা এবং নির্ণয়ের পদ্ধতি',
    thumbnail: '🔬',
    instructor: 'প্রফেসর ইমাম',
    progress: 0,
    enrolled: false,
    locked: true,
    category: 'বিশেষ',
    lessons: 20
  },
  {
    id: '6',
    title: 'ব্যবহারিক প্রশিক্ষণ প্যাকেজ',
    description: 'রোগ নির্ণয় এবং চিকিৎসা পরিকল্পনা',
    thumbnail: '📋',
    instructor: 'ডা. আনোয়ার',
    progress: 0,
    enrolled: false,
    locked: true,
    category: 'ক্লিনিক্যাল',
    lessons: 36
  }
]

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>(mockCourses)
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

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
    // Navigate to course content (Phase 5)
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

        {/* Empty State */}
        {courses.length === 0 && (
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
