"use client";

import { motion } from "motion/react";
import MainGridCfg from "@/models/main-grid-cfg";
import ApiService from "@/services/api";
import houseCnsmp from "@/models/house-cnsmp";
import { AxisChart, AxisChartType } from "@/components/axis-chart";
import useSWR from "swr";
import CardTabs from "@/components/card-tabs";
import { useCurrentHouseId, useDataSizeLimit } from "@/extensions/request";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import EnergyPieChart from "@/components/pie-chart";

export default function Trading() {
  const { data: houseCnsmp } = useSWR<houseCnsmp[]>(
    ApiService.buildGetHouseCnsmpUri(useCurrentHouseId(), useDataSizeLimit()),
  );
  const { data: mainGridCfg } = useSWR<MainGridCfg>(
    ApiService.buildGetMainGridCfgUri(),
  );
  const { data: simCfg } = useSWR(ApiService.buildGetSimCfgUri());

  const offset = 18;
  let timeTicks = [...Array.from(Array(24).keys()).reverse()];
  timeTicks = [...timeTicks.slice(offset), ...timeTicks.slice(0, offset)];

  function mapToMainGridCnsmpData() {
    return (
      houseCnsmp?.map((item) => {
        return {
          dateTime: item.consumeTime,
          data: item.mainGridConsumeAmount,
        };
      }) ?? []
    );
  }

  function mapToOnPeakCnsmpData() {
    return (
      houseCnsmp?.map((item) => {
        return {
          dateTime: item.consumeTime,
          data: item.mainGridOnPeakConsumeAmount,
        };
      }) ?? []
    );
  }

  function mapToMidPeakCnsmpData() {
    return (
      houseCnsmp?.map((item) => {
        return {
          dateTime: item.consumeTime,
          data: item.mainGridMidPeakConsumeAmount,
        };
      }) ?? []
    );
  }

  function mapToOffPeakCnsmpData() {
    return (
      houseCnsmp?.map((item) => {
        return {
          dateTime: item.consumeTime,
          data: item.mainGridOffPeakConsumeAmount,
        };
      }) ?? []
    );
  }

  return (
    <motion.div
      className="grid grid-cols-2 gap-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <CardTabs
        titles={["Main grid unclassified usage", "Main grid classified usage"]}
        descs={"Main grid real-time usage level"}
        tabKeys={["unclas", "clas"]}
        tabLabels={["Unclassified", "Classified"]}
        tabContents={[
          <AxisChart
            key={0}
            data={[mapToMainGridCnsmpData()]}
            labels={["Total"]}
            colors={["--power-cnsmp"]}
            chartType={AxisChartType.Line}
          />,
          <AxisChart
            key={1}
            data={[
              mapToOnPeakCnsmpData(),
              mapToMidPeakCnsmpData(),
              mapToOffPeakCnsmpData(),
            ]}
            labels={["On-peak", "Mid-peak", "Off-peak"]}
            colors={["--peak-on", "--peak-mid", "--peak-off"]}
            chartType={AxisChartType.Area}
          />,
        ]}
      />
      <Card className="col-span-full">
        <CardHeader>
          <CardTitle>Electricity time-of-use price periods</CardTitle>
          <CardDescription>Current time-of-use price periods</CardDescription>
        </CardHeader>
        <CardContent>
          <EnergyPieChart
            cfgLabels={timeTicks.map((key) => {
              const hour = key;
              let label = '';
              if (mainGridCfg?.onPeakHour.indexOf(hour) !== -1) {
                label = "On-peak";
              } else if (mainGridCfg?.midPeakHour.indexOf(hour) !== -1) {
                label = "Mid-peak";
              } else if (mainGridCfg?.offPeakHour.indexOf(hour) !== -1) {
                label = "Off-peak";
              }
              return label;
            })}
            colors={timeTicks
              .map((key) => {
                const hour = Number(key);
                let color = "--foreground";
                if (mainGridCfg?.onPeakHour.indexOf(hour) !== -1) {
                  color = "--peak-on";
                } else if (mainGridCfg?.midPeakHour.indexOf(hour) !== -1) {
                  color = "--peak-mid";
                } else if (mainGridCfg?.offPeakHour.indexOf(hour) !== -1) {
                  color = "--peak-off";
                }
                return color;
              })}
            dataValues={timeTicks.map(() => 1)}
            itemFormatter={(value) => `${value} o'clock`}
          />
        </CardContent>
      </Card>
    </motion.div>
  );
}
