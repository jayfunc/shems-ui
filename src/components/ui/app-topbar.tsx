"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { toTitleCase } from "@/extensions/string";
import { Label } from "./label";
import { SidebarTrigger } from "./sidebar";
import { Clock, CloudFog, Thermometer } from "lucide-react";
import { ThemeSwitch } from "@/services/settings";
import { Button } from "./button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./breadcrumb";
import { Separator } from "./separator";
import ApiService from "@/services/api";
import { autoRefreshInterval } from "@/constants/routing";

export function AppTopbar() {
  const separatorSign = ">";
  const labels: string[] = [];
  const pathnames: string[] = [];

  let curPathname = "";

  usePathname()
    .split("/")
    .forEach((value, index) => {
      if (value !== "") {
        labels.push(toTitleCase(value.replace("-", " ")));
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

  const [time, setTime] = useState<string>();
  const [showTime, setShowTime] = useState<boolean>(true);

  const [showWeather, setShowWeather] = useState<boolean>(true);
  const [temp, setTemp] = useState<number>();

  useEffect(() => {
    const fetchData = async () => {
      // Get simulation time
      ApiService.getSimCfg().then((res) => {
        setTime(
          new Date(res.data.simulationTime).toLocaleString("en-US", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
          }),
        );
      });

      // Get weather
      ApiService.getWx().then((res) => {
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

      <Button
        variant="ghost"
        size="icon"
        className="w-7 h-7"
        onClick={() => setShowWeather(!showWeather)}
      >
        <Thermometer />
      </Button>
      {showWeather ? <Label>{temp}</Label> : null}

      <Button
        variant="ghost"
        size="icon"
        className="w-7 h-7"
        onClick={() => setShowTime(!showTime)}
      >
        <Clock />
      </Button>
      {showTime ? <Label>{time}</Label> : null}
      <ThemeSwitch />
    </div>
  );
}
