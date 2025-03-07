"use client";

import {
  Card,
  CardContent,
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
import { AxisChart, AxisChartType, PrimaryType, SecondaryType } from "@/components/axis-chart";
import useSWR from "swr";
import CardTabs from "@/components/card-tabs";
import {
  useCurrentHouseId,
} from "@/extensions/request";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import routing from "@/constants/routing";

export default function Trading() {
  const houseId = useCurrentHouseId();

  const { data: cmtyGridAcct } = useSWR<CmtyGridAcct>(
    ApiService.buildCmtyGridAcctUri(houseId),
  );

  const { data: houseTradingStat } = useSWR<HousetradingStat>(ApiService.buildHouseTradingStatUri(houseId));
  const { data: cmtyGridStat } = useSWR<CmtyGridTradingStat>(ApiService.buildCmtyGridStatUri());
  const { data: matchOrderPriceStat } = useSWR<MatchOrderPriceStat[]>(ApiService.buildMatchOrderPriceStatUri());
  const { data: matchOrderQtyStat } = useSWR<MatchOrderQtyStat[]>(ApiService.buildMatchOrderQtyStatUri());

  return (
    <motion.div
      className="grid grid-cols-4 gap-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >

      <CardTabs
        titles="Community matched order summary"
        descs={[`24-hour average trading price`, `24-hour trading quantity`]}
        tabLabels={["Price", "Quantity"]}
        tabContents={[
          <AxisChart
            primaryType={PrimaryType.Time}
            secondaryType={SecondaryType.Money}
            key={0}
            data={[matchOrderPriceStat?.map((value) => {
              return { primary: value.matchTime, secondary: value.matchPrice };
            }) ?? []]}
            labels={["Price"]}
            colors={["--power-cnsmp"]}
            chartType={AxisChartType.Line}
          />,
          <AxisChart
            primaryType={PrimaryType.Time}
            secondaryType={SecondaryType.Energy}
            key={1}
            data={[matchOrderQtyStat?.map((value) => {
              return { primary: value.matchTime, secondary: value.quantity };
            }) ?? []]}
            labels={["Quantity"]}
            colors={["--power-cnsmp"]}
            chartType={AxisChartType.Line}
          />
        ]}
      />

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

      <CardTabs
        defaultTabKeyIndex={1}
        className="col-span-full md:col-span-2"
        titles="Trading price summary"
        descs={[`Past hour trading price summary`, `Past day trading price summary`]}
        tabLabels={["Last hour", "Last day"]}
        tabContents={[
          <AxisChart
            secondaryType={SecondaryType.Money}
            key={0}
            data={[
              [{
                primary: "Buy order average price",
                secondary: houseTradingStat?.lastHour.buyOrderAvgPrice
              }, {
                primary: "Sell order average price",
                secondary: houseTradingStat?.lastHour.sellOrderAvgPrice
              }, {
                primary: "Matched order average price as buyer",
                secondary: houseTradingStat?.lastHour.matchAvgPriceAsBuyer
              }, {
                primary: "Matched order average price as seller",
                secondary: houseTradingStat?.lastHour.matchAvgPriceAsSeller
              }], [{
                primary: "Buy order average price",
                secondary: cmtyGridStat?.lastHour.buyOrderAvgPrice
              }, {
                primary: "Sell order average price",
                secondary: cmtyGridStat?.lastHour.sellOrderAvgPrice
              }, {
                primary: "Matched order average price as buyer",
                secondary: cmtyGridStat?.lastHour.matchAvgPrice
              }, {
                primary: "Matched order average price as seller",
                secondary: cmtyGridStat?.lastHour.matchAvgPrice
              }]]}
            labels={[
              "Me",
              "Community",
            ]}
            colors={["--power-buy", "--power-sell"]}
            chartType={AxisChartType.Bar}
          />,
          <AxisChart
            secondaryType={SecondaryType.Money}
            key={1}
            data={[
              [{
                primary: "Buy order average price",
                secondary: houseTradingStat?.lastDay.buyOrderAvgPrice
              }, {
                primary: "Sell order average price",
                secondary: houseTradingStat?.lastDay.sellOrderAvgPrice
              }, {
                primary: "Matched order average price as buyer",
                secondary: houseTradingStat?.lastDay.matchAvgPriceAsBuyer
              }, {
                primary: "Matched order average price as seller",
                secondary: houseTradingStat?.lastDay.matchAvgPriceAsSeller
              }], [{
                primary: "Buy order average price",
                secondary: cmtyGridStat?.lastDay.buyOrderAvgPrice
              }, {
                primary: "Sell order average price",
                secondary: cmtyGridStat?.lastDay.sellOrderAvgPrice
              }, {
                primary: "Matched order average price as buyer",
                secondary: cmtyGridStat?.lastDay.matchAvgPrice
              }, {
                primary: "Matched order average price as seller",
                secondary: cmtyGridStat?.lastDay.matchAvgPrice
              }]]}
            labels={[
              "Me",
              "Community",
            ]}
            colors={["--power-buy", "--power-sell"]}
            chartType={AxisChartType.Bar}
          />
        ]}
      />

      <CardTabs
        defaultTabKeyIndex={1}
        className="col-span-full md:col-span-2"
        titles="Trading energy summary"
        descs={[`Past hour trading energy summary`, `Past day trading energy summary`]}
        tabLabels={["Last hour", "Last day"]}
        tabContents={[
          <AxisChart
            secondaryType={SecondaryType.Energy}
            key={0}
            data={[
              [{
                primary: "Buy order total energy",
                secondary: houseTradingStat?.lastHour.totalBuyQuantity
              }, {
                primary: "Sell order total energy",
                secondary: houseTradingStat?.lastHour.totalSellQuantity
              }, {
                primary: "Matched order total energy as buyer",
                secondary: houseTradingStat?.lastHour.totalMatchQuantityAsBuyer
              }, {
                primary: "Matched order total energy as seller",
                secondary: houseTradingStat?.lastHour.totalMatchQuantityAsSeller
              }], [{
                primary: "Buy order total energy",
                secondary: cmtyGridStat?.lastHour.totalBuyQuantity
              }, {
                primary: "Sell order total energy",
                secondary: cmtyGridStat?.lastHour.totalSellQuantity
              }, {
                primary: "Matched order total energy as buyer",
                secondary: cmtyGridStat?.lastHour.totalMatchQuantity
              }, {
                primary: "Matched order total energy as seller",
                secondary: cmtyGridStat?.lastHour.totalMatchQuantity
              }]]}
            labels={[
              "Me",
              "Community",
            ]}
            colors={["--power-buy", "--power-sell"]}
            chartType={AxisChartType.Bar}
          />,
          <AxisChart
            secondaryType={SecondaryType.Energy}
            key={1}
            data={[
              [{
                primary: "Buy order total energy",
                secondary: houseTradingStat?.lastDay.totalBuyQuantity
              }, {
                primary: "Sell order total energy",
                secondary: houseTradingStat?.lastDay.totalSellQuantity
              }, {
                primary: "Matched order total energy as buyer",
                secondary: houseTradingStat?.lastDay.totalMatchQuantityAsBuyer
              }, {
                primary: "Matched order total energy as seller",
                secondary: houseTradingStat?.lastDay.totalMatchQuantityAsSeller
              }], [{
                primary: "Buy order total energy",
                secondary: cmtyGridStat?.lastDay.totalBuyQuantity
              }, {
                primary: "Sell order total energy",
                secondary: cmtyGridStat?.lastDay.totalSellQuantity
              }, {
                primary: "Matched order total energy as buyer",
                secondary: cmtyGridStat?.lastDay.totalMatchQuantity
              }, {
                primary: "Matched order total energy as seller",
                secondary: cmtyGridStat?.lastDay.totalMatchQuantity
              }]]}
            labels={[
              "Me",
              "Community",
            ]}
            colors={["--power-buy", "--power-sell"]}
            chartType={AxisChartType.Bar}
          />
        ]}
      />

      <CardTabs
        defaultTabKeyIndex={1}
        className="col-span-full md:col-span-2"
        titles="Trading order summary"
        descs={[`Past hour trading order summary`, `Past day trading order summary`]}
        tabLabels={["Last hour", "Last day"]}
        tabContents={[
          <AxisChart
            key={0}
            data={[
              [{
                primary: "Buy order total amount",
                secondary: houseTradingStat?.lastHour.totalBuyOrders
              }, {
                primary: "Sell order total amount",
                secondary: houseTradingStat?.lastHour.totalSellOrders
              }, {
                primary: "Matched order total amount as buyer",
                secondary: houseTradingStat?.lastHour.totalMatchOrdersAsBuyer
              }, {
                primary: "Matched order total amount as seller",
                secondary: houseTradingStat?.lastHour.totalMatchOrdersAsSeller
              }], [{
                primary: "Buy order total amount",
                secondary: cmtyGridStat?.lastHour.totalBuyOrders
              }, {
                primary: "Sell order total amount",
                secondary: cmtyGridStat?.lastHour.totalSellOrders
              }, {
                primary: "Matched order total amount as buyer",
                secondary: cmtyGridStat?.lastHour.totalMatchOrders
              }, {
                primary: "Matched order total amount as seller",
                secondary: cmtyGridStat?.lastHour.totalMatchOrders
              }]]}
            labels={[
              "Me",
              "Community",
            ]}
            colors={["--power-buy", "--power-sell"]}
            chartType={AxisChartType.Bar}
          />,
          <AxisChart
            key={1}
            data={[
              [{
                primary: "Buy order total amount",
                secondary: houseTradingStat?.lastDay.totalBuyOrders
              }, {
                primary: "Sell order total amount",
                secondary: houseTradingStat?.lastDay.totalSellOrders
              }, {
                primary: "Matched order total amount as buyer",
                secondary: houseTradingStat?.lastDay.totalMatchOrdersAsBuyer
              }, {
                primary: "Matched order total amount as seller",
                secondary: houseTradingStat?.lastDay.totalMatchOrdersAsSeller
              }], [{
                primary: "Buy order total amount",
                secondary: cmtyGridStat?.lastDay.totalBuyOrders
              }, {
                primary: "Sell order total amount",
                secondary: cmtyGridStat?.lastDay.totalSellOrders
              }, {
                primary: "Matched order total amount as buyer",
                secondary: cmtyGridStat?.lastDay.totalMatchOrders
              }, {
                primary: "Matched order total amount as seller",
                secondary: cmtyGridStat?.lastDay.totalMatchOrders
              }]]}
            labels={[
              "Me",
              "Community",
            ]}
            colors={["--power-buy", "--power-sell"]}
            chartType={AxisChartType.Bar}
          />
        ]}
      />

      <CardTabs
        defaultTabKeyIndex={1}
        className="col-span-full md:col-span-2"
        titles="Trading rate summary"
        descs={[`Past hour trading rate summary`, `Past day trading rate summary`]}
        tabLabels={["Last hour", "Last day"]}
        tabContents={[
          <AxisChart
            secondaryType={SecondaryType.Percentage}
            key={0}
            data={[
              [{
                primary: "Buy order match rate",
                secondary: (houseTradingStat?.lastHour.buyOrderMatchRate ?? 0) * 100
              }, {
                primary: "Sell order match rate",
                secondary: (houseTradingStat?.lastHour.sellOrderMatchRate ?? 0) * 100
              }], [{
                primary: "Buy order match rate",
                secondary: (cmtyGridStat?.lastHour.buyOrderMatchRate ?? 0) * 100
              }, {
                primary: "Sell order match rate",
                secondary: (cmtyGridStat?.lastHour.sellOrderMatchRate ?? 0) * 100
              }]]}
            labels={[
              "Me",
              "Community",
            ]}
            colors={["--power-buy", "--power-sell"]}
            chartType={AxisChartType.Bar}
          />,
          <AxisChart
            secondaryType={SecondaryType.Percentage}
            key={1}
            data={[
              [{
                primary: "Buy order match rate",
                secondary: (houseTradingStat?.lastDay.buyOrderMatchRate ?? 0) * 100
              }, {
                primary: "Sell order match rate",
                secondary: (houseTradingStat?.lastDay.sellOrderMatchRate ?? 0) * 100
              }], [{
                primary: "Buy order match rate",
                secondary: (cmtyGridStat?.lastDay.buyOrderMatchRate ?? 0) * 100
              }, {
                primary: "Sell order match rate",
                secondary: (cmtyGridStat?.lastDay.sellOrderMatchRate ?? 0) * 100
              }]]}
            labels={[
              "Me",
              "Community",
            ]}
            colors={["--power-buy", "--power-sell"]}
            chartType={AxisChartType.Bar}
          />
        ]}
      />

      <Link className="flex justify-end col-span-full" href={`${routing.trading}/${routing.history}`}>
        <Button>See my trading history</Button>
      </Link>

    </motion.div>
  );
}
