// app/api/auth/[...nextauth]/route.ts

import NextAuth, { type NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

// Mock users for development (in case database is unavailable)
const MOCK_USERS = [
  {
    id: 'user-1',
    email: 'rahim@shotota.com',
    name: 'আবদুর রহিম',
    password: 'hashed_password_123',
    role: 'ADMIN', // Admin user for testing admin features
  },
  {
    id: 'user-2',
    email: 'test@test.com',
    name: 'Test User',
    password: 'password',
    role: 'STUDENT',
  },
]

// Generate a default secret for development if not provided
const getSecret = () => {
  if (process.env.NEXTAUTH_SECRET) {
    return process.env.NEXTAUTH_SECRET
  }
  // Fallback for development
  return 'development-secret-key-change-in-production-' + Math.random().toString(36).substring(2)
}

export const authOptions: NextAuthOptions = {
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
            return null
          }

          // Use mock users for development (database unavailable)
          const mockUser = MOCK_USERS.find((u) => u.email === credentials.email)
          
          if (mockUser && credentials.password === mockUser.password) {
            return {
              id: mockUser.id,
              email: mockUser.email,
              name: mockUser.name,
              role: mockUser.role as 'STUDENT' | 'ADMIN',
            }
          }
          
          return null
        } catch (error) {
          console.error('Auth error:', error)
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
  jwt: {
    secret: getSecret(),
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: getSecret(),
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
