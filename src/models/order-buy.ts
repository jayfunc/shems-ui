export enum BuySellOrderStatus {
  Pending = 0,
  PartiallyCompleted = 1,
  Completed = 2,
  Cancelled = 3,
}

export default class OrderBuy {
  id: bigint;
  orderNo: string;
  buyerId: bigint;
  orderStatus: BuySellOrderStatus;
  orderTime: Date;
  quantity: number;
  buyPrice: number;
  completedQuantity: number;
  completeTime?: Date;
  cancelTime?: Date;
  orderHash: string;
  simulationTime: Date;
  deleted: number;
  createdAt: Date;
  updatedAt: Date;

  constructor(
    id: bigint,
    orderNo: string,
    buyerId: bigint,
    orderStatus: BuySellOrderStatus,
    orderTime: Date,
    quantity: number,
    buyPrice: number,
    completedQuantity: number,
    orderHash: string,
    simulationTime: Date,
    deleted: number,
    createdAt: Date,
    updatedAt: Date,
		completeTime?: Date,
    cancelTime?: Date,
  ) {
    this.id = id;
    this.orderNo = orderNo;
    this.buyerId = buyerId;
    this.orderStatus = orderStatus;
    this.orderTime = orderTime;
    this.quantity = quantity;
    this.buyPrice = buyPrice;
    this.completedQuantity = completedQuantity;
    this.completeTime = completeTime;
    this.cancelTime = cancelTime;
    this.orderHash = orderHash;
    this.simulationTime = simulationTime;
    this.deleted = deleted;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
