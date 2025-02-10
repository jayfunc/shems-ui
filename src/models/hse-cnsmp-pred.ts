import Base from "./base";

/**
 * House Power Consumption Prediction Model
 */
export default class HseCnsmpPred extends Base {
  householdType: number;
  predictTime: Date;
  furnace1: number;
  furnace2: number;
  dishwasher: number;
  fridge1: number;
  fridge2: number;
  electricRange1: number;
  electricRange2: number;
  television: number;
  computer: number;
  washerAndDryerSet: number;
  wineCellar: number;
  waterHeater: number;
  airConditioner: number;

  constructor(
    id: bigint,
    householdType: number,
    predictTime: Date,
    furnace1: number,
    furnace2: number,
    dishwasher: number,
    fridge1: number,
    fridge2: number,
    electricRange1: number,
    electricRange2: number,
    television: number,
    computer: number,
    washerAndDryerSet: number,
    wineCellar: number,
    waterHeater: number,
    airConditioner: number,
    simulationTime: string,
  ) {
    super(id, simulationTime);
    this.householdType = householdType;
    this.predictTime = predictTime;
    this.furnace1 = furnace1;
    this.furnace2 = furnace2;
    this.dishwasher = dishwasher;
    this.fridge1 = fridge1;
    this.fridge2 = fridge2;
    this.electricRange1 = electricRange1;
    this.electricRange2 = electricRange2;
    this.television = television;
    this.computer = computer;
    this.washerAndDryerSet = washerAndDryerSet;
    this.wineCellar = wineCellar;
    this.waterHeater = waterHeater;
    this.airConditioner = airConditioner;
  }
}
