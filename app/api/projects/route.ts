import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { z } from 'zod'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const CreateProjectSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(2000).optional(),
})

// GET /api/projects - List projects
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { prisma } = await import('@/lib/prisma')

    const membership = await prisma.membership.findFirst({
      where: {
        userId: session.user.id,
        deletedAt: null,
      },
    })

    if (!membership) {
      return NextResponse.json({ error: 'No organization found' }, { status: 404 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')

    const projects = await prisma.project.findMany({
      where: {
        orgId: membership.orgId,
        ...(status && { status: status as any }),
      },
      include: {
        owner: {
          select: { id: true, name: true, image: true },
        },
        _count: {
          select: { tasks: true },
        },
      },
      orderBy: { updatedAt: 'desc' },
    })

    // Get task stats for each project
    const projectsWithStats = await Promise.all(
      projects.map(async (project) => {
        const taskStats = await prisma.task.groupBy({
          by: ['status'],
          where: { projectId: project.id },
          _count: true,
        })

        const stats = {
          total: project._count.tasks,
          completed: taskStats.find((s) => s.status === 'COMPLETED')?._count || 0,
          inProgress: taskStats.find((s) => s.status === 'IN_PROGRESS')?._count || 0,
        }

        return {
          ...project,
          stats,
        }
      })
    )

    return NextResponse.json(projectsWithStats)
  } catch (error) {
    console.error('[/api/projects] GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/projects - Create project
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { prisma } = await import('@/lib/prisma')
    const { auditLog } = await import('@/lib/audit')

    const membership = await prisma.membership.findFirst({
      where: {
        userId: session.user.id,
        deletedAt: null,
      },
    })

    if (!membership) {
      return NextResponse.json({ error: 'No organization found' }, { status: 404 })
    }

    // Only Admin and Manager can create projects
    if (membership.role === 'MEMBER') {
      return NextResponse.json({ error: 'Permission denied' }, { status: 403 })
    }

    const body = await request.json().catch(() => null)
    if (!body) {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
    }

    const data = CreateProjectSchema.parse(body)

    const project = await prisma.project.create({
      data: {
        orgId: membership.orgId,
        name: data.name,
        description: data.description,
        ownerId: session.user.id,
      },
      include: {
        owner: {
          select: { id: true, name: true, image: true },
        },
      },
    })

    // Audit log
    await auditLog(
      { user: session.user as any, orgId: membership.orgId, role: membership.role },
      'CREATE',
      'PROJECT',
      project.id,
      { name: project.name },
      request
    )

    return NextResponse.json(project, { status: 201 })
  } catch (error: any) {
    console.error('[/api/projects] POST error:', error)

    if (error.name === 'ZodError') {
      return NextResponse.json({ error: 'Invalid request', details: error.errors }, { status: 400 })
    }

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
