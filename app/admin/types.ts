export interface Invoice {
  id: string
  amount: number
  status: 'paid' | 'unpaid' | 'pending'
  date: Date | string
  invoiceUrl?: string
}

export interface Subscription {
  id: string
  organizationId: string
  organizationName: string
  organizationLogo: string | null
  plan: string
  status: 'active' | 'past_due' | 'canceled' | 'incomplete' | 'incomplete_expired' | 'trialing' | 'unpaid'
  price: number
  currency?: string
  interval: 'month' | 'year'
  currentPeriodStart: Date | string
  currentPeriodEnd: Date | string
  cancelAtPeriodEnd: boolean | null
  trialStart?: Date | string | null
  trialEnd?: Date | string | null
  createdAt: Date | string
  updatedAt: Date | string
  stripeSubscriptionId?: string | null
  stripe_subscription_id?: string | null
  stripe_price_id?: string | null
  paymentMethod: {
    brand: string
    last4: string
    expMonth: number
    expYear: number
  } | null
  invoices: Invoice[]
  usage: {
    apiCalls: number
    storage: number
    users: number
  }
}
