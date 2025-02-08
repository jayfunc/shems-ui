import Base from "./base";

/**
 * Local(House) Power Storage Model
 */
export default class LocStor extends Base {
	houseId: bigint;
	currentPowerAmount: number; // unit: Wh
	capacity: number; // unit: Wh
	powerInput: number; // unit: W
	powerOutput: number; // unit: W

	constructor(
		id: bigint,
		houseId: bigint,
		currentPowerAmount: number,
		capacity: number,
		powerInput: number,
		powerOutput: number,
		simulationTime: string,
	) {
		super(id, simulationTime);
		this.houseId = houseId;
		this.currentPowerAmount = currentPowerAmount;
		this.capacity = capacity;
		this.powerInput = powerInput;
		this.powerOutput = powerOutput;
	}
}