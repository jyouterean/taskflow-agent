import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { prisma } from '@/lib/prisma'
import { auditLog } from '@/lib/audit'
import { z } from 'zod'

const CreateTaskSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(5000).optional(),
  projectId: z.string().optional(),
  dueDate: z.string().datetime().optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).default('MEDIUM'),
  assigneeId: z.string().optional(),
  tags: z.array(z.string()).optional(),
})

// GET /api/tasks - List tasks
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

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const projectId = searchParams.get('projectId')
    const assigneeId = searchParams.get('assigneeId')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    const tasks = await prisma.task.findMany({
      where: {
        orgId: membership.orgId,
        ...(status && { status: status as any }),
        ...(projectId && { projectId }),
        ...(assigneeId && { assigneeId }),
      },
      include: {
        assignee: {
          select: { id: true, name: true, image: true },
        },
        project: {
          select: { id: true, name: true },
        },
      },
      orderBy: [
        { priority: 'desc' },
        { dueDate: 'asc' },
        { createdAt: 'desc' },
      ],
      take: limit,
      skip: offset,
    })

    const total = await prisma.task.count({
      where: {
        orgId: membership.orgId,
        ...(status && { status: status as any }),
        ...(projectId && { projectId }),
        ...(assigneeId && { assigneeId }),
      },
    })

    return NextResponse.json({
      tasks,
      total,
      limit,
      offset,
    })
  } catch (error) {
    console.error('Tasks API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/tasks - Create task
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

    const body = await request.json()
    const data = CreateTaskSchema.parse(body)

    // Verify project belongs to org
    if (data.projectId) {
      const project = await prisma.project.findUnique({
        where: { id: data.projectId },
      })
      if (!project || project.orgId !== membership.orgId) {
        return NextResponse.json({ error: 'Project not found' }, { status: 404 })
      }
    }

    // Verify assignee is in org
    if (data.assigneeId) {
      const assigneeMembership = await prisma.membership.findFirst({
        where: {
          userId: data.assigneeId,
          orgId: membership.orgId,
          deletedAt: null,
        },
      })
      if (!assigneeMembership) {
        return NextResponse.json({ error: 'Assignee not found in organization' }, { status: 404 })
      }
    }

    const task = await prisma.task.create({
      data: {
        orgId: membership.orgId,
        title: data.title,
        description: data.description,
        projectId: data.projectId,
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
        priority: data.priority,
        assigneeId: data.assigneeId,
        tags: data.tags || [],
      },
      include: {
        assignee: {
          select: { id: true, name: true, image: true },
        },
        project: {
          select: { id: true, name: true },
        },
      },
    })

    // Audit log
    await auditLog(
      { user: session.user as any, orgId: membership.orgId, role: membership.role },
      'CREATE',
      'TASK',
      task.id,
      { title: task.title },
      request
    )

    return NextResponse.json(task, { status: 201 })
  } catch (error: any) {
    console.error('Tasks API error:', error)
    
    if (error.name === 'ZodError') {
      return NextResponse.json({ error: 'Invalid request', details: error.errors }, { status: 400 })
    }

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

