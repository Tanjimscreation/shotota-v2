// app/api/admin/init/route.ts
// This endpoint initializes demo accounts (call once after deployment)

import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/db/client'

export async function POST(request: NextRequest) {
  try {
    const { adminKey } = await request.json()

    // Security check - require admin key to initialize
    if (adminKey !== process.env.INIT_KEY) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    console.log('🌱 Initializing demo accounts...')

    // Hash passwords
    const adminPassword = await bcrypt.hash('hashed_password_123', 10)
    const studentPassword = await bcrypt.hash('password', 10)

    // Delete existing demo accounts
    await prisma.user.deleteMany({
      where: {
        email: {
          in: ['rahim@shotota.com', 'test@test.com']
        }
      }
    })

    // Create ADMIN user
    const admin = await prisma.user.create({
      data: {
        email: 'rahim@shotota.com',
        password: adminPassword,
        name: 'আবদুর রহিম (Admin)',
        phone: '01700000000',
        batch: 'ADMIN',
        role: 'ADMIN'
      }
    })

    // Create STUDENT user
    const student = await prisma.user.create({
      data: {
        email: 'test@test.com',
        password: studentPassword,
        name: 'Test Student',
        phone: '01700000001',
        batch: 'MBBS-2025',
        role: 'STUDENT'
      }
    })

    return NextResponse.json({
      message: 'Demo accounts initialized successfully',
      accounts: [
        {
          email: admin.email,
          password: 'hashed_password_123',
          role: admin.role,
          name: admin.name
        },
        {
          email: student.email,
          password: 'password',
          role: student.role,
          name: student.name
        }
      ]
    })
  } catch (error) {
    console.error('Init error:', error)
    return NextResponse.json(
      { error: 'Failed to initialize demo accounts' },
      { status: 500 }
    )
  }
}
