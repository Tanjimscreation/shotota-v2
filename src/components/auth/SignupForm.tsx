'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { FiMail, FiLock, FiUser, FiPhone, FiEye, FiEyeOff } from 'react-icons/fi'
import { SototalLogo } from '@/components/SototalLogo'
import QuoteRotator from '@/components/auth/QuoteRotator'
import StatsBar from '@/components/auth/StatsBar'
import Link from 'next/link'

const BATCHES = [
  { value: 'MBBS-2025', label: 'MBBS ২०२५' },
  { value: 'MBBS-2026', label: 'MBBS २०२६' },
  { value: 'MBBS-2027', label: 'MBBS २०२७' },
  { value: 'MBBS-2028', label: 'MBBS २०२८' }
]

export default function SignupForm() {
  const router = useRouter()
  const submitTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [batch, setBatch] = useState('MBBS-2025')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [role, setRole] = useState<'STUDENT' | 'ADMIN'>('STUDENT')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Prevent multiple submissions
    if (isSubmitting || loading) {
      return
    }

    // Clear any pending timeouts
    if (submitTimeoutRef.current) {
      clearTimeout(submitTimeoutRef.current)
    }

    setError('')
    setIsSubmitting(true)
    setLoading(true)

    if (!fullName.trim()) {
      setError('পুরো নাম প্রয়োজন')
      setLoading(false)
      setIsSubmitting(false)
      return
    }
    if (!phone.trim()) {
      setError('ফোন নম্বর প্রয়োজন')
      setLoading(false)
      setIsSubmitting(false)
      return
    }
    if (!email.trim()) {
      setError('ইমেইল প্রয়োজন')
      setLoading(false)
      setIsSubmitting(false)
      return
    }
    if (password !== confirmPassword) {
      setError('পাসওয়ার্ড মিলছে না')
      setLoading(false)
      setIsSubmitting(false)
      return
    }
    if (password.length < 6) {
      setError('পাসওয়ার্ড কমপক্ষে ৬ অক্ষর দীর্ঘ হতে হবে')
      setLoading(false)
      setIsSubmitting(false)
      return
    }

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: fullName, phone, email, batch, password, role })
      })

      const result = await response.json()

      if (!response.ok) {
        setError(result.error || 'অ্যাকাউন্ট তৈরি করতে ব্যর্থ')
        setLoading(false)
        setIsSubmitting(false)
        return
      }

      // Add delay to ensure signup is complete before redirect
      submitTimeoutRef.current = setTimeout(() => {
        router.push('/login?success=true')
        setLoading(false)
        setIsSubmitting(false)
      }, 500)
    } catch {
      setError('কিছু সমস्যা হয়েছে। পুনরায় চেষ্টা করুন।')
      setLoading(false)
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-sotota-bg flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid md:grid-cols-2 gap-0 rounded-2xl overflow-hidden shadow-2xl">
        {/* LEFT PANEL */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="hidden md:flex md:flex-col md:justify-center md:items-center bg-gradient-to-br from-sotota-accent via-sotota-accentd to-sotota-bg p-12"
        >
          <div className="text-center text-white space-y-6">
            <SototalLogo size="lg" showTagline={false} />
            <blockquote className="text-lg italic border-l-4 border-white pl-6 text-left">
              "অল্প অল্প করে বারবার পড়া, এমন Micro Revision দেয়াই চান্স-পাওয়া সব ভালো স্টুডেন্টের অভ্যাস"
            </blockquote>
          </div>
        </motion.div>

        {/* RIGHT PANEL - Form */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-sotota-card p-8 md:p-12 flex flex-col justify-center max-h-screen md:max-h-none overflow-y-auto"
        >
          <div className="md:hidden mb-8 text-center">
            <SototalLogo size="md" showTagline={false} />
          </div>

          <h2 className="text-3xl md:text-4xl font-bold text-sotota-text mb-2">নতুন অ্যাকাউন্ট</h2>
          <p className="text-sotota-muted mb-8">আপনার শিক्षার যাত्रा শুরু করুন</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-sotota-text mb-2">পুরো নাম</label>
              <div className="relative">
                <FiUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-sotota-muted" size={18} />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="আপনার নাম"
                  className="w-full bg-sotota-card2 border border-sotota-border rounded-lg py-3 pl-12 pr-4 text-sotota-text placeholder:text-sotota-dim focus:outline-none focus:border-sotota-accent focus:ring-2 focus:ring-sotota-accent focus:ring-opacity-20 transition"
                  required
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-sotota-text mb-2">ফোন নম্বর</label>
              <div className="relative">
                <FiPhone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-sotota-muted" size={18} />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="०१X XXXX XXXX"
                  className="w-full bg-sotota-card2 border border-sotota-border rounded-lg py-3 pl-12 pr-4 text-sotota-text placeholder:text-sotota-dim focus:outline-none focus:border-sotota-accent focus:ring-2 focus:ring-sotota-accent focus:ring-opacity-20 transition"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-sotota-text mb-2">ইমেইল</label>
              <div className="relative">
                <FiMail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-sotota-muted" size={18} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="আপনার ইমেইল"
                  className="w-full bg-sotota-card2 border border-sotota-border rounded-lg py-3 pl-12 pr-4 text-sotota-text placeholder:text-sotota-dim focus:outline-none focus:border-sotota-accent focus:ring-2 focus:ring-sotota-accent focus:ring-opacity-20 transition"
                  required
                />
              </div>
            </div>

            {/* Batch */}
            <div>
              <label className="block text-sm font-medium text-sotota-text mb-2">ব্যাচ</label>
              <select
                value={batch}
                onChange={(e) => setBatch(e.target.value)}
                className="w-full bg-sotota-card2 border border-sotota-border rounded-lg py-3 px-4 text-sotota-text focus:outline-none focus:border-sotota-accent focus:ring-2 focus:ring-sotota-accent focus:ring-opacity-20 transition"
              >
                {BATCHES.map((b) => (
                  <option key={b.value} value={b.value}>{b.label}</option>
                ))}
              </select>
            </div>

            {/* Role Selection */}
            <div>
              <label className="block text-sm font-medium text-sotota-text mb-3">আপনার ভূমিকা নির্বাচন করুন</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole('STUDENT')}
                  className={`py-3 px-4 rounded-lg font-medium transition ${
                    role === 'STUDENT'
                      ? 'bg-sotota-accent text-white border-2 border-sotota-accent'
                      : 'bg-sotota-card2 text-sotota-text border-2 border-sotota-border hover:border-sotota-accent'
                  }`}
                >
                  👨‍🎓 শিক্ষার্থী
                </button>
                <button
                  type="button"
                  onClick={() => setRole('ADMIN')}
                  className={`py-3 px-4 rounded-lg font-medium transition ${
                    role === 'ADMIN'
                      ? 'bg-sotota-accent text-white border-2 border-sotota-accent'
                      : 'bg-sotota-card2 text-sotota-text border-2 border-sotota-border hover:border-sotota-accent'
                  }`}
                >
                  👨‍🏫 প্রশিক্ষক
                </button>
              </div>
              {role === 'ADMIN' && (
                <p className="text-xs text-sotota-muted mt-2 p-2 bg-sotota-card2 rounded">
                  ℹ️ প্রশিক্ষক হিসেবে আপনি কোর্স, পরীক্ষা এবং প্রশ্ন আপলোড করতে পারবেন।
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-sotota-text mb-2">পাসওয়ার্ড</label>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-sotota-muted" size={18} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="আপনার পাসওয়ার্ড"
                  className="w-full bg-sotota-card2 border border-sotota-border rounded-lg py-3 pl-12 pr-12 text-sotota-text placeholder:text-sotota-dim focus:outline-none focus:border-sotota-accent focus:ring-2 focus:ring-sotota-accent focus:ring-opacity-20 transition"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-sotota-muted hover:text-sotota-text transition"
                >
                  {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-sotota-text mb-2">পাসওয়ার্ড নিশ্চিত করুন</label>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-sotota-muted" size={18} />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="পাসওয়ার্ড পুনরায় দিন"
                  className="w-full bg-sotota-card2 border border-sotota-border rounded-lg py-3 pl-12 pr-12 text-sotota-text placeholder:text-sotota-dim focus:outline-none focus:border-sotota-accent focus:ring-2 focus:ring-sotota-accent focus:ring-opacity-20 transition"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-sotota-muted hover:text-sotota-text transition"
                >
                  {showConfirmPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-sotota-red bg-opacity-20 border border-sotota-red rounded-lg p-3 text-sotota-red text-sm"
              >
                {error}
              </motion.div>
            )}

            {/* Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-sotota-accent to-sotota-accentd text-white font-bold py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed mt-6"
            >
              {loading ? 'অ্যাকাউন্ট তৈরি হচ্ছে...' : 'অ্যাকাউন্ট তৈরি করুন'}
            </motion.button>
          </form>

          {/* Login Link */}
          <p className="text-center text-sotota-muted text-sm mt-6">
            ইতিমধ্যে অ্যাকাউন্ট আছে?{' '}
            <Link href="/login" className="text-sotota-accent font-semibold hover:text-sotota-accentl transition">
              লগইন করুন
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
