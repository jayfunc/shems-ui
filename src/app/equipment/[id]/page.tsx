import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
import { Chart } from "./chart";

export default async function Page({
	params,
}: {
	params: Promise<{ id: number }>
}) {
	const id = (await params).id
	return (
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
	);
}
