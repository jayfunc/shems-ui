import Base from "./base";

export enum MainGridCfgStatus {
  Normal = 0,
  PowerOutage = 1,
}

export enum MainGridCfgSignal {
  Normal = 0,
  PeakShaveSignal = 1,
}

export default class MainGridCfg extends Base {
  status: MainGridCfgStatus;
  signal: MainGridCfgSignal;
  onPeakPrice: number;
  midPeakPrice: number;
  offPeakPrice: number;
  onPeakHour: number[];
  midPeakHour: number[];
  offPeakHour: number[];

  constructor(
    id: bigint,
    status: MainGridCfgStatus,
    signal: MainGridCfgSignal,
    onPeakPrice: number,
    midPeakPrice: number,
    offPeakPrice: number,
    onPeakHour: number[],
    midPeakHour: number[],
    offPeakHour: number[],
    simulationTime: Date,
  ) {
    super(id, simulationTime);
    this.status = status;
    this.signal = signal;
    this.onPeakPrice = onPeakPrice;
    this.midPeakPrice = midPeakPrice;
    this.offPeakPrice = offPeakPrice;
    this.onPeakHour = onPeakHour;
    this.midPeakHour = midPeakHour;
    this.offPeakHour = offPeakHour;
  }
}
