"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Label } from "./ui/label";
import { SidebarTrigger } from "./ui/sidebar";
import { Clock, Thermometer } from "lucide-react";
import { ThemeSwitch } from "@/components/theme-switch";
import { Button } from "./ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./ui/breadcrumb";
import { Separator } from "./ui/separator";
import ApiService from "@/services/api";
import { autoRefreshInterval } from "@/constants/constants";
import { motion } from "motion/react";
import formatText from "@/extensions/string";

export function AppTopbar() {
  const separatorSign = ">";
  const labels: string[] = [];
  const pathnames: string[] = [];

  let curPathname = "";

  usePathname()
    .split("/")
    .forEach((value, index) => {
      if (value !== "") {
        labels.push(formatText(value.replace("-", " ")));
        labels.push(separatorSign);

        curPathname += "/" + value;

        pathnames.push(curPathname);
        pathnames.push(separatorSign);
      }
    });

  labels.pop();
  pathnames.pop();

  // Hide path like '/household/1'
  labels.shift();
  labels.shift();
  labels.shift();
  labels.shift();
  pathnames.shift();
  pathnames.shift();
  pathnames.shift();
  pathnames.shift();

  const [time, setTime] = useState<Date>();
  const [showTime, setShowTime] = useState<boolean>(true);

  const [showWeather, setShowWeather] = useState<boolean>(true);
  const [temp, setTemp] = useState<number>();

  useEffect(() => {
    const fetchData = async () => {
      // Get simulation time
      await ApiService.getSimCfg().then((res) => {
        setTime(res.data.simulationTime);
      });

      await ApiService.getWx().then((res) => {
        setTemp(res.data.temperature);
      });
    };

    fetchData();

    const interval = setInterval(() => {
      fetchData();
    }, autoRefreshInterval);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="sticky top-0 backdrop-blur realtive h-16 border-b items-center flex gap-2 px-4 z-10">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4" />

      <Breadcrumb>
        <BreadcrumbList>
          {pathnames.map((pathname, index) => {
            const curLabel = labels[index];

            if (pathname === separatorSign) {
              return (
                <BreadcrumbSeparator className="hidden md:block" key={index} />
              );
            } else {
              return (
                <BreadcrumbItem className="hidden md:block" key={index}>
                  {index === pathnames.length - 1 ? (
                    <BreadcrumbPage>{curLabel}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink href={pathname}>{curLabel}</BreadcrumbLink>
                  )}
                </BreadcrumbItem>
              );
            }
          })}
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex-1" />

      <motion.div layout className="flex items-center">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowWeather(!showWeather)}
        >
          <Thermometer />
        </Button>
        {showWeather && <Label className="m-1.5">{`${temp?.toFixed(0) ?? '-'} °C`}</Label>}
      </motion.div>

      <Separator orientation="vertical" className="h-4" />

      <motion.div layout className="flex items-center">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowTime(!showTime)}
        >
          <Clock />
        </Button>
        {showTime && time !== undefined && <Label className="m-1.5">{new Date(time).toLocaleString()}</Label>}
      </motion.div>

      <Separator orientation="vertical" className="h-4" />

      <ThemeSwitch />
    </div>
  );
}
