"use client";

import { CartesianGrid, LabelList, Line, LineChart, XAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import ApiService from "@/services/api";
import ApplCnsmp from "@/models/appl-cnsmp";
import { useEffect, useState } from "react";
import { autoRefreshInterval } from "@/constants/routing";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

export function CnsmpsChart({ applId }: { applId: number }) {
  const [data, setData] = useState<ApplCnsmp[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      ApiService.getApplCnsmp(applId).then((ret) => {
        data.push(ret.data);
        if (data.length >= 12) {
          data.shift();
        }
        setData([...data]);
      });
    };

    fetchData();

    const interval = setInterval(() => {
      fetchData();
    }, autoRefreshInterval);

    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="lg:col-span-full">
      <CardHeader>
        <CardTitle>Energy consumption</CardTitle>
        <CardDescription>Energy consumption by hours</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            consumeAmount: {
              label: "Consumption",
              color: "hsl(var(--chart-1))",
            },
          }}
          className="max-h-[30vh] w-full"
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
              dataKey="consumeTime"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => new Date(value).toLocaleTimeString()}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Line
              dataKey="consumeAmount"
              type="natural"
              stroke="var(--color-consumeAmount)"
              strokeWidth={2}
              dot={{
                fill: "var(--color-consumeAmount)",
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
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
