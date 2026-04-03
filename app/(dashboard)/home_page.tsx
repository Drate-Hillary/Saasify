// src/app/page.tsx
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="text-xl font-bold">
              SaaS Boilerplate
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/register">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="py-20 md:py-32">
          <div className="container text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
              Launch Your SaaS
              <br />
              <span className="text-primary">in Minutes</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
              Production-ready boilerplate with authentication, team management,
              billing, and admin dashboard. Save weeks of development time.
            </p>
            <div className="mt-10 flex items-center justify-center gap-4">
              <Link href="/register">
                <Button size="lg">Start Free Trial</Button>
              </Link>
              <Link href="#pricing">
                <Button size="lg" variant="outline">
                  View Pricing
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section id="pricing" className="py-20 bg-muted/50">
          <div className="container">
            <h2 className="text-3xl font-bold text-center mb-12">
              Simple, Transparent Pricing
            </h2>
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {pricingPlans.map((plan) => (
                <div key={plan.name} className="rounded-lg border bg-background p-8">
                  <h3 className="text-2xl font-bold">{plan.name}</h3>
                  <div className="mt-4 flex items-baseline text-5xl font-bold">
                    ${plan.price}
                    <span className="text-sm font-normal text-muted-foreground">
                      /month
                    </span>
                  </div>
                  <ul className="mt-6 space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2">
                        ✓ {feature}
                      </li>
                    ))}
                  </ul>
                  <Link href="/register">
                    <Button className="w-full mt-8">Get Started</Button>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

const pricingPlans = [
  {
    name: 'Starter',
    price: 29,
    features: ['Up to 5 team members', '10GB storage', 'Basic analytics', 'Email support'],
  },
  {
    name: 'Pro',
    price: 99,
    features: [
      'Up to 20 team members',
      '100GB storage',
      'Advanced analytics',
      'Priority support',
      'API access',
    ],
  },
  {
    name: 'Enterprise',
    price: 299,
    features: [
      'Unlimited team members',
      '1TB storage',
      'Custom analytics',
      '24/7 phone support',
      'SLA agreement',
      'SSO',
    ],
  },
]