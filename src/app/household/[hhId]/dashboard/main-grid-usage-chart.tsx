"use client";

import EnergyPieChart from "@/components/pie-chart";
import energyUnitConverter from "@/extensions/energy-unit-converter";
import MainGridAcct from "@/models/main-grid-acct";
import ApiUriBuilder from "@/services/api";
import EnergyCard from "./energy-card";
import { Grid3x3 } from "lucide-react";
import CenterDrawer from "@/components/scrollable-drawer";
import { Badge } from "@/components/ui/badge";
import MainGridCfg, {
  MainGridCfgSignal,
} from "@/models/main-grid-cfg";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import formatText from "@/extensions/string";
import useSWR from "swr";

export default function MainGridUsageChart({ hhId }: { hhId: number }) {
  const cfgKeys = ["onPeak", "midPeak", "offPeak"];
  const cfgLabels = ["On-peak", "Mid-peak", "Off-peak"];

  const {data: mainGridAcct} = useSWR<MainGridAcct>(ApiUriBuilder.buildGetMainGridAcctUri(hhId));
  const {data: mainGridCfg} = useSWR<MainGridCfg>(ApiUriBuilder.buildGetMainGridCfgUri());

  return (
    <EnergyCard
      title="Main grid usage"
      desc="All time"
      status={
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge
                variant={`${mainGridCfg !== undefined && mainGridCfg.signal === MainGridCfgSignal.PeakShaveSignal ? "destructive" : "default"}`}
              >
                {mainGridCfg !== undefined
                  ? formatText(MainGridCfgSignal[mainGridCfg.signal])
                  : "-"}
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              <p>Current main grid signal</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      }
      icon={<Grid3x3 className="text-muted-foreground" />}
      subtitle={
        mainGridAcct === undefined
          ? "-"
          : energyUnitConverter.formatInStringWithUnit(
              mainGridAcct.midPeakPowerUsage +
                mainGridAcct.onPeakPowerUsage +
                mainGridAcct.offPeakPowerUsage,
            )
      }
      actionArea={
        <CenterDrawer
          title="Main grid usage distribution"
          desc="By peak all time"
          content={
            mainGridAcct !== undefined && (
              <EnergyPieChart
                cfgKeys={cfgKeys}
                cfgLabels={cfgLabels}
                dataKey="hours"
                dataValues={[
                  energyUnitConverter.formatInNumber(
                    mainGridAcct.onPeakPowerUsage,
                  ),
                  energyUnitConverter.formatInNumber(
                    mainGridAcct.midPeakPowerUsage,
                  ),
                  energyUnitConverter.formatInNumber(
                    mainGridAcct.offPeakPowerUsage,
                  ),
                ]}
                itemFormatter={(value) =>
                  `${value} ${energyUnitConverter.getTargetUnit()}`
                }
              />
            )
          }
        />
      }
    />
  );
}
