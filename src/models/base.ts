export default class Base {
	id: bigint;
	simulationTime: string;

	constructor(
		id: bigint,
		simulationTime: string,
	) {
		this.id = id;
		this.simulationTime = simulationTime;
	}
}