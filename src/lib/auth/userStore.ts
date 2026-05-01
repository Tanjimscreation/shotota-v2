// lib/auth/userStore.ts
// Shared in-memory user store for when database is unavailable

export interface StoredUser {
  id: string
  email: string
  password: string
  name: string
  phone: string | null
  batch: string | null
  role: 'STUDENT' | 'ADMIN'
  createdAt: Date
  updatedAt: Date
}

class UserStore {
  private users: StoredUser[] = []

  addUser(user: StoredUser) {
    this.users.push(user)
  }

  findByEmail(email: string): StoredUser | undefined {
    return this.users.find(u => u.email === email)
  }

  getAllUsers(): StoredUser[] {
    return this.users
  }

  clear() {
    this.users = []
  }
}

export const userStore = new UserStore()
