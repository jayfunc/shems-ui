"use client";

import OrderBuy, { BuySellOrderStatus } from "@/models/order-buy";
import OrderMatch from "@/models/order-match";
import OrderSell from "@/models/order-sell";
import { chartMaxPoints } from "@/constants/constants";

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

  static buildGetApplCnsmpUri(applianceId: number, size: number = chartMaxPoints): string {
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

  static buildGetHouseCnsmpUri(houseId: number, size: number = chartMaxPoints): string {
    return `${houseUri}/cnsmp?houseId=${houseId}&size=${size}`;
  }

  static buildGetHouseGenUri(houseId: number, size: number = chartMaxPoints): string {
    return `${houseUri}/gen?houseId=${houseId}&size=${size}`;
  }

  static buildGetHouseCnsmpPredUri(householdType: number, size: number = chartMaxPoints): string {
    return `${houseUri}/cnsmp/pred?householdType=${householdType}&size=${size}`;
  }

  static buildGetHouseGenPredUri(householdType: number, size: number = chartMaxPoints): string {
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

  static async getAllBuyOrders(
    houseId: number,
  ): Promise<ResponseData<OrderBuy[]>> {
    return new ResponseData<OrderBuy[]>(
      new Status(0, "Success"),
      [
        new OrderBuy(
          BigInt(1), // order id
          "order_no",
          BigInt(1), // buyer id
          BuySellOrderStatus.Pending,
          new Date(),
          1, // quan
          1, // buy price
          1, // completed quan
          "order_hash",
          new Date(),
          0,
          new Date(),
          new Date(),
        ),
        new OrderBuy(
          BigInt(2), // order id
          "order_no",
          BigInt(1), // buyer id
          BuySellOrderStatus.PartiallyCompleted,
          new Date(),
          1, // quan
          2, // buy price
          1, // completed quan
          "order_hash",
          new Date(),
          0,
          new Date(),
          new Date(),
        ),
        new OrderBuy(
          BigInt(3), // order id
          "order_no",
          BigInt(1), // buyer id
          BuySellOrderStatus.Completed,
          new Date(),
          1, // quan
          3, // buy price
          1, // completed quan
          "order_hash",
          new Date(),
          0,
          new Date(),
          new Date(),
        ),
        new OrderBuy(
          BigInt(4), // order id
          "order_no",
          BigInt(1), // buyer id
          BuySellOrderStatus.Cancelled,
          new Date(),
          1, // quan
          4, // buy price
          1, // completed quan
          "order_hash",
          new Date(),
          0,
          new Date(),
          new Date(),
        ),
      ],
      1,
    );
    const response = await fetch(`${orderUri}?houseId=${houseId}`);
    const data = await response.json();
    return data;
  }

  static async getAllSellOrders(
    houseId: number,
  ): Promise<ResponseData<OrderSell[]>> {
    return new ResponseData<OrderSell[]>(
      new Status(0, "Success"),
      [
        new OrderSell(
          BigInt(1), // order id
          "order_no",
          BigInt(1), // seller id
          0, // order status
          new Date(),
          1, // quan
          1, // sell price
          1, // completed quan
          "order_hash",
          new Date(),
          0,
          new Date(),
          new Date(),
        ),
      ],
      1,
    );
    const response = await fetch(`${orderUri}/sell?houseId=${houseId}`);
    const data = await response.json();
    return data;
  }

  static async getAllMatchedOrders(
    houseId: number,
  ): Promise<ResponseData<OrderMatch[]>> {
    return new ResponseData<OrderMatch[]>(
      new Status(0, "Success"),
      [
        new OrderMatch(
          BigInt(1), // order id
          "order_no",
          BigInt(1), // seller id
          BigInt(2), // buyer id
          1, // quan
          1, // match price
          new Date(),
          1, // seller price
          1, // buyer price
          BigInt(1), // sell order id
          BigInt(1), // buy order id
          "order_hash",
          new Date(),
          0,
          new Date(),
          new Date(),
        ),
        new OrderMatch(
          BigInt(2), // order id
          "order_no",
          BigInt(1), // seller id
          BigInt(3), // buyer id
          1, // quan
          2, // match price
          new Date(),
          1, // seller price
          1, // buyer price
          BigInt(1), // sell order id
          BigInt(1), // buy order id
          "order_hash",
          new Date(),
          0,
          new Date(),
          new Date(),
        ),
        new OrderMatch(
          BigInt(3), // order id
          "order_no",
          BigInt(1), // seller id
          BigInt(4), // buyer id
          1, // quan
          3, // match price
          new Date(),
          1, // seller price
          1, // buyer price
          BigInt(1), // sell order id
          BigInt(1), // buy order id
          "order_hash",
          new Date(),
          0,
          new Date(),
          new Date(),
        ),
      ],
      1,
    );
    const response = await fetch(`${orderUri}/match?houseId=${houseId}`);
    const data = await response.json();
    return data;
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