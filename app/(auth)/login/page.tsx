'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { FiShield, FiBook, FiArrowRight } from 'react-icons/fi'
import Link from 'next/link'
import LoginForm from '@/components/auth/LoginForm'

export default function LoginPage() {
  const [selectedRole, setSelectedRole] = useState<'admin' | 'student' | null>(null)

  const roles = [
    {
      id: 'admin',
      title: 'অ্যাডমিন লগইন',
      description: 'প্রশ্ন পত্র আপলোড করুন এবং পরীক্ষা নিরীক্ষণ করুন',
      icon: FiShield,
      color: 'bg-red-50 hover:bg-red-100 border-red-200',
      textColor: 'text-red-600',
    },
    {
      id: 'student',
      title: 'শিক্ষার্থী লগইন',
      description: 'পরীক্ষা দিন এবং আপনার ফলাফল দেখুন',
      icon: FiBook,
      color: 'bg-blue-50 hover:bg-blue-100 border-blue-200',
      textColor: 'text-blue-600',
    }
  ]

  if (selectedRole) {
    return <LoginForm role={selectedRole} onBack={() => setSelectedRole(null)} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sotota-dark via-sotota-light to-sotota-dark flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-4xl"
      >
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">সোতোতা প্ল্যাটফর্ম</h1>
          <p className="text-gray-300 text-lg">আপনার ভূমিকা নির্বাচন করুন</p>
        </div>

        {/* Role Selection Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {roles.map((role) => {
            const Icon = role.icon
            return (
              <motion.button
                key={role.id}
                onClick={() => setSelectedRole(role.id as 'admin' | 'student')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`${role.color} border-2 rounded-2xl p-8 text-left transition-all duration-300`}
              >
                <div className={`${role.textColor} text-5xl mb-4`}>
                  <Icon />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">{role.title}</h2>
                <p className="text-gray-600 mb-4">{role.description}</p>
                <div className="flex items-center justify-end">
                  <FiArrowRight className={`${role.textColor} text-xl`} />
                </div>
              </motion.button>
            )
          })}
        </div>

        {/* Info Box */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 text-center"
        >
          <p className="text-gray-200">
            নতুন ব্যবহারকারী?{' '}
            <Link href="/signup" className="text-sotota-light font-semibold hover:underline">
              এখানে সাইন আপ করুন
            </Link>
          </p>
        </motion.div>
      </motion.div>
    </div>
  )
}
