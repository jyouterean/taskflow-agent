import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Check if DATABASE_URL is set
if (!process.env.DATABASE_URL) {
  console.error('⚠️  DATABASE_URL environment variable is not set!')
  console.error('Please set DATABASE_URL in your .env file or environment variables.')
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    errorFormat: 'pretty',
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// Test database connection on initialization (only in development)
if (process.env.NODE_ENV === 'development') {
  prisma.$connect()
    .then(() => {
      console.log('✅ Prisma connected to database')
    })
    .catch((error) => {
      console.error('❌ Prisma connection error:', error)
      console.error('Please check your DATABASE_URL in .env file')
    })
}

