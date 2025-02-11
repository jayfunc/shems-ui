"use client";

import { BatteryCharging, Home, Info, Sun } from "lucide-react";
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
import formatEnergy from "@/extensions/energy";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { EnergyLineChart } from "@/extensions/chart";

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
      ApiService.getHseCnsmp(hhId).then((ret) => {
        hseCnsmp.push(ret.data);
        if (hseCnsmp.length >= chartMaxPoints) {
          hseCnsmp.shift();
        }
        setHseCnsmp([...hseCnsmp]);

        if (hseCnsmp.length > 1) {
          setHseCnsmpDelta(
            hseCnsmp[hseCnsmp.length - 1].data -
            hseCnsmp[hseCnsmp.length - 2].data,
          );
        }
      });

      // House energy consumption prediction
      ApiService.getHseCnsmpPred(hhId).then((ret) => {
        hseCnsmpPred.push(ret.data);
        if (hseCnsmpPred.length >= chartMaxPoints) {
          hseCnsmpPred.shift();
        }
        setHseCnsmpPred([...hseCnsmpPred]);
      });

      // House energy generation
      ApiService.getHseGen(hhId).then((ret) => {
        hseGen.push(ret.data);
        if (hseGen.length >= chartMaxPoints) {
          hseGen.shift();
        }
        setHseGen([...hseGen]);

        if (hseGen.length > 1) {
          setHseGenDelta(
            hseGen[hseGen.length - 1].data -
            hseGen[hseGen.length - 2].data,
          );
        }
      });

      // House energy generation prediction
      ApiService.getHseGenPred(hhId).then((ret) => {
        hseGenPred.push(ret.data);
        if (hseGenPred.length >= chartMaxPoints) {
          hseGenPred.shift();
        }
        setHseGenPred([...hseGenPred]);
      });

      // Local energy storage
      ApiService.getLocStor(hhId).then((ret) => {
        setLocStor(ret.data);
      });
    };

    fetchData();

    const interval = setInterval(() => {
      fetchData();
    }, autoRefreshInterval);

    return () => clearInterval(interval);
  }, []);

  return (
    hseGen.length > 0 && hseCnsmp.length > 0 && locStor !== undefined && currentHouse !== undefined && currentHouse !== undefined ? (
      <motion.div className="grid grid-cols-4 gap-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <EnergyCard
          title="Solar energy"
          subtitle={
            `${formatEnergy(hseGen.at(hseGen.length - 1)!.data)}`
          }
          delta={formatEnergy(hseGenDelta)}
          icon={<Sun className="h-full w-full text-muted-foreground" />}
        />

        <EnergyCard
          title="House consumption"
          subtitle={
            `${formatEnergy(hseCnsmp.at(hseCnsmp.length - 1)!.data)}`
          }
          delta={formatEnergy(hseCnsmpDelta)}
          icon={<Home className="h-full w-full text-muted-foreground" />}
        />

        <EnergyCard
          title="Battery storage"
          subtitle={
            `${Math.floor((locStor.currentPowerAmount / locStor.capacity) * 100)}%`
          }
          icon={
            <div className="relative">
              <BatteryCharging className="h-full w-full text-muted-foreground" />
            </div>
          }
        />

        <EnergyCard
          title={`${currentHouse.householdName}'s house - ${toTitleCase(insertSpaces(HouseholdType[currentHouse.householdType ?? 0]))}`}
          subtitle={`${currentHouse.area} ft²`}
          icon={<Info className="h-full w-full text-muted-foreground" />}
        />

        <Card className="col-span-full">
          <CardHeader>
            <CardTitle>House overall energy</CardTitle>
            <CardDescription>{`${chartMaxPoints}-hour energy real-time consumption and generation level`}</CardDescription>
          </CardHeader>
          <CardContent>
            <EnergyLineChart data={[hseCnsmp, hseGen]} labels={["Consumption", "Generation"]} />
          </CardContent>
        </Card>

        {/* TODO: 预测数据未准备好 */}
        {/* <Card className="col-span-full">
          <CardHeader>
            <CardTitle>House generation energy</CardTitle>
            <CardDescription>{`${chartMaxPoints}-hour energy generation with forcast level`}</CardDescription>
          </CardHeader>
          <CardContent>
            <EnergyLineChart data={[hseGen, hseGenPred]} labels={["Generation", "Generation forcast"]} />
          </CardContent>
        </Card> */}

      </motion.div>
    ) : null
  );
}
