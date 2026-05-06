// app/api/auth/signup/route.ts

import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/db/client'
import { validators } from '@/lib/utils/validators'
import { userStore } from '@/lib/auth/userStore'

export async function POST(request: NextRequest) {
  try {
    const { email, password, name, phone, batch } = await request.json()

    // Validation
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Missing required fields: email, password, name' },
        { status: 400 }
      )
    }

    const normalizedEmail = email.toLowerCase().trim()

    if (!validators.isValidEmail(normalizedEmail)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Relaxed password validation - minimum 6 characters
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      )
    }

    try {
      // Try to use database
      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email: normalizedEmail },
      })

      if (existingUser) {
        return NextResponse.json(
          { error: 'User with this email already exists' },
          { status: 409 }
        )
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10)

      // Create user
      const user = await prisma.user.create({
        data: {
          email: normalizedEmail,
          password: hashedPassword,
          name: name.trim(),
          role: 'STUDENT', // Default role is student
          phone: phone?.trim() || null,
          batch: batch?.trim() || null,
        },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          phone: true,
          batch: true,
          createdAt: true,
        }
      })

      console.log('✅ User created successfully:', user.email)

      return NextResponse.json(
        {
          message: 'User created successfully',
          user,
        },
        { status: 201 }
      )
    } catch (dbError: any) {
      console.error('❌ Database error during signup:', dbError.message || dbError)
      
      // Fallback: Use in-memory store if database fails
      console.log('⚠️ Using in-memory store (database unavailable)')
      
      // Check if user exists in memory
      const existingUser = userStore.findByEmail(normalizedEmail)
      if (existingUser) {
        return NextResponse.json(
          { error: 'User with this email already exists' },
          { status: 409 }
        )
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10)

      // Create user in memory
      const user = {
        id: Math.random().toString(36).substr(2, 9),
        email: normalizedEmail,
        password: hashedPassword,
        name: name.trim(),
        role: 'STUDENT' as const,
        phone: phone?.trim() || null,
        batch: batch?.trim() || null,
        createdAt: new Date(),
        updatedAt: new Date()
      }

      userStore.addUser(user)

      // Return user without password
      const { password: _, ...userWithoutPassword } = user

      console.log('✅ User created in memory store:', user.email)

      return NextResponse.json(
        {
          message: 'User created successfully (demo mode)',
          user: userWithoutPassword,
        },
        { status: 201 }
      )
    }
  } catch (error: any) {
    console.error('❌ Signup error:', error.message || error)
    return NextResponse.json(
      { error: 'Failed to create user. Please try again.' },
      { status: 500 }
    )
  }
}

