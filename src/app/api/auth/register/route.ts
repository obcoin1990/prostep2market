import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'

const RegisterSchema = z.object({
  name:             z.string().min(2),
  email:            z.string().email(),
  password:         z.string().min(8),
  organizationName: z.string().optional(),
  inviteToken:      z.string().optional(),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const data = RegisterSchema.parse(body)

    const existing = await prisma.user.findUnique({ where: { email: data.email } })
    if (existing) {
      return NextResponse.json({ error: 'Email already in use' }, { status: 409 })
    }

    const hashedPassword = await bcrypt.hash(data.password, 12)

    // Handle invite flow
    if (data.inviteToken) {
      const invite = await prisma.invitation.findUnique({
        where: { token: data.inviteToken },
      })
      if (!invite || invite.accepted || invite.expiresAt < new Date()) {
        return NextResponse.json({ error: 'Invalid or expired invite' }, { status: 400 })
      }

      const user = await prisma.user.create({
        data: {
          name: data.name,
          email: data.email,
          hashedPassword,
          role: invite.role,
          organizationId: invite.organizationId,
        },
      })

      await prisma.invitation.update({
        where: { id: invite.id },
        data:  { accepted: true },
      })

      return NextResponse.json({ user: { id: user.id, email: user.email } }, { status: 201 })
    }

    // Self-signup — create org + admin
    const result = await prisma.$transaction(async (tx) => {
      const slug = data.organizationName
        ? data.organizationName.toLowerCase().replace(/\s+/g, '-')
        : data.email.split('@')[1].split('.')[0]

      const org = await tx.organization.create({
        data: { name: data.organizationName ?? data.name + "'s Org", slug },
      })

      const user = await tx.user.create({
        data: {
          name: data.name,
          email: data.email,
          hashedPassword,
          role: 'ADMIN',
          organizationId: org.id,
        },
      })

      return { user, org }
    })

    return NextResponse.json(
      { user: { id: result.user.id, email: result.user.email } },
      { status: 201 }
    )
  } catch (err: any) {
    if (err.name === 'ZodError') {
      return NextResponse.json({ error: err.errors }, { status: 422 })
    }
    console.error(err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
