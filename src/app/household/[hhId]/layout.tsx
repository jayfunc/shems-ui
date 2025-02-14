"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { AppTopbar } from "@/components/app-topbar";
import { Placeholder } from "@/components/placeholder";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { routing } from "@/constants/constants";
import { Home, CircuitBoard, ChartCandlestick, UtilityPole } from "lucide-react";
import { motion } from "motion/react";
import { usePathname } from "next/navigation";
import { Suspense } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const curPathname = usePathname();
  const hhPathname = curPathname.substring(
    0,
    curPathname.indexOf("/", `/${routing.household}/`.length),
  );

  const menuItems = [
    {
      title: "Dashboard",
      url: `${hhPathname}/${routing.dashboard}`,
      icon: Home,
    },
    {
      title: "Appliance",
      url: `${hhPathname}/${routing.appliance}`,
      icon: CircuitBoard,
    },
    {
      title: "Grid",
      url: `${hhPathname}/${routing.grid}`,
      icon: UtilityPole,
    },
    {
      title: "Trading",
      url: `${hhPathname}/${routing.trading}`,
      icon: ChartCandlestick,
    },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <SidebarProvider>
        <AppSidebar menuItems={menuItems} />
        <SidebarInset>
          <AppTopbar />
          <Suspense fallback={<Placeholder />}>
            <div className="relative p-4 lg:px-24">
              {children}
            </div>
          </Suspense>
        </SidebarInset>
      </SidebarProvider>
    </motion.div>
  );
}
