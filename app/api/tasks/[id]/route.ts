import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { z } from 'zod'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const UpdateTaskSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(5000).optional(),
  status: z.enum(['TODO', 'IN_PROGRESS', 'BLOCKED', 'COMPLETED', 'CANCELLED']).optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional(),
  dueDate: z.string().datetime().nullable().optional(),
  assigneeId: z.string().nullable().optional(),
  projectId: z.string().nullable().optional(),
  tags: z.array(z.string()).optional(),
})

// GET /api/tasks/[id] - Get task
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params

    const task = await prisma.task.findUnique({
      where: { id },
      include: {
        assignee: {
          select: { id: true, name: true, email: true, image: true },
        },
        project: {
          select: { id: true, name: true, status: true },
        },
        agentNotes: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
        auditLogs: {
          orderBy: { createdAt: 'desc' },
          take: 20,
          include: {
            user: {
              select: { id: true, name: true, image: true },
            },
          },
        },
      },
    })

    if (!task || task.orgId !== membership.orgId) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 })
    }

    return NextResponse.json(task)
  } catch (error) {
    console.error('[/api/tasks/[id]] GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PATCH /api/tasks/[id] - Update task
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params

    // Check task exists and belongs to org
    const existingTask = await prisma.task.findUnique({
      where: { id },
    })

    if (!existingTask || existingTask.orgId !== membership.orgId) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 })
    }

    const body = await request.json().catch(() => null)
    if (!body) {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
    }

    const data = UpdateTaskSchema.parse(body)

    // Handle status change to COMPLETED
    const completedAt = data.status === 'COMPLETED' && existingTask.status !== 'COMPLETED'
      ? new Date()
      : data.status !== 'COMPLETED' && existingTask.status === 'COMPLETED'
        ? null
        : undefined

    const task = await prisma.task.update({
      where: { id },
      data: {
        ...data,
        dueDate: data.dueDate !== undefined
          ? data.dueDate ? new Date(data.dueDate) : null
          : undefined,
        ...(completedAt !== undefined && { completedAt }),
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
      'UPDATE',
      'TASK',
      task.id,
      { changes: data },
      request
    )

    return NextResponse.json(task)
  } catch (error: any) {
    console.error('[/api/tasks/[id]] PATCH error:', error)
    
    if (error.name === 'ZodError') {
      return NextResponse.json({ error: 'Invalid request', details: error.errors }, { status: 400 })
    }

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE /api/tasks/[id] - Delete task
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    // Only Admin and Manager can delete
    if (membership.role === 'MEMBER') {
      return NextResponse.json({ error: 'Permission denied' }, { status: 403 })
    }

    const { id } = await params

    const existingTask = await prisma.task.findUnique({
      where: { id },
    })

    if (!existingTask || existingTask.orgId !== membership.orgId) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 })
    }

    await prisma.task.delete({
      where: { id },
    })

    // Audit log
    await auditLog(
      { user: session.user as any, orgId: membership.orgId, role: membership.role },
      'DELETE',
      'TASK',
      id,
      { title: existingTask.title },
      request
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[/api/tasks/[id]] DELETE error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
