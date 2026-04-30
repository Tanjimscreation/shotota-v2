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
          <h1 className="text-4xl font-bold text-sotota-dark mb-2">অ্যাডমিন প্যানেল</h1>
          <p className="text-gray-600">স্বাগতম, {session?.user?.name || 'অ্যাডমিন'}!</p>
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
                  <div className={`${module.color} rounded-xl p-6 cursor-pointer transition-all duration-200 border border-gray-200 h-full`}>
                    <div className={`${module.textColor} text-4xl mb-4`}>
                      <Icon />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">{module.title}</h3>
                    <p className="text-gray-600 text-sm mb-4">{module.description}</p>
                    <div className="flex items-center gap-2 text-sotota-dark font-semibold">
                      যান <FiArrowRight className="text-lg" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">সংক্ষিপ্ত পরিসংখ্যান</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-sotota-dark mb-2">0</div>
              <p className="text-gray-600">সক্রিয় পরীক্ষা</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-sotota-dark mb-2">0</div>
              <p className="text-gray-600">মোট শিক্ষার্থী</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-sotota-dark mb-2">0</div>
              <p className="text-gray-600">সম্পন্ন পরীক্ষা</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-sotota-dark mb-2">0</div>
              <p className="text-gray-600">গড় স্কোর</p>
            </div>
          </div>
        </div>

        {/* Logout */}
        <div className="flex justify-end">
          <button
            onClick={() => signOut({ redirect: true, callbackUrl: '/login' })}
            className="flex items-center gap-2 px-6 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-semibold"
          >
            <FiLogOut /> লগ আউট করুন
          </button>
        </div>
      </div>
    </DashboardLayout>
  )
}
