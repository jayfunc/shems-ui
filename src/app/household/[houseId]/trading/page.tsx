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
import energyUnitConverter from "@/extensions/energy-unit-converter";
import moneyUnitConverter from "@/extensions/money-unit-converter";
import { Separator } from "@/components/ui/separator";
import House from "@/models/house";
import useSWR from "swr";
import {
  dataSizeLimitForOrders,
  dataSizeLimitForOrdersAsString,
  useCurrentHouseId,
} from "@/extensions/request";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import routing from "@/constants/routing";
import { DataTable } from "@/components/data-table";
import { DataTableColumnHeader } from "@/components/data-table-column-header";
import ScrollableDrawer from "@/components/scrollable-drawer";
import WorldMap from "@/components/world-map-patched";
import formatText from "@/extensions/string";
import OrderBuySell, { BuySellOrderStatus } from "@/models/order-buy-sell";
import OrderMatch from "@/models/order-match";
import { ColumnDef } from "@tanstack/react-table";
import { DatabaseZap, Map } from "lucide-react";

export default function Trading() {
  const houseId = useCurrentHouseId();

  const { data: houses } = useSWR<House[]>(ApiService.buildAllHousesUri());

  const { data: matchedOrders } = useSWR<OrderMatch[]>(
    ApiService.buildAllMatchOrdersUri(houseId, dataSizeLimitForOrders),
  );
  const { data: buyOrders } = useSWR<OrderBuySell[]>(
    ApiService.buildAllBuyOrdersUri(houseId, dataSizeLimitForOrders),
  );
  const { data: sellOrders } = useSWR<OrderBuySell[]>(
    ApiService.buildAllSellOrdersUri(houseId, dataSizeLimitForOrders),
  );

  const buysellOrders = (buyOrders?.map((value) => {
    const matched = matchedOrders?.find((order) => {
      return order.buyOrderId === value.id;
    });
    value.sellerId = matched?.sellerId;
    value.sellPrice = matched?.matchPrice;
    value.matchPrice = matched?.matchPrice;
    return value;
  }) ?? []).concat(sellOrders?.map((value) => {
    const matched = matchedOrders?.find((order) => {
      return order.sellOrderId === value.id;
    });
    value.buyerId = matched?.buyerId;
    value.buyPrice = matched?.buyerPrice;
    value.matchPrice = matched?.matchPrice;
    return value;
  }) ?? []);

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
            return label;
          } else if (lowerKey.includes("price")) {
            return moneyUnitConverter.formatInStringWithUnit(row.getValue(key), 3);
          } else if (lowerKey.includes("quan")) {
            return energyUnitConverter.formatInStringWithUnit(
              row.getValue(key),
            );
          } else if (lowerKey.includes("id")) {
            const val = String(row.getValue(key));
            if (houseId.toString() === val) {
              return "Me";
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

  const { data: cmtyGridAcct } = useSWR<CmtyGridAcct>(
    ApiService.buildCmtyGridAcctUri(houseId),
  );

  return (
    <motion.div
      className="grid grid-cols-4 gap-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >

      <Card className="col-span-full md:col-span-2">
        <CardHeader>
          <CardTitle>My energy balance</CardTitle>
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

      <Card className="col-span-full md:col-span-2">
        <CardHeader>
          <CardTitle>My fund balance</CardTitle>
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

      <div className="flex flex-col md:flex-row gap-2 justify-end items-end col-span-full">
        <Link className="" href={`${routing.trading}/${routing.summary}`}>
          <Button variant="outline"><DatabaseZap />Summary</Button>
        </Link>

        <ScrollableDrawer
          trigger={
            <div className="flex justify-end col-span-full">
              <Button variant="outline"><Map />View completed orders in map</Button>
            </div>
          }
          title="Energy map"
          desc={`Completed trading records in the past ${dataSizeLimitForOrdersAsString}`}
          content={
            <div className="p-4">
              <WorldMap
                dots={buysellOrders
                  ?.map((order) => {
                    if (
                      houseId.toString() === order.buyerId?.toString() ||
                      houseId.toString() === order.sellerId?.toString()
                    ) {
                      const buyer = houses?.find(
                        (house) => house.id.toString() === order.buyerId?.toString(),
                      );
                      const seller = houses?.find(
                        (house) =>
                          house.id.toString() === order.sellerId?.toString(),
                      );

                      if (!buyer || !seller) return undefined;

                      const sellerName = "Seller: " + formatText(houseId.toString() === seller.id.toString() ? "Me" : seller.householdName);
                      const buyerName = "Buyer: " + formatText(houseId.toString() === buyer.id.toString() ? "Me" : buyer.householdName);

                      const additional = "\n" +
                        energyUnitConverter.formatInStringWithUnit(order.quantity) + " at " +
                        moneyUnitConverter.formatInStringWithUnit(order.matchPrice) + "\n" +
                        "Completed at " + new Date(order.completeTime ?? "").toLocaleString();

                      return {
                        start: { lat: seller.latitude, lng: seller.longitude, label: sellerName + additional, },
                        end: { lat: buyer.latitude, lng: buyer.longitude, label: buyerName + additional, },

                      };
                    }
                    return undefined;
                  })
                  .filter((dot) => dot !== undefined)}
              />
            </div>
          }
        />
      </div>

      <Card className="col-span-full">
        <CardHeader>
          <CardTitle>
            Trading history
          </CardTitle>
          <CardDescription>
            {dataSizeLimitForOrdersAsString} trading records
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            key={0}
            columns={mapKeysToColumns([
              "orderStatus",
              "quantity",
              "buyerId",
              "sellerId",
              "buyPrice",
              "sellPrice",
              "matchPrice",
              "orderTime",
              "completeTime",
              "cancelTime",
            ])}
            data={buysellOrders}
          />
        </CardContent>
      </Card>

    </motion.div>
  );
}
