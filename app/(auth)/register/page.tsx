'use client'

import { useState, Suspense } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, Eye, EyeOff } from 'lucide-react'
import { toast } from 'sonner'
import { signUp } from './actions'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'

function RegisterForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  
  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const result = await signUp(email, password, name)
    if (result?.error) toast.error(result.error)
    setLoading(false)
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background px-4 py-8">
      {/* Branding */}
      <div className="mb-8 text-center">
        <Link href="/" className="text-2xl font-bold tracking-tight">
          Saasify
        </Link>
      </div>

      <Card className="w-full max-w-100 border-none shadow-xl sm:border sm:shadow-sm bg-card">
        <CardHeader className="space-y-1 pt-8">
          <CardTitle className="text-2xl font-bold text-center">Create an account</CardTitle>
          <CardDescription className="text-center px-2">
            Enter your details below to get started with your 14-day free trial
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleRegister}>
          <CardContent className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                className="h-11"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                className="h-11"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <InputGroup>
                <InputGroupInput
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  className="h-10 pr-12"
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <InputGroupAddon 
                  align="inline-end" 
                  onClick={handleShowPassword}
                  className="px-3"
                >
                  {showPassword ? (
                    <EyeOff className="h-8 w-8 text-muted-foreground cursor-pointer transition-colors hover:text-foreground" />
                  ) : (
                    <Eye className="h-8 w-8 text-muted-foreground cursor-pointer transition-colors hover:text-foreground" />
                  )}
                </InputGroupAddon>
              </InputGroup>
              <p className="text-[10px] text-muted-foreground px-1">
                Must be at least 8 characters long.
              </p>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4 pb-8 pt-4">
            <Button type="submit" className="w-full h-10 text-base font-medium" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Account
            </Button>
            
            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link 
                href="/login" 
                className="font-medium text-primary hover:underline underline-offset-4"
              >
                Sign in
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>

      {/* Trust Footer */}
      <p className="mt-8 px-8 text-center text-xs text-muted-foreground leading-relaxed max-w-87.5">
        By clicking continue, you agree to our{' '}
        <Link href="/terms" className="underline underline-offset-4 hover:text-primary">Terms of Service</Link>{' '}
        and{' '}
        <Link href="/privacy" className="underline underline-offset-4 hover:text-primary">Privacy Policy</Link>.
      </p>
    </div>
  )
}

export default function RegisterPage() {
  return (
    <Suspense>
      <RegisterForm />
    </Suspense>
  )
}