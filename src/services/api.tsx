"use client";

import { dataSizeLimit } from "@/constants/constants";

const baseUri: string = "http://localhost:8080/api";
const gridUri: string = `${baseUri}/grid`;
const houseUri: string = `${baseUri}/house`;
const simUri: string = `${baseUri}/sim`;
const applUri: string = `${baseUri}/appl`;
const storUri: string = `${baseUri}/stor`;
const weatherUri: string = `${baseUri}/weather`;
const orderUri: string = `${baseUri}/order`;

export default class ApiUriBuilder {
  // Appl

  static buildGetApplUri(applianceId: number): string {
    return `${applUri}?applianceId=${applianceId}`;
  }

  static buildGetAllApplsUri(houseId: number): string {
    return `${applUri}/all?houseId=${houseId}`;
  }

  static buildGetApplCnsmpUri(applianceId: number, size: number = dataSizeLimit): string {
    return `${applUri}/cnsmp?applianceId=${applianceId}&size=${size}`;
  }

  // Grid

  static buildGetCmtyGridAcctUri(houseId: number): string {
    return `${gridUri}/cmty?houseId=${houseId}`;
  }

  static buildGetMainGridAcctUri(houseId: number): string {
    return `${gridUri}/main?houseId=${houseId}`;
  }

  static buildGetMainGridCfgUri(): string {
    return `${gridUri}/main/cfg`;
  }

  static buildPostMainGridCfgNormalSignalUri(): string {
    return `${gridUri}/main/cfg/normal_signal`;
  }

  static buildPostMainGridCfgPeakShaveSignalUri(): string {
    return `${gridUri}/main/cfg/peak_shave_signal`;
  }

  // House

  static buildGetHouseCnsmpUri(houseId: number, size: number = dataSizeLimit): string {
    return `${houseUri}/cnsmp?houseId=${houseId}&size=${size}`;
  }

  static buildGetHouseGenUri(houseId: number, size: number = dataSizeLimit): string {
    return `${houseUri}/gen?houseId=${houseId}&size=${size}`;
  }

  static buildGetHouseCnsmpPredUri(householdType: number, size: number = dataSizeLimit): string {
    return `${houseUri}/cnsmp/pred?householdType=${householdType}&size=${size}`;
  }

  static buildGetHouseGenPredUri(householdType: number, size: number = dataSizeLimit): string {
    return `${houseUri}/gen/pred?householdType=${householdType}&size=${size}`;
  }

  static buildGetHouseUri(houseId: number): string {
    return `${houseUri}?houseId=${houseId}`;
  }

  static buildGetAllHousesUri(): string {
    return `${houseUri}/all`;
  }

  // Stor

  static buildGetLocStorUri(houseId: number): string {
    return `${storUri}/loc?houseId=${houseId}`;
  }

  static buildGetRmtStorUri(houseId: number): string {
    return `${storUri}/rmt?houseId=${houseId}`;
  }

  // Sim

  static buildGetSimCfgUri(): string {
    return `${simUri}`;
  }

  // Weather

  static buildGetWeatherUri(): string {
    return `${weatherUri}`;
  }

  //Order

  static buildGetAllBuyOrdersUri(houseId: number): string {
    return `${orderUri}/buy/all?houseId=${houseId}`;
  }

  static buildGetAllSellOrdersUri(houseId: number): string {
    return `${orderUri}/sell/all?houseId=${houseId}`;
  }

  static buildGetAllMatchOrdersUri(houseId: number): string {
    return `${orderUri}/match/all?houseId=${houseId}`;
  }
}

export class ApiService<T> {
  async fetch(resource: string | URL | globalThis.Request, init?: RequestInit): Promise<T> {
    const res = await fetch(resource, init);
    const resData: ResponseData<T> = await res.json();
    if (resData == null) {
      throw new Error('Response data is null', {
        cause: resource,
      });
    } else if (resData.data == null) {
      throw new Error('Data is null', {
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