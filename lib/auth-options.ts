import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { compare, hash } from 'bcryptjs'
import { PrismaClient } from '@prisma/client'

// Extend next-auth types
declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email: string
      name?: string | null
      image?: string | null
    }
  }
  interface User {
    id: string
    email: string
    name?: string | null
    image?: string | null
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    email: string
    name?: string | null
    image?: string | null
  }
}

// Helper to hash passwords
export async function hashPassword(password: string): Promise<string> {
  return hash(password, 12)
}

// Helper to verify passwords
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return compare(password, hashedPassword)
}

// Lazy-initialized Prisma client for auth
let _prisma: PrismaClient | null = null
function getAuthPrisma(): PrismaClient {
  if (!_prisma) {
    _prisma = new PrismaClient()
  }
  return _prisma
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('メールアドレスとパスワードを入力してください')
        }

        const prisma = getAuthPrisma()
        
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        })

        if (!user) {
          throw new Error('メールアドレスまたはパスワードが正しくありません')
        }

        if (user.deletedAt) {
          throw new Error('このアカウントは無効化されています')
        }

        // Verify password
        if (!user.passwordHash) {
          throw new Error('パスワードが設定されていません。管理者にお問い合わせください')
        }

        const isValid = await verifyPassword(credentials.password, user.passwordHash)
        if (!isValid) {
          throw new Error('メールアドレスまたはパスワードが正しくありません')
        }
        
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: '/login',
    signOut: '/logout',
    error: '/login',
    newUser: '/app/dashboard',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.email = user.email
        token.name = user.name
        token.image = user.image
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          id: token.id,
          email: token.email,
          name: token.name,
          image: token.image,
        }
      }
      return session
    },
  },
  events: {
    async signIn({ user }) {
      console.log(`User signed in: ${user.email}`)
    },
    async signOut({ token }) {
      console.log(`User signed out: ${token?.email}`)
    },
  },
  debug: process.env.NODE_ENV === 'development',
}

