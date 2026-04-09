import {
  Avatar,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Memoji02 from "@/public/Memoji-02.png";
import { PlusIcon } from "lucide-react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 px-8">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="text-xl font-bold">
              Saasify
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/register">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="py-20 md:py-32">
          <div className="container text-center flex flex-col content-center items-center">
            <AvatarGroup>
              <Avatar className="h-10 w-10">
                <AvatarImage src={Memoji02.src} alt="" className="" />
              </Avatar>
              <Avatar className="h-10 w-10">
                <AvatarImage src={Memoji02.src} alt="" className="" />
              </Avatar>
              <Avatar className="h-10 w-10">
                <AvatarImage src={Memoji02.src} alt="" className="" />
              </Avatar>
              <AvatarGroupCount className="h-10 w-10">
                <PlusIcon />
              </AvatarGroupCount>
            </AvatarGroup>
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
              Launch Your SaaS
              <br />
              <span className="text-primary">in Minutes</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
              Production-ready boilerplate with authentication, team management,
              billing, and admin dashboard. Save weeks of development time.
            </p>
            <div className="mt-10 flex items-center justify-center gap-4">
              <Link href="/register">
                <Button size="lg">Start Free Trial</Button>
              </Link>
              <Link href="#pricing">
                <Button size="lg" variant="outline">
                  View Pricing
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section id="pricing" className="py-16 md:py-24 lg:py-32 bg-muted/50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Simple, Transparent Pricing
              </h2>
              <p className="max-w-175 text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Choose the plan that works best for your business needs.
              </p>
            </div>

            {/* Responsive Grid: 1 column on mobile, 2 on tablet, 3 on desktop */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
              {pricingPlans.map((plan) => (
                <Card
                  key={plan.name}
                  className="flex flex-col justify-between rounded-xl border bg-background p-6 md:p-8 transition-all hover:shadow-lg"
                >
                  <div>
                    <CardHeader className="p-0">
                      <CardTitle className="text-xl font-bold">
                        {plan.name}
                      </CardTitle>
                      <CardDescription className="mt-4 flex items-baseline text-4xl md:text-5xl font-bold text-foreground">
                        ${plan.price}
                        <span className="ml-1 text-sm font-normal text-muted-foreground">
                          /month
                        </span>
                      </CardDescription>
                    </CardHeader>

                    <ul className="mt-8 space-y-3 text-sm md:text-base">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-3">
                          <span className="text-primary font-bold">✓</span>
                          <span className="text-muted-foreground">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-8">
                    <Link href="/register" className="w-full">
                      <Button className="w-full h-11 md:h-12 text-base font-medium">
                        Get Started
                      </Button>
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

const pricingPlans = [
  {
    name: "Starter",
    price: 29,
    features: [
      "Up to 5 team members",
      "10GB storage",
      "Basic analytics",
      "Email support",
    ],
  },
  {
    name: "Pro",
    price: 99,
    features: [
      "Up to 20 team members",
      "100GB storage",
      "Advanced analytics",
      "Priority support",
      "API access",
    ],
  },
  {
    name: "Enterprise",
    price: 299,
    features: [
      "Unlimited team members",
      "1TB storage",
      "Custom analytics",
      "24/7 phone support",
      "SLA agreement",
      "SSO",
    ],
  },
];
