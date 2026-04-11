import { prisma } from '@/lib/db/client'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get('page') || '1', 10)
    const limit = parseInt(searchParams.get('limit') || '12', 10)
    const search = searchParams.get('search') || ''

    const skip = (page - 1) * limit

    const where = search
      ? {
          OR: [
            { title: { contains: search } },
            { description: { contains: search } },
            { category: { contains: search } },
          ],
        }
      : {}

    const [courses, total] = await Promise.all([
      prisma.course.findMany({
        where,
        skip,
        take: limit,
        select: {
          id: true,
          title: true,
          description: true,
          thumbnail: true,
          instructor: true,
          category: true,
          duration: true,
          price: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.course.count({ where }),
    ])

    return NextResponse.json(
      {
        courses,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit),
        },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error fetching courses:', error)
    return NextResponse.json({ error: 'Failed to fetch courses' }, { status: 500 })
  }
}
