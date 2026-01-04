'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Plus, 
  Search, 
  MoreHorizontal,
  Mail,
  Shield,
  UserMinus,
  UserCog,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Badge, RoleBadge } from '@/components/ui/badge'
import { Avatar } from '@/components/ui/avatar'
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
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'

// Mock data
const members = [
  {
    id: '1',
    name: '山田太郎',
    email: 'yamada@example.com',
    role: 'ADMIN',
    status: 'active',
    joinedAt: '2025-06-01',
    lastActiveAt: '2026-01-04',
    taskCount: 24,
  },
  {
    id: '2',
    name: '佐藤花子',
    email: 'sato@example.com',
    role: 'MANAGER',
    status: 'active',
    joinedAt: '2025-07-15',
    lastActiveAt: '2026-01-04',
    taskCount: 18,
  },
  {
    id: '3',
    name: '田中健一',
    email: 'tanaka@example.com',
    role: 'MEMBER',
    status: 'active',
    joinedAt: '2025-09-01',
    lastActiveAt: '2026-01-03',
    taskCount: 12,
  },
  {
    id: '4',
    name: '鈴木一郎',
    email: 'suzuki@example.com',
    role: 'MEMBER',
    status: 'inactive',
    joinedAt: '2025-08-01',
    lastActiveAt: '2025-12-01',
    taskCount: 5,
  },
]

const invitations = [
  {
    id: 'inv1',
    email: 'newuser@example.com',
    role: 'MEMBER',
    sentAt: '2026-01-03',
    expiresAt: '2026-01-10',
    status: 'pending',
  },
  {
    id: 'inv2',
    email: 'manager@example.com',
    role: 'MANAGER',
    sentAt: '2026-01-02',
    expiresAt: '2026-01-09',
    status: 'pending',
  },
]

