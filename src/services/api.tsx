import { HouseholdType } from "@/models/house";

export default class ApiService<T> {
  static baseUri = "http://34.130.185.159:8080/api";

  static gridUri = this.baseUri + "/grid";
  static houseUri = this.baseUri + "/house";
  static simUri = this.baseUri + "/sim";
  static applUri = this.baseUri + "/appl";
  static storUri = this.baseUri + "/stor";
  static weatherUri = this.baseUri + "/weather";
  static orderUri = this.baseUri + "/order";
  static statisticUri = this.baseUri + "/statistic";

  async fetch(
    resource: string | URL | globalThis.Request,
    init?: RequestInit,
  ): Promise<T> {
    const res = await fetch(resource, init);
    const resData: ResponseData<T> = await res.json();
    if (resData == null) {
      throw new Error("Response data is null", {
        cause: resource,
      });
    } else if (resData.data == null) {
      throw new Error("Data is null", {
        cause: resource,
      });
    } else if (resData.status.code !== StatusCode.Success) {
      throw new Error(resData.status.msg, {
        cause: resource,
      });
    } else {
      return resData.data;
    }
  }

  // Appl

  static buildApplUri(applianceId: number): string {
    return this.applUri + "?applianceId=" + applianceId;
  }

  static buildAllApplsUri(houseId: number): string {
    return this.applUri + "/all?houseId=" + houseId;
  }

  static buildApplCnsmpUri(applianceId: number, size: number): string {
    return this.applUri + "/cnsmp?applianceId=" + applianceId + "&size=" + size;
  }

  // Grid

  static buildCmtyGridAcctUri(houseId: number): string {
    return this.gridUri + "/cmty?houseId=" + houseId;
  }

  static buildMainGridAcctUri(houseId: number): string {
    return this.gridUri + "/main?houseId=" + houseId;
  }

  static buildMainGridCfgUri(): string {
    return this.gridUri + "/main/cfg";
  }

  static buildMainGridCfgNormalSignalUri(): string {
    return this.gridUri + "/main/cfg/normal_signal";
  }

  static buildMainGridCfgPeakShaveSignalUri(): string {
    return this.gridUri + "/main/cfg/peak_shave_signal";
  }

  // House

  static buildHouseCnsmpUri(houseId: number, size: number): string {
    return this.houseUri + "/cnsmp?houseId=" + houseId + "&size=" + size;
  }

  static buildHouseGenUri(houseId: number, size: number): string {
    return this.houseUri + "/gen?houseId=" + houseId + "&size=" + size;
  }

  static buildHouseCnsmpPredUri(
    householdType: HouseholdType,
    size: number,
  ): string {
    return this.houseUri + "/cnsmp/pred?householdType=" + householdType + "&size=" + size;
  }

  static buildHouseGenPredUri(householdType: HouseholdType, size: number): string {
    return this.houseUri + "/gen/pred?householdType=" + householdType + "&size=" + size;
  }

  static buildHouseUri(houseId: number): string {
    return this.houseUri + "?houseId=" + houseId;
  }

  static buildAllHousesUri(): string {
    return this.houseUri + "/all";
  }

  // Stor

  static buildLocStorUri(houseId: number): string {
    return this.storUri + "/loc?houseId=" + houseId;
  }

  static buildRmtStorUri(houseId: number): string {
    return this.storUri + "/rmt?houseId=" + houseId;
  }

  // Sim

  static buildSimCfgUri(): string {
    return this.simUri;
  }

  // Weather

  static buildWeatherUri(): string {
    return this.weatherUri;
  }

  //Order

  static buildAllBuyOrdersUri(houseId: number, size: number): string {
    return this.orderUri + "/buy/all?houseId=" + houseId + "&size=" + size;
  }

  static buildAllSellOrdersUri(houseId: number, size: number): string {
    return this.orderUri + "/sell/all?houseId=" + houseId + "&size=" + size;
  }

  static buildAllMatchOrdersUri(houseId: number, size: number): string {
    return this.orderUri + "/match/all?houseId=" + houseId + "&size=" + size;
  }

  // Statistic

  static buildHouseTradingStatUri(houseId: number): string {
    return this.statisticUri + "/household/summary?houseId=" + houseId;
  }

  static buildCmtyGridStatUri(): string {
    return this.statisticUri + "/community/summary";
  }

  static buildMatchOrderPriceStatUri(): string {
    return this.statisticUri + "/community/price";
  }

  static buildMatchOrderQtyStatUri(): string {
    return this.statisticUri + "/community/quantity";
  }
}

export class ResponseData<T> {
  status: Status;
  data: T;
  currentTime: number;

  constructor(status: Status, data: T, currentTime: number) {
    this.status = status;
    this.data = data;
    this.currentTime = currentTime;
  }
}

class Status {
  code: number;
  msg: string;

  constructor(code: number, msg: string) {
    this.code = code;
    this.msg = msg;
  }
}

export enum StatusCode {
  Fail = 0,
  Success = 1,
  Error = 9999,
}
