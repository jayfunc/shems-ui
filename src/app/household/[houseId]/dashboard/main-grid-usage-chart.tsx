"use client";

import EnergyPieChart from "@/components/pie-chart";
import energyUnitConverter from "@/extensions/energy-unit-converter";
import MainGridAcct from "@/models/main-grid-acct";
import ApiService from "@/services/api";
import EnergyCard from "./energy-card";
import { Grid3x3 } from "lucide-react";
import CenterDrawer from "@/components/scrollable-drawer";
import { Badge } from "@/components/ui/badge";
import MainGridCfg, { MainGridCfgSignal } from "@/models/main-grid-cfg";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import formatText from "@/extensions/string";
import useSWR from "swr";

export default function MainGridUsageChart({ houseId }: { houseId: number }) {
  const { data: mainGridAcct } = useSWR<MainGridAcct>(
    ApiService.buildGetMainGridAcctUri(houseId),
  );
  const { data: mainGridCfg } = useSWR<MainGridCfg>(
    ApiService.buildGetMainGridCfgUri(),
  );

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
    />
  );
}
