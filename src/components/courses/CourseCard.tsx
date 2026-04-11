// src/components/courses/CourseCard.tsx

'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'

interface CourseCardProps {
  id: string
  title: string
  description: string
  thumbnail?: string
  instructor: string
  category: string
  duration: number
  price: number
}

export const CourseCard: React.FC<CourseCardProps> = ({
  id,
  title,
  description,
  thumbnail,
  instructor,
  category,
  duration,
  price,
}) => {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      className="h-full"
    >
      <Link href={`/courses/${id}`}>
        <div className="group h-full bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 overflow-hidden border border-emerald-100 cursor-pointer">
          {/* Thumbnail */}
          <div className="relative w-full h-48 bg-gradient-to-br from-emerald-500 to-green-600 overflow-hidden">
            {thumbnail ? (
              <Image
                src={thumbnail}
                alt={title}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-white text-sm font-medium opacity-50">No Image</div>
              </div>
            )}
            {/* Category Badge */}
            <div className="absolute top-3 right-3 bg-emerald-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
              {category}
            </div>
          </div>

          {/* Content */}
          <div className="p-5 flex flex-col h-[calc(100%-192px)]">
            {/* Title */}
            <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-emerald-600 transition-colors">
              {title}
            </h3>

            {/* Instructor */}
            <p className="text-sm text-gray-600 mb-3 font-medium">
              by {instructor}
            </p>

            {/* Description */}
            <p className="text-sm text-gray-600 mb-4 line-clamp-2 flex-grow">
              {description}
            </p>

            {/* Footer Stats */}
            <div className="flex items-center justify-between pt-4 border-t border-emerald-100">
              {/* Duration */}
              <div className="flex items-center gap-1 text-xs font-semibold text-gray-700">
                <svg
                  className="w-4 h-4 text-emerald-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 11-2 0V9.5a1 1 0 112 0V7z"
                    clipRule="evenodd"
                  />
                </svg>
                {duration}h
              </div>

              {/* Price */}
              <div className="text-lg font-bold text-emerald-600">
                ${price.toFixed(2)}
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
