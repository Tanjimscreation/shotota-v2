'use client'

import React from 'react'
import { motion } from 'framer-motion'

export const ShototaBrandLogo: React.FC = () => {
  return (
    <motion.div
      className="relative flex items-center gap-2 group"
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      {/* Logo Container - Transparent background for seamless navbar integration */}
      <div className="relative flex items-center gap-1 px-2 py-1">
        {/* Bengali Text Logo - Medical/Admission theme colors */}
        <div className="text-2xl md:text-3xl font-black tracking-tight leading-none flex items-center">
          <span className="text-red-500 drop-shadow-sm">স</span>
          <span className="text-emerald-400 drop-shadow-sm">ত</span>
          <span className="text-red-500 drop-shadow-sm">ত</span>
          <span className="text-emerald-400 drop-shadow-sm">া</span>
        </div>
        
        {/* Subtle quill/feather accent - inverted for dark bg */}
        <svg
          className="w-5 h-5 -scale-x-100 text-emerald-400/80"
          viewBox="0 0 24 24"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M21 3c0-1.1-.9-2-2-2-.5 0-1 .2-1.4.6L3.6 15.4c-.6.6-.8 1.5-.5 2.3l.9 2.5c.2.6.8 1 1.4 1 .2 0 .5 0 .7-.1L19.4 7.4c.4-.4.6-.9.6-1.4V3z" />
        </svg>
      </div>
      
      {/* Subtle glow effect on hover */}
      <div className="absolute inset-0 rounded-lg bg-emerald-500/10 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
    </motion.div>
  )
}
