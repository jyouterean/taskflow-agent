'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Sparkles, Mail, Lock, User, Building2, ArrowRight, Eye, EyeOff, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'

const benefits = [
  'AIによるタスク自動抽出',
  '無制限タスク作成',
  '14日間フル機能トライアル',
  'クレジットカード不要',
]

export default function SignupPage() {
  const router = useRouter()
  
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [orgName, setOrgName] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, orgName }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'サインアップに失敗しました')
      }

      router.push('/login?registered=true')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex gradient-mesh">
      {/* Left: Benefits */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-center px-12 xl:px-20">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Link href="/" className="flex items-center gap-2 mb-12">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--accent)] to-purple-500 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-semibold text-[var(--foreground)]">
              TaskFlow Agent
            </span>
          </Link>

          <h1 className="text-4xl font-bold text-[var(--foreground)] mb-6">
            AIでタスク管理を<br />
            <span className="gradient-glow bg-clip-text text-transparent">革新しよう</span>
          </h1>

          <ul className="space-y-4">
            {benefits.map((benefit) => (
              <li key={benefit} className="flex items-center gap-3 text-[var(--foreground)]">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                {benefit}
              </li>
            ))}
          </ul>

          <div className="mt-12 p-6 bg-[var(--background-secondary)]/50 backdrop-blur rounded-xl border border-[var(--border)]">
            <p className="text-sm text-[var(--foreground-secondary)] italic">
              "TaskFlow Agentを導入してから、会議後のタスク整理が劇的に楽になりました。AIが自動抽出してくれるので、本当に重要な仕事に集中できます。"
            </p>
            <div className="mt-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[var(--accent-subtle)] flex items-center justify-center text-[var(--accent)] font-medium">
                TK
              </div>
              <div>
                <div className="text-sm font-medium text-[var(--foreground)]">田中 健一</div>
                <div className="text-xs text-[var(--foreground-muted)]">プロジェクトマネージャー</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Right: Form */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          {/* Mobile Logo */}
          <Link href="/" className="lg:hidden flex items-center justify-center gap-2 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--accent)] to-purple-500 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-semibold text-[var(--foreground)]">
              TaskFlow Agent
            </span>
          </Link>

          <Card padding="lg">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-[var(--foreground)]">アカウント作成</h2>
              <p className="text-sm text-[var(--foreground-secondary)] mt-1">
                14日間無料でお試しください
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-500/15 border border-red-500/30 rounded-lg text-sm text-red-400">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                type="text"
                label="お名前"
                placeholder="山田 太郎"
                value={name}
                onChange={(e) => setName(e.target.value)}
                leftIcon={<User className="w-4 h-4" />}
                required
              />

              <Input
                type="email"
                label="メールアドレス"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                leftIcon={<Mail className="w-4 h-4" />}
                required
              />

              <Input
                type={showPassword ? 'text' : 'password'}
                label="パスワード"
                placeholder="8文字以上"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                leftIcon={<Lock className="w-4 h-4" />}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="hover:text-[var(--foreground)] transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                }
                hint="8文字以上の英数字を含むパスワード"
                required
              />

              <Input
                type="text"
                label="組織名"
                placeholder="株式会社サンプル"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                leftIcon={<Building2 className="w-4 h-4" />}
                hint="あとから変更可能です"
                required
              />

              <div className="pt-2">
                <Button type="submit" className="w-full" isLoading={isLoading}>
                  無料で始める
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </form>

            <p className="mt-4 text-xs text-center text-[var(--foreground-muted)]">
              登録することで、
              <Link href="/terms" className="text-[var(--accent)] hover:underline">利用規約</Link>
              と
              <Link href="/privacy" className="text-[var(--accent)] hover:underline">プライバシーポリシー</Link>
              に同意したことになります。
            </p>

            <p className="mt-6 text-center text-sm text-[var(--foreground-secondary)]">
              すでにアカウントをお持ちの方は{' '}
              <Link href="/login" className="text-[var(--accent)] hover:underline font-medium">
                ログイン
              </Link>
            </p>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

