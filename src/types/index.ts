// src/types/index.ts

// User Types
export type UserRole = 'STUDENT' | 'ADMIN'

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  phone?: string
  avatar?: string
  bio?: string
  createdAt: Date
  updatedAt: Date
}

export interface AuthToken {
  token: string
  user: User
}

// Course Types
export interface Course {
  id: string
  title: string
  description: string
  price: number
  instructor: string
  duration: number // hours
  category: string
  thumbnail?: string
  createdAt: Date
  updatedAt: Date
}

export interface Enrollment {
  id: string
  userId: string
  courseId: string
  paymentStatus: PaymentStatus
  bkashNumber: string
  transactionId: string
  paymentProof: string
  enrolledAt: Date
  verifiedAt?: Date
}

export type PaymentStatus = 'PENDING' | 'VERIFIED' | 'REJECTED'

// Exam Types
export interface Exam {
  id: string
  courseId: string
  title: string
  description?: string
  duration: number // minutes
  totalQuestions: number
  negativeMarking: number
  passingScore?: number
  createdAt: Date
  updatedAt: Date
}

export interface Option {
  label: 'A' | 'B' | 'C' | 'D'
  text: string
}

export interface Question {
  id: string
  examId: string
  questionText: string
  options: Option[]
  correctAnswer: 'A' | 'B' | 'C' | 'D'
  order: number
  createdAt: Date
  updatedAt: Date
}

// Result Types
export interface ExamResult {
  id: string
  userId: string
  examId: string
  totalQuestions: number
  correctAnswers: number
  wrongAnswers: number
  unattempted: number
  score: number
  percentage: number
  negativeMarks: number
  timeTaken: number // seconds
  answers: Record<string, string> // { questionId: "A" }
  status: ExamStatus
  createdAt: Date
  updatedAt: Date
}

export type ExamStatus = 'IN_PROGRESS' | 'SUBMITTED' | 'COMPLETED' | 'GRADED'

// Leaderboard Types
export interface LeaderboardEntry {
  id: string
  userId: string
  userName: string
  totalScore: number
  examCount: number
  avgScore: number
  rank: number
}

// Upload Types
export interface Upload {
  id: string
  userId: string
  filename: string
  originalName: string
  fileType: string
  fileSize: number
  filePath: string
  createdAt: Date
}

// API Response Types
export interface ApiResponse<T> {
  data?: T
  error?: string
  message?: string
  status: number
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}
