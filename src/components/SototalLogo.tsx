'use client'

import React from 'react'

interface SototalLogoProps {
  size?: 'sm' | 'md' | 'lg'
  showTagline?: boolean
}

export const SototalLogo: React.FC<SototalLogoProps> = ({ 
  size = 'md', 
  showTagline = false 
}) => {
  const sizeMap = {
    sm: { text: 'text-xl', quill: 'w-4 h-4', container: 'gap-1.5' },
    md: { text: 'text-3xl', quill: 'w-6 h-6', container: 'gap-2' },
    lg: { text: 'text-5xl', quill: 'w-8 h-8', container: 'gap-3' },
  }

  const current = sizeMap[size]

  return (
    <div className="flex flex-col items-center">
      <div className={`flex items-center ${current.container}`}>
        {/* Logo Text */}
        <div className="flex items-baseline">
          <span 
            className={`${current.text} font-black tracking-tight`}
            style={{ color: '#C0392B' }} // sotota-red
          >
            স
          </span>
          <span 
            className={`${current.text} font-black tracking-tight`}
            style={{ color: '#E8F5EE' }} // sotota-text
          >
            ততা
          </span>
        </div>

        {/* Quill Icon - Mirrored */}
        <svg
          className={`${current.quill} -scale-x-100`}
          viewBox="0 0 24 24"
          fill="currentColor"
          style={{ color: '#C0392B' }}
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Quill/Feather icon */}
          <path d="M21 3c0-1.1-.9-2-2-2-.5 0-1 .2-1.4.6L3.6 15.4c-.6.6-.8 1.5-.5 2.3l.9 2.5c.2.6.8 1 1.4 1 .2 0 .5 0 .7-.1L19.4 7.4c.4-.4.6-.9.6-1.4V3z" />
        </svg>
      </div>

      {/* Tagline - on auth pages */}
      {showTagline && (
        <p 
          className="text-xs mt-3 text-center font-medium tracking-wide max-w-xs"
          style={{ color: '#7CB899' }} // sotota-muted
        >
          একটি সহজসরল মেডিকেল এডমিশন প্রকল্প
        </p>
      )}
    </div>
  )
}
