import { ReactNode } from 'react'

export default function AuthLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-green-50 to-teal-50">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-black bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent mb-2">
              সততা
            </h1>
            <p className="text-gray-600 text-sm" style={{ fontFamily: '"Poppins", "Segoe UI", sans-serif' }}>
              আপনার পরীক্ষায় আয়ত্ত করুন
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 border border-emerald-100">
            {children}
          </div>

          <p
            className="text-center text-gray-600 text-xs mt-6"
            style={{ fontFamily: '"Poppins", "Segoe UI", sans-serif' }}
          >
            সততা দ্বারা চালিত © 2026
          </p>
        </div>
      </div>
    </div>
  )
}
