import { prisma } from '@/lib/db/client'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const courseId = searchParams.get('courseId')
    const page = parseInt(searchParams.get('page') || '1', 10)
    const limit = parseInt(searchParams.get('limit') || '10', 10)

    const skip = (page - 1) * limit

    const where = courseId ? { courseId } : {}

    const [exams, total] = await Promise.all([
      prisma.exam.findMany({
        where,
        skip,
        take: limit,
        select: {
          id: true,
          title: true,
          description: true,
          duration: true,
          totalQuestions: true,
          negativeMarking: true,
          passingScore: true,
          course: {
            select: {
              id: true,
              title: true,
            },
          },
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.exam.count({ where }),
    ])

    return NextResponse.json({
      exams,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching exams:', error)
    // Return empty list if database is unavailable
    return NextResponse.json(
      {
        exams: [],
        pagination: {
          total: 0,
          page: 1,
          limit: 10,
          pages: 0,
        },
      },
      { status: 200 }
    )
  }
}
