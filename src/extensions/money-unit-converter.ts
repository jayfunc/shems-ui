import UnitConverter from "./unit-converter-base";

enum MoneyUnit {
  c = 1,
  $ = 100,
}

class MoneyUnitConverter extends UnitConverter {
  override formatInStringWithUnit(value?: number): string {
    return `${this.getTargetUnit()} ${this.formatInString(value)} CAD`;
  }
}

const moneyUnitConverter = new MoneyUnitConverter(
  {
    c: MoneyUnit.c,
    $: MoneyUnit.$,
  },
  MoneyUnit.c,
  MoneyUnit.$,
);

export default moneyUnitConverter;
