"use client";

import { Battery, Home, PlugZap, Sun, Unplug } from "lucide-react";
import { useEffect, useState } from "react";
import ApiService from "@/services/api";
import { usePathname } from "next/navigation";
import {
  autoRefreshInterval,
  chartMaxPoints,
  routing,
} from "@/constants/constants";
import LocStor from "@/models/loc-stor";
import EnergyCard from "./energy-card";
import { motion } from "motion/react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import energyUnitConverter from "@/extensions/energy-unit-converter";
import MainGridUsageChart from "./main-grid-usage-chart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ScrollableDrawer from "@/components/scrollable-drawer";
import { AxisChart, AxisChartType, InputAxisChartDataProps } from "@/components/axis-chart";

function formatDeltaDesc(delta?: number): string {
  return `${(delta !== undefined && !Number.isNaN(delta) && delta >= 0) ? "+" : ""}${energyUnitConverter.formatInStringWithUnit(delta)} from last hour`;
}

export default function Dashboard() {

  // House energy consumption
  const [hseCnsmp, setHseCnsmp] = useState<InputAxisChartDataProps[]>([]);
  const [hseCnsmpPred, setHseCnsmpPred] = useState<InputAxisChartDataProps[]>([]);
  const [hseCnsmpDelta, setHseCnsmpDelta] = useState<number>();

  const [batteryCnsmp, setBatteryCnsmp] = useState<InputAxisChartDataProps[]>([]);
  const [solarCnsmp, setSolarCnsmp] = useState<InputAxisChartDataProps[]>([]);

  // House energy generation (solar)
  const [hseGen, setHseGen] = useState<InputAxisChartDataProps[]>([]);
  const [hseGenPred, setHseGenPred] = useState<InputAxisChartDataProps[]>([]);
  const [hseGenDelta, setHseGenDelta] = useState<number>();

  // Local energy storage (battery)
  const [locStor, setLocStor] = useState<LocStor>();

  const hhId = parseInt(
    usePathname()
      .replace(routing.household, "")
      .replace(routing.dashboard, "")
      .replaceAll("/", ""),
  );

  useEffect(() => {
    const fetchData = async () => {
      // House energy consumption
      await ApiService.getHseCnsmp(hhId).then((ret) => {
        setHseCnsmp(ret.data.map((element) => {
          return {
            dateTime: element.consumeTime,
            data: element.totalConsumeAmount,
          };
        }));
        setBatteryCnsmp(ret.data.map((element) => {
          return {
            dateTime: element.consumeTime,
            data: element.powerStorageConsumeAmount,
          };
        }));
        setSolarCnsmp(ret.data.map((element) => {
          return {
            dateTime: element.consumeTime,
            data: element.solarPanelConsumeAmount,
          };
        }));
        // Calculate delta
        if (ret.data.length > 1) {
          const last = ret.data[ret.data.length - 1]?.totalConsumeAmount;
          const secondLast = ret.data[ret.data.length - 2]?.totalConsumeAmount;
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
      await ApiService.getHseCnsmpPred(hhId).then((ret) => {
        setHseCnsmpPred(ret.data.map((item) => {
          return {
            data: item.computer +
              item.dishwasher +
              item.electricRange1 +
              item.electricRange2 +
              item.fridge1 +
              item.fridge2 +
              item.furnace1 +
              item.furnace2 +
              item.television +
              item.washerAndDryerSet +
              item.waterHeater +
              item.wineCellar +
              item.airConditioner,
            dateTime: item.predictTime,
          }
        }));
      });

      // House energy generation
      await ApiService.getHseGen(hhId).then((ret) => {
        setHseGen(ret.data.map((item) => {
          return {
            data: item.powerAmount,
            dateTime: item.generateTime,
          };
        }));
        // Calculate delta
        if (ret.data.length > 1) {
          const last = ret.data.at(-1)?.powerAmount;
          const secondLast = ret.data.at(-2)?.powerAmount;
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
        setHseGenPred(ret.data.map((item) => {
          return {
            data: item.solar,
            dateTime: item.predictTime,
          }
        }));
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
        title="Solar generation"
        subtitle={
          `${energyUnitConverter.formatInStringWithUnit(hseGen.at(-1)?.data)}`
        }
        desc={formatDeltaDesc(hseGenDelta)}
        icon={<Sun className="text-muted-foreground" />}
        actionArea={
          <ScrollableDrawer
            stretchToWidth={true}
            title="Solar panel usage"
            content={
              <div className="flex flex-col gap-2 p-6">
                <AxisChart data={[solarCnsmp]} labels={["Solar usage"]} colors={[1]} chartType={AxisChartType.Line} />
              </div>
            } />
        }
      />

      <EnergyCard
        title="House consumption"
        subtitle={
          `${energyUnitConverter.formatInStringWithUnit(hseCnsmp.at(-1)?.data)}`
        }
        desc={formatDeltaDesc(hseCnsmpDelta)}
        icon={<Home className="text-muted-foreground" />}
      />

      <EnergyCard
        title="Battery storage"
        subtitle={
          `${locStor === undefined ? '-' : `${Math.floor(locStor.currentPowerAmount / locStor.capacity * 100)}`} %`
        }
        desc={`${energyUnitConverter.formatInStringWithUnit(locStor?.currentPowerAmount)} /
        ${energyUnitConverter.formatInStringWithUnit(locStor?.capacity)}`}
        icon={<Battery className="text-muted-foreground" />}
        actionArea={
          <ScrollableDrawer
            stretchToWidth={true}
            title="Battery usage and properties detail"
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
                <AxisChart data={[batteryCnsmp]} labels={["Battery usage"]} colors={[1]} chartType={AxisChartType.Line} />
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
                <AxisChart data={[hseCnsmp, hseGen]} labels={["Consumption", "Generation"]} colors={[1, 2]} chartType={AxisChartType.Line} />
              </CardContent>
            </TabsContent>
            <TabsContent value="gen-forcast">
              <CardHeader>
                <CardTitle>House generation energy</CardTitle>
                <CardDescription>{`${chartMaxPoints}-hour energy generation with forcast level`}</CardDescription>
              </CardHeader>
              <CardContent>
                <AxisChart data={[hseGen, hseGenPred]} labels={["Generation", "Generation forcast"]} colors={[2, 3]} chartType={AxisChartType.Line} />
              </CardContent>
            </TabsContent>
            <TabsContent value="cnsmp-forcast">
              <CardHeader>
                <CardTitle>House consumption energy</CardTitle>
                <CardDescription>{`${chartMaxPoints}-hour energy consumption with forcast level`}</CardDescription>
              </CardHeader>
              <CardContent>
                <AxisChart data={[hseCnsmp, hseCnsmpPred]} labels={["Consumption", "Consumption forcast"]} colors={[1, 4]} chartType={AxisChartType.Line} />
              </CardContent>
            </TabsContent>
          </div>
        </Tabs>
      </Card>

    </motion.div>
  );
}
