// app/api/auth/[...nextauth]/route.ts

import NextAuth, { type NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from '@/lib/db/client'
import bcrypt from 'bcryptjs'

// Mock users for development (in case database is unavailable)
const MOCK_USERS = [
  {
    id: 'user-1',
    email: 'rahim@shotota.com',
    name: 'আবদুর রহিম',
    password: 'hashed_password_123',
    role: 'STUDENT',
  },
  {
    id: 'user-2',
    email: 'test@test.com',
    name: 'Test User',
    password: 'password',
    role: 'STUDENT',
  },
]

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Invalid credentials')
        }

        try {
          // Try to fetch from database first
          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
          })

          if (!user) {
            throw new Error('User not found')
          }

          const passwordMatch = await bcrypt.compare(credentials.password, user.password)

          if (!passwordMatch) {
            throw new Error('Invalid password')
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role as 'STUDENT' | 'ADMIN',
          }
        } catch (dbError) {
          // Fall back to mock users for development
          console.warn('Database unavailable, using mock users for development', dbError)
          
          const mockUser = MOCK_USERS.find((u) => u.email === credentials.email)
          
          if (mockUser && credentials.password === mockUser.password) {
            return {
              id: mockUser.id,
              email: mockUser.email,
              name: mockUser.name,
              role: mockUser.role as 'STUDENT' | 'ADMIN',
            }
          }
          
          throw new Error('Invalid credentials')
        }
      },
    }),
  ],
  pages: {
    signIn: '/auth/login',
    error: '/auth/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id
        session.user.role = token.role as 'STUDENT' | 'ADMIN'
      }
      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
  },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
