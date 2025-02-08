"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Coins, Zap } from 'lucide-react';
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import UotPriceChart from "./uot-price-chart";
import MainGridUsageChart from "./main-grid-usage-chart";
import { autoRefreshInterval, energyUnit, routing } from "@/constants/routing";
import MainGridAcct from "@/models/main-grid-acct";
import ApiService from "@/services/api";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import CmtyGridAcct from "@/models/cmty-grid-acct";

const trades = [
  {
    id: 1,
    neighbor: "House #123",
    amount: "2.5 kWh",
    price: "$0.15/kWh",
    status: "Canceled",
  },
  {
    id: 2,
    neighbor: "House #456",
    amount: "1.8 kWh",
    price: "$0.12/kWh",
    status: "Completed",
  },
  {
    id: 3,
    neighbor: "House #789",
    amount: "3.2 kWh",
    price: "$0.18/kWh",
    status: "Pending",
  },
]

const chartConfig = {
  onPeak: {
    label: "On-peak",
    theme: { light: "hsl(var(--lime-600))", dark: "hsl(var(--teal-700))" },
  },
  midPeak: {
    label: "Mid-peak",
    theme: { light: "hsl(var(--lime-700))", dark: "hsl(var(--teal-600))" },
  },
  offPeak: {
    label: "Off-peak",
    theme: { light: "hsl(var(--lime-800))", dark: "hsl(var(--teal-800))" },
  },
};

export default function Trading() {
  const hhId = parseInt(usePathname().replace(routing.household, "").replace(routing.trading, "").replaceAll("/", ""));

  const [cmtyGridAcct, setCmtyGridAcct] = useState<CmtyGridAcct>();

  useEffect(() => {
    const fetchData = async () => {
      ApiService.getCmtyGridAcct(hhId).then((res) => {
        setCmtyGridAcct(res.data);
      });
    };

    fetchData();

    const interval = setInterval(() => {
      fetchData();
    }, autoRefreshInterval);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid grid-cols-2 gap-4">

      <MainGridUsageChart hhId={hhId} chartConfig={chartConfig} />

      <UotPriceChart chartConfig={chartConfig} />

      <Card className="col-span-full">
        <CardHeader>
          <CardDescription>Community grid account</CardDescription>
          <CardTitle className="grid flex flex-row place-items-center gap-2 pt-2">
            <Coins />
            <div className="flex flex-col gap-2 pl-2">
              ${cmtyGridAcct?.balance} CAD
              <Badge variant="secondary">${cmtyGridAcct?.frozenPaidBalance} CAD Pending</Badge>
            </div>
            <div className="flex-1" />
            <Zap />
            <div className="flex flex-col gap-2 pl-2">
              {cmtyGridAcct?.totalSurplusPowerAmount}{energyUnit}
              <Badge variant="secondary">{cmtyGridAcct?.powerFrozenAmount}{energyUnit} Pending</Badge>
            </div>
            <div className="flex-1" />
          </CardTitle>
        </CardHeader>
        <CardContent>
        </CardContent>
      </Card>

      <Card className="col-span-full">
        <CardHeader>
          <CardTitle>P2P energy trading</CardTitle>
          <CardDescription>Current energy trading opportunities and history</CardDescription>
        </CardHeader>
        <CardContent>
          <Table className="text-center">
            <TableHeader>
              <TableRow>
                <TableHead className="text-center">Neighbor</TableHead>
                <TableHead className="text-center">Amount</TableHead>
                <TableHead className="text-center">Price</TableHead>
                <TableHead className="text-center">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {trades.map((trade) => (
                <TableRow key={trade.id}>
                  <TableCell>{trade.neighbor}</TableCell>
                  <TableCell>{trade.amount}</TableCell>
                  <TableCell>{trade.price}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium 
                    ${trade.status === "Completed" ? "bg-green-100 text-green-800" : (trade.status === "Canceled" ? "bg-red-100 text-red-800" : "bg-yellow-100 text-yellow-800")
                      }`}>
                      {trade.status}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

    </motion.div>
  )
}

