import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashPassword } from '@/lib/auth-options'
import { z } from 'zod'

const SignupSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  password: z.string().min(8).max(100),
  orgName: z.string().min(1).max(100),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
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

    // Create organization slug
    const slug = data.orgName
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '')

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

      // Create user
      const user = await tx.user.create({
        data: {
          name: data.name,
          email: data.email,
          // In production, store hashed password in a separate table
          // For demo, we're just creating the user
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
    console.error('Signup error:', error)

    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: '入力内容が不正です', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'サインアップに失敗しました' },
      { status: 500 }
    )
  }
}

