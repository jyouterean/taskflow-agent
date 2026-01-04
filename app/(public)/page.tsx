'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  Sparkles, 
  Zap, 
  Shield, 
  Code2, 
  CheckCircle2, 
  ArrowRight,
  Layout,
  Brain,
  Users,
  Building2,
  Clock,
  Target
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

const features = [
  {
    icon: CheckCircle2,
    title: 'ToDo & プロジェクト統合',
    description: '個人タスクとチームプロジェクトを1つのプラットフォームで。Board、List、Timeline、Calendar表示を自由に切替。',
  },
  {
    icon: Brain,
    title: 'AIエージェント',
    description: '会議録やチャットからタスクを自動抽出。優先度・期限・担当者を根拠付きで提案。',
  },
  {
    icon: Code2,
    title: 'Embed（埋め込み）',
    description: '社内ポータルや業務システムにタスクUIを埋め込み。ドメイン制限・権限制御で安全に運用。',
  },
  {
    icon: Shield,
    title: 'エンタープライズセキュリティ',
    description: 'RBAC、監査ログ、SSO対応。破壊的操作は承認必須のHuman-in-the-loop設計。',
  },
]

const agents = [
  {
    name: 'Intake Agent',
    description: '文章からタスク抽出',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    name: 'Planner Agent',
    description: 'プロジェクト計画・WBS作成',
    color: 'from-purple-500 to-pink-500',
  },
  {
    name: 'Ops Agent',
    description: '日次レポート・遅延検知',
    color: 'from-orange-500 to-amber-500',
  },
  {
    name: 'Embed Copilot',
    description: '埋め込み設定アシスト',
    color: 'from-emerald-500 to-teal-500',
  },
]

const stats = [
  { value: '3x', label: 'タスク処理効率' },
  { value: '80%', label: '手動入力削減' },
  { value: '99.9%', label: '稼働率' },
  { value: '24h', label: 'サポート対応' },
]

