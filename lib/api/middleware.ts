import { NextRequest, NextResponse } from 'next/server'
import { getAuthContext, AuthContext } from '@/lib/auth'
import { checkOrgAccess } from '@/lib/rbac'
import { auditLog } from '@/lib/audit'

export interface ApiContext extends AuthContext {
  request: NextRequest
}

/**
 * API route wrapper with authentication and RBAC
 */
export function withAuth(
  handler: (ctx: ApiContext, ...args: any[]) => Promise<NextResponse>
) {
  return async (request: NextRequest, ...args: any[]): Promise<NextResponse> => {
    try {
      const ctx = await getAuthContext(request)
      if (!ctx) {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        )
      }

      return await handler({ ...ctx, request }, ...args)
    } catch (error) {
      console.error('API error:', error)
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      )
    }
  }
}

/**
 * API route wrapper with org validation
 */
export function withOrg(
  handler: (ctx: ApiContext, orgId: string, ...args: any[]) => Promise<NextResponse>
) {
  return withAuth(async (ctx, ...args) => {
    const orgId = args[0] || ctx.request.nextUrl.searchParams.get('orgId')
    if (!orgId || typeof orgId !== 'string') {
      return NextResponse.json(
        { error: 'Organization ID required' },
        { status: 400 }
      )
    }

    const accessCheck = await checkOrgAccess(ctx, orgId)
    if (!accessCheck.allowed) {
      return NextResponse.json(
        { error: accessCheck.reason || 'Access denied' },
        { status: 403 }
      )
    }

    return await handler(ctx, orgId, ...args.slice(1))
  })
}

/**
 * API route wrapper with permission check
 */
export function withPermission(
  resource: string,
  action: string,
  handler: (ctx: ApiContext, ...args: any[]) => Promise<NextResponse>
) {
  return withAuth(async (ctx, ...args) => {
    const { checkPermission } = await import('@/lib/rbac')
    const resourceId = args[0]?.id || args[0]

    const permCheck = await checkPermission(ctx, action, resource, resourceId)
    if (!permCheck.allowed) {
      return NextResponse.json(
        { error: permCheck.reason || 'Permission denied' },
        { status: 403 }
      )
    }

    // Audit log
    await auditLog(ctx, action, resource, resourceId, undefined, ctx.request)

    return await handler(ctx, ...args)
  })
}

