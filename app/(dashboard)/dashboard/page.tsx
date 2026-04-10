import { StatsCards } from '@/app/admin/stats_card'
// import { RecentActivity } from '@/components/admin/recent-activity'
// import { RevenueChart } from '@/components/admin/revenue-chart'
// import { TopUsers } from '@/components/admin/top-users'
// import { SystemStatus } from '@/components/admin/system-status'

export default function DashboardPage() {
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
          {/* <RevenueChart /> */}
        </div>
        <div className="lg:col-span-3">
          {/* <SystemStatus /> */}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* <RecentActivity />
        <TopUsers /> */}
      </div>
    </div>
  )
}