import Base from "./base";

/**
 * Community Grid Account Model
 */
export default class CmtyGridAcct extends Base {
  houseId: bigint;
  totalSurplusPowerAmount: number;
  availableForSalePowerAmount: number;
  powerFrozenAmount: number;
  powerSoldAmount: bigint;
  totalBoughtPowerAmount: bigint;
  availableForUsePowerAmount: bigint;
  totalUsedPowerAmount: bigint;
  balanceEarned: number;
  balancePaid: number;
  balance: number;
  frozenPaidBalance: number;

  constructor(
    id: bigint,
    houseId: bigint,
    totalSurplusPowerAmount: number,
    availableForSalePowerAmount: number,
    powerFrozenAmount: number,
    powerSoldAmount: bigint,
    totalBoughtPowerAmount: bigint,
    availableForUsePowerAmount: bigint,
    totalUsedPowerAmount: bigint,
    balanceEarned: number,
    balancePaid: number,
    balance: number,
    frozenPaidBalance: number,
    simulationTime: Date,
  ) {
    super(id, simulationTime);
    this.houseId = houseId;
    this.totalSurplusPowerAmount = totalSurplusPowerAmount;
    this.availableForSalePowerAmount = availableForSalePowerAmount;
    this.powerFrozenAmount = powerFrozenAmount;
    this.powerSoldAmount = powerSoldAmount;
    this.totalBoughtPowerAmount = totalBoughtPowerAmount;
    this.availableForUsePowerAmount = availableForUsePowerAmount;
    this.totalUsedPowerAmount = totalUsedPowerAmount;
    this.balanceEarned = balanceEarned;
    this.balancePaid = balancePaid;
    this.balance = balance;
    this.frozenPaidBalance = frozenPaidBalance;
  }
}
