import Link from 'next/link'
import { Sparkles, Twitter, Github, Linkedin } from 'lucide-react'

const footerLinks = {
  product: {
    title: 'プロダクト',
    links: [
      { label: '機能', href: '/features' },
      { label: '料金', href: '/pricing' },
      { label: 'Embed', href: '/embed' },
      { label: 'セキュリティ', href: '/security' },
    ],
  },
  resources: {
    title: 'リソース',
    links: [
      { label: 'ドキュメント', href: '/docs' },
      { label: 'API リファレンス', href: '/developers' },
      { label: 'ステータス', href: '/status' },
      { label: 'チェンジログ', href: '/changelog' },
    ],
  },
  company: {
    title: '会社情報',
    links: [
      { label: '会社概要', href: '/about' },
      { label: '導入事例', href: '/customers' },
      { label: 'ブログ', href: '/blog' },
      { label: '採用情報', href: '/careers' },
    ],
  },
  legal: {
    title: '法的情報',
    links: [
      { label: '利用規約', href: '/terms' },
      { label: 'プライバシー', href: '/privacy' },
      { label: 'セキュリティ', href: '/security' },
      { label: 'DPA', href: '/dpa' },
    ],
  },
}

export function PublicFooter() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--background-secondary)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Logo & Description */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--accent)] to-purple-500 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-semibold text-[var(--foreground)]">
                TaskFlow
              </span>
            </Link>
            <p className="mt-4 text-sm text-[var(--foreground-muted)]">
              AIエージェントで<br />タスク管理を革新する
            </p>
            <div className="flex gap-3 mt-4">
              <a
                href="https://twitter.com"
                className="p-2 rounded-lg hover:bg-[var(--background-hover)] text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="https://github.com"
                className="p-2 rounded-lg hover:bg-[var(--background-hover)] text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com"
                className="p-2 rounded-lg hover:bg-[var(--background-hover)] text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Links */}
          {Object.values(footerLinks).map((section) => (
            <div key={section.title}>
              <h3 className="text-sm font-semibold text-[var(--foreground)] mb-4">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-[var(--border)]">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-[var(--foreground-muted)]">
              © {new Date().getFullYear()} TaskFlow Agent. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <Link href="/privacy" className="text-sm text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors">
                プライバシー
              </Link>
              <Link href="/terms" className="text-sm text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors">
                利用規約
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

