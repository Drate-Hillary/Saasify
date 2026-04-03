// src/components/admin/change-plan-dialog.tsx
'use client'

import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { Check } from 'lucide-react'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import { Tables } from '@/types/database'
import { Subscription } from './types'

type Plan = Tables<'plans'>

interface ChangePlanDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  subscription: Subscription
  onSuccess: () => void
}

export function ChangePlanDialog({
  open,
  onOpenChange,
  subscription,
  onSuccess,
}: ChangePlanDialogProps) {
  const [selectedPlan, setSelectedPlan] = useState(subscription?.stripe_price_id ?? subscription?.plan ?? '')
  const [isLoading, setIsLoading] = useState(false)
  const [plans, setPlans] = useState<Plan[]>([])

  useEffect(() => {
    const supabase = createClient()
    supabase
      .from('plans')
      .select('*')
      .eq('is_active', true)
      .order('price', { ascending: true })
      .then(({ data }) => { if (data) setPlans(data) })
  }, [])

  const handleChangePlan = async () => {
    if (selectedPlan === subscription?.plan) {
      onOpenChange(false)
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch(`/api/admin/subscriptions/${subscription.id}/change-plan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stripePriceId: selectedPlan }),
      })

      if (!response.ok) throw new Error('Failed to change plan')

      toast.success('Plan changed successfully')
      onSuccess()
      onOpenChange(false)
    } catch {
      toast.error('Failed to change plan')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Change Subscription Plan</DialogTitle>
          <DialogDescription>
            Select a new plan for {subscription?.organizationName}
          </DialogDescription>
        </DialogHeader>

        <RadioGroup value={selectedPlan} onValueChange={setSelectedPlan} className="grid gap-4 md:grid-cols-2">
          {plans.map((plan) => (
            <Label
              key={plan.id}
              htmlFor={plan.id}
              className="cursor-pointer"
            >
              <Card className={`relative p-4 transition-all hover:shadow-md ${
                selectedPlan === plan.stripe_price_id ? 'ring-2 ring-primary' : ''
              }`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value={plan.stripe_price_id ?? plan.id} id={plan.id} className="mt-1" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{plan.name}</span>
                      </div>
                      <div className="mt-1 text-2xl font-bold">
                        ${plan.price ?? 0}
                        <span className="text-sm font-normal text-muted-foreground">
                          /month
                        </span>
                      </div>
                    </div>
                  </div>
                  {selectedPlan === plan.stripe_price_id && (
                    <Check className="h-5 w-5 text-primary" />
                  )}
                </div>
                <div className="mt-3 space-y-1">
                  {(plan.features as string[] ?? []).map((feature) => (
                    <div key={feature} className="flex items-center gap-2 text-sm">
                      <Check className="h-3 w-3 text-green-500" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </Label>
          ))}
        </RadioGroup>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleChangePlan} disabled={isLoading}>
            {isLoading ? 'Changing Plan...' : 'Confirm Change'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}