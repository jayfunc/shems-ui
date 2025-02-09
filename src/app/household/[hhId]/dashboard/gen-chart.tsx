import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import HseGen from "@/models/hse-gen";
import { CartesianGrid, XAxis, Line, LabelList, LineChart } from "recharts";

export default function GenChart({ hseGen }: { hseGen: HseGen[] }) {
  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle>Solar energy output</CardTitle>
        <CardDescription>12-hour energy output level</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={
            {
              powerAmount: {
                label: "Generation",
                color: "hsl(var(--chart-4))",
              }
            }
          }
          className="max-h-[30vh] w-full">
          <LineChart accessibilityLayer
            data={hseGen}
            margin={{
              top: 20,
              left: 40,
              right: 40,
            }}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="generateTime"
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
              dataKey="powerAmount"
              type="natural"
              stroke="var(--color-powerAmount)"
              strokeWidth={2}
              dot={{
                fill: "var(--color-powerAmount)",
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