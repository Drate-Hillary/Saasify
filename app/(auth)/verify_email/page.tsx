'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { resendVerificationEmail } from '../register/actions'

export default function VerifyEmailPage() {
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')

  const handleResend = async () => {
    if (!email) {
      toast.error('Please enter your email')
      return
    }
    setLoading(true)
    const result = await resendVerificationEmail(email)
    if (result?.error) {
      toast.error(result.error)
    } else {
      toast.success('Verification email resent')
    }
    setLoading(false)
  }

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">Check your email</CardTitle>
          <CardDescription className="text-center">
            We sent a verification link to your email. Click it to activate your account.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <input
            type="email"
            placeholder="Enter your email to resend"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-md border px-3 py-2 text-sm"
          />
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button className="w-full" variant="outline" onClick={handleResend} disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Resend verification email
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            <Link href="/login" className="text-primary hover:underline">Back to sign in</Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
