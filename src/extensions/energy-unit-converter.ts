import UnitConverter from "./unit-converter-base";

enum EnergyUnit {
	Wh = 1,
	kWh = 1000,
	MWh = 1000000,
}

const energyUnitConverter = new UnitConverter({
	Wh: EnergyUnit.Wh,
	kWh: EnergyUnit.kWh,
	MWh: EnergyUnit.MWh
}, EnergyUnit.Wh, EnergyUnit.kWh);

export default energyUnitConverter;