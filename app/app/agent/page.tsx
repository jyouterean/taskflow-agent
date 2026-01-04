'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Brain, 
  Sparkles, 
  Clock, 
  CheckCircle2, 
  XCircle,
  AlertCircle,
  ArrowRight,
  Eye,
  RotateCcw,
  Zap
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'

// Mock data
const agentRuns = [
  {
    id: 'run1',
    type: 'INTAKE',
    input: '今日のMTGで決まったこと：田中さんが来週までにデザイン案を作成、佐藤さんがクライアントに確認を取る',
    output: {
      task_drafts: [
        { title: 'デザイン案作成', assignee_guess: '田中', priority_guess: 'HIGH', confidence: 0.9 },
        { title: 'クライアント確認', assignee_guess: '佐藤', priority_guess: 'MEDIUM', confidence: 0.85 },
      ],
      next_action: 'CREATE_TASKS',
    },
    status: 'COMPLETED',
    createdAt: '2026-01-04T10:30:00Z',
    tokensUsed: 1250,
  },
  {
    id: 'run2',
    type: 'PLANNER',
    input: '新規Webアプリ開発プロジェクトを計画してください',
    output: {
      project_name: 'Webアプリ開発',
      milestones: [
        { name: '要件定義', tasks: 3 },
        { name: '設計', tasks: 5 },
        { name: '開発', tasks: 8 },
        { name: 'テスト', tasks: 4 },
      ],
    },
    status: 'APPROVAL_REQUIRED',
    createdAt: '2026-01-04T09:15:00Z',
    tokensUsed: 2100,
  },
  {
    id: 'run3',
    type: 'OPS',
    input: '今日の優先タスクを教えてください',
    output: {
      summary: '本日は3件の重要タスクがあります',
      today_focus: [
        { task_title: 'API設計レビュー', priority: 'HIGH' },
        { task_title: 'クライアントMTG資料', priority: 'URGENT' },
      ],
      delays: [
        { task_title: 'ドキュメント更新', days_overdue: 2 },
      ],
    },
    status: 'COMPLETED',
    createdAt: '2026-01-04T08:00:00Z',
    tokensUsed: 890,
  },
  {
    id: 'run4',
    type: 'INTAKE',
    input: 'テスト入力',
    output: null,
    status: 'FAILED',
    error: 'OpenAI API rate limit exceeded',
    createdAt: '2026-01-03T16:30:00Z',
    tokensUsed: 0,
  },
]

const pendingApprovals = agentRuns.filter((r) => r.status === 'APPROVAL_REQUIRED')

const agentTypeLabels: Record<string, { label: string; color: string; icon: typeof Brain }> = {
  INTAKE: { label: 'Intake', color: 'from-blue-500 to-cyan-500', icon: Sparkles },
  PLANNER: { label: 'Planner', color: 'from-purple-500 to-pink-500', icon: Brain },
  OPS: { label: 'Ops', color: 'from-orange-500 to-amber-500', icon: Zap },
  EMBED_COPILOT: { label: 'Embed Copilot', color: 'from-emerald-500 to-teal-500', icon: Brain },
}

const statusConfig: Record<string, { label: string; variant: 'default' | 'success' | 'warning' | 'error' }> = {
  COMPLETED: { label: '完了', variant: 'success' },
  RUNNING: { label: '実行中', variant: 'default' },
  APPROVAL_REQUIRED: { label: '承認待ち', variant: 'warning' },
  FAILED: { label: '失敗', variant: 'error' },
  REJECTED: { label: '却下', variant: 'error' },
}

