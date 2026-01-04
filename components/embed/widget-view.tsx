'use client'

import { useState } from 'react'
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  MoreHorizontal,
  AlertCircle
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface Task {
  id: string
  title: string
  description?: string | null
  status: string
  priority: string
  dueDate?: Date | null
  assignee?: {
    id: string
    name?: string | null
    image?: string | null
  } | null
  project?: {
    id: string
    name: string
  } | null
}

interface Widget {
  id: string
  name: string
  viewMode: string
  permissions: string
  organization: {
    name: string
  }
}

interface EmbedWidgetViewProps {
  widget: Widget
  tasks: Task[]
  canEdit: boolean
}

export function EmbedWidgetView({ widget, tasks, canEdit }: EmbedWidgetViewProps) {
  const [taskList, setTaskList] = useState(tasks)

  const handleToggleTask = async (taskId: string, currentStatus: string) => {
    if (!canEdit) return

    const newStatus = currentStatus === 'COMPLETED' ? 'TODO' : 'COMPLETED'

    // Optimistic update
    setTaskList(prev =>
      prev.map(t => (t.id === taskId ? { ...t, status: newStatus } : t))
    )

    // API call
    try {
      await fetch(`/api/embed/tasks/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, widgetId: widget.id }),
      })
    } catch (error) {
      // Revert on error
      setTaskList(tasks)
    }
  }

  // List View
  if (widget.viewMode === 'LIST') {
    return (
      <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
        {/* Header */}
        <div className="px-4 py-3 border-b border-[var(--border)] bg-[var(--background-secondary)]">
          <div className="flex items-center justify-between">
            <h1 className="text-sm font-semibold">{widget.name}</h1>
            <span className="text-xs text-[var(--foreground-muted)]">
              {widget.organization.name}
            </span>
          </div>
        </div>

        {/* Task List */}
        <div className="divide-y divide-[var(--border)]">
          {taskList.map((task) => (
            <div
              key={task.id}
              className="flex items-center gap-3 px-4 py-3 hover:bg-[var(--background-hover)] transition-colors"
            >
              <button
                onClick={() => handleToggleTask(task.id, task.status)}
                disabled={!canEdit}
                className={cn(
                  'shrink-0 transition-colors',
                  canEdit && 'cursor-pointer hover:text-[var(--accent)]'
                )}
              >
                {task.status === 'COMPLETED' ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                ) : (
                  <Circle className="w-5 h-5 text-[var(--foreground-muted)]" />
                )}
              </button>

              <div className="flex-1 min-w-0">
                <div
                  className={cn(
                    'text-sm font-medium truncate',
                    task.status === 'COMPLETED' && 'line-through text-[var(--foreground-muted)]'
                  )}
                >
                  {task.title}
                </div>
                {task.project && (
                  <div className="text-xs text-[var(--foreground-muted)] truncate">
                    {task.project.name}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {task.dueDate && (
                  <div className="flex items-center gap-1 text-xs text-[var(--foreground-muted)]">
                    <Clock className="w-3 h-3" />
                    {new Date(task.dueDate).toLocaleDateString('ja-JP', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </div>
                )}
                <PriorityDot priority={task.priority} />
              </div>
            </div>
          ))}
        </div>

        {taskList.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <CheckCircle2 className="w-12 h-12 text-[var(--foreground-muted)] mb-4" />
            <p className="text-sm text-[var(--foreground-secondary)]">
              タスクはありません
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="fixed bottom-0 left-0 right-0 px-4 py-2 border-t border-[var(--border)] bg-[var(--background-secondary)]">
          <div className="flex items-center justify-between text-xs text-[var(--foreground-muted)]">
            <span>Powered by TaskFlow Agent</span>
            <span>{taskList.length} タスク</span>
          </div>
        </div>
      </div>
    )
  }

  // Board View
  if (widget.viewMode === 'BOARD') {
    const columns = [
      { id: 'TODO', label: '未着手', color: 'bg-slate-500' },
      { id: 'IN_PROGRESS', label: '進行中', color: 'bg-blue-500' },
      { id: 'COMPLETED', label: '完了', color: 'bg-emerald-500' },
    ]

    return (
      <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] p-4">
        {/* Header */}
        <div className="mb-4">
          <h1 className="text-sm font-semibold">{widget.name}</h1>
        </div>

        {/* Board */}
        <div className="grid grid-cols-3 gap-4">
          {columns.map((column) => {
            const columnTasks = taskList.filter((t) => {
              if (column.id === 'TODO') return t.status === 'TODO' || t.status === 'BLOCKED'
              return t.status === column.id
            })

            return (
              <div key={column.id} className="space-y-2">
                <div className="flex items-center gap-2 px-2 py-1">
                  <div className={cn('w-2 h-2 rounded-full', column.color)} />
                  <span className="text-xs font-medium">{column.label}</span>
                  <span className="text-xs text-[var(--foreground-muted)]">
                    {columnTasks.length}
                  </span>
                </div>

                <div className="space-y-2 min-h-[100px] p-2 bg-[var(--background-tertiary)] rounded-lg">
                  {columnTasks.map((task) => (
                    <div
                      key={task.id}
                      className="p-3 bg-[var(--background-secondary)] border border-[var(--border)] rounded-lg"
                    >
                      <div className="text-xs font-medium mb-2 line-clamp-2">
                        {task.title}
                      </div>
                      <div className="flex items-center justify-between">
                        {task.dueDate && (
                          <div className="flex items-center gap-1 text-[10px] text-[var(--foreground-muted)]">
                            <Clock className="w-3 h-3" />
                            {new Date(task.dueDate).toLocaleDateString('ja-JP', {
                              month: 'numeric',
                              day: 'numeric',
                            })}
                          </div>
                        )}
                        <PriorityDot priority={task.priority} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>

        {/* Footer */}
        <div className="fixed bottom-0 left-0 right-0 px-4 py-2 border-t border-[var(--border)] bg-[var(--background-secondary)]">
          <div className="text-xs text-center text-[var(--foreground-muted)]">
            Powered by TaskFlow Agent
          </div>
        </div>
      </div>
    )
  }

  // Mini Dashboard View
  if (widget.viewMode === 'MINI_DASHBOARD') {
    const stats = {
      total: taskList.length,
      completed: taskList.filter((t) => t.status === 'COMPLETED').length,
      inProgress: taskList.filter((t) => t.status === 'IN_PROGRESS').length,
      overdue: taskList.filter(
        (t) => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'COMPLETED'
      ).length,
    }

    const completionRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0

    return (
      <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] p-4">
        {/* Header */}
        <div className="mb-4">
          <h1 className="text-sm font-semibold">{widget.name}</h1>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <StatCard
            label="完了"
            value={stats.completed}
            color="text-emerald-400"
            bgColor="bg-emerald-500/15"
          />
          <StatCard
            label="進行中"
            value={stats.inProgress}
            color="text-blue-400"
            bgColor="bg-blue-500/15"
          />
          <StatCard
            label="期限超過"
            value={stats.overdue}
            color="text-red-400"
            bgColor="bg-red-500/15"
          />
          <StatCard
            label="達成率"
            value={`${completionRate}%`}
            color="text-purple-400"
            bgColor="bg-purple-500/15"
          />
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-xs text-[var(--foreground-secondary)] mb-1">
            <span>全体進捗</span>
            <span>{stats.completed}/{stats.total}</span>
          </div>
          <div className="h-2 bg-[var(--background-tertiary)] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[var(--accent)] to-purple-500 rounded-full transition-all"
              style={{ width: `${completionRate}%` }}
            />
          </div>
        </div>

        {/* Recent Tasks */}
        <div>
          <h2 className="text-xs font-medium text-[var(--foreground-secondary)] mb-2">
            直近のタスク
          </h2>
          <div className="space-y-2">
            {taskList.slice(0, 5).map((task) => (
              <div
                key={task.id}
                className="flex items-center gap-2 p-2 bg-[var(--background-secondary)] rounded-lg"
              >
                <StatusIcon status={task.status} />
                <span className="text-xs truncate flex-1">{task.title}</span>
                <PriorityDot priority={task.priority} />
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="fixed bottom-0 left-0 right-0 px-4 py-2 border-t border-[var(--border)] bg-[var(--background-secondary)]">
          <div className="text-xs text-center text-[var(--foreground-muted)]">
            Powered by TaskFlow Agent
          </div>
        </div>
      </div>
    )
  }

  return null
}

function PriorityDot({ priority }: { priority: string }) {
  const colors: Record<string, string> = {
    URGENT: 'bg-red-500',
    HIGH: 'bg-orange-500',
    MEDIUM: 'bg-amber-500',
    LOW: 'bg-emerald-500',
  }

  return <div className={cn('w-2 h-2 rounded-full', colors[priority] || 'bg-gray-500')} />
}

function StatusIcon({ status }: { status: string }) {
  switch (status) {
    case 'COMPLETED':
      return <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
    case 'IN_PROGRESS':
      return <Clock className="w-4 h-4 text-blue-500 shrink-0" />
    case 'BLOCKED':
      return <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
    default:
      return <Circle className="w-4 h-4 text-[var(--foreground-muted)] shrink-0" />
  }
}

function StatCard({
  label,
  value,
  color,
  bgColor,
}: {
  label: string
  value: number | string
  color: string
  bgColor: string
}) {
  return (
    <div className={cn('p-3 rounded-lg', bgColor)}>
      <div className={cn('text-xl font-bold', color)}>{value}</div>
      <div className="text-xs text-[var(--foreground-secondary)]">{label}</div>
    </div>
  )
}

