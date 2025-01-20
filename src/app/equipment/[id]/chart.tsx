"use client";

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
	ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";
import { Usage } from "@/app/models/usage";

function getUsage(): Usage[] {
	const usage: Usage[] = [];
	for (let i = 0; i < 12; i++) {
		usage.push({ month: `${i + 1}`, usage: `${Math.floor(Math.random() * 1000)}` });
	}
	return usage;
}

const chartConfig = {
	desktop: {
		label: "Usage",
		color: "hsl(var(--chart-1))",
	},
} satisfies ChartConfig;

export function Chart() {
	return (
		<ChartContainer config={chartConfig} className="max-h-[70vh] w-full">
			<BarChart accessibilityLayer data={getUsage()}>
				<CartesianGrid vertical={false} />
				<XAxis
					dataKey="month"
					tickLine={false}
					tickMargin={10}
					axisLine={false}
					tickFormatter={(value) => value.slice(0, 3)}
				/>
				<ChartTooltip
					cursor={false}
					content={<ChartTooltipContent hideLabel />}
				/>
				<Bar dataKey="usage" fill="var(--color-desktop)" radius={8} />
			</BarChart>
		</ChartContainer>
	);
}
