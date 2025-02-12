"use client";

import { Pie, PieChart } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import MainGridCfg from "@/models/main-grid-cfg";
import { useEffect, useState } from "react";
import ApiService from "@/services/api";
import { autoRefreshInterval, hoursInDay } from "@/constants/constants";

export default function UotPriceChart({
  chartConfig,
}: {
  chartConfig: ChartConfig;
}) {
  function generateChartData(cfg?: MainGridCfg): any[] {
    const combinedData: any[] = [];

    let prevSection = '';
    let prevFill = '';
    let count = 0;
    let startHour = 0;

    [...Array.from(Array(hoursInDay).keys())].map((x) => {
      let label = '';
      let color = '';
      if (cfg?.onPeakHour.indexOf(x) !== -1) {
        label = 'On-peak';
        color = 'onPeak';
      } else if (cfg?.midPeakHour.indexOf(x) !== -1) {
        label = 'Mid-peak';
        color = 'midPeak';
      } else if (cfg?.offPeakHour.indexOf(x) !== -1) {
        label = 'Off-peak';
        color = 'offPeak';
      }
      return {
        hours: 1,
        section: label,
        fill: `var(--color-${color})`,
        hour: x,
      };
    }).forEach((d) => {
      if (d.section === prevSection && d.fill === prevFill) {
        count++;
      } else {
        if (count > 0) {
          combinedData.push({
            hours: count,
            section: `${prevSection} (${startHour}-${startHour + count})`,
            fill: prevFill,
          });
        }
        prevSection = d.section;
        prevFill = d.fill;
        count = 1;
        startHour = d.hour;
      }
    });

    if (count > 0) {
      combinedData.push({
        hours: count,
        section: `${prevSection} (${startHour}-${startHour + count})`,
        fill: prevFill,
      });
    }

    return combinedData;
  }

  const [mainGridCfg, setMainGridCfg] = useState<MainGridCfg>();

  useEffect(() => {
    const fetchData = async () => {
      ApiService.getMainGridCfg().then((res) => {
        setMainGridCfg(res.data);
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
        <CardTitle>Electricity time-of-use price periods</CardTitle>
        <CardDescription>Current time-of-use price periods</CardDescription>
      </CardHeader>
      <CardContent className="relative">
        <ChartContainer
          config={chartConfig}
          className="mx-auto max-h-[250px] [&_.recharts-pie-label-text]:fill-foreground"
        >
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Pie
              data={generateChartData(mainGridCfg)}
              dataKey="hours"
              nameKey="section"
            />
            <ChartLegend />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
