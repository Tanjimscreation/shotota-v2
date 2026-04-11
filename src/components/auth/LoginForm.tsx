'use client'

import { useState, useRef } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi'
import { SototalLogo } from '@/components/SototalLogo'
import QuoteRotator from '@/components/auth/QuoteRotator'
import StatsBar from '@/components/auth/StatsBar'
import Link from 'next/link'

export default function LoginForm() {
  const router = useRouter()
  const submitTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
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

    setIsSubmitting(true)
    setLoading(true)
    setError('')

    try {
      // Validate inputs
      if (!email.trim() || !password.trim()) {
        setError('ইমেইল এবং পাসওয়ার্ড উভয় প্রয়োজন')
        setLoading(false)
        setIsSubmitting(false)
        return
      }

      const result = await signIn('credentials', {
        email,
        password,
        redirect: false
      })

      if (result?.error) {
        setError('ইমেইল বা পাসওয়ার্ড ভুল')
        setLoading(false)
        setIsSubmitting(false)
      } else if (result?.ok) {
        // Add delay to ensure session is set before redirect
        submitTimeoutRef.current = setTimeout(() => {
          router.push('/dashboard')
          setLoading(false)
          setIsSubmitting(false)
        }, 500)
      } else {
        setError('কিছু সমস্যা হয়েছে। পুনরায় চেষ্টা করুন।')
        setLoading(false)
        setIsSubmitting(false)
      }
    } catch (err) {
      setError('কিছু সমস্যা হয়েছে। পুনরায় চেষ্টা করুন।')
      setLoading(false)
      setIsSubmitting(false)
    }
  }

  const handleGoogleSignIn = async () => {
    if (isSubmitting || loading) {
      return
    }
    
    setIsSubmitting(true)
    setLoading(true)
    try {
      await signIn('google', { callbackUrl: '/dashboard' })
    } catch {
      setError('Google দিয়ে সাইন ইন করতে ব্যর্থ')
      setLoading(false)
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-sotota-bg flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid md:grid-cols-2 gap-0 rounded-2xl overflow-hidden shadow-2xl">
        {/* LEFT PANEL - Quote & Stats */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="hidden md:flex md:flex-col md:justify-center md:items-center bg-gradient-to-br from-sotota-accent via-sotota-accentd to-sotota-bg p-12"
        >
          <div className="text-center">
            <SototalLogo size="lg" showTagline={false} />
            <QuoteRotator />
            <StatsBar />
          </div>
        </motion.div>

        {/* RIGHT PANEL - Form */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-sotota-card p-8 md:p-12 flex flex-col justify-center"
        >
          {/* Logo for mobile */}
          <div className="md:hidden mb-8 text-center">
            <SototalLogo size="md" showTagline={false} />
          </div>

          <h2 className="text-3xl md:text-4xl font-bold text-sotota-text mb-2">আবার স্বাগতম!</h2>
          <p className="text-sotota-muted mb-8">আপনার শিক্ষার যাত্রা চালিয়ে যান</p>

          {/* Demo Login Section */}
          <div className="bg-sotota-accent/10 border border-sotota-accent rounded-lg p-4 mb-6">
            <p className="text-xs font-semibold text-sotota-accent mb-3">ডেভেলপমেন্ট: দ্রুত লগইন করুন</p>
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => {
                  setEmail('rahim@shotota.com')
                  setPassword('hashed_password_123')
                }}
                className="w-full text-left text-sm px-3 py-2 bg-sotota-card hover:bg-sotota-card2 rounded transition text-sotota-text"
              >
                👤 আবদুর রহিম (rahim@shotota.com)
              </button>
              <button
                type="button"
                onClick={() => {
                  setEmail('test@test.com')
                  setPassword('password')
                }}
                className="w-full text-left text-sm px-3 py-2 bg-sotota-card hover:bg-sotota-card2 rounded transition text-sotota-text"
              >
                👤 Test User (test@test.com)
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-sotota-text mb-2">
                ইমেইল বা ফোন নম্বর
              </label>
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

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-sotota-text mb-2">
                পাসওয়ার্ড
              </label>
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

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-sotota-border bg-sotota-card2 cursor-pointer accent-sotota-accent"
                />
                <span className="text-sm text-sotota-muted">আমাকে মনে রাখুন</span>
              </label>
              <Link href="/forgot-password" className="text-sm text-sotota-accent hover:text-sotota-accentl transition">
                পাসওয়ার্ড ভুলে গেছেন?
              </Link>
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-sotota-red bg-opacity-20 border border-sotota-red rounded-lg p-3 text-sotota-red text-sm"
              >
                {error}
              </motion.div>
            )}

            {/* Login Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-sotota-accent to-sotota-accentd text-white font-bold py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'লগইন হচ্ছে...' : 'লগইন করুন'}
            </motion.button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-sotota-border" />
            <span className="text-sotota-muted text-sm">অথবা</span>
            <div className="flex-1 h-px bg-sotota-border" />
          </div>

          {/* Google SSO */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full border-2 border-sotota-border bg-sotota-card2 text-sotota-text font-medium py-3 rounded-lg hover:border-sotota-accent transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Google দিয়ে লগইন করুন
          </motion.button>

          {/* Signup Link */}
          <p className="text-center text-sotota-muted text-sm mt-8">
            অ্যাকাউন্ট নেই?{' '}
            <Link href="/signup" className="text-sotota-accent font-semibold hover:text-sotota-accentl transition">
              এখনই তৈরি করুন
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
