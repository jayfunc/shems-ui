export default class OrderSell {
  id: bigint;
  orderNo: string;
  sellerId: bigint;
  orderStatus: number;
  orderTime: Date;
  quantity: number;
  sellPrice: number;
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
    sellerId: bigint,
    orderStatus: number,
    orderTime: Date,
    quantity: number,
    sellPrice: number,
    completedQuantity: number,
    orderHash: string,
    simulationTime: Date,
    deleted: number,
    createdAt: Date,
    updatedAt: Date,
		completeTime?: Date,
    cancelTime?: Date
  ) {
    this.id = id;
    this.orderNo = orderNo;
    this.sellerId = sellerId;
    this.orderStatus = orderStatus;
    this.orderTime = orderTime;
    this.quantity = quantity;
    this.sellPrice = sellPrice;
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
