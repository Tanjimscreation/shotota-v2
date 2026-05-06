// app/api/admin/courses/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/client'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export async function POST(request: NextRequest) {
  try {
    // Get session
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized - Please login' },
        { status: 401 }
      )
    }

    if ((session.user as any).role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Forbidden - Only admins can create courses' },
        { status: 403 }
      )
    }

    const { title, description, instructor, category, duration, lessons } = await request.json()

    // Validation
    if (!title || !description || !instructor || !category) {
      return NextResponse.json(
        { error: 'Missing required fields: title, description, instructor, category' },
        { status: 400 }
      )
    }

    try {
      // Create course
      const course = await prisma.course.create({
        data: {
          title: title.trim(),
          description: description.trim(),
          instructor: instructor.trim(),
          category: category.trim(),
          duration: duration || 0,
          lessons: lessons || 0,
        }
      })

      console.log('✅ Course created:', course.id, course.title)

      return NextResponse.json(
        {
          message: 'Course created successfully',
          course,
        },
        { status: 201 }
      )
    } catch (dbError: any) {
      console.error('❌ Database error:', dbError.message)
      return NextResponse.json(
        { error: 'Failed to create course' },
        { status: 500 }
      )
    }
  } catch (error: any) {
    console.error('❌ Course creation error:', error.message)
    return NextResponse.json(
      { error: 'Failed to create course. Please try again.' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get session
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    if ((session.user as any).role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Forbidden - Only admins can view course management' },
        { status: 403 }
      )
    }

    // Get all courses
    const courses = await prisma.course.findMany({
      select: {
        id: true,
        title: true,
        description: true,
        instructor: true,
        category: true,
        duration: true,
        lessons: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json({
      courses,
      total: courses.length,
    })
  } catch (error: any) {
    console.error('❌ Error fetching courses:', error.message)
    return NextResponse.json(
      { error: 'Failed to fetch courses' },
      { status: 500 }
    )
  }
}
