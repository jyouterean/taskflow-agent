'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  TrendingUp,
  ArrowRight,
  Plus,
  Calendar,
  Target,
  Brain,
  Sparkles
} from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge, StatusBadge, PriorityBadge } from '@/components/ui/badge'
import { Avatar, AvatarGroup } from '@/components/ui/avatar'

// Mock data
const stats = [
  { label: '完了タスク', value: 24, change: '+12%', icon: CheckCircle2, color: 'emerald' },
  { label: '進行中', value: 8, change: '+3%', icon: Clock, color: 'blue' },
  { label: '期限超過', value: 2, change: '-25%', icon: AlertTriangle, color: 'red' },
  { label: '今週の達成率', value: '87%', change: '+5%', icon: TrendingUp, color: 'purple' },
]

const todayTasks = [
  { id: '1', title: 'API設計レビュー', project: 'Backend API', priority: 'HIGH', dueTime: '14:00' },
  { id: '2', title: 'クライアントMTG資料作成', project: '営業案件A', priority: 'URGENT', dueTime: '11:00' },
  { id: '3', title: 'ドキュメント更新', project: 'プロダクト改善', priority: 'MEDIUM', dueTime: '18:00' },
  { id: '4', title: 'コードレビュー', project: 'Backend API', priority: 'LOW', dueTime: '16:00' },
]

const recentProjects = [
  { id: '1', name: 'Backend API', tasks: { completed: 12, total: 18 }, members: 4 },
  { id: '2', name: '営業案件A', tasks: { completed: 5, total: 8 }, members: 3 },
  { id: '3', name: 'プロダクト改善', tasks: { completed: 28, total: 35 }, members: 6 },
]

const agentSuggestions = [
  { type: 'delay', message: '「API設計レビュー」が予定より遅れています', action: '詳細を見る' },
  { type: 'overdue', message: '2件のタスクが期限を超過しています', action: '確認する' },
]

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)]">ダッシュボード</h1>
          <p className="text-sm text-[var(--foreground-secondary)] mt-1">
            おはようございます！今日も頑張りましょう。
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="secondary">
            <Calendar className="w-4 h-4 mr-2" />
            今日: {new Date().toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' })}
          </Button>
          <Link href="/app/tasks/new">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              新しいタスク
            </Button>
          </Link>
        </div>
      </div>

      {/* AI Agent Suggestions */}
      {agentSuggestions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="border-amber-500/30 bg-amber-500/5">
            <div className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <Brain className="w-4 h-4 text-white" />
                </div>
                <span className="font-medium text-[var(--foreground)]">AIエージェントからの提案</span>
              </div>
              <div className="space-y-2">
                {agentSuggestions.map((suggestion, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-[var(--background-secondary)] rounded-lg">
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="w-4 h-4 text-amber-400" />
                      <span className="text-sm text-[var(--foreground)]">{suggestion.message}</span>
                    </div>
                    <Button variant="ghost" size="sm">
                      {suggestion.action}
                      <ArrowRight className="w-3 h-3 ml-1" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card className="p-5">
              <div className="flex items-center justify-between">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  stat.color === 'emerald' ? 'bg-emerald-500/15' :
                  stat.color === 'blue' ? 'bg-blue-500/15' :
                  stat.color === 'red' ? 'bg-red-500/15' :
                  'bg-purple-500/15'
                }`}>
                  <stat.icon className={`w-5 h-5 ${
                    stat.color === 'emerald' ? 'text-emerald-400' :
                    stat.color === 'blue' ? 'text-blue-400' :
                    stat.color === 'red' ? 'text-red-400' :
                    'text-purple-400'
                  }`} />
                </div>
                <Badge variant={stat.change.startsWith('+') ? 'success' : 'error'} size="sm">
                  {stat.change}
                </Badge>
              </div>
              <div className="mt-4">
                <div className="text-2xl font-bold text-[var(--foreground)]">{stat.value}</div>
                <div className="text-sm text-[var(--foreground-muted)]">{stat.label}</div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Today's Tasks */}
        <div className="lg:col-span-2">
          <Card padding="none">
            <CardHeader className="p-5 border-b border-[var(--border)]">
              <div className="flex items-center justify-between">
                <CardTitle>今日のタスク</CardTitle>
                <Link href="/app/tasks" className="text-sm text-[var(--accent)] hover:underline">
                  すべて見る
                </Link>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-[var(--border)]">
                {todayTasks.map((task, i) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Link
                      href={`/app/tasks/${task.id}`}
                      className="flex items-center gap-4 p-4 hover:bg-[var(--background-hover)] transition-colors"
                    >
                      <input
                        type="checkbox"
                        className="w-4 h-4 rounded border-[var(--border)]"
                        onClick={(e) => e.stopPropagation()}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-[var(--foreground)] truncate">
                          {task.title}
                        </div>
                        <div className="text-xs text-[var(--foreground-muted)]">
                          {task.project}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <PriorityBadge priority={task.priority} />
                        <div className="flex items-center gap-1 text-xs text-[var(--foreground-muted)]">
                          <Clock className="w-3 h-3" />
                          {task.dueTime}
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Projects */}
        <div>
          <Card padding="none">
            <CardHeader className="p-5 border-b border-[var(--border)]">
              <div className="flex items-center justify-between">
                <CardTitle>プロジェクト</CardTitle>
                <Link href="/app/projects" className="text-sm text-[var(--accent)] hover:underline">
                  すべて見る
                </Link>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-[var(--border)]">
                {recentProjects.map((project, i) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Link
                      href={`/app/projects/${project.id}`}
                      className="block p-4 hover:bg-[var(--background-hover)] transition-colors"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-medium text-[var(--foreground)]">{project.name}</div>
                        <div className="text-xs text-[var(--foreground-muted)]">
                          {project.tasks.completed}/{project.tasks.total}
                        </div>
                      </div>
                      <div className="w-full h-1.5 bg-[var(--background-tertiary)] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[var(--accent)] rounded-full transition-all"
                          style={{ width: `${(project.tasks.completed / project.tasks.total) * 100}%` }}
                        />
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick AI Action */}
          <Card className="mt-4 p-5 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="font-medium text-[var(--foreground)]">AIアシスタント</div>
                <div className="text-xs text-[var(--foreground-muted)]">タスクを自動化</div>
              </div>
            </div>
            <p className="text-sm text-[var(--foreground-secondary)] mb-4">
              会議のメモを貼り付けて、タスクを自動抽出しましょう
            </p>
            <Button variant="outline" className="w-full">
              <Brain className="w-4 h-4 mr-2" />
              AIに聞く
            </Button>
          </Card>
        </div>
      </div>
    </div>
  )
}

