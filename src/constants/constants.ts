export const routing = {
  household: "household",
  dashboard: "dashboard",
  appliance: "appliance",
  grid: "grid",
  trading: "trading",
  login: "login",
  admin: "admin",
  settings: "settings",
};

/**
 * Control the auto-refresh interval for the data fetching.
 */
export const autoRefreshInterval: number = 5000;

/**
 * Control the maximum number of points to be displayed in the chart.
 *
 * This parameter is also used to fetch the data from the backend.
 */
export const chartMaxPoints = 12;

/**
 * Not applicable for the battery volumn percentage.
 */
export const fractionDigits = 2;

export const adminUsername = "admin";

export const userPassword = "userpwd";

export const adminPassword = "adminpwd";

export const hideGlobalToast = false;
