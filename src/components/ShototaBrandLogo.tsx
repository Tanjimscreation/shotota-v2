'use client'

import React from 'react'
import { motion } from 'framer-motion'

export const ShototaBrandLogo: React.FC = () => {
  return (
    <motion.div
      className="relative flex items-center gap-2"
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.2 }}
    >
      {/* Logo Container with gradient background that blends with any theme */}
      <div className="relative flex items-center gap-1 px-3 py-2 rounded-xl backdrop-blur-md bg-gradient-to-r from-white/90 via-white/80 to-white/90 dark:from-slate-800/90 dark:via-slate-800/80 dark:to-slate-800/90 shadow-lg border border-white/20 dark:border-slate-700/50">
        {/* Bengali Text Logo with medical/admission theme colors */}
        <div className="text-2xl md:text-3xl font-black tracking-tight leading-none">
          <span className="text-red-600">স</span>
          <span className="text-emerald-600">ত</span>
          <span className="text-red-600">ত</span>
          <span className="text-emerald-600">া</span>
        </div>
        
        {/* Subtle quill/feather accent */}
        <svg
          className="w-5 h-5 -scale-x-100 text-red-500"
          viewBox="0 0 24 24"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M21 3c0-1.1-.9-2-2-2-.5 0-1 .2-1.4.6L3.6 15.4c-.6.6-.8 1.5-.5 2.3l.9 2.5c.2.6.8 1 1.4 1 .2 0 .5 0 .7-.1L19.4 7.4c.4-.4.6-.9.6-1.4V3z" />
        </svg>
      </div>
      
      {/* Glow effect on hover */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-red-500/20 to-emerald-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity -z-10" />
    </motion.div>
  )
}
