"use client";


import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import MainGridCfg from "@/models/main-grid-cfg";
import { useEffect, useState } from "react";
import ApiService from "@/services/api";
import { autoRefreshInterval, hoursInDay } from "@/constants/constants";
import EnergyPieChart from "@/components/pie-chart";

export default function UotPriceChart() {
  const [mainGridCfg, setMainGridCfg] = useState<MainGridCfg>();

  const cfgKeys = ["onPeak", "midPeak", "offPeak"];
  const cfgLabels = ["On-peak", "Mid-peak", "Off-peak"];

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
        label = cfgLabels[0];
        color = cfgKeys[0];
      } else if (cfg?.midPeakHour.indexOf(x) !== -1) {
        label = cfgLabels[1];
        color = cfgKeys[1];
      } else if (cfg?.offPeakHour.indexOf(x) !== -1) {
        label = cfgLabels[2];
        color = cfgKeys[2];
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
            section: `${prevSection} ${startHour} - ${startHour + count}`,
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
        section: `${prevSection} ${startHour} - ${startHour + count}`,
        fill: prevFill,
      });
    }

    return combinedData;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Electricity time-of-use price periods</CardTitle>
        <CardDescription>Current time-of-use price periods</CardDescription>
      </CardHeader>
      <CardContent>
        <EnergyPieChart
          cfgKeys={cfgKeys}
          cfgLabels={cfgLabels}
          dataKey="hours"
          data={generateChartData(mainGridCfg)}
        />
      </CardContent>
    </Card>
  );
}
