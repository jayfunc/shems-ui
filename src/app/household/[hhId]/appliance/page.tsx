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
import ApiUriBuilder from "../../../../services/api";
import { useEffect, useState } from "react";
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
import { autoRefreshInterval, routing } from "@/constants/constants";
import { motion } from "motion/react";
import { usePathname } from "next/navigation";
import formatText from "@/extensions/string";
import { Input } from "@/components/ui/input";
import useSWR from "swr";

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
                      <Link href={`${routing.appliance}/${item.id}`}>
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
  const hhId = parseInt(
    usePathname()
      .replace(routing.household, "")
      .replace(routing.trading, "")
      .replaceAll("/", ""),
  );

  const { data } = useSWR<Appl[]>(ApiUriBuilder.buildGetAllApplsUri(hhId));

  const [search, setSearch] = useState<string>("");

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <Tabs defaultValue="type">
        <div className="flex flex-row place-items-center gap-4 sticky top-16 backdrop-blur pt-4 z-[998]">
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
          <Label>Group by</Label>
          <TabsList>
            <TabsTrigger value="type">Type</TabsTrigger>
            <TabsTrigger value="priority">Priority</TabsTrigger>
            <TabsTrigger value="status">Status</TabsTrigger>
          </TabsList>
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
