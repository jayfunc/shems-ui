"use client";

import { Battery, BatteryCharging, Home, Info, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import HseCnsmp from "@/models/hse-cnsmp";
import ApiService from "@/services/api";
import { usePathname } from "next/navigation";
import {
  autoRefreshInterval,
  chartMaxPoints,
  routing,
} from "@/constants/constants";
import HseCnsmpPred from "@/models/hse-cnsmp-pred";
import HseGen from "@/models/hse-gen";
import HseGenPred from "@/models/hse-gen-pred";
import LocStor from "@/models/loc-stor";
import Hse, { HouseholdType } from "@/models/hse";
import EnergyCard from "./energy-card";
import { insertSpaces, toTitleCase } from "@/extensions/string";
import { motion } from "motion/react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { EnergyLineChart } from "@/components/line-chart";
import energyUnitConverter from "@/extensions/energy-unit-converter";

export default function Dashboard() {

  // House energy consumption (appliances)
  const [hseCnsmp, setHseCnsmp] = useState<HseCnsmp[]>([]);
  const [hseCnsmpPred, setHseCnsmpPred] = useState<HseCnsmpPred[]>([]);
  const [hseCnsmpDelta, setHseCnsmpDelta] = useState<number>(0);

  // House energy generation (solar)
  const [hseGen, setHseGen] = useState<HseGen[]>([]);
  const [hseGenPred, setHseGenPred] = useState<HseGenPred[]>([]);
  const [hseGenDelta, setHseGenDelta] = useState<number>(0);

  // Local energy storage (battery)
  const [locStor, setLocStor] = useState<LocStor>();

  // Current house
  const [currentHouse, setCurrentHouse] = useState<Hse>();

  const hhId = parseInt(
    usePathname()
      .replace(routing.household, "")
      .replace(routing.dashboard, "")
      .replaceAll("/", ""),
  );

  useEffect(() => {
    ApiService.getHse(hhId).then((ret) => {
      setCurrentHouse(ret.data);
    });

    const fetchData = async () => {
      // House energy consumption
      await ApiService.getHseCnsmp(hhId).then((ret) => {
        setHseCnsmp(ret.data);
        // Calculate delta
        if (ret.data.length > 1) {
          const last = ret.data[ret.data.length - 1]?.data;
          const secondLast = ret.data[ret.data.length - 2]?.data;
          if (last !== undefined && secondLast !== undefined) {
            setHseCnsmpDelta(last - secondLast);
          }
        }
      });

      // House energy consumption prediction
      // ApiService.getHseCnsmpPred(hhId).then((ret) => {
      //   setHseCnsmpPred(ret.data);
      // });

      // House energy generation
      await ApiService.getHseGen(hhId).then((ret) => {
        setHseGen(ret.data);
        // Calculate delta
        if (ret.data.length > 1) {
          const last = ret.data.at(-1)?.data;
          const secondLast = ret.data.at(-2)?.data;
          if (last !== undefined && secondLast !== undefined) {
            setHseGenDelta(last - secondLast);
          }
        }
      });

      // House energy generation prediction
      // ApiService.getHseGenPred(hhId).then((ret) => {
      //   setHseGenPred(ret.data);
      // });

      // Local energy storage
      await ApiService.getLocStor(hhId).then((ret) => {
        setLocStor(ret.data);
      });
    };

    fetchData();

    const interval = setInterval(async () => {
      await fetchData();
    }, autoRefreshInterval);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div className="grid grid-cols-4 gap-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <EnergyCard
        title="Solar energy"
        subtitle={
          `${energyUnitConverter.format(hseGen.at(-1)?.data) ?? '-'} ${energyUnitConverter.getTargetUnit()}`
        }
        delta={energyUnitConverter.format(hseGenDelta) ?? '-'}
        icon={<Sun className="h-full w-full text-muted-foreground" />}
      />

      <EnergyCard
        title="House consumption"
        subtitle={
          `${energyUnitConverter.format(hseCnsmp.at(-1)?.data) ?? '-'} ${energyUnitConverter.getTargetUnit()}`
        }
        delta={energyUnitConverter.format(hseCnsmpDelta) ?? '-'}
        icon={<Home className="h-full w-full text-muted-foreground" />}
      />

      <EnergyCard
        title="Battery storage"
        subtitle={
          `${locStor === undefined ? '-' : Math.floor((locStor.currentPowerAmount / locStor.capacity) * 100)}%`
        }
        icon={
          <div className="relative">
            <Battery className="h-full w-full text-muted-foreground" />
            {locStor !== undefined && <div className={`${'absolute top-6 left-[0.67rem] h-[1rem] w-['}${(locStor.currentPowerAmount / locStor.capacity) * 2}${'rem] rounded-sm bg-muted-foreground'}`} />}
          </div>
        }
      />

      <EnergyCard
        title={`${currentHouse?.householdName ?? '-'}'s house - ${toTitleCase(insertSpaces(HouseholdType[currentHouse?.householdType ?? 0]) ?? '-')}`}
        subtitle={`${currentHouse?.area ?? '-'} ft²`}
        icon={<Info className="h-full w-full text-muted-foreground" />}
      />

      <Card className="col-span-full">
        <CardHeader>
          <CardTitle>House overall energy</CardTitle>
          <CardDescription>{`${chartMaxPoints}-hour energy real-time consumption and generation level`}</CardDescription>
        </CardHeader>
        <CardContent>
          <EnergyLineChart data={[hseCnsmp, hseGen]} labels={["Consumption", "Generation"]} colors={[1, 2]} />
        </CardContent>
      </Card>


      {/* TODO: 预测数据未准备好 */}
      {/* <Card className="col-span-full">
          <CardHeader>
            <CardTitle>House generation energy</CardTitle>
            <CardDescription>{`${chartMaxPoints}-hour energy generation with forcast level`}</CardDescription>
          </CardHeader>
          <CardContent>
            <EnergyLineChart data={[hseGen, hseGenPred]} labels={["Generation", "Generation forcast"]} colors={[2, 3]} />
          </CardContent>
        </Card> */}

    </motion.div>
  );
}
