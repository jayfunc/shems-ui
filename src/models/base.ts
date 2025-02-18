export default class Base {
  id: bigint;
  simulationTime: Date;

  constructor(id: bigint, simulationTime: Date) {
    this.id = id;
    this.simulationTime = simulationTime;
  }
}
