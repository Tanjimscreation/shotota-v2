const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Hash passwords
  const adminPassword = await bcrypt.hash('hashed_password_123', 10)
  const studentPassword = await bcrypt.hash('password', 10)

  // Clear existing users
  await prisma.user.deleteMany()

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
  console.log('✅ Admin created:', admin.email)

  // Create student users
  const student1 = await prisma.user.create({
    data: {
      email: 'test@test.com',
      password: studentPassword,
      name: 'Test Student',
      phone: '01700000001',
      batch: 'MBBS-2025',
      role: 'STUDENT'
    }
  })
  console.log('✅ Student created:', student1.email)

  console.log('🎉 Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
