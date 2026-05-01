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

    if (!validators.isValidEmail(email)) {
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

    let useDatabase = true

    try {
      // Try to use database
      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email },
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
          email,
          password: hashedPassword,
          name,
          role: 'STUDENT', // Default role is student
          phone: phone || null,
          batch: batch || null,
        },
      })

      // Return user without password
      const { password: _, ...userWithoutPassword } = user

      return NextResponse.json(
        {
          message: 'User created successfully',
          user: userWithoutPassword,
        },
        { status: 201 }
      )
    } catch (dbError) {
      console.error('Database error:', dbError)
      useDatabase = false
    }

    // Fallback: Use in-memory store if database fails
    if (!useDatabase) {
      console.log('📌 Using in-memory store (database unavailable)')
      
      // Check if user exists in memory
      const existingUser = userStore.findByEmail(email)
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
        email,
        password: hashedPassword,
        name,
        role: 'STUDENT' as const,
        phone: phone || null,
        batch: batch || null,
        createdAt: new Date(),
        updatedAt: new Date()
      }

      userStore.addUser(user)

      // Return user without password
      const { password: _, ...userWithoutPassword } = user

      return NextResponse.json(
        {
          message: 'User created successfully (demo mode)',
          user: userWithoutPassword,
        },
        { status: 201 }
      )
    }
  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    )
  }
}

