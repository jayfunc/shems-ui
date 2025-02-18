"use client";

import { Battery, Home, PlugZap, Sun, Unplug } from "lucide-react";
import { useEffect, useState } from "react";
import ApiUriBuilder from "@/services/api";
import { usePathname } from "next/navigation";
import {
  autoRefreshInterval,
  chartMaxPoints,
  routing,
} from "@/constants/constants";
import LocStor from "@/models/loc-stor";
import EnergyCard from "./energy-card";
import { motion } from "motion/react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import energyUnitConverter from "@/extensions/energy-unit-converter";
import MainGridUsageChart from "./main-grid-usage-chart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ScrollableDrawer from "@/components/scrollable-drawer";
import {
  AxisChart,
  AxisChartType,
  InputAxisChartDataProps,
} from "@/components/axis-chart";
import HouseCnsmp from "@/models/house-cnsmp";
import useSWR from "swr";
import HouseCnsmpPred from "@/models/house-cnsmp-pred";
import HouseGenPred from "@/models/house-gen-pred";
import HouseGen from "@/models/house-gen";

function formatDeltaDesc(delta?: number): string {
  return `${delta !== undefined && !Number.isNaN(delta) && delta >= 0 ? "+" : ""}${energyUnitConverter.formatInStringWithUnit(delta)} from last hour`;
}

