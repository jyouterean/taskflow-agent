import { getServerSession } from 'next-auth'
import { NextRequest } from 'next/server'
import { prisma } from './prisma'
import { MembershipRole } from '@prisma/client'

export interface SessionUser {
  id: string
  email: string
  name?: string | null
  image?: string | null
}

export interface AuthContext {
  user: SessionUser
  orgId: string
  role: MembershipRole
}

/**
 * Get current session user
 */
export async function getCurrentUser(): Promise<SessionUser | null> {
  // This will be implemented with NextAuth
  // For now, return null as placeholder
  return null
}

/**
 * Get auth context with organization and role
 */
export async function getAuthContext(
  request: NextRequest,
  orgId?: string
): Promise<AuthContext | null> {
  const user = await getCurrentUser()
  if (!user) return null

  // If orgId is provided, verify membership
  if (orgId) {
    const membership = await prisma.membership.findFirst({
      where: {
        userId: user.id,
        orgId,
        deletedAt: null,
      },
    })

    if (!membership) return null

    return {
      user,
      orgId: membership.orgId,
      role: membership.role,
    }
  }

  // Otherwise, get first active membership
  const membership = await prisma.membership.findFirst({
    where: {
      userId: user.id,
      deletedAt: null,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  if (!membership) return null

  return {
    user,
    orgId: membership.orgId,
    role: membership.role,
  }
}

/**
 * Check if user has required role
 */
export function hasRole(role: MembershipRole, required: MembershipRole): boolean {
  const hierarchy: Record<MembershipRole, number> = {
    MEMBER: 1,
    MANAGER: 2,
    ADMIN: 3,
  }

  return hierarchy[role] >= hierarchy[required]
}

/**
 * Check if user can access resource in organization
 */
export async function canAccessOrg(
  userId: string,
  orgId: string
): Promise<boolean> {
  const membership = await prisma.membership.findFirst({
    where: {
      userId,
      orgId,
      deletedAt: null,
    },
  })

  return !!membership
}

