"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import EquipmentService from "../services/equipment"
import { Equipment } from "../models/equipment"
import { useEffect, useState } from "react"
import { Plus } from "lucide-react"
import { Input } from "@/components/ui/input"
import { DialogHeader, DialogFooter, DialogDescription, DialogContent, DialogTrigger, Dialog, DialogTitle } from "@/components/ui/dialog";
import { motion } from "motion/react"

function EquipmentGrid({ equipment }: { equipment: any }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {Object.keys(equipment).toSorted().map((key) => (
        <div key={key}>
          <CardHeader className="pl-0 mt-4">
            <CardTitle>{key}</CardTitle>
          </CardHeader>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {equipment[key].map((item: Equipment) => (
              <Card key={item.id}>
                <div className="flex flex-row place-items-center ">
                  <item.icon className="ml-6" />
                  <CardHeader>
                    <CardTitle>{item.name}</CardTitle>
                    <CardDescription>{item.desc}</CardDescription>
                  </CardHeader>
                </div>
                <CardContent className="flex flex-row place-content-between">
                  <div className="flex flex-row gap-2 place-items-center">
                    <Badge variant="secondary">{item.usage}</Badge>
                    <Badge variant="secondary">{item.area}</Badge>
                  </div>
                  <Link href={`/equipment/${item.id}`}>
                    <Button variant="secondary">View</Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </motion.div>
  );
}

export default function EquipmentPage() {
  const [data, setData] = useState<Equipment[]>([]);

  useEffect(() => {
    EquipmentService.getEquipment().then((data) => {
      setData(data);
    });
  }, []);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="gap-4">
      <Card>
        <CardContent>
          <Tabs defaultValue="area">
            <CardHeader className="flex flex-row place-content-between place-items-center px-0">
              <CardTitle className="flex flex-row place-items-center gap-4">
                Equipment
                <Link href="/equipment/usage-summary">
                  <Button variant="outline">
                    Usage Summary
                  </Button>
                </Link>
              </CardTitle>
              <div className="flex flex-row place-items-center gap-4">
                <Label>Group by</Label>
                <TabsList>
                  <TabsTrigger value="area">Area</TabsTrigger>
                  <TabsTrigger value="usage">Usage</TabsTrigger>
                </TabsList>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button><Plus />New equipment</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Nwe equipment</DialogTitle>
                      <DialogDescription>
                        Fill in the form below to create a new equipment.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                          Name
                        </Label>
                        <Input id="name" value="Oven" className="col-span-3" />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="area" className="text-right">
                          Area
                        </Label>
                        <Input id="area" value="Kitchen" className="col-span-3" />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit">Save</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

              </div>
            </CardHeader>
            <TabsContent value="area">
              <EquipmentGrid equipment={Object.groupBy(data, (item) => item.area)} />
            </TabsContent>
            <TabsContent value="usage">
              <EquipmentGrid equipment={Object.groupBy(data, (item) => item.usage)} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </motion.div>
  )
}
