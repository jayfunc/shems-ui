import Base from "./base";

/**
 * Appliance Power Consumption Model
 */
export default class ApplCnsmp extends Base {
  houseId: bigint;
  powerConsumeId: bigint;
  applianceId: bigint; // 0 represents power storage
  data: number;
  dateTime: Date;

  constructor(
    id: bigint,
    houseId: bigint,
    powerConsumeId: bigint,
    applianceId: bigint,
    data: number,
    dateTime: Date,
    simulationTime: string,
  ) {
    super(id, simulationTime);
    this.houseId = houseId;
    this.powerConsumeId = powerConsumeId;
    this.applianceId = applianceId;
    this.data = data;
    this.dateTime = dateTime;
  }
}
