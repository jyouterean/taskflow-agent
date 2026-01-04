'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  Shield, 
  Lock, 
  Key, 
  Users, 
  Eye, 
  FileCheck,
  Server,
  Globe,
  CheckCircle2,
  ArrowRight,
  Building2,
  AlertTriangle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

const securityFeatures = [
  {
    icon: Lock,
    title: '暗号化',
    items: [
      '転送時：TLS 1.3による暗号化',
      '保存時：AES-256暗号化',
      'データベース：RDS暗号化',
    ],
  },
  {
    icon: Users,
    title: 'アクセス制御',
    items: [
      'RBAC（Admin/Manager/Member）',
      '最小権限の原則',
      'セッション管理・自動ログアウト',
    ],
  },
  {
    icon: Key,
    title: '認証',
    items: [
      'パスワードポリシー強制',
      'SSO対応（Google/SAML）',
      '2要素認証（Enterprise）',
    ],
  },
  {
    icon: Eye,
    title: '監査ログ',
    items: [
      '全操作の記録・追跡',
      '改ざん防止',
      '長期保存（Enterprise）',
    ],
  },
  {
    icon: AlertTriangle,
    title: 'Human-in-the-loop',
    items: [
      '破壊的操作は承認必須',
      'AIの自動実行にガードレール',
      '一括変更の事前確認',
    ],
  },
  {
    icon: Server,
    title: 'インフラ',
    items: [
      'AWS / GCPのセキュアリージョン',
      '定期的な脆弱性スキャン',
      'WAF / DDoS対策',
    ],
  },
]

const compliances = [
  { name: 'SOC 2 Type II', status: '取得済み' },
  { name: 'ISO 27001', status: '申請中' },
  { name: 'GDPR', status: '準拠' },
  { name: 'CCPA', status: '準拠' },
]

const embedSecurity = [
  {
    title: 'ドメイン制限',
    desc: 'ホワイトリスト方式で許可したドメインのみ埋め込み可能。frame-ancestors CSPで強制。',
  },
  {
    title: 'トークン認証',
    desc: 'スコープ付きトークンで対象プロジェクト・権限を限定。短命トークン / ローテーション対応。',
  },
  {
    title: '権限制御',
    desc: '閲覧のみ / 操作可を選択。操作可は上位プランのみで提供し、リスクを最小化。',
  },
  {
    title: '監査ログ',
    desc: 'どのウィジェットが、いつ、どのドメインから表示・操作されたかを記録。',
  },
]

export default function SecurityPage() {
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
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/15 text-emerald-400 text-sm mb-6">
              <Shield className="w-4 h-4" />
              Enterprise-Ready Security
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-[var(--foreground)]">
              セキュリティと
              <span className="gradient-glow bg-clip-text text-transparent ml-2">信頼性</span>
            </h1>
            <p className="mt-6 text-lg text-[var(--foreground-secondary)]">
              TaskFlow Agentは、企業の大切なデータを守るために設計されています。暗号化、アクセス制御、監査ログ、AI安全装置を標準装備。
            </p>
          </motion.div>
        </div>
      </section>

      {/* Security Features */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-[var(--foreground)]">セキュリティ機能</h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {securityFeatures.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                viewport={{ once: true }}
              >
                <Card className="h-full p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-emerald-500/15 flex items-center justify-center">
                      <feature.icon className="w-5 h-5 text-emerald-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-[var(--foreground)]">
                      {feature.title}
                    </h3>
                  </div>
                  <ul className="space-y-2">
                    {feature.items.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm text-[var(--foreground-secondary)]">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Compliance */}
      <section className="py-20 bg-[var(--background-secondary)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-[var(--foreground)]">コンプライアンス</h2>
            <p className="mt-4 text-[var(--foreground-secondary)]">
              国際的なセキュリティ基準に準拠
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {compliances.map((item, i) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                viewport={{ once: true }}
              >
                <Card className="p-6 text-center">
                  <FileCheck className="w-10 h-10 text-[var(--accent)] mx-auto mb-3" />
                  <h3 className="font-semibold text-[var(--foreground)]">{item.name}</h3>
                  <p className="text-sm text-emerald-400 mt-1">{item.status}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Embed Security */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-[var(--foreground)]">Embedセキュリティ</h2>
            <p className="mt-4 text-[var(--foreground-secondary)]">
              外部システムへの埋め込みを安全に運用
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {embedSecurity.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                viewport={{ once: true }}
              >
                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-[var(--foreground)] mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-[var(--foreground-secondary)]">{item.desc}</p>
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
              セキュリティについてご質問ですか？
            </h2>
            <p className="text-lg text-[var(--foreground-secondary)] mb-8">
              セキュリティホワイトペーパーやペネトレーションテストレポートをご用意しています
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button size="lg" className="gap-2">
                  お問い合わせ
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/docs/security">
                <Button variant="secondary" size="lg">
                  セキュリティドキュメント
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

