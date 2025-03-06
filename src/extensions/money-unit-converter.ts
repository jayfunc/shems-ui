import UnitConverter from "./unit-converter-base";

enum MoneyUnit {
  custom = 0.1,
  c = 1,
  $ = 100,
}

class MoneyUnitConverter extends UnitConverter {
  override formatInStringWithUnit(
    value?: number,
    fractionDigits?: number,
  ): string {
    return `CA${this.getTargetUnit()} ${this.formatInString(value, fractionDigits)}`;
  }
}

const moneyUnitConverter = new MoneyUnitConverter(
  {
    custom: MoneyUnit.custom,
    c: MoneyUnit.c,
    $: MoneyUnit.$,
  },
  MoneyUnit.custom,
  MoneyUnit.$,
);

export default moneyUnitConverter;
