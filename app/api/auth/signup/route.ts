import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { hashPassword } from '@/lib/auth-options'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const SignupSchema = z.object({
  name: z.string().min(1, 'お名前を入力してください').max(100),
  email: z.string().email('有効なメールアドレスを入力してください'),
  password: z.string().min(8, 'パスワードは8文字以上で入力してください').max(100),
  orgName: z.string().min(1, '組織名を入力してください').max(100),
})

export async function POST(request: NextRequest) {
  try {
    // Dynamic import to avoid build-time initialization
    const { prisma } = await import('@/lib/prisma')
    
    const body = await request.json().catch(() => null)
    if (!body) {
      return NextResponse.json(
        { error: 'リクエストボディが不正です' },
        { status: 400 }
      )
    }

    const data = SignupSchema.parse(body)

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'このメールアドレスは既に登録されています' },
        { status: 400 }
      )
    }

    // Hash password
    const passwordHash = await hashPassword(data.password)

    // Create organization slug
    const slug = data.orgName
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'org'

    // Check if slug is unique, if not add random suffix
    let finalSlug = slug
    const existingOrg = await prisma.organization.findUnique({
      where: { slug },
    })
    if (existingOrg) {
      finalSlug = `${slug}-${Math.random().toString(36).substring(2, 7)}`
    }

    // Create user and organization in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create organization
      const org = await tx.organization.create({
        data: {
          name: data.orgName,
          slug: finalSlug,
        },
      })

      // Create user with hashed password
      const user = await tx.user.create({
        data: {
          name: data.name,
          email: data.email,
          passwordHash: passwordHash,
        },
      })

      // Create membership (user is admin of their org)
      await tx.membership.create({
        data: {
          orgId: org.id,
          userId: user.id,
          role: 'ADMIN',
        },
      })

      return { user, org }
    })

    return NextResponse.json({
      success: true,
      user: {
        id: result.user.id,
        name: result.user.name,
        email: result.user.email,
      },
      organization: {
        id: result.org.id,
        name: result.org.name,
        slug: result.org.slug,
      },
    })
  } catch (error: any) {
    console.error('[/api/auth/signup] error:', error)
    console.error('Error details:', {
      name: error?.name,
      message: error?.message,
      code: error?.code,
      meta: error?.meta,
      stack: error?.stack,
    })

    // Zod validation error
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: error.errors?.[0]?.message || '入力内容が不正です' },
        { status: 400 }
      )
    }

    // Prisma errors
    if (error.code === 'P2002') {
      // Unique constraint violation
      const field = error.meta?.target?.[0] || 'フィールド'
      return NextResponse.json(
        { error: `${field}が既に使用されています` },
        { status: 400 }
      )
    }

    if (error.code === 'P1001') {
      // Can't reach database server
      return NextResponse.json(
        { error: 'データベースに接続できません。設定を確認してください。' },
        { status: 503 }
      )
    }

    if (error.code === 'P1017') {
      // Server has closed the connection
      return NextResponse.json(
        { error: 'データベース接続が切断されました。再度お試しください。' },
        { status: 503 }
      )
    }

    // Database connection errors
    if (error.message?.includes('DATABASE_URL') || error.message?.includes('connection')) {
      return NextResponse.json(
        { error: 'データベース接続エラーが発生しました。管理者にお問い合わせください。' },
        { status: 503 }
      )
    }

    // Return more specific error in development
    const errorMessage = process.env.NODE_ENV === 'development'
      ? error.message || 'サインアップに失敗しました'
      : 'サインアップに失敗しました。しばらくしてから再度お試しください。'

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}

