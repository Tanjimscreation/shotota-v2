import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { NextRequest, NextResponse } from 'next/server'

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
    if (!data.title || !data.questions || data.questions.length === 0) {
      return NextResponse.json(
        { error: 'Title and at least one question are required' },
        { status: 400 }
      )
    }

    // For now, we'll store this in memory/mock storage since DB is unavailable
    // In production, this would save to the database
    const newExam = {
      id: `exam-${Date.now()}`,
      title: data.title,
      description: data.description || '',
      courseId: data.courseId || 'general',
      duration: data.duration || 120,
      passingScore: data.passingScore || 60,
      negativeMarkPercentage: data.negativeMarkPercentage || 0,
      questions: data.questions.map((q: any, index: number) => ({
        id: `q-${Date.now()}-${index}`,
        questionText: q.questionText,
        optionA: q.optionA,
        optionB: q.optionB,
        optionC: q.optionC,
        optionD: q.optionD,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation || '',
        order: index + 1
      })),
      createdAt: new Date().toISOString(),
      createdBy: session.user.email
    }

    // Store in a global mock store (in production, save to database)
    if (!(global as any).mockExams) {
      (global as any).mockExams = []
    }
    (global as any).mockExams.push(newExam)

    return NextResponse.json(
      {
        success: true,
        message: 'Exam created successfully',
        exam: newExam
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating exam:', error)
    return NextResponse.json(
      { error: 'Failed to create exam' },
      { status: 500 }
    )
  }
}
