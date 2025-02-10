import Base from "./base";

/**
 * House Power Consumption Model
 */
export default class HseCnsmp extends Base {
  houseId: bigint;
  totalConsumeAmount: number;
  mainGridConsumeAmount: number;
  communityGridConsumeAmount: number;
  powerStorageConsumeAmount: number;
  solarPanelConsumeAmount: number;
  consumeTime: Date;

  constructor(
    id: bigint,
    houseId: bigint,
    totalConsumeAmount: number,
    mainGridConsumeAmount: number,
    communityGridConsumeAmount: number,
    powerStorageConsumeAmount: number,
    solarPanelConsumeAmount: number,
    consumeTime: Date,
    simulationTime: string,
  ) {
    super(id, simulationTime);
    this.houseId = houseId;
    this.totalConsumeAmount = totalConsumeAmount;
    this.mainGridConsumeAmount = mainGridConsumeAmount;
    this.communityGridConsumeAmount = communityGridConsumeAmount;
    this.powerStorageConsumeAmount = powerStorageConsumeAmount;
    this.solarPanelConsumeAmount = solarPanelConsumeAmount;
    this.consumeTime = consumeTime;
  }
}
