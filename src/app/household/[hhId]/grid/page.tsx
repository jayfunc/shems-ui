"use client";

import UotPriceChart from "../grid/uot-price-chart";
import MainGridUsageChart from "../dashboard/main-grid-usage-chart";
import {
  autoRefreshInterval,
  chartMaxPoints,
  routing,
} from "@/constants/constants";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import MainGridCfg, { MainGridCfgSignal, MainGridCfgStatus } from "@/models/main-grid-cfg";
import ApiService from "@/services/api";
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EnergyLineChart, InputLineChartDataProps } from "@/components/line-chart";
import hseCnsmp from "@/models/hse-cnsmp";
import hseCnsmpPred from "@/models/hse-cnsmp-pred";
import hseGen from "@/models/hse-gen";
import hseGenPred from "@/models/hse-gen-pred";

export default function Trading() {
  const hhId = parseInt(
    usePathname()
      .replace(routing.household, "")
      .replace(routing.trading, "")
      .replaceAll("/", ""),
  );
  const [mainGridCfg, setMainGridCfg] = useState<MainGridCfg>();
  const [onPeakCnsmp, setOnPeakCnsmp] = useState<InputLineChartDataProps[]>([]);
  const [midPeakCnsmp, setMidPeakCnsmp] = useState<InputLineChartDataProps[]>([]);
  const [offPeakCnsmp, setOffPeakCnsmp] = useState<InputLineChartDataProps[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      await ApiService.getMainGridCfg().then((res) => {
        setMainGridCfg(res.data);
      });

      await ApiService.getHseCnsmp(hhId).then((ret) => {
        setOnPeakCnsmp(ret.data.map((cnsmp: hseCnsmp) => ({
          dateTime: cnsmp.dateTime,
          data: cnsmp.mainGridOnPeakConsumeAmount
        } satisfies InputLineChartDataProps)));

        setMidPeakCnsmp(ret.data.map((cnsmp: hseCnsmp) => ({
          dateTime: cnsmp.dateTime,
          data: cnsmp.mainGridMidPeakConsumeAmount
        } satisfies InputLineChartDataProps)));

        setOffPeakCnsmp(ret.data.map((cnsmp: hseCnsmp) => ({
          dateTime: cnsmp.dateTime,
          data: cnsmp.mainGridOffPeakConsumeAmount
        } satisfies InputLineChartDataProps)));
      });
    };

    fetchData();

    const interval = setInterval(() => {
      fetchData();
    }, autoRefreshInterval);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div className="grid grid-cols-2 gap-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>

      <Card className="col-span-full">
        <Tabs defaultValue="on">
          <div className="flex flex-row items-center mt-6 mr-6">
            <div className="flex-1" />
            <TabsList>
              <TabsTrigger value="on">On-peak</TabsTrigger>
              <TabsTrigger value="mid">Mid-peak</TabsTrigger>
              <TabsTrigger value="off">Off-peak</TabsTrigger>
            </TabsList>
          </div>
          <div className="-mt-16">
            <TabsContent value="on">
              <CardHeader>
                <CardTitle>On-peak energy</CardTitle>
                <CardDescription>{`${chartMaxPoints}-hour main grid energy real-time usage level`}</CardDescription>
              </CardHeader>
              <CardContent>
                <EnergyLineChart data={[onPeakCnsmp]} labels={["On-peak"]} colors={[1]} />
              </CardContent>
            </TabsContent>
            <TabsContent value="mid">
              <CardHeader>
                <CardTitle>Mid-peak energy</CardTitle>
                <CardDescription>{`${chartMaxPoints}-hour main grid energy real-time usage level`}</CardDescription>
              </CardHeader>
              <CardContent>
                <EnergyLineChart data={[midPeakCnsmp]} labels={["Mid-peak"]} colors={[2]} />
              </CardContent>
            </TabsContent>
            <TabsContent value="off">
              <CardHeader>
                <CardTitle>Off-peak energy</CardTitle>
                <CardDescription>{`${chartMaxPoints}-hour main grid energy real-time usage level`}</CardDescription>
              </CardHeader>
              <CardContent>
                <EnergyLineChart data={[offPeakCnsmp]} labels={["Off-peak"]} colors={[3]} />
              </CardContent>
            </TabsContent>
          </div>
        </Tabs>
      </Card>

      <UotPriceChart mainGridCfg={mainGridCfg} />

    </motion.div>
  );
}
