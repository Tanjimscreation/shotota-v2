// src/lib/utils/analyticsHelpers.ts

import {
  ExamResult,
  NegativeMarkStats,
  DailyAnalytics,
  WeeklyAnalytics,
  MonthlyAnalytics,
  StudentPerformanceDashboard,
} from '@/types'

/**
 * Calculate overall negative marking statistics
 */
export const calculateNegativeMarkStats = (results: ExamResult[]): NegativeMarkStats => {
  if (results.length === 0) {
    return {
      totalExams: 0,
      totalNegativeMarks: 0,
      totalQuestions: 0,
      negativeMarkPercentage: 0,
      averageNegativeMarksPerExam: 0,
      trend: 'stable',
    }
  }

  const totalNegativeMarks = results.reduce((sum, r) => sum + r.negativeMarks, 0)
  const totalQuestions = results.reduce((sum, r) => sum + r.totalQuestions, 0)
  const negativeMarkPercentage = (totalNegativeMarks / totalQuestions) * 100

  // Calculate trend by comparing first half vs second half
  const midpoint = Math.floor(results.length / 2)
  const firstHalf = results.slice(0, midpoint)
  const secondHalf = results.slice(midpoint)

  const firstHalfPercentage =
    firstHalf.length > 0
      ? (firstHalf.reduce((sum, r) => sum + r.negativeMarks, 0) /
          firstHalf.reduce((sum, r) => sum + r.totalQuestions, 0)) *
        100
      : 0

  const secondHalfPercentage =
    secondHalf.length > 0
      ? (secondHalf.reduce((sum, r) => sum + r.negativeMarks, 0) /
          secondHalf.reduce((sum, r) => sum + r.totalQuestions, 0)) *
        100
      : 0

  let trend: 'improving' | 'declining' | 'stable' = 'stable'
  if (secondHalfPercentage < firstHalfPercentage - 1) trend = 'improving'
  else if (secondHalfPercentage > firstHalfPercentage + 1) trend = 'declining'

  return {
    totalExams: results.length,
    totalNegativeMarks,
    totalQuestions,
    negativeMarkPercentage,
    averageNegativeMarksPerExam: totalNegativeMarks / results.length,
    trend,
  }
}

/**
 * Group results by day and calculate daily analytics
 */
export const calculateDailyAnalytics = (results: ExamResult[]): DailyAnalytics[] => {
  const groupedByDay = new Map<string, ExamResult[]>()

  results.forEach(result => {
    const date = new Date(result.createdAt)
    const dateKey = date.toISOString().split('T')[0] // YYYY-MM-DD
    if (!groupedByDay.has(dateKey)) {
      groupedByDay.set(dateKey, [])
    }
    groupedByDay.get(dateKey)!.push(result)
  })

  const dailyAnalytics: DailyAnalytics[] = []

  groupedByDay.forEach((dayResults, dateStr) => {
    const totalNegativeMarks = dayResults.reduce((sum, r) => sum + r.negativeMarks, 0)
    const totalQuestions = dayResults.reduce((sum, r) => sum + r.totalQuestions, 0)
    const scores = dayResults.map(r => r.score)

    dailyAnalytics.push({
      date: dateStr,
      examsCount: dayResults.length,
      totalNegativeMarks,
      totalQuestions,
      negativeMarkPercentage: (totalNegativeMarks / totalQuestions) * 100,
      scores,
    })
  })

  return dailyAnalytics.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
}

/**
 * Group results by week and calculate weekly analytics
 */
export const calculateWeeklyAnalytics = (results: ExamResult[]): WeeklyAnalytics[] => {
  const dailyAnalytics = calculateDailyAnalytics(results)
  const groupedByWeek = new Map<string, DailyAnalytics[]>()

  dailyAnalytics.forEach(daily => {
    const date = new Date(daily.date)
    const weekStart = new Date(date)
    weekStart.setDate(date.getDate() - date.getDay()) // Start from Sunday
    const weekKey = weekStart.toISOString().split('T')[0]

    if (!groupedByWeek.has(weekKey)) {
      groupedByWeek.set(weekKey, [])
    }
    groupedByWeek.get(weekKey)!.push(daily)
  })

  const weeklyAnalytics: WeeklyAnalytics[] = []

  groupedByWeek.forEach((weekDays, weekStartStr) => {
    const weekStart = new Date(weekStartStr)
    const weekEnd = new Date(weekStart)
    weekEnd.setDate(weekStart.getDate() + 6)

    const totalNegativeMarks = weekDays.reduce((sum, d) => sum + d.totalNegativeMarks, 0)
    const totalQuestions = weekDays.reduce((sum, d) => sum + d.totalQuestions, 0)
    const examsCount = weekDays.reduce((sum, d) => sum + d.examsCount, 0)

    weeklyAnalytics.push({
      weekStart: weekStartStr,
      weekEnd: weekEnd.toISOString().split('T')[0],
      examsCount,
      totalNegativeMarks,
      totalQuestions,
      negativeMarkPercentage: (totalNegativeMarks / totalQuestions) * 100,
      dailyBreakdown: weekDays,
    })
  })

  return weeklyAnalytics
}

/**
 * Group results by month and calculate monthly analytics
 */
