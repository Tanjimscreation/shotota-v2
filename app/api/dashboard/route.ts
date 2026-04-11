import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Get enrolled courses (mock data for now - you'll need to add enrollment tracking)
    const enrolledCourses = await prisma.course.findMany({
      take: 6,
      select: {
        id: true,
        title: true,
        description: true,
        instructor: true,
        thumbnail: true,
        category: true,
        duration: true,
      },
    })

    // Calculate learning stats
    const totalCourses = enrolledCourses.length
    const completedCourses = Math.floor(totalCourses * 0.3) // Mock: 30% completed
    const inProgressCourses = Math.floor(totalCourses * 0.5) // Mock: 50% in progress
    const totalHours = enrolledCourses.reduce((sum: number, course: any) => sum + (course.duration || 0), 0)
    const completionRate = totalCourses > 0 ? Math.floor((completedCourses / totalCourses) * 100) : 0

    // Mock streak (would come from database in production)
    const streak = Math.floor(Math.random() * 15) + 1

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      stats: {
        totalCourses,
        completedCourses,
        inProgressCourses,
        totalHours,
        completionRate,
        streak,
      },
      enrolledCourses: enrolledCourses.map((course: any) => ({
        ...course,
        progress: Math.floor(Math.random() * 100), // Mock progress percentage
      })),
    })
  } catch (error) {
    console.error('Dashboard error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    )
  }
}
