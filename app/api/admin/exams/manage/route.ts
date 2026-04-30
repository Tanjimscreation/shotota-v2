import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { NextRequest, NextResponse } from 'next/server'

// In-memory storage for exams (in production, use database)
const examsStorage: any[] = []

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Admin can see all exams, students see only their enrolled exams
    if ((session.user as any).role === 'ADMIN') {
      return NextResponse.json({
        exams: examsStorage,
        total: examsStorage.length
      })
    }

    // For students, return empty (can be extended to show enrolled exams)
    return NextResponse.json({
      exams: [],
      total: 0
    })
  } catch (error) {
    console.error('Error fetching exams:', error)
    return NextResponse.json(
      { error: 'Failed to fetch exams' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if ((session.user as any).role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Forbidden: Admin access required' },
        { status: 403 }
      )
    }

    const data = await request.json()

    // Validate required fields
    if (!data.title || !data.questions || data.questions.length === 0) {
      return NextResponse.json(
        { error: 'Title and at least one question are required' },
        { status: 400 }
      )
    }

    // Create exam object
    const newExam = {
      id: `exam-${Date.now()}`,
      title: data.title,
      description: data.description || '',
      courseId: data.courseId || 'medical',
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
      createdBy: session.user.email,
      status: 'active',
      totalAttempts: 0,
      averageScore: 0
    }

    examsStorage.push(newExam)

    return NextResponse.json(
      {
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

// DELETE exam
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if ((session.user as any).role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Forbidden: Admin access required' },
        { status: 403 }
      )
    }

    const url = new URL(request.url)
    const examId = url.searchParams.get('id')

    if (!examId) {
      return NextResponse.json(
        { error: 'Exam ID is required' },
        { status: 400 }
      )
    }

    const index = examsStorage.findIndex((exam) => exam.id === examId)

    if (index === -1) {
      return NextResponse.json(
        { error: 'Exam not found' },
        { status: 404 }
      )
    }

    const deletedExam = examsStorage.splice(index, 1)

    return NextResponse.json({
      message: 'Exam deleted successfully',
      exam: deletedExam[0]
    })
  } catch (error) {
    console.error('Error deleting exam:', error)
    return NextResponse.json(
      { error: 'Failed to delete exam' },
      { status: 500 }
    )
  }
}
