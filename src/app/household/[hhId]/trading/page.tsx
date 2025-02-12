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
import formatEnergy, { getTargetEnergyUnit } from "@/extensions/energy";
import { EnergyMap } from "./energy-globe";

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
    <motion.div className="grid grid-cols-2 gap-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <Card className="col-span-full">
        <CardHeader>
          <CardTitle>Energy map</CardTitle>
          <CardDescription>
            Energy trading map
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EnergyMap />
        </CardContent>
      </Card>

      <Card className="col-span-full">
        <CardHeader>
          <CardDescription>Community account</CardDescription>
          <CardTitle className="grid flex flex-row place-items-center gap-2 pt-2">
            <Coins />
            <div className="flex flex-col gap-2 pl-2">
              ${cmtyGridAcct?.balance} CAD
              <Badge variant="secondary">
                ${cmtyGridAcct?.frozenPaidBalance} CAD Pending
              </Badge>
            </div>
            <div className="flex-1" />
            <Zap />
            <div className="flex flex-col gap-2 pl-2">
              {formatEnergy(cmtyGridAcct?.totalSurplusPowerAmount)} {getTargetEnergyUnit()}
              <Badge variant="secondary">
                {formatEnergy(cmtyGridAcct?.powerFrozenAmount)} {getTargetEnergyUnit()} Pending
              </Badge>
            </div>
            <div className="flex-1" />
          </CardTitle>
        </CardHeader>
        <CardContent></CardContent>
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
