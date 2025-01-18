"use client"

import { TrendingUp } from "lucide-react"
import { Label, Pie, PieChart } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
const chartData = [
  { browser: "Off-peak", visitors: 12, fill: "var(--color-chrome)" },
  { browser: "on-peak-1", visitors: 2, fill: "var(--color-safari)" },
  { browser: "Mid-peak", visitors: 6, fill: "var(--color-firefox)" },
  { browser: "On-peak-2", visitors: 4, fill: "var(--color-edge)" },
]

const chartConfig = {
  chrome: {
    label: "Off-peak",
    color: "hsl(var(--chart-2))",
  },
  safari: {
    label: "On-peak-1",
    color: "hsl(var(--chart-1))",
  },
  firefox: {
    label: "Mid-peak",
    color: "hsl(var(--chart-4))",
  },
  edge: {
    label: "On-peak-2",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

export default function UotPriceChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>X electricity time-of-use price periods</CardTitle>
        <CardDescription>Jan. - Dec. 2025</CardDescription>
      </CardHeader>
      <CardContent className="relative">
        <ChartContainer
          config={chartConfig}
          className="mx-auto max-h-[250px] [&_.recharts-pie-label-text]:fill-foreground"
        >
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Pie data={chartData} dataKey="visitors" nameKey="browser" />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
