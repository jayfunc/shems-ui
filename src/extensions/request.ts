"use client";

import { useIsMobile } from "@/hooks/use-mobile";
import { usePathname } from "next/navigation";

export const dataSizeLimitForOrders = 24 * 30;

export function useDataSizeLimit() {
  return useIsMobile() ? 6 : 12;
}

export function useCurrentHouseId() {
  return Number(usePathname().split("/").at(2) ?? "");
}