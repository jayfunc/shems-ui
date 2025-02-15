"use client";

import { Battery, BatteryCharging, Home, Info, PlugZap, Sun, Unplug } from "lucide-react";
import { useEffect, useState } from "react";
import HseCnsmp from "@/models/hse-cnsmp";
import ApiService from "@/services/api";
import { usePathname } from "next/navigation";
import {
  autoRefreshInterval,
  chartMaxPoints,
  routing,
} from "@/constants/constants";
import HseCnsmpPred from "@/models/hse-cnsmp-pred";
import HseGen from "@/models/hse-gen";
import HseGenPred from "@/models/hse-gen-pred";
import LocStor from "@/models/loc-stor";
import Hse, { HouseholdType } from "@/models/hse";
import EnergyCard from "./energy-card";
import { motion } from "motion/react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { EnergyLineChart } from "@/components/line-chart";
import energyUnitConverter from "@/extensions/energy-unit-converter";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import formatText from "@/extensions/string";
import MainGridUsageChart from "./main-grid-usage-chart";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import ScrollableDrawer from "@/components/scrollable-drawer";

function formatDeltaDesc(delta?: number): string {
  return `${(delta !== undefined && !Number.isNaN(delta) && delta >= 0) ? "+" : ""}${energyUnitConverter.formatInStringWithUnit(delta)} from last hour`;
}

