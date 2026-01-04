'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'
import { 
  Sparkles, 
  LayoutDashboard, 
  CheckSquare, 
  FolderKanban, 
  Inbox, 
  BarChart3,
  Settings,
  Brain,
  ChevronDown,
  LogOut,
  User,
  Building2,
  CreditCard,
  Shield,
  Key,
  Code2,
  Plus
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Avatar } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const mainNav = [
  { href: '/app/dashboard', label: 'ダッシュボード', icon: LayoutDashboard },
  { href: '/app/tasks', label: 'タスク', icon: CheckSquare },
  { href: '/app/projects', label: 'プロジェクト', icon: FolderKanban },
  { href: '/app/inbox', label: '受信トレイ', icon: Inbox, badge: 3 },
  { href: '/app/reports', label: 'レポート', icon: BarChart3 },
  { href: '/app/agent', label: 'AIエージェント', icon: Brain },
]

const settingsNav = [
  { href: '/app/settings/org', label: '組織設定', icon: Building2 },
  { href: '/app/settings/members', label: 'メンバー', icon: User },
  { href: '/app/settings/security', label: 'セキュリティ', icon: Shield },
  { href: '/app/settings/billing', label: '請求', icon: CreditCard },
  { href: '/app/settings/api', label: 'API / Webhook', icon: Key },
  { href: '/app/settings/embed', label: 'Embed', icon: Code2 },
]

export function AppSidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-[var(--background-secondary)] border-r border-[var(--border)] flex flex-col">
      {/* Logo */}
      <div className="h-16 flex items-center px-4 border-b border-[var(--border)]">
        <Link href="/app/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--accent)] to-purple-500 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-semibold text-[var(--foreground)]">
            TaskFlow
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        {/* Quick Actions */}
        <div className="mb-4">
          <Link
            href="/app/tasks/new"
            className="flex items-center gap-2 w-full px-3 py-2 text-sm font-medium bg-[var(--accent)] text-white rounded-lg hover:bg-[var(--accent-hover)] transition-colors"
          >
            <Plus className="w-4 h-4" />
            新しいタスク
          </Link>
        </div>

        {/* Main Nav */}
        <div className="space-y-1">
          {mainNav.map((item) => {
            const isActive = pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                  isActive
                    ? 'bg-[var(--accent-subtle)] text-[var(--accent)]'
                    : 'text-[var(--foreground-secondary)] hover:bg-[var(--background-hover)] hover:text-[var(--foreground)]'
                )}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
                {item.badge && (
                  <span className="ml-auto text-xs px-1.5 py-0.5 bg-[var(--accent)] text-white rounded-full">
                    {item.badge}
                  </span>
                )}
              </Link>
            )
          })}
        </div>

        {/* Settings */}
        <div className="mt-8">
          <div className="px-3 mb-2 text-xs font-semibold text-[var(--foreground-muted)] uppercase tracking-wider">
            設定
          </div>
          <div className="space-y-1">
            {settingsNav.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                    isActive
                      ? 'bg-[var(--accent-subtle)] text-[var(--accent)]'
                      : 'text-[var(--foreground-secondary)] hover:bg-[var(--background-hover)] hover:text-[var(--foreground)]'
                  )}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </Link>
              )
            })}
          </div>
        </div>
      </nav>

      {/* User Menu */}
      <div className="p-3 border-t border-[var(--border)]">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-[var(--background-hover)] transition-colors">
              <Avatar
                src={session?.user?.image}
                name={session?.user?.name}
                size="sm"
              />
              <div className="flex-1 text-left min-w-0">
                <div className="text-sm font-medium text-[var(--foreground)] truncate">
                  {session?.user?.name || 'ユーザー'}
                </div>
                <div className="text-xs text-[var(--foreground-muted)] truncate">
                  {session?.user?.email}
                </div>
              </div>
              <ChevronDown className="w-4 h-4 text-[var(--foreground-muted)]" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>マイアカウント</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/app/settings/profile">
                <User className="w-4 h-4 mr-2" />
                プロフィール
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/app/settings/org">
                <Building2 className="w-4 h-4 mr-2" />
                組織設定
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => signOut({ callbackUrl: '/' })}>
              <LogOut className="w-4 h-4 mr-2" />
              ログアウト
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </aside>
  )
}

