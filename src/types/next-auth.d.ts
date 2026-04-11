import 'next-auth'

declare module 'next-auth' {
  interface User {
    id: string
    email: string
    name: string
    role: 'STUDENT' | 'ADMIN'
  }

  interface Session {
    user: User & {
      id: string
      role: 'STUDENT' | 'ADMIN'
    }
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    role: 'STUDENT' | 'ADMIN'
  }
}
