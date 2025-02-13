import Base from "./base";

export enum MainGridCfgStatus {
  Normal = 1,
  PowerOutage = 0,
}

export enum MainGridCfgSignal {
  Normal = 0,
  PeakClippingSignal = 1,
  ValleyFillSignal = 2,
}

export default class MainGridCfg extends Base {
  status: MainGridCfgStatus; // 1: normal, 0: power outage
  signal: MainGridCfgSignal; // 0: normal, 1: Peak Clipping Signal, 2: Valley Fill Signal
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
    simulationTime: string,
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
