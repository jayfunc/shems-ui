"use client";

import { CartesianGrid, LabelList, Line, LineChart, XAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import ApiService from "@/services/api";
import ApplCnsmp from "@/models/appl-cnsmp";
import { useEffect, useState } from "react";
import { autoRefreshInterval, chartMaxPoints } from "@/constants/constants";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { EnergyLineChart } from "@/extensions/chart";

export function CnsmpsChart({ applId }: { applId: number }) {
  const [data, setData] = useState<ApplCnsmp[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      ApiService.getApplCnsmp(applId).then((ret) => {
        data.push(ret.data);
        if (data.length >= chartMaxPoints) {
          data.shift();
        }
        setData([...data]);
      });
    };

    fetchData();

    const interval = setInterval(() => {
      fetchData();
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
        <EnergyLineChart data={[data]} labels={["Consumption"]} />
      </CardContent>
    </Card>
  );
}