export default function Dashboard() {
  const hhId = parseInt(
    usePathname()
      .replace(routing.household, "")
      .replace(routing.dashboard, "")
      .replaceAll("/", ""),
  );

  const { data: houseCnsmp } = useSWR<HouseCnsmp[]>(ApiUriBuilder.buildGetHouseCnsmpUri(hhId));
  const { data: houseCnsmpPred } = useSWR<HouseCnsmpPred[]>(ApiUriBuilder.buildGetHouseCnsmpPredUri(hhId));

  const { data: houseGen } = useSWR<HouseGen[]>(ApiUriBuilder.buildGetHouseGenUri(hhId));
  const { data: houseGenPred } = useSWR<HouseGenPred[]>(ApiUriBuilder.buildGetHouseGenPredUri(hhId));

  const { data: locStor } = useSWR<LocStor>(ApiUriBuilder.buildGetLocStorUri(hhId));

  function mapToHouseCnsmpData(): InputAxisChartDataProps[] {
    return houseCnsmp?.map((item) => {
      return {
        dateTime: item.consumeTime,
        data: item.totalConsumeAmount,
      };
    }) ?? [];
  }

  function mapToHouseGenData(): InputAxisChartDataProps[] {
    return houseGen?.map((item) => {
      return {
        dateTime: item.generateTime,
        data: item.powerAmount,
      };
    }) ?? [];
  }

  function mapToHouseCnsmpPredData(): InputAxisChartDataProps[] {
    return houseCnsmpPred?.map((item) => {
      return {
        dateTime: item.predictTime,
        data: item.airConditioner +
          item.computer +
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
          item.wineCellar,
      };
    }) ?? [];
  }

  function mapToHouseGenPredData(): InputAxisChartDataProps[] {
    return houseGenPred?.map((item) => {
      return {
        dateTime: item.predictTime,
        data: item.solar,
      };
    }) ?? [];
  }

  function mapToSolarCnsmpData(): InputAxisChartDataProps[] {
    return houseCnsmp?.map((item) => {
      return {
        dateTime: item.consumeTime,
        data: item.solarPanelConsumeAmount,
      };
    }) ?? [];
  }

  function mapToBatteryCnsmpData(): InputAxisChartDataProps[] {
    return houseCnsmp?.map((item) => {
      return {
        dateTime: item.consumeTime,
        data: item.powerStorageConsumeAmount,
      };
    }) ?? [];
  }

  return (
    <motion.div
      className="grid grid-cols-4 gap-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <EnergyCard
        title="Solar generation"
        subtitle={`${energyUnitConverter.formatInStringWithUnit(mapToHouseGenData().at(-1)?.data)}`}
        desc={formatDeltaDesc((mapToHouseGenData().at(-1)?.data ?? NaN) - (mapToHouseGenData().at(-2)?.data ?? NaN))}
        icon={<Sun className="text-muted-foreground" />}
        actionArea={
          <ScrollableDrawer
            stretchToWidth={true}
            title="Solar panel usage"
            content={
              <div className="flex flex-col gap-2 p-6">
                <AxisChart
                  data={[mapToSolarCnsmpData()]}
                  labels={["Solar usage"]}
                  colors={[1]}
                  chartType={AxisChartType.Line}
                />
              </div>
            }
          />
        }
      />

      <EnergyCard
        title="House consumption"
        subtitle={`${energyUnitConverter.formatInStringWithUnit(mapToHouseCnsmpData().at(-1)?.data)}`}
        desc={formatDeltaDesc((mapToHouseCnsmpData().at(-1)?.data ?? NaN) - (mapToHouseCnsmpData().at(-2)?.data ?? NaN))}
        icon={<Home className="text-muted-foreground" />}
      />

      <EnergyCard
        title="Battery storage"
        subtitle={`${locStor === undefined ? "-" : `${Math.floor((locStor.currentPowerAmount / locStor.capacity) * 100)}`} %`}
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
                  <div>
                    {energyUnitConverter.formatInStringWithUnit(
                      locStor?.powerInput,
                    )}
                  </div>
                </div>
                <div className="flex flex-row gap-2">
                  <Unplug />
                  <div className="font-bold">Discharging power</div>
                  <div className="flex-1" />
                  <div>
                    {energyUnitConverter.formatInStringWithUnit(
                      locStor?.powerOutput,
                    )}
                  </div>
                </div>
                <AxisChart
                  data={[mapToBatteryCnsmpData()]}
                  labels={["Battery usage"]}
                  colors={[1]}
                  chartType={AxisChartType.Line}
                />
              </div>
            }
          />
        }
      />

      <MainGridUsageChart hhId={hhId} />

      <Tabs defaultValue="gen-cnsmp" className="col-span-full">
        <Card>
          <CardHeader>
            <CardTitle className="flex flex-row items-center">
              <TabsContent value="gen-cnsmp">
                House energy consumption and generation
              </TabsContent>
              <TabsContent value="gen-forcast">
                House generation energy with forcast
              </TabsContent>
              <TabsContent value="cnsmp-forcast">
                House consumption energy with forcast
              </TabsContent>
              <div className="flex-1" />
              <TabsList>
                <TabsTrigger value="gen-cnsmp">
                  Generation w/ consumption
                </TabsTrigger>
                <TabsTrigger value="gen-forcast">
                  Generation w/ forcast
                </TabsTrigger>
                <TabsTrigger value="cnsmp-forcast">
                  Consumption w/ forcast
                </TabsTrigger>
              </TabsList>
            </CardTitle>
            <CardDescription>{`${chartMaxPoints}-hours line chart`}</CardDescription>
          </CardHeader>
          <CardContent>
            <TabsContent value="gen-cnsmp">
              <AxisChart
                data={[mapToHouseCnsmpData(), mapToHouseGenData()]}
                labels={["Consumption", "Generation"]}
                colors={[1, 2]}
                chartType={AxisChartType.Line}
              />
            </TabsContent>
            <TabsContent value="gen-forcast">
              <AxisChart
                data={[mapToHouseGenData(), mapToHouseGenPredData()]}
                labels={["Generation", "Generation forcast"]}
                colors={[2, 3]}
                chartType={AxisChartType.Line}
              />
            </TabsContent>
            <TabsContent value="cnsmp-forcast">
              <AxisChart
                data={[mapToHouseCnsmpData(), mapToHouseCnsmpPredData()]}
                labels={["Consumption", "Consumption forcast"]}
                colors={[1, 4]}
                chartType={AxisChartType.Line}
              />
            </TabsContent>
          </CardContent>
        </Card>
      </Tabs>
    </motion.div>
  );
}
