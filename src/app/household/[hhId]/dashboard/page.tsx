"use client"

import { Battery, BatteryCharging, Home, Sun, UtilityPole } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CartesianGrid, LabelList, Line, LineChart, XAxis } from "recharts"
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { motion } from "motion/react"
import { useEffect, useState } from "react"
import HseCnsmp from "@/models/hse-cnsmp"
import ApiService from "@/services/api"
import { usePathname } from "next/navigation"
import { autoRefreshInterval, energyUnit, loadingHint, routing } from "@/constants/routing"
import HseCnsmpPred from "@/models/hse-cnsmp-pred"
import HseGen from "@/models/hse-gen"
import HseGenPred from "@/models/hse-gen-pred"
import LocStor from "@/models/loc-stor"

function EnergyCard({ title, subtitle, delta, icon }: { title: string, subtitle: string, delta?: number, icon: React.ReactNode }) {
  return (
    <Card className="flex flex-row items-center col-span-2">
      <div>
        <CardHeader className="flex flex-row space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{subtitle}</div>
          {
            delta === undefined ?
              null :
              <p className="text-xs text-muted-foreground">{delta >= 0 ? '+' : ''}{delta}{energyUnit} from last hour</p>
          }
        </CardContent>
      </div>
      <div className="flex-1" />
      <div className="h-16 w-16 mr-4" >
        {icon}
      </div>
    </Card>
  );
}

function CnsmpPredChart({ hseCnsmpPred }: { hseCnsmpPred: HseCnsmpPred[] }) {
  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle>House energy consumption forcast</CardTitle>
        <CardDescription>12-hour energy consumption forcast level</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={
            {
              dishwasher: {
                label: "Consumption Prediction",
                color: "hsl(var(--chart-2))",
              }
            }
          }
          className="max-h-[30vh] w-full">
          <LineChart accessibilityLayer
            data={hseCnsmpPred}
            margin={{
              top: 20,
              left: 40,
              right: 40,
            }}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="predictTime"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => new Date(value).toLocaleTimeString()}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Line
              dataKey="dishwasher"
              type="natural"
              stroke="var(--color-dishwasher)"
              strokeWidth={2}
              dot={{
                fill: "var(--color-dishwasher)",
              }}
              activeDot={{
                r: 6,
              }}
            >
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={12}
              />
            </Line>
            <ChartLegend content={<ChartLegendContent />} />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

function CnsmpChart({ hseCnsmps }: { hseCnsmps: HseCnsmp[] }) {
  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle>House energy consumption</CardTitle>
        <CardDescription>12-hour energy consumption level</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={
            {
              totalConsumeAmount: {
                label: "Consumption",
                color: "hsl(var(--chart-1))",
              }
            }
          }
          className="max-h-[30vh] w-full">
          <LineChart accessibilityLayer
            data={hseCnsmps}
            margin={{
              top: 20,
              left: 40,
              right: 40,
            }}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="consumeTime"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => new Date(value).toLocaleTimeString()}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Line
              dataKey="totalConsumeAmount"
              type="natural"
              stroke="var(--color-totalConsumeAmount)"
              strokeWidth={2}
              dot={{
                fill: "var(--color-totalConsumeAmount)",
              }}
              activeDot={{
                r: 6,
              }}
            >
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={12}
              />
            </Line>
            <ChartLegend content={<ChartLegendContent />} />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

function GenChart({ hseGen }: { hseGen: HseGen[] }) {
  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle>Solar energy output</CardTitle>
        <CardDescription>12-hour energy output level</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={
            {
              powerAmount: {
                label: "Generation",
                color: "hsl(var(--chart-4))",
              }
            }
          }
          className="max-h-[30vh] w-full">
          <LineChart accessibilityLayer
            data={hseGen}
            margin={{
              top: 20,
              left: 40,
              right: 40,
            }}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="generateTime"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => new Date(value).toLocaleTimeString()}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Line
              dataKey="powerAmount"
              type="natural"
              stroke="var(--color-powerAmount)"
              strokeWidth={2}
              dot={{
                fill: "var(--color-powerAmount)",
              }}
              activeDot={{
                r: 6,
              }}
            >
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={12}
              />
            </Line>
            <ChartLegend content={<ChartLegendContent />} />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

