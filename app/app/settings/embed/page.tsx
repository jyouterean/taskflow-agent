'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Plus, 
  Copy, 
  ExternalLink, 
  MoreHorizontal,
  Globe,
  Eye,
  Pencil,
  Trash,
  CheckCircle2,
  Code2,
  Layout,
  List,
  Kanban,
  BarChart3
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'

// Mock data
const widgets = [
  {
    id: 'w1',
    name: '今日のToDoリスト',
    type: 'IFRAME',
    targetType: 'MY_TASKS',
    viewMode: 'LIST',
    permissions: 'VIEW_ONLY',
    allowedDomains: ['portal.example.com', 'intranet.example.com'],
    isActive: true,
    createdAt: '2026-01-01',
    viewCount: 1234,
  },
  {
    id: 'w2',
    name: '営業案件ボード',
    type: 'IFRAME',
    targetType: 'PROJECT',
    targetName: '営業案件A',
    viewMode: 'BOARD',
    permissions: 'OPERATIONS_ALLOWED',
    allowedDomains: ['crm.example.com'],
    isActive: true,
    createdAt: '2026-01-02',
    viewCount: 567,
  },
  {
    id: 'w3',
    name: '開発進捗ダッシュボード',
    type: 'IFRAME',
    targetType: 'PROJECT',
    targetName: 'Backend API',
    viewMode: 'MINI_DASHBOARD',
    permissions: 'VIEW_ONLY',
    allowedDomains: ['status.example.com'],
    isActive: false,
    createdAt: '2025-12-15',
    viewCount: 89,
  },
]

const viewModeIcons = {
  LIST: List,
  BOARD: Kanban,
  MINI_DASHBOARD: BarChart3,
}

const viewModeLabels = {
  LIST: 'リスト',
  BOARD: 'ボード',
  MINI_DASHBOARD: 'ダッシュボード',
}

const targetTypeLabels = {
  MY_TASKS: 'マイタスク',
  PROJECT: 'プロジェクト',
  SAVED_FILTER: '保存済みフィルタ',
}

