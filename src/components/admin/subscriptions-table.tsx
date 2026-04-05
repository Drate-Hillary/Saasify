// src/components/admin/subscriptions-table.tsx
'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  MoreHorizontal,
  Eye,
  CreditCard,
  RefreshCw,
  Ban,
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle,
  Receipt,
  Mail,
  Users,
} from 'lucide-react'
import { format, formatDistanceToNow, differenceInDays } from 'date-fns'
import { Skeleton } from '@/components/ui/skeleton'
import { Progress } from '@/components/ui/progress'
import { toast } from 'sonner'
import { SubscriptionDetailsDialog } from './subscription_details'
import { CancelSubscriptionDialog } from './cancel_subscription'
import { ChangePlanDialog } from './change_plan'
import { Subscription, Invoice } from './types'

const getStatusConfig = (status: Subscription['status']) => {
  const configs = {
    active: {
      label: 'Active',
      variant: 'default' as const,
      icon: CheckCircle,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
    },
    past_due: {
      label: 'Past Due',
      variant: 'destructive' as const,
      icon: AlertCircle,
      color: 'text-red-500',
      bgColor: 'bg-red-500/10',
    },
    canceled: {
      label: 'Canceled',
      variant: 'secondary' as const,
      icon: XCircle,
      color: 'text-gray-500',
      bgColor: 'bg-gray-500/10',
    },
    incomplete: {
      label: 'Incomplete',
      variant: 'secondary' as const,
      icon: Clock,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500/10',
    },
    incomplete_expired: {
      label: 'Expired',
      variant: 'secondary' as const,
      icon: XCircle,
      color: 'text-gray-500',
      bgColor: 'bg-gray-500/10',
    },
    trialing: {
      label: 'Trialing',
      variant: 'default' as const,
      icon: Clock,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    unpaid: {
      label: 'Unpaid',
      variant: 'destructive' as const,
      icon: AlertCircle,
      color: 'text-red-500',
      bgColor: 'bg-red-500/10',
    },
  }
  return configs[status]
}

function SubscriptionsTableInner() {
  const searchParams = useSearchParams()
  const [data, setData] = useState<Subscription[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null)
  const [showDetailsDialog, setShowDetailsDialog] = useState(false)
  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const [showChangePlanDialog, setShowChangePlanDialog] = useState(false)
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  })

  useEffect(() => {
    fetchSubscriptions()
  }, [searchParams, pagination.pageIndex])

  const fetchSubscriptions = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams(searchParams)
      params.set('page', (pagination.pageIndex + 1).toString())
      params.set('limit', pagination.pageSize.toString())

      const response = await fetch(`/api/admin/subscriptions?${params.toString()}`)
      const result = await response.json()
      setData((result.data ?? []) as Subscription[])
    } catch (error) {
      toast.error('Failed to fetch subscriptions')
    } finally {
      setLoading(false)
    }
  }

  const handleSyncWithStripe = async (subscriptionId: string) => {
    try {
      const response = await fetch(`/api/admin/subscriptions/${subscriptionId}/sync`, {
        method: 'POST',
      })
      if (response.ok) {
        toast.success('Subscription synced successfully')
        fetchSubscriptions()
      } else {
        toast.error('Failed to sync subscription')
      }
    } catch (error) {
      toast.error('Failed to sync subscription')
    }
  }

  const columns: ColumnDef<Subscription>[] = [
    {
      accessorKey: 'organization',
      header: 'Organization',
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-sm font-semibold">
              {row.original.organizationName.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <div className="font-medium">{row.original.organizationName}</div>
            <div className="text-sm text-muted-foreground">
              ID: {row.original.organizationId.slice(0, 8)}...
            </div>
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'plan',
      header: 'Plan & Price',
      cell: ({ row }) => (
        <div>
          <div className="font-medium capitalize">{row.original.plan}</div>
          <div className="text-sm text-muted-foreground">
            ${row.original.price}/{row.original.interval}
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const config = getStatusConfig(row.original.status)
        const Icon = config.icon
        return (
          <div className="flex items-center gap-2">
            <div className={`rounded-full p-1 ${config.bgColor}`}>
              <Icon className={`h-3 w-3 ${config.color}`} />
            </div>
            <Badge variant={config.variant}>{config.label}</Badge>
          </div>
        )
      },
    },
    {
      accessorKey: 'period',
      header: 'Current Period',
      cell: ({ row }) => {
        const end = new Date(row.original.currentPeriodEnd)
        const start = new Date(row.original.currentPeriodStart)
        const daysLeft = differenceInDays(end, new Date())
        const progress = ((new Date().getTime() - start.getTime()) /
                         (end.getTime() - start.getTime())) * 100

        return (
          <div className="space-y-1">
            <div className="text-sm">
              Ends {formatDistanceToNow(end, { addSuffix: true })}
            </div>
            <div className="flex items-center gap-2">
              <Progress value={progress} className="h-1 w-20" />
              <span className="text-xs text-muted-foreground">
                {daysLeft} days left
              </span>
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: 'usage',
      header: 'Usage',
      cell: ({ row }) => {
        const { apiCalls, storage, users } = row.original.usage
        const apiLimit = row.original.plan === 'free' ? 1000 :
                        row.original.plan === 'pro' ? 10000 :
                        row.original.plan === 'business' ? 100000 : 1000000
        const apiPercentage = (apiCalls / apiLimit) * 100

        return (
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span>API Calls</span>
              <span>{apiCalls.toLocaleString()} / {apiLimit.toLocaleString()}</span>
            </div>
            <Progress value={apiPercentage} className="h-1" />
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Users className="h-3 w-3" />
              <span>{users} users</span>
              <span>•</span>
              <span>{storage} GB storage</span>
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: 'createdAt',
      header: 'Created',
      cell: ({ row }) => (
        <div className="text-sm">
          {format(row.original.createdAt, 'MMM d, yyyy')}
        </div>
      ),
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const subscription = row.original

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => {
                setSelectedSubscription(subscription)
                setShowDetailsDialog(true)
              }}>
                <Eye className="mr-2 h-4 w-4" />
                View details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => {
                setSelectedSubscription(subscription)
                setShowChangePlanDialog(true)
              }}>
                <CreditCard className="mr-2 h-4 w-4" />
                Change plan
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Receipt className="mr-2 h-4 w-4" />
                View invoices
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Mail className="mr-2 h-4 w-4" />
                Send reminder
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSyncWithStripe(subscription.id)}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Sync with Stripe
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {subscription.status === 'active' && (
                <DropdownMenuItem
                  className="text-red-600"
                  onClick={() => {
                    setSelectedSubscription(subscription)
                    setShowCancelDialog(true)
                  }}
                >
                  <Ban className="mr-2 h-4 w-4" />
                  Cancel subscription
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  const table = useReactTable({
    data,
    columns,
    pageCount: -1,
    state: {
      pagination,
    },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: true,
  })

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="rounded-md border">
          <div className="p-4 space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-[200px]" />
                  <Skeleton className="h-3 w-[150px]" />
                </div>
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-8 w-24" />
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-4">
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => {
                      setSelectedSubscription(row.original)
                      setShowDetailsDialog(true)
                    }}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <CreditCard className="h-8 w-8 text-muted-foreground" />
                      <p>No subscriptions found</p>
                      <p className="text-sm text-muted-foreground">
                        Try adjusting your filters or create a new subscription
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {table.getRowModel().rows?.length} of {data.length} subscriptions
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        </div>
      </div>

      {/* Dialogs */}
      {selectedSubscription && (
        <>
          <SubscriptionDetailsDialog
            open={showDetailsDialog}
            onOpenChange={setShowDetailsDialog}
            subscription={selectedSubscription}
          />
          <CancelSubscriptionDialog
            open={showCancelDialog}
            onOpenChange={setShowCancelDialog}
            subscription={selectedSubscription}
            onSuccess={fetchSubscriptions}
          />
          <ChangePlanDialog
            open={showChangePlanDialog}
            onOpenChange={setShowChangePlanDialog}
            subscription={selectedSubscription}
            onSuccess={fetchSubscriptions}
          />
        </>
      )}
    </>
  )
}

export function SubscriptionsTable() {
  return (
    <Suspense fallback={<Skeleton className="h-96 w-full" />}>
      <SubscriptionsTableInner />
    </Suspense>
  )
}