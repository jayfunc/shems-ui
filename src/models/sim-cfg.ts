import Base from "./base";

/**
 * Simulation Config Model
 */
export default class SimCfg extends Base {
  simulationTimeStart: Date;
  simulationTimeEnd: Date;

  constructor(
    id: bigint,
    simulationTimeStart: Date,
    simulationTimeEnd: Date,
    simulationTime: string,
  ) {
    super(id, simulationTime);
    this.simulationTimeStart = simulationTimeStart;
    this.simulationTimeEnd = simulationTimeEnd;
  }
}
