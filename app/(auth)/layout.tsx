import type { ReactNode } from 'react'
import Link from 'next/link'

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-6">
            <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-green-600" style={{ fontFamily: '"Poppins", "Segoe UI", sans-serif' }}>
              শটোটা
            </h1>
          </Link>
          <p className="text-gray-700 font-medium text-base" style={{ fontFamily: '"Poppins", "Segoe UI", sans-serif' }}>আপনার পরীক্ষায় আয়ত্ত করুন</p>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-emerald-100">
          {children}
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-600 mt-6 font-medium" style={{ fontFamily: '"Poppins", "Segoe UI", sans-serif' }}>
          শটোটা দ্বারা চালিত © 2026
        </p>
      </div>
    </div>
  )
}
