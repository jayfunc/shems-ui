import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
import {
	ChartConfig,
} from "@/components/ui/chart"
import { Chart } from "./chart"

const chartData = [
	{ month: "January", desktop: 186 },
	{ month: "February", desktop: 305 },
	{ month: "March", desktop: 237 },
	{ month: "April", desktop: 73 },
	{ month: "May", desktop: 209 },
	{ month: "June", desktop: 214 },
]

const chartConfig = {
	desktop: {
		label: "Desktop",
		color: "hsl(var(--chart-1))",
	},
} satisfies ChartConfig

export default async function Page({
	params,
}: {
	params: Promise<{ id: number }>
}) {
	const id = (await params).id
	return (
		<div className="grid gap-4">
			<Card>
				<CardHeader>
					<CardTitle>Equipment {id}</CardTitle>
				</CardHeader>
				<CardContent className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
					<div className="grid grid-cols-2 gap-4">
						<Card>
							<CardHeader>
								<CardTitle>Details</CardTitle>
								<CardDescription>Equipment description</CardDescription>
							</CardHeader>
							<CardContent>
							</CardContent>
						</Card>
						<Card>
							<CardHeader>
								<CardTitle>Area</CardTitle>
								<CardDescription>Area description</CardDescription>
							</CardHeader>
							<CardContent>
							</CardContent>
						</Card>
						<Card>
							<CardHeader>
								<CardTitle>Location</CardTitle>
								<CardDescription>Location description</CardDescription>
							</CardHeader>
							<CardContent>
							</CardContent>
						</Card>
					</div>
					<Card>
						<CardHeader>
							<CardTitle>Usage</CardTitle>
							<CardDescription>Electrical usage by month</CardDescription>
						</CardHeader>
						<CardContent>
							<Chart />
						</CardContent>
					</Card>
				</CardContent>
			</Card>
		</div>
	);
}
