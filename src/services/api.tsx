"use client";

import Hse from "@/models/hse";
import Appl from "../models/appl";
import HseCnsmp from "../models/hse-cnsmp";
import ApplCnsmp from "@/models/appl-cnsmp";
import CmtyGridAcct from "@/models/cmty-grid-acct";
import HseGen from "@/models/hse-gen";
import LocStor from "@/models/loc-stor";
import MainGridAcct from "@/models/main-grid-acct";
import MainGridCfg from "@/models/main-grid-cfg";
import RmtStor from "@/models/rmt-stor";
import SimCfg from "@/models/sim-cfg";
import HseCnsmpPred from "@/models/hse-cnsmp-pred";
import HseGenPred from "@/models/hse-gen-pred";
import Wx from "@/models/wx";
import OrderBuy, { BuySellOrderStatus } from "@/models/order-buy";
import OrderMatch from "@/models/order-match";
import OrderSell from "@/models/order-sell";

const baseUri: string = "http://localhost:8080/api";
const gridUri: string = `${baseUri}/grid`;
const hseUri: string = `${baseUri}/hse`;
const simUri: string = `${baseUri}/sim`;
const applUri: string = `${baseUri}/appl`;
const storUri: string = `${baseUri}/stor`;
const wxUri: string = `${baseUri}/wx`;
const orderUri: string = `${baseUri}/order`;

export default class ApiService {
  // Appl

  static async getAppl(applianceId: number): Promise<ResponseData<Appl>> {
    const response = await fetch(`${applUri}?applianceId=${applianceId}`);
    const data = await response.json();
    return data;
  }

  static async getAllAppls(houseId: number): Promise<ResponseData<Appl[]>> {
    const response = await fetch(`${applUri}/all?houseId=${houseId}`);
    const data = await response.json();
    return data;
  }

  static async getApplCnsmp(
    applianceId: number,
  ): Promise<ResponseData<ApplCnsmp[]>> {
    const response = await fetch(`${applUri}/cnsmp?applianceId=${applianceId}`);
    const data = await response.json();
    return data;
  }

  // Grid

  static async getCmtyGridAcct(
    houseId: number,
  ): Promise<ResponseData<CmtyGridAcct>> {
    const response = await fetch(`${gridUri}/cmty?houseId=${houseId}`);
    const data = await response.json();
    return data;
  }

  static async getMainGridAcct(
    houseId: number,
  ): Promise<ResponseData<MainGridAcct>> {
    const response = await fetch(`${gridUri}/main?houseId=${houseId}`);
    const data = await response.json();
    return data;
  }

  static async getMainGridCfg(): Promise<ResponseData<MainGridCfg>> {
    const response = await fetch(`${gridUri}/main/cfg`);
    const data = await response.json();
    return data;
  }

  static async postMainGridCfgNormalSignal(): Promise<ResponseData<boolean>> {
    const response = await fetch(`${gridUri}/main/cfg/normal_signal`);
    const data = await response.json();
    return data;
  }

  static async postMainGridCfgPeakShaveSignal(): Promise<ResponseData<boolean>> {
    const response = await fetch(`${gridUri}/main/cfg/peak_shave_signal`);
    const data = await response.json();
    return data;
  }

  // Hse

  static async getHseCnsmp(houseId: number): Promise<ResponseData<HseCnsmp[]>> {
    const response = await fetch(`${hseUri}/cnsmp?houseId=${houseId}`);
    const data = await response.json();
    return data;
  }

  static async getHseGen(houseId: number): Promise<ResponseData<HseGen[]>> {
    const response = await fetch(`${hseUri}/gen?houseId=${houseId}`);
    const data = await response.json();
    return data;
  }

  static async getHseCnsmpPred(
    householdType: number,
  ): Promise<ResponseData<HseCnsmpPred[]>> {
    const response = await fetch(
      `${hseUri}/cnsmp/pred?householdType=${householdType}`,
    );
    const data = await response.json();
    return data;
  }

  static async getHseGenPred(
    householdType: number,
  ): Promise<ResponseData<HseGenPred[]>> {
    const response = await fetch(
      `${hseUri}/gen/pred?householdType=${householdType}`,
    );
    const data = await response.json();
    return data;
  }

  static async getHse(houseId: number): Promise<ResponseData<Hse>> {
    const response = await fetch(`${hseUri}?houseId=${houseId}`);
    const data = await response.json();
    return data;
  }

  static async getAllHses(): Promise<ResponseData<Hse[]>> {
    const response = await fetch(`${hseUri}/all`);
    const data = await response.json();
    return data;
  }

  // Stor

  static async getLocStor(houseId: number): Promise<ResponseData<LocStor>> {
    const response = await fetch(`${storUri}/loc?houseId=${houseId}`);
    const data = await response.json();
    return data;
  }

  static async getRmtStor(houseId: number): Promise<ResponseData<RmtStor>> {
    const response = await fetch(`${storUri}/rmt?houseId=${houseId}`);
    const data = await response.json();
    return data;
  }

  // Sim

  static async getSimCfg(): Promise<ResponseData<SimCfg>> {
    const response = await fetch(`${simUri}`);
    const data = await response.json();
    return data;
  }

  // Wx

  static async getWx(): Promise<ResponseData<Wx>> {
    const response = await fetch(`${wxUri}`);
    const data = await response.json();
    return data;
  }

  //Order

  static async getAllBuyOrders(houseId: number): Promise<ResponseData<OrderBuy[]>> {
    return new ResponseData<OrderBuy[]>(new Status(0, "Success"), [
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
        new Date()
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
        new Date()
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
        new Date()
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
        new Date()
      )
    ], 1);
    const response = await fetch(`${orderUri}?houseId=${houseId}`);
    const data = await response.json();
    return data;
  }

  static async getAllSellOrders(houseId: number): Promise<ResponseData<OrderSell[]>> {
    return new ResponseData<OrderSell[]>(new Status(0, "Success"), [
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
        new Date()
      )
    ], 1);
    const response = await fetch(`${orderUri}/sell?houseId=${houseId}`);
    const data = await response.json();
    return data;
  }

  static async getAllMatchedOrders(houseId: number): Promise<ResponseData<OrderMatch[]>> {
    return new ResponseData<OrderMatch[]>(new Status(0, "Success"), [
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
        new Date()
      )
    ], 1);
    const response = await fetch(`${orderUri}/match?houseId=${houseId}`);
    const data = await response.json();
    return data;
  }
}

class ResponseData<T> {
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
