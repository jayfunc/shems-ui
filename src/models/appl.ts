import Base from "./base";

export enum ApplianceStatus {
  On = 1,
  Off = 0,
}

export enum AppliancePriority {
  HighPriority = 0,
  MediumPriority = 1,
  LowPriority = 2,
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
  status: ApplianceStatus;

  constructor(
    id: bigint,
    houseId: bigint,
    name: string,
    applianceType: ApplianceType,
    priority: AppliancePriority,
    status: ApplianceStatus,
    simulationTime: Date,
  ) {
    super(id, simulationTime);
    this.houseId = houseId;
    this.name = name;
    this.applianceType = applianceType;
    this.priority = priority;
    this.status = status;
  }
}
