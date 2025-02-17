import Base from "./base";

/**
 * House Power Generation
 */
export default class HseGen extends Base {
  houseId: bigint;
  powerAmount: number;
  generateTime: Date;

  constructor(
    id: bigint,
    houseId: bigint,
    powerAmount: number,
    generateTime: Date,
    simulationTime: Date,
  ) {
    super(id, simulationTime);
    this.houseId = houseId;
    this.powerAmount = powerAmount;
    this.generateTime = generateTime;
  }
}
