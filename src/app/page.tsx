"use client"

import { Battery, Home, Sun, UtilityPole, Wind } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { motion } from "motion/react"

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

const drawReverse = {
  hidden: { pathLength: 0, opacity: 1 },
  visible: (i: number) => {
    const delay = i;
    return {
      pathLength: [0, .2, .4, .6, .8, 1].reverse(),
      pathOffset: [0, .2, .4, .6, .8, 1].reverse(),
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

export default function Dashboard() {
  return (
    <motion.div className="grid grid-cols-5"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}>
      <Card className="flex flex-row items-center justify-between col-span-2">
        <div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Solar energy</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.2 kWh</div>
            <p className="text-xs text-muted-foreground">+20% from last hour</p>
          </CardContent>
        </div>
        <motion.div className="h-16 w-16 mr-4" animate={{ rotate: 360 }} transition={{ duration: 60, repeat: Infinity }} >
          <Sun className="h-full w-full text-muted-foreground" />
        </motion.div>
      </Card>
      <motion.svg
        initial="hidden"
        animate="visible"
        className="col-span-1"
      >
        <motion.line
          x1="-20"
          y1="40"
          x2="250"
          y2="40"
          variants={draw}
          custom={0}
          style={shape}
          className="stroke-gray-300"
        />
        <motion.rect
          width="140"
          height="140"
          x="130"
          y="90"
          rx="20"
          variants={draw}
          custom={0.5}
          style={shape}
          className="stroke-red-300"
        />
      </motion.svg>
      <Card className="flex flex-row items-center justify-between col-span-2">
        <div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">House consumption</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3.8 kWh</div>
            <p className="text-xs text-muted-foreground">-5% from last hour</p>
          </CardContent>
        </div>
        <motion.div className="h-16 w-16 mr-4" >
          <Home className="h-full w-full text-muted-foreground" />
        </motion.div>
      </Card>
      <motion.svg
        initial="hidden"
        animate="visible"
        className="col-span-2 stroke-sky-300 grid"
      >
        <motion.line
          x1="250"
          y1="-10"
          x2="250"
          y2="145"
          variants={draw}
          custom={0}
          style={shape}
        />
      </motion.svg>
      <motion.svg
        initial="hidden"
        animate="visible"
        className="col-span-1 stroke-red-300 grid"
      >
        <motion.line
          x1="130"
          y1="150"
          x2="130"
          y2="0"
          variants={draw}
          custom={0}
          style={shape}
        />
      </motion.svg>
      <motion.svg
        initial="hidden"
        animate="visible"
        className="col-span-2 stroke-violet-300 grid"
      >
        <motion.line
          x1="250"
          y1="155"
          x2="250"
          y2="0"
          variants={draw}
          custom={0}
          style={shape}
        />
      </motion.svg>
      <Card className="flex flex-row items-center justify-between col-span-2">
        <div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Battery storage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">82%</div>
            <p className="text-xs text-muted-foreground">4.1 kWh available</p>
          </CardContent>
        </div>
        <motion.div className="h-16 w-16 mr-4" >
          <Battery className="h-full w-full text-muted-foreground" />
        </motion.div>
      </Card>
      <motion.svg
        initial="hidden"
        animate="visible"
        className="col-span-1 stroke-red-300"
      >
        <motion.rect
          width="140"
          height="140"
          x="-10"
          y="-65"
          rx="20"
          variants={drawReverse}
          custom={1}
          style={shape}
        />
      </motion.svg>
      <Card className="flex flex-row items-center justify-between col-span-2">
        <div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Grid</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.2 kWh</div>
            <p className="text-xs text-muted-foreground">+20% from last hour</p>
          </CardContent>
        </div>
        <motion.div className="h-16 w-16 mr-4" >
          <UtilityPole className="h-full w-full text-muted-foreground" />
        </motion.div>
      </Card>
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
    </motion.div>

  )
}

{/* <motion.circle
className="circle-path"
cx="100"
cy="100"
r="80"
stroke="black"
variants={draw}
custom={1}
style={shape}
/>
<motion.line
x1="220"
y1="30"
x2="360"
y2="170"
stroke="black"
variants={draw}
custom={2}
style={shape}
/>
 */}