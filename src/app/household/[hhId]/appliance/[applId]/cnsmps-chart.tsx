"use client";

import ApiService from "@/services/api";
import ApplCnsmp from "@/models/appl-cnsmp";
import { useEffect, useState } from "react";
import { autoRefreshInterval } from "@/constants/constants";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { AxisChart, AxisChartType, InputAxisChartDataProps } from "@/components/axis-chart";

export function CnsmpsChart({ applId }: { applId: number }) {
  const [applCnsmp, setData] = useState<InputAxisChartDataProps[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      await ApiService.getApplCnsmp(applId).then((ret) => {
        setData(ret.data.map((item) => {
          return {
            data: item.consumeAmount,
            dateTime: item.consumeTime,
          }
        }));
      });
    };

    fetchData();

    const interval = setInterval(async () => {
      await fetchData();
    }, autoRefreshInterval);

    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="lg:col-span-full">
      <CardHeader>
        <CardTitle>Energy consumption</CardTitle>
        <CardDescription>Energy consumption by hours</CardDescription>
      </CardHeader>
      <CardContent>
        <AxisChart data={[applCnsmp]} labels={["Consumption"]} chartType={AxisChartType.Line} />
      </CardContent>
    </Card>
  );
}
