"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { signInWithPassword } from "./actions";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Skeleton } from "@/components/ui/skeleton";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const result = await signInWithPassword(email, password);
    if (result?.error) toast.error(result.error);
    setLoading(false);
  };

  return (
    /* Removed w-screen and container to allow better mobile behavior */
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background px-4 py-8">
      
      {/* Branding or Back Link (Optional but keeps it consistent with Forgot Password) */}
      <div className="mb-6 text-center">
        <Link href="/" className="text-2xl font-bold tracking-tight">
          Saasify
        </Link>
      </div>

      <Card className="w-full max-w-100 border-none shadow-xl sm:border sm:shadow-sm">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
          <CardDescription>
            Enter your email and password to sign in
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-10"
                required
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link
                  href="/forgot_password"
                  className="text-xs text-primary hover:underline underline-offset-4"
                >
                  Forgot password?
                </Link>
              </div>
              <InputGroup>
                <InputGroupInput
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  className="h-10"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <InputGroupAddon
                  align="inline-end"
                  onClick={handleShowPassword}
                  className="px-2"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-muted-foreground cursor-pointer" />
                  ) : (
                    <Eye className="h-5 w-5 text-muted-foreground cursor-pointer" />
                  )}
                </InputGroupAddon>
              </InputGroup>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4 pb-8">
            <Button type="submit" className="w-full h-10 mt-8 text-base" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Sign In
            </Button>
            
            <p className="text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="font-medium text-primary hover:underline underline-offset-4">
                Sign up
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<Skeleton />}>
      <LoginForm />
    </Suspense>
  );
}