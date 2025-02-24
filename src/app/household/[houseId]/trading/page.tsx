"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ApiService from "@/services/api";
import CmtyGridAcct from "@/models/cmty-grid-acct";
import { motion } from "motion/react";
import React from "react";
import WorldMap from "@/components/world-map-patched";
import energyUnitConverter from "@/extensions/energy-unit-converter";
import moneyUnitConverter from "@/extensions/money-unit-converter";
import { Separator } from "@/components/ui/separator";
import House from "@/models/house";
import { AxisChart, AxisChartType } from "@/components/axis-chart";
import OrderMatch from "@/models/order-match";
import OrderBuy, { BuySellOrderStatus } from "@/models/order-buy";
import OrderSell from "@/models/order-sell";
import useSWR from "swr";
import HouseCnsmp from "@/models/house-cnsmp";
import CardTabs from "@/components/card-tabs";
import {
  dataSizeLimitForOrders,
  useCurrentHouseId,
  useDataSizeLimit,
} from "@/extensions/request";
import { DataTable } from "../../../../components/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/data-table-column-header";
import formatText from "@/extensions/string";
import { Badge } from "@/components/ui/badge";

export default function Trading() {
  const houseId = useCurrentHouseId();

  const { data: houses } = useSWR<House[]>(ApiService.buildGetAllHousesUri());

  const { data: cmtyGridAcct } = useSWR<CmtyGridAcct>(
    ApiService.buildGetCmtyGridAcctUri(houseId),
  );
  const { data: houseCnsmp } = useSWR<HouseCnsmp[]>(
    ApiService.buildGetHouseCnsmpUri(houseId, useDataSizeLimit()),
  );

  function mapToCmtyGridCnsmpData() {
    return (
      houseCnsmp?.map((item) => {
        return {
          dateTime: item.consumeTime,
          data: item.communityGridConsumeAmount,
        };
      }) ?? []
    );
  }

  const { data: matchedOrders } = useSWR<OrderMatch[]>(
    ApiService.buildGetAllMatchOrdersUri(houseId, dataSizeLimitForOrders),
  );
  const { data: buyOrders } = useSWR<OrderBuy[]>(
    ApiService.buildGetAllBuyOrdersUri(houseId, dataSizeLimitForOrders),
  );
  const { data: sellOrders } = useSWR<OrderSell[]>(
    ApiService.buildGetAllSellOrdersUri(houseId, dataSizeLimitForOrders),
  );

  function mapKeysToColumns<T>(keys: string[]): ColumnDef<T>[] {
    return keys.map((key) => {
      return {
        accessorKey: key,
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={formatText(key)} />
        ),
        cell: ({ row }) => {
          const lowerKey = key.toLowerCase();
          if (lowerKey.includes("time")) {
            const val: string = row.getValue(key);
            if (val == null) {
              return "-";
            } else {
              return new Date(val).toLocaleString();
            }
          } else if (lowerKey.includes("status")) {
            const status: BuySellOrderStatus = row.getValue("orderStatus");
            const label = formatText(BuySellOrderStatus[status]);
            return <Badge variant="outline">{label}</Badge>;
          } else if (lowerKey.includes("price")) {
            return moneyUnitConverter.formatInStringWithUnit(row.getValue(key), 3);
          } else if (lowerKey.includes("quan")) {
            return energyUnitConverter.formatInStringWithUnit(
              row.getValue(key),
            );
          } else if (lowerKey.includes("id")) {
            const val = String(row.getValue(key));
            if (houseId.toString() === val) {
              return "You";
            } else {
              return formatText(
                houses?.find(
                  (house) =>
                    house.id.toString() === val,
                )?.householdName ?? "-",
              );
            }
          } else {
            return row.getValue(key);
          }
        },
      } satisfies ColumnDef<T>;
    });
  }

  return (
    <motion.div
      className="grid grid-cols-2 gap-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <Card className="col-span-full md:col-span-1">
        <CardHeader>
          <CardTitle>Energy balance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex h-5 items-center space-x-4 text-sm">
            <div>
              {energyUnitConverter.formatInStringWithUnit(
                cmtyGridAcct?.totalSurplusPowerAmount,
              )}{" "}
              in your account
            </div>
            <Separator orientation="vertical" />
            <div>
              {energyUnitConverter.formatInStringWithUnit(
                cmtyGridAcct?.powerFrozenAmount,
              )}{" "}
              frozen
            </div>
          </div>
          <Separator className="my-4" />
          <div className="flex h-5 items-center space-x-4 text-sm text-muted-foreground">
            <div>
              {energyUnitConverter.formatInStringWithUnit(
                Number(cmtyGridAcct?.powerSoldAmount),
              )}{" "}
              sold
            </div>
            <Separator orientation="vertical" />
            <div>
              {energyUnitConverter.formatInStringWithUnit(
                cmtyGridAcct?.availableForSalePowerAmount,
              )}{" "}
              available for sale
            </div>
          </div>
          <div className="my-4" />
          <div className="flex h-5 items-center space-x-4 text-sm text-muted-foreground">
            <div>
              {energyUnitConverter.formatInStringWithUnit(
                Number(cmtyGridAcct?.totalBoughtPowerAmount),
              )}{" "}
              bought
            </div>
            <Separator orientation="vertical" />
            <div>
              {energyUnitConverter.formatInStringWithUnit(
                Number(cmtyGridAcct?.availableForUsePowerAmount),
              )}{" "}
              available for use
            </div>
            <Separator orientation="vertical" />
            <div>
              {energyUnitConverter.formatInStringWithUnit(
                Number(cmtyGridAcct?.totalUsedPowerAmount),
              )}{" "}
              used
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="col-span-full md:col-span-1">
        <CardHeader>
          <CardTitle>Fund balance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex h-5 items-center space-x-4 text-sm">
            <div>
              {moneyUnitConverter.formatInStringWithUnit(cmtyGridAcct?.balance)}{" "}
              in your account
            </div>
            <Separator orientation="vertical" />
            <div>
              {moneyUnitConverter.formatInStringWithUnit(
                cmtyGridAcct?.frozenPaidBalance,
              )}{" "}
              frozen
            </div>
          </div>
          <Separator className="my-4" />
          <div className="flex h-5 items-center space-x-4 text-sm text-muted-foreground">
            <div>
              {moneyUnitConverter.formatInStringWithUnit(
                Number(cmtyGridAcct?.balanceEarned),
              )}{" "}
              earned
            </div>
          </div>
          <div className="my-4" />
          <div className="flex h-5 items-center space-x-4 text-sm text-muted-foreground">
            <div>
              {moneyUnitConverter.formatInStringWithUnit(
                cmtyGridAcct?.balancePaid,
              )}{" "}
              paid
            </div>
          </div>
        </CardContent>
      </Card>

      <CardTabs
        titles={"P2P energy trading"}
        descs={`${dataSizeLimitForOrders}-hour trading records`}
        tabKeys={["buy", "sell", "match"]}
        tabLabels={["Buy orders", "Sell orders", "Matched orders"]}
        tabContents={[
          <DataTable
            key={0}
            columns={mapKeysToColumns([
              "orderNo",
              "orderStatus",
              "completed_quantity",
              "quantity",
              "buyPrice",
              "orderTime",
              "completeTime",
              "cancelTime",
            ])}
            data={buyOrders ?? []}
          />,
          <DataTable
            key={1}
            columns={mapKeysToColumns([
              "orderNo",
              "orderStatus",
              "completed_quantity",
              "quantity",
              "sellPrice",
              "orderTime",
              "completeTime",
              "cancelTime",
            ])}
            data={sellOrders ?? []}
          />,
          <DataTable
            key={2}
            columns={mapKeysToColumns([
              "orderNo",
              "buyerId",
              "sellerId",
              "matchTime",
              "buyerPrice",
              "sellerPrice",
              "matchPrice",
              "quantity",
            ])}
            data={matchedOrders ?? []}
          />,
        ]}
      />

      <Card className="col-span-full">
        <CardHeader>
          <CardTitle>Energy map</CardTitle>
          <CardDescription>
            Trading records in the last {dataSizeLimitForOrders} hours
          </CardDescription>
        </CardHeader>
        <CardContent>
          <WorldMap
            dots={matchedOrders
              ?.map((order) => {
                if (
                  houseId.toString() === order.buyerId.toString() ||
                  houseId.toString() === order.sellerId.toString()
                ) {
                  const buyer = houses?.find(
                    (house) => house.id.toString() === order.buyerId.toString(),
                  );
                  const seller = houses?.find(
                    (house) =>
                      house.id.toString() === order.sellerId.toString(),
                  );

                  if (!buyer || !seller) return undefined;

                  return {
                    start: { lat: seller.latitude, lng: seller.longitude, label: `${order.quantity} kWh`, },
                    end: { lat: buyer.latitude, lng: buyer.longitude, label: `${order.quantity} kWh`, },

                  };
                }
                return undefined;
              })
              .filter((dot) => dot !== undefined)}
          />
        </CardContent>
      </Card>

      <Card className="col-span-full">
        <CardHeader>
          <CardTitle>Energy usage in community grid</CardTitle>
          <CardDescription>{`${useDataSizeLimit()}-hour energy real-time usage level`}</CardDescription>
        </CardHeader>
        <CardContent>
          <AxisChart
            data={[mapToCmtyGridCnsmpData()]}
            labels={["Grid usage"]}
            colors={["--power-cnsmp"]}
            chartType={AxisChartType.Line}
          />
        </CardContent>
      </Card>
    </motion.div>
  );
}
