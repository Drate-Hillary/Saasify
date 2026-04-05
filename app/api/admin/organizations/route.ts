import { NextRequest, NextResponse } from 'next/server'
import { desc, eq, ilike, or, sql } from 'drizzle-orm'

import { db } from '@/lib/db'
import { organizationMembers, organizations, subscriptions, users } from '@/lib/db/schema'

const DEFAULT_PAGE = 1
const DEFAULT_LIMIT = 10

function createSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

async function createUniqueSlug(name: string) {
  const baseSlug = createSlug(name)

  if (!baseSlug) {
    throw new Error('Organization name must contain letters or numbers')
  }

  let slug = baseSlug
  let suffix = 1

  while (true) {
    const existing = await db
      .select({ id: organizations.id })
      .from(organizations)
      .where(eq(organizations.slug, slug))
      .limit(1)

    if (existing.length === 0) return slug

    suffix += 1
    slug = `${baseSlug}-${suffix}`
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const page = Math.max(parseInt(searchParams.get('page') ?? `${DEFAULT_PAGE}`), 1)
    const limit = Math.max(parseInt(searchParams.get('limit') ?? `${DEFAULT_LIMIT}`), 1)
    const search = searchParams.get('search')?.trim()
    const from = (page - 1) * limit

    const filters = search
      ? or(
          ilike(organizations.name, `%${search}%`),
          ilike(organizations.slug, `%${search}%`)
        )
      : undefined

    const rows = await db
      .select({
        id: organizations.id,
        name: organizations.name,
        slug: organizations.slug,
        logo: organizations.logo,
        createdAt: organizations.createdAt,
        ownerName: users.name,
        ownerEmail: users.email,
        ownerAvatar: users.avatarUrl,
        subscriptionStatus: subscriptions.status,
        subscriptionPriceId: subscriptions.stripePriceId,
        memberCount: sql<number>`count(distinct ${organizationMembers.userId})`,
      })
      .from(organizations)
      .leftJoin(
        organizationMembers,
        eq(organizationMembers.organizationId, organizations.id)
      )
      .leftJoin(
        users,
        sql`${users.id} = ${organizationMembers.userId} and ${organizationMembers.role} = 'owner'`
      )
      .leftJoin(
        subscriptions,
        eq(subscriptions.organizationId, organizations.id)
      )
      .where(filters)
      .groupBy(
        organizations.id,
        organizations.name,
        organizations.slug,
        organizations.logo,
        organizations.createdAt,
        users.name,
        users.email,
        users.avatarUrl,
        subscriptions.status,
        subscriptions.stripePriceId
      )
      .orderBy(desc(organizations.createdAt))
      .limit(limit)
      .offset(from)

    const totalResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(organizations)
      .where(filters)

    const data = rows.map((row) => ({
      id: row.id,
      name: row.name,
      slug: row.slug,
      logo: row.logo,
      plan: row.subscriptionPriceId ?? 'free',
      status: row.subscriptionStatus ?? 'inactive',
      memberCount: Number(row.memberCount ?? 0),
      mrr: 0,
      createdAt: row.createdAt.toISOString(),
      owner: {
        name: row.ownerName ?? 'Unassigned',
        email: row.ownerEmail ?? '—',
        avatar: row.ownerAvatar ?? '',
      },
    }))

    return NextResponse.json({
      data,
      total: Number(totalResult[0]?.count ?? 0),
    })
  } catch (error) {
    console.error('Failed to fetch organizations:', error)
    return NextResponse.json({ error: 'Failed to fetch organizations' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const name = typeof body.name === 'string' ? body.name.trim() : ''
    const logo = typeof body.logo === 'string' ? body.logo.trim() : ''

    if (!name) {
      return NextResponse.json({ error: 'Organization name is required' }, { status: 400 })
    }

    const slug = await createUniqueSlug(name)

    const [organization] = await db
      .insert(organizations)
      .values({
        name,
        slug,
        logo: logo || null,
      })
      .returning({
        id: organizations.id,
        name: organizations.name,
        slug: organizations.slug,
        logo: organizations.logo,
        createdAt: organizations.createdAt,
      })

    return NextResponse.json({
      organization: {
        ...organization,
        createdAt: organization.createdAt.toISOString(),
      },
      message: 'Organization created successfully',
    })
  } catch (error) {
    console.error('Failed to create organization:', error)
    const message = error instanceof Error ? error.message : 'Failed to create organization'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
