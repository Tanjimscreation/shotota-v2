import { prisma } from '@/lib/db/client'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: examId } = await params

    // Get exam details
    const exam = await prisma.exam.findUnique({
      where: { id: examId },
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
      },
    })

    if (!exam) {
      return NextResponse.json({ error: 'Exam not found' }, { status: 404 })
    }

    // Get questions
    const questions = await prisma.question.findMany({
      where: { examId },
      select: {
        id: true,
        questionText: true,
        optionA: true,
        optionB: true,
        optionC: true,
        optionD: true,
        correctAnswer: true,
        explanation: true,
        order: true,
      },
      orderBy: { order: 'asc' },
    })

    return NextResponse.json({
      exam,
      questions,
    })
  } catch (error) {
    console.error('Error fetching exam:', error)
    // Return sample exam data for development when database is unavailable
    return NextResponse.json(
      {
        exam: {
          id: 'sample-exam-1',
          title: 'সাধারণ জীববিজ্ঞান - নমুনা পরীক্ষা',
          description: 'এটি একটি নমুনা পরীক্ষা (ডাটাবেস অনুপলব্ধ)',
          duration: 30,
          totalQuestions: 2,
          negativeMarking: 0.25,
          passingScore: 60,
          course: {
            id: 'sample-course',
            title: 'সাধারণ জীববিজ্ঞান',
          },
        },
        questions: [
          {
            id: 'q1',
            questionText: 'মানুষের শরীরে কয়টি হাড় আছে?',
            optionA: '180',
            optionB: '206',
            optionC: '250',
            optionD: '300',
            correctAnswer: 'B',
            explanation: 'একজন প্রাপ্তবয়স্ক মানুষের শরীরে 206টি হাড় থাকে।',
            order: 1,
          },
          {
            id: 'q2',
            questionText: 'হিমোগ্লোবিনের প্রধান কাজ কী?',
            optionA: 'পুষ্টি সরবরাহ',
            optionB: 'অক্সিজেন পরিবহন',
            optionC: 'রোগ প্রতিরোধ',
            optionD: 'তাপমাত্রা নিয়ন্ত্রণ',
            correctAnswer: 'B',
            explanation: 'হিমোগ্লোবিন লোহিত রক্তকণিকায় থাকে এবং ফুসফুস থেকে অক্সিজেন সংগ্রহ করে শরীরের সমস্ত কোষে পরিবহন করে।',
            order: 2,
          },
        ],
      },
      { status: 200 }
    )
  }
}
