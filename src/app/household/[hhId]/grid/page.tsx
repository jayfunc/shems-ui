"use client";

import UotPriceChart from "../grid/uot-price-chart";
import {
  autoRefreshInterval,
  chartMaxPoints,
  routing,
} from "@/constants/constants";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import MainGridCfg from "@/models/main-grid-cfg";
import ApiUriBuilder from "@/services/api";
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import houseCnsmp from "@/models/house-cnsmp";
import {
  AxisChart,
  AxisChartType,
  InputAxisChartDataProps,
} from "@/components/axis-chart";
import useSWR from "swr";

export default function Trading() {
  const hhId = parseInt(
    usePathname()
      .replace(routing.household, "")
      .replace(routing.trading, "")
      .replaceAll("/", ""),
  );
  const {data: houseCnsmp} = useSWR<houseCnsmp[]>(ApiUriBuilder.buildGetHouseCnsmpUri(hhId));
  const {data: mainGridCfg} = useSWR<MainGridCfg>(ApiUriBuilder.buildGetMainGridCfgUri());

  function mapToMainGridCnsmpData() {
    return houseCnsmp?.map((item) => {
      return {
        dateTime: item.consumeTime,
        data: item.mainGridConsumeAmount,
      };
    }) ?? [];
  }

  function mapToOnPeakCnsmpData() {
    return houseCnsmp?.map((item) => {
      return {
        dateTime: item.consumeTime,
        data: item.mainGridOnPeakConsumeAmount,
      };
    }) ?? [];
  }

  function mapToMidPeakCnsmpData() {
    return houseCnsmp?.map((item) => {
      return {
        dateTime: item.consumeTime,
        data: item.mainGridMidPeakConsumeAmount,
      };
    }) ?? [];
  }

  function mapToOffPeakCnsmpData() {
    return houseCnsmp?.map((item) => {
      return {
        dateTime: item.consumeTime,
        data: item.mainGridOffPeakConsumeAmount,
      };
    }) ?? [];
  }

  return (
    <motion.div
      className="grid grid-cols-2 gap-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <Tabs defaultValue="unclas" className="col-span-full">
        <Card>
          <CardHeader>
            <CardTitle className="flex flex-row items-center">
              <TabsContent value="unclas">
                Main grid unclassified usage
              </TabsContent>
              <TabsContent value="clas">Main grid classified usage</TabsContent>
              <div className="flex-1" />
              <TabsList>
                <TabsTrigger value="unclas">Unclassified</TabsTrigger>
                <TabsTrigger value="clas">Classified</TabsTrigger>
              </TabsList>
            </CardTitle>
            <CardDescription>Main grid real-time usage level</CardDescription>
          </CardHeader>
          <CardContent>
            <TabsContent value="unclas">
              <AxisChart
                data={[mapToMainGridCnsmpData()]}
                labels={["On-peak"]}
                colors={[1]}
                chartType={AxisChartType.Line}
              />
            </TabsContent>
            <TabsContent value="clas">
              <AxisChart
                data={[mapToOnPeakCnsmpData(), mapToMidPeakCnsmpData(), mapToOffPeakCnsmpData()]}
                labels={["On-peak", "Mid-peak", "Off-peak"]}
                colors={[2, 3, 4]}
                chartType={AxisChartType.Area}
              />
            </TabsContent>
          </CardContent>
        </Card>
      </Tabs>

      <UotPriceChart mainGridCfg={mainGridCfg} />
    </motion.div>
  );
}
