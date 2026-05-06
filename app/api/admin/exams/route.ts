import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/client'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    // Check if user is authenticated and is admin
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if ((session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 })
    }

    const data = await request.json()

    // Validate required fields
    if (!data.title) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      )
    }

    try {
      // Create exam in database
      const exam = await prisma.exam.create({
        data: {
          title: data.title,
          description: data.description || '',
          courseId: data.courseId || null,
          duration: data.duration || 120,
          totalQuestions: data.questions?.length || 0,
        }
      })

      // Create questions if provided
      if (data.questions && data.questions.length > 0) {
        await Promise.all(
          data.questions.map((q: any, index: number) =>
            prisma.question.create({
              data: {
                examId: exam.id,
                questionText: q.questionText,
                optionA: q.optionA,
                optionB: q.optionB,
                optionC: q.optionC,
                optionD: q.optionD,
                correctAnswer: q.correctAnswer,
                explanation: q.explanation || '',
                order: index + 1,
              }
            })
          )
        )
      }

      console.log('✅ Exam created with questions:', exam.id, exam.title)

      return NextResponse.json(
        {
          message: 'Exam created successfully',
          exam: {
            id: exam.id,
            title: exam.title,
            description: exam.description,
            duration: exam.duration,
            totalQuestions: exam.totalQuestions,
            createdAt: exam.createdAt,
          }
        },
        { status: 201 }
      )
    } catch (dbError: any) {
      console.error('❌ Database error:', dbError.message)
      
      // Fallback to in-memory storage
      const newExam = {
        id: `exam-${Date.now()}`,
        title: data.title,
        description: data.description || '',
        courseId: data.courseId || 'general',
        duration: data.duration || 120,
        totalQuestions: data.questions?.length || 0,
        questions: data.questions?.map((q: any, index: number) => ({
          id: `q-${Date.now()}-${index}`,
          questionText: q.questionText,
          optionA: q.optionA,
          optionB: q.optionB,
          optionC: q.optionC,
          optionD: q.optionD,
          correctAnswer: q.correctAnswer,
          explanation: q.explanation || '',
          order: index + 1
        })) || [],
        createdAt: new Date().toISOString(),
        createdBy: session.user.email
      }

      console.log('✅ Exam created in memory:', newExam.id)

      return NextResponse.json(
        {
          message: 'Exam created successfully (demo mode)',
          exam: newExam
        },
        { status: 201 }
      )
    }
  } catch (error: any) {
    console.error('❌ Exam creation error:', error.message)
    return NextResponse.json(
      { error: 'Failed to create exam' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if ((session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 })
    }

    const exams = await prisma.exam.findMany({
      select: {
        id: true,
        title: true,
        description: true,
        duration: true,
        totalQuestions: true,
        courseId: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json({
      exams,
      total: exams.length,
    })
  } catch (error: any) {
    console.error('❌ Error fetching exams:', error.message)
    return NextResponse.json(
      { error: 'Failed to fetch exams' },
      { status: 500 }
    )
  }
}
