import Base from "./base";
export enum AppliancePriority {
  HighPriority,
  MediumPriority,
  LowPriority,
}

export enum ApplianceType {
  Others,
  Furnace,
  Dishwasher,
  Fridge,
  ElectricRange,
  Television,
  Computer,
  WashMachine,
  WineCeller,
  WaterHeater,
  AirCondictioner,
}

/**
 * Appliance Model
 */
export default class Appl extends Base {
  houseId: bigint;
  name: string;
  applianceType: ApplianceType;
  priority: AppliancePriority;

  constructor(
    id: bigint,
    houseId: bigint,
    name: string,
    applianceType: ApplianceType,
    priority: AppliancePriority,
    simulationTime: string,
  ) {
    super(id, simulationTime);
    this.houseId = houseId;
    this.name = name;
    this.applianceType = applianceType;
    this.priority = priority;
  }
}
