import { MembershipRole } from '@prisma/client'
import { AuthContext, hasRole } from './auth'
import { prisma } from './prisma'

export interface RBACCheck {
  allowed: boolean
  reason?: string
}

/**
 * Check if user can perform action on resource
 */
export async function checkPermission(
  ctx: AuthContext,
  action: string,
  resource: string,
  resourceId?: string
): Promise<RBACCheck> {
  // Admin can do everything
  if (ctx.role === MembershipRole.ADMIN) {
    return { allowed: true }
  }

  // Manager can manage projects and tasks
  if (ctx.role === MembershipRole.MANAGER) {
    if (['PROJECT', 'TASK'].includes(resource)) {
      return { allowed: true }
    }
    if (resource === 'MEMBERSHIP' && action === 'READ') {
      return { allowed: true }
    }
  }

  // Member can only manage own tasks
  if (ctx.role === MembershipRole.MEMBER) {
    if (resource === 'TASK') {
      if (action === 'READ' || action === 'CREATE') {
        return { allowed: true }
      }
      if (action === 'UPDATE' || action === 'DELETE') {
        // Check if task belongs to user or user's project
        if (resourceId) {
          const task = await prisma.task.findUnique({
            where: { id: resourceId },
            select: { assigneeId: true, projectId: true },
          })

          if (!task) {
            return { allowed: false, reason: 'Task not found' }
          }

          // Can edit own tasks
          if (task.assigneeId === ctx.user.id) {
            return { allowed: true }
          }

          // Can edit tasks in projects they're part of
          if (task.projectId) {
            const project = await prisma.project.findUnique({
              where: { id: task.projectId },
              select: { ownerId: true },
            })
            if (project?.ownerId === ctx.user.id) {
              return { allowed: true }
            }
          }
        }
      }
    }
    if (resource === 'PROJECT' && action === 'READ') {
      return { allowed: true }
    }
  }

  return { allowed: false, reason: 'Insufficient permissions' }
}

/**
 * Require specific role
 */
export function requireRole(ctx: AuthContext, role: MembershipRole): RBACCheck {
  if (hasRole(ctx.role, role)) {
    return { allowed: true }
  }
  return { allowed: false, reason: `Requires ${role} role` }
}

/**
 * Check if user can access organization resource
 */
export async function checkOrgAccess(
  ctx: AuthContext,
  orgId: string
): Promise<RBACCheck> {
  if (ctx.orgId !== orgId) {
    return { allowed: false, reason: 'Organization mismatch' }
  }
  return { allowed: true }
}

