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
import moneyUnitConverter from "@/extensions/money-unit-converter";

const xAxisTickMargin = 10;
const yAxisTickMargin = 20;

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
      combinedData[`secondary${index + 1}`] =
        dataArray.find((element) => element.primary === primary)?.secondary;
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

export enum PrimaryType {
  None,
  Time,
}

export enum SecondaryType {
  None,
  Energy,
  Money,
  Percentage,
  PerMille,
}

export function AxisChart({
  data,
  chartType,
  labels,
  colors,
  isLoading,
  primaryType = PrimaryType.None,
  secondaryType = SecondaryType.None,
}: {
  data?: InputAxisChartDataProps[][];
  chartType: AxisChartType;
  labels: string[];
  colors?: string[];
  isLoading?: boolean;
  primaryType?: PrimaryType;
  secondaryType?: SecondaryType;
}) {
  const outputData = convertToOutputData(...(data ?? []));
  const isDataEmpty =
    isLoading !== true &&
    outputData.every(
      (element) => element.secondary1 == null && element.secondary2 == null,
    );

  const primaryFormatter = (value: string) => {
    switch (primaryType) {
      case PrimaryType.Time:
        return Formatter.timeFormatter(value);
      case PrimaryType.None:
      default:
        return value;
    }
  };

  const secondaryFormatter = (value: string) => {
    switch (secondaryType) {
      case SecondaryType.Energy:
        return energyUnitConverter.formatInStringWithUnit(Number(value));
      case SecondaryType.Money:
        return moneyUnitConverter.formatInStringWithUnit(Number(value));
      case SecondaryType.PerMille:
        return `${value} ‰`;
      case SecondaryType.Percentage:
        return `${value} %`;
      case SecondaryType.None:
      default:
        return value;
    }
  };

  return (
    <div className="relative">
      {chartType === AxisChartType.Line && (
        <BestLineChart
          outputData={outputData}
          labels={labels}
          colors={colors}
          primaryFormatter={primaryFormatter} secondaryFormatter={secondaryFormatter}
        />
      )}
      {chartType === AxisChartType.Area && (
        <BestAreaChart outputData={outputData} labels={labels} colors={colors}
          primaryFormatter={primaryFormatter} secondaryFormatter={secondaryFormatter} />
      )}
      {chartType === AxisChartType.Bar && (
        <BestBarChart outputData={outputData} labels={labels} colors={colors}
          primaryFormatter={primaryFormatter} secondaryFormatter={secondaryFormatter} />
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

function BestLineChart({
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
          tickMargin={xAxisTickMargin}
          axisLine={false}
          tickFormatter={(value) => primaryFormatter(value)}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tickMargin={yAxisTickMargin}
          tickFormatter={(value) => secondaryFormatter(value)}
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
                formatter={(value: string | number) => secondaryFormatter(`${value}`)}
              >
              </LabelList>
            </Line>
          );
        })}
      </LineChart>
    </ChartContainer>
  );
}

function BestAreaChart({
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
          tickMargin={xAxisTickMargin}
          axisLine={false}
          tickFormatter={(value) => primaryFormatter(value)}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tickMargin={yAxisTickMargin}
          tickFormatter={(value) => secondaryFormatter(value)}
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
                formatter={(value: string | number) => secondaryFormatter(`${value}`)}
              />
            </Area>
          );
        })}
        <ChartLegend content={<ChartLegendContent />} />
      </AreaChart>
    </ChartContainer>
  );
}

function BestBarChart({
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
          tickMargin={yAxisTickMargin}
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
