"use client";

import { Battery, Home, PlugZap, Sun, Unplug } from "lucide-react";
import ApiService from "@/services/api";import LocStor from "@/models/loc-stor";
import EnergyCard from "./energy-card";
import { motion } from "motion/react";
import energyUnitConverter from "@/extensions/energy-unit-converter";
import MainGridUsageChart from "./main-grid-usage-chart";
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
import routing from "@/constants/routing";
import CardTabs from "@/components/card-tabs";
import { useCurrentHouseId, useDataSizeLimit } from "@/extensions/request";

function formatDeltaDesc(delta?: number): string {
  return `${delta !== undefined && !Number.isNaN(delta) && delta >= 0 ? "+" : ""}${energyUnitConverter.formatInStringWithUnit(delta)} from last hour`;
}

export default function Dashboard() {
  const houseId = useCurrentHouseId();
  const dataSizeLimit = useDataSizeLimit();

  const { data: houseCnsmp } = useSWR<HouseCnsmp[]>(
    ApiService.buildGetHouseCnsmpUri(houseId, dataSizeLimit),
  );
  const { data: houseCnsmpPred } = useSWR<HouseCnsmpPred[]>(
    ApiService.buildGetHouseCnsmpPredUri(houseId, dataSizeLimit),
  );

  const { data: houseGen } = useSWR<HouseGen[]>(
    ApiService.buildGetHouseGenUri(houseId, dataSizeLimit),
  );
  const { data: houseGenPred } = useSWR<HouseGenPred[]>(
    ApiService.buildGetHouseGenPredUri(houseId, dataSizeLimit),
  );

  const { data: locStor } = useSWR<LocStor>(
    ApiService.buildGetLocStorUri(houseId),
  );

  function mapToHouseCnsmpData(): InputAxisChartDataProps[] {
    return (
      houseCnsmp?.map((item) => {
        return {
          dateTime: item.consumeTime,
          data: item.totalConsumeAmount,
        };
      }) ?? []
    );
  }

  function mapToHouseGenData(): InputAxisChartDataProps[] {
    return (
      houseGen?.map((item) => {
        return {
          dateTime: item.generateTime,
          data: item.powerAmount,
        };
      }) ?? []
    );
  }

  function mapToHouseCnsmpPredData(): InputAxisChartDataProps[] {
    return (
      houseCnsmpPred?.map((item) => {
        return {
          dateTime: item.predictTime,
          data:
            item.airConditioner +
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
      }) ?? []
    );
  }

  function mapToHouseGenPredData(): InputAxisChartDataProps[] {
    return (
      houseGenPred?.map((item) => {
        return {
          dateTime: item.predictTime,
          data: item.solar,
        };
      }) ?? []
    );
  }

  function mapToSolarCnsmpData(): InputAxisChartDataProps[] {
    return (
      houseCnsmp?.map((item) => {
        return {
          dateTime: item.consumeTime,
          data: item.solarPanelConsumeAmount,
        };
      }) ?? []
    );
  }

  function mapToBatteryCnsmpData(): InputAxisChartDataProps[] {
    return (
      houseCnsmp?.map((item) => {
        return {
          dateTime: item.consumeTime,
          data: item.powerStorageConsumeAmount,
        };
      }) ?? []
    );
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
        desc={formatDeltaDesc(
          (mapToHouseGenData().at(-1)?.data ?? NaN) -
            (mapToHouseGenData().at(-2)?.data ?? NaN),
        )}
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
                  colors={["--power-cnsmp"]}
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
        desc={formatDeltaDesc(
          (mapToHouseCnsmpData().at(-1)?.data ?? NaN) -
            (mapToHouseCnsmpData().at(-2)?.data ?? NaN),
        )}
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
                  colors={["--power-cnsmp"]}
                  chartType={AxisChartType.Line}
                />
              </div>
            }
          />
        }
      />

      <MainGridUsageChart houseId={houseId} />

      <CardTabs
        titles={[
          "House energy consumption and generation",
          "House generation energy with forcast",
          "House consumption energy with forcast",
        ]}
        descs={`${useDataSizeLimit()}-hour line chart`}
        tabKeys={["gen-cnsmp", "gen-forcast", "cnsmp-forcast"]}
        tabLabels={[
          "Generation w/ consumption",
          "Generation w/ forcast",
          "Consumption w/ forcast",
        ]}
        tabContents={[
          <AxisChart
            key={0}
            data={[mapToHouseCnsmpData(), mapToHouseGenData()]}
            labels={["Consumption", "Generation"]}
            colors={["--power-cnsmp", "--power-gen"]}
            chartType={AxisChartType.Line}
          />,
          <AxisChart
            key={1}
            data={[mapToHouseGenData(), mapToHouseGenPredData()]}
            labels={["Generation", "Forcast"]}
            colors={["--power-gen", "--power-gen-pred"]}
            chartType={AxisChartType.Line}
          />,
          <AxisChart
            key={2}
            data={[mapToHouseCnsmpData(), mapToHouseCnsmpPredData()]}
            labels={["Consumption", "Forcast"]}
            colors={["--power-cnsmp", "--power-cnsmp-pred"]}
            chartType={AxisChartType.Line}
          />,
        ]}
      />
    </motion.div>
  );
}
