"use client";

import ApiService from "@/services/api";
import { motion } from "motion/react";
import React from "react";
import WorldMap from "@/components/world-map-patched";
import energyUnitConverter from "@/extensions/energy-unit-converter";
import moneyUnitConverter from "@/extensions/money-unit-converter";
import House from "@/models/house";
import OrderMatch from "@/models/order-match";
import OrderBuy, { BuySellOrderStatus } from "@/models/order-buy";
import OrderSell from "@/models/order-sell";
import useSWR from "swr";
import CardTabs from "@/components/card-tabs";
import {
  dataSizeLimitForOrders,
  useCurrentHouseId,
} from "@/extensions/request";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/data-table-column-header";
import formatText from "@/extensions/string";
import { Badge } from "@/components/ui/badge";
import ScrollableDrawer from "@/components/scrollable-drawer";
import { Map } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/data-table";

export default function Trading() {
  const houseId = useCurrentHouseId();

  const { data: houses } = useSWR<House[]>(ApiService.buildAllHousesUri());

  const { data: matchedOrders } = useSWR<OrderMatch[]>(
    ApiService.buildAllMatchOrdersUri(houseId, dataSizeLimitForOrders),
  );
  const { data: buyOrders } = useSWR<OrderBuy[]>(
    ApiService.buildAllBuyOrdersUri(houseId, dataSizeLimitForOrders),
  );
  const { data: sellOrders } = useSWR<OrderSell[]>(
    ApiService.buildAllSellOrdersUri(houseId, dataSizeLimitForOrders),
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

  return (
    <motion.div
      className="grid grid-cols-4 gap-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >

      <CardTabs
        titles={"Trading history"}
        descs={`${dataSizeLimitForOrders}-hour trading records`}
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

      <ScrollableDrawer
        trigger={
          <div className="flex justify-end col-span-full">
            <Button><Map />View in map</Button>
          </div>
        }
        title="Energy map"
        desc={`Trading records in the past ${dataSizeLimitForOrders} hours`}
        content={
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

                  const sellerName = houseId.toString() === seller.id.toString() ? "Me" : seller.householdName;
                  const buyerName = houseId.toString() === buyer.id.toString() ? "Me" : buyer.householdName;

                  return {
                    start: { lat: seller.latitude, lng: seller.longitude, label: sellerName, },
                    end: { lat: buyer.latitude, lng: buyer.longitude, label: buyerName, },

                  };
                }
                return undefined;
              })
              .filter((dot) => dot !== undefined)}
          />
        }
      />

    </motion.div>
  );
}
