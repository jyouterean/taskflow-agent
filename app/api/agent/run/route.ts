import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { prisma } from '@/lib/prisma'
import { runAgent } from '@/lib/agent/service'
import { z } from 'zod'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
// Vercel Functionsでのタイムアウト延長（必要に応じて）
// export const maxDuration = 60

const RequestSchema = z.object({
  type: z.enum(['INTAKE', 'PLANNER', 'OPS', 'EMBED_COPILOT']),
  input: z.string().min(1).max(10000),
  projectId: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    // Auth check
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user's organization
    const membership = await prisma.membership.findFirst({
      where: {
        userId: session.user.id,
        deletedAt: null,
      },
      orderBy: { createdAt: 'desc' },
    })

    if (!membership) {
      return NextResponse.json({ error: 'No organization found' }, { status: 404 })
    }

    // Parse request
    const body = await request.json().catch(() => null)
    if (!body) {
      return NextResponse.json(
        { error: 'Invalid request: JSON body is required' },
        { status: 400 }
      )
    }

    const { type, input, projectId } = RequestSchema.parse(body)

    // Run agent
    const result = await runAgent({
      type,
      input,
      orgId: membership.orgId,
      userId: session.user.id,
      context: {
        projectId,
      },
    })

    if (!result.success) {
      return NextResponse.json(
        {
          ok: false,
          error: result.error || 'Agent execution failed',
        },
        { status: 500 }
      )
    }

    return NextResponse.json({
      ok: true,
      success: true,
      output: result.output,
      approvalRequired: result.approvalRequired,
      usage: result.usage,
    })
  } catch (error: any) {
    // エラーログを詳細に出力（Vercel Logsで特定しやすくする）
    console.error('[/api/agent/run] error:', error)
    console.error('Error details:', {
      name: error?.name,
      message: error?.message,
      stack: error?.stack,
    })

    if (error.name === 'ZodError') {
      return NextResponse.json(
        {
          ok: false,
          error: 'Invalid request',
          details: error.errors,
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : 'Unknown error in /api/agent/run',
      },
      { status: 500 }
    )
  }
}

