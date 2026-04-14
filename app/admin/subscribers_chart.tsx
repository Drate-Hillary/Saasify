"use client"

import { TrendingUp } from "lucide-react"
import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  type ChartConfig,
} from "@/components/ui/chart"

// 1. Define the props to accept data from your database/parent component
interface SubscribersChartProps {
  activeUsers: number
  inactiveUsers: number
}

// 2. Update the config to match your new categories
const chartConfig = {
  users: {
    label: "Users",
  },
  active: {
    label: "Active",
    color: "hsl(var(--chart-1))", // Adjust to your theme's active color
  },
  inactive: {
    label: "Inactive",
    color: "hsl(var(--chart-2))", // Adjust to your theme's inactive color
  },
} satisfies ChartConfig

export function SubscribersChart({ activeUsers = 0, inactiveUsers = 0 }: SubscribersChartProps) {
  const totalUsers = activeUsers + inactiveUsers

  // 3. Populate chartData dynamically based on the props
  const chartData = [
    { 
      status: "inactive", 
      users: inactiveUsers, 
      fill: "var(--color-inactive)" 
    },
    { 
      status: "active", 
      users: activeUsers, 
      fill: "var(--color-active)" 
    },
  ]

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>User Status Distribution</CardTitle>
        <CardDescription>Active vs Inactive Subscribers</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-63"
        >
          <RadialBarChart
            data={chartData}
            innerRadius={50}
            outerRadius={100}
            barSize={15} // Adjusts the thickness of the rings
          >
            {/* Removed the static endAngle so the rings scale proportionally */}
            <RadialBar 
              dataKey="users" 
              background 
              cornerRadius={10} 
            />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-4xl font-bold"
                        >
                          {totalUsers.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Total Users
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </PolarRadiusAxis>
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}