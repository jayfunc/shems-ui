import { Label, Pie, PieChart } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegendContent,
} from "./chart-patched";

/**
 * @param dataValues Data only, if you want to override the input data for Pie, please use data instead
 * @param data The input data for Pie
 */
export default function EnergyPieChart({
  lightPieChartBaseColor = "sky",
  darkPieChartBaseColor = "teal",
  colorStart = 400,
  colorEnd = 900,
  colors,
  cfgLabels,
  data,
  dataValues,
  centerSubtitle = "",
  itemFormatter,
}: {
  lightPieChartBaseColor?: string;
  darkPieChartBaseColor?: string;
  colorStart?: number;
  colorEnd?: number;
  colors?: string[];
  cfgLabels: string[];
  data?: unknown[];
  dataValues?: number[];
  centerSubtitle?: string;
  itemFormatter: (value: string) => string;
}) {
  const chartConfig: ChartConfig = {};

  if (colors === undefined) {
    let colorStep: number =
      (colorEnd - colorStart) / Math.max(1, cfgLabels.length - 1);
    colorStep = Math.floor(colorStep / 100) * 100;

    cfgLabels.forEach((key, index) => {
      const colorDepth = `${colorStart + colorStep * index}`;
      const lightColor = `hsl(var(--${lightPieChartBaseColor}-${colorDepth}))`;
      const darkColor = `hsl(var(--${darkPieChartBaseColor}-${colorDepth}))`;

      chartConfig[key] = {
        label: key,
        theme: { light: lightColor, dark: darkColor },
      };
    });
  } else {
    cfgLabels.forEach((key, index) => {
      chartConfig[key] = {
        label: key,
        color: `hsl(var(${colors[index]}))`,
      };
    });
  }

  const showCenterArea = centerSubtitle !== "";

  return (
    <ChartContainer
      config={chartConfig}
      className="mx-auto -mt-8 h-[25vh] [&_.recharts-pie-label-text]:fill-foreground"
    >
      <PieChart>
        <ChartTooltip
          content={
            <ChartTooltipContent hideLabel itemFormatter={itemFormatter} />
          }
        />
        <Pie
          isAnimationActive={false}
          data={
            data === undefined && dataValues !== undefined
              ? cfgLabels.map((key, index) => {
                return {
                  nameKey: cfgLabels[index],
                  dataKey: dataValues[index],
                  fill: `var(--color-${key})`,
                };
              })
              : data
          }
          dataKey="dataKey"
          nameKey="nameKey"
          innerRadius={showCenterArea ? 60 : 0}
          labelLine={false}
          activeIndex={0}
          label={({ payload, ...props }) => {
            return (
              <></> || <text
                cx={props.cx}
                cy={props.cy}
                x={props.x}
                y={props.y}
                textAnchor={props.textAnchor}
                fill={payload.fill}
                fontWeight="bold"
              >
                {payload.nameKey}
              </text>
            );
          }}
          blendStroke
        >
          {showCenterArea && (
            <Label
              content={({ viewBox }) => {
                if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                  return (
                    <text
                      x={viewBox.cx}
                      y={viewBox.cy}
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      <tspan
                        x={viewBox.cx}
                        y={viewBox.cy}
                        className="fill-foreground text-3xl font-bold"
                      >
                        {dataValues?.reduce((acc, cur) => acc + cur, 0)}
                      </tspan>
                      <tspan
                        x={viewBox.cx}
                        y={(viewBox.cy || 0) + 24}
                        className="fill-muted-foreground"
                      >
                        {centerSubtitle}
                      </tspan>
                    </text>
                  );
                }
              }}
            />
          )}
        </Pie>
        <ChartLegend
          content={<ChartLegendContent nameKey="nameKey" />}
        />
      </PieChart>
    </ChartContainer>
  );
}
