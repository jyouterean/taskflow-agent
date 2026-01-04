import { headers } from 'next/headers'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { EmbedWidgetView } from '@/components/embed/widget-view'

interface EmbedPageProps {
  params: Promise<{ widgetId: string }>
}

export default async function EmbedPage({ params }: EmbedPageProps) {
  const { widgetId } = await params

  // Get widget
  const widget = await prisma.embedWidget.findUnique({
    where: { id: widgetId },
    include: {
      organization: {
        select: { id: true, name: true, slug: true },
      },
      project: {
        select: { id: true, name: true },
      },
    },
  })

  if (!widget || !widget.isActive) {
    notFound()
  }

  // Check token expiry
  if (widget.tokenExpiresAt && new Date(widget.tokenExpiresAt) < new Date()) {
    notFound()
  }

  // Validate origin domain
  const headersList = await headers()
  const referer = headersList.get('referer')
  const origin = headersList.get('origin')

  if (widget.allowedDomains.length > 0) {
    const requestDomain = referer
      ? new URL(referer).hostname
      : origin
        ? new URL(origin).hostname
        : null

    if (requestDomain) {
      const isAllowed = widget.allowedDomains.some(domain => {
        // Support wildcard subdomains
        if (domain.startsWith('*.')) {
          const baseDomain = domain.slice(2)
          return requestDomain === baseDomain || requestDomain.endsWith('.' + baseDomain)
        }
        return requestDomain === domain
      })

      if (!isAllowed) {
        return (
          <div className="flex items-center justify-center min-h-screen bg-[var(--background)]">
            <div className="text-center p-8">
              <h1 className="text-lg font-semibold text-red-500 mb-2">
                アクセス拒否
              </h1>
              <p className="text-sm text-[var(--foreground-secondary)]">
                このドメインからの埋め込みは許可されていません。
              </p>
            </div>
          </div>
        )
      }
    }
  }

  // Log embed view
  await prisma.embedLog.create({
    data: {
      widgetId: widget.id,
      action: 'VIEW',
      metadata: {
        referer,
        origin,
        userAgent: headersList.get('user-agent'),
      },
    },
  })

  // Get tasks based on widget configuration
  const tasks = await getWidgetTasks(widget)

  return (
    <EmbedWidgetView
      widget={widget}
      tasks={tasks}
      canEdit={widget.permissions === 'OPERATIONS_ALLOWED'}
    />
  )
}

async function getWidgetTasks(widget: any) {
  const where: any = {
    orgId: widget.orgId,
  }

  switch (widget.targetType) {
    case 'PROJECT':
      if (widget.targetId) {
        where.projectId = widget.targetId
      }
      break
    case 'MY_TASKS':
      // In embed context, show all tasks (no user filter)
      break
    case 'SAVED_FILTER':
      // TODO: Implement saved filter logic
      break
  }

  return prisma.task.findMany({
    where,
    include: {
      assignee: {
        select: { id: true, name: true, image: true },
      },
      project: {
        select: { id: true, name: true },
      },
    },
    orderBy: [
      { priority: 'desc' },
      { dueDate: 'asc' },
    ],
    take: 50,
  })
}

// Generate CSP headers for embed pages
export async function generateMetadata({ params }: EmbedPageProps) {
  const { widgetId } = await params

  const widget = await prisma.embedWidget.findUnique({
    where: { id: widgetId },
    select: { allowedDomains: true },
  })

  const frameAncestors = widget?.allowedDomains.length
    ? widget.allowedDomains.join(' ')
    : "'self'"

  return {
    title: 'TaskFlow Embed',
    other: {
      'Content-Security-Policy': `frame-ancestors ${frameAncestors}`,
    },
  }
}

