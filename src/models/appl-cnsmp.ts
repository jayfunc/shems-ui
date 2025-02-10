import Base from "./base";

/**
 * Appliance Power Consumption Model
 */
export default class ApplCnsmp extends Base {
  houseId: bigint;
  powerConsumeId: bigint;
  applianceId: bigint; // 0 represents power storage
  consumeAmount: number;
  consumeTime: Date;

  constructor(
    id: bigint,
    houseId: bigint,
    powerConsumeId: bigint,
    applianceId: bigint,
    consumeAmount: number,
    consumeTime: Date,
    simulationTime: string,
  ) {
    super(id, simulationTime);
    this.houseId = houseId;
    this.powerConsumeId = powerConsumeId;
    this.applianceId = applianceId;
    this.consumeAmount = consumeAmount;
    this.consumeTime = consumeTime;
  }
}
