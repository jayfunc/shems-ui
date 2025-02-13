import { fractionDigits } from "@/constants/constants";

enum EnergyUnit {
	Wh = 1,
	kWh = 1000,
}

const sourceEnergyUnit = EnergyUnit.Wh;
const targetEnergyUnit = EnergyUnit.kWh;

export default function formatEnergy(value?: number): number {
	if (!value) {
		return 0;
	}
	return parseFloat((value / (targetEnergyUnit / sourceEnergyUnit)).toFixed(fractionDigits));
}

export function getTargetEnergyUnit(): string {
	return EnergyUnit[targetEnergyUnit];
};