'use client'

import * as AvatarPrimitive from '@radix-ui/react-avatar'
import { cn, getInitials } from '@/lib/utils'

interface AvatarProps {
  src?: string | null
  name?: string | null
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

export function Avatar({ src, name, size = 'md', className }: AvatarProps) {
  const sizes = {
    sm: 'w-6 h-6 text-xs',
    md: 'w-8 h-8 text-sm',
    lg: 'w-10 h-10 text-base',
    xl: 'w-12 h-12 text-lg',
  }

  const initials = name ? getInitials(name) : '?'

  return (
    <AvatarPrimitive.Root
      className={cn(
        'relative flex shrink-0 overflow-hidden rounded-full',
        sizes[size],
        className
      )}
    >
      <AvatarPrimitive.Image
        src={src || undefined}
        alt={name || 'Avatar'}
        className="aspect-square h-full w-full object-cover"
      />
      <AvatarPrimitive.Fallback
        className="flex h-full w-full items-center justify-center bg-[var(--accent-subtle)] text-[var(--accent)] font-medium"
      >
        {initials}
      </AvatarPrimitive.Fallback>
    </AvatarPrimitive.Root>
  )
}

interface AvatarGroupProps {
  users: Array<{ name?: string | null; image?: string | null }>
  max?: number
  size?: AvatarProps['size']
}

export function AvatarGroup({ users, max = 4, size = 'md' }: AvatarGroupProps) {
  const displayUsers = users.slice(0, max)
  const remaining = users.length - max

  return (
    <div className="flex -space-x-2">
      {displayUsers.map((user, i) => (
        <Avatar
          key={i}
          src={user.image}
          name={user.name}
          size={size}
          className="ring-2 ring-[var(--background)]"
        />
      ))}
      {remaining > 0 && (
        <div
          className={cn(
            'flex items-center justify-center rounded-full bg-[var(--background-tertiary)] text-[var(--foreground-secondary)] font-medium ring-2 ring-[var(--background)]',
            size === 'sm' && 'w-6 h-6 text-xs',
            size === 'md' && 'w-8 h-8 text-xs',
            size === 'lg' && 'w-10 h-10 text-sm',
            size === 'xl' && 'w-12 h-12 text-sm'
          )}
        >
          +{remaining}
        </div>
      )}
    </div>
  )
}

