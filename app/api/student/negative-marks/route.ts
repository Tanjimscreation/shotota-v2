import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/db/client'

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

    // Get exam results for the user
    const examResults = await prisma.examResult.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' }
    })

    // Calculate negative marks stats
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
    const monthAgo = new Date(today.getFullYear(), today.getMonth(), 1)

    // Daily negative marks
    const dailyResults = examResults.filter(
      r => new Date(r.createdAt) >= today
    )
    const dailyNegativeMarks = dailyResults.reduce((sum, r) => sum + r.negativeMarks, 0)
    const dailyTotal = dailyResults.reduce((sum, r) => sum + r.totalQuestions, 0)
    const dailyPercentage = dailyTotal > 0 ? (dailyNegativeMarks / (dailyTotal * 0.25)) * 100 : 0

    // Weekly negative marks
    const weeklyResults = examResults.filter(
      r => new Date(r.createdAt) >= weekAgo
    )
    const weeklyNegativeMarks = weeklyResults.reduce((sum, r) => sum + r.negativeMarks, 0)
    const weeklyTotal = weeklyResults.reduce((sum, r) => sum + r.totalQuestions, 0)
    const weeklyPercentage = weeklyTotal > 0 ? (weeklyNegativeMarks / (weeklyTotal * 0.25)) * 100 : 0

    // Monthly negative marks
    const monthlyResults = examResults.filter(
      r => new Date(r.createdAt) >= monthAgo
    )
    const monthlyNegativeMarks = monthlyResults.reduce((sum, r) => sum + r.negativeMarks, 0)
    const monthlyTotal = monthlyResults.reduce((sum, r) => sum + r.totalQuestions, 0)
    const monthlyPercentage = monthlyTotal > 0 ? (monthlyNegativeMarks / (monthlyTotal * 0.25)) * 100 : 0

    // Overall stats
    const totalNegativeMarks = examResults.reduce((sum, r) => sum + r.negativeMarks, 0)

    return NextResponse.json(
      {
        daily: {
          negativeMarks: dailyNegativeMarks,
          percentage: Math.min(dailyPercentage, 100)
        },
        weekly: {
          negativeMarks: weeklyNegativeMarks,
          percentage: Math.min(weeklyPercentage, 100)
        },
        monthly: {
          negativeMarks: monthlyNegativeMarks,
          percentage: Math.min(monthlyPercentage, 100)
        },
        overall: {
          totalNegativeMarks,
          totalExamsAttempted: examResults.length,
          avgNegativePercentage: examResults.length > 0 
            ? (totalNegativeMarks / (examResults.reduce((sum, r) => sum + r.totalQuestions, 0) * 0.25)) * 100 
            : 0
        }
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Negative marks tracking error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch negative marks data' },
      { status: 500 }
    )
  }
}
