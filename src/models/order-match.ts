export default class OrderMatch {
  id: bigint;
  orderNo: string;
  sellerId: bigint;
  buyerId: bigint;
  quantity: number;
  matchPrice: number;
  matchTime: Date;
  sellerPrice: number;
  buyerPrice: number;
  sellOrderId: bigint;
  buyOrderId: bigint;
  orderHash: string;
  simulationTime: Date;
  deleted: number;
  createdAt: Date;
  updatedAt: Date;

  constructor(
    id: bigint,
    orderNo: string,
    sellerId: bigint,
    buyerId: bigint,
    quantity: number,
    matchPrice: number,
    matchTime: Date,
    sellerPrice: number,
    buyerPrice: number,
    sellOrderId: bigint,
    buyOrderId: bigint,
    orderHash: string,
    simulationTime: Date,
    deleted: number,
    createdAt: Date,
    updatedAt: Date
  ) {
    this.id = id;
    this.orderNo = orderNo;
    this.sellerId = sellerId;
    this.buyerId = buyerId;
    this.quantity = quantity;
    this.matchPrice = matchPrice;
    this.matchTime = matchTime;
    this.sellerPrice = sellerPrice;
    this.buyerPrice = buyerPrice;
    this.sellOrderId = sellOrderId;
    this.buyOrderId = buyOrderId;
    this.orderHash = orderHash;
    this.simulationTime = simulationTime;
    this.deleted = deleted;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
