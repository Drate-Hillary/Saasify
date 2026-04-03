import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, Building2, CreditCard, DollarSign, TrendingUp } from 'lucide-react'
import { db } from '@/lib/db'
import { users, organizations, subscriptions } from '@/lib/db/schema'
import { eq, count } from 'drizzle-orm'

export async function StatsCards() {
  const [
    [{ value: totalUsers }],
    [{ value: totalOrgs }],
    [{ value: activeSubscriptions }],
    revenue,
  ] = await Promise.all([
    db.select({ value: count() }).from(users),
    db.select({ value: count() }).from(organizations),
    db.select({ value: count() }).from(subscriptions).where(eq(subscriptions.status, 'active')),
    db.select({ stripePriceId: subscriptions.stripePriceId }).from(subscriptions).where(eq(subscriptions.status, 'active')),
  ])

  const monthlyRevenue = revenue.length * 49

  const stats = [
    { title: 'Total Users', value: totalUsers, icon: Users},
    { title: 'Organizations', value: totalOrgs, icon: Building2},
    { title: 'Active Subscriptions', value: activeSubscriptions, icon: CreditCard },
    { title: 'Monthly Revenue', value: `$${monthlyRevenue.toLocaleString()}`, icon: DollarSign, },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
