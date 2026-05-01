'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { motion } from 'framer-motion'
import { FiBook, FiBarChart2, FiSettings, FiLogOut, FiArrowRight } from 'react-icons/fi'
import Link from 'next/link'
import { signOut } from 'next-auth/react'
import { DashboardLayout } from '@/components/DashboardLayout'

export default function AdminDashboard() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
      return
    }

    if (status === 'authenticated' && session?.user?.role !== 'ADMIN') {
      router.push('/dashboard')
      return
    }

    setLoading(false)
  }, [status, session, router])

  const adminModules = [
    {
      icon: FiBook,
      title: 'প্রশ্ন পত্র ব্যবস্থাপনা',
      description: 'প্রশ্ন পত্র আপলোড করুন এবং পরীক্ষা তৈরি করুন',
      href: '/admin/exams',
      color: 'bg-blue-50 hover:bg-blue-100',
      textColor: 'text-blue-600'
    },
    {
      icon: FiBarChart2,
      title: 'পরীক্ষা নিরীক্ষণ',
      description: 'সক্রিয় পরীক্ষা এবং শিক্ষার্থী অগ্রগতি দেখুন',
      href: '/admin/monitor',
      color: 'bg-green-50 hover:bg-green-100',
      textColor: 'text-green-600'
    },
    {
      icon: FiSettings,
      title: 'সেটিংস',
      description: 'সিস্টেম কনফিগারেশন এবং পছন্দ পরিচালনা করুন',
      href: '/admin/settings',
      color: 'bg-purple-50 hover:bg-purple-100',
      textColor: 'text-purple-600'
    }
  ]

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sotota-dark"></div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">অ্যাডমিন প্যানেল</h1>
          <p className="text-gray-700 font-semibold text-lg">স্বাগতম, {session?.user?.name || 'অ্যাডমিন'}!</p>
        </div>

        {/* Admin Modules */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {adminModules.map((module, index) => {
            const Icon = module.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link href={module.href}>
                  <div className={`${module.color} rounded-xl p-6 cursor-pointer transition-all duration-200 border-2 border-gray-300 h-full shadow-md hover:shadow-lg`}>
                    <div className={`${module.textColor} text-4xl mb-4`}>
                      <Icon />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{module.title}</h3>
                    <p className="text-gray-700 text-sm mb-4 font-medium">{module.description}</p>
                    <div className="flex items-center gap-2 text-gray-900 font-bold">
                      যান <FiArrowRight className="text-lg" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-xl shadow-xl p-8 mb-8 border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">সংক্ষিপ্ত পরিসংখ্যান</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center bg-blue-50 rounded-lg p-4">
              <div className="text-4xl font-bold text-blue-700 mb-2">0</div>
              <p className="text-gray-800 font-semibold">সক্রিয় পরীক্ষা</p>
            </div>
            <div className="text-center bg-green-50 rounded-lg p-4">
              <div className="text-4xl font-bold text-green-700 mb-2">0</div>
              <p className="text-gray-800 font-semibold">মোট শিক্ষার্থী</p>
            </div>
            <div className="text-center bg-purple-50 rounded-lg p-4">
              <div className="text-4xl font-bold text-purple-700 mb-2">0</div>
              <p className="text-gray-800 font-semibold">সম্পন্ন পরীক্ষা</p>
            </div>
            <div className="text-center bg-orange-50 rounded-lg p-4">
              <div className="text-4xl font-bold text-orange-700 mb-2">0</div>
              <p className="text-gray-800 font-semibold">গড় স্কোর</p>
            </div>
          </div>
        </div>

        {/* Logout */}
        <div className="flex justify-end">
          <button
            onClick={() => signOut({ redirect: true, callbackUrl: '/login' })}
            className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-bold shadow-md"
          >
            <FiLogOut /> লগ আউট করুন
          </button>
        </div>
      </div>
    </DashboardLayout>
  )
}
