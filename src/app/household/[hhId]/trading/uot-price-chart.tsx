"use client"

import { Pie, PieChart } from "recharts"

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
import {
	ChartConfig,
	ChartContainer,
	ChartLegend,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart"
import MainGridCfg from "@/models/main-grid-cfg"
import { useEffect, useState } from "react"
import ApiService from "@/services/api"
import { autoRefreshInterval } from "@/constants/routing"

export default function UotPriceChart({ chartConfig }: { chartConfig: ChartConfig }) {

	function hoursDelta(value?: string): number {
		if (!value) return 0;
		const [start, end] = value.split("-").map((x) => parseInt(x));
		return (end - start + 24) % 24;
	}

	const [mainGridCfg, setMainGridCfg] = useState<MainGridCfg>();

	useEffect(() => {
		const fetchData = async () => {
			ApiService.getMainGridCfg().then((res) => {
				setMainGridCfg(res.data);
			});
		};

		fetchData();

		const interval = setInterval(() => {
			fetchData();
		}, autoRefreshInterval);

		return () => clearInterval(interval);
	}, []);

	return (
		<Card>
			<CardHeader>
				<CardTitle>Electricity time-of-use price periods</CardTitle>
				<CardDescription>Current time-of-use price periods</CardDescription>
			</CardHeader>
			<CardContent className="relative">
				<ChartContainer
					config={chartConfig}
					className="mx-auto max-h-[250px] [&_.recharts-pie-label-text]:fill-foreground"
				>
					<PieChart>
						<ChartTooltip content={<ChartTooltipContent hideLabel />} />
						<Pie data={[
							{ section: `On-peak (${mainGridCfg?.onPeakHour})`, hours: hoursDelta(mainGridCfg?.onPeakHour), fill: "var(--color-onPeak)" },
							{ section: `Mid-peak (${mainGridCfg?.midPeakHour})`, hours: hoursDelta(mainGridCfg?.midPeakHour), fill: "var(--color-midPeak)" },
							{ section: `Off-peak (${mainGridCfg?.offPeakHour})`, hours: hoursDelta(mainGridCfg?.offPeakHour), fill: "var(--color-offPeak)" },
						]} dataKey="hours" nameKey="section" />
						<ChartLegend />
					</PieChart>
				</ChartContainer>
			</CardContent>
		</Card>
	)
}