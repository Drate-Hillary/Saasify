import { stripe } from './server'
import Stripe from 'stripe'
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { subscriptions, organizations, auditLogs, subscriptionStatusEnum } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

type SubscriptionStatus = typeof subscriptionStatusEnum.enumValues[number]

type StripeSubscriptionRaw = Stripe.Subscription & {
  current_period_start: number
  current_period_end: number
}

type StripeInvoiceRaw = Stripe.Invoice & {
  subscription?: string
}

export async function handleStripeWebhook(req: Request) {
  const body = await req.text()
  const headerList = await headers()
  const signature = headerList.get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err) {
    console.error('Webhook signature verification failed.', err)
    return new Response('Webhook signature verification failed.', { status: 400 })
  }

  switch (event.type) {
    case 'customer.subscription.created':
    case 'customer.subscription.updated': {
      const subscription = event.data.object as Stripe.Subscription
      await handleSubscriptionChange(subscription)
      break
    }
    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription
      await db
        .update(subscriptions)
        .set({ status: 'canceled', updatedAt: new Date() })
        .where(eq(subscriptions.stripeSubscriptionId, subscription.id))
      break
    }
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session
      if (session.metadata?.organizationId) {
        await db
          .update(organizations)
          .set({ stripeCustomerId: session.customer as string })
          .where(eq(organizations.id, session.metadata.organizationId))
      }
      break
    }
    case 'invoice.payment_succeeded':
      console.log(`Invoice ${(event.data.object as Stripe.Invoice).id} paid successfully`)
      break

    case 'invoice.payment_failed': {
      const invoice = event.data.object as StripeInvoiceRaw
      console.error(`Invoice ${invoice.id} failed`)
      const subscription = await stripe.subscriptions.retrieve(invoice.subscription as string)
      const organizationId = subscription.metadata.organizationId
      if (organizationId) {
        await db.insert(auditLogs).values({
          organizationId,
          action: 'payment_failed',
          metadata: { invoice_id: invoice.id, amount_due: invoice.amount_due },
        })
      }
      break
    }
  }

  return NextResponse.json({ received: true })
}

async function handleSubscriptionChange(subscription: Stripe.Subscription) {
  const organizationId = subscription.metadata.organizationId
  if (!organizationId) {
    console.error('No organization ID in subscription metadata')
    return
  }

  await db
    .insert(subscriptions)
    .values({
      organizationId,
      stripeSubscriptionId: subscription.id,
      stripePriceId: subscription.items.data[0].price.id,
      status: subscription.status as SubscriptionStatus,
      currentPeriodStart: new Date((subscription as StripeSubscriptionRaw).current_period_start * 1000),
      currentPeriodEnd: new Date((subscription as StripeSubscriptionRaw).current_period_end * 1000),
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
    })
    .onConflictDoUpdate({
      target: subscriptions.stripeSubscriptionId,
      set: {
        stripePriceId: subscription.items.data[0].price.id,
        status: subscription.status as SubscriptionStatus,
        currentPeriodStart: new Date((subscription as StripeSubscriptionRaw).current_period_start * 1000),
        currentPeriodEnd: new Date((subscription as StripeSubscriptionRaw).current_period_end * 1000),
        cancelAtPeriodEnd: subscription.cancel_at_period_end,
        updatedAt: new Date(),
      },
    })
}
