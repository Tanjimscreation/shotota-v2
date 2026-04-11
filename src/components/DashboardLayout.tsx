'use client'

import React, { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'

interface DashboardLayoutProps {
  children: ReactNode
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <div style={{ backgroundColor: 'var(--sotota-bg)' }}>
      <Sidebar />
      <Topbar />

      {/* Main Content */}
      <motion.main
        className="md:ml-[190px] md:mt-20 min-h-screen p-4 md:p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.main>
    </div>
  )
}
