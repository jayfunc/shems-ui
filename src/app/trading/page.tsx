"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowLeftRight, Check, X } from 'lucide-react';
import { motion } from "framer-motion";

const trades = [
  {
    id: 1,
    neighbor: "House #123",
    amount: "2.5 kWh",
    price: "$0.15/kWh",
    status: "Pending",
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

export default function Trading() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid gap-4">
      <Card>
        <CardHeader>
          <CardTitle>P2P Energy Trading</CardTitle>
          <CardDescription>Current energy trading opportunities and history</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Neighbor</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {trades.map((trade) => (
                <TableRow key={trade.id}>
                  <TableCell>{trade.neighbor}</TableCell>
                  <TableCell>{trade.amount}</TableCell>
                  <TableCell>{trade.price}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${trade.status === "Completed" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                      }`}>
                      {trade.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    {trade.status === "Pending" && (
                      <div className="flex gap-2">
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>New Trade</CardTitle>
          <CardDescription>Initiate a new P2P energy trade</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Button className="gap-2">
              <ArrowLeftRight className="h-4 w-4" />
              Create Trade Request
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

