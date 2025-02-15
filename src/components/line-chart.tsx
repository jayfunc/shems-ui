import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "@/components/chart-patched";
import { chartMaxPoints } from "@/constants/constants";
import { CartesianGrid, LabelList, Line, LineChart, XAxis } from "recharts";
import React from "react";
import { Unlink } from "lucide-react";
import { Label } from "./ui/label";
import energyUnitConverter from "../extensions/energy-unit-converter";

interface InputDataProps { dateTime?: Date, data?: number };
interface OutputDataProps { dateTime?: Date, data1?: number, data2?: number };

function combineDates(data1?: InputDataProps[], data2?: InputDataProps[]): OutputDataProps[] {
  let data: OutputDataProps[] = [];
  new Set(
    data1
      ?.map((val) => val.dateTime)
      .concat(data2?.map((val) => val.dateTime))
      .toSorted()
      .reverse(),
  ).forEach((dateTime) => {
    data.push({
      dateTime: dateTime,
      data1: energyUnitConverter.format(data1?.find((element) => element.dateTime === dateTime)
        ?.data),
      data2: energyUnitConverter.format(data2?.find((element) => element.dateTime === dateTime)
        ?.data),
    });
  });
  data = data.slice(0, chartMaxPoints).reverse();
  return data;
}

function handleSingleData(data?: InputDataProps[]) {
  return data?.map((element) => {
    return {
      dateTime: element.dateTime,
      data1: element.data,
      data2: undefined,
    } satisfies OutputDataProps;
  }) ?? [];
}

export function EnergyLineChart({ data, labels, colors }: { data: InputDataProps[][], labels: string[], colors?: number[] }) {
  let outputData: OutputDataProps[] = [];
  if (data.length === 1) {
    outputData = handleSingleData(data[0]);
  } else {
    outputData = combineDates(data[0], data[1]);
  }

  // outputData 如果不满 chartMaxPoints 长度则在前端补全
  const count = chartMaxPoints - outputData.length;
  if (count > 0) {
    outputData = [...Array(count).fill({}), ...outputData];
  }

  // Make sure outputData has at most chartMaxPoints
  outputData = outputData.slice(-chartMaxPoints);

  const isDataEmpty = outputData.every((element) => !element.data1 && !element.data2);

  return (
    <div className="relative">
      <ChartContainer
        config={labels.reduce((acc, label, index) => {
          acc[`data${index + 1}`] = {
            label: `${label}`,
            color: `hsl(var(--chart-${colors?.at(index) ?? index + 1}))`,
          };
          return acc;
        }, {} as ChartConfig)}
        className="max-h-[35vh] w-full"
      >
        <LineChart
          accessibilityLayer
          data={outputData}
          margin={{
            top: 40,
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
            tickFormatter={(value) => value === '' ? '' : new Date(value).toLocaleTimeString()}
          />
          <ChartTooltip
            cursor={false}
            content={
              <ChartTooltipContent
                indicator="dot"
                itemFormatter={(value) => `${value} ${energyUnitConverter.getTargetUnit()}`}
              />
            }
            labelFormatter={(value) => new Date(value).toLocaleString()}
          ></ChartTooltip>
          {labels.map((label, index) => {
            const color = `var(--color-data${index + 1})`;
            return (
              <Line
                key={label}
                dataKey={`data${index + 1}`}
                type="natural"
                stroke={color}
                strokeWidth={2}
                dot={{
                  fill: color,
                }}
                activeDot={{
                  r: 6,
                }}
              >
                <LabelList
                  position="top"
                  fill={color}
                  offset={10}
                  formatter={(value: string | number) => `${value} ${energyUnitConverter.getTargetUnit()}`}
                />
              </Line>
            );
          })}
          <ChartLegend content={<ChartLegendContent />} />
        </LineChart>
      </ChartContainer>
      {isDataEmpty &&
        <div className="flex flex-col gap-2 items-center justify-center w-full h-full text-muted-foreground absolute top-0">
          <Unlink />
          <Label className="text-center">No data available</Label>
        </div>}
    </div>
  );
}