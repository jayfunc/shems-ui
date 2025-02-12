"use client";

import UotPriceChart from "../grid/uot-price-chart";
import MainGridUsageChart from "../grid/main-grid-usage-chart";
import {
  routing,
} from "@/constants/constants";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";

const chartConfig = {
  onPeak: {
    label: "On-peak",
    theme: { light: "hsl(var(--lime-600))", dark: "hsl(var(--teal-700))" },
  },
  midPeak: {
    label: "Mid-peak",
    theme: { light: "hsl(var(--lime-700))", dark: "hsl(var(--teal-600))" },
  },
  offPeak: {
    label: "Off-peak",
    theme: { light: "hsl(var(--lime-800))", dark: "hsl(var(--teal-800))" },
  },
};

export default function Trading() {
  const hhId = parseInt(
    usePathname()
      .replace(routing.household, "")
      .replace(routing.trading, "")
      .replaceAll("/", ""),
  );

  return (
    <motion.div className="grid grid-cols-2 gap-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>

      <MainGridUsageChart hhId={hhId} chartConfig={chartConfig} />

      <UotPriceChart chartConfig={chartConfig} />

      {/* <NeonGradientCard className="items-center justify-center text-center col-span-full" borderSize={0}>
        <div className="min-h-[30vh] bg-transparent"></div>
      </NeonGradientCard> */}

    </motion.div>
  );
}
