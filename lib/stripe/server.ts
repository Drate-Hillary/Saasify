import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
  appInfo: {
    name: 'SaaS Boilerplate',
    version: '1.0.0',
  },
})

export const getPriceIdByPlan = (planSlug: string): string => {
  const priceIds: Record<string, string> = {
    pro: process.env.STRIPE_PRO_PRICE_ID!,
    enterprise: process.env.STRIPE_ENTERPRISE_PRICE_ID!,
  }
  return priceIds[planSlug]
}