export default function MembersSettingsPage() {
  const [showInviteDialog, setShowInviteDialog] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [inviteEmails, setInviteEmails] = useState('')
  const [inviteRole, setInviteRole] = useState('MEMBER')

  const filteredMembers = members.filter(
    (m) =>
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)]">メンバー管理</h1>
          <p className="text-sm text-[var(--foreground-secondary)] mt-1">
            組織のメンバーを招待・管理
          </p>
        </div>
        <Button onClick={() => setShowInviteDialog(true)}>
          <Plus className="w-4 h-4 mr-2" />
          メンバーを招待
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="text-2xl font-bold text-[var(--foreground)]">{members.length}</div>
          <div className="text-sm text-[var(--foreground-muted)]">メンバー</div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold text-emerald-400">
            {members.filter((m) => m.status === 'active').length}
          </div>
          <div className="text-sm text-[var(--foreground-muted)]">アクティブ</div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold text-amber-400">{invitations.length}</div>
          <div className="text-sm text-[var(--foreground-muted)]">保留中の招待</div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold text-[var(--accent)]">
            {members.filter((m) => m.role === 'ADMIN').length}
          </div>
          <div className="text-sm text-[var(--foreground-muted)]">管理者</div>
        </Card>
      </div>

      <Tabs defaultValue="members">
        <TabsList>
          <TabsTrigger value="members">メンバー ({members.length})</TabsTrigger>
          <TabsTrigger value="invitations">招待 ({invitations.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="members" className="mt-4">
          {/* Search */}
          <div className="mb-4 max-w-md">
            <Input
              placeholder="メンバーを検索..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<Search className="w-4 h-4" />}
            />
          </div>

          {/* Members List */}
          <Card padding="none">
            <div className="divide-y divide-[var(--border)]">
              {filteredMembers.map((member, i) => (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="flex items-center gap-4 p-4 hover:bg-[var(--background-hover)] transition-colors"
                >
                  <Avatar name={member.name} size="lg" />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-[var(--foreground)]">{member.name}</span>
                      <RoleBadge role={member.role} />
                      {member.status === 'inactive' && (
                        <Badge variant="default" size="sm">非アクティブ</Badge>
                      )}
                    </div>
                    <div className="text-sm text-[var(--foreground-muted)]">{member.email}</div>
                  </div>

                  <div className="text-right text-sm text-[var(--foreground-muted)]">
                    <div className="flex items-center gap-1 justify-end">
                      <Clock className="w-3 h-3" />
                      最終アクティブ:{' '}
                      {new Date(member.lastActiveAt).toLocaleDateString('ja-JP', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </div>
                    <div className="text-xs">{member.taskCount} タスク</div>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <UserCog className="w-4 h-4 mr-2" />
                        ロール変更
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Mail className="w-4 h-4 mr-2" />
                        メール送信
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-400">
                        <UserMinus className="w-4 h-4 mr-2" />
                        無効化
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </motion.div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="invitations" className="mt-4">
          <Card padding="none">
            <div className="divide-y divide-[var(--border)]">
              {invitations.map((invitation, i) => (
                <motion.div
                  key={invitation.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="flex items-center gap-4 p-4"
                >
                  <div className="w-10 h-10 rounded-full bg-[var(--background-tertiary)] flex items-center justify-center">
                    <Mail className="w-5 h-5 text-[var(--foreground-muted)]" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-[var(--foreground)]">
                        {invitation.email}
                      </span>
                      <RoleBadge role={invitation.role} />
                    </div>
                    <div className="text-sm text-[var(--foreground-muted)]">
                      送信:{' '}
                      {new Date(invitation.sentAt).toLocaleDateString('ja-JP', {
                        month: 'short',
                        day: 'numeric',
                      })}
                      {' • '}
                      期限:{' '}
                      {new Date(invitation.expiresAt).toLocaleDateString('ja-JP', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </div>
                  </div>

                  <Badge variant="warning" size="sm">保留中</Badge>

                  <div className="flex items-center gap-2">
                    <Button variant="secondary" size="sm">
                      再送信
                    </Button>
                    <Button variant="ghost" size="sm" className="text-red-400">
                      <XCircle className="w-4 h-4" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>

          {invitations.length === 0 && (
            <Card className="p-12 text-center">
              <Mail className="w-12 h-12 text-[var(--foreground-muted)] mx-auto mb-4" />
              <h3 className="text-lg font-medium text-[var(--foreground)] mb-2">
                保留中の招待はありません
              </h3>
              <p className="text-sm text-[var(--foreground-secondary)]">
                新しいメンバーを招待しましょう
              </p>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Invite Dialog */}
      <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>メンバーを招待</DialogTitle>
            <DialogDescription>
              メールアドレスを入力して組織にメンバーを招待します
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <label className="block text-sm font-medium text-[var(--foreground-secondary)] mb-1.5">
                メールアドレス
              </label>
              <textarea
                value={inviteEmails}
                onChange={(e) => setInviteEmails(e.target.value)}
                placeholder="example@company.com&#10;user2@company.com"
                className="w-full h-24 px-4 py-3 bg-[var(--background-tertiary)] border border-[var(--border)] rounded-lg text-[var(--foreground)] placeholder:text-[var(--foreground-muted)] focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20 transition-all resize-none"
              />
              <p className="mt-1 text-xs text-[var(--foreground-muted)]">
                複数のメールアドレスを改行で区切って入力できます
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--foreground-secondary)] mb-1.5">
                ロール
              </label>
              <Select value={inviteRole} onValueChange={setInviteRole}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MEMBER">
                    <div className="flex items-center gap-2">
                      <span>メンバー</span>
                      <span className="text-xs text-[var(--foreground-muted)]">
                        タスクの作成・編集
                      </span>
                    </div>
                  </SelectItem>
                  <SelectItem value="MANAGER">
                    <div className="flex items-center gap-2">
                      <span>マネージャー</span>
                      <span className="text-xs text-[var(--foreground-muted)]">
                        プロジェクト管理
                      </span>
                    </div>
                  </SelectItem>
                  <SelectItem value="ADMIN">
                    <div className="flex items-center gap-2">
                      <span>管理者</span>
                      <span className="text-xs text-[var(--foreground-muted)]">
                        全権限
                      </span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <p className="text-sm text-amber-400">
                  招待リンクは7日間有効です。期限切れの場合は再送信してください。
                </p>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="secondary" onClick={() => setShowInviteDialog(false)}>
              キャンセル
            </Button>
            <Button>
              <Mail className="w-4 h-4 mr-2" />
              招待を送信
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

