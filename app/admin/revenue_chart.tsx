"use client"

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

export const description = "A bar chart"

const data = [
  { month: 'Jan', revenue: 4000 },
  { month: 'Feb', revenue: 4500 },
  { month: 'Mar', revenue: 5200 },
  { month: 'Apr', revenue: 5800 },
  { month: 'May', revenue: 6200 },
  { month: 'Jun', revenue: 7100 },
  { month: 'Jul', revenue: 8500 },
  { month: 'Aug', revenue: 9200 },
  { month: 'Sep', revenue: 10100 },
  { month: 'Oct', revenue: 11200 },
  { month: 'Nov', revenue: 12400 },
  { month: 'Dec', revenue: 13800 },
]

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

export function RevenueChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Subscription Bar Chart</CardTitle>
        <CardDescription>Daily Subscription collection from user subscriptions.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={data}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="revenue" fill="var(--chart-5)" radius={6} width={12} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
