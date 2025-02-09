"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import ApiService from "../../../../services/api"
import { useEffect, useState } from "react"
import { motion } from "motion/react"
import Appl, { AppliancePriority, ApplianceType } from "../../../../models/appl"
import { insertSpaces, toTitleCase } from "@/extensions/string"
import { Refrigerator, Microwave, WashingMachine, Tv, Heater, AirVent, PcCase, Atom, Wine, Waves, ShowerHead } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { usePathname } from "next/navigation"

function ApplianceIcon({ applianceType }: { applianceType: ApplianceType }) {
  switch (applianceType) {
    case ApplianceType.Others:
      return <Atom />;
    case ApplianceType.Furnace:
      return <Heater />;
    case ApplianceType.Dishwasher:
      return <Waves />;
    case ApplianceType.Fridge:
      return <Refrigerator />;
    case ApplianceType.ElectricRange:
      return <Microwave />;
    case ApplianceType.Television:
      return <Tv />;
    case ApplianceType.Computer:
      return <PcCase />;
    case ApplianceType.WashMachine:
      return <WashingMachine />;
    case ApplianceType.WineCeller:
      return <Wine />;
    case ApplianceType.WaterHeater:
      return <ShowerHead />;
    case ApplianceType.AirCondictioner:
      return <AirVent />;
    default:
      return <Atom />;
  }
}

function ApplianceGrid({ currentPathname, appliancesByGroup, groupEnum }:
  { currentPathname: string, appliancesByGroup: Partial<Record<number, Appl[]>>, groupEnum: typeof ApplianceType | typeof AppliancePriority }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {Object.keys(appliancesByGroup).toSorted().map((key) => (
        <div key={key}>
          <CardHeader className="pl-0">
            <CardTitle>{toTitleCase(insertSpaces(groupEnum[parseInt(key)]))}</CardTitle>
          </CardHeader>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {appliancesByGroup[parseInt(key)]?.map((item: Appl) => (
              <Card key={item.id}>
                <div className="flex flex-row place-items-center ">
                  <div className="ml-6">
                    <ApplianceIcon applianceType={item.applianceType} />
                  </div>
                  <CardHeader>
                    <CardTitle>{item.name}</CardTitle>
                    <CardDescription>
                      <Badge variant="outline" className="mr-2">{toTitleCase(insertSpaces(AppliancePriority[item.priority]))}</Badge>
                    </CardDescription>
                  </CardHeader>
                </div>
                <CardContent className="flex flex-row">
                  <div className="flex-1" />
                  <Link href={`${currentPathname}/${item.id}`}>
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

export default function AppliancePage() {
  const currentPathname = usePathname();

  const [data, setData] = useState<Appl[]>([]);

  useEffect(() => {
    ApiService.getAllAppls(1).then((data) => {
      setData(data.data);
    });
  }, []);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <Tabs defaultValue="type">
        <div className="sticky top-16 backdrop-blur flex flex-row place-items-center pt-4" style={{ zIndex: 998 }}>
          <div className="flex-1" />
          <div className="flex flex-row place-items-center gap-4">
            <Label>Group by</Label>
            <TabsList>
              <TabsTrigger value="type">Type</TabsTrigger>
              <TabsTrigger value="priority">Priority</TabsTrigger>
            </TabsList>
          </div>
        </div>
        <TabsContent value="type">
          <ApplianceGrid appliancesByGroup={Object.groupBy(data, (item) => item.applianceType)} groupEnum={ApplianceType} currentPathname={currentPathname} />
        </TabsContent>
        <TabsContent value="priority">
          <ApplianceGrid appliancesByGroup={Object.groupBy(data, (item) => item.priority)} groupEnum={AppliancePriority} currentPathname={currentPathname} />
        </TabsContent>
      </Tabs>
    </motion.div>
  )
}
