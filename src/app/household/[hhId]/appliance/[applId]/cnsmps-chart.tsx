"use client";

import ApiUriBuilder from "@/services/api";
import ApplCnsmp from "@/models/appl-cnsmp";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  AxisChart,
  AxisChartType,
} from "@/components/axis-chart";
import useSWR from "swr";

export function CnsmpsChart({ applId }: { applId: number }) {
  const { data, isLoading } = useSWR<ApplCnsmp[]>(ApiUriBuilder.buildGetApplCnsmpUri(applId));

  return (
    <Card className="lg:col-span-full">
      <CardHeader>
        <CardTitle>Energy consumption</CardTitle>
        <CardDescription>Energy consumption by hours</CardDescription>
      </CardHeader>
      <CardContent>
        <AxisChart
          data={[!isLoading ? data!.map((item) => {
            return {
              data: item.consumeAmount,
              dateTime: item.consumeTime,
            };
          }) : []]}
          labels={["Consumption"]}
          chartType={AxisChartType.Line}
        />
      </CardContent>
    </Card>
  );
}
