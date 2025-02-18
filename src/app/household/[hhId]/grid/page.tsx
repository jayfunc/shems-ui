"use client";

import UotPriceChart from "../grid/uot-price-chart";
import { motion } from "motion/react";
import MainGridCfg from "@/models/main-grid-cfg";
import ApiService from "@/services/api";
import houseCnsmp from "@/models/house-cnsmp";
import { AxisChart, AxisChartType } from "@/components/axis-chart";
import useSWR from "swr";
import CardTabs from "@/components/card-tabs";
import { useCurrentHouseId, useDataSizeLimit } from "@/extensions/request";

export default function Trading() {
  const { data: houseCnsmp } = useSWR<houseCnsmp[]>(
    ApiService.buildGetHouseCnsmpUri(useCurrentHouseId(), useDataSizeLimit()),
  );
  const { data: mainGridCfg } = useSWR<MainGridCfg>(
    ApiService.buildGetMainGridCfgUri(),
  );

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
            labels={["On-peak"]}
            colors={[1]}
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
            colors={[2, 3, 4]}
            chartType={AxisChartType.Area}
          />,
        ]}
      />
      <UotPriceChart mainGridCfg={mainGridCfg} />
    </motion.div>
  );
}
