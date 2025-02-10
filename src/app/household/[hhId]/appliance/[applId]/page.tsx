import { CnsmpsChart } from "./cnsmps-chart";
import Detail from "./detail";

export default async function Page({
	params,
}: {
	params: Promise<{ applId: number }>
}) {
	const applId = (await params).applId;

	return (
		<div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
			<Detail applId={applId} />
			<CnsmpsChart applId={applId} />
		</div>
	);
}
