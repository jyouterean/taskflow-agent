'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  CheckCircle2, 
  ArrowRight, 
  Layout, 
  Brain, 
  Users, 
  Kanban,
  Calendar,
  ListTodo,
  Clock,
  Zap,
  Shield,
  Code2,
  Sparkles,
  BarChart3,
  Bell,
  Filter
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

const features = [
  {
    category: 'タスク管理',
    icon: CheckCircle2,
    items: [
      { title: '個人ToDo', desc: '自分だけのタスクリストを作成・管理', icon: ListTodo },
      { title: 'プロジェクトタスク', desc: 'チームで共有するプロジェクトタスク', icon: Users },
      { title: 'カンバンボード', desc: 'ドラッグ&ドロップでステータス管理', icon: Kanban },
      { title: 'カレンダー表示', desc: '期限をカレンダーで可視化', icon: Calendar },
      { title: 'タイムライン', desc: 'ガントチャート風の進捗管理', icon: Clock },
      { title: 'フィルタ・検索', desc: '条件を組み合わせた高度な絞り込み', icon: Filter },
    ],
  },
  {
    category: 'AIエージェント',
    icon: Brain,
    items: [
      { title: 'Intake Agent', desc: 'テキストからタスクを自動抽出', icon: Sparkles },
      { title: 'Planner Agent', desc: 'プロジェクト計画・WBS作成', icon: BarChart3 },
      { title: 'Ops Agent', desc: '日次サマリー・遅延検知', icon: Bell },
      { title: 'Embed Copilot', desc: '埋め込み設定をアシスト', icon: Code2 },
    ],
  },
  {
    category: 'Embed（埋め込み）',
    icon: Layout,
    items: [
      { title: 'iframe配信', desc: '任意のWebページにタスクUIを埋め込み', icon: Layout },
      { title: 'ドメイン制限', desc: 'ホワイトリスト方式で安全に運用', icon: Shield },
      { title: '権限制御', desc: '閲覧のみ / 操作可を選択', icon: Users },
      { title: '複数ビュー', desc: 'List / Board / Mini Dashboard', icon: Kanban },
    ],
  },
  {
    category: 'エンタープライズ',
    icon: Shield,
    items: [
      { title: 'RBAC', desc: 'Admin / Manager / Member の3ロール', icon: Users },
      { title: '監査ログ', desc: '全操作を記録・追跡', icon: BarChart3 },
      { title: '承認フロー', desc: '破壊的操作は承認必須', icon: CheckCircle2 },
      { title: 'API / Webhook', desc: '外部システムとの連携', icon: Code2 },
    ],
  },
]

export default function FeaturesPage() {
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
            <h1 className="text-4xl sm:text-5xl font-bold text-[var(--foreground)]">
              すべての
              <span className="gradient-glow bg-clip-text text-transparent ml-2">機能</span>
            </h1>
            <p className="mt-6 text-lg text-[var(--foreground-secondary)]">
              TaskFlow Agentは、ToDo管理からプロジェクト運用、AIによる自動化、外部システムへの埋め込みまで、あらゆる業務をカバーします。
            </p>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      {features.map((section, sectionIdx) => (
        <section
          key={section.category}
          className={`py-20 ${sectionIdx % 2 === 0 ? 'bg-[var(--background)]' : 'bg-[var(--background-secondary)]'}`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-3 mb-12"
            >
              <div className="w-12 h-12 rounded-xl bg-[var(--accent-subtle)] flex items-center justify-center">
                <section.icon className="w-6 h-6 text-[var(--accent)]" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[var(--foreground)]">
                {section.category}
              </h2>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {section.items.map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  viewport={{ once: true }}
                >
                  <Card className="h-full p-6">
                    <div className="w-10 h-10 rounded-lg bg-[var(--background-tertiary)] flex items-center justify-center mb-4">
                      <item.icon className="w-5 h-5 text-[var(--accent)]" />
                    </div>
                    <h3 className="text-lg font-semibold text-[var(--foreground)] mb-2">
                      {item.title}
                    </h3>
                    <p className="text-sm text-[var(--foreground-secondary)]">
                      {item.desc}
                    </p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* CTA */}
      <section className="py-20 bg-[var(--background-secondary)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-[var(--foreground)] mb-6">
              今すぐ始めましょう
            </h2>
            <p className="text-lg text-[var(--foreground-secondary)] mb-8">
              14日間無料でお試しください
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

