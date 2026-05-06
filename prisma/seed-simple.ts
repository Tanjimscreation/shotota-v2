import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database with demo accounts...')

  try {
    // Check if users already exist
    const adminExists = await prisma.user.findUnique({
      where: { email: 'rahim@shotota.com' }
    })

    if (adminExists) {
      console.log('✅ Admin account already exists')
    } else {
      // Create ADMIN user
      const adminPassword = await bcrypt.hash('hashed_password_123', 10)
      await prisma.user.create({
        data: {
          email: 'rahim@shotota.com',
          password: adminPassword,
          name: 'Admin User',
          phone: '01700000000',
          batch: 'ADMIN',
          role: 'ADMIN'
        }
      })
      console.log('✅ Admin account created (rahim@shotota.com / hashed_password_123)')
    }

    const studentExists = await prisma.user.findUnique({
      where: { email: 'test@test.com' }
    })

    if (studentExists) {
      console.log('✅ Student account already exists')
    } else {
      // Create STUDENT user
      const studentPassword = await bcrypt.hash('password', 10)
      await prisma.user.create({
        data: {
          email: 'test@test.com',
          password: studentPassword,
          name: 'Test Student',
          phone: '01700000001',
          batch: '2024',
          role: 'STUDENT'
        }
      })
      console.log('✅ Student account created (test@test.com / password)')
    }

    console.log('🌱 Seeding complete!')
  } catch (error) {
    console.error('❌ Seeding error:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

main()