export const calculateMonthlyAnalytics = (results: ExamResult[]): MonthlyAnalytics[] => {
  const weeklyAnalytics = calculateWeeklyAnalytics(results)
  const groupedByMonth = new Map<string, WeeklyAnalytics[]>()

  weeklyAnalytics.forEach(weekly => {
    const date = new Date(weekly.weekStart)
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`

    if (!groupedByMonth.has(monthKey)) {
      groupedByMonth.set(monthKey, [])
    }
    groupedByMonth.get(monthKey)!.push(weekly)
  })

  const monthlyAnalytics: MonthlyAnalytics[] = []
  const monthlyStats: Map<string, number> = new Map() // for calculating improvement

  const sortedMonths = Array.from(groupedByMonth.keys()).sort()

  sortedMonths.forEach((monthKey, index) => {
    const weeklyList = groupedByMonth.get(monthKey)!
    const [year, month] = monthKey.split('-').map(Number)

    const totalNegativeMarks = weeklyList.reduce((sum, w) => sum + w.totalNegativeMarks, 0)
    const totalQuestions = weeklyList.reduce((sum, w) => sum + w.totalQuestions, 0)
    const examsCount = weeklyList.reduce((sum, w) => sum + w.examsCount, 0)
    const negativeMarkPercentage = (totalNegativeMarks / totalQuestions) * 100

    // Calculate improvement from previous month
    let improvement = 0
    if (index > 0) {
      const prevMonthKey = sortedMonths[index - 1]
      const prevMonthPercentage = monthlyStats.get(prevMonthKey) || 0
      improvement = prevMonthPercentage - negativeMarkPercentage
    }

    monthlyStats.set(monthKey, negativeMarkPercentage)

    monthlyAnalytics.push({
      month,
      year,
      examsCount,
      totalNegativeMarks,
      totalQuestions,
      negativeMarkPercentage,
      weeklyBreakdown: weeklyList,
      improvement,
    })
  })

  return monthlyAnalytics
}

/**
 * Build complete student performance dashboard
 */
export const buildPerformanceDashboard = (
  userId: string,
  userName: string,
  results: ExamResult[]
): StudentPerformanceDashboard => {
  const overall = calculateNegativeMarkStats(results)
  const daily = calculateDailyAnalytics(results)
  const weekly = calculateWeeklyAnalytics(results)
  const monthly = calculateMonthlyAnalytics(results)

  // Build chart data
  const dailyTrend = daily.map(d => ({
    date: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    percentage: Math.round(d.negativeMarkPercentage * 100) / 100,
  }))

  const weeklyTrend = weekly.map(w => ({
    week: `Week of ${new Date(w.weekStart).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    })}`,
    percentage: Math.round(w.negativeMarkPercentage * 100) / 100,
  }))

  const monthlyTrend = monthly.map(m => ({
    month: new Date(m.year, m.month - 1).toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric',
    }),
    percentage: Math.round(m.negativeMarkPercentage * 100) / 100,
  }))

  return {
    userId,
    userName,
    overall,
    daily,
    weekly,
    monthly,
    charts: {
      dailyTrend,
      weeklyTrend,
      monthlyTrend,
    },
  }
}

/**
 * Get daily negative mark percentage
 */
export const getDailyNegativeMarkPercentage = (results: ExamResult[], date: Date): number => {
  const dateStr = date.toISOString().split('T')[0]
  const dayResults = results.filter(
    r => new Date(r.createdAt).toISOString().split('T')[0] === dateStr
  )

  if (dayResults.length === 0) return 0

  const totalNegativeMarks = dayResults.reduce((sum, r) => sum + r.negativeMarks, 0)
  const totalQuestions = dayResults.reduce((sum, r) => sum + r.totalQuestions, 0)

  return (totalNegativeMarks / totalQuestions) * 100
}

/**
 * Get weekly negative mark percentage
 */
export const getWeeklyNegativeMarkPercentage = (results: ExamResult[], weekStart: Date): number => {
  const weekEnd = new Date(weekStart)
  weekEnd.setDate(weekStart.getDate() + 6)

  const weekResults = results.filter(r => {
    const resultDate = new Date(r.createdAt)
    return resultDate >= weekStart && resultDate <= weekEnd
  })

  if (weekResults.length === 0) return 0

  const totalNegativeMarks = weekResults.reduce((sum, r) => sum + r.negativeMarks, 0)
  const totalQuestions = weekResults.reduce((sum, r) => sum + r.totalQuestions, 0)

  return (totalNegativeMarks / totalQuestions) * 100
}

/**
 * Get monthly negative mark percentage
 */
export const getMonthlyNegativeMarkPercentage = (results: ExamResult[], month: number, year: number): number => {
  const monthResults = results.filter(r => {
    const resultDate = new Date(r.createdAt)
    return resultDate.getMonth() === month - 1 && resultDate.getFullYear() === year
  })

  if (monthResults.length === 0) return 0

  const totalNegativeMarks = monthResults.reduce((sum, r) => sum + r.negativeMarks, 0)
  const totalQuestions = monthResults.reduce((sum, r) => sum + r.totalQuestions, 0)

  return (totalNegativeMarks / totalQuestions) * 100
}
