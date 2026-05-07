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
      const trimmedEmail = email.trim().toLowerCase()
      const trimmedPassword = password.trim()

      if (!trimmedEmail || !trimmedPassword) {
        setError('ইমেইল এবং পাসওয়ার্ড উভয় প্রয়োজন')
        setLoading(false)
        setIsSubmitting(false)
        return
      }

      console.log('🔐 Attempting login for:', trimmedEmail)

      const result = await signIn('credentials', {
        email: trimmedEmail,
        password: trimmedPassword,
        redirect: false
      })

      console.log('📍 Login result:', result)

      if (result?.error) {
        console.log('❌ Login error:', result.error)
        setError('ইমেইল বা পাসওয়ার্ড ভুল। পুনরায় চেষ্টা করুন।')
        setLoading(false)
        setIsSubmitting(false)
      } else if (result?.ok) {
        console.log('✅ Login successful')
        submitTimeoutRef.current = setTimeout(() => {
          router.push(role === 'admin' ? '/admin' : '/dashboard')
          setLoading(false)
          setIsSubmitting(false)
        }, 500)
      } else {
        console.log('⚠️ Unexpected login response')
        setError('কিছু সমস্যা হয়েছে। পুনরায় চেষ্টা করুন।')
        setLoading(false)
        setIsSubmitting(false)
      }
    } catch (err: any) {
      console.error('❌ Auth error:', err)
      setError('কানেকশন ত্রুটি। ইন্টারনেট সংযোগ যাচাই করুন এবং পুনরায় চেষ্টা করুন।')
      setLoading(false)
      setIsSubmitting(false)
    }
  }

  const roleTitle = role === 'admin' ? 'অ্যাডমিন লগইন' : 'শিক্ষার্থী লগইন'
  const roleSubtitle = role === 'admin' ? 'আপনার অ্যাডমিন অ্যাকাউন্টে সাইন ইন করুন' : 'আপনার শিক্ষার্থী অ্যাকাউন্টে সাইন ইন করুন'
  
  // Show role-specific form if role parameter is provided
  if (role) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="min-h-screen bg-gradient-to-br from-sotota-dark via-sotota-light to-sotota-dark flex items-center justify-center p-4"
      >
        <div className="w-full max-w-6xl grid md:grid-cols-2 gap-8 items-center">
          {/* Left Panel - Bengali Quote */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="hidden md:flex flex-col justify-center items-center text-center p-8"
          >
            <div className="relative">
              <div className="absolute -top-4 -left-4 text-6xl text-white/20">"</div>
              <blockquote className="text-2xl md:text-3xl font-bold text-white leading-relaxed">
                অল্প অল্প করে বারবার পড়া, এমন{' '}
                <span className="text-emerald-400">Micro Revision</span> দেয়াই চান্স-পাওয়া সব ভালো স্টুডেন্টের অভ্যাস
              </blockquote>
              <div className="absolute -bottom-4 -right-4 text-6xl text-white/20">"</div>
            </div>
            <div className="mt-8 w-24 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent" />
          </motion.div>

          {/* Right Panel - Login Form */}
          <div className="w-full max-w-md mx-auto">
            <button
              onClick={onBack}
              className="mb-6 text-white hover:text-gray-200 font-semibold flex items-center gap-2"
            >
              <FiArrowLeft /> ফিরে যান
          </button>

          <div className="bg-white rounded-2xl shadow-2xl p-8 border-2 border-gray-100">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{roleTitle}</h1>
            <p className="text-gray-700 mb-8 font-medium">{roleSubtitle}</p>

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
                <label className="block text-sm font-bold text-gray-800 mb-2">ইমেইল</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-800 mb-2">পাসওয়ার্ড</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="আপনার পাসওয়ার্ড"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-800"
                  >
                    {showPassword ? '🙈' : '👁'}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors disabled:opacity-50 shadow-lg"
              >
                {loading ? 'লগইন হচ্ছে...' : 'লগইন করুন'}
              </button>
            </form>

            <p className="text-center text-gray-700 text-sm mt-6 font-medium">
              এখনো অ্যাকাউন্ট নেই?{' '}
              <Link href="/signup" className="text-blue-600 font-bold hover:underline">
                সাইন আপ করুন
              </Link>
            </p>
          </div>
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
          <div className="text-center text-white space-y-6">
            <h2 className="text-4xl font-bold">সোতোতা</h2>
            <blockquote className="text-lg italic border-l-4 border-white pl-6">
              "অল্প অল্প করে বারবার পড়া, এমন Micro Revision দেয়াই চান্স-পাওয়া সব ভালো স্টুডেন্টের অভ্যাস"
            </blockquote>
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
