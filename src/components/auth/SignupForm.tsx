'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import Link from 'next/link'
import { FiMail, FiLock, FiUser, FiAlertCircle, FiCheckCircle } from 'react-icons/fi'

interface SignupFormData {
  name: string
  email: string
  password: string
  confirmPassword: string
}

export default function SignupForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignupFormData>({
    mode: 'onBlur',
  })

  const password = watch('password')

  const onSubmit = async (data: SignupFormData) => {
    // Validate passwords match
    if (data.password !== data.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        setError(result.error || 'Failed to create account')
        return
      }

      setSuccess('Account created successfully! Redirecting to login...')
      setTimeout(() => {
        router.push('/login')
      }, 2000)
    } catch (err) {
      setError('An error occurred. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-3xl font-black bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent mb-2" style={{ fontFamily: '"Poppins", "Segoe UI", sans-serif' }}>Create Account</h2>
        <p className="text-emerald-200 text-sm font-medium" style={{ fontFamily: '"Poppins", "Segoe UI", sans-serif' }}>Join thousands of students</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-900 bg-opacity-30 border border-red-500 border-opacity-50 rounded-lg p-3 flex items-start gap-3">
          <FiAlertCircle className="text-red-400 mt-0.5 flex-shrink-0" />
          <p className="text-red-200 text-sm">{error}</p>
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="bg-emerald-900 bg-opacity-30 border border-emerald-500 border-opacity-50 rounded-lg p-3 flex items-start gap-3">
          <FiCheckCircle className="text-emerald-400 mt-0.5 flex-shrink-0" />
          <p className="text-emerald-200 text-sm">{success}</p>
        </div>
      )}

      {/* Name Field */}
      <div>
        <label htmlFor="name" className="block text-sm font-semibold text-emerald-200 mb-2" style={{ fontFamily: '"Poppins", "Segoe UI", sans-serif' }}>
          Full Name
        </label>
        <div className="relative">
          <FiUser className="absolute left-3 top-3 text-emerald-400" />
          <input
            {...register('name', {
              required: 'Name is required',
              minLength: {
                value: 2,
                message: 'Name must be at least 2 characters',
              },
            })}
            type="text"
            placeholder="John Doe"
            className={`w-full pl-10 pr-4 py-2 bg-slate-700 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400 text-white placeholder-slate-400 transition-all ${
              errors.name ? 'border-red-500' : 'border-emerald-500 border-opacity-30'
            }`}
          />
        </div>
        {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
      </div>

      {/* Email Field */}
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

      {/* Password Field */}
      <div>
        <label htmlFor="password" className="block text-sm font-semibold text-emerald-200 mb-2" style={{ fontFamily: '"Poppins", "Segoe UI", sans-serif' }}>
          Password
        </label>
        <div className="relative">
          <FiLock className="absolute left-3 top-3 text-emerald-400" />
          <input
            {...register('password', {
              required: 'Password is required',
              minLength: {
                value: 8,
                message: 'Password must be at least 8 characters',
              },
              pattern: {
                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                message: 'Password must contain uppercase, lowercase, and number',
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
        <p className="text-emerald-300 text-xs mt-1" style={{ fontFamily: '"Poppins", "Segoe UI", sans-serif' }}>Min 8 characters, uppercase, lowercase, number</p>
      </div>

      {/* Confirm Password Field */}
      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-semibold text-emerald-200 mb-2" style={{ fontFamily: '"Poppins", "Segoe UI", sans-serif' }}>
          Confirm Password
        </label>
        <div className="relative">
          <FiLock className="absolute left-3 top-3 text-emerald-400" />
          <input
            {...register('confirmPassword', {
              required: 'Please confirm your password',
              validate: (value: string) => value === password || 'Passwords do not match',
            })}
            type="password"
            placeholder="••••••••"
            className={`w-full pl-10 pr-4 py-2 bg-slate-700 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400 text-white placeholder-slate-400 transition-all ${
              errors.confirmPassword ? 'border-red-500' : 'border-emerald-500 border-opacity-30'
            }`}
          />
        </div>
        {errors.confirmPassword && (
          <p className="text-red-400 text-xs mt-1">{errors.confirmPassword.message}</p>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white py-3 rounded-lg font-bold hover:shadow-2xl hover:shadow-emerald-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 text-base"
        style={{ fontFamily: '"Poppins", "Segoe UI", sans-serif' }}
      >
        {loading ? 'Creating account...' : 'Create Account'}
      </button>

      {/* Login Link */}
      <p className="text-center text-emerald-200 text-sm font-medium" style={{ fontFamily: '"Poppins", "Segoe UI", sans-serif' }}>
        Already have an account?{' '}
        <Link href="/login" className="text-teal-400 hover:text-teal-300 font-bold transition">
          Login here
        </Link>
      </p>
    </form>
  )
}
