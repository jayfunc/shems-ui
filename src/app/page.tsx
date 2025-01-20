"use client"

import { Battery, BatteryCharging, BatteryFull, BatteryLow, BatteryMedium, BatteryMediumIcon, Home, Sun, UtilityPole, Wind, Zap } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { motion } from "motion/react"
import SettingsService from "./services/settings"

const energyData = [
  { time: "00:00", production: 0, consumption: 2, storage: 80 },
  { time: "04:00", production: 0, consumption: 1.8, storage: 78 },
  { time: "08:00", production: 4, consumption: 3.5, storage: 82 },
  { time: "12:00", production: 7, consumption: 4.2, storage: 85 },
  { time: "16:00", production: 5, consumption: 4.8, storage: 83 },
  { time: "20:00", production: 1, consumption: 3.2, storage: 81 },
]

const draw = {
  hidden: { pathLength: 0, opacity: 1 },
  visible: (i: number) => {
    const delay = i;
    return {
      pathLength: [0, .2, .4, .6, .8, 1],
      pathOffset: [0, .2, .4, .6, .8, 1],
      opacity: [0, .5, 1, 1, .5, 0],
      transition: {
        pathLength: {
          delay,
          times: [0, .2, .4, .6, .8, 1],
          duration: 3,
          ease: "linear",
          repeat: Infinity,
        },
        pathOffset: {
          delay,
          times: [0, .2, .4, .6, .8, 1],
          duration: 3,
          ease: "linear",
          repeat: Infinity,
        },
        opacity: {
          delay,
          times: [0, .2, .4, .6, .8, 1],
          duration: 3,
          ease: "linear",
          repeat: Infinity,
        },
      },
    }
  },
}

const shape: React.CSSProperties = {
  strokeWidth: 10,
  strokeLinecap: "round",
  fill: "transparent",
};

function EnergyCard({ title, subtitle, desc, icon }: { title: string, subtitle: string, desc: string, icon: React.ReactNode }) {
  return (
    <Card className="flex flex-row items-center justify-between col-span-2">
      <div>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{subtitle}</div>
          <p className="text-xs text-muted-foreground">+{desc}</p>
        </CardContent>
      </div>
      <div className="h-16 w-16 mr-4" >
        {icon}
      </div>
    </Card>
  );
}

function EnergyChart() {
  return (
    <Card className="col-span-full mt-4">
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
  );
}

export default function Dashboard() {
  return (
    <motion.div className="grid grid-cols-5" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <EnergyCard title="Solar energy" subtitle="4.2 kWh" desc="+20% from last hour" icon={<Sun className="h-full w-full text-muted-foreground" />} />
      <motion.svg initial="hidden" animate="visible" className="col-span-1 stroke-gray-300">
        <motion.line x1="-20" y1="75" x2="250" y2="75" variants={draw} custom={0} style={shape} />
      </motion.svg>
      <EnergyCard title="House consumption" subtitle="3.8 kWh" desc="-5% from last hour" icon={<Home className="h-full w-full text-muted-foreground" />} />
      <motion.svg initial="hidden" animate="visible" className="col-span-2 stroke-sky-300">
        <motion.line x1="250" y1="-10" x2="250" y2="145" variants={draw} custom={0} style={shape} />
      </motion.svg>
      <motion.svg initial="hidden" animate="visible" className="col-span-1 stroke-red-300">
        <motion.line x1="0" y1="150" x2="250" y2="0" variants={draw} custom={0} style={shape} />
      </motion.svg>
      <motion.svg initial="hidden" animate="visible" className="col-span-2 stroke-violet-300">
        <motion.line x1="250" y1="155" x2="250" y2="0" variants={draw} custom={0} style={shape} />
      </motion.svg>
      <EnergyCard title="Battery storage" subtitle="82%" desc="4.1 kWh available" icon={
        <div className="relative">
          <Battery className="h-full w-full text-muted-foreground" />
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }} >
            <BatteryCharging className="h-full w-full text-muted-foreground absolute top-0" />
          </motion.div>
        </div>
      } />
      <div className="col-span-1" />
      <EnergyCard title="Grid" subtitle="4.2 kWh" desc="+20% from last hour" icon={<UtilityPole className="h-full w-full text-muted-foreground" />} />
      <EnergyChart />
    </motion.div>

  )
}