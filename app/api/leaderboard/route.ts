import { prisma } from '@/lib/db/client'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  try {
    const entries = await prisma.leaderboardEntry.findMany({
      orderBy: [{ rank: 'asc' }],
      select: {
        id: true,
        userId: true,
        userName: true,
        batch: true,
        totalScore: true,
        examCount: true,
        avgScore: true,
        rank: true,
        streak: true,
      },
    })

    return NextResponse.json({
      entries,
    })
  } catch (error) {
    console.error('Error fetching leaderboard:', error)
    // Return empty list if database is unavailable
    return NextResponse.json(
      {
        entries: [],
      },
      { status: 200 }
    )
  }
}
