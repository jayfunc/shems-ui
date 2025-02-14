import UnitConverter from "./unit-converter-base";

enum MoneyUnit {
	Cent = 1,
	Dollar = 100,
}

const moneyUnitConverter = new UnitConverter({
	Cent: MoneyUnit.Cent,
	Dollar: MoneyUnit.Dollar,
}, MoneyUnit.Cent, MoneyUnit.Dollar);

export default moneyUnitConverter;