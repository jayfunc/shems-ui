import { fractionDigits } from "@/constants/constants";

enum EnergyUnit {
	Wh = 1,
	kWh = 1000,
}

const sourceEnergyUnit = EnergyUnit.Wh;
const targetEnergyUnit = EnergyUnit.kWh;

export default function formatEnergy(value?: number, showUnit = true): string {
	if (!value) {
		return "-";
	}
	return `${(value / (targetEnergyUnit / sourceEnergyUnit)).toFixed(fractionDigits)} ${showUnit ? getTargetEnergyUnit() : ''}`;
}

export function getTargetEnergyUnit(): string {
	return EnergyUnit[targetEnergyUnit];
};