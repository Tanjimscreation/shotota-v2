'use client'

import { useState, useRef } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowLeft } from 'react-icons/fi'
import Link from 'next/link'

export default function LoginForm({ 
  role = 'student', 
  onBack 
}: { 
  role?: 'admin' | 'student'
  onBack?: () => void 
}) {
  const router = useRouter()
  const submitTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const [email, setEmail] = useState(role === 'admin' ? 'rahim@shotota.com' : 'test@test.com')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (isSubmitting || loading) return
    if (submitTimeoutRef.current) clearTimeout(submitTimeoutRef.current)

    setIsSubmitting(true)
    setLoading(true)
    setError('')

    try {
      if (!email.trim() || !password.trim()) {
        setError('ইমেইল এবং পাসওয়ার্ড উভয় প্রয়োজন')
        setLoading(false)
        setIsSubmitting(false)
        return
      }

      const result = await signIn('credentials', {
        email,
        password,
        role,
        redirect: false
      })

      if (result?.error) {
        setError('ইমেইল বা পাসওয়ার্ড ভুল')
        setLoading(false)
        setIsSubmitting(false)
      } else if (result?.ok) {
        submitTimeoutRef.current = setTimeout(() => {
          router.push(role === 'admin' ? '/admin' : '/dashboard')
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

  const demoPassword = role === 'admin' ? 'hashed_password_123' : 'password'
  const roleTitle = role === 'admin' ? 'অ্যাডমিন লগইন' : 'শিক্ষার্থী লগইন'
  const roleSubtitle = role === 'admin' ? 'আপনার অ্যাডমিন অ্যাকাউন্টে সাইন ইন করুন' : 'আপনার শিক্ষার্থী অ্যাকাউন্টে সাইন ইন করুন'

  // Simple modal-based login for role selection
  if (onBack) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="min-h-screen bg-gradient-to-br from-sotota-dark via-sotota-light to-sotota-dark flex items-center justify-center p-4"
      >
        <div className="w-full max-w-md">
          <button
            onClick={onBack}
            className="mb-6 text-white hover:text-gray-200 font-semibold flex items-center gap-2"
          >
            <FiArrowLeft /> ফিরে যান
          </button>

          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <h1 className="text-3xl font-bold text-sotota-dark mb-2">{roleTitle}</h1>
            <p className="text-gray-600 mb-8">{roleSubtitle}</p>

            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm"
              >
                {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">ইমেইল</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sotota-dark focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">পাসওয়ার্ড</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="আপনার পাসওয়ার্ড"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sotota-dark focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  >
                    {showPassword ? '🙈' : '👁'}
                  </button>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-gray-600">
                <p className="font-semibold text-blue-600 mb-1">Demo করার জন্য:</p>
                <p>Email: <span className="font-mono">{email}</span></p>
                <p>Password: <span className="font-mono">{demoPassword}</span></p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-sotota-dark text-white font-semibold py-2 rounded-lg hover:bg-sotota-light transition-colors disabled:opacity-50"
              >
                {loading ? 'লগইন হচ্ছে...' : 'লগইন করুন'}
              </button>
            </form>

            <p className="text-center text-gray-600 text-sm mt-6">
              এখনো অ্যাকাউন্ট নেই?{' '}
              <Link href="/signup" className="text-sotota-dark font-semibold hover:underline">
                সাইন আপ করুন
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    )
  }

  // Default login form (backward compatibility)
  return (
    <div className="min-h-screen bg-sotota-bg flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid md:grid-cols-2 gap-0 rounded-2xl overflow-hidden shadow-2xl">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="hidden md:flex md:flex-col md:justify-center md:items-center bg-gradient-to-br from-sotota-accent via-sotota-accentd to-sotota-bg p-12"
        >
          <div className="text-center text-white">
            <h2 className="text-4xl font-bold mb-4">সোতোতা</h2>
            <p className="text-lg opacity-90">আপনার শিক্ষার সঙ্গী</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-sotota-card p-8 md:p-12 flex flex-col justify-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-sotota-text mb-2">আবার স্বাগতম!</h2>
          <p className="text-sotota-muted mb-8">আপনার শিক্ষার যাত্রা চালিয়ে যান</p>

          <form onSubmit={handleSubmit} className="space-y-5">
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

            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-sotota-red bg-opacity-20 border border-sotota-red rounded-lg p-3 text-sotota-red text-sm"
              >
                {error}
              </motion.div>
            )}

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
