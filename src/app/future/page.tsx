"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Line, LineChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { motion } from "motion/react";

function getPredictionData() {
  const predictionData = [];
  for (let i = 0; i < 30; i++) {
    predictionData.push({
      day: i,
      actual: Math.random() * 10,
      predicted: Math.random() * 10,
    });
  }
  return predictionData;
}

export default function Predictions() {
  const predictionData = getPredictionData();

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Energy Consumption Prediction</CardTitle>
          <CardDescription>ML-based prediction vs actual consumption</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              actual: {
                label: "Actual",
                color: "hsl(var(--chart-1))",
              },
              predicted: {
                label: "Predicted",
                color: "hsl(var(--chart-2))",
              },
            }}
            className="max-h-[70vh] w-full"
          >
            <LineChart data={predictionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line
                type="monotone"
                dataKey="actual"
                stroke="var(--color-actual)"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="predicted"
                stroke="var(--color-predicted)"
                strokeWidth={2}
                strokeDasharray="5 5"
              />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </motion.div>
  )
}

