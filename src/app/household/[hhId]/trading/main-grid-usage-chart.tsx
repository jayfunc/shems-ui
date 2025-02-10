"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartConfig,
} from "@/components/ui/chart";
import { autoRefreshInterval, energyUnit, routing } from "@/constants/routing";
import MainGridAcct from "@/models/main-grid-acct";
import ApiService from "@/services/api";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Label, Pie, PieChart } from "recharts";

export default function MainGridUsageChart({
  hhId,
  chartConfig,
}: {
  hhId: number;
  chartConfig: ChartConfig;
}) {
  const [mainGridAcct, setMainGridAcct] = useState<MainGridAcct>();

  useEffect(() => {
    const fetchData = async () => {
      ApiService.getMainGridAcct(hhId).then((res) => {
        setMainGridAcct(res.data);
      });
    };

    fetchData();

    const interval = setInterval(() => {
      fetchData();
    }, autoRefreshInterval);
    return () => clearInterval(interval);
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Main grid energy usage</CardTitle>
        <CardDescription>Last 24 hours usage</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="mx-auto max-h-[250px] [&_.recharts-pie-label-text]:fill-foreground"
        >
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Pie
              data={[
                {
                  section: `On-peak`,
                  hours: mainGridAcct?.onPeakPowerUsage,
                  fill: "var(--color-onPeak)",
                },
                {
                  section: `Mid-peak`,
                  hours: mainGridAcct?.midPeakPowerUsage,
                  fill: "var(--color-midPeak)",
                },
                {
                  section: `Off-peak`,
                  hours: mainGridAcct?.offPeakPowerUsage,
                  fill: "var(--color-offPeak)",
                },
              ]}
              dataKey="hours"
              nameKey="section"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {(mainGridAcct?.onPeakPowerUsage ?? 0) +
                            (mainGridAcct?.midPeakPowerUsage ?? 0) +
                            (mainGridAcct?.offPeakPowerUsage ?? 0)}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          {energyUnit}
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
            <ChartLegend />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
