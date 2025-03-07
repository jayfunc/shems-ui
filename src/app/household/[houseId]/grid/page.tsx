"use client";

import { motion } from "motion/react";
import MainGridCfg from "@/models/main-grid-cfg";
import ApiService from "@/services/api";
import houseCnsmp from "@/models/house-cnsmp";
import { AxisChart, AxisChartType, PrimaryType, SecondaryType } from "@/components/axis-chart";
import useSWR from "swr";
import CardTabs from "@/components/card-tabs";
import { useCurrentHouseId, useDataSizeLimit } from "@/extensions/request";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import BestPieChart from "@/components/pie-chart";
import MainGridAcct from "@/models/main-grid-acct";
import energyUnitConverter from "@/extensions/energy-unit-converter";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { CircleHelp } from "lucide-react";

function MainGridUsageCardTitle({ timeTicks, mainGridCfg }: { timeTicks: number[], mainGridCfg?: MainGridCfg }) {
  return (
    <div className="flex flex-row gap-2 items-center">
      Main grid usage
      <HoverCard>
        <HoverCardTrigger asChild>
          <CircleHelp className="text-muted-foreground size-4 hover:cursor-pointer" />
        </HoverCardTrigger>
        <HoverCardContent align="start" className="w-[30vw] p-0 opacity-85">
          <CardHeader>
            <CardTitle>Electricity time-of-use price periods</CardTitle>
            <CardDescription>Current time-of-use price periods</CardDescription>
          </CardHeader>
          <CardContent>
            <BestPieChart
              showLabel
              cfgLabels={timeTicks.map((key) => {
                const hour = key;
                let label = '';
                if (mainGridCfg?.onPeakHour.indexOf(hour) !== -1) {
                  label = "On-peak";
                } else if (mainGridCfg?.midPeakHour.indexOf(hour) !== -1) {
                  label = "Mid-peak";
                } else if (mainGridCfg?.offPeakHour.indexOf(hour) !== -1) {
                  label = "Off-peak";
                }
                return label;
              })}
              colors={timeTicks
                .map((key) => {
                  const hour = Number(key);
                  let color = "--foreground";
                  if (mainGridCfg?.onPeakHour.indexOf(hour) !== -1) {
                    color = "--peak-on";
                  } else if (mainGridCfg?.midPeakHour.indexOf(hour) !== -1) {
                    color = "--peak-mid";
                  } else if (mainGridCfg?.offPeakHour.indexOf(hour) !== -1) {
                    color = "--peak-off";
                  }
                  return color;
                })}
              dataValues={timeTicks.map(() => 1)}
              itemFormatter={() => ""}
            />
          </CardContent>
        </HoverCardContent>
      </HoverCard>
    </div>
  );
}

export default function Trading() {
  const houseId = useCurrentHouseId();
  const { data: houseCnsmp } = useSWR<houseCnsmp[]>(
    ApiService.buildHouseCnsmpUri(useCurrentHouseId(), useDataSizeLimit()),
  );
  const { data: mainGridCfg } = useSWR<MainGridCfg>(
    ApiService.buildMainGridCfgUri(),
  );
  const { data: mainGridAcct } = useSWR<MainGridAcct>(
    ApiService.buildMainGridAcctUri(houseId),
  );
  const { data: simCfg } = useSWR(ApiService.buildSimCfgUri());

  const offset = 18;
  let timeTicks = [...Array.from(Array(24).keys()).reverse()];
  timeTicks = [...timeTicks.slice(offset), ...timeTicks.slice(0, offset)];

  function mapToMainGridCnsmpData() {
    return (
      houseCnsmp?.map((item) => {
        return {
          dateTime: item.consumeTime,
          data: item.mainGridConsumeAmount,
        };
      }) ?? []
    );
  }

  function mapToCmtyGridCnsmpData() {
    return (
      houseCnsmp?.map((item) => {
        return {
          primary: item.consumeTime,
          secondary: item.communityGridConsumeAmount,
        };
      }) ?? []
    );
  }

  function mapToOnPeakCnsmpData() {
    return (
      houseCnsmp?.map((item) => {
        return {
          primary: item.consumeTime,
          secondary: item.mainGridOnPeakConsumeAmount,
        };
      }) ?? []
    );
  }

  function mapToMidPeakCnsmpData() {
    return (
      houseCnsmp?.map((item) => {
        return {
          primary: item.consumeTime,
          secondary: item.mainGridMidPeakConsumeAmount,
        };
      }) ?? []
    );
  }

  function mapToOffPeakCnsmpData() {
    return (
      houseCnsmp?.map((item) => {
        return {
          primary: item.consumeTime,
          secondary: item.mainGridOffPeakConsumeAmount,
        };
      }) ?? []
    );
  }

  return (
    <motion.div
      className="grid grid-cols-2 gap-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >

      <CardTabs
        titles={[MainGridUsageCardTitle({ timeTicks, mainGridCfg }), "Community grid usage"]}
        descs={`${useDataSizeLimit()}-hour energy real-time usage level`}
        tabLabels={["Main grid usage", "Community grid usage"]}
        tabContents={[
          <AxisChart
            primaryType={PrimaryType.Time}
            secondaryType={SecondaryType.Energy}
            key={0}
            data={[
              mapToOnPeakCnsmpData(),
              mapToMidPeakCnsmpData(),
              mapToOffPeakCnsmpData(),
            ]}
            labels={["On-peak", "Mid-peak", "Off-peak"]}
            colors={["--peak-on", "--peak-mid", "--peak-off"]}
            chartType={AxisChartType.Area}
          />,
          <AxisChart
            primaryType={PrimaryType.Time}
            secondaryType={SecondaryType.Energy}
            key={1}
            data={[mapToCmtyGridCnsmpData()]}
            labels={["Community grid usage"]}
            colors={["--power-cnsmp"]}
            chartType={AxisChartType.Line}
          />,
        ]} />

      <Card className="col-span-full">
        <CardHeader>
          <CardTitle>Main grid usage distribution</CardTitle>
          <CardDescription>By peak all time</CardDescription>
        </CardHeader>
        <CardContent>
          {mainGridAcct !== undefined && (
            <BestPieChart
              cfgLabels={["On-peak", "Mid-peak", "Off-peak"]}
              colors={["--peak-on", "--peak-mid", "--peak-off"]}
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
          )}
        </CardContent>
      </Card>

    </motion.div>
  );
}
