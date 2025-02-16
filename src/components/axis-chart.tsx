/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "@/components/chart-patched";
import { chartMaxPoints } from "@/constants/constants";
import { Area, AreaChart, CartesianGrid, LabelList, Line, LineChart, XAxis } from "recharts";
import React from "react";
import { Unlink } from "lucide-react";
import { Label } from "./ui/label";
import energyUnitConverter from "../extensions/energy-unit-converter";

export enum AxisChartType {
  Line,
  Area,
  Bar,
}

export interface InputAxisChartDataProps { dateTime?: Date, data?: number };
interface OutputAxisChartDataProps { dateTime?: Date, [key: string]: any };

function combineDates(...dataArrays: InputAxisChartDataProps[][]): OutputAxisChartDataProps[] {
  let data: OutputAxisChartDataProps[] = [];
  const allDates = new Set(
    dataArrays.flatMap(dataArray => dataArray.map(val => val.dateTime))
      .toSorted()
      .reverse()
  );

  allDates.forEach((dateTime) => {
    const combinedData: OutputAxisChartDataProps = { dateTime: dateTime, data1: undefined, data2: undefined };
    dataArrays.forEach((dataArray, index) => {
      combinedData[`data${index + 1}`] = energyUnitConverter.format(
        dataArray.find((element) => element.dateTime === dateTime)?.data
      );
    });
    data.push(combinedData);
  });

  data = data.slice(0, chartMaxPoints).reverse();
  return data;
}

function handleSingleData(data?: InputAxisChartDataProps[]) {
  return data?.map((element) => {
    return {
      dateTime: element.dateTime,
      data1: element.data,
    } satisfies OutputAxisChartDataProps;
  }) ?? [];
}

function getChartConfig(labels: string[], colors?: number[]): ChartConfig {
  return labels.reduce((acc, label, index) => {
    acc[`data${index + 1}`] = {
      label: `${label}`,
      color: `hsl(var(--chart-${colors?.at(index) ?? index + 1}))`,
    };
    return acc;
  }, {} as ChartConfig);
}

export function convertToOutputData(data: InputAxisChartDataProps[][]): OutputAxisChartDataProps[] {
  let outputData: OutputAxisChartDataProps[] = [];
  if (data.length === 1) {
    outputData = handleSingleData(data[0]);
  } else {
    outputData = combineDates(...data);
  }

  // outputData 如果不满 chartMaxPoints 长度则在前端补全
  const count = chartMaxPoints - outputData.length;
  if (count > 0) {
    outputData = [...Array(count).fill({}), ...outputData];
  }

  // Make sure outputData has at most chartMaxPoints
  outputData = outputData.slice(-chartMaxPoints);

  return outputData;

}

export function AxisChart({
  data, chartType, labels, colors
}: {
  data: InputAxisChartDataProps[][],
  chartType: AxisChartType,
  labels: string[],
  colors?: number[]
}) {
  const outputData = convertToOutputData(data);
  const isDataEmpty = outputData.every((element) => element.data1 == null && element.data2 == null);

  return (
    <div className="relative">
      {chartType === AxisChartType.Line && <EnergyLineChart outputData={outputData} labels={labels} colors={colors} />}
      {chartType === AxisChartType.Area && <EnergyAreaChart outputData={outputData} labels={labels} />}
      {isDataEmpty &&
        <div className="flex flex-col gap-2 items-center justify-center w-full h-full text-muted-foreground absolute top-0">
          <Unlink />
          <Label className="text-center">No data available</Label>
        </div>}
    </div>
  );
}

function EnergyLineChart({ outputData, labels, colors }: {
  outputData: OutputAxisChartDataProps[], labels: string[], colors?: number[]
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
        <ChartLegend content={<ChartLegendContent />} />
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
      </LineChart>
    </ChartContainer>
  );
}

function EnergyAreaChart({ outputData, labels, colors }: {
  outputData: OutputAxisChartDataProps[], labels: string[], colors?: number[]
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
            <Area
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
            </Area>
          );
        })}
        <ChartLegend content={<ChartLegendContent />} />
      </AreaChart>
    </ChartContainer>
  );
}