'use client'

import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface BadgeProps {
  children: ReactNode
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info'
  size?: 'sm' | 'md'
  className?: string
}

export function Badge({ 
  children, 
  variant = 'default', 
  size = 'md',
  className 
}: BadgeProps) {
  const variants = {
    default: 'bg-[var(--background-tertiary)] text-[var(--foreground-secondary)]',
    primary: 'bg-[var(--accent-subtle)] text-[var(--accent)]',
    success: 'bg-emerald-500/15 text-emerald-400',
    warning: 'bg-amber-500/15 text-amber-400',
    error: 'bg-red-500/15 text-red-400',
    info: 'bg-cyan-500/15 text-cyan-400',
  }

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center font-medium rounded-full',
        variants[variant],
        sizes[size],
        className
      )}
    >
      {children}
    </span>
  )
}

// Specific badges for task status
export function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { variant: BadgeProps['variant']; label: string }> = {
    TODO: { variant: 'default', label: '未着手' },
    IN_PROGRESS: { variant: 'primary', label: '進行中' },
    BLOCKED: { variant: 'error', label: 'ブロック' },
    COMPLETED: { variant: 'success', label: '完了' },
    CANCELLED: { variant: 'default', label: 'キャンセル' },
  }

  const { variant, label } = config[status] || { variant: 'default', label: status }

  return <Badge variant={variant}>{label}</Badge>
}

// Specific badges for priority
export function PriorityBadge({ priority }: { priority: string }) {
  const config: Record<string, { variant: BadgeProps['variant']; label: string }> = {
    LOW: { variant: 'success', label: '低' },
    MEDIUM: { variant: 'warning', label: '中' },
    HIGH: { variant: 'error', label: '高' },
    URGENT: { variant: 'error', label: '緊急' },
  }

  const { variant, label } = config[priority] || { variant: 'default', label: priority }

  return <Badge variant={variant}>{label}</Badge>
}

// Role badge
export function RoleBadge({ role }: { role: string }) {
  const config: Record<string, { variant: BadgeProps['variant']; label: string }> = {
    ADMIN: { variant: 'error', label: '管理者' },
    MANAGER: { variant: 'primary', label: 'マネージャー' },
    MEMBER: { variant: 'default', label: 'メンバー' },
  }

  const { variant, label } = config[role] || { variant: 'default', label: role }

  return <Badge variant={variant}>{label}</Badge>
}

