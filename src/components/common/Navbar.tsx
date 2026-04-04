// src/components/common/Navbar.tsx

'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { FaMenu, FaTimes } from 'react-icons/fa'

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => setIsOpen(!isOpen)

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-blue-600">
              Shotota
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/courses" className="hover:text-blue-600 transition">
              Courses
            </Link>
            <Link href="/leaderboard" className="hover:text-blue-600 transition">
              Leaderboard
            </Link>
            <Link href="/login" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
              Login
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button onClick={toggleMenu} className="text-2xl">
              {isOpen ? <FaTimes /> : <FaMenu />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <Link href="/courses" className="block py-2 hover:text-blue-600">
              Courses
            </Link>
            <Link href="/leaderboard" className="block py-2 hover:text-blue-600">
              Leaderboard
            </Link>
            <Link href="/login" className="block py-2 px-4 bg-blue-600 text-white rounded text-center">
              Login
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}
