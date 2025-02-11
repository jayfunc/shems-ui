import { ChartConfig } from "@/components/ui/chart";
import { getTargetEnergyUnit } from "@/extensions/energy";

export const routing = {
  household: "household",
  dashboard: "dashboard",
  appliance: "appliance",
  trading: "trading",
  login: "login",
};

export const autoRefreshInterval: number = 5000;

export const chartMaxPoints = 12;

export const fractionDigits = 2;