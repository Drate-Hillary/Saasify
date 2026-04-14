// src/components/admin/subscription-stats.tsx
'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DollarSign, TrendingUp, Users, CreditCard } from 'lucide-react'

export function SubscriptionStats() {
  const stats = [
    {
      title: 'Total MRR',
      value: '$12,450',
      change: '+8.2%',
      trend: 'up',
      icon: DollarSign,
    },
    {
      title: 'Active Subscriptions',
      value: '247',
      change: '+12',
      trend: 'up',
      icon: CreditCard,
    },
    {
      title: 'Churn Rate',
      value: '2.4%',
      change: '-0.5%',
      trend: 'down', // Downward churn is usually good!
      icon: TrendingUp,
    },
    {
      title: 'Avg Revenue Per User',
      value: '$84',
      change: '+$12',
      trend: 'up',
      icon: Users,
    },
  ]

  return (
    <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title} className="overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium truncate">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground shrink-0" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}