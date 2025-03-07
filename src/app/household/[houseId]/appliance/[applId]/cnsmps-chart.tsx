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
import { AxisChart, AxisChartType, PrimaryType, SecondaryType } from "@/components/axis-chart";
import useSWR from "swr";
import { useDataSizeLimit } from "@/extensions/request";
import Formatter from "@/extensions/formatter";
import energyUnitConverter from "@/extensions/energy-unit-converter";

export function CnsmpsChart({ applId }: { applId: number }) {
  const { data } = useSWR<ApplCnsmp[]>(
    ApiService.buildApplCnsmpUri(applId, useDataSizeLimit()),
  );

  return (
    <Card className="lg:col-span-full">
      <CardHeader>
        <CardTitle>Energy consumption</CardTitle>
        <CardDescription>Energy consumption by hours</CardDescription>
      </CardHeader>
      <CardContent>
        <AxisChart
          primaryType={PrimaryType.Time}
          secondaryType={SecondaryType.Energy}
          data={[
            data == null || data.map == null
              ? []
              : data.map((item) => {
                return {
                  secondary: item.consumeAmount,
                  primary: item.consumeTime,
                };
              }),
          ]}
          labels={["Consumption"]}
          colors={["--power-cnsmp"]}
          chartType={AxisChartType.Line}
        />
      </CardContent>
    </Card>
  );
}
