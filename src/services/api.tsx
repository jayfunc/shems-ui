import { HouseholdType } from "@/models/house";

class ApiUriBuilder {
  static baseUri: () => string = () => `https://34.130.112.14/api`;

  static gridUri: () => string = () => `${this.baseUri()}/grid`;
  static houseUri: () => string = () => `${this.baseUri()}/house`;
  static simUri: () => string = () => `${this.baseUri()}/sim`;
  static applUri: () => string = () => `${this.baseUri()}/appl`;
  static storUri: () => string = () => `${this.baseUri()}/stor`;
  static weatherUri: () => string = () => `${this.baseUri()}/weather`;
  static orderUri: () => string = () => `${this.baseUri()}/order`;
}

export default class ApiService<T> {
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

  static buildGetApplUri(applianceId: number): string {
    return `${ApiUriBuilder.applUri()}?applianceId=${applianceId}`;
  }

  static buildGetAllApplsUri(houseId: number): string {
    return `${ApiUriBuilder.applUri()}/all?houseId=${houseId}`;
  }

  static buildGetApplCnsmpUri(applianceId: number, size: number): string {
    return `${ApiUriBuilder.applUri()}/cnsmp?applianceId=${applianceId}&size=${size}`;
  }

  // Grid

  static buildGetCmtyGridAcctUri(houseId: number): string {
    return `${ApiUriBuilder.gridUri()}/cmty?houseId=${houseId}`;
  }

  static buildGetMainGridAcctUri(houseId: number): string {
    return `${ApiUriBuilder.gridUri()}/main?houseId=${houseId}`;
  }

  static buildGetMainGridCfgUri(): string {
    return `${ApiUriBuilder.gridUri()}/main/cfg`;
  }

  static buildPostMainGridCfgNormalSignalUri(): string {
    return `${ApiUriBuilder.gridUri()}/main/cfg/normal_signal`;
  }

  static buildPostMainGridCfgPeakShaveSignalUri(): string {
    return `${ApiUriBuilder.gridUri()}/main/cfg/peak_shave_signal`;
  }

  // House

  static buildGetHouseCnsmpUri(houseId: number, size: number): string {
    return `${ApiUriBuilder.houseUri()}/cnsmp?houseId=${houseId}&size=${size}`;
  }

  static buildGetHouseGenUri(houseId: number, size: number): string {
    return `${ApiUriBuilder.houseUri()}/gen?houseId=${houseId}&size=${size}`;
  }

  static buildGetHouseCnsmpPredUri(
    householdType: HouseholdType,
    size: number,
  ): string {
    return `${ApiUriBuilder.houseUri()}/cnsmp/pred?householdType=${householdType}&size=${size}`;
  }

  static buildGetHouseGenPredUri(householdType: HouseholdType, size: number): string {
    return `${ApiUriBuilder.houseUri()}/gen/pred?householdType=${householdType}&size=${size}`;
  }

  static buildGetHouseUri(houseId: number): string {
    return `${ApiUriBuilder.houseUri()}?houseId=${houseId}`;
  }

  static buildGetAllHousesUri(): string {
    return `${ApiUriBuilder.houseUri()}/all`;
  }

  // Stor

  static buildGetLocStorUri(houseId: number): string {
    return `${ApiUriBuilder.storUri()}/loc?houseId=${houseId}`;
  }

  static buildGetRmtStorUri(houseId: number): string {
    return `${ApiUriBuilder.storUri()}/rmt?houseId=${houseId}`;
  }

  // Sim

  static buildGetSimCfgUri(): string {
    return `${ApiUriBuilder.simUri()}`;
  }

  // Weather

  static buildGetWeatherUri(): string {
    return `${ApiUriBuilder.weatherUri()}`;
  }

  //Order

  static buildGetAllBuyOrdersUri(houseId: number, size: number): string {
    return `${ApiUriBuilder.orderUri()}/buy/all?houseId=${houseId}&size=${size}`;
  }

  static buildGetAllSellOrdersUri(houseId: number, size: number): string {
    return `${ApiUriBuilder.orderUri()}/sell/all?houseId=${houseId}&size=${size}`;
  }

  static buildGetAllMatchOrdersUri(houseId: number, size: number): string {
    return `${ApiUriBuilder.orderUri()}/match/all?houseId=${houseId}&size=${size}`;
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