function GenPredChart({ hseGenPred }: { hseGenPred: HseGenPred[] }) {
  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle>Solar energy output forcast</CardTitle>
        <CardDescription>12-hour energy output forcast level</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={
            {
              solar: {
                label: "Generation Prediction",
                color: "hsl(var(--chart-5))",
              }
            }
          }
          className="max-h-[30vh] w-full">
          <LineChart accessibilityLayer
            data={hseGenPred}
            margin={{
              top: 20,
              left: 40,
              right: 40,
            }}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="predictTime"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => new Date(value).toLocaleTimeString()}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Line
              dataKey="solar"
              type="natural"
              stroke="var(--color-solar)"
              strokeWidth={2}
              dot={{
                fill: "var(--color-solar)",
              }}
              activeDot={{
                r: 6,
              }}
            >
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={12}
              />
            </Line>
            <ChartLegend content={<ChartLegendContent />} />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export default function Dashboard() {

  // House energy consumption (appliances)
  const [hseCnsmp, setHseCnsmp] = useState<HseCnsmp[]>([]);
  const [hseCnsmpPred, setHseCnsmpPred] = useState<HseCnsmpPred[]>([]);
  const [hseCnsmpDelta, setHseCnsmpDelta] = useState<number>(0);

  // House energy generation (solar)
  const [hseGen, setHseGen] = useState<HseGen[]>([]);
  const [hseGenPred, setHseGenPred] = useState<HseGenPred[]>([]);
  const [hseGenDelta, setHseGenDelta] = useState<number>(0);

  // Local energy storage (battery)
  const [locStor, setLocStor] = useState<LocStor>();

  const hhId = parseInt(usePathname().replace(routing.household, "").replace(routing.dashboard, "").replaceAll("/", ""));

  useEffect(() => {
    const fetchData = async () => {
      // House energy consumption
      ApiService.getHseCnsmp(hhId).then((ret) => {
        hseCnsmp.push(ret.data);
        if (hseCnsmp.length >= 12) {
          hseCnsmp.shift();
        }
        setHseCnsmp([...hseCnsmp]);

        if (hseCnsmp.length > 1) {
          setHseCnsmpDelta(hseCnsmp[hseCnsmp.length - 1].totalConsumeAmount - hseCnsmp[hseCnsmp.length - 2].totalConsumeAmount);
        }
      });

      // House energy consumption prediction
      ApiService.getHseCnsmpPred(hhId).then((ret) => {
        hseCnsmpPred.push(ret.data);
        if (hseCnsmpPred.length >= 12) {
          hseCnsmpPred.shift();
        }
        setHseCnsmpPred([...hseCnsmpPred]);
      });

      // House energy generation
      ApiService.getHseGen(hhId).then((ret) => {
        hseGen.push(ret.data);
        if (hseGen.length >= 12) {
          hseGen.shift();
        }
        setHseGen([...hseGen]);

        if (hseGen.length > 1) {
          setHseGenDelta(hseGen[hseGen.length - 1].powerAmount - hseGen[hseGen.length - 2].powerAmount);
        }
      });

      // House energy generation prediction
      ApiService.getHseGenPred(hhId).then((ret) => {
        hseGenPred.push(ret.data);
        if (hseGenPred.length >= 12) {
          hseGenPred.shift();
        }
        setHseGenPred([...hseGenPred]);
      });

      // Local energy storage
      ApiService.getLocStor(hhId).then((ret) => {
        setLocStor(ret.data);
      });
    };

    fetchData();

    const interval = setInterval(() => {
      fetchData();
    }, autoRefreshInterval);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div className="grid grid-cols-4 gap-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>

      <EnergyCard title="Solar energy"
        subtitle={hseGen.length === 0 ? loadingHint : `${hseGen.at(hseGen.length - 1)?.powerAmount}${energyUnit}`}
        delta={hseGenDelta}
        icon={
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 50, repeat: Infinity }} >
            <Sun className="h-full w-full text-muted-foreground" />
          </motion.div>
        } />

      <EnergyCard title="House consumption"
        subtitle={hseCnsmp.length === 0 ? loadingHint : `${hseCnsmp.at(hseCnsmp.length - 1)?.totalConsumeAmount}${energyUnit}`}
        delta={hseCnsmpDelta}
        icon={<Home className="h-full w-full text-muted-foreground" />} />

      <EnergyCard title="Battery storage"
        subtitle={locStor === undefined ? loadingHint : `${Math.floor(locStor.currentPowerAmount / locStor.capacity * 100)}%`}
        icon={
          <div className="relative">
            <Battery className="h-full w-full text-muted-foreground" />
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }} >
              <BatteryCharging className="h-full w-full text-muted-foreground absolute top-0" />
            </motion.div>
          </div>
        } />

      <EnergyCard title="Grid" subtitle="4.2 kWh" icon={<UtilityPole className="h-full w-full text-muted-foreground" />} />

      <CnsmpChart hseCnsmps={hseCnsmp} />
      <CnsmpPredChart hseCnsmpPred={hseCnsmpPred} />

      <GenChart hseGen={hseGen} />
      <GenPredChart hseGenPred={hseGenPred} />

    </motion.div>

  )
}