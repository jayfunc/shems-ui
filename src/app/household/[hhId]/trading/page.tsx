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
  autoRefreshInterval,
  chartMaxPoints,
  routing,
} from "@/constants/constants";
import ApiService from "@/services/api";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import CmtyGridAcct from "@/models/cmty-grid-acct";
import { motion } from "motion/react";
import React from "react";
import WorldMap from "@/components/world-map-patched";
import energyUnitConverter from "@/extensions/energy-unit-converter";
import moneyUnitConverter from "@/extensions/money-unit-converter";
import { Separator } from "@/components/ui/separator";
import Hse from "@/models/hse";
import { AxisChart, AxisChartType, InputAxisChartDataProps } from "@/components/axis-chart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import OrderMatch from "@/models/order-match";
import OrderBuy, { BuySellOrderStatus as BuySellOrderStatus } from "@/models/order-buy";
import OrderSell from "@/models/order-sell";
import formatText from "@/extensions/string";

export default function Trading() {
  const hhId = parseInt(
    usePathname()
      .replace(routing.household, "")
      .replace(routing.trading, "")
      .replaceAll("/", ""),
  );

  const [hses, setHses] = useState<Hse[]>();

  const [cmtyGridAcct, setCmtyGridAcct] = useState<CmtyGridAcct>();
  const [cmtyCnsmp, setCmtyCnsmp] = useState<InputAxisChartDataProps[]>([]);

  const [matchedOrders, setMatchedOrder] = useState<OrderMatch[]>([]);
  const [buyOrders, setBuyOrders] = useState<OrderBuy[]>([]);
  const [sellOrders, setSellOrders] = useState<OrderSell[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      await ApiService.getCmtyGridAcct(hhId).then((res) => {
        setCmtyGridAcct(res.data);
      });

      await ApiService.getHseCnsmp(hhId).then((res) => {
        setCmtyCnsmp(res.data.map((element) => {
          return {
            dateTime: element.consumeTime,
            data: element.communityGridConsumeAmount,
          };
        }));
      });

      await ApiService.getAllMatchedOrders(hhId).then((res) => {
        setMatchedOrder(res.data);
      });

      await ApiService.getAllBuyOrders(hhId).then((res) => {
        setBuyOrders(res.data);
      });

      await ApiService.getAllSellOrders(hhId).then((res) => {
        setSellOrders(res.data);
      });
    };

    ApiService.getAllHses().then((res) => {
      setHses(res.data);
    });

    fetchData();

    const interval = setInterval(async () => {
      await fetchData();
    }, autoRefreshInterval);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div className="grid grid-cols-2 gap-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>

      <Card className="col-span-1">
        <CardHeader>
          <CardTitle>Energy balance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex h-5 items-center space-x-4 text-sm">
            <div>
              {energyUnitConverter.formatInStringWithUnit(cmtyGridAcct?.totalSurplusPowerAmount)} in your account
            </div>
            <Separator orientation="vertical" />
            <div>
              {energyUnitConverter.formatInStringWithUnit(cmtyGridAcct?.powerFrozenAmount)} frozen
            </div>
          </div>
          <Separator className="my-4" />
          <div className="flex h-5 items-center space-x-4 text-sm text-muted-foreground">
            <div>
              {energyUnitConverter.formatInStringWithUnit(Number(cmtyGridAcct?.powerSoldAmount))} sold
            </div>
            <Separator orientation="vertical" />
            <div>
              {energyUnitConverter.formatInStringWithUnit(cmtyGridAcct?.availableForSalePowerAmount)} available for sale
            </div>
          </div>
          <div className="my-4" />
          <div className="flex h-5 items-center space-x-4 text-sm text-muted-foreground">
            <div>
              {energyUnitConverter.formatInStringWithUnit(Number(cmtyGridAcct?.totalBoughtPowerAmount))} bought
            </div>
            <Separator orientation="vertical" />
            <div>
              {energyUnitConverter.formatInStringWithUnit(Number(cmtyGridAcct?.availableForUsePowerAmount))} available for use
            </div>
            <Separator orientation="vertical" />
            <div>
              {energyUnitConverter.formatInStringWithUnit(Number(cmtyGridAcct?.totalUsedPowerAmount))} used
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
              {moneyUnitConverter.formatInStringWithUnit(cmtyGridAcct?.balance)} in your account
            </div>
            <Separator orientation="vertical" />
            <div>
              {moneyUnitConverter.formatInStringWithUnit(cmtyGridAcct?.frozenPaidBalance)} frozen
            </div>
          </div>
          <Separator className="my-4" />
          <div className="flex h-5 items-center space-x-4 text-sm text-muted-foreground">
            <div>
              {moneyUnitConverter.formatInStringWithUnit(Number(cmtyGridAcct?.balanceEarned))} earned
            </div>
          </div>
          <div className="my-4" />
          <div className="flex h-5 items-center space-x-4 text-sm text-muted-foreground">
            <div>
              {moneyUnitConverter.formatInStringWithUnit(cmtyGridAcct?.balancePaid)} paid
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="col-span-full">
        <Tabs defaultValue="match">
          <div className="flex flex-row items-center mt-6 mr-6">
            <div className="flex-1" />
            <TabsList>
              <TabsTrigger value="buy">Buy orders</TabsTrigger>
              <TabsTrigger value="sell">Sell orders</TabsTrigger>
              <TabsTrigger value="match">Matched orders</TabsTrigger>
            </TabsList>
          </div>
          <div className="-mt-16">

            <TabsContent value="buy">
              <CardHeader>
                <CardTitle>P2P energy trading</CardTitle>
                <CardDescription>
                  Buy orders
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table className="text-center">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-center">Quantity</TableHead>
                      <TableHead className="text-center">Limit price</TableHead>
                      <TableHead className="text-center">Submitted time</TableHead>
                      <TableHead className="text-center">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {buyOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell>{order.quantity}</TableCell>
                        <TableCell>{order.buyPrice}</TableCell>
                        <TableCell>{order.orderTime.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              order.orderStatus === BuySellOrderStatus.Completed
                                ? "default"
                                : order.orderStatus === BuySellOrderStatus.Cancelled
                                  ? "destructive"
                                  : order.orderStatus === BuySellOrderStatus.PartiallyCompleted
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
              </CardContent>
            </TabsContent>

            <TabsContent value="sell">
              <CardHeader>
                <CardTitle>P2P energy trading</CardTitle>
                <CardDescription>
                  Buy orders
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table className="text-center">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-center">Quantity</TableHead>
                      <TableHead className="text-center">Limit price</TableHead>
                      <TableHead className="text-center">Submitted time</TableHead>
                      <TableHead className="text-center">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sellOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell>{order.quantity}</TableCell>
                        <TableCell>{order.sellPrice}</TableCell>
                        <TableCell>{order.orderTime.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              order.orderStatus === BuySellOrderStatus.Completed
                                ? "default"
                                : order.orderStatus === BuySellOrderStatus.Cancelled
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
              </CardContent>
            </TabsContent>

            <TabsContent value="match">
              <CardHeader>
                <CardTitle>P2P energy trading</CardTitle>
                <CardDescription>
                  Matched orders
                </CardDescription>
              </CardHeader>
              <CardContent>
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
                    {matchedOrders.map((order) => (
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
              </CardContent>
            </TabsContent>

          </div>
        </Tabs>
      </Card>

      <Card className="col-span-full">
        <CardHeader>
          <CardTitle>Energy map</CardTitle>
          <CardDescription>
            Energy trading map
          </CardDescription>
        </CardHeader>
        <CardContent>
          <WorldMap
            dots={matchedOrders.map((order) => {

              if (BigInt(hhId) === order.buyerId || BigInt(hhId) === order.sellerId) {

                const buyer = hses?.find((hse) => hse.id.toString() === order.buyerId.toString());
                const seller = hses?.find((hse) => hse.id.toString() === order.sellerId.toString());

                if (!buyer || !seller) return undefined;

                return {
                  start: { lat: seller.latitude, lng: seller.longitude },
                  end: { lat: buyer.latitude, lng: buyer.longitude },
                }
              }
              return undefined;
            }).filter(dot => dot !== undefined)}
            lineColor="#000"
          />
        </CardContent>
      </Card>

      <Card className="col-span-full">
        <CardHeader>
          <CardTitle>Energy usage in community grid</CardTitle>
          <CardDescription>{`${chartMaxPoints}-hour energy real-time usage level`}</CardDescription>
        </CardHeader>
        <CardContent>
          <AxisChart data={[cmtyCnsmp]} labels={["Community grid usage"]} colors={[1]} chartType={AxisChartType.Line} />
        </CardContent>
      </Card>

    </motion.div>
  );
}
