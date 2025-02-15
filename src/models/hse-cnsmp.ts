import Base from "./base";

/**
 * House Power Consumption Model
 */
export default class HseCnsmp extends Base {
  houseId: bigint;
  /**
   * Total consumption
   */
  data: number;
  mainGridConsumeAmount: number;
  mainGridOnPeakConsumeAmount: number;
  mainGridMidPeakConsumeAmount: number;
  mainGridOffPeakConsumeAmount: number;
  communityGridConsumeAmount: number;
  powerStorageConsumeAmount: number;
  solarPanelConsumeAmount: number;
  dateTime: Date;

  constructor(
    id: bigint,
    houseId: bigint,
    data: number,
    mainGridConsumeAmount: number,
    mainGridOnPeakConsumeAmount: number,
    mainGridMidPeakConsumeAmount: number,
    mainGridOffPeakConsumeAmount: number,
    communityGridConsumeAmount: number,
    powerStorageConsumeAmount: number,
    solarPanelConsumeAmount: number,
    dateTime: Date,
    simulationTime: Date,
  ) {
    super(id, simulationTime);
    this.houseId = houseId;
    this.data = data;
    this.mainGridConsumeAmount = mainGridConsumeAmount;
    this.communityGridConsumeAmount = communityGridConsumeAmount;
    this.mainGridOnPeakConsumeAmount = mainGridOnPeakConsumeAmount;
    this.mainGridMidPeakConsumeAmount = mainGridMidPeakConsumeAmount;
    this.mainGridOffPeakConsumeAmount = mainGridOffPeakConsumeAmount;
    this.powerStorageConsumeAmount = powerStorageConsumeAmount;
    this.solarPanelConsumeAmount = solarPanelConsumeAmount;
    this.dateTime = dateTime;
  }
}
