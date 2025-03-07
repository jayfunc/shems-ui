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
  Bar,
  BarChart,
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
import Formatter from "@/extensions/formatter";

export enum AxisChartType {
  Line,
  Area,
  Bar,
}

export interface InputAxisChartDataProps {
  primary?: any;
  secondary?: number;
}
interface OutputAxisChartDataProps {
  primary?: any;
  [key: string]: any;
}

function convertToOutputData(
  ...dataArrays: InputAxisChartDataProps[][]
): OutputAxisChartDataProps[] {
  const data: OutputAxisChartDataProps[] = [];
  const primaryData = new Set(
    dataArrays
      .flatMap((dataArray) => dataArray.map((val) => val.primary))
      .toSorted(),
  );

  primaryData.forEach((primary) => {
    const combinedData: OutputAxisChartDataProps = {
      primary: primary,
      secondary1: undefined,
      secondary2: undefined,
    };
    dataArrays.forEach((dataArray, index) => {
      combinedData[`secondary${index + 1}`] = energyUnitConverter.format(
        dataArray.find((element) => element.primary === primary)?.secondary,
      );
    });
    data.push(combinedData);
  });

  return data;
}

function getChartConfig(labels: string[], colors?: string[]): ChartConfig {
  return labels.reduce((acc, label, index) => {
    acc[`secondary${index + 1}`] = {
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
  secondaryFormatter,
}: {
  data?: InputAxisChartDataProps[][];
  chartType: AxisChartType;
  labels: string[];
  colors?: string[];
  isLoading?: boolean;
  secondaryFormatter?: (value: string) => string;
}) {
  const outputData = convertToOutputData(...(data ?? []));
  const isDataEmpty =
    isLoading !== true &&
    outputData.every(
      (element) => element.secondary1 == null && element.secondary2 == null,
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
      {chartType === AxisChartType.Bar && (
        <EnergyBarChart outputData={outputData} labels={labels} colors={colors} secondaryFormatter={secondaryFormatter} />
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
      className="max-h-[35vh] w-full"
    >
      <LineChart
        accessibilityLayer
        data={outputData}
        margin={{
          top: 20,
          left: 20,
          right: 20,
        }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="primary"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => Formatter.timeFormatter(value)}
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
          const color = `var(--color-secondary${index + 1})`;
          return (
            <Line
              key={label}
              dataKey={`secondary${index + 1}`}
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
      className="max-h-[35vh] w-full"
    >
      <AreaChart
        accessibilityLayer
        data={outputData}
        margin={{
          top: 20,
          left: 20,
          right: 20,
        }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="primary"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => Formatter.timeFormatter(value)}
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
          const color = `var(--color-secondary${index + 1})`;
          return (
            <Area
              key={label}
              dataKey={`secondary${index + 1}`}
              type="step"
              stroke={color}
              fill={color}
              strokeWidth={2}
              stackId={index}
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

function EnergyBarChart({
  outputData,
  labels,
  colors,
  primaryFormatter = (value) => value,
  secondaryFormatter = (value) => value,
}: {
  outputData: OutputAxisChartDataProps[];
  labels: string[];
  colors?: string[];
  primaryFormatter?: (value: string) => string;
  secondaryFormatter?: (value: string) => string;
}) {
  return (
    <ChartContainer config={getChartConfig(labels, colors)} className="max-h-[35vh] w-full">
      <BarChart accessibilityLayer data={outputData}
        margin={{
          top: 20,
          left: 20,
          right: 20,
        }}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="primary"
          tickLine={false}
          tickMargin={30}
          angle={-35}
          axisLine={false}
          height={80}
          tickFormatter={(value) => primaryFormatter(value)}
          tick={{ width: 120 }}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tickMargin={40}
          tickFormatter={(value) => secondaryFormatter(value)}
          unit={` `}
        />
        <ChartTooltip
          cursor={true}
          content={
            <ChartTooltipContent
              indicator="dot"
              itemFormatter={(value) => secondaryFormatter(value)}
            />
          }
          labelFormatter={(value) => primaryFormatter(value)}
        ></ChartTooltip>
        {labels.map((label, index) => {
          const color = `var(--color-secondary${index + 1})`;
          return (
            <Bar key={index} dataKey={`secondary${index + 1}`} fill={color} radius={4} barSize={40} >
            </Bar>
          );
        })}
        <ChartLegend content={<ChartLegendContent />} />
      </BarChart>
    </ChartContainer>
  );
}
