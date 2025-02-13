import Base from "./base";

/**
 * Community Grid Account Model
 */
export default class CmtyGridAcct extends Base {
  houseId: bigint;
  totalSurplusPowerAmount: number; // 1 = 2 + 4
  availableForSalePowerAmount: number; // 2
  powerFrozenAmount: number; // 3
  powerSoldAmount: bigint; // 4 = 很多个 3
  totalBoughtPowerAmount: bigint; // 5 = 6 + 7 
  availableForUsePowerAmount: bigint; // 6
  totalUsedPowerAmount: bigint; // 7
  balanceEarned: number; // 8
  balancePaid: number; // 9 = 很多个 11
  balance: number; // 10 = 8 - 9
  frozenPaidBalance: number; // 11

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
    simulationTime: string,
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
