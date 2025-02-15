import Base from "./base";

export enum HouseholdType {
  Admin = 0,
  ExtraLarge = 1,
  Large = 2,
  Medium = 3,
  Small = 4,
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
    simulationTime: Date,
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
