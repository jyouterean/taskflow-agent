'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  Layout, 
  Code2, 
  Shield, 
  Eye, 
  Pencil, 
  Kanban,
  List,
  BarChart3,
  Globe,
  Key,
  CheckCircle2,
  ArrowRight,
  Copy,
  Play
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useState } from 'react'
import { cn } from '@/lib/utils'

const embedTypes = [
  {
    icon: List,
    name: 'リスト表示',
    desc: 'シンプルなタスクリスト',
    preview: 'list',
  },
  {
    icon: Kanban,
    name: 'ボード表示',
    desc: 'カンバン形式でステータス管理',
    preview: 'board',
  },
  {
    icon: BarChart3,
    name: 'ミニダッシュボード',
    desc: 'KPIと進捗サマリー',
    preview: 'dashboard',
  },
]

const embedTargets = [
  { name: 'My Tasks', desc: '自分のタスク一覧' },
  { name: 'Project', desc: '特定プロジェクトのタスク' },
  { name: 'Saved Filter', desc: '保存した条件でフィルタ' },
]

const securityFeatures = [
  { icon: Globe, name: 'ドメイン制限', desc: 'ホワイトリスト方式' },
  { icon: Key, name: 'トークン認証', desc: 'スコープ付き短命トークン' },
  { icon: Eye, name: '権限制御', desc: '閲覧のみ / 操作可' },
  { icon: Shield, name: 'CSP', desc: 'frame-ancestors で保護' },
]

const codeExample = `<!-- TaskFlow Embed -->
<iframe
  src="https://app.taskflow.ai/embed/abc123"
  width="100%"
  height="500"
  frameborder="0"
  allow="clipboard-write"
  style="border-radius: 12px;"
></iframe>`

