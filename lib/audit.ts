import { prisma } from './prisma'
import { AuthContext } from './auth'

export interface AuditLogData {
  orgId: string
  userId?: string
  action: string
  resource: string
  resourceId?: string
  metadata?: Record<string, any>
  ipAddress?: string
  userAgent?: string
}

/**
 * Create audit log entry
 */
export async function createAuditLog(data: AuditLogData): Promise<void> {
  await prisma.auditLog.create({
    data: {
      orgId: data.orgId,
      userId: data.userId,
      action: data.action,
      resource: data.resource,
      resourceId: data.resourceId,
      metadata: data.metadata || {},
      ipAddress: data.ipAddress,
      userAgent: data.userAgent,
    },
  })
}

/**
 * Create audit log from auth context
 */
export async function auditLog(
  ctx: AuthContext | null,
  action: string,
  resource: string,
  resourceId?: string,
  metadata?: Record<string, any>,
  request?: Request
): Promise<void> {
  if (!ctx) return

  const ipAddress = request?.headers.get('x-forwarded-for') || 
                   request?.headers.get('x-real-ip') || 
                   undefined
  const userAgent = request?.headers.get('user-agent') || undefined

  await createAuditLog({
    orgId: ctx.orgId,
    userId: ctx.user.id,
    action,
    resource,
    resourceId,
    metadata,
    ipAddress,
    userAgent,
  })
}

