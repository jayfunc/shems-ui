import Base from "./base";

/**
 * House Power Generation
 */
export default class HseGen extends Base {
  houseId: bigint;
  data: number;
  dateTime: Date;

  constructor(
    id: bigint,
    houseId: bigint,
    data: number,
    dateTime: Date,
    simulationTime: string,
  ) {
    super(id, simulationTime);
    this.houseId = houseId;
    this.data = data;
    this.dateTime = dateTime;
  }
}