export default function EmbedPage() {
  const [selectedType, setSelectedType] = useState('list')
  const [copied, setCopied] = useState(false)

  const copyCode = () => {
    navigator.clipboard.writeText(codeExample)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="py-24 gradient-mesh">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/15 text-cyan-400 text-sm mb-6">
              <Layout className="w-4 h-4" />
              Embed Ready
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-[var(--foreground)]">
              どこにでも埋め込める
              <span className="gradient-glow bg-clip-text text-transparent ml-2">タスクUI</span>
            </h1>
            <p className="mt-6 text-lg text-[var(--foreground-secondary)]">
              社内ポータル、CRM、顧客管理システムにタスク管理UIをiframeで埋め込み。ドメイン制限とトークン認証で安全に運用できます。
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup">
                <Button size="lg" className="gap-2">
                  無料で試す
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/docs/embed">
                <Button variant="secondary" size="lg">
                  ドキュメント
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Demo Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-[var(--foreground)]">3つの表示形式</h2>
            <p className="mt-4 text-[var(--foreground-secondary)]">
              用途に合わせて最適な表示形式を選択
            </p>
          </motion.div>

          {/* Type Selector */}
          <div className="flex justify-center gap-4 mb-8">
            {embedTypes.map((type) => (
              <button
                key={type.preview}
                onClick={() => setSelectedType(type.preview)}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all',
                  selectedType === type.preview
                    ? 'bg-[var(--accent)] text-white'
                    : 'bg-[var(--background-tertiary)] text-[var(--foreground-secondary)] hover:bg-[var(--background-hover)]'
                )}
              >
                <type.icon className="w-4 h-4" />
                {type.name}
              </button>
            ))}
          </div>

          {/* Preview */}
          <motion.div
            key={selectedType}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-4xl mx-auto"
          >
            <Card className="overflow-hidden">
              {/* Preview Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)] bg-[var(--background-tertiary)]">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/60" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                  <div className="w-3 h-3 rounded-full bg-green-500/60" />
                </div>
                <span className="text-xs text-[var(--foreground-muted)]">
                  社内ポータル — example.company.com
                </span>
                <div />
              </div>

              {/* Preview Content */}
              <div className="p-8 bg-[var(--background)]">
                <div className="text-sm text-[var(--foreground-secondary)] mb-4">
                  📊 プロジェクト進捗
                </div>

                {/* Embedded Widget */}
                <div className="bg-[var(--background-secondary)] border border-[var(--border)] rounded-xl p-4">
                  {selectedType === 'list' && (
                    <div className="space-y-3">
                      {['API設計レビュー', 'ドキュメント更新', 'リリース準備'].map((task, i) => (
                        <div
                          key={task}
                          className="flex items-center justify-between p-3 bg-[var(--background-tertiary)] rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <input type="checkbox" className="w-4 h-4" readOnly />
                            <span className="text-sm">{task}</span>
                          </div>
                          <span className={cn(
                            'text-xs px-2 py-1 rounded-full',
                            i === 0 ? 'bg-blue-500/15 text-blue-400' :
                            i === 1 ? 'bg-amber-500/15 text-amber-400' :
                            'bg-emerald-500/15 text-emerald-400'
                          )}>
                            {i === 0 ? '進行中' : i === 1 ? '未着手' : '完了'}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {selectedType === 'board' && (
                    <div className="grid grid-cols-3 gap-4">
                      {['未着手', '進行中', '完了'].map((status, col) => (
                        <div key={status} className="space-y-2">
                          <div className="text-xs font-medium text-[var(--foreground-muted)] uppercase">
                            {status}
                          </div>
                          {[0, 1].slice(0, col === 1 ? 2 : 1).map((_, i) => (
                            <div
                              key={i}
                              className="p-3 bg-[var(--background-tertiary)] rounded-lg text-sm"
                            >
                              タスク {col + 1}-{i + 1}
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  )}

                  {selectedType === 'dashboard' && (
                    <div className="grid grid-cols-3 gap-4">
                      <div className="p-4 bg-[var(--background-tertiary)] rounded-lg text-center">
                        <div className="text-2xl font-bold text-[var(--accent)]">12</div>
                        <div className="text-xs text-[var(--foreground-muted)]">完了</div>
                      </div>
                      <div className="p-4 bg-[var(--background-tertiary)] rounded-lg text-center">
                        <div className="text-2xl font-bold text-amber-400">5</div>
                        <div className="text-xs text-[var(--foreground-muted)]">進行中</div>
                      </div>
                      <div className="p-4 bg-[var(--background-tertiary)] rounded-lg text-center">
                        <div className="text-2xl font-bold text-red-400">2</div>
                        <div className="text-xs text-[var(--foreground-muted)]">遅延</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Code Example */}
      <section className="py-20 bg-[var(--background-secondary)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-[var(--foreground)] mb-6">
                簡単に埋め込み
              </h2>
              <p className="text-[var(--foreground-secondary)] mb-6">
                管理画面でウィジェットを作成し、発行されたコードをコピー&ペーストするだけ。数分で完了します。
              </p>

              <ol className="space-y-4">
                {[
                  '設定画面でEmbedウィジェットを作成',
                  '表示対象・形式・権限を設定',
                  '許可ドメインをホワイトリストに追加',
                  '発行されたコードを埋め込み先にペースト',
                ].map((step, i) => (
                  <li key={step} className="flex items-start gap-3">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[var(--accent)] text-white text-sm font-medium shrink-0">
                      {i + 1}
                    </span>
                    <span className="text-[var(--foreground)]">{step}</span>
                  </li>
                ))}
              </ol>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Card className="overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)] bg-[var(--background-tertiary)]">
                  <span className="text-xs text-[var(--foreground-muted)] font-mono">HTML</span>
                  <button
                    onClick={copyCode}
                    className="flex items-center gap-1.5 text-xs text-[var(--foreground-secondary)] hover:text-[var(--foreground)] transition-colors"
                  >
                    {copied ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        コピー済み
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        コピー
                      </>
                    )}
                  </button>
                </div>
                <pre className="p-6 text-sm overflow-x-auto">
                  <code className="text-[var(--foreground-secondary)]">{codeExample}</code>
                </pre>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Security */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-[var(--foreground)]">安全な埋め込み</h2>
            <p className="mt-4 text-[var(--foreground-secondary)]">
              複数のセキュリティレイヤーで保護
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {securityFeatures.map((feature, i) => (
              <motion.div
                key={feature.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                viewport={{ once: true }}
              >
                <Card className="p-6 text-center h-full">
                  <div className="w-12 h-12 mx-auto rounded-xl bg-emerald-500/15 flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-emerald-400" />
                  </div>
                  <h3 className="font-semibold text-[var(--foreground)] mb-1">
                    {feature.name}
                  </h3>
                  <p className="text-sm text-[var(--foreground-secondary)]">{feature.desc}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-[var(--background-secondary)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-[var(--foreground)] mb-4">
              今すぐ埋め込みを試す
            </h2>
            <p className="text-lg text-[var(--foreground-secondary)] mb-8">
              無料プランでも1ウィジェット作成可能
            </p>
            <Link href="/signup">
              <Button size="lg" className="gap-2">
                無料で始める
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

