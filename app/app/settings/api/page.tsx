'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Plus, 
  Key, 
  Copy, 
  Trash,
  Eye,
  EyeOff,
  Clock,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Webhook
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'

// Mock data
const apiKeys = [
  {
    id: 'key1',
    name: 'Production API',
    keyPrefix: 'tf_prod_',
    createdAt: '2025-12-01',
    lastUsedAt: '2026-01-04T10:30:00Z',
  },
  {
    id: 'key2',
    name: 'Development API',
    keyPrefix: 'tf_dev_',
    createdAt: '2025-11-15',
    lastUsedAt: '2026-01-03T16:45:00Z',
  },
]

const webhooks = [
  {
    id: 'wh1',
    url: 'https://api.example.com/webhooks/taskflow',
    events: ['task.created', 'task.updated', 'task.completed'],
    status: 'active',
    createdAt: '2025-12-15',
    lastTriggeredAt: '2026-01-04T09:00:00Z',
  },
]

export default function ApiSettingsPage() {
  const [showCreateKeyDialog, setShowCreateKeyDialog] = useState(false)
  const [showCreateWebhookDialog, setShowCreateWebhookDialog] = useState(false)
  const [newKey, setNewKey] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const copyKey = () => {
    if (newKey) {
      navigator.clipboard.writeText(newKey)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleCreateKey = () => {
    // Simulate key creation
    setNewKey('tf_prod_sk_1234567890abcdefghijklmnopqrstuvwxyz')
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-[var(--foreground)]">API / Webhook</h1>
        <p className="text-sm text-[var(--foreground-secondary)] mt-1">
          APIキーとWebhookを管理
        </p>
      </div>

      <Tabs defaultValue="api-keys">
        <TabsList>
          <TabsTrigger value="api-keys">APIキー</TabsTrigger>
          <TabsTrigger value="webhooks">Webhook</TabsTrigger>
          <TabsTrigger value="usage">使用状況</TabsTrigger>
        </TabsList>

        <TabsContent value="api-keys" className="mt-4 space-y-4">
          {/* Info */}
          <Card className="bg-[var(--accent-subtle)] border-[var(--accent)]/30">
            <div className="p-4 flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-[var(--accent)]/20 flex items-center justify-center shrink-0">
                <Key className="w-5 h-5 text-[var(--accent)]" />
              </div>
              <div>
                <h3 className="font-medium text-[var(--foreground)] mb-1">APIキーについて</h3>
                <p className="text-sm text-[var(--foreground-secondary)]">
                  APIキーを使用して、外部システムからTaskFlow APIにアクセスできます。
                  キーは作成時に一度だけ表示されます。安全に保管してください。
                </p>
                <a
                  href="/developers"
                  className="inline-flex items-center gap-1 text-sm text-[var(--accent)] hover:underline mt-2"
                >
                  APIドキュメント
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </Card>

          {/* API Keys List */}
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-[var(--foreground)]">APIキー</h2>
            <Button onClick={() => setShowCreateKeyDialog(true)}>
              <Plus className="w-4 h-4 mr-2" />
              新規キー作成
            </Button>
          </div>

          <Card padding="none">
            <div className="divide-y divide-[var(--border)]">
              {apiKeys.map((key, i) => (
                <motion.div
                  key={key.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="flex items-center gap-4 p-4"
                >
                  <div className="w-10 h-10 rounded-lg bg-[var(--background-tertiary)] flex items-center justify-center shrink-0">
                    <Key className="w-5 h-5 text-[var(--foreground-muted)]" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-[var(--foreground)]">{key.name}</div>
                    <div className="text-sm text-[var(--foreground-muted)] font-mono">
                      {key.keyPrefix}••••••••••••••••
                    </div>
                  </div>

                  <div className="text-right text-sm text-[var(--foreground-muted)]">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      最終使用:{' '}
                      {new Date(key.lastUsedAt).toLocaleDateString('ja-JP', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  </div>

                  <Button variant="ghost" size="sm" className="text-red-400">
                    <Trash className="w-4 h-4" />
                  </Button>
                </motion.div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="webhooks" className="mt-4 space-y-4">
          {/* Webhooks */}
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-[var(--foreground)]">Webhook</h2>
            <Button onClick={() => setShowCreateWebhookDialog(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Webhook追加
            </Button>
          </div>

          <Card padding="none">
            <div className="divide-y divide-[var(--border)]">
              {webhooks.map((webhook, i) => (
                <motion.div
                  key={webhook.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="p-4"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[var(--background-tertiary)] flex items-center justify-center">
                        <Webhook className="w-5 h-5 text-[var(--foreground-muted)]" />
                      </div>
                      <div>
                        <div className="font-mono text-sm text-[var(--foreground)]">
                          {webhook.url}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="success" size="sm">アクティブ</Badge>
                        </div>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="text-red-400">
                      <Trash className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="ml-13 flex flex-wrap gap-1">
                    {webhook.events.map((event) => (
                      <Badge key={event} variant="default" size="sm">
                        {event}
                      </Badge>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>

          {webhooks.length === 0 && (
            <Card className="p-12 text-center">
              <Webhook className="w-12 h-12 text-[var(--foreground-muted)] mx-auto mb-4" />
              <h3 className="text-lg font-medium text-[var(--foreground)] mb-2">
                Webhookがありません
              </h3>
              <p className="text-sm text-[var(--foreground-secondary)]">
                イベント発生時に外部URLに通知を送信できます
              </p>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="usage" className="mt-4 space-y-4">
          {/* Usage Stats */}
          <Card>
            <CardHeader>
              <CardTitle>API使用状況</CardTitle>
              <CardDescription>今月のAPI呼び出し回数</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-[var(--background-tertiary)] rounded-lg">
                  <div className="text-2xl font-bold text-[var(--foreground)]">1,234</div>
                  <div className="text-sm text-[var(--foreground-muted)]">API呼び出し</div>
                </div>
                <div className="p-4 bg-[var(--background-tertiary)] rounded-lg">
                  <div className="text-2xl font-bold text-[var(--foreground)]">56</div>
                  <div className="text-sm text-[var(--foreground-muted)]">Webhook送信</div>
                </div>
                <div className="p-4 bg-[var(--background-tertiary)] rounded-lg">
                  <div className="text-2xl font-bold text-emerald-400">99.8%</div>
                  <div className="text-sm text-[var(--foreground-muted)]">成功率</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Create API Key Dialog */}
      <Dialog open={showCreateKeyDialog} onOpenChange={setShowCreateKeyDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>新規APIキー作成</DialogTitle>
            <DialogDescription>
              新しいAPIキーを作成します。キーは一度だけ表示されます。
            </DialogDescription>
          </DialogHeader>

          {!newKey ? (
            <div className="space-y-4 py-4">
              <Input label="キー名" placeholder="例: Production API" />
            </div>
          ) : (
            <div className="space-y-4 py-4">
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
                <div className="flex items-center gap-2 text-sm text-emerald-400 mb-2">
                  <CheckCircle2 className="w-4 h-4" />
                  APIキーが作成されました
                </div>
                <div className="relative">
                  <code className="block p-3 bg-[var(--background-tertiary)] rounded text-sm font-mono text-[var(--foreground)] break-all">
                    {newKey}
                  </code>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="absolute top-1 right-1"
                    onClick={copyKey}
                  >
                    {copied ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>
              <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <p className="text-sm text-amber-400">
                    このキーは二度と表示されません。今すぐ安全な場所に保存してください。
                  </p>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            {!newKey ? (
              <>
                <Button variant="secondary" onClick={() => setShowCreateKeyDialog(false)}>
                  キャンセル
                </Button>
                <Button onClick={handleCreateKey}>作成</Button>
              </>
            ) : (
              <Button onClick={() => {
                setShowCreateKeyDialog(false)
                setNewKey(null)
              }}>
                完了
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Webhook Dialog */}
      <Dialog open={showCreateWebhookDialog} onOpenChange={setShowCreateWebhookDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Webhook追加</DialogTitle>
            <DialogDescription>
              イベント発生時に通知を受け取るURLを設定
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <Input label="Webhook URL" placeholder="https://api.example.com/webhook" />
            <div>
              <label className="block text-sm font-medium text-[var(--foreground-secondary)] mb-1.5">
                イベント
              </label>
              <div className="space-y-2">
                {['task.created', 'task.updated', 'task.completed', 'task.deleted', 'project.created'].map(
                  (event) => (
                    <label key={event} className="flex items-center gap-2">
                      <input type="checkbox" className="w-4 h-4 rounded" />
                      <span className="text-sm text-[var(--foreground)]">{event}</span>
                    </label>
                  )
                )}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="secondary" onClick={() => setShowCreateWebhookDialog(false)}>
              キャンセル
            </Button>
            <Button>追加</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

