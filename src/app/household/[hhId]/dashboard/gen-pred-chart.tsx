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
import HseGenPred from "@/models/hse-gen-pred";
import { CartesianGrid, XAxis, Line, LabelList, LineChart } from "recharts";

export default function GenPredChart({
  hseGenPred,
}: {
  hseGenPred: HseGenPred[];
}) {
  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle>Solar energy output forcast</CardTitle>
        <CardDescription>12-hour energy output forcast level</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            solar: {
              label: "Generation Prediction",
              color: "hsl(var(--chart-5))",
            },
          }}
          className="max-h-[30vh] w-full"
        >
          <LineChart
            accessibilityLayer
            data={hseGenPred}
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
              dataKey="solar"
              type="natural"
              stroke="var(--color-solar)"
              strokeWidth={2}
              dot={{
                fill: "var(--color-solar)",
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
