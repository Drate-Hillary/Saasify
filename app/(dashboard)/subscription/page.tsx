import { SubscriptionStats } from "@/app/admin/subscription_stat";
import { SubscriptionsTable } from "@/app/admin/subscription_table";
import { Skeleton } from "@/components/ui/skeleton";

export default function SubscriptionsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Subscriptions</h1>
        <p className="text-muted-foreground">
          Monitor and manage all customer subscriptions
        </p>
      </div>

      <SubscriptionStats />
      <SubscriptionsTable />
    </div>
  )
}