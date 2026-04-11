import type { ReactNode } from 'react'
import Link from 'next/link'

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-teal-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background gradient orbs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-teal-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse" />
      
      <div className="w-full max-w-md relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-6">
            <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400" style={{ fontFamily: '"Poppins", "Segoe UI", sans-serif' }}>
              Shatota
            </h1>
          </Link>
          <p className="text-emerald-200 font-medium text-base" style={{ fontFamily: '"Poppins", "Segoe UI", sans-serif' }}>Master Your Exams</p>
        </div>

        {/* Form Container */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-2xl p-8 border border-emerald-500 border-opacity-30 backdrop-blur-sm">
          {children}
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-emerald-300 mt-6 font-medium" style={{ fontFamily: '"Poppins", "Segoe UI", sans-serif' }}>
          © 2026 Shatota Exam Platform
        </p>
      </div>
    </div>
  )
}
