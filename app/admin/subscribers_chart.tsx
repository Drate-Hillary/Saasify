// @/app/admin/subscribers_chart.tsx
"use client";

import * as React from "react";
import { Label, Pie, PieChart } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

interface SubscribersChartProps {
  activeUsers: number;
  inactiveUsers: number;
}

const chartConfig = {
  users: { label: "Users" },
  active: { label: "Active", color: "hsl(var(--chart-1))" },
  inactive: { label: "Inactive", color: "hsl(var(--chart-2))" },
} satisfies ChartConfig;

export function SubscribersChart({
  activeUsers = 0,
  inactiveUsers = 0,
}: SubscribersChartProps) {
  const totalUsers = activeUsers + inactiveUsers;

  // If there is no data, create a fake data point to render a gray placeholder ring
  const chartData =
    totalUsers > 0
      ? [
          { status: "active", users: activeUsers, fill: "var(--chart-5)" },
          { status: "inactive", users: inactiveUsers, fill: "var(--chart-3)" },
        ]
      : [
          { status: "empty", users: 1, fill: "hsl(var(--muted))" }, // Gray placeholder
        ];

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>User Status Distribution</CardTitle>
        <CardDescription>Active vs Inactive Subscribers</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]" // <-- FIXED HEIGHT CLASS HERE
        >
          <PieChart>
            {/* Only show tooltips if we actually have data */}
            {totalUsers > 0 && (
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel nameKey="status" />}
              />
            )}
            <Pie
              data={chartData}
              dataKey="users"
              nameKey="status"
              innerRadius={70}
              strokeWidth={5}
            >
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
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
