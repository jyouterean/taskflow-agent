import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { prisma } from '@/lib/prisma'
import { runAgent } from '@/lib/agent/service'
import { z } from 'zod'

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
    const body = await request.json()
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
      return NextResponse.json({ error: result.error }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      output: result.output,
      approvalRequired: result.approvalRequired,
      usage: result.usage,
    })
  } catch (error: any) {
    console.error('Agent API error:', error)
    
    if (error.name === 'ZodError') {
      return NextResponse.json({ error: 'Invalid request', details: error.errors }, { status: 400 })
    }

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

