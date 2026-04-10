'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input' // Use your UI component
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, Mail, ArrowLeft } from 'lucide-react'
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
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background px-4 py-8">
      
      {/* Visual Identity */}
      <div className="mb-8 flex flex-col items-center">
        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
          <Mail className="h-6 w-6 text-primary" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight">Saasify</h2>
      </div>

      <Card className="w-full max-w-[400px] border-none shadow-xl sm:border sm:shadow-sm">
        <CardHeader className="space-y-1 pt-8">
          <CardTitle className="text-2xl font-bold text-center">Check your email</CardTitle>
          <CardDescription className="text-center px-4">
            We sent a verification link to your inbox. Please click it to activate your account.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="resend-email">Confirm your email address</Label>
            <Input
              id="resend-email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-11"
            />
          </div>
        </CardContent>

        <CardFooter className="flex flex-col space-y-4 pb-8">
          <Button 
            className="w-full h-11 text-base" 
            variant="default" 
            onClick={handleResend} 
            disabled={loading}
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Resend verification email
          </Button>
          
          <div className="text-center">
            <Link 
              href="/login" 
              className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to sign in
            </Link>
          </div>
        </CardFooter>
      </Card>
      
      <p className="mt-8 text-sm text-muted-foreground text-center max-w-[300px]">
        Didn&apos;t receive an email? Check your spam folder or try another email address.
      </p>
    </div>
  )
}