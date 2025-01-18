"use client"

import { Battery, Home, Sun, Wind } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import EquipmentService from "./services/equipment"
import { FC } from "react"

const energyData = [
  { time: "00:00", production: 0, consumption: 2, storage: 80 },
  { time: "04:00", production: 0, consumption: 1.8, storage: 78 },
  { time: "08:00", production: 4, consumption: 3.5, storage: 82 },
  { time: "12:00", production: 7, consumption: 4.2, storage: 85 },
  { time: "16:00", production: 5, consumption: 4.8, storage: 83 },
  { time: "20:00", production: 1, consumption: 3.2, storage: 81 },
]

export default function Dashboard() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Current Production</CardTitle>
          <Sun className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">5.2 kW</div>
          <p className="text-xs text-muted-foreground">+20% from last hour</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Current Consumption</CardTitle>
          <Home className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">3.8 kW</div>
          <p className="text-xs text-muted-foreground">-5% from last hour</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Battery Storage</CardTitle>
          <Battery className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">82%</div>
          <p className="text-xs text-muted-foreground">4.1 kWh available</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Grid Balance</CardTitle>
          <Wind className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">+1.4 kW</div>
          <p className="text-xs text-muted-foreground">Selling to grid</p>
        </CardContent>
      </Card>
      <Card className="col-span-full">
        <CardHeader>
          <CardTitle>Energy Overview</CardTitle>
          <CardDescription>24-hour energy production, consumption, and storage levels</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              production: {
                label: "Production",
                color: "hsl(var(--chart-1))",
              },
              consumption: {
                label: "Consumption",
                color: "hsl(var(--chart-2))",
              },
              storage: {
                label: "Storage",
                color: "hsl(var(--chart-3))",
              },
            }}
            className="max-h-[50vh] w-full"
          >
            <AreaChart data={energyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area type="monotone" dataKey="production" stroke="var(--color-production)" fill="var(--color-production)" fillOpacity={0.2} />
              <Area type="monotone" dataKey="consumption" stroke="var(--color-consumption)" fill="var(--color-consumption)" fillOpacity={0.2} />
              <Area type="monotone" dataKey="storage" stroke="var(--color-storage)" fill="var(--color-storage)" fillOpacity={0.2} />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}

