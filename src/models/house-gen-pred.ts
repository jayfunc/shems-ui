import Base from "./base";

/**
 * House Power Generation Prediction Model
 */
export default class HouseGenPred extends Base {
  householdType: number;
  predictTime: Date;
  solar: number;

  constructor(
    id: bigint,
    householdType: number,
    predictTime: Date,
    solar: number,
    simulationTime: Date,
  ) {
    super(id, simulationTime);
    this.householdType = householdType;
    this.predictTime = predictTime;
    this.solar = solar;
  }
}
