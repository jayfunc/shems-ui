"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { AppTopbar } from "@/components/app-topbar";
import { Placeholder } from "@/components/placeholder";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { routing } from "@/constants/constants";
import Hse from "@/models/hse";
import ApiService from "@/services/api";
import { Home, CircuitBoard, ChartCandlestick, UtilityPole } from "lucide-react";
import { motion } from "motion/react";
import { usePathname } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const curPathname = usePathname();
  const hhPathname = curPathname.substring(
    0,
    curPathname.indexOf("/", `/${routing.household}/`.length),
  );
  const hhId = parseInt(hhPathname.split("/").at(-1) ?? '');
  const selectedRouting = curPathname.replace(hhPathname, "").split("/")[1];

  const menuItems = [
    {
      title: "Dashboard",
      subRouting: routing.dashboard,
      icon: Home,
    },
    {
      title: "Appliance",
      subRouting: routing.appliance,
      icon: CircuitBoard,
    },
    {
      title: "Grid",
      subRouting: routing.grid,
      icon: UtilityPole,
    },
    {
      title: "Trading",
      subRouting: routing.trading,
      icon: ChartCandlestick,
    },
  ];

  const [hse, setHse] = useState<Hse>();

  useEffect(() => {
    ApiService.getHse(hhId).then((ret) => {
      setHse(ret.data);
    });
  });

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <SidebarProvider>
        <AppSidebar mainRouting={hhPathname} selectedRouting={selectedRouting} menuItems={menuItems} hse={hse} />
        <SidebarInset>
          <AppTopbar />
          <div className="relative p-4 lg:px-24">
            <Suspense fallback={<Placeholder />}>
              {children}
            </Suspense>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </motion.div>
  );
}
