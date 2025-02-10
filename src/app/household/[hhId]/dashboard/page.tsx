"use client";

import {
  Battery,
  BatteryCharging,
  Home,
  Info,
  Sun,
  UtilityPole,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CartesianGrid, LabelList, Line, LineChart, XAxis } from "recharts";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import HseCnsmp from "@/models/hse-cnsmp";
import ApiService from "@/services/api";
import { usePathname } from "next/navigation";
import {
  autoRefreshInterval,
  energyUnit,
  loadingHint,
  routing,
} from "@/constants/routing";
import HseCnsmpPred from "@/models/hse-cnsmp-pred";
import HseGen from "@/models/hse-gen";
import HseGenPred from "@/models/hse-gen-pred";
import LocStor from "@/models/loc-stor";
import Hse, { HouseholdType } from "@/models/hse";
import EnergyCard from "./energy-card";
import CnsmpPredChart from "./cnsmp-pred-chart";
import CnsmpChart from "./cnsmp-chart";
import GenChart from "./gen-chart";
import GenPredChart from "./gen-pred-chart";
import { insertSpaces, toTitleCase } from "@/extensions/string";

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
        if (hseCnsmp.length >= 12) {
          hseCnsmp.shift();
        }
        setHseCnsmp([...hseCnsmp]);

        if (hseCnsmp.length > 1) {
          setHseCnsmpDelta(
            hseCnsmp[hseCnsmp.length - 1].totalConsumeAmount -
              hseCnsmp[hseCnsmp.length - 2].totalConsumeAmount,
          );
        }
      });

      // House energy consumption prediction
      ApiService.getHseCnsmpPred(hhId).then((ret) => {
        hseCnsmpPred.push(ret.data);
        if (hseCnsmpPred.length >= 12) {
          hseCnsmpPred.shift();
        }
        setHseCnsmpPred([...hseCnsmpPred]);
      });

      // House energy generation
      ApiService.getHseGen(hhId).then((ret) => {
        hseGen.push(ret.data);
        if (hseGen.length >= 12) {
          hseGen.shift();
        }
        setHseGen([...hseGen]);

        if (hseGen.length > 1) {
          setHseGenDelta(
            hseGen[hseGen.length - 1].powerAmount -
              hseGen[hseGen.length - 2].powerAmount,
          );
        }
      });

      // House energy generation prediction
      ApiService.getHseGenPred(hhId).then((ret) => {
        hseGenPred.push(ret.data);
        if (hseGenPred.length >= 12) {
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
    <motion.div
      className="grid grid-cols-4 gap-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <EnergyCard
        title="Solar energy"
        subtitle={
          hseGen.length === 0
            ? loadingHint
            : `${hseGen.at(hseGen.length - 1)?.powerAmount}${energyUnit}`
        }
        delta={hseGenDelta}
        icon={
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 50, repeat: Infinity }}
          >
            <Sun className="h-full w-full text-muted-foreground" />
          </motion.div>
        }
      />

      <EnergyCard
        title="House consumption"
        subtitle={
          hseCnsmp.length === 0
            ? loadingHint
            : `${hseCnsmp.at(hseCnsmp.length - 1)?.totalConsumeAmount}${energyUnit}`
        }
        delta={hseCnsmpDelta}
        icon={<Home className="h-full w-full text-muted-foreground" />}
      />

      <EnergyCard
        title="Battery storage"
        subtitle={
          locStor === undefined
            ? loadingHint
            : `${Math.floor((locStor.currentPowerAmount / locStor.capacity) * 100)}%`
        }
        icon={
          <div className="relative">
            <Battery className="h-full w-full text-muted-foreground" />
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                duration: 1,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            >
              <BatteryCharging className="h-full w-full text-muted-foreground absolute top-0" />
            </motion.div>
          </div>
        }
      />

      <EnergyCard
        title={`${currentHouse?.householdName}'s house - ${toTitleCase(insertSpaces(HouseholdType[currentHouse?.householdType ?? 0]))}`}
        subtitle={`${currentHouse?.area} ft²`}
        icon={<Info className="h-full w-full text-muted-foreground" />}
      />

      <CnsmpChart hseCnsmps={hseCnsmp} />
      <CnsmpPredChart hseCnsmpPred={hseCnsmpPred} />

      <GenChart hseGen={hseGen} />
      <GenPredChart hseGenPred={hseGenPred} />
    </motion.div>
  );
}