export default function AgentPage() {
  const [selectedRun, setSelectedRun] = useState<string | null>(null)

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)]">AIエージェント</h1>
          <p className="text-sm text-[var(--foreground-secondary)] mt-1">
            エージェントの実行履歴と承認待ちタスク
          </p>
        </div>
      </div>

      {/* Pending Approvals Alert */}
      {pendingApprovals.length > 0 && (
        <Card className="border-amber-500/30 bg-amber-500/5">
          <div className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-amber-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-[var(--foreground)]">
                  {pendingApprovals.length}件の承認待ち
                </h3>
                <p className="text-sm text-[var(--foreground-secondary)]">
                  AIエージェントが提案したアクションが承認を待っています
                </p>
              </div>
              <Button variant="outline" size="sm">
                確認する
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="text-2xl font-bold text-[var(--foreground)]">
            {agentRuns.length}
          </div>
          <div className="text-sm text-[var(--foreground-muted)]">今日の実行</div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold text-emerald-400">
            {agentRuns.filter((r) => r.status === 'COMPLETED').length}
          </div>
          <div className="text-sm text-[var(--foreground-muted)]">成功</div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold text-amber-400">
            {pendingApprovals.length}
          </div>
          <div className="text-sm text-[var(--foreground-muted)]">承認待ち</div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold text-[var(--accent)]">
            {agentRuns.reduce((sum, r) => sum + r.tokensUsed, 0).toLocaleString()}
          </div>
          <div className="text-sm text-[var(--foreground-muted)]">使用トークン</div>
        </Card>
      </div>

      {/* Agent Types */}
      <div className="grid grid-cols-4 gap-4">
        {Object.entries(agentTypeLabels).map(([type, config]) => {
          const runs = agentRuns.filter((r) => r.type === type)
          const Icon = config.icon

          return (
            <Card key={type} className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <div
                  className={cn(
                    'w-10 h-10 rounded-lg bg-gradient-to-br flex items-center justify-center',
                    config.color
                  )}
                >
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="font-medium text-[var(--foreground)]">{config.label}</div>
                  <div className="text-xs text-[var(--foreground-muted)]">{runs.length} 実行</div>
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Execution History */}
      <Card padding="none">
        <CardHeader className="p-5 border-b border-[var(--border)]">
          <CardTitle>実行履歴</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-[var(--border)]">
            {agentRuns.map((run, i) => {
              const typeConfig = agentTypeLabels[run.type]
              const status = statusConfig[run.status]
              const Icon = typeConfig.icon

              return (
                <motion.div
                  key={run.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="p-4 hover:bg-[var(--background-hover)] transition-colors cursor-pointer"
                  onClick={() => setSelectedRun(selectedRun === run.id ? null : run.id)}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={cn(
                        'w-10 h-10 rounded-lg bg-gradient-to-br flex items-center justify-center shrink-0',
                        typeConfig.color
                      )}
                    >
                      <Icon className="w-5 h-5 text-white" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-[var(--foreground)]">
                          {typeConfig.label} Agent
                        </span>
                        <Badge variant={status.variant} size="sm">
                          {status.label}
                        </Badge>
                      </div>
                      <p className="text-sm text-[var(--foreground-secondary)] line-clamp-1">
                        {run.input}
                      </p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-[var(--foreground-muted)]">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(run.createdAt).toLocaleTimeString('ja-JP', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </div>
                        <span>•</span>
                        <span>{run.tokensUsed.toLocaleString()} トークン</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {run.status === 'APPROVAL_REQUIRED' && (
                        <>
                          <Button variant="secondary" size="sm">
                            却下
                          </Button>
                          <Button size="sm">承認</Button>
                        </>
                      )}
                      {run.status === 'FAILED' && (
                        <Button variant="secondary" size="sm">
                          <RotateCcw className="w-4 h-4 mr-1" />
                          再実行
                        </Button>
                      )}
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Expanded Output */}
                  {selectedRun === run.id && run.output && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      className="mt-4 p-4 bg-[var(--background-tertiary)] rounded-lg"
                    >
                      <div className="text-sm font-medium text-[var(--foreground)] mb-2">
                        出力:
                      </div>
                      <pre className="text-xs text-[var(--foreground-secondary)] overflow-x-auto">
                        {JSON.stringify(run.output, null, 2)}
                      </pre>
                    </motion.div>
                  )}

                  {/* Error */}
                  {selectedRun === run.id && run.error && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-lg"
                    >
                      <div className="flex items-center gap-2 text-sm text-red-400">
                        <XCircle className="w-4 h-4" />
                        {run.error}
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

