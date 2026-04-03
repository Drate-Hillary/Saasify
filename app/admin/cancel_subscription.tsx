// src/components/admin/cancel-subscription-dialog.tsx
'use client'

import { useState } from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { Subscription } from './types'

interface CancelSubscriptionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  subscription: Subscription
  onSuccess: () => void
}

export function CancelSubscriptionDialog({
  open,
  onOpenChange,
  subscription,
  onSuccess,
}: CancelSubscriptionDialogProps) {
  const [reason, setReason] = useState('')
  const [cancellationType, setCancellationType] = useState<'immediate' | 'periodEnd'>('periodEnd')
  const [isLoading, setIsLoading] = useState(false)

  const handleCancel = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/admin/subscriptions/${subscription.id}/cancel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: cancellationType,
          reason,
        }),
      })

      if (!response.ok) throw new Error('Failed to cancel subscription')

      toast.success(
        cancellationType === 'immediate'
          ? 'Subscription canceled immediately'
          : 'Subscription will be canceled at period end'
      )
      onSuccess()
      onOpenChange(false)
    } catch (error) {
      toast.error('Failed to cancel subscription')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Cancel Subscription</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to cancel the subscription for{' '}
            <strong>{subscription?.organizationName}</strong>?
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-4 py-4">
          <RadioGroup
            value={cancellationType}
            onValueChange={(value: 'immediate' | 'periodEnd') => setCancellationType(value)}
            className="space-y-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="periodEnd" id="periodEnd" />
              <Label htmlFor="periodEnd">
                Cancel at the end of the billing period (
                {new Date(subscription?.currentPeriodEnd).toLocaleDateString()})
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="immediate" id="immediate" />
              <Label htmlFor="immediate">Cancel immediately (refund prorated amount)</Label>
            </div>
          </RadioGroup>

          <div className="space-y-2">
            <Label htmlFor="reason">Reason for cancellation (optional)</Label>
            <Textarea
              id="reason"
              placeholder="Please tell us why you're canceling..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel>Keep Subscription</AlertDialogCancel>
          <AlertDialogAction onClick={handleCancel} disabled={isLoading}>
            {isLoading ? 'Canceling...' : 'Confirm Cancellation'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}