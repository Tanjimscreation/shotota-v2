// src/components/common/Footer.tsx

'use client'

import React from 'react'
import Link from 'next/link'
import { FaFacebook, FaYoutube, FaLinkedin, FaWhatsapp } from 'react-icons/fa'

export const Footer: React.FC = () => {
  const socialLinks = [
    {
      name: 'Facebook',
      icon: FaFacebook,
      url: 'https://facebook.com',
      color: 'hover:text-blue-600',
    },
    {
      name: 'YouTube',
      icon: FaYoutube,
      url: 'https://youtube.com',
      color: 'hover:text-red-600',
    },
    {
      name: 'LinkedIn',
      icon: FaLinkedin,
      url: 'https://linkedin.com',
      color: 'hover:text-blue-800',
    },
    {
      name: 'WhatsApp',
      icon: FaWhatsapp,
      url: 'https://whatsapp.com',
      color: 'hover:text-green-600',
    },
  ]

  return (
    <footer className="bg-gray-900 text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* About */}
          <div>
            <h3 className="text-2xl font-bold mb-4">Shotota</h3>
            <p className="text-gray-400">
              Professional exam preparation platform for competitive exams and courses.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/courses" className="hover:text-white transition">
                  All Courses
                </Link>
              </li>
              <li>
                <Link href="/leaderboard" className="hover:text-white transition">
                  Leaderboard
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Follow Us</h4>
            <div className="flex space-x-6">
              {socialLinks.map(social => {
                const Icon = social.icon
                return (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={social.name}
                    className={`text-2xl text-gray-400 transition ${social.color}`}
                  >
                    <Icon />
                  </a>
                )
              })}
            </div>
          </div>
        </div>

        {/* Divider */}
        <hr className="border-gray-700 mb-6" />

        {/* Bottom Footer */}
        <div className="flex justify-between items-center text-gray-400 text-sm">
          <p>&copy; 2026 Shotota. All rights reserved.</p>
          <div className="flex space-x-6">
            <Link href="/privacy" className="hover:text-white transition">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-white transition">
              Terms & Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
