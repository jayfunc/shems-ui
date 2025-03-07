class CmtyGridTradingStat {

  /**
   * 最近一小时
   */
  lastHour!: CmtyGridTradingStatData;

  /**
   * 最近24小时
   */
  lastDay!: CmtyGridTradingStatData;

}

class CmtyGridTradingStatData {

  /**
   * 总参与家庭数
   */
  totalHouseholds?: number;

  /**
   * 总买单数量
   */
  totalBuyOrders?: number;

  /**
   * 总买单电量
   */
  totalBuyQuantity?: number;

  /**
   * 买单挂单均价
   */
  buyOrderAvgPrice?: number;

  /**
   * 总卖单量
   */
  totalSellOrders?: number;

  /**
   * 卖单总电量
   */
  totalSellQuantity?: number;

  /**
   * 卖单均价
   */
  sellOrderAvgPrice?: number;

  /**
   * 总成交单数
   */
  totalMatchOrders?: number;

  /**
   * 总成交单电量
   */
  totalMatchQuantity?: number;

  /**
   * 成交均价(小时维度就是成交价，天维度就是最近24小时加权平均)
   */
  matchAvgPrice?: number;

  /**
   * 卖单成交量(根据电量算)
   */
  sellOrderMatchRate?: number;

  /**
   * 买单成交量(根据电量算)
   */
  buyOrderMatchRate?: number;

}
