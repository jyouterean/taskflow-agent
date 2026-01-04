'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  Plus, 
  Search, 
  Filter, 
  SlidersHorizontal,
  List,
  Kanban,
  Calendar,
  MoreHorizontal,
  Clock,
  User,
  Tag
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Badge, StatusBadge, PriorityBadge } from '@/components/ui/badge'
import { Avatar } from '@/components/ui/avatar'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'

// Mock data
const tasks = [
  {
    id: '1',
    title: 'API設計レビュー',
    description: 'バックエンドAPIの設計書をレビューする',
    status: 'IN_PROGRESS',
    priority: 'HIGH',
    dueDate: '2026-01-05',
    assignee: { name: '山田太郎', image: null },
    project: 'Backend API',
    tags: ['開発', 'レビュー'],
  },
  {
    id: '2',
    title: 'クライアントMTG資料作成',
    description: '来週のクライアントミーティング用のプレゼン資料を作成',
    status: 'TODO',
    priority: 'URGENT',
    dueDate: '2026-01-06',
    assignee: { name: '佐藤花子', image: null },
    project: '営業案件A',
    tags: ['営業', 'プレゼン'],
  },
  {
    id: '3',
    title: 'ドキュメント更新',
    description: 'ユーザーガイドを最新版に更新',
    status: 'TODO',
    priority: 'MEDIUM',
    dueDate: '2026-01-10',
    assignee: { name: '田中健一', image: null },
    project: 'プロダクト改善',
    tags: ['ドキュメント'],
  },
  {
    id: '4',
    title: 'バグ修正: ログインエラー',
    description: '特定条件下でログインが失敗する問題を修正',
    status: 'IN_PROGRESS',
    priority: 'HIGH',
    dueDate: '2026-01-04',
    assignee: { name: '山田太郎', image: null },
    project: 'Backend API',
    tags: ['バグ', '緊急'],
  },
  {
    id: '5',
    title: 'パフォーマンス改善',
    description: 'ダッシュボードの読み込み速度を改善',
    status: 'COMPLETED',
    priority: 'MEDIUM',
    dueDate: '2026-01-03',
    assignee: { name: '鈴木一郎', image: null },
    project: 'プロダクト改善',
    tags: ['パフォーマンス'],
  },
]

const statusColumns = [
  { id: 'TODO', label: '未着手', color: 'bg-slate-500' },
  { id: 'IN_PROGRESS', label: '進行中', color: 'bg-blue-500' },
  { id: 'BLOCKED', label: 'ブロック', color: 'bg-red-500' },
  { id: 'COMPLETED', label: '完了', color: 'bg-emerald-500' },
]

