// src/components/exam/NegativeMarkTracker.tsx

'use client'

import React, { useState } from 'react'
import { StudentPerformanceDashboard } from '@/types'

interface Props {
  dashboard: StudentPerformanceDashboard
}

type TimePeriod = 'daily' | 'weekly' | 'monthly'

export const NegativeMarkTracker: React.FC<Props> = ({ dashboard }) => {
  const [period, setPeriod] = useState<TimePeriod>('daily')

  const getTrendIndicator = (trend: string) => {
    switch (trend) {
      case 'improving':
        return '📈 Improving'
      case 'declining':
        return '📉 Declining'
      default:
        return '➡️ Stable'
    }
  }

  return (
    <div className="w-full bg-white rounded-lg shadow-lg p-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Negative Mark Tracker</h2>
        <p className="text-gray-600">Track your negative marking performance over time</p>
      </div>

      {/* Overall Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <p className="text-gray-600 text-sm">Total Exams</p>
          <p className="text-2xl font-bold text-blue-600">{dashboard.overall.totalExams}</p>
        </div>
        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
          <p className="text-gray-600 text-sm">Total Negative Marks</p>
          <p className="text-2xl font-bold text-red-600">{dashboard.overall.totalNegativeMarks.toFixed(2)}</p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
          <p className="text-gray-600 text-sm">Negative Mark %</p>
          <p className="text-2xl font-bold text-purple-600">
            {dashboard.overall.negativeMarkPercentage.toFixed(2)}%
          </p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <p className="text-gray-600 text-sm">Trend</p>
          <p className="text-lg font-bold text-green-600">{getTrendIndicator(dashboard.overall.trend)}</p>
        </div>
      </div>

      {/* Time Period Toggle */}
      <div className="flex gap-2 mb-6 border-b">
        <button
          onClick={() => setPeriod('daily')}
          className={`px-4 py-2 font-semibold ${
            period === 'daily'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Daily
        </button>
        <button
          onClick={() => setPeriod('weekly')}
          className={`px-4 py-2 font-semibold ${
            period === 'weekly'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Weekly
        </button>
        <button
          onClick={() => setPeriod('monthly')}
          className={`px-4 py-2 font-semibold ${
            period === 'monthly'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Monthly
        </button>
      </div>

      {/* Daily Analytics */}
      {period === 'daily' && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Daily Performance</h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {dashboard.daily.length === 0 ? (
              <p className="text-gray-500">No exams yet</p>
            ) : (
              dashboard.daily.map((daily, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div>
                    <p className="font-semibold text-gray-800">
                      {new Date(daily.date).toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </p>
                    <p className="text-sm text-gray-600">
                      {daily.examsCount} exam{daily.examsCount !== 1 ? 's' : ''} • {daily.totalQuestions} questions
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-red-600">
                      {daily.negativeMarkPercentage.toFixed(2)}%
                    </p>
                    <p className="text-sm text-gray-600">{daily.totalNegativeMarks.toFixed(1)} marks</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Weekly Analytics */}
      {period === 'weekly' && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Weekly Performance</h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {dashboard.weekly.length === 0 ? (
              <p className="text-gray-500">No data yet</p>
            ) : (
              dashboard.weekly.map((weekly, idx) => (
                <div key={idx} className="p-4 bg-gray-50 rounded">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-semibold text-gray-800">
                        Week of {new Date(weekly.weekStart).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </p>
                      <p className="text-sm text-gray-600">
                        {weekly.examsCount} exams • {weekly.totalQuestions} questions
                      </p>
                    </div>
                    <p className="text-lg font-bold text-red-600">
                      {weekly.negativeMarkPercentage.toFixed(2)}%
                    </p>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div
                      className="bg-red-500 h-2 rounded-full"
                      style={{ width: `${Math.min(weekly.negativeMarkPercentage, 100)}%` }}
                    ></div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Monthly Analytics */}
      {period === 'monthly' && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Monthly Performance</h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {dashboard.monthly.length === 0 ? (
              <p className="text-gray-500">No data yet</p>
            ) : (
              dashboard.monthly.map((monthly, idx) => {
                const monthName = new Date(monthly.year, monthly.month - 1).toLocaleDateString('en-US', {
                  month: 'long',
                  year: 'numeric',
                })
                const improvementColor =
                  monthly.improvement > 0 ? 'text-green-600' : monthly.improvement < 0 ? 'text-red-600' : 'text-gray-600'

                return (
                  <div key={idx} className="p-4 bg-gray-50 rounded">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-semibold text-gray-800">{monthName}</p>
                        <p className="text-sm text-gray-600">
                          {monthly.examsCount} exams • {monthly.totalQuestions} questions
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-red-600">
                          {monthly.negativeMarkPercentage.toFixed(2)}%
                        </p>
                        {idx > 0 && (
                          <p className={`text-sm font-semibold ${improvementColor}`}>
                            {monthly.improvement > 0 ? '✓' : monthly.improvement < 0 ? '✗' : '='}{' '}
                            {Math.abs(monthly.improvement).toFixed(2)}%
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div
                        className="bg-red-500 h-2 rounded-full"
                        style={{ width: `${Math.min(monthly.negativeMarkPercentage, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>
      )}

      {/* Insights */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <p className="font-semibold text-blue-900 mb-2">💡 Insights</p>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Average: {dashboard.overall.averageNegativeMarksPerExam.toFixed(2)} negative marks per exam</li>
          <li>• Trend: {dashboard.overall.trend === 'improving' ? '📈 You are improving!' : 
                        dashboard.overall.trend === 'declining' ? '📉 Focus on accuracy' : '➡️ Performance is stable'}</li>
          <li>• Total: {dashboard.overall.totalNegativeMarks.toFixed(0)} marks lost across {dashboard.overall.totalExams} exams</li>
        </ul>
      </div>
    </div>
  )
}
