import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Clear existing data
  await prisma.examResult.deleteMany()
  await prisma.question.deleteMany()
  await prisma.exam.deleteMany()
  await prisma.enrollment.deleteMany()
  await prisma.leaderboardEntry.deleteMany()
  await prisma.course.deleteMany()
  await prisma.user.deleteMany()

  // Hash passwords
  const adminPassword = await bcrypt.hash('hashed_password_123', 10)
  const studentPassword = await bcrypt.hash('password', 10)

  // Create ADMIN user
  const admin = await prisma.user.create({
    data: {
      email: 'rahim@shotota.com',
      password: adminPassword,
      name: 'আবদুর রহিম (Admin)',
      phone: '01700000000',
      batch: 'ADMIN',
      role: 'ADMIN'
    }
  })

  // Create student users
  const user1 = await prisma.user.create({
    data: {
      email: 'test@test.com',
      password: studentPassword,
      name: 'Test Student',
      phone: '01700000001',
      batch: 'MBBS-2025',
      role: 'STUDENT'
    }
  })

  const user2 = await prisma.user.create({
    data: {
      email: 'karim@shotota.com',
      password: studentPassword,
      name: 'মোহাম্মদ করিম',
      phone: '01700000002',
      batch: 'MBBS-2025',
      role: 'STUDENT'
    }
  })

  const user3 = await prisma.user.create({
    data: {
      email: 'nazma@shotota.com',
      password: studentPassword,
      name: 'নাজমা আক্তার',
      phone: '01700000003',
      batch: 'MBBS-2026',
      role: 'STUDENT'
    }
  })

  const user4 = await prisma.user.create({
    data: {
      email: 'sara@shotota.com',
      password: studentPassword,
      name: 'সারা খান',
      phone: '01700000004',
      batch: 'MBBS-2026',
      role: 'STUDENT'
    }
  })

  const user5 = await prisma.user.create({
    data: {
      email: 'ali@shotota.com',
      password: 'hashed_password_123',
      name: 'আলী হোসেন',
      phone: '01700000005',
      batch: 'MBBS-2025',
      role: 'STUDENT'
    }
  })

  console.log('✅ Created 5 users')

  // Create courses
  const course1 = await prisma.course.create({
    data: {
      title: 'সাধারণ জীববিজ্ঞান - ১',
      description: 'কোশ, টিস্যু এবং অঙ্গ সম্পর্কে বিস্তারিত অধ্যয়ন',
      instructor: 'ডা. রহিম',
      duration: 8,
      category: 'জীববিজ্ঞান',
      lessons: 24,
      price: 0
    }
  })

  const course2 = await prisma.course.create({
    data: {
      title: 'অর্গানিক রসায়ন মৌলিক',
      description: 'কার্বনিক যৌগ এবং তাদের বৈশিষ্ট্য',
      instructor: 'প্রফেসর নাজমুল',
      duration: 10,
      category: 'রসায়ন',
      lessons: 32,
      price: 0
    }
  })

  const course3 = await prisma.course.create({
    data: {
      title: 'পদার্থবিজ্ঞানের ভিত্তি',
      description: 'গতিবিদ্যা, তরঙ্গ এবং শক্তি নীতি',
      instructor: 'মিস সিদ্ধান্তা',
      duration: 9,
      category: 'পদার্থবিজ্ঞান',
      lessons: 28,
      price: 0
    }
  })

  console.log('✅ Created 3 courses')

  // Create enrollments
  await prisma.enrollment.create({
    data: {
      userId: user1.id,
      courseId: course1.id,
      paymentStatus: 'VERIFIED'
    }
  })

  await prisma.enrollment.create({
    data: {
      userId: user1.id,
      courseId: course2.id,
      paymentStatus: 'PENDING'
    }
  })

  await prisma.enrollment.create({
    data: {
      userId: user2.id,
      courseId: course1.id,
      paymentStatus: 'VERIFIED'
    }
  })

  await prisma.enrollment.create({
    data: {
      userId: user3.id,
      courseId: course2.id,
      paymentStatus: 'VERIFIED'
    }
  })

  console.log('✅ Created enrollments')

  // Create exam
  const exam1 = await prisma.exam.create({
    data: {
      courseId: course1.id,
      title: 'জীববিজ্ঞান প্রথম পরীক্ষা',
      description: 'মানুষের শরীর এবং জীবন প্রক্রিয়া সম্পর্কে পরীক্ষা',
      duration: 30,
      totalQuestions: 5,
      negativeMarking: 0.25,
      passingScore: 60
    }
  })

  console.log('✅ Created exam')

  // Create questions
  const questions = [
    {
      examId: exam1.id,
      questionText: 'মানুষের শরীরে কয়টি হাড় আছে?',
      optionA: '180',
      optionB: '206',
      optionC: '250',
      optionD: '300',
      correctAnswer: 'B',
      explanation: 'একজন প্রাপ্তবয়স্ক মানুষের শরীরে 206টি হাড় থাকে।',
      order: 1
    },
    {
      examId: exam1.id,
      questionText: 'হিমোগ্লোবিনের প্রধান কাজ কী?',
      optionA: 'পুষ্টি সরবরাহ',
      optionB: 'অক্সিজেন পরিবহন',
      optionC: 'রোগ প্রতিরোধ',
      optionD: 'তাপমাত্রা নিয়ন্ত্রণ',
      correctAnswer: 'B',
      explanation: 'হিমোগ্লোবিন লোহিত রক্তকণিকায় থাকে এবং ফুসফুস থেকে অক্সিজেন সংগ্রহ করে শরীরের সমস্ত কোষে পরিবহন করে।',
      order: 2
    },
    {
      examId: exam1.id,
      questionText: 'ডিএনএ-এর সম্পূর্ণ রূপ কী?',
      optionA: 'Deoxyribose Nucleic Acid',
      optionB: 'Deoxyribonucleic Acid',
      optionC: 'Dioxid Nucleic Acid',
      optionD: 'Deoxid Nucleotic Acid',
      correctAnswer: 'B',
      explanation: 'DNA-এর সম্পূর্ণ রূপ Deoxyribonucleic Acid। এটি একটি জটিল জৈব অণু যা জীবন্ত প্রাণীদের মধ্যে জেনেটিক তথ্য বহন করে।',
      order: 3
    },
    {
      examId: exam1.id,
      questionText: 'মাইটোকন্ড্রিয়াকে কী বলা হয়?',
      optionA: 'ঘুম কেন্দ্র',
      optionB: 'শক্তির কেন্দ্র',
      optionC: 'চিন্তার কেন্দ্র',
      optionD: 'স্মৃতির কেন্দ্র',
      correctAnswer: 'B',
      explanation: 'মাইটোকন্ড্রিয়াকে কোষের শক্তির কেন্দ্র বা পাওয়ার হাউস বলা হয়। এটি ATP তৈরি করে যা কোষের সমস্ত কাজের জন্য শক্তি সরবরাহ করে।',
      order: 4
    },
    {
      examId: exam1.id,
      questionText: 'সবুজ উদ্ভিদ কী প্রক্রিয়ায় খাদ্য তৈরি করে?',
      optionA: 'শ্বসন',
      optionB: 'প্রস্বেদন',
      optionC: 'সালোকসংশ্লেষণ',
      optionD: 'রূপান্তর',
      correctAnswer: 'C',
      explanation: 'সালোকসংশ্লেষণ এমন একটি প্রক্রিয়া যেখানে সবুজ উদ্ভিদ সূর্যালোক, জল এবং কার্বন ডাইঅক্সাইড ব্যবহার করে গ্লুকোজ এবং অক্সিজেন তৈরি করে।',
      order: 5
    }
  ]

  for (const q of questions) {
    await prisma.question.create({
      data: q
    })
  }

  console.log('✅ Created 5 questions')

  // Create exam results
  await prisma.examResult.create({
    data: {
      userId: user1.id,
      examId: exam1.id,
      totalQuestions: 5,
      correctAnswers: 4,
      wrongAnswers: 1,
      unattempted: 0,
      score: 4,
      percentage: 80,
      timeTaken: 900,
      status: 'COMPLETED',
      answers: {
        q1: 'B',
        q2: 'B',
        q3: 'B',
        q4: 'A',
        q5: 'C'
      }
    }
  })

  await prisma.examResult.create({
    data: {
      userId: user2.id,
      examId: exam1.id,
      totalQuestions: 5,
      correctAnswers: 3,
      wrongAnswers: 2,
      unattempted: 0,
      score: 3,
      percentage: 60,
      timeTaken: 1200,
      status: 'COMPLETED',
      answers: {
        q1: 'B',
        q2: 'C',
        q3: 'B',
        q4: 'B',
        q5: 'C'
      }
    }
  })

  console.log('✅ Created exam results')

  // Create leaderboard entries
  await prisma.leaderboardEntry.create({
    data: {
      userId: user1.id,
      userName: 'আবদুর রহিম',
      batch: 'MBBS-2025',
      totalScore: 8.0,
      examCount: 2,
      avgScore: 4.0,
      rank: 1,
      streak: 5
    }
  })

  await prisma.leaderboardEntry.create({
    data: {
      userId: user2.id,
      userName: 'মোহাম্মদ করিম',
      batch: 'MBBS-2025',
      totalScore: 7.5,
      examCount: 2,
      avgScore: 3.75,
      rank: 2,
      streak: 3
    }
  })

  await prisma.leaderboardEntry.create({
    data: {
      userId: user3.id,
      userName: 'নাজমা আক্তার',
      batch: 'MBBS-2026',
      totalScore: 6.8,
      examCount: 1,
      avgScore: 6.8,
      rank: 3,
      streak: 2
    }
  })

  await prisma.leaderboardEntry.create({
    data: {
      userId: user4.id,
      userName: 'সারা খান',
      batch: 'MBBS-2026',
      totalScore: 5.2,
      examCount: 1,
      avgScore: 5.2,
      rank: 4,
      streak: 1
    }
  })

  await prisma.leaderboardEntry.create({
    data: {
      userId: user5.id,
      userName: 'আলী হোসেন',
      batch: 'MBBS-2025',
      totalScore: 4.5,
      examCount: 1,
      avgScore: 4.5,
      rank: 5,
      streak: 1
    }
  })

  console.log('✅ Created leaderboard entries')

  console.log('✨ Database seeding completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })