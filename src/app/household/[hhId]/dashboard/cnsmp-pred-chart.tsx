import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import HseCnsmpPred from "@/models/hse-cnsmp-pred";
import { CartesianGrid, LabelList, Line, LineChart, XAxis } from "recharts";

export default function CnsmpPredChart({
  hseCnsmpPred,
}: {
  hseCnsmpPred: HseCnsmpPred[];
}) {
  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle>House energy consumption forcast</CardTitle>
        <CardDescription>
          12-hour energy consumption forcast level
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            dishwasher: {
              label: "Consumption Prediction",
              color: "hsl(var(--chart-2))",
            },
          }}
          className="max-h-[30vh] w-full"
        >
          <LineChart
            accessibilityLayer
            data={hseCnsmpPred}
            margin={{
              top: 20,
              left: 40,
              right: 40,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="predictTime"
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
              dataKey="dishwasher"
              type="natural"
              stroke="var(--color-dishwasher)"
              strokeWidth={2}
              dot={{
                fill: "var(--color-dishwasher)",
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