export default function Dashboard() {

  // House energy consumption (appliances)
  const [hseCnsmp, setHseCnsmp] = useState<HseCnsmp[]>([]);
  const [hseCnsmpPred, setHseCnsmpPred] = useState<HseCnsmpPred[]>([]);
  const [hseCnsmpDelta, setHseCnsmpDelta] = useState<number>();

  // House energy generation (solar)
  const [hseGen, setHseGen] = useState<HseGen[]>([]);
  const [hseGenPred, setHseGenPred] = useState<HseGenPred[]>([]);
  const [hseGenDelta, setHseGenDelta] = useState<number>();

  // Local energy storage (battery)
  const [locStor, setLocStor] = useState<LocStor>();

  // Current house
  const [currentHouse, setCurrentHouse] = useState<Hse>();

  const hhId = parseInt(
    usePathname()
      .replace(routing.household, "")
      .replace(routing.dashboard, "")
      .replaceAll("/", ""),
  );

  useEffect(() => {
    ApiService.getHse(hhId).then((ret) => {
      setCurrentHouse(ret.data);
    });

    const fetchData = async () => {
      // House energy consumption
      await ApiService.getHseCnsmp(hhId).then((ret) => {
        setHseCnsmp(ret.data);
        // Calculate delta
        if (ret.data.length > 1) {
          const last = ret.data[ret.data.length - 1]?.data;
          const secondLast = ret.data[ret.data.length - 2]?.data;
          console.log(last, secondLast);
          if (last != null && secondLast != null) {
            setHseCnsmpDelta(last - secondLast);
          } else {
            setHseCnsmpDelta(Number.NaN);
          }
        } else {
          setHseCnsmpDelta(Number.NaN);
        }
      });

      // House energy consumption prediction
      // ApiService.getHseCnsmpPred(hhId).then((ret) => {
      //   setHseCnsmpPred(ret.data);
      // });

      // House energy generation
      await ApiService.getHseGen(hhId).then((ret) => {
        setHseGen(ret.data);
        // Calculate delta
        if (ret.data.length > 1) {
          const last = ret.data.at(-1)?.data;
          const secondLast = ret.data.at(-2)?.data;
          if (last != null && secondLast != null) {
            setHseGenDelta(last - secondLast);
          } else {
            setHseGenDelta(Number.NaN);
          }
        } else {
          setHseGenDelta(Number.NaN);
        }
      });

      // House energy generation prediction
      await ApiService.getHseGenPred(hhId).then((ret) => {
        setHseGenPred(ret.data);
      });

      // Local energy storage
      await ApiService.getLocStor(hhId).then((ret) => {
        setLocStor(ret.data);
      });
    };

    fetchData();

    const interval = setInterval(async () => {
      await fetchData();
    }, autoRefreshInterval);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div className="grid grid-cols-4 gap-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <EnergyCard
        title="Current generation"
        subtitle={
          `${energyUnitConverter.formatInStringWithUnit(hseGen.at(-1)?.data)}`
        }
        desc={formatDeltaDesc(hseGenDelta)}
        icon={<Sun className="text-muted-foreground" />}
      />

      <EnergyCard
        title="Current consumption"
        subtitle={
          `${energyUnitConverter.formatInStringWithUnit(hseCnsmp.at(-1)?.data)}`
        }
        desc={formatDeltaDesc(hseCnsmpDelta)}
        icon={<Home className="text-muted-foreground" />}
      />

      <EnergyCard
        title="Battery storage"
        subtitle={
          `${locStor?.currentPowerAmountPercentage ?? '-'} %`
        }
        desc={`${energyUnitConverter.formatInStringWithUnit(locStor?.currentPowerAmount)} /
        ${energyUnitConverter.formatInStringWithUnit(locStor?.capacity)}`}
        icon={<Battery className="text-muted-foreground" />}
        actionArea={
          <ScrollableDrawer
            title="Battery properties detail"
            content={
              <div className="flex flex-col gap-2 p-6">
                <div className="flex flex-row gap-2">
                  <PlugZap />
                  <div className="font-bold">Charging power</div>
                  <div className="flex-1" />
                  <div>{energyUnitConverter.formatInStringWithUnit(locStor?.powerInput)}</div>
                </div>
                <div className="flex flex-row gap-2">
                  <Unplug />
                  <div className="font-bold">Discharging power</div>
                  <div className="flex-1" />
                  <div>{energyUnitConverter.formatInStringWithUnit(locStor?.powerOutput)}</div>
                </div>
              </div>
            } />
        }
      />

      <MainGridUsageChart hhId={hhId} />

      <Card className="col-span-full">
        <Tabs defaultValue="gen-cnsmp">
          <div className="flex flex-row items-center mt-6 mr-6">
            <div className="flex-1" />
            <TabsList>
              <TabsTrigger value="gen-cnsmp">Generation w/ consumption</TabsTrigger>
              <TabsTrigger value="gen-forcast">Generation w/ forcast</TabsTrigger>
              <TabsTrigger value="cnsmp-forcast">Consumption w/ forcast</TabsTrigger>
            </TabsList>
          </div>
          <div className="-mt-16">
            <TabsContent value="gen-cnsmp">
              <CardHeader>
                <CardTitle>House overall energy</CardTitle>
                <CardDescription>{`${chartMaxPoints}-hour energy real-time consumption and generation level`}</CardDescription>
              </CardHeader>
              <CardContent>
                <EnergyLineChart data={[hseCnsmp, hseGen]} labels={["Consumption", "Generation"]} colors={[1, 2]} />
              </CardContent>
            </TabsContent>
            <TabsContent value="gen-forcast">
              <CardHeader>
                <CardTitle>House generation energy</CardTitle>
                <CardDescription>{`${chartMaxPoints}-hour energy generation with forcast level`}</CardDescription>
              </CardHeader>
              <CardContent>
                <EnergyLineChart data={[hseGen, hseGenPred]} labels={["Generation", "Generation forcast"]} colors={[2, 3]} />
              </CardContent>
            </TabsContent>
            <TabsContent value="cnsmp-forcast">
              <CardHeader>
                <CardTitle>House consumption energy</CardTitle>
                <CardDescription>{`${chartMaxPoints}-hour energy consumption with forcast level`}</CardDescription>
              </CardHeader>
              <CardContent>
                <EnergyLineChart data={[hseCnsmp, hseCnsmpPred]} labels={["Consumption", "Consumption forcast"]} colors={[1, 4]} />
              </CardContent>
            </TabsContent>
          </div>
        </Tabs>
      </Card>
    </motion.div>
  );
}
