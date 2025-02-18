import UnitConverter from "./unit-converter-base";

enum EnergyUnit {
  Wh = 1,
  kWh = 1000,
  MWh = 1000000,
}

class EnergyUnitConverter extends UnitConverter {}

const energyUnitConverter = new EnergyUnitConverter(
  {
    Wh: EnergyUnit.Wh,
    kWh: EnergyUnit.kWh,
    MWh: EnergyUnit.MWh,
  },
  EnergyUnit.Wh,
  EnergyUnit.kWh,
);

export default energyUnitConverter;