export default function EmbedSettingsPage() {
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showCodeDialog, setShowCodeDialog] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const copyCode = (widgetId: string) => {
    const code = `<iframe
  src="${process.env.NEXT_PUBLIC_APP_URL || 'https://app.taskflow.ai'}/embed/${widgetId}"
  width="100%"
  height="500"
  frameborder="0"
  allow="clipboard-write"
  style="border-radius: 12px;"
></iframe>`
    
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)]">Embed設定</h1>
          <p className="text-sm text-[var(--foreground-secondary)] mt-1">
            外部サイトに埋め込むウィジェットを管理
          </p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="w-4 h-4 mr-2" />
          新規ウィジェット
        </Button>
      </div>

      {/* Info Card */}
      <Card className="bg-[var(--accent-subtle)] border-[var(--accent)]/30">
        <div className="p-4 flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-[var(--accent)]/20 flex items-center justify-center shrink-0">
            <Code2 className="w-5 h-5 text-[var(--accent)]" />
          </div>
          <div>
            <h3 className="font-medium text-[var(--foreground)] mb-1">
              Embedウィジェットについて
            </h3>
            <p className="text-sm text-[var(--foreground-secondary)]">
              ウィジェットを作成すると、社内ポータルやCRMなど外部サイトにタスク管理UIを埋め込めます。
              ドメイン制限とトークン認証で安全に運用できます。
            </p>
          </div>
        </div>
      </Card>

      {/* Widgets List */}
      <div className="space-y-4">
        {widgets.map((widget, i) => {
          const ViewModeIcon = viewModeIcons[widget.viewMode as keyof typeof viewModeIcons]

          return (
            <motion.div
              key={widget.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className={cn(!widget.isActive && 'opacity-60')}>
                <div className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-[var(--background-tertiary)] flex items-center justify-center shrink-0">
                        <ViewModeIcon className="w-5 h-5 text-[var(--foreground-secondary)]" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-[var(--foreground)]">{widget.name}</h3>
                          {!widget.isActive && (
                            <Badge variant="default" size="sm">無効</Badge>
                          )}
                          {widget.permissions === 'OPERATIONS_ALLOWED' && (
                            <Badge variant="warning" size="sm">操作可</Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-3 mt-1 text-sm text-[var(--foreground-secondary)]">
                          <span>{targetTypeLabels[widget.targetType as keyof typeof targetTypeLabels]}</span>
                          {widget.targetName && (
                            <>
                              <span>•</span>
                              <span>{widget.targetName}</span>
                            </>
                          )}
                          <span>•</span>
                          <span>{viewModeLabels[widget.viewMode as keyof typeof viewModeLabels]}</span>
                        </div>
                        <div className="flex items-center gap-4 mt-3">
                          <div className="flex items-center gap-1 text-xs text-[var(--foreground-muted)]">
                            <Globe className="w-3 h-3" />
                            {widget.allowedDomains.length} ドメイン
                          </div>
                          <div className="flex items-center gap-1 text-xs text-[var(--foreground-muted)]">
                            <Eye className="w-3 h-3" />
                            {widget.viewCount.toLocaleString()} 表示
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setShowCodeDialog(widget.id)}
                      >
                        <Code2 className="w-4 h-4 mr-1" />
                        コード取得
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <ExternalLink className="w-4 h-4 mr-2" />
                            プレビュー
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Pencil className="w-4 h-4 mr-2" />
                            編集
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-400">
                            <Trash className="w-4 h-4 mr-2" />
                            削除
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          )
        })}
      </div>

      {widgets.length === 0 && (
        <Card className="p-12 text-center">
          <Layout className="w-12 h-12 text-[var(--foreground-muted)] mx-auto mb-4" />
          <h3 className="text-lg font-medium text-[var(--foreground)] mb-2">
            ウィジェットがありません
          </h3>
          <p className="text-sm text-[var(--foreground-secondary)] mb-6">
            最初のウィジェットを作成して、外部サイトにタスクUIを埋め込みましょう
          </p>
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className="w-4 h-4 mr-2" />
            ウィジェットを作成
          </Button>
        </Card>
      )}

      {/* Create Widget Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>新規ウィジェット作成</DialogTitle>
            <DialogDescription>
              外部サイトに埋め込むウィジェットを作成します
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <Input label="ウィジェット名" placeholder="例: 今日のToDoリスト" />

            <div>
              <label className="block text-sm font-medium text-[var(--foreground-secondary)] mb-1.5">
                表示対象
              </label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="選択してください" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MY_TASKS">マイタスク</SelectItem>
                  <SelectItem value="PROJECT">プロジェクト</SelectItem>
                  <SelectItem value="SAVED_FILTER">保存済みフィルタ</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--foreground-secondary)] mb-1.5">
                表示形式
              </label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="選択してください" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="LIST">リスト</SelectItem>
                  <SelectItem value="BOARD">ボード</SelectItem>
                  <SelectItem value="MINI_DASHBOARD">ミニダッシュボード</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--foreground-secondary)] mb-1.5">
                権限
              </label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="選択してください" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="VIEW_ONLY">閲覧のみ</SelectItem>
                  <SelectItem value="OPERATIONS_ALLOWED">操作可（上位プラン）</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Input
              label="許可ドメイン"
              placeholder="例: portal.example.com"
              hint="カンマ区切りで複数指定可。*.example.com で全サブドメインを許可"
            />
          </div>

          <DialogFooter>
            <Button variant="secondary" onClick={() => setShowCreateDialog(false)}>
              キャンセル
            </Button>
            <Button>作成</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Code Dialog */}
      <Dialog open={!!showCodeDialog} onOpenChange={() => setShowCodeDialog(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>埋め込みコード</DialogTitle>
            <DialogDescription>
              以下のコードを埋め込み先のHTMLに貼り付けてください
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <div className="relative">
              <pre className="p-4 bg-[var(--background-tertiary)] rounded-lg text-sm overflow-x-auto">
                <code className="text-[var(--foreground-secondary)]">
{`<iframe
  src="${process.env.NEXT_PUBLIC_APP_URL || 'https://app.taskflow.ai'}/embed/${showCodeDialog}"
  width="100%"
  height="500"
  frameborder="0"
  allow="clipboard-write"
  style="border-radius: 12px;"
></iframe>`}
                </code>
              </pre>
              <Button
                variant="secondary"
                size="sm"
                className="absolute top-2 right-2"
                onClick={() => showCodeDialog && copyCode(showCodeDialog)}
              >
                {copied ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 mr-1 text-emerald-400" />
                    コピー済み
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-1" />
                    コピー
                  </>
                )}
              </Button>
            </div>
          </div>

          <DialogFooter>
            <Button variant="secondary" onClick={() => setShowCodeDialog(null)}>
              閉じる
            </Button>
            <Button>
              <ExternalLink className="w-4 h-4 mr-2" />
              プレビュー
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

