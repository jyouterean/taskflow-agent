import type { Metadata } from 'next'
import './globals.css'
import { Providers } from './providers'

export const metadata: Metadata = {
  title: 'TaskFlow Agent - AI-Powered Task Management',
  description: 'Enterprise-grade task management with embedded AI agents. Automate task extraction, project planning, and daily operations.',
  keywords: ['task management', 'AI agent', 'project management', 'OpenAI', 'enterprise', 'embed'],
  authors: [{ name: 'TaskFlow' }],
  openGraph: {
    title: 'TaskFlow Agent - AI-Powered Task Management',
    description: 'Enterprise-grade task management with embedded AI agents.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}

