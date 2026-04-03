'use server'

import { createClient } from '@/lib/supabase/server'
import { stripe, getPriceIdByPlan } from '@/lib/stripe/server'
import { db } from '@/lib/db'
import { organizations, subscriptions, organizationMembers } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export async function getCurrentSubscription() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const member = await db.query.organizationMembers.findFirst({
    where: eq(organizationMembers.userId, user.id),
  })
  if (!member) return null

  const subscription = await db.query.subscriptions.findFirst({
    where: eq(subscriptions.organizationId, member.organizationId),
  })

  return subscription ?? null
}

export async function createCheckoutSession(planSlug: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const member = await db.query.organizationMembers.findFirst({
    where: eq(organizationMembers.userId, user.id),
  })
  if (!member) return { error: 'No organization found' }

  const org = await db.query.organizations.findFirst({
    where: eq(organizations.id, member.organizationId),
  })
  if (!org) return { error: 'Organization not found' }

  const priceId = getPriceIdByPlan(planSlug)
  if (!priceId) return { error: 'Invalid plan' }

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    customer: org.stripeCustomerId ?? undefined,
    customer_email: org.stripeCustomerId ? undefined : user.email,
    line_items: [{ price: priceId, quantity: 1 }],
    metadata: { organizationId: org.id },
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/billing?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/billing?canceled=true`,
  })

  return { url: session.url }
}

export async function createBillingPortalSession() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const member = await db.query.organizationMembers.findFirst({
    where: eq(organizationMembers.userId, user.id),
  })
  if (!member) return { error: 'No organization found' }

  const org = await db.query.organizations.findFirst({
    where: eq(organizations.id, member.organizationId),
  })
  if (!org?.stripeCustomerId) return { error: 'No billing account found' }

  const session = await stripe.billingPortal.sessions.create({
    customer: org.stripeCustomerId,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/billing`,
  })

  return { url: session.url }
}
