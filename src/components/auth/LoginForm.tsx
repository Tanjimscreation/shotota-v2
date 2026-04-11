'use client'

import { useState, Suspense } from 'react'
import { useRouter } from 'next/navigation'
import { useSearchParams as useSearchParamsOriginal } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { useForm } from 'react-hook-form'
import Link from 'next/link'
import { FiMail, FiLock, FiAlertCircle } from 'react-icons/fi'

interface LoginFormData {
  email: string
  password: string
}

function LoginFormInner() {
  const router = useRouter()
  const searchParams = useSearchParamsOriginal()
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard'

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    mode: 'onBlur',
  })

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true)
    setError('')

    try {
      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      })

      if (!result?.ok) {
        setError(result?.error || 'Invalid email or password')
        return
      }

      router.push(callbackUrl)
    } catch (err) {
      setError('An error occurred. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="mb-6">
        <h2 className="text-3xl font-black bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent mb-2" style={{ fontFamily: '"Poppins", "Segoe UI", sans-serif' }}>Welcome Back</h2>
        <p className="text-emerald-200 text-sm font-medium" style={{ fontFamily: '"Poppins", "Segoe UI", sans-serif' }}>Sign in to your account</p>
      </div>

      {error && (
        <div className="bg-red-900 bg-opacity-30 border border-red-500 border-opacity-50 rounded-lg p-3 flex items-start gap-3">
          <FiAlertCircle className="text-red-400 mt-0.5 flex-shrink-0" />
          <p className="text-red-200 text-sm">{error}</p>
        </div>
      )}

      <div>
        <label htmlFor="email" className="block text-sm font-semibold text-emerald-200 mb-2" style={{ fontFamily: '"Poppins", "Segoe UI", sans-serif' }}>
          Email Address
        </label>
        <div className="relative">
          <FiMail className="absolute left-3 top-3 text-emerald-400" />
          <input
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Please enter a valid email',
              },
            })}
            type="email"
            placeholder="you@example.com"
            className={`w-full pl-10 pr-4 py-2 bg-slate-700 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400 text-white placeholder-slate-400 transition-all ${
              errors.email ? 'border-red-500' : 'border-emerald-500 border-opacity-30'
            }`}
          />
        </div>
        {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label htmlFor="password" className="block text-sm font-semibold text-emerald-200" style={{ fontFamily: '"Poppins", "Segoe UI", sans-serif' }}>
            Password
          </label>
          <Link href="/forgot-password" className="text-xs text-teal-400 hover:text-teal-300 font-medium transition" style={{ fontFamily: '"Poppins", "Segoe UI", sans-serif' }}>
            Forgot Password?
          </Link>
        </div>
        <div className="relative">
          <FiLock className="absolute left-3 top-3 text-emerald-400" />
          <input
            {...register('password', {
              required: 'Password is required',
              minLength: {
                value: 6,
                message: 'Password must be at least 6 characters',
              },
            })}
            type="password"
            placeholder="••••••••"
            className={`w-full pl-10 pr-4 py-2 bg-slate-700 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400 text-white placeholder-slate-400 transition-all ${
              errors.password ? 'border-red-500' : 'border-emerald-500 border-opacity-30'
            }`}
          />
        </div>
        {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white py-3 rounded-lg font-bold hover:shadow-2xl hover:shadow-emerald-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 text-base"
        style={{ fontFamily: '"Poppins", "Segoe UI", sans-serif' }}
      >
        {loading ? 'Signing in...' : 'Sign In'}
      </button>

      <p className="text-center text-emerald-200 text-sm font-medium" style={{ fontFamily: '"Poppins", "Segoe UI", sans-serif' }}>
        Don't have an account?{' '}
        <Link href="/signup" className="text-teal-400 hover:text-teal-300 font-bold transition">
          Sign up here
        </Link>
      </p>

      <div className="bg-emerald-900 bg-opacity-30 border border-emerald-500 border-opacity-50 rounded-lg p-3 text-center">
        <p className="text-emerald-200 text-xs font-medium" style={{ fontFamily: '"Poppins", "Segoe UI", sans-serif' }}>
          <strong>Demo:</strong> test@example.com / Test@2026
        </p>
      </div>
    </form>
  )
}

export default function LoginForm() {
  return (
    <Suspense fallback={<div className="text-center py-8">Loading...</div>}>
      <LoginFormInner />
    </Suspense>
  )
}
