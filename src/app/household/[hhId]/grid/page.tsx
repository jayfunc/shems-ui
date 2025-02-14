"use client";

import UotPriceChart from "../grid/uot-price-chart";
import MainGridUsageChart from "../grid/main-grid-usage-chart";
import {
  routing,
} from "@/constants/constants";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";

export default function Trading() {
  const hhId = parseInt(
    usePathname()
      .replace(routing.household, "")
      .replace(routing.trading, "")
      .replaceAll("/", ""),
  );

  return (
    <motion.div className="grid grid-cols-2 gap-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>

      <MainGridUsageChart hhId={hhId} />

      <UotPriceChart />

      {/* <NeonGradientCard className="items-center justify-center text-center col-span-full" borderSize={0}>
        <div className="min-h-[30vh] bg-transparent"></div>
      </NeonGradientCard> */}

    </motion.div>
  );
}
