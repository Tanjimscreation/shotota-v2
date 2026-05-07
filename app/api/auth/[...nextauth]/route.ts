// app/api/auth/[...nextauth]/route.ts

import NextAuth, { type NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/db/client'
import { userStore } from '@/lib/auth/userStore'

// Generate a default secret for development if not provided
const getSecret = () => {
  if (process.env.NEXTAUTH_SECRET) {
    return process.env.NEXTAUTH_SECRET
  }
  // Fallback for development
  return 'development-secret-key-change-in-production-' + Math.random().toString(36).substring(2)
}

// Test database connection on startup
const testDatabaseConnection = async () => {
  try {
    await prisma.$queryRaw`SELECT 1`
    console.log('✅ Database connection verified')
    return true
  } catch (error) {
    console.error('❌ Database connection failed:', error)
    return false
  }
}

export const authOptions: NextAuthOptions = {
  // Use JWT strategy instead of database adapter for serverless compatibility
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            console.log('❌ Missing email or password')
            return null
          }

          let user = null

          try {
            // Try database first
            user = await prisma.user.findUnique({
              where: { email: credentials.email.toLowerCase() },
              select: {
                id: true,
                email: true,
                password: true,
                name: true,
                role: true,
              }
            })
            
            if (user) {
              console.log('✅ User found in database:', user.email)
            }
          } catch (dbError: any) {
            console.log('⚠️ Database error, checking fallback store:', dbError.message)
            // Fall back to in-memory store
            const memoryUser = userStore.findByEmail(credentials.email)
            if (memoryUser) {
              user = memoryUser
              console.log('✅ User found in memory store:', user.email)
            }
          }

          if (!user) {
            console.log('❌ User not found:', credentials.email)
            return null
          }

          // Compare password with bcrypt
          const isPasswordValid = await bcrypt.compare(credentials.password, user.password)

          if (!isPasswordValid) {
            console.log('❌ Invalid password for:', credentials.email)
            return null
          }

          console.log('✅ Authentication successful for:', credentials.email)

          // Return user object for session
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: (user.role || 'STUDENT') as 'STUDENT' | 'ADMIN',
          }
        } catch (error: any) {
          console.error('❌ Auth error:', error.message || error)
          return null
        }
      },
    }),
  ],
  pages: {
    signIn: '/login',
    error: '/login',
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id
        token.email = user.email
        token.name = user.name
        token.role = (user as any).role || 'STUDENT'
      }
      return token
    },
    async session({ session, token }) {
      if (session && session.user) {
        session.user.id = token.id as string
        session.user.email = token.email as string
        session.user.name = token.name as string
        ;(session.user as any).role = token.role || 'STUDENT'
      }
      return session
    },
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 1 day
  },
  secret: getSecret(),
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
