import { Label, Pie, PieChart } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
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
  cfgKeys,
  cfgLabels,
  data,
  dataKey,
  dataValues,
  centerSubtitle = "",
  itemFormatter,
}: {
  lightPieChartBaseColor?: string;
  darkPieChartBaseColor?: string;
  colorStart?: number;
  colorEnd?: number;
  cfgKeys: string[];
  cfgLabels: string[];
  data?: unknown[];
  dataKey: string;
  dataValues?: number[];
  centerSubtitle?: string;
  itemFormatter: (value: string) => string;
}) {
  const chartConfig: ChartConfig = {};

  let colorStep: number =
    (colorEnd - colorStart) / Math.max(1, cfgKeys.length - 1);
  colorStep = Math.floor(colorStep / 100) * 100;

  cfgKeys.forEach((key, index) => {
    const colorDepth = `${colorStart + colorStep * index}`;
    const lightColor = `hsl(var(--${lightPieChartBaseColor}-${colorDepth}))`;
    const darkColor = `hsl(var(--${darkPieChartBaseColor}-${colorDepth}))`;

    chartConfig[key] = {
      label: cfgLabels[index],
      theme: { light: lightColor, dark: darkColor },
    };
  });

  const showCenterArea = centerSubtitle !== "";

  return (
    <ChartContainer
      config={chartConfig}
      className="mx-auto max-h-[250px] [&_.recharts-pie-label-text]:fill-foreground"
    >
      <PieChart>
        <ChartTooltip
          content={
            <ChartTooltipContent hideLabel itemFormatter={itemFormatter} />
          }
        />
        <Pie
          data={
            data === undefined && dataValues !== undefined
              ? cfgKeys.map((key, index) => {
                  return {
                    section: cfgLabels[index],
                    [dataKey]: dataValues[index],
                    fill: `var(--color-${key})`,
                  };
                })
              : data
          }
          dataKey={dataKey}
          nameKey="section"
          innerRadius={showCenterArea ? 60 : 0}
          strokeWidth={3}
          strokeLinecap="round"
          strokeDasharray={5}
          label={({ payload, ...props }) => {
            return (
              <text
                cx={props.cx}
                cy={props.cy}
                x={props.x}
                y={props.y}
                textAnchor={props.textAnchor}
                dominantBaseline={props.dominantBaseline}
                fill={payload.fill}
                fontWeight="bold"
              >
                &nbsp;{payload.section}&nbsp;
              </text>
            );
          }}
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
      </PieChart>
    </ChartContainer>
  );
}
