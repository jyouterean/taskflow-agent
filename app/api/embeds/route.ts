import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { prisma } from '@/lib/prisma'
import { auditLog } from '@/lib/audit'
import { z } from 'zod'
import { randomBytes } from 'crypto'

const CreateEmbedSchema = z.object({
  name: z.string().min(1).max(100),
  type: z.enum(['IFRAME', 'JS_WIDGET']).default('IFRAME'),
  targetType: z.enum(['MY_TASKS', 'PROJECT', 'SAVED_FILTER']),
  targetId: z.string().optional(),
  viewMode: z.enum(['LIST', 'BOARD', 'MINI_DASHBOARD']),
  permissions: z.enum(['VIEW_ONLY', 'OPERATIONS_ALLOWED']).default('VIEW_ONLY'),
  allowedDomains: z.array(z.string()).min(1),
  tokenExpiresAt: z.string().datetime().optional(),
})

// GET /api/embeds - List embeds
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const membership = await prisma.membership.findFirst({
      where: {
        userId: session.user.id,
        deletedAt: null,
      },
    })

    if (!membership) {
      return NextResponse.json({ error: 'No organization found' }, { status: 404 })
    }

    // Only Admin and Manager can access embeds
    if (membership.role === 'MEMBER') {
      return NextResponse.json({ error: 'Permission denied' }, { status: 403 })
    }

    const embeds = await prisma.embedWidget.findMany({
      where: { orgId: membership.orgId },
      include: {
        project: {
          select: { id: true, name: true },
        },
        _count: {
          select: { embedLogs: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(embeds)
  } catch (error) {
    console.error('Embeds API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/embeds - Create embed
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const membership = await prisma.membership.findFirst({
      where: {
        userId: session.user.id,
        deletedAt: null,
      },
    })

    if (!membership) {
      return NextResponse.json({ error: 'No organization found' }, { status: 404 })
    }

    // Only Admin can create embeds with OPERATIONS_ALLOWED
    if (membership.role === 'MEMBER') {
      return NextResponse.json({ error: 'Permission denied' }, { status: 403 })
    }

    const body = await request.json()
    const data = CreateEmbedSchema.parse(body)

    // Check if OPERATIONS_ALLOWED requires Admin
    if (data.permissions === 'OPERATIONS_ALLOWED' && membership.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Only Admin can create embeds with operations allowed' },
        { status: 403 }
      )
    }

    // Verify project if specified
    if (data.targetType === 'PROJECT' && data.targetId) {
      const project = await prisma.project.findUnique({
        where: { id: data.targetId },
      })
      if (!project || project.orgId !== membership.orgId) {
        return NextResponse.json({ error: 'Project not found' }, { status: 404 })
      }
    }

    // Generate secure token
    const token = randomBytes(32).toString('hex')

    const embed = await prisma.embedWidget.create({
      data: {
        orgId: membership.orgId,
        name: data.name,
        type: data.type,
        targetType: data.targetType,
        targetId: data.targetId,
        viewMode: data.viewMode,
        permissions: data.permissions,
        allowedDomains: data.allowedDomains,
        token,
        tokenExpiresAt: data.tokenExpiresAt ? new Date(data.tokenExpiresAt) : null,
      },
      include: {
        project: {
          select: { id: true, name: true },
        },
      },
    })

    // Audit log
    await auditLog(
      { user: session.user as any, orgId: membership.orgId, role: membership.role },
      'CREATE',
      'EMBED',
      embed.id,
      { name: embed.name, permissions: embed.permissions },
      request
    )

    return NextResponse.json(embed, { status: 201 })
  } catch (error: any) {
    console.error('Embeds API error:', error)

    if (error.name === 'ZodError') {
      return NextResponse.json({ error: 'Invalid request', details: error.errors }, { status: 400 })
    }

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

