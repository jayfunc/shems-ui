"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { AppTopbar } from "@/components/app-topbar";
import { Placeholder } from "@/components/placeholder";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import routing from "@/constants/routing";
import House from "@/models/house";
import ApiUriBuilder from "@/services/api";
import {
  Home,
  CircuitBoard,
  ChartCandlestick,
  UtilityPole,
} from "lucide-react";
import { motion } from "motion/react";
import { usePathname } from "next/navigation";
import { Suspense } from "react";
import useSWR from "swr";

export default function Layout({ children }: { children: React.ReactNode }) {
  const curPathname = usePathname();
  const hhPathname = curPathname.substring(
    0,
    curPathname.indexOf("/", `/${routing.household}/`.length),
  );
  const hhId = parseInt(hhPathname.split("/").at(-1) ?? "");
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
    // {
    //   title: "Settings",
    //   subRouting: routing.settings,
    //   icon: Settings2,
    // },
  ];

  const { data: house } = useSWR<House>(ApiUriBuilder.buildGetHouseUri(hhId));

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <SidebarProvider>
        <AppSidebar
          mainRouting={hhPathname}
          selectedRouting={selectedRouting}
          menuItems={menuItems}
          house={house}
        />
        <SidebarInset>
          <AppTopbar />
          <div className="relative p-4 lg:px-24">
            <Suspense fallback={<Placeholder />}>{children}</Suspense>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </motion.div>
  );
}
