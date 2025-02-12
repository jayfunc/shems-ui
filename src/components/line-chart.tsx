import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { chartMaxPoints } from "@/constants/constants";
import formatEnergy, { getTargetEnergyUnit } from "../extensions/energy";
import { CartesianGrid, LabelList, Line, LineChart, XAxis } from "recharts";
import React from "react";

function combineDates(data1: any[], data2: any[]): any[] {
  let data: any[] = [];
  new Set(
    data1
      .map((val) => val.dateTime)
      .concat(data2.map((val) => val.dateTime))
      .toSorted()
      .reverse(),
  ).forEach((dateTime) => {
    data.push({
      dateTime: dateTime,
      data1: formatEnergy(data1.find((element) => element.dateTime === dateTime)
        ?.data),
      data2: formatEnergy(data2.find((element) => element.dateTime === dateTime)
        ?.data),
    });
  });
  data = data.slice(0, chartMaxPoints).reverse();
  return data;
}

function handleSingleData(data: any[]) {
  data.forEach((element) => {
    element.data1 = formatEnergy(element.data);
  });
  return data;
}

export function EnergyLineChart({ data, labels, colors }: { data: any[], labels: string[], colors?: number[] }) {
  if (data.length === 1) {
    data = handleSingleData(data[0]);
  } else {
    data = combineDates(data[0], data[1]);
  }
  return (
    <ChartContainer
      config={labels.reduce((acc, label, index) => {
        acc[`data${index + 1}`] = {
          label: `${label} (${getTargetEnergyUnit()})`,
          color: `hsl(var(--chart-${colors?.at(index) ?? index + 1}))`,
        };
        return acc;
      }, {} as Record<string, { label: string; color: string }>)}
      className="max-h-[35vh] w-full"
    >
      <LineChart
        accessibilityLayer
        data={data}
        margin={{
          top: 20,
          left: 40,
          right: 40,
        }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="dateTime"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => new Date(value).toLocaleTimeString()}
        />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent indicator="line" />}
        />
        {labels.map((label, index) => (
          <Line
            key={label}
            dataKey={`data${index + 1}`}
            type="natural"
            stroke={`var(--color-data${index + 1})`}
            strokeWidth={2}
            dot={{
              fill: `var(--color-data${index + 1})`,
            }}
            activeDot={{
              r: 6,
            }}
          >
            <LabelList
              position="top"
              offset={12}
              className="fill-foreground"
              fontSize={12}
            />
          </Line>
        ))}
        <ChartLegend content={<ChartLegendContent />} />
      </LineChart>
    </ChartContainer>

  );
}