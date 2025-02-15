import Base from "./base";

/**
 * Local(House) Power Storage Model
 */
export default class LocStor extends Base {
  houseId: bigint;
  currentPowerAmount: number; // unit: Wh
  capacity: number; // unit: Wh
  currentPowerAmountPercentage: number; // unit: %
  powerInput: number; // unit: W
  powerOutput: number; // unit: W

  constructor(
    id: bigint,
    houseId: bigint,
    currentPowerAmount: number,
    capacity: number,
    currentPowerAmountPercentage: number,
    powerInput: number,
    powerOutput: number,
    simulationTime: Date,
  ) {
    super(id, simulationTime);
    this.houseId = houseId;
    this.currentPowerAmount = currentPowerAmount;
    this.capacity = capacity;
    this.currentPowerAmountPercentage = currentPowerAmountPercentage;
    this.powerInput = powerInput;
    this.powerOutput = powerOutput;
  }
}
