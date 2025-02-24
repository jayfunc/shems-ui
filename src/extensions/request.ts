"use client";

import { useIsMobile } from "@/hooks/use-mobile";
import { usePathname } from "next/navigation";

export const dataSizeLimitForOrders = 24;

export function useDataSizeLimit() {
  return useIsMobile() ? 6 : 12;
}

export function useCurrentHouseId() {
  return Number(usePathname().split("/").at(2) ?? "");
}

export function getServerHostname() {
  if (typeof window !== "undefined") {
    return window.location.hostname;
  }
  return "localhost";
}
