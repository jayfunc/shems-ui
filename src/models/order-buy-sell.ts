import Base from "./base";

export enum BuySellOrderStatus {
  Pending = 0,
  PartiallyCompleted = 1,
  Completed = 2,
  Cancelled = 3,
}

export default class OrderBuySell extends Base {
  orderNo: string;
  orderStatus: BuySellOrderStatus;
  orderTime: Date;
  quantity: number;
  buyerId?: bigint;
  buyPrice?: number;
  sellPrice?: number;
  sellerId?: bigint;
  matchPrice?: number;
  completedQuantity: number;
  completeTime?: Date;
  cancelTime?: Date;
  orderHash: string;

  constructor(
    id: bigint,
    orderNo: string,
    orderStatus: BuySellOrderStatus,
    orderTime: Date,
    quantity: number,
    buyerId: bigint,
    buyPrice: number,
    sellerId: bigint,
    sellPrice: number,
    completedQuantity: number,
    orderHash: string,
    simulationTime: Date,
    completeTime?: Date,
    cancelTime?: Date,
  ) {
    super(id, simulationTime);
    this.orderNo = orderNo;
    this.orderStatus = orderStatus;
    this.orderTime = orderTime;
    this.quantity = quantity;
    this.buyerId = buyerId;
    this.buyPrice = buyPrice;
    this.sellerId = sellerId;
    this.sellPrice = sellPrice;
    this.completedQuantity = completedQuantity;
    this.completeTime = completeTime;
    this.cancelTime = cancelTime;
    this.orderHash = orderHash;
  }
}
