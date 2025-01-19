"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, XAxis, YAxis } from "recharts"
import {
	ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart"
import EquipmentService from "@/app/services/equipment"
import { Equipment } from "@/app/models/equipment"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import UotPriceChart from "./uot-price-chart";
import { motion } from "motion/react";

export default function UsageSummaryPage() {
	const [data, setData] = useState<Equipment[]>([]);

	useEffect(() => {
		EquipmentService.getEquipment().then((data) => {
			setData(data);
		});
	}, []);

	return (
		<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid md:grid-cols-1 lg:grid-cols-2 gap-4">
			<Card>
				<CardHeader>
					<CardTitle>Usage summary</CardTitle>
					<CardDescription>Summary of equipment usage</CardDescription>
				</CardHeader>
				<CardContent>
					<ChartContainer config={{
						usage: {
							label: "Usage",
							color: "hsl(var(--chart-1))",
						},
					}}
						className="max-h-[30vh] w-full">
						<BarChart
							accessibilityLayer
							data={data.sort((a, b) => parseInt(b.usage) - parseInt(a.usage)).slice(0, 5)}
							layout="vertical"
						>
							<XAxis type="number" dataKey="usage" hide />
							<YAxis
								dataKey="name"
								type="category"
								tickLine={false}
								tickMargin={10}
								axisLine={false}
								tickFormatter={(value) => value.slice(0, 3)}
							/>
							<ChartTooltip
								cursor={false}
								content={<ChartTooltipContent hideLabel />}
							/>
							<Bar dataKey="usage" fill="var(--color-usage)" radius={5} />
						</BarChart>
					</ChartContainer>
				</CardContent>
			</Card>
			<UotPriceChart />
			<Card>
				<CardHeader>
					<CardTitle>Suggestions</CardTitle>
					<CardDescription>Recommendations for energy savings</CardDescription>
				</CardHeader>
				<CardContent className="grid grid-cols-2 gap-4">
					<Card>
						<CardHeader>
							<CardTitle>Optimal working hours</CardTitle>
							<CardDescription>9 A.M. - 5 P.M.</CardDescription>
						</CardHeader>
						<CardContent>
							<Button className="w-full">Set schedule</Button>
						</CardContent>
					</Card>
				</CardContent>
			</Card>
		</motion.div>
	)
}
