'use server'

import { prisma } from '@/lib/db/client'
import bcrypt from 'bcryptjs'
import { Role } from '@prisma/client'

interface RegisterUserInput {
  name: string
  email: string
  password: string
  phone?: string
  batch?: string
  role?: 'STUDENT' | 'INSTRUCTOR' | 'ADMIN'
}

interface RegisterUserResponse {
  success: boolean
  error?: string
  user?: {
    id: string
    email: string
    name: string
    role: string
  }
}

/**
 * Server Action: Register a new user
 * Enforces the 5-Admin Guard: Maximum 5 ADMIN users allowed
 */
export async function registerUser(input: RegisterUserInput): Promise<RegisterUserResponse> {
  try {
    const { name, email, password, phone, batch, role = 'STUDENT' } = input

    // Validate inputs
    if (!name?.trim() || !email?.trim() || !password?.trim()) {
      return { success: false, error: 'Name, email, and password are required' }
    }

    if (password.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters' }
    }

    // Normalize email
    const normalizedEmail = email.trim().toLowerCase()

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail }
    })

    if (existingUser) {
      return { success: false, error: 'User with this email already exists' }
    }

    // ===== 5-ADMIN GUARD: Check admin limit =====
    if (role === 'ADMIN') {
      const adminCount = await prisma.user.count({
        where: { role: 'ADMIN' }
      })

      if (adminCount >= 5) {
        return {
          success: false,
          error: 'Admin registration limit reached. Maximum 5 admins allowed.'
        }
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user
    const newUser = await prisma.user.create({
      data: {
        email: normalizedEmail,
        password: hashedPassword,
        name: name.trim(),
        role: (role || 'STUDENT') as any,
        phone: phone?.trim() || null,
        batch: batch?.trim() || null
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        phone: true,
        batch: true,
        createdAt: true
      }
    })

    console.log(`✅ User registered: ${newUser.email} (Role: ${newUser.role})`)

    return {
      success: true,
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role
      }
    }
  } catch (error) {
    console.error('❌ Registration error:', error)
    return { success: false, error: 'Failed to register user. Please try again.' }
  }
}
