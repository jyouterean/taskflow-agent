'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Building2, 
  Upload, 
  Save,
  Globe,
  Link,
  AlertCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default function OrgSettingsPage() {
  const [orgName, setOrgName] = useState('株式会社サンプル')
  const [orgSlug, setOrgSlug] = useState('sample-corp')
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsSaving(false)
  }

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-[var(--foreground)]">組織設定</h1>
        <p className="text-sm text-[var(--foreground-secondary)] mt-1">
          組織の基本情報を管理
        </p>
      </div>

      {/* Plan Info */}
      <Card className="bg-[var(--accent-subtle)] border-[var(--accent)]/30">
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-[var(--accent)]/20 flex items-center justify-center">
              <Building2 className="w-5 h-5 text-[var(--accent)]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-[var(--foreground)]">Pro プラン</span>
                <Badge variant="primary" size="sm">アクティブ</Badge>
              </div>
              <p className="text-sm text-[var(--foreground-secondary)]">
                25ユーザー • 無制限プロジェクト • AIエージェント500回/月
              </p>
            </div>
          </div>
          <Button variant="outline" size="sm">
            プランを変更
          </Button>
        </div>
      </Card>

      {/* Basic Info */}
      <Card>
        <CardHeader>
          <CardTitle>基本情報</CardTitle>
          <CardDescription>組織の表示名とURLを設定</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            label="組織名"
            value={orgName}
            onChange={(e) => setOrgName(e.target.value)}
            placeholder="株式会社サンプル"
          />

          <div>
            <label className="block text-sm font-medium text-[var(--foreground-secondary)] mb-1.5">
              組織スラッグ
            </label>
            <div className="flex">
              <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-[var(--border)] bg-[var(--background-tertiary)] text-sm text-[var(--foreground-muted)]">
                taskflow.ai/
              </span>
              <input
                value={orgSlug}
                onChange={(e) => setOrgSlug(e.target.value)}
                className="flex-1 px-4 py-2.5 bg-[var(--background-tertiary)] border border-[var(--border)] rounded-r-lg text-[var(--foreground)] focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20 transition-all"
              />
            </div>
            <p className="mt-1.5 text-xs text-[var(--foreground-muted)]">
              この値はURLに使用されます。変更には注意してください。
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--foreground-secondary)] mb-1.5">
              ロゴ
            </label>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-lg bg-[var(--background-tertiary)] border border-[var(--border)] flex items-center justify-center">
                <Building2 className="w-8 h-8 text-[var(--foreground-muted)]" />
              </div>
              <Button variant="secondary" size="sm">
                <Upload className="w-4 h-4 mr-2" />
                アップロード
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-red-500/30">
        <CardHeader>
          <CardTitle className="text-red-400">危険な操作</CardTitle>
          <CardDescription>これらの操作は取り消せません</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-red-500/5 rounded-lg">
            <div>
              <div className="font-medium text-[var(--foreground)]">組織を削除</div>
              <div className="text-sm text-[var(--foreground-secondary)]">
                すべてのデータが完全に削除されます
              </div>
            </div>
            <Button variant="danger" size="sm">
              削除
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} isLoading={isSaving}>
          <Save className="w-4 h-4 mr-2" />
          保存
        </Button>
      </div>
    </div>
  )
}

