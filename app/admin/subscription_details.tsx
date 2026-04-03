// src/components/admin/subscription-details-dialog.tsx
'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Progress } from '@/components/ui/progress'
import {
  CreditCard,
  Users,
  Database,
  Activity,
  Download,
  Mail,
  RefreshCw,
  AlertCircle,
} from 'lucide-react'
import { format, formatDistanceToNow } from 'date-fns'
import { Subscription, Invoice } from './types'

interface SubscriptionDetailsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  subscription: Subscription
}

export function SubscriptionDetailsDialog({
  open,
  onOpenChange,
  subscription,
}: SubscriptionDetailsDialogProps) {
  if (!subscription) return null

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500'
      case 'past_due':
        return 'bg-red-500'
      case 'canceled':
        return 'bg-gray-500'
      default:
        return 'bg-yellow-500'
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Subscription Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header Section */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-2xl font-bold">
                  {subscription.organizationName.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h2 className="text-xl font-semibold">{subscription.organizationName}</h2>
                <p className="text-sm text-muted-foreground">
                  Subscription ID: {subscription.id.slice(0, 12)}...
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Mail className="mr-2 h-4 w-4" />
                Contact
              </Button>
              <Button variant="outline" size="sm">
                <RefreshCw className="mr-2 h-4 w-4" />
                Sync
              </Button>
            </div>
          </div>

          <Separator />

          {/* Plan Details */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Plan Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Current Plan</span>
                  <Badge className="capitalize">{subscription.plan}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Price</span>
                  <span className="font-semibold">
                    ${subscription.price}/{subscription.interval}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <div className="flex items-center gap-2">
                    <div className={`h-2 w-2 rounded-full ${getStatusColor(subscription.status)}`} />
                    <span className="capitalize">{subscription.status}</span>
                  </div>
                </div>
                {subscription.trialEnd && (
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Trial Ends</span>
                    <span>{format(subscription.trialEnd, 'PPP')}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Billing Cycle</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Current Period</span>
                  <span>
                    {format(subscription.currentPeriodStart, 'MMM d')} -{' '}
                    {format(subscription.currentPeriodEnd, 'MMM d, yyyy')}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Time Remaining</span>
                  <span>
                    {formatDistanceToNow(subscription.currentPeriodEnd, { addSuffix: true })}
                  </span>
                </div>
                {subscription.cancelAtPeriodEnd && (
                  <div className="flex items-center gap-2 rounded-md bg-yellow-500/10 p-2 text-yellow-600">
                    <AlertCircle className="h-4 w-4" />
                    <span className="text-sm">
                      Subscription will cancel at period end
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Usage Metrics */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Usage Metrics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-muted-foreground" />
                    <span>API Calls</span>
                  </div>
                  <span>
                    {subscription.usage.apiCalls.toLocaleString()} / 100,000
                  </span>
                </div>
                <Progress value={45} />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Database className="h-4 w-4 text-muted-foreground" />
                    <span>Storage Used</span>
                  </div>
                  <span>
                    {subscription.usage.storage} GB / 100 GB
                  </span>
                </div>
                <Progress value={32} />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>Active Users</span>
                  </div>
                  <span>
                    {subscription.usage.users} / 50
                  </span>
                </div>
                <Progress value={60} />
              </div>
            </CardContent>
          </Card>

          {/* Payment Method */}
          {subscription.paymentMethod && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Payment Method</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CreditCard className="h-8 w-8 text-muted-foreground" />
                    <div>
                      <div className="font-medium capitalize">
                        {subscription.paymentMethod.brand} •••• {subscription.paymentMethod.last4}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Expires {subscription.paymentMethod.expMonth}/{subscription.paymentMethod.expYear}
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Update
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Recent Invoices */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Invoices</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {subscription.invoices?.slice(0, 5).map((invoice: Invoice) => (
                  <div key={invoice.id} className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">${invoice.amount}</div>
                      <div className="text-sm text-muted-foreground">
                        {format(invoice.date, 'PPP')}
                      </div>
                    </div>
                    <Badge variant={invoice.status === 'paid' ? 'default' : 'secondary'}>
                      {invoice.status}
                    </Badge>
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <Button variant="outline">View in Stripe</Button>
            <Button variant="destructive">Cancel Subscription</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}