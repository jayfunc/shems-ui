"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  dataSizeLimit,
} from "@/constants/constants";
import ApiUriBuilder from "@/services/api";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import CmtyGridAcct from "@/models/cmty-grid-acct";
import { motion } from "motion/react";
import React from "react";
import WorldMap from "@/components/world-map-patched";
import energyUnitConverter from "@/extensions/energy-unit-converter";
import moneyUnitConverter from "@/extensions/money-unit-converter";
import { Separator } from "@/components/ui/separator";
import House from "@/models/house";
import {
  AxisChart,
  AxisChartType,
} from "@/components/axis-chart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import OrderMatch from "@/models/order-match";
import OrderBuy, {
  BuySellOrderStatus as BuySellOrderStatus,
} from "@/models/order-buy";
import OrderSell from "@/models/order-sell";
import formatText from "@/extensions/string";
import useSWR from "swr";
import HouseCnsmp from "@/models/house-cnsmp";
import routing from "@/constants/routing";

export default function Trading() {
  const hhId = parseInt(
    usePathname()
      .replace(routing.household, "")
      .replace(routing.trading, "")
      .replaceAll("/", ""),
  );

  const { data: houses } = useSWR<House[]>(ApiUriBuilder.buildGetAllHousesUri());

  const { data: cmtyGridAcct } = useSWR<CmtyGridAcct>(ApiUriBuilder.buildGetCmtyGridAcctUri(hhId));
  const { data: houseCnsmp } = useSWR<HouseCnsmp[]>(ApiUriBuilder.buildGetHouseCnsmpUri(hhId));

  function mapToCmtyGridCnsmpData() {
    return houseCnsmp?.map((item) => {
      return {
        dateTime: item.consumeTime,
        data: item.communityGridConsumeAmount,
      };
    }) ?? [];
  }

  const { data: matchedOrders } = useSWR<OrderMatch[]>(ApiUriBuilder.buildGetAllMatchOrdersUri(hhId));
  const { data: buyOrders } = useSWR<OrderBuy[]>(ApiUriBuilder.buildGetAllBuyOrdersUri(hhId));
  const { data: sellOrders } = useSWR<OrderSell[]>(ApiUriBuilder.buildGetAllSellOrdersUri(hhId));

  return (
    <motion.div
      className="grid grid-cols-2 gap-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <Card className="col-span-1">
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

      <Card className="col-span-1">
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

      <Tabs defaultValue="match" className="col-span-full">
        <Card>
          <CardHeader>
            <CardTitle className="flex flex-row items-center">
              P2P energy trading
              <div className="flex-1" />
              <TabsList>
                <TabsTrigger value="buy">Buy orders</TabsTrigger>
                <TabsTrigger value="sell">Sell orders</TabsTrigger>
                <TabsTrigger value="match">Matched orders</TabsTrigger>
              </TabsList>
            </CardTitle>
          </CardHeader>

          <CardContent>
            <TabsContent value="buy">
              <Table className="text-center">
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-center">Quantity</TableHead>
                    <TableHead className="text-center">Limit price</TableHead>
                    <TableHead className="text-center">
                      Submitted time
                    </TableHead>
                    <TableHead className="text-center">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {buyOrders?.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>{order.quantity}</TableCell>
                      <TableCell>{order.buyPrice}</TableCell>
                      <TableCell>{order.orderTime.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            order.orderStatus === BuySellOrderStatus.Completed
                              ? "default"
                              : order.orderStatus ===
                                BuySellOrderStatus.Cancelled
                                ? "destructive"
                                : order.orderStatus ===
                                  BuySellOrderStatus.PartiallyCompleted
                                  ? "secondary"
                                  : "outline"
                          }
                        >
                          {formatText(BuySellOrderStatus[order.orderStatus])}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>

            <TabsContent value="sell">
              <Table className="text-center">
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-center">Quantity</TableHead>
                    <TableHead className="text-center">Limit price</TableHead>
                    <TableHead className="text-center">
                      Submitted time
                    </TableHead>
                    <TableHead className="text-center">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sellOrders?.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>{order.quantity}</TableCell>
                      <TableCell>{order.sellPrice}</TableCell>
                      <TableCell>{order.orderTime.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            order.orderStatus === BuySellOrderStatus.Completed
                              ? "default"
                              : order.orderStatus ===
                                BuySellOrderStatus.Cancelled
                                ? "destructive"
                                : "secondary"
                          }
                        >
                          {formatText(BuySellOrderStatus[order.orderStatus])}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>

            <TabsContent value="match">
              <Table className="text-center">
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-center">Buyer</TableHead>
                    <TableHead className="text-center">Seller</TableHead>
                    <TableHead className="text-center">Quantity</TableHead>
                    <TableHead className="text-center">Matched price</TableHead>
                    <TableHead className="text-center">Matched time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {matchedOrders?.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>{order.buyerId}</TableCell>
                      <TableCell>{order.sellerId}</TableCell>
                      <TableCell>{order.quantity}</TableCell>
                      <TableCell>{order.matchPrice}</TableCell>
                      <TableCell>{order.matchTime.toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
          </CardContent>
        </Card>
      </Tabs>

      <Card className="col-span-full">
        <CardHeader>
          <CardTitle>Energy map</CardTitle>
          <CardDescription>Energy trading map</CardDescription>
        </CardHeader>
        <CardContent>
          <WorldMap
            dots={matchedOrders
              ?.map((order) => {
                if (
                  BigInt(hhId) === order.buyerId ||
                  BigInt(hhId) === order.sellerId
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
                    start: { lat: seller.latitude, lng: seller.longitude },
                    end: { lat: buyer.latitude, lng: buyer.longitude },
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
          <CardDescription>{`${dataSizeLimit}-hour energy real-time usage level`}</CardDescription>
        </CardHeader>
        <CardContent>
          <AxisChart
            data={[mapToCmtyGridCnsmpData()]}
            labels={["Community grid usage"]}
            colors={[1]}
            chartType={AxisChartType.Line}
          />
        </CardContent>
      </Card>
    </motion.div>
  );
}
