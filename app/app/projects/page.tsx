'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  Plus, 
  Search, 
  MoreHorizontal,
  FolderKanban,
  Clock,
  Users,
  CheckCircle2,
  AlertCircle,
  Archive,
  Trash
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarGroup } from '@/components/ui/avatar'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'

// Mock data
const projects = [
  {
    id: '1',
    name: 'Backend API',
    description: 'バックエンドAPIの設計と実装',
    status: 'ACTIVE',
    owner: { name: '山田太郎', image: null },
    members: [
      { name: '山田太郎', image: null },
      { name: '佐藤花子', image: null },
      { name: '田中健一', image: null },
    ],
    stats: { total: 18, completed: 12, inProgress: 4 },
    updatedAt: '2026-01-04',
  },
  {
    id: '2',
    name: '営業案件A',
    description: '大手クライアント向け提案',
    status: 'ACTIVE',
    owner: { name: '佐藤花子', image: null },
    members: [
      { name: '佐藤花子', image: null },
      { name: '鈴木一郎', image: null },
    ],
    stats: { total: 8, completed: 5, inProgress: 2 },
    updatedAt: '2026-01-03',
  },
  {
    id: '3',
    name: 'プロダクト改善',
    description: 'ユーザーフィードバックに基づく改善',
    status: 'ACTIVE',
    owner: { name: '田中健一', image: null },
    members: [
      { name: '田中健一', image: null },
      { name: '山田太郎', image: null },
      { name: '佐藤花子', image: null },
      { name: '鈴木一郎', image: null },
      { name: '高橋美咲', image: null },
    ],
    stats: { total: 35, completed: 28, inProgress: 5 },
    updatedAt: '2026-01-04',
  },
  {
    id: '4',
    name: 'マーケティングキャンペーン',
    description: 'Q1マーケティング施策',
    status: 'COMPLETED',
    owner: { name: '高橋美咲', image: null },
    members: [
      { name: '高橋美咲', image: null },
      { name: '佐藤花子', image: null },
    ],
    stats: { total: 12, completed: 12, inProgress: 0 },
    updatedAt: '2025-12-28',
  },
]

const statusConfig = {
  ACTIVE: { label: 'アクティブ', variant: 'success' as const },
  COMPLETED: { label: '完了', variant: 'default' as const },
  ARCHIVED: { label: 'アーカイブ', variant: 'default' as const },
}

export default function ProjectsPage() {
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string | null>(null)

  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = !statusFilter || p.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)]">プロジェクト</h1>
          <p className="text-sm text-[var(--foreground-secondary)] mt-1">
            チームのプロジェクトを管理
          </p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="w-4 h-4 mr-2" />
          新規プロジェクト
        </Button>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-4">
        <div className="flex-1 max-w-md">
          <Input
            placeholder="プロジェクトを検索..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
          />
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={statusFilter === null ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setStatusFilter(null)}
          >
            すべて
          </Button>
          <Button
            variant={statusFilter === 'ACTIVE' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setStatusFilter('ACTIVE')}
          >
            アクティブ
          </Button>
          <Button
            variant={statusFilter === 'COMPLETED' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setStatusFilter('COMPLETED')}
          >
            完了
          </Button>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProjects.map((project, i) => {
          const progress =
            project.stats.total > 0
              ? Math.round((project.stats.completed / project.stats.total) * 100)
              : 0

          return (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link href={`/app/projects/${project.id}`}>
                <Card hover className="h-full">
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[var(--accent-subtle)] flex items-center justify-center">
                          <FolderKanban className="w-5 h-5 text-[var(--accent)]" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-[var(--foreground)]">
                            {project.name}
                          </h3>
                          <Badge
                            variant={statusConfig[project.status as keyof typeof statusConfig].variant}
                            size="sm"
                          >
                            {statusConfig[project.status as keyof typeof statusConfig].label}
                          </Badge>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button
                            className="p-1 rounded hover:bg-[var(--background-hover)] transition-colors"
                            onClick={(e) => e.preventDefault()}
                          >
                            <MoreHorizontal className="w-4 h-4 text-[var(--foreground-muted)]" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>編集</DropdownMenuItem>
                          <DropdownMenuItem>
                            <Archive className="w-4 h-4 mr-2" />
                            アーカイブ
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-400">
                            <Trash className="w-4 h-4 mr-2" />
                            削除
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <p className="text-sm text-[var(--foreground-secondary)] mb-4 line-clamp-2">
                      {project.description}
                    </p>

                    {/* Progress */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-xs text-[var(--foreground-muted)] mb-1">
                        <span>進捗</span>
                        <span>
                          {project.stats.completed}/{project.stats.total} ({progress}%)
                        </span>
                      </div>
                      <div className="h-1.5 bg-[var(--background-tertiary)] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[var(--accent)] rounded-full transition-all"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between">
                      <AvatarGroup users={project.members} max={3} size="sm" />
                      <div className="flex items-center gap-1 text-xs text-[var(--foreground-muted)]">
                        <Clock className="w-3 h-3" />
                        {new Date(project.updatedAt).toLocaleDateString('ja-JP', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            </motion.div>
          )
        })}
      </div>

      {filteredProjects.length === 0 && (
        <Card className="p-12 text-center">
          <FolderKanban className="w-12 h-12 text-[var(--foreground-muted)] mx-auto mb-4" />
          <h3 className="text-lg font-medium text-[var(--foreground)] mb-2">
            プロジェクトが見つかりません
          </h3>
          <p className="text-sm text-[var(--foreground-secondary)] mb-6">
            新しいプロジェクトを作成して始めましょう
          </p>
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className="w-4 h-4 mr-2" />
            プロジェクトを作成
          </Button>
        </Card>
      )}

      {/* Create Project Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>新規プロジェクト</DialogTitle>
            <DialogDescription>
              チームで共有するプロジェクトを作成します
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <Input label="プロジェクト名" placeholder="例: Webアプリ開発" />
            <div>
              <label className="block text-sm font-medium text-[var(--foreground-secondary)] mb-1.5">
                説明
              </label>
              <textarea
                placeholder="プロジェクトの概要を入力..."
                className="w-full h-24 px-4 py-3 bg-[var(--background-tertiary)] border border-[var(--border)] rounded-lg text-[var(--foreground)] placeholder:text-[var(--foreground-muted)] focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20 transition-all resize-none"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="secondary" onClick={() => setShowCreateDialog(false)}>
              キャンセル
            </Button>
            <Button>作成</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

