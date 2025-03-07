export default class UnitConverter {
  private units: { [key: string]: number };

  private sourceUnitIndex: number;
  private targetUnitIndex: number;

  private sourceUnitValue: number;
  private targetUnitValue: number;

  constructor(
    units: { [key: string]: number },
    sourceUnitValue: number,
    targetUnitValue: number,
  ) {
    this.units = units;

    this.sourceUnitIndex = Object.values(units).indexOf(sourceUnitValue);
    this.targetUnitIndex = Object.values(units).indexOf(targetUnitValue);

    this.sourceUnitValue = Object.values(units)[this.sourceUnitIndex];
    this.targetUnitValue = Object.values(units)[this.targetUnitIndex];
  }

  format(value?: number, fractionDigits?: number): number | undefined {
    // Check if value is null or undefined
    if (value == null) {
      return undefined;
    }
    return parseFloat(
      (value / (this.targetUnitValue / this.sourceUnitValue)).toFixed(
        fractionDigits ?? 2,
      ),
    );
  }

  formatInNumber(value?: number, fractionDigits?: number): number {
    return this.format(value, fractionDigits) ?? 0;
  }

  formatInString(value?: number, fractionDigits?: number): string {
    return `${this.format(value, fractionDigits) ?? "-"}`;
  }

  formatInStringWithUnit(value?: number, fractionDigits?: number): string {
    return `${this.formatInString(value, fractionDigits)} ${this.getTargetUnit()}`;
  }

  getTargetUnit(): string {
    return Object.keys(this.units)[this.targetUnitIndex];
  }
}
