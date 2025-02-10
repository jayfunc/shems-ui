import Base from "./base";

/**
 * House Power Generation Prediction Model
 */
export default class HseGenPred extends Base {
  householdType: number;
  predictTime: Date;
  solar: number;

  constructor(
    id: bigint,
    householdType: number,
    predictTime: Date,
    solar: number,
    simulationTime: string,
  ) {
    super(id, simulationTime);
    this.householdType = householdType;
    this.predictTime = predictTime;
    this.solar = solar;
  }
}
