import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
import { CnsmpsChart } from "./cnsmps-chart";

export default async function Page({
	params,
}: {
	params: Promise<{ applId: number }>
}) {
	const applId = (await params).applId;

	return (
		<div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
			<Card className="lg:col-span-full">
				<CardHeader>
					<CardTitle>Usage</CardTitle>
					<CardDescription>Power usage by hours</CardDescription>
				</CardHeader>
				<CardContent>
					<CnsmpsChart applId={applId} />
				</CardContent>
			</Card>
		</div>
	);
}
