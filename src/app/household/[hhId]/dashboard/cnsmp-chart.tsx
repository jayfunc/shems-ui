import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import HseCnsmp from "@/models/hse-cnsmp";
import { CartesianGrid, XAxis, Line, LabelList, LineChart } from "recharts";

export default function CnsmpChart({ hseCnsmps }: { hseCnsmps: HseCnsmp[] }) {
  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle>House energy consumption</CardTitle>
        <CardDescription>12-hour energy consumption level</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            totalConsumeAmount: {
              label: "Consumption",
              color: "hsl(var(--chart-1))",
            },
          }}
          className="max-h-[30vh] w-full"
        >
          <LineChart
            accessibilityLayer
            data={hseCnsmps}
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
              dataKey="totalConsumeAmount"
              type="natural"
              stroke="var(--color-totalConsumeAmount)"
              strokeWidth={2}
              dot={{
                fill: "var(--color-totalConsumeAmount)",
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
            <ChartLegend content={<ChartLegendContent />} />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
