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
import { Coins, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  autoRefreshInterval,
  routing,
} from "@/constants/constants";
import ApiService from "@/services/api";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import CmtyGridAcct from "@/models/cmty-grid-acct";
import { motion } from "motion/react";
import React from "react";
import WorldMap from "@/components/ui/world-map";
import energyUnitConverter from "@/extensions/energy-unit-converter";
import moneyUnitConverter from "@/extensions/money-unit-converter";
import { Separator } from "@/components/ui/separator";

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
];

export default function Trading() {
  const hhId = parseInt(
    usePathname()
      .replace(routing.household, "")
      .replace(routing.trading, "")
      .replaceAll("/", ""),
  );

  const [cmtyGridAcct, setCmtyGridAcct] = useState<CmtyGridAcct>();

  useEffect(() => {
    const fetchData = async () => {
      await ApiService.getCmtyGridAcct(hhId).then((res) => {
        setCmtyGridAcct(res.data);
      });
    };

    fetchData();

    const interval = setInterval(async () => {
      await fetchData();
    }, autoRefreshInterval);

    return () => clearInterval(interval);
  }, []);

  return (
    cmtyGridAcct !== undefined && <motion.div className="grid grid-cols-2 gap-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <Card className="col-span-full">
        <CardHeader>
          <CardTitle>Energy map</CardTitle>
          <CardDescription>
            Energy trading map
          </CardDescription>
        </CardHeader>
        <CardContent>
          <WorldMap
            dots={[
              {
                start: { lat: 34.0522, lng: -118.2437, }, // Los Angeles
                end: { lat: 64.2008, lng: -149.4937, }, // Alaska (Fairbanks)
              },
              {
                start: { lat: 64.2008, lng: -149.4937 }, // Alaska (Fairbanks)
                end: { lat: -15.7975, lng: -47.8919 }, // Brazil (Brasília)
              },
              {
                start: { lat: -15.7975, lng: -47.8919 }, // Brazil (Brasília)
                end: { lat: 51.5074, lng: -0.1278 }, // London
              },
              {
                start: { lat: 51.5074, lng: -0.1278 }, // London
                end: { lat: 28.6139, lng: 77.209 }, // New Delhi
              },
              {
                start: { lat: 28.6139, lng: 77.209 }, // New Delhi
                end: { lat: 43.1332, lng: 131.9113 }, // Vladivostok
              },
              {
                start: { lat: 43.1332, lng: 131.9113 }, // Vladivostok
                end: { lat: 34.0522, lng: -118.2437, }, // Los Angeles
              },
            ]}
            lineColor="#000"
          />
        </CardContent>
      </Card>

      <Card className="col-span-1">
        <CardHeader>
          <CardTitle>Energy balance</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-row gap-2">
          {energyUnitConverter.format(cmtyGridAcct.totalSurplusPowerAmount) ?? '-'} {energyUnitConverter.getTargetUnit()} Available
          <Badge variant="secondary">
            {energyUnitConverter.format(cmtyGridAcct.powerFrozenAmount) ?? '-'} {energyUnitConverter.getTargetUnit()} Pending
          </Badge>
          <div>
            <div className="space-y-1">
              <h4 className="text-sm font-medium leading-none">Radix Primitives</h4>
              <p className="text-sm text-muted-foreground">
                An open-source UI component library.
              </p>
            </div>
            <Separator className="my-4" />
            <div className="flex h-5 items-center space-x-4 text-sm">
              <div>Blog</div>
              <Separator orientation="vertical" />
              <div>Docs</div>
              <Separator orientation="vertical" />
              <div>Source</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="col-span-1">
        <CardHeader>
          <CardTitle>Fund balance</CardTitle>
        </CardHeader>
        <CardContent>
          $ {moneyUnitConverter.format(cmtyGridAcct.balance) ?? '-'} CAD
          <Badge variant="secondary">
            $ {moneyUnitConverter.format(cmtyGridAcct.frozenPaidBalance) ?? '-'} CAD Pending
          </Badge>
        </CardContent>
      </Card>

      <Card className="col-span-full">
        <CardHeader>
          <CardTitle>P2P energy trading</CardTitle>
          <CardDescription>
            Current energy trading opportunities and history
          </CardDescription>
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
                    <Badge
                      variant={
                        trade.status === "Completed"
                          ? "default"
                          : trade.status === "Canceled"
                            ? "secondary"
                            : "destructive"
                      }
                    >
                      {trade.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </motion.div>
  );
}