export default function HomePage() {
  return (
    <div className="relative overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center gradient-mesh">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 -left-20 w-72 h-72 bg-[var(--accent)]/20 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-purple-500/15 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--accent-subtle)] border border-[var(--accent)]/30 text-sm text-[var(--accent)] mb-8"
            >
              <Sparkles className="w-4 h-4" />
              OpenAI Responses API搭載
            </motion.div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[var(--foreground)] leading-tight">
              AIエージェントで
              <br />
              <span className="gradient-glow bg-clip-text text-transparent">
                タスク管理を自動化
              </span>
            </h1>

            <p className="mt-6 text-lg sm:text-xl text-[var(--foreground-secondary)] max-w-2xl mx-auto">
              会議録・チャット・文書からタスクを自動抽出。プロジェクト計画からデイリーレポートまで、AIがあなたのワークフローを加速します。
            </p>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link href="/signup">
                <Button size="lg" className="gap-2 px-8">
                  無料で始める
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/demo">
                <Button variant="secondary" size="lg" className="px-8">
                  デモを見る
                </Button>
              </Link>
            </motion.div>

            {/* Trust badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-12 flex flex-wrap justify-center gap-6 text-[var(--foreground-muted)]"
            >
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                <span className="text-sm">SOC 2 Type II</span>
              </div>
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                <span className="text-sm">100社以上が導入</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span className="text-sm">14日間無料トライアル</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Hero Image/Demo */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="mt-16 relative"
          >
            <div className="relative mx-auto max-w-5xl">
              <div className="bg-[var(--background-secondary)] border border-[var(--border)] rounded-2xl shadow-2xl overflow-hidden">
                {/* Mock App Header */}
                <div className="flex items-center gap-2 px-4 py-3 border-b border-[var(--border)] bg-[var(--background-tertiary)]">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/60" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                    <div className="w-3 h-3 rounded-full bg-green-500/60" />
                  </div>
                  <div className="flex-1 text-center text-sm text-[var(--foreground-muted)]">
                    TaskFlow Agent — ダッシュボード
                  </div>
                </div>
                
                {/* Mock App Content */}
                <div className="p-6 grid grid-cols-3 gap-4 h-80">
                  {/* Sidebar */}
                  <div className="col-span-1 space-y-2">
                    {['ダッシュボード', 'タスク', 'プロジェクト', 'レポート'].map((item, i) => (
                      <div
                        key={item}
                        className={`px-3 py-2 rounded-lg text-sm ${
                          i === 0
                            ? 'bg-[var(--accent-subtle)] text-[var(--accent)]'
                            : 'text-[var(--foreground-secondary)] hover:bg-[var(--background-hover)]'
                        }`}
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                  
                  {/* Main Content */}
                  <div className="col-span-2 space-y-3">
                    {[
                      { title: '週次レポート作成', status: '進行中', priority: '高' },
                      { title: 'クライアントMTG準備', status: '未着手', priority: '緊急' },
                      { title: 'API設計レビュー', status: '完了', priority: '中' },
                    ].map((task, i) => (
                      <div
                        key={task.title}
                        className="flex items-center justify-between p-3 bg-[var(--background-tertiary)] rounded-lg"
                        style={{ animationDelay: `${i * 100}ms` }}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-2 h-2 rounded-full ${
                            task.status === '完了' ? 'bg-emerald-500' : 
                            task.status === '進行中' ? 'bg-blue-500' : 'bg-gray-500'
                          }`} />
                          <span className="text-sm text-[var(--foreground)]">{task.title}</span>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          task.priority === '緊急' ? 'bg-red-500/15 text-red-400' :
                          task.priority === '高' ? 'bg-orange-500/15 text-orange-400' :
                          'bg-amber-500/15 text-amber-400'
                        }`}>
                          {task.priority}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Floating Agent Card */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 }}
                className="absolute -right-8 top-1/3 bg-[var(--background-secondary)] border border-[var(--border)] rounded-xl p-4 shadow-xl w-64"
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                    <Brain className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm font-medium text-[var(--foreground)]">Intake Agent</span>
                </div>
                <p className="text-xs text-[var(--foreground-secondary)]">
                  "議事録から3件のタスクを抽出しました。確認して登録しますか？"
                </p>
                <div className="flex gap-2 mt-3">
                  <button className="flex-1 text-xs px-3 py-1.5 bg-[var(--accent)] text-white rounded-lg">
                    確認する
                  </button>
                  <button className="flex-1 text-xs px-3 py-1.5 bg-[var(--background-tertiary)] text-[var(--foreground)] rounded-lg">
                    後で
                  </button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-[var(--background-secondary)] border-y border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-3xl sm:text-4xl font-bold gradient-glow bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="mt-2 text-sm text-[var(--foreground-secondary)]">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-[var(--foreground)]">
              すべてが統合された
              <span className="gradient-glow bg-clip-text text-transparent ml-2">タスク管理</span>
            </h2>
            <p className="mt-4 text-lg text-[var(--foreground-secondary)] max-w-2xl mx-auto">
              個人のToDoからチームプロジェクトまで。AIがあなたのワークフローに寄り添います。
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <Card hover className="h-full">
                  <div className="p-6">
                    <div className="w-12 h-12 rounded-xl bg-[var(--accent-subtle)] flex items-center justify-center mb-4">
                      <feature.icon className="w-6 h-6 text-[var(--accent)]" />
                    </div>
                    <h3 className="text-xl font-semibold text-[var(--foreground)] mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-[var(--foreground-secondary)]">
                      {feature.description}
                    </p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Agents Section */}
      <section className="py-24 bg-[var(--background-secondary)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/15 text-purple-400 text-sm mb-6">
              <Zap className="w-4 h-4" />
              OpenAI Powered
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-[var(--foreground)]">
              4つのAIエージェントが<span className="gradient-glow bg-clip-text text-transparent">業務を加速</span>
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {agents.map((agent, i) => (
              <motion.div
                key={agent.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full p-6 text-center">
                  <div className={`w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br ${agent.color} flex items-center justify-center mb-4`}>
                    <Brain className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-[var(--foreground)] mb-1">
                    {agent.name}
                  </h3>
                  <p className="text-sm text-[var(--foreground-secondary)]">
                    {agent.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12 text-center"
          >
            <Link href="/features/agent">
              <Button variant="outline" className="gap-2">
                エージェントの詳細
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Embed Section */}
      <section className="py-24 gradient-mesh">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/15 text-cyan-400 text-sm mb-6">
                <Layout className="w-4 h-4" />
                Embed Ready
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-[var(--foreground)] mb-6">
                どこにでも埋め込める<br />
                <span className="gradient-glow bg-clip-text text-transparent">タスク管理UI</span>
              </h2>
              <p className="text-lg text-[var(--foreground-secondary)] mb-8">
                社内ポータル、CRM、顧客管理システムにタスクUIをiframeで埋め込み。ドメイン制限とトークン認証で安全に運用できます。
              </p>
              <ul className="space-y-4 mb-8">
                {[
                  'My Tasks / プロジェクト / フィルタ結果を表示',
                  'List / Board / Mini Dashboard表示',
                  'ホワイトリスト方式のドメイン制限',
                  '閲覧専用 / 操作可の権限設定',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-[var(--foreground)]">
                    <CheckCircle2 className="w-5 h-5 text-[var(--accent)]" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/embed">
                <Button className="gap-2">
                  Embedを詳しく見る
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              {/* Code snippet */}
              <div className="bg-[var(--background-secondary)] border border-[var(--border)] rounded-xl overflow-hidden shadow-2xl">
                <div className="flex items-center gap-2 px-4 py-3 border-b border-[var(--border)] bg-[var(--background-tertiary)]">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/60" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                    <div className="w-3 h-3 rounded-full bg-green-500/60" />
                  </div>
                  <span className="text-xs text-[var(--foreground-muted)] font-mono">embed-example.html</span>
                </div>
                <pre className="p-6 text-sm overflow-x-auto">
                  <code className="text-[var(--foreground-secondary)]">
                    {`<!-- TaskFlow Embed -->\n<iframe\n  src="https://app.taskflow.ai/embed/abc123"\n  width="100%"\n  height="400"\n  frameborder="0"\n  allow="clipboard-write"\n></iframe>`}
                  </code>
                </pre>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-[var(--background-secondary)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-[var(--foreground)] mb-6">
              今すぐタスク管理を革新しよう
            </h2>
            <p className="text-lg text-[var(--foreground-secondary)] mb-10 max-w-2xl mx-auto">
              14日間の無料トライアルですべての機能をお試しください。クレジットカード不要で、すぐに始められます。
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup">
                <Button size="lg" className="gap-2 px-8">
                  無料で始める
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="secondary" size="lg" className="px-8">
                  お問い合わせ
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

