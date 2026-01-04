'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { Search, Bell, Plus, Command, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar } from '@/components/ui/avatar'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

export function AppHeader() {
  const { data: session } = useSession()
  const [showSearch, setShowSearch] = useState(false)
  const [showAgentDialog, setShowAgentDialog] = useState(false)
  const [agentInput, setAgentInput] = useState('')

  return (
    <>
      <header className="h-16 border-b border-[var(--border)] bg-[var(--background-secondary)] flex items-center px-6 gap-4">
        {/* Search */}
        <div className="flex-1 max-w-xl">
          <button
            onClick={() => setShowSearch(true)}
            className="flex items-center gap-3 w-full px-4 py-2 text-sm text-[var(--foreground-muted)] bg-[var(--background-tertiary)] border border-[var(--border)] rounded-lg hover:border-[var(--accent)] transition-colors"
          >
            <Search className="w-4 h-4" />
            <span className="flex-1 text-left">タスクを検索...</span>
            <kbd className="hidden sm:flex items-center gap-1 px-2 py-0.5 text-xs bg-[var(--background-secondary)] border border-[var(--border)] rounded">
              <Command className="w-3 h-3" />
              K
            </kbd>
          </button>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* AI Agent Quick Access */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAgentDialog(true)}
            className="hidden sm:flex gap-2"
          >
            <Sparkles className="w-4 h-4" />
            AIに聞く
          </Button>

          {/* Notifications */}
          <button className="relative p-2 rounded-lg hover:bg-[var(--background-hover)] transition-colors">
            <Bell className="w-5 h-5 text-[var(--foreground-secondary)]" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-[var(--accent)] rounded-full" />
          </button>
        </div>
      </header>

      {/* Search Dialog */}
      <Dialog open={showSearch} onOpenChange={setShowSearch}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>検索</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="タスク、プロジェクト、メンバーを検索..."
              leftIcon={<Search className="w-4 h-4" />}
              autoFocus
            />
            <div className="text-sm text-[var(--foreground-muted)]">
              最近のアイテム
            </div>
            <div className="space-y-2">
              {['API設計レビュー', 'ドキュメント更新', 'クライアントMTG'].map((item) => (
                <button
                  key={item}
                  className="flex items-center gap-3 w-full p-3 text-left rounded-lg hover:bg-[var(--background-hover)] transition-colors"
                >
                  <div className="w-8 h-8 rounded bg-[var(--background-tertiary)] flex items-center justify-center">
                    <Search className="w-4 h-4 text-[var(--foreground-muted)]" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-[var(--foreground)]">{item}</div>
                    <div className="text-xs text-[var(--foreground-muted)]">タスク</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* AI Agent Dialog */}
      <Dialog open={showAgentDialog} onOpenChange={setShowAgentDialog}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              AIエージェント
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-[var(--foreground-secondary)]">
              会議のメモや要望を入力してください。AIがタスクを抽出・提案します。
            </p>
            <textarea
              value={agentInput}
              onChange={(e) => setAgentInput(e.target.value)}
              placeholder="例: 今日のMTGで決まったこと&#10;- 田中さんが来週までにデザイン案を作成&#10;- 佐藤さんがクライアントに確認を取る&#10;- 次回MTGは金曜日"
              className="w-full h-40 px-4 py-3 bg-[var(--background-tertiary)] border border-[var(--border)] rounded-lg text-[var(--foreground)] placeholder:text-[var(--foreground-muted)] focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20 transition-all resize-none"
            />
            <div className="flex justify-end gap-2">
              <Button variant="secondary" onClick={() => setShowAgentDialog(false)}>
                キャンセル
              </Button>
              <Button className="gap-2">
                <Sparkles className="w-4 h-4" />
                タスクを抽出
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

