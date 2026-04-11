// src/components/Navbar.tsx

'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'

export const Navbar: React.FC = () => {
  const router = useRouter()
  const { data: session } = useSession()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = async () => {
    await signOut({ redirect: false })
    router.push('/')
  }

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-md border-b border-emerald-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
              className="text-2xl font-black bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent"
            >
              Shatota
            </motion.div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/courses"
              className="text-gray-700 hover:text-emerald-600 font-semibold transition-colors"
            >
              Courses
            </Link>
            <Link
              href="/leaderboard"
              className="text-gray-700 hover:text-emerald-600 font-semibold transition-colors"
            >
              Leaderboard
            </Link>

            {session?.user ? (
              <>
                <Link
                  href="/dashboard"
                  className="text-gray-700 hover:text-emerald-600 font-semibold transition-colors"
                >
                  Dashboard
                </Link>
                <div className="flex items-center gap-3 pl-4 border-l border-emerald-200">
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">{session.user.name}</p>
                    <p className="text-xs text-gray-600">{session.user.email}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 font-semibold transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-4 py-2 text-emerald-600 border border-emerald-600 rounded-lg hover:bg-emerald-50 font-semibold transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-lg hover:shadow-lg font-semibold transition-all"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 text-gray-700 hover:text-emerald-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t border-emerald-100 py-4 space-y-3"
          >
            <Link
              href="/courses"
              className="block text-gray-700 hover:text-emerald-600 font-semibold transition-colors px-4 py-2"
              onClick={() => setMenuOpen(false)}
            >
              Courses
            </Link>
            <Link
              href="/leaderboard"
              className="block text-gray-700 hover:text-emerald-600 font-semibold transition-colors px-4 py-2"
              onClick={() => setMenuOpen(false)}
            >
              Leaderboard
            </Link>

            {session?.user ? (
              <>
                <Link
                  href="/dashboard"
                  className="block text-gray-700 hover:text-emerald-600 font-semibold transition-colors px-4 py-2"
                  onClick={() => setMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    handleLogout()
                    setMenuOpen(false)
                  }}
                  className="w-full text-left px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 font-semibold transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="space-y-2 px-4">
                <Link
                  href="/login"
                  className="block text-center px-4 py-2 text-emerald-600 border border-emerald-600 rounded-lg hover:bg-emerald-50 font-semibold transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="block text-center px-4 py-2 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-lg hover:shadow-lg font-semibold transition-all"
                  onClick={() => setMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </nav>
  )
}
