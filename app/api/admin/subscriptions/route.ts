import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { Enums } from '@/types/database'

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(req.url)

    const page = parseInt(searchParams.get('page') ?? '1')
    const limit = parseInt(searchParams.get('limit') ?? '10')
    const status = searchParams.get('status')
    const search = searchParams.get('search')
    const from = (page - 1) * limit
    const to = from + limit - 1

    let query = supabase
      .from('subscriptions')
      .select(`
        *,
        organizations (
          id,
          name,
          logo
        )
      `, { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to)

    if (status) query = query.eq('status', status as Enums<'subscription_status'>)

    if (search) {
      query = query.ilike('organizations.name', `%${search}%`)
    }

    const { data, error, count } = await query

    if (error) throw error

    const subscriptions = data?.map((sub) => ({
      id: sub.id,
      organizationId: sub.organization_id,
      organizationName: sub.organizations?.name ?? 'Unknown',
      organizationLogo: sub.organizations?.logo ?? null,
      status: sub.status,
      stripe_subscription_id: sub.stripe_subscription_id,
      stripe_price_id: sub.stripe_price_id,
      currentPeriodStart: sub.current_period_start,
      currentPeriodEnd: sub.current_period_end,
      cancelAtPeriodEnd: sub.cancel_at_period_end ?? false,
      createdAt: sub.created_at,
      updatedAt: sub.updated_at,
      // Fields not in DB — defaults until enriched from Stripe
      plan: sub.stripe_price_id ?? 'unknown',
      price: 0,
      interval: 'month',
      usage: { apiCalls: 0, storage: 0, users: 0 },
      paymentMethod: null,
      invoices: [],
    }))

    return NextResponse.json({ data: subscriptions, total: count ?? 0 })
  } catch (error) {
    console.error('Failed to fetch subscriptions:', error)
    return NextResponse.json({ error: 'Failed to fetch subscriptions' }, { status: 500 })
  }
}
