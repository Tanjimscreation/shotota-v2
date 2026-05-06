import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/db/client'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    const body = await request.json()
    const { examResultId, wrongAnswers } = body

    // Save all wrong answers
    const savedAnswers = await Promise.all(
      wrongAnswers.map((answer: any) =>
        prisma.wrongAnswer.create({
          data: {
            userId: user.id,
            examResultId,
            questionId: answer.questionId,
            questionText: answer.questionText,
            userAnswer: answer.userAnswer,
            correctAnswer: answer.correctAnswer,
            explanation: answer.explanation,
            subject: answer.subject,
            category: answer.category
          }
        })
      )
    )

    return NextResponse.json(
      {
        success: true,
        message: 'Wrong answers saved successfully',
        count: savedAnswers.length
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Wrong answer submission error:', error)
    return NextResponse.json(
      { error: 'Failed to save wrong answers' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Get all wrong answers for the user
    const wrongAnswers = await prisma.wrongAnswer.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      take: 100
    })

    // Group by subject
    const groupedBySubject = wrongAnswers.reduce((acc: any, answer) => {
      if (!acc[answer.subject || 'Other']) {
        acc[answer.subject || 'Other'] = []
      }
      acc[answer.subject || 'Other'].push(answer)
      return acc
    }, {})

    return NextResponse.json(
      {
        total: wrongAnswers.length,
        wrongAnswers,
        groupedBySubject
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Fetch wrong answers error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch wrong answers' },
      { status: 500 }
    )
  }
}
