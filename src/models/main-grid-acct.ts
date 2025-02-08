import Base from "./base";

export default class MainGridAcct extends Base {
  houseId: bigint;
  onPeakPowerUsage: number;
  midPeakPowerUsage: number;
  offPeakPowerUsage: number;

  constructor(
    id: bigint,
    houseId: bigint,
    onPeakPowerUsage: number,
    midPeakPowerUsage: number,
    offPeakPowerUsage: number,
    simulationTime: string,
  ) {
    super(id, simulationTime);
    this.houseId = houseId;
    this.onPeakPowerUsage = onPeakPowerUsage;
    this.midPeakPowerUsage = midPeakPowerUsage;
    this.offPeakPowerUsage = offPeakPowerUsage;
  }
}