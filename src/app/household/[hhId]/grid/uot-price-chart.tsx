"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import MainGridCfg from "@/models/main-grid-cfg";
import EnergyPieChart from "@/components/pie-chart";

const cfgKeys = ["onPeak", "midPeak", "offPeak"];
const cfgLabels = ["On-peak", "Mid-peak", "Off-peak"];

interface InputDataProp {
  hours: number;
  section: string;
  fill: string;
}

function fillZero(value: number): string {
  return `${value < 10 ? 0 : ""}${value}`;
}

function formatTimeDuration(start: number, lasting: number): string {
  const end = start + lasting;
  return `• ${fillZero(start)}-${fillZero(end)}`;
}

function generateChartData(
  cfgKeys: string[],
  cfgLabels: string[],
  cfg?: MainGridCfg,
): InputDataProp[] {
  const combinedData: InputDataProp[] = [];

  let prevSection = "";
  let prevFill = "";
  let count = 0;
  let startHour = 0;

  [...Array.from(Array(24).keys())]
    .map((x) => {
      let label = "";
      let color = "";
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
    })
    .forEach((d) => {
      if (d.section === prevSection && d.fill === prevFill) {
        count++;
      } else {
        if (count > 0) {
          combinedData.push({
            hours: count,
            section: `${prevSection} ${formatTimeDuration(startHour, count)}`,
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
      section: `${prevSection} ${formatTimeDuration(startHour, count)}`,
      fill: prevFill,
    });
  }

  return combinedData;
}

export default function UotPriceChart({
  mainGridCfg,
}: {
  mainGridCfg?: MainGridCfg;
}) {
  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle>Electricity time-of-use price periods</CardTitle>
        <CardDescription>Current time-of-use price periods</CardDescription>
      </CardHeader>
      <CardContent>
        <EnergyPieChart
          cfgKeys={cfgKeys}
          cfgLabels={cfgLabels}
          dataKey="hours"
          data={generateChartData(cfgKeys, cfgLabels, mainGridCfg)}
          itemFormatter={(value) => `${value} hours`}
        />
      </CardContent>
    </Card>
  );
}
