// src/components/Navbar.tsx

'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'
import { ShototaBrandLogo } from './ShototaBrandLogo'

export const Navbar: React.FC = () => {
  const router = useRouter()
  const { data: session } = useSession()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = async () => {
    await signOut({ redirect: false })
    router.push('/')
  }

  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 shadow-2xl border-b border-emerald-500 border-opacity-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo - Bengali Only */}
          <Link href="/" className="flex-shrink-0">
            <ShototaBrandLogo />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/courses"
              className="text-emerald-200 hover:text-emerald-100 font-semibold transition-colors"
            >
              Courses
            </Link>
            <Link
              href="/leaderboard"
              className="text-emerald-200 hover:text-emerald-100 font-semibold transition-colors"
            >
              Leaderboard
            </Link>

            {session?.user ? (
              <>
                <Link
                  href="/dashboard"
                  className="text-emerald-200 hover:text-emerald-100 font-semibold transition-colors"
                >
                  Dashboard
                </Link>
                <div className="flex items-center gap-3 pl-4 border-l border-emerald-500 border-opacity-30">
                  <div className="text-right">
                    <p className="text-sm font-semibold text-emerald-300">{session.user.name}</p>
                    <p className="text-xs text-emerald-200">{session.user.email}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:shadow-lg hover:shadow-red-500/50 font-semibold transition-all"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-4 py-2 text-emerald-300 border-2 border-emerald-500 border-opacity-50 rounded-lg hover:border-opacity-100 hover:bg-slate-700 font-semibold transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="px-4 py-2 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white rounded-lg hover:shadow-lg hover:shadow-emerald-500/50 font-semibold transition-all"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 text-emerald-300 hover:text-emerald-100"
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
            className="md:hidden border-t border-emerald-500 border-opacity-30 py-4 space-y-3 bg-slate-800 bg-opacity-50"
          >
            <Link
              href="/courses"
              className="block text-emerald-200 hover:text-emerald-100 font-semibold transition-colors px-4 py-2"
              onClick={() => setMenuOpen(false)}
            >
              Courses
            </Link>
            <Link
              href="/leaderboard"
              className="block text-emerald-200 hover:text-emerald-100 font-semibold transition-colors px-4 py-2"
              onClick={() => setMenuOpen(false)}
            >
              Leaderboard
            </Link>

            {session?.user ? (
              <>
                <Link
                  href="/dashboard"
                  className="block text-emerald-200 hover:text-emerald-100 font-semibold transition-colors px-4 py-2"
                  onClick={() => setMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    handleLogout()
                    setMenuOpen(false)
                  }}
                  className="w-full text-left px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:shadow-lg font-semibold transition-all"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="space-y-2 px-4">
                <Link
                  href="/login"
                  className="block text-center px-4 py-2 text-emerald-300 border-2 border-emerald-500 border-opacity-50 rounded-lg hover:border-opacity-100 hover:bg-slate-700 font-semibold transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="block text-center px-4 py-2 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white rounded-lg hover:shadow-lg hover:shadow-emerald-500/50 font-semibold transition-all"
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
