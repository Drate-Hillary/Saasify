import { RevenueChart } from '@/app/admin/revenue_chart'
import { StatsCards } from '@/app/admin/stats_card'
import { SubscribersChart } from '@/app/admin/subscribers_chart'
import { createClient } from '@/lib/supabase/client'

export default async function DashboardPage() {
  const db = await createClient()
  const { count: activeCount } = await db
    .from('users')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'active')

  const { count: inactiveCount } = await db
    .from('users')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'suspended')
  return (
    <div className="space-y-6">
      <div className='mt-2'>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your SaaS platform
        </p>
      </div>

        <StatsCards />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <div className="lg:col-span-4">
          <RevenueChart />
        </div>
        <div className="lg:col-span-3">
          <SubscribersChart activeUsers={activeCount || 0} inactiveUsers={inactiveCount || 0} />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* <RecentActivity />
        <TopUsers /> */}
      </div>
    </div>
  )
}