import Base from "./base";

export default class OrderMatch extends Base {
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
  ) {
    super(id, simulationTime);
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
  }
}
