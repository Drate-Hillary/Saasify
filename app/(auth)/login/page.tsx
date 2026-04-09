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
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-4 sm:p-8">
      <Card className="w-full max-w-100">
        <CardHeader className="space-y-2">
          <CardTitle className="text-xl sm:text-2xl text-start">Welcome back</CardTitle>
          <CardDescription className="text-sm sm:text-base text-start">
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
                className="py-3 sm:py-4"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <InputGroup>
                <InputGroupInput
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  className="py-3 sm:py-4"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <InputGroupAddon
                  align="inline-end"
                  onClick={handleShowPassword}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 cursor-pointer text-muted-foreground transition-colors hover:text-foreground" />
                  ) : (
                    <Eye className="h-5 w-5 cursor-pointer text-muted-foreground transition-colors hover:text-foreground" />
                  )}
                </InputGroupAddon>
              </InputGroup>
            </div>
            <div className="text-right">
              <Link
                href="/forgot_password"
                className="text-xs text-primary hover:underline sm:text-sm"
              >
                Forgot password?
              </Link>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full py-5 sm:py-6 text-md font-medium" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Sign In
            </Button>
            <p className="text-center text-xs sm:text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="text-primary hover:underline">
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
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}