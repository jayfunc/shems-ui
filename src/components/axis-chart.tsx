/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/chart-patched";
import {
  Area,
  AreaChart,
  CartesianGrid,
  LabelList,
  Line,
  LineChart,
  XAxis,
  YAxis,
} from "recharts";
import React from "react";
import { LoaderCircle, Unlink } from "lucide-react";
import { Label } from "./ui/label";
import energyUnitConverter from "../extensions/energy-unit-converter";
import { Button } from "./ui/button";

export enum AxisChartType {
  Line,
  Area,
  Bar,
}

export interface InputAxisChartDataProps {
  dateTime?: Date;
  data?: number;
}
interface OutputAxisChartDataProps {
  dateTime?: Date;
  [key: string]: any;
}

function convertToOutputData(
  ...dataArrays: InputAxisChartDataProps[][]
): OutputAxisChartDataProps[] {
  const data: OutputAxisChartDataProps[] = [];
  const allDates = new Set(
    dataArrays
      .flatMap((dataArray) => dataArray.map((val) => val.dateTime))
      .toSorted(),
  );

  allDates.forEach((dateTime) => {
    const combinedData: OutputAxisChartDataProps = {
      dateTime: dateTime,
      data1: undefined,
      data2: undefined,
    };
    dataArrays.forEach((dataArray, index) => {
      combinedData[`data${index + 1}`] = energyUnitConverter.format(
        dataArray.find((element) => element.dateTime === dateTime)?.data,
      );
    });
    data.push(combinedData);
  });

  return data;
}

function getChartConfig(labels: string[], colors?: string[]): ChartConfig {
  return labels.reduce((acc, label, index) => {
    acc[`data${index + 1}`] = {
      label: `${label}`,
      color: `hsl(var(${colors?.at(index) ?? '--foreground'}))`,
    };
    return acc;
  }, {} as ChartConfig);
}

export function AxisChart({
  data,
  chartType,
  labels,
  colors,
  isLoading,
}: {
  data?: InputAxisChartDataProps[][];
  chartType: AxisChartType;
  labels: string[];
  colors?: string[];
  isLoading?: boolean;
}) {
  const outputData = convertToOutputData(...(data ?? []));
  const isDataEmpty =
    isLoading !== true &&
    outputData.every(
      (element) => element.data1 == null && element.data2 == null,
    );

  return (
    <div className="relative">
      {chartType === AxisChartType.Line && (
        <EnergyLineChart
          outputData={outputData}
          labels={labels}
          colors={colors}
        />
      )}
      {chartType === AxisChartType.Area && (
        <EnergyAreaChart outputData={outputData} labels={labels} colors={colors} />
      )}
      {isDataEmpty && (
        <div className="flex flex-col gap-2 items-center justify-center w-full h-full text-muted-foreground absolute top-0">
          <Unlink />
          <Label className="text-center">No data available</Label>
        </div>
      )}
      {isLoading && (
        <div className="flex flex-col gap-2 items-center justify-center w-full h-full text-muted-foreground absolute top-0">
          <LoaderCircle className="animate-spin" />
          <Label className="text-center">Loading...</Label>
        </div>
      )}
    </div>
  );
}

function EnergyLineChart({
  outputData,
  labels,
  colors,
}: {
  outputData: OutputAxisChartDataProps[];
  labels: string[];
  colors?: string[];
}) {
  return (
    <ChartContainer
      config={getChartConfig(labels, colors)}
      className="max-h-[45vh] w-full"
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
          tickFormatter={(value) =>
            value === "" ? "" : new Date(value).toLocaleTimeString()
          }
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tickMargin={40}
          unit={` ${energyUnitConverter.getTargetUnit()}`}
        />
        <ChartTooltip
          cursor={true}
          content={
            <ChartTooltipContent
              indicator="dot"
              itemFormatter={(value) =>
                `${value} ${energyUnitConverter.getTargetUnit()}`
              }
            />
          }
          labelFormatter={(value) => new Date(value).toLocaleString()}
        ></ChartTooltip>
        <ChartLegend content={<ChartLegendContent />} />
        {labels.map((label, index) => {
          const color = `var(--color-data${index + 1})`;
          return (
            <Line
              key={label}
              dataKey={`data${index + 1}`}
              type="linear"
              stroke={color}
              strokeWidth={2}
              isAnimationActive={false}
            >
              <LabelList
                className="hidden"
                position="top"
                fill={color}
                offset={10}
                formatter={(value: string | number) =>
                  `${value} ${energyUnitConverter.getTargetUnit()}`
                }
              >
              </LabelList>
            </Line>
          );
        })}
      </LineChart>
    </ChartContainer>
  );
}

function EnergyAreaChart({
  outputData,
  labels,
  colors,
}: {
  outputData: OutputAxisChartDataProps[];
  labels: string[];
  colors?: string[];
}) {
  return (
    <ChartContainer
      config={getChartConfig(labels, colors)}
      className="max-h-[45vh] w-full"
    >
      <AreaChart
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
          tickFormatter={(value) =>
            value === "" ? "" : new Date(value).toLocaleTimeString()
          }
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tickMargin={40}
          unit={` ${energyUnitConverter.getTargetUnit()}`}
        />
        <ChartTooltip
          cursor={true}
          content={
            <ChartTooltipContent
              indicator="dot"
              itemFormatter={(value) =>
                `${value} ${energyUnitConverter.getTargetUnit()}`
              }
            />
          }
          labelFormatter={(value) => new Date(value).toLocaleString()}
        ></ChartTooltip>
        {labels.map((label, index) => {
          const color = `var(--color-data${index + 1})`;
          return (
            <Area
              key={label}
              dataKey={`data${index + 1}`}
              type="linear"
              stroke={color}
              fill={color}
              strokeWidth={2}
              stackId={0}
              isAnimationActive={false}
            >
              <LabelList
                className="hidden"
                position="top"
                fill={color}
                offset={10}
                formatter={(value: string | number) =>
                  `${value} ${energyUnitConverter.getTargetUnit()}`
                }
              />
            </Area>
          );
        })}
        <ChartLegend content={<ChartLegendContent />} />
      </AreaChart>
    </ChartContainer>
  );
}
