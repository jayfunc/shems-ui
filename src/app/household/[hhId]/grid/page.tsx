"use client";

import UotPriceChart from "../grid/uot-price-chart";
import {
  autoRefreshInterval,
  chartMaxPoints,
  routing,
} from "@/constants/constants";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import MainGridCfg, { } from "@/models/main-grid-cfg";
import ApiService from "@/services/api";
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import hseCnsmp from "@/models/hse-cnsmp";
import { AxisChart, AxisChartType, InputAxisChartDataProps } from "@/components/axis-chart";

export default function Trading() {
  const hhId = parseInt(
    usePathname()
      .replace(routing.household, "")
      .replace(routing.trading, "")
      .replaceAll("/", ""),
  );
  const [mainGridCfg, setMainGridCfg] = useState<MainGridCfg>();
  const [mainGridCnsmp, setMainGridCnsmp] = useState<InputAxisChartDataProps[]>([]);
  const [onPeakCnsmp, setOnPeakCnsmp] = useState<InputAxisChartDataProps[]>([]);
  const [midPeakCnsmp, setMidPeakCnsmp] = useState<InputAxisChartDataProps[]>([]);
  const [offPeakCnsmp, setOffPeakCnsmp] = useState<InputAxisChartDataProps[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      await ApiService.getMainGridCfg().then((res) => {
        setMainGridCfg(res.data);
      });

      await ApiService.getHseCnsmp(hhId).then((ret) => {
        setMainGridCnsmp(ret.data.map((cnsmp: hseCnsmp) => ({
          dateTime: cnsmp.dateTime,
          data: cnsmp.mainGridConsumeAmount
        } satisfies InputAxisChartDataProps)));

        setOnPeakCnsmp(ret.data.map((cnsmp: hseCnsmp) => ({
          dateTime: cnsmp.dateTime,
          data: cnsmp.mainGridOnPeakConsumeAmount
        } satisfies InputAxisChartDataProps)));

        setMidPeakCnsmp(ret.data.map((cnsmp: hseCnsmp) => ({
          dateTime: cnsmp.dateTime,
          data: cnsmp.mainGridMidPeakConsumeAmount
        } satisfies InputAxisChartDataProps)));

        setOffPeakCnsmp(ret.data.map((cnsmp: hseCnsmp) => ({
          dateTime: cnsmp.dateTime,
          data: cnsmp.mainGridOffPeakConsumeAmount
        } satisfies InputAxisChartDataProps)));
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
        <Tabs defaultValue="unclas">
          <div className="flex flex-row items-center mt-6 mr-6">
            <div className="flex-1" />
            <TabsList>
              <TabsTrigger value="unclas">Unclassified</TabsTrigger>
              <TabsTrigger value="clas">Classified</TabsTrigger>
            </TabsList>
          </div>

          <div className="-mt-16">
            <TabsContent value="unclas">
              <CardHeader>
                <CardTitle>Main grid unclassified usage</CardTitle>
                <CardDescription>{`${chartMaxPoints}-hour main grid real-time usage level`}</CardDescription>
              </CardHeader>
              <CardContent>
                <AxisChart data={[mainGridCnsmp]} labels={["On-peak"]} colors={[1]} chartType={AxisChartType.Line} />
              </CardContent>
            </TabsContent>

            <TabsContent value="clas">
              <CardHeader>
                <CardTitle>Main grid classified usage</CardTitle>
                <CardDescription>{`${chartMaxPoints}-hour main grid real-time usage level`}</CardDescription>
              </CardHeader>
              <CardContent>
                <AxisChart data={[onPeakCnsmp, midPeakCnsmp, offPeakCnsmp]} labels={["On-peak", "Mid-peak", "Off-peak"]} colors={[2, 3, 4]} chartType={AxisChartType.Area} />
              </CardContent>
            </TabsContent>
          </div>
        </Tabs>
      </Card>

      <UotPriceChart mainGridCfg={mainGridCfg} />

    </motion.div>
  );
}
