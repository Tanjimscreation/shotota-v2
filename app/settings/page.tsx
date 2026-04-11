'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FiArrowLeft, FiUser, FiBell, FiLock, FiLogOut, FiSave } from 'react-icons/fi'
import { DashboardLayout } from '@/components/DashboardLayout'

export default function SettingsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'security'>('profile')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    batch: '',
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
    if (session?.user) {
      setFormData({
        name: session.user.name || '',
        email: session.user.email || '',
        phone: '',
        batch: 'MBBS-2025',
      })
    }
  }, [session, status, router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setSuccess('')

    try {
      // Simulate API call - in production, this would save to database
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setSuccess('প্রোফাইল সফলভাবে আপডেট হয়েছে')
      setTimeout(() => setSuccess(''), 3000)
    } catch (error) {
      console.error('Error saving profile:', error)
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading') {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="w-12 h-12 border-4 border-sotota-accent border-t-transparent rounded-full animate-spin" />
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/dashboard" className="flex items-center gap-2 text-sotota-accent hover:text-sotota-accentl mb-4">
            <FiArrowLeft className="w-4 h-4" />
            ফিরুন
          </Link>
          <h1 className="text-4xl font-bold text-sotota-text">সেটিংস</h1>
          <p className="text-sotota-muted mt-2">আপনার অ্যাকাউন্ট এবং পছন্দগুলি পরিচালনা করুন</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-sotota-card border border-sotota-border rounded-lg p-4 space-y-2">
              {['profile', 'notifications', 'security'].map((tab) => {
                const icons: Record<string, any> = {
                  profile: FiUser,
                  notifications: FiBell,
                  security: FiLock,
                }
                const Icon = icons[tab]
                const labels: Record<string, string> = {
                  profile: 'প্রোফাইল',
                  notifications: 'বিজ্ঞপ্তি',
                  security: 'নিরাপত্তা',
                }

                return (
                  <motion.button
                    key={tab}
                    onClick={() => setActiveTab(tab as any)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition ${
                      activeTab === tab ? 'bg-sotota-accent text-white' : 'text-sotota-muted hover:bg-sotota-card2'
                    }`}
                    whileHover={{ x: 5 }}
                  >
                    <Icon className="w-4 h-4" />
                    {labels[tab]}
                  </motion.button>
                )
              })}
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === 'profile' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-sotota-card border border-sotota-border rounded-lg p-8">
                <h2 className="text-2xl font-bold text-sotota-text mb-6">আপনার প্রোফাইল</h2>

                <form onSubmit={handleSaveProfile} className="space-y-6">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-sotota-text mb-2">পূর্ণ নাম</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg bg-sotota-card2 border border-sotota-border text-sotota-text placeholder-sotota-muted focus:border-sotota-accent outline-none transition"
                      placeholder="আপনার নাম"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-sotota-text mb-2">ইমেইল</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg bg-sotota-card2 border border-sotota-border text-sotota-text placeholder-sotota-muted focus:border-sotota-accent outline-none transition"
                      placeholder="আপনার ইমেইল"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium text-sotota-text mb-2">ফোন নম্বর</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg bg-sotota-card2 border border-sotota-border text-sotota-text placeholder-sotota-muted focus:border-sotota-accent outline-none transition"
                      placeholder="০১৭××××××××"
                    />
                  </div>

                  {/* Batch */}
                  <div>
                    <label className="block text-sm font-medium text-sotota-text mb-2">ব্যাচ</label>
                    <select
                      name="batch"
                      value={formData.batch}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg bg-sotota-card2 border border-sotota-border text-sotota-text focus:border-sotota-accent outline-none transition"
                    >
                      <option>MBBS-2025</option>
                      <option>MBBS-2026</option>
                      <option>MBBS-2027</option>
                    </select>
                  </div>

                  {/* Success Message */}
                  {success && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="bg-sotota-accent/20 border border-sotota-accent text-sotota-accent rounded-lg p-4"
                    >
                      ✓ {success}
                    </motion.div>
                  )}

                  {/* Save Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-sotota-accent to-sotota-accentd text-white font-bold py-3 rounded-lg transition disabled:opacity-50"
                  >
                    <FiSave className="w-4 h-4" />
                    {loading ? 'সংরক্ষণ করছে...' : 'পরিবর্তন সংরক্ষণ করুন'}
                  </motion.button>
                </form>
              </motion.div>
            )}

            {activeTab === 'notifications' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-sotota-card border border-sotota-border rounded-lg p-8">
                <h2 className="text-2xl font-bold text-sotota-text mb-6">বিজ্ঞপ্তি সেটিংস</h2>

                <div className="space-y-4">
                  {[
                    { label: 'পরীক্ষার অনুস্মারক', desc: 'নতুন পরীক্ষা শুরু হওয়ার বিজ্ঞপ্তি পান' },
                    { label: 'স্কোর আপডেট', desc: 'আপনার পরীক্ষার ফলাফল সম্পর্কে বিজ্ঞপ্তি' },
                    { label: 'কোর্স আপডেট', desc: 'নতুন কোর্স এবং উপকরণ সম্পর্কে বিজ্ঞপ্তি' },
                  ].map((item, idx) => (
                    <label key={idx} className="flex items-center gap-4 p-4 rounded-lg bg-sotota-card2 cursor-pointer hover:bg-sotota-surface transition">
                      <input type="checkbox" defaultChecked className="w-5 h-5 accent-sotota-accent" />
                      <div className="flex-1">
                        <p className="font-medium text-sotota-text">{item.label}</p>
                        <p className="text-sm text-sotota-muted">{item.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'security' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-sotota-card border border-sotota-border rounded-lg p-8">
                <h2 className="text-2xl font-bold text-sotota-text mb-6">নিরাপত্তা এবং গোপনীয়তা</h2>

                <div className="space-y-6">
                  {/* Change Password */}
                  <div className="pb-6 border-b border-sotota-border">
                    <h3 className="font-bold text-sotota-text mb-4">পাসওয়ার্ড পরিবর্তন করুন</h3>
                    <div className="space-y-4">
                      <input
                        type="password"
                        placeholder="বর্তমান পাসওয়ার্ড"
                        className="w-full px-4 py-3 rounded-lg bg-sotota-card2 border border-sotota-border text-sotota-text placeholder-sotota-muted focus:border-sotota-accent outline-none"
                      />
                      <input
                        type="password"
                        placeholder="নতুন পাসওয়ার্ড"
                        className="w-full px-4 py-3 rounded-lg bg-sotota-card2 border border-sotota-border text-sotota-text placeholder-sotota-muted focus:border-sotota-accent outline-none"
                      />
                      <input
                        type="password"
                        placeholder="নতুন পাসওয়ার্ড নিশ্চিত করুন"
                        className="w-full px-4 py-3 rounded-lg bg-sotota-card2 border border-sotota-border text-sotota-text placeholder-sotota-muted focus:border-sotota-accent outline-none"
                      />
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        className="w-full bg-sotota-accent text-white font-bold py-3 rounded-lg transition"
                      >
                        পাসওয়ার্ড আপডেট করুন
                      </motion.button>
                    </div>
                  </div>

                  {/* Logout */}
                  <div>
                    <h3 className="font-bold text-sotota-text mb-4">সেশন</h3>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => signOut({ callbackUrl: '/login' })}
                      className="w-full flex items-center justify-center gap-2 bg-sotota-error text-white font-bold py-3 rounded-lg transition"
                    >
                      <FiLogOut className="w-4 h-4" />
                      লগ আউট করুন
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
