"use client";

import { AppSidebar } from "@/components/ui/app-sidebar";
import { AppTopbar } from "@/components/ui/app-topbar";
import { LoadingPlaceholder } from "@/components/ui/loading-placeholder";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/toaster";
import { routing } from "@/constants/routing";
import { Home, CircuitBoard, ChartCandlestick } from "lucide-react";
import { usePathname } from "next/navigation";
import { Suspense } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
	const curPathname = usePathname();
	const hhPathname = curPathname.substring(0, curPathname.indexOf('/', `/${routing.household}/`.length));

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
			title: "Trading",
			url: `${hhPathname}/${routing.trading}`,
			icon: ChartCandlestick,
		},
	];

	return (
		<SidebarProvider>
			<AppSidebar menuItems={menuItems} />
			<SidebarInset>
				<AppTopbar />
				<Suspense fallback={<LoadingPlaceholder />}>
					<div className="relative p-4 lg:px-24">
						{children}
					</div>
					<Toaster />
				</Suspense>
			</SidebarInset>
		</SidebarProvider>
	);
}