export default function TasksPage() {
  const [view, setView] = useState<'list' | 'board' | 'calendar'>('list')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)]">タスク</h1>
          <p className="text-sm text-[var(--foreground-secondary)] mt-1">
            すべてのタスクを管理
          </p>
        </div>
        <Link href="/app/tasks/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            新しいタスク
          </Button>
        </Link>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-4">
        <div className="flex-1 max-w-md">
          <Input
            placeholder="タスクを検索..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
          />
        </div>

        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            フィルタ
          </Button>
          <Button variant="secondary" size="sm">
            <SlidersHorizontal className="w-4 h-4 mr-2" />
            並び替え
          </Button>
        </div>

        <div className="flex items-center border border-[var(--border)] rounded-lg p-1 bg-[var(--background-tertiary)]">
          <button
            onClick={() => setView('list')}
            className={cn(
              'p-2 rounded transition-colors',
              view === 'list' ? 'bg-[var(--background-secondary)] text-[var(--foreground)]' : 'text-[var(--foreground-muted)] hover:text-[var(--foreground)]'
            )}
          >
            <List className="w-4 h-4" />
          </button>
          <button
            onClick={() => setView('board')}
            className={cn(
              'p-2 rounded transition-colors',
              view === 'board' ? 'bg-[var(--background-secondary)] text-[var(--foreground)]' : 'text-[var(--foreground-muted)] hover:text-[var(--foreground)]'
            )}
          >
            <Kanban className="w-4 h-4" />
          </button>
          <button
            onClick={() => setView('calendar')}
            className={cn(
              'p-2 rounded transition-colors',
              view === 'calendar' ? 'bg-[var(--background-secondary)] text-[var(--foreground)]' : 'text-[var(--foreground-muted)] hover:text-[var(--foreground)]'
            )}
          >
            <Calendar className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* List View */}
      {view === 'list' && (
        <Card padding="none">
          <div className="divide-y divide-[var(--border)]">
            {filteredTasks.map((task, i) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
              >
                <Link
                  href={`/app/tasks/${task.id}`}
                  className="flex items-center gap-4 p-4 hover:bg-[var(--background-hover)] transition-colors group"
                >
                  <input
                    type="checkbox"
                    checked={task.status === 'COMPLETED'}
                    className="w-4 h-4 rounded border-[var(--border)]"
                    onClick={(e) => e.stopPropagation()}
                    readOnly
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={cn(
                        'text-sm font-medium',
                        task.status === 'COMPLETED' ? 'text-[var(--foreground-muted)] line-through' : 'text-[var(--foreground)]'
                      )}>
                        {task.title}
                      </span>
                      {task.tags.map(tag => (
                        <Badge key={tag} variant="default" size="sm">{tag}</Badge>
                      ))}
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-xs text-[var(--foreground-muted)]">
                      <span>{task.project}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(task.dueDate).toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <StatusBadge status={task.status} />
                    <PriorityBadge priority={task.priority} />
                    <Avatar src={task.assignee.image} name={task.assignee.name} size="sm" />

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button
                          className="p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-[var(--background-tertiary)] transition-all"
                          onClick={(e) => e.preventDefault()}
                        >
                          <MoreHorizontal className="w-4 h-4 text-[var(--foreground-muted)]" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>編集</DropdownMenuItem>
                        <DropdownMenuItem>複製</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-400">削除</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </Card>
      )}

      {/* Board View */}
      {view === 'board' && (
        <div className="grid grid-cols-4 gap-4">
          {statusColumns.map((column) => {
            const columnTasks = filteredTasks.filter(t => t.status === column.id)
            return (
              <div key={column.id} className="space-y-3">
                <div className="flex items-center gap-2 px-2">
                  <div className={cn('w-2 h-2 rounded-full', column.color)} />
                  <span className="text-sm font-medium text-[var(--foreground)]">{column.label}</span>
                  <span className="text-xs text-[var(--foreground-muted)]">{columnTasks.length}</span>
                </div>
                <div className="space-y-2 min-h-[200px] p-2 bg-[var(--background-tertiary)] rounded-lg">
                  {columnTasks.map((task, i) => (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <Link href={`/app/tasks/${task.id}`}>
                        <Card className="p-3 hover:border-[var(--accent)] cursor-pointer">
                          <div className="text-sm font-medium text-[var(--foreground)] mb-2">
                            {task.title}
                          </div>
                          <div className="flex items-center gap-2 mb-2">
                            {task.tags.slice(0, 2).map(tag => (
                              <Badge key={tag} variant="default" size="sm">{tag}</Badge>
                            ))}
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1 text-xs text-[var(--foreground-muted)]">
                              <Clock className="w-3 h-3" />
                              {new Date(task.dueDate).toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' })}
                            </div>
                            <Avatar src={task.assignee.image} name={task.assignee.name} size="sm" />
                          </div>
                        </Card>
                      </Link>
                    </motion.div>
                  ))}
                  <button className="w-full p-2 text-sm text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:bg-[var(--background-hover)] rounded-lg transition-colors">
                    <Plus className="w-4 h-4 mx-auto" />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Calendar View Placeholder */}
      {view === 'calendar' && (
        <Card className="p-8 text-center">
          <Calendar className="w-12 h-12 text-[var(--foreground-muted)] mx-auto mb-4" />
          <h3 className="text-lg font-medium text-[var(--foreground)] mb-2">カレンダービュー</h3>
          <p className="text-sm text-[var(--foreground-secondary)]">
            タスクをカレンダー形式で表示します（実装中）
          </p>
        </Card>
      )}
    </div>
  )
}

