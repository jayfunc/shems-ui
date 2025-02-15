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
import { EnergyLineChart } from "@/components/line-chart";

export function CnsmpsChart({ applId }: { applId: number }) {
  const [data, setData] = useState<ApplCnsmp[]>([]);
  const [time, setTime] = useState<Date>();

  useEffect(() => {
    const fetchData = async () => {
      await ApiService.getSimCfg().then((res) => {
        setTime(new Date(res.data.simulationTime));
      });

      await ApiService.getApplCnsmp(applId).then((ret) => {
        setData(ret.data);
      });
    };

    fetchData();

    const interval = setInterval(async () => {
      await fetchData();
    }, autoRefreshInterval);

    return () => clearInterval(interval);
  }, []);

  return (
    time !== undefined &&
    <Card className="lg:col-span-full">
      <CardHeader>
        <CardTitle>Energy consumption</CardTitle>
        <CardDescription>Energy consumption by hours</CardDescription>
      </CardHeader>
      <CardContent>
        <EnergyLineChart data={[data]} labels={["Consumption"]} />
      </CardContent>
    </Card>
  );
}
