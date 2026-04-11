'use client'

import React from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { SototalLogo } from './SototalLogo'
import { FiLayout, FiTrendingUp, FiBook, FiClipboard, FiAward, FiSettings, FiLogOut } from 'react-icons/fi'

const navItems = [
  { label: 'ড্যাশবোর্ড', href: '/dashboard', icon: FiLayout },
  { label: 'লিডারবোর্ড', href: '/leaderboard', icon: FiTrendingUp },
  { label: 'আমার কোর্স', href: '/courses', icon: FiBook },
  { label: 'পরীক্ষা', href: '/exams', icon: FiClipboard },
  { label: 'সার্টিফিকেট', href: '/certificates', icon: FiAward },
]

export const Sidebar: React.FC = () => {
  const pathname = usePathname()

  const handleLogout = async () => {
    await signOut({ redirect: true, callbackUrl: '/login' })
  }

  return (
    <aside 
      className="hidden md:flex md:fixed md:left-0 md:top-0 md:h-screen md:w-[190px] md:flex-col md:border-r"
      style={{
        backgroundColor: 'var(--sotota-surface)',
        borderColor: 'var(--sotota-border)',
      }}
    >
      {/* Logo Section */}
      <div className="p-6 border-b" style={{ borderColor: 'var(--sotota-border)' }}>
        <Link href="/dashboard" className="block">
          <SototalLogo size="sm" />
        </Link>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname.startsWith(item.href)
          
          return (
            <motion.div key={item.href} whileHover={{ x: 2 }}>
              <Link
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive 
                    ? 'text-sotota-accent border-l-[3px] bg-opacity-10'
                    : 'text-sotota-muted hover:text-sotota-text'
                }`}
                style={{
                  borderColor: isActive ? 'var(--sotota-accent)' : 'transparent',
                  backgroundColor: isActive ? 'rgba(29, 185, 84, 0.1)' : 'transparent',
                }}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span className="truncate">{item.label}</span>
              </Link>
            </motion.div>
          )
        })}
      </nav>

      {/* Bottom Section - Settings & Logout */}
      <div 
        className="border-t p-4 space-y-2"
        style={{ borderColor: 'var(--sotota-border)' }}
      >
        <Link
          href="/settings"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-sotota-muted hover:text-sotota-text"
        >
          <FiSettings className="w-5 h-5 flex-shrink-0" />
          <span className="truncate">সেটিংস</span>
        </Link>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-sotota-red hover:text-sotota-redb"
        >
          <FiLogOut className="w-5 h-5 flex-shrink-0" />
          <span className="truncate">লগআউট</span>
        </button>
      </div>
    </aside>
  )
}
