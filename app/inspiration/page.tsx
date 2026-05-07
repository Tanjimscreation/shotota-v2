'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { DashboardLayout } from '@/components/DashboardLayout'
import { FiArrowLeft, FiYoutube, FiPlay, FiHeart, FiZap } from 'react-icons/fi'
import Link from 'next/link'

const YOUTUBE_PLAYLIST_URL = 'https://www.youtube.com/embed/videoseries?list=PLSLMkUXXzznEDopqk387iktprNHRMKzTO&autoplay=0&rel=0&modestbranding=1'

export default function InspirationPage() {
  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="sticky top-0 z-10 bg-slate-900/95 backdrop-blur-md border-b border-slate-700/50 px-6 py-4"
        >
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 text-slate-300 hover:text-emerald-400 transition-colors group"
            >
              <motion.div
                whileHover={{ x: -4 }}
                className="flex items-center gap-2"
              >
                <FiArrowLeft className="w-5 h-5" />
                <span className="font-medium">ড্যাশবোর্ডে ফিরুন</span>
              </motion.div>
            </Link>

            <div className="flex items-center gap-3">
              <FiYoutube className="w-6 h-6 text-red-500" />
              <h1 className="text-xl font-bold text-white">মোটিভেশনাল ভিডিও</h1>
            </div>

            <div className="w-32" /> {/* Spacer for balance */}
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-center mb-8"
          >
            <motion.div
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="inline-flex items-center gap-3 bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-500/30 rounded-full px-6 py-3 mb-6"
            >
              <FiHeart className="w-5 h-5 text-red-400 animate-pulse" />
              <span className="text-red-300 font-medium">
                হারিয়ে ফেলেছেন অনুপ্রেরণা? চিন্তার কিছু নেই!
              </span>
            </motion.div>

            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
              আবার <span className="text-emerald-400">শুরু</span> করুন আপনার যাত্রা
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg">
              ডাক্তার হওয়ার স্বপ্ন বড়, কিন্তু পথ কঠিন। এই ভিডিও গুলো আপনাকে নতুন করে অনুপ্রাণিত করবে।
            </p>
          </motion.div>

          {/* Video Player */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="relative bg-slate-800 rounded-2xl overflow-hidden shadow-2xl border border-slate-700"
          >
            {/* Glow Effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 via-cyan-500/20 to-blue-500/20 blur-xl opacity-50 rounded-2xl" />

            <div className="relative aspect-video bg-slate-900">
              <iframe
                src={YOUTUBE_PLAYLIST_URL}
                title="Motivational Videos Playlist"
                className="absolute inset-0 w-full h-full"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>

            {/* Video Info Overlay */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent p-6"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
                  <FiPlay className="w-5 h-5 text-white ml-1" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg">মোটিভেশনাল প্লেলিস্ট</h3>
                  <p className="text-slate-400 text-sm">YouTube • শিক্ষা ও অনুপ্রেরণা</p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Quote Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-10 grid md:grid-cols-2 gap-6"
          >
            {/* Quote 1 */}
            <motion.div
              whileHover={{ y: -4 }}
              className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6"
            >
              <p className="text-slate-300 text-lg italic leading-relaxed">
                "অল্প অল্প করে বারবার পড়া, এমন Micro Revision দেয়াই চান্স-পাওয়া সব ভালো স্টুডেন্টের অভ্যাস"
              </p>
              <div className="mt-4 flex items-center gap-2">
                <div className="w-8 h-1 bg-emerald-500 rounded-full" />
                <span className="text-emerald-400 text-sm font-medium">সোতোতা টিম</span>
              </div>
            </motion.div>

            {/* Quote 2 */}
            <motion.div
              whileHover={{ y: -4 }}
              className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6"
            >
              <p className="text-slate-300 text-lg italic leading-relaxed">
                "প্রতিটি কঠিন মুহূর্ত আপনাকে আরও শক্তিশালী করে তোলে। ডাক্তার হওয়ার স্বপ্নটি বাঁচিয়ে রাখুন।"
              </p>
              <div className="mt-4 flex items-center gap-2">
                <div className="w-8 h-1 bg-cyan-500 rounded-full" />
                <span className="text-cyan-400 text-sm font-medium">সোতোতা টিম</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Tips Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-8 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border border-emerald-500/20 rounded-xl p-6"
          >
            <h3 className="text-emerald-400 font-bold text-lg mb-4 flex items-center gap-2">
              <FiZap className="w-5 h-5" />
              দ্রুত পড়াশোনার টিপস
            </h3>
            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { text: 'সকালে উঠে প্রথমে MCQ অনুশীলন', color: 'bg-emerald-500/20 text-emerald-300' },
                { text: 'প্রতি ১ ঘন্টায় ১০ মিনিট বিরতি', color: 'bg-blue-500/20 text-blue-300' },
                { text: 'ভুল উত্তরগুলো আলাদা নোট করুন', color: 'bg-amber-500/20 text-amber-300' },
                { text: 'নিয়মিত মক টেস্ট দিন', color: 'bg-purple-500/20 text-purple-300' },
              ].map((tip, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7 + i * 0.1 }}
                  className={`${tip.color} rounded-lg p-3 text-sm font-medium`}
                >
                  {tip.text}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  )
}
