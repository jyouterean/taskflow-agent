'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Check, X, ArrowRight, HelpCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { SimpleTooltip } from '@/components/ui/tooltip'
import { useState } from 'react'
import { cn } from '@/lib/utils'

const plans = [
  {
    name: 'Starter',
    price: { monthly: 0, yearly: 0 },
    description: '小規模チーム向け',
    cta: '無料で始める',
    ctaVariant: 'secondary' as const,
    features: [
      { name: '最大5ユーザー', included: true },
      { name: '無制限タスク', included: true },
      { name: '3プロジェクト', included: true },
      { name: 'AIエージェント（月50回）', included: true },
      { name: 'Embed 1ウィジェット', included: true },
      { name: 'メールサポート', included: true },
      { name: 'SSO', included: false },
      { name: '監査ログ', included: false },
      { name: 'API アクセス', included: false },
    ],
  },
  {
    name: 'Pro',
    price: { monthly: 2980, yearly: 29800 },
    description: '成長中のチーム向け',
    cta: '14日間無料トライアル',
    ctaVariant: 'primary' as const,
    popular: true,
    features: [
      { name: '最大25ユーザー', included: true },
      { name: '無制限タスク', included: true },
      { name: '無制限プロジェクト', included: true },
      { name: 'AIエージェント（月500回）', included: true },
      { name: 'Embed 10ウィジェット', included: true },
      { name: '優先サポート', included: true },
      { name: 'Google SSO', included: true },
      { name: '監査ログ（30日）', included: true },
      { name: 'API アクセス', included: true },
    ],
  },
  {
    name: 'Enterprise',
    price: { monthly: null, yearly: null },
    description: '大規模組織向け',
    cta: 'お問い合わせ',
    ctaVariant: 'outline' as const,
    features: [
      { name: '無制限ユーザー', included: true },
      { name: '無制限タスク', included: true },
      { name: '無制限プロジェクト', included: true },
      { name: 'AIエージェント（無制限）', included: true },
      { name: 'Embed 無制限', included: true },
      { name: '専任サポート', included: true },
      { name: 'SAML SSO', included: true },
      { name: '監査ログ（無制限）', included: true },
      { name: 'オンプレミス対応', included: true },
    ],
  },
]

const faqs = [
  {
    q: '無料トライアル中にクレジットカードは必要ですか？',
    a: 'いいえ、14日間の無料トライアル期間中はクレジットカードの登録は不要です。トライアル終了後に継続利用される場合のみ、お支払い情報をご登録いただきます。',
  },
  {
    q: 'プランの変更はいつでもできますか？',
    a: 'はい、いつでもアップグレード・ダウングレードが可能です。アップグレードは即座に反映され、ダウングレードは次の請求サイクルから適用されます。',
  },
  {
    q: 'AIエージェントの「回数」とは何ですか？',
    a: 'AIエージェントへの1回のリクエスト（例：議事録からタスク抽出、プロジェクト計画生成）を1回としてカウントします。日次レポートの自動生成も含まれます。',
  },
  {
    q: 'Embedウィジェットはどのように課金されますか？',
    a: '作成できるウィジェットの数に上限があります。各ウィジェットの表示回数には制限がないため、多くのユーザーに閲覧されても追加料金は発生しません。',
  },
]

export default function PricingPage() {
  const [isYearly, setIsYearly] = useState(true)

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
              シンプルな
              <span className="gradient-glow bg-clip-text text-transparent ml-2">料金プラン</span>
            </h1>
            <p className="mt-6 text-lg text-[var(--foreground-secondary)]">
              チームの規模に合わせて最適なプランをお選びください。すべてのプランで14日間の無料トライアルをご利用いただけます。
            </p>

            {/* Billing Toggle */}
            <div className="mt-8 inline-flex items-center gap-4 p-1 bg-[var(--background-tertiary)] rounded-lg">
              <button
                onClick={() => setIsYearly(false)}
                className={cn(
                  'px-4 py-2 text-sm font-medium rounded-md transition-colors',
                  !isYearly
                    ? 'bg-[var(--background-secondary)] text-[var(--foreground)] shadow-sm'
                    : 'text-[var(--foreground-secondary)]'
                )}
              >
                月払い
              </button>
              <button
                onClick={() => setIsYearly(true)}
                className={cn(
                  'px-4 py-2 text-sm font-medium rounded-md transition-colors flex items-center gap-2',
                  isYearly
                    ? 'bg-[var(--background-secondary)] text-[var(--foreground)] shadow-sm'
                    : 'text-[var(--foreground-secondary)]'
                )}
              >
                年払い
                <span className="text-xs px-2 py-0.5 bg-emerald-500/15 text-emerald-400 rounded-full">
                  2ヶ月無料
                </span>
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-12 -mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan, i) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Card
                  className={cn(
                    'relative h-full flex flex-col',
                    plan.popular && 'border-[var(--accent)] ring-2 ring-[var(--accent)]/20'
                  )}
                  padding="lg"
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-[var(--accent)] text-white text-xs font-medium rounded-full">
                      人気プラン
                    </div>
                  )}

                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-[var(--foreground)]">{plan.name}</h3>
                    <p className="text-sm text-[var(--foreground-secondary)] mt-1">
                      {plan.description}
                    </p>
                  </div>

                  <div className="mb-6">
                    {plan.price.monthly === null ? (
                      <div className="text-3xl font-bold text-[var(--foreground)]">要相談</div>
                    ) : (
                      <>
                        <div className="flex items-baseline gap-1">
                          <span className="text-4xl font-bold text-[var(--foreground)]">
                            ¥{isYearly ? plan.price.yearly.toLocaleString() : plan.price.monthly.toLocaleString()}
                          </span>
                          <span className="text-[var(--foreground-secondary)]">
                            /{isYearly ? '年' : '月'}
                          </span>
                        </div>
                        {isYearly && plan.price.monthly > 0 && (
                          <p className="text-sm text-[var(--foreground-muted)] mt-1">
                            月額 ¥{Math.round(plan.price.yearly / 12).toLocaleString()} 相当
                          </p>
                        )}
                      </>
                    )}
                  </div>

                  <Link href={plan.name === 'Enterprise' ? '/contact' : '/signup'}>
                    <Button variant={plan.ctaVariant} className="w-full mb-6">
                      {plan.cta}
                    </Button>
                  </Link>

                  <ul className="space-y-3 flex-1">
                    {plan.features.map((feature) => (
                      <li key={feature.name} className="flex items-start gap-3">
                        {feature.included ? (
                          <Check className="w-5 h-5 text-emerald-500 shrink-0" />
                        ) : (
                          <X className="w-5 h-5 text-[var(--foreground-muted)] shrink-0" />
                        )}
                        <span
                          className={cn(
                            'text-sm',
                            feature.included
                              ? 'text-[var(--foreground)]'
                              : 'text-[var(--foreground-muted)]'
                          )}
                        >
                          {feature.name}
                        </span>
                      </li>
                    ))}
                  </ul>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-[var(--background-secondary)]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-[var(--foreground)]">よくある質問</h2>
          </motion.div>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <motion.div
                key={faq.q}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                viewport={{ once: true }}
              >
                <Card className="p-6">
                  <h3 className="text-[var(--foreground)] font-medium mb-2">{faq.q}</h3>
                  <p className="text-sm text-[var(--foreground-secondary)]">{faq.a}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-[var(--foreground)] mb-4">
              まずは無料でお試しください
            </h2>
            <p className="text-lg text-[var(--foreground-secondary)] mb-8">
              クレジットカード不要・14日間のフルアクセス
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

