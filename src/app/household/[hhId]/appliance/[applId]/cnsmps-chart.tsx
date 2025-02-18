"use client";

import ApiService from "@/services/api";
import ApplCnsmp from "@/models/appl-cnsmp";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { AxisChart, AxisChartType } from "@/components/axis-chart";
import useSWR from "swr";

export function CnsmpsChart({ applId }: { applId: number }) {
  const { data } = useSWR<ApplCnsmp[]>(ApiService.buildGetApplCnsmpUri(applId));

  return (
    <Card className="lg:col-span-full">
      <CardHeader>
        <CardTitle>Energy consumption</CardTitle>
        <CardDescription>Energy consumption by hours</CardDescription>
      </CardHeader>
      <CardContent>
        <AxisChart
          data={[
            data == null || data.map == null
              ? []
              : data.map((item) => {
                  return {
                    data: item.consumeAmount,
                    dateTime: item.consumeTime,
                  };
                }),
          ]}
          labels={["Consumption"]}
          chartType={AxisChartType.Line}
        />
      </CardContent>
    </Card>
  );
}
