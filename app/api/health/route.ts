import { NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    // Check DATABASE_URL
    const hasDatabaseUrl = !!process.env.DATABASE_URL
    if (!hasDatabaseUrl) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'DATABASE_URL is not set',
          checks: {
            databaseUrl: false,
            prisma: false,
          },
        },
        { status: 503 }
      )
    }

    // Test Prisma connection
    const { prisma } = await import('@/lib/prisma')
    await prisma.$queryRaw`SELECT 1`

    return NextResponse.json({
      status: 'ok',
      message: 'All systems operational',
      checks: {
        databaseUrl: true,
        prisma: true,
      },
    })
  } catch (error: any) {
    console.error('[/api/health] error:', error)

    return NextResponse.json(
      {
        status: 'error',
        message: error.message || 'Health check failed',
        checks: {
          databaseUrl: !!process.env.DATABASE_URL,
          prisma: false,
        },
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      },
      { status: 503 }
    )
  }
}

