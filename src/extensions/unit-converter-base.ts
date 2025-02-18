import { fractionDigits } from "@/constants/constants";

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

  format(value?: number): number | undefined {
    // Check if value is null or undefined
    if (value == null || Number.isNaN(value)) {
      return undefined;
    }
    return parseFloat(
      (value / (this.targetUnitValue / this.sourceUnitValue)).toFixed(
        fractionDigits,
      ),
    );
  }

  formatInNumber(value?: number): number {
    return this.format(value) ?? 0;
  }

  formatInString(value?: number): string {
    return `${this.format(value) ?? "-"}`;
  }

  formatInStringWithUnit(value?: number): string {
    return `${this.formatInString(value)} ${this.getTargetUnit()}`;
  }

  getTargetUnit(): string {
    return Object.keys(this.units)[this.targetUnitIndex];
  }
}
