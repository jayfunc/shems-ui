import Base from "./base";

export enum HouseholdType {
	BigFamily = 2,
	SignalFamily = 1,
	SmallFamily = 0
}

/**
 * House Model
 */
export default class Hse extends Base {
	area?: number; // unit: sqft
	latitude: number;
	longitude: number;
	householdType: HouseholdType;
	householdName: string;

	constructor(
		id: bigint,
		latitude: number,
		longitude: number,
		householdType: HouseholdType,
		householdName: string,
		simulationTime: string,
		area?: number,
	) {
		super(id, simulationTime);
		this.latitude = latitude;
		this.longitude = longitude;
		this.householdType = householdType;
		this.householdName = householdName;
		this.area = area;
	}
}