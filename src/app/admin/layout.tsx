"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { AppTopbar } from "@/components/app-topbar";
import { Placeholder } from "@/components/placeholder";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { adminUsername, routing } from "@/constants/constants";
import formatText from "@/extensions/string";
import Hse, { HouseholdType } from "@/models/hse";
import { Home } from "lucide-react";
import { motion } from "motion/react";
import { usePathname } from "next/navigation";
import { Suspense } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
	const curPathname = usePathname();
	const mainPathname = `/${routing.admin}`;
	const selectedRouting = curPathname.replace(mainPathname, "").split("/")[1];

	const menuItems = [
		{
			title: "Dashboard",
			subRouting: routing.dashboard,
			icon: Home,
		},
	];

	const hse = new Hse(BigInt(0), 0, 0, HouseholdType.Admin, formatText(adminUsername), new Date());

	return (
		<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
			<SidebarProvider>
				<AppSidebar mainRouting={mainPathname} selectedRouting={selectedRouting} menuItems={menuItems} hse={hse} />
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
