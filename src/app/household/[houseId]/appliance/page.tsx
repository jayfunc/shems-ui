"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import ApiService from "../../../../services/api";
import { useState } from "react";
import Appl, {
  AppliancePriority,
  ApplianceStatus,
  ApplianceType,
} from "../../../../models/appl";
import {
  Refrigerator,
  Microwave,
  WashingMachine,
  Tv,
  Heater,
  AirVent,
  PcCase,
  Atom,
  Wine,
  Waves,
  ShowerHead,
  Search,
  Unlink,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { motion } from "motion/react";
import formatText from "@/extensions/string";
import { Input } from "@/components/ui/input";
import useSWR, { preload } from "swr";
import routing from "@/constants/routing";
import { useCurrentHouseId, useDataSizeLimit } from "@/extensions/request";

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

function ApplianceGrid({
  appliancesByGroup,
  groupEnum,
}: {
  appliancesByGroup: Partial<Record<number, Appl[]>>;
  groupEnum:
  | typeof ApplianceType
  | typeof AppliancePriority
  | typeof ApplianceStatus;
}) {
  const keys = Object.keys(appliancesByGroup);
  const dataSizeLimit = useDataSizeLimit();

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {keys.length === 0 ? (
        <div className="flex flex-col gap-2 items-center justify-center w-full min-h-[70vh] text-muted-foreground">
          <Unlink />
          No appliances found
        </div>
      ) : (
        keys.toSorted().map((key) => (
          <div key={key}>
            <CardHeader className="pl-0">
              <CardTitle>{formatText(groupEnum[parseInt(key)])}</CardTitle>
            </CardHeader>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {appliancesByGroup[parseInt(key)]?.map((item: Appl) => (
                <motion.div layoutId={`appl-${item.id}`} key={item.id}>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex flex-row items-center gap-4">
                        <ApplianceIcon applianceType={item.applianceType} />
                        {formatText(item.name)}
                        <div className="flex-1" />
                        <Badge
                          variant={
                            item.status === ApplianceStatus.On
                              ? "default"
                              : "outline"
                          }
                        >
                          {formatText(ApplianceStatus[item.status])}
                        </Badge>
                      </CardTitle>
                      <CardDescription>
                        <Badge variant="outline" className="mt-2">
                          {formatText(AppliancePriority[item.priority])}
                        </Badge>
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-row">
                      <div className="flex-1" />
                      <Link
                        href={`${routing.appliance}/${item.id}`}
                        onMouseOver={() =>
                          preload(
                            ApiService.buildApplCnsmpUri(
                              Number(item.id),
                              dataSizeLimit,
                            ),
                            fetch,
                          )
                        }
                      >
                        <Button variant="secondary">View</Button>
                      </Link>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        ))
      )}
    </motion.div>
  );
}

function filterData(data: Appl[], search: string) {
  return data.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase()),
  );
}

export default function Page() {
  const { data } = useSWR<Appl[]>(
    ApiService.buildAllApplsUri(useCurrentHouseId()),
  );

  const [search, setSearch] = useState<string>("");

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <Tabs defaultValue="type">
        <div className="flex flex-row gap-4 sticky top-16 z-[50] backdrop-blur-sm py-4">
          <div className="relative">
            <Input
              type="search"
              placeholder="Search appliance"
              className="pl-8"
              onChange={(value) => setSearch(value.target.value)}
            />
            <Search className="absolute top-2 left-2 text-muted-foreground size-4" />
          </div>
          <div className="flex-1" />
          <div className="flex flex-row gap-4 items-center">
            <TabsList className="flex flex-col h-full md:flex-row">
              <TabsTrigger className="w-full text-wrap md:text-nowrap" value="type">Type</TabsTrigger>
              <TabsTrigger className="w-full text-wrap md:text-nowrap" value="priority">Priority</TabsTrigger>
              <TabsTrigger className="w-full text-wrap md:text-nowrap" value="status">Status</TabsTrigger>
            </TabsList>
          </div>
        </div>
        <div>
          <TabsContent value="type">
            <ApplianceGrid
              appliancesByGroup={Object.groupBy(
                filterData(data ?? [], search),
                (item) => item.applianceType,
              )}
              groupEnum={ApplianceType}
            />
          </TabsContent>
          <TabsContent value="priority">
            <ApplianceGrid
              appliancesByGroup={Object.groupBy(
                filterData(data ?? [], search),
                (item) => item.priority,
              )}
              groupEnum={AppliancePriority}
            />
          </TabsContent>
          <TabsContent value="status">
            <ApplianceGrid
              appliancesByGroup={Object.groupBy(
                filterData(data ?? [], search),
                (item) => item.status,
              )}
              groupEnum={ApplianceStatus}
            />
          </TabsContent>
        </div>
      </Tabs>
    </motion.div>
  );
}
