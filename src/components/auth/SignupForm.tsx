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
        <h2 className="text-2xl font-bold text-gray-900">Create Account</h2>
        <p className="text-gray-600 text-sm mt-1">Join thousands of students</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-3">
          <FiAlertCircle className="text-red-600 mt-0.5 flex-shrink-0" />
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-start gap-3">
          <FiCheckCircle className="text-green-600 mt-0.5 flex-shrink-0" />
          <p className="text-green-700 text-sm">{success}</p>
        </div>
      )}

      {/* Name Field */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Full Name
        </label>
        <div className="relative">
          <FiUser className="absolute left-3 top-3 text-gray-400" />
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
            className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.name ? 'border-red-500' : 'border-gray-300'
            }`}
          />
        </div>
        {errors.name && <p className="text-red-600 text-xs mt-1">{errors.name.message}</p>}
      </div>

      {/* Email Field */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email Address
        </label>
        <div className="relative">
          <FiMail className="absolute left-3 top-3 text-gray-400" />
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
            className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            }`}
          />
        </div>
        {errors.email && <p className="text-red-600 text-xs mt-1">{errors.email.message}</p>}
      </div>

      {/* Password Field */}
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
          Password
        </label>
        <div className="relative">
          <FiLock className="absolute left-3 top-3 text-gray-400" />
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
            className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.password ? 'border-red-500' : 'border-gray-300'
            }`}
          />
        </div>
        {errors.password && <p className="text-red-600 text-xs mt-1">{errors.password.message}</p>}
        <p className="text-gray-500 text-xs mt-1">Min 8 chars, uppercase, lowercase, number</p>
      </div>

      {/* Confirm Password Field */}
      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
          Confirm Password
        </label>
        <div className="relative">
          <FiLock className="absolute left-3 top-3 text-gray-400" />
          <input
            {...register('confirmPassword', {
              required: 'Please confirm your password',
              validate: (value: string) => value === password || 'Passwords do not match',
            })}
            type="password"
            placeholder="••••••••"
            className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
            }`}
          />
        </div>
        {errors.confirmPassword && (
          <p className="text-red-600 text-xs mt-1">{errors.confirmPassword.message}</p>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2 rounded-lg font-medium hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
      >
        {loading ? 'Creating Account...' : 'Create Account'}
      </button>

      {/* Login Link */}
      <p className="text-center text-gray-600 text-sm">
        Already have an account?{' '}
        <Link href="/login" className="text-blue-600 hover:text-blue-700 font-medium">
          Login here
        </Link>
      </p>
    </form>
  )
}
