"use client";

import EnergyPieChart from "@/components/pie-chart";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import {
  autoRefreshInterval,
} from "@/constants/constants";
import energyUnitConverter from "@/extensions/energy-unit-converter";
import MainGridAcct from "@/models/main-grid-acct";
import ApiService from "@/services/api";
import { useEffect, useState } from "react";

export default function MainGridUsageChart({
  hhId,
}: {
  hhId: number;
}) {
  const [mainGridAcct, setMainGridAcct] = useState<MainGridAcct>();

  const cfgKeys = ["onPeak", "midPeak", "offPeak"];
  const cfgLabels = ["On-peak", "Mid-peak", "Off-peak"];

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
        <CardDescription>
          Energy usage by periods up to now
        </CardDescription>
      </CardHeader>
      <CardContent>
        {mainGridAcct !== undefined &&
          <EnergyPieChart
            cfgKeys={cfgKeys}
            cfgLabels={cfgLabels}
            dataKey="hours"
            dataValues={[
              energyUnitConverter.format(mainGridAcct.onPeakPowerUsage) ?? 0,
              energyUnitConverter.format(mainGridAcct.midPeakPowerUsage) ?? 0,
              energyUnitConverter.format(mainGridAcct.offPeakPowerUsage) ?? 0
            ]}
            centerSubtitle={energyUnitConverter.getTargetUnit()}
            itemFormatter={(value) => `${value} ${energyUnitConverter.getTargetUnit()}`}
          />}
      </CardContent>
    </Card>
  );
}
