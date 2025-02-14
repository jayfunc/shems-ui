import Base from "./base";

/**
 * House Power Generation Prediction Model
 */
export default class HseGenPred extends Base {
  householdType: number;
  dateTime: Date;
  data: number;

  constructor(
    id: bigint,
    householdType: number,
    dateTime: Date,
    data: number,
    simulationTime: Date,
  ) {
    super(id, simulationTime);
    this.householdType = householdType;
    this.dateTime = dateTime;
    this.data = data;
  }
}
