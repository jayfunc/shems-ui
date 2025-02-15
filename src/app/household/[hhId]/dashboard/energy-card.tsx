import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import React from "react";

export default function EnergyCard({
  title,
  subtitle,
  desc,
  icon,
  actionArea,
  status,
}: {
  title: string;
  subtitle: string;
  desc?: string | React.ReactNode;
  icon: React.ReactNode;
  actionArea?: React.ReactNode;
  status?: React.ReactNode;
}) {
  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle className="flex flex-row items-center">
          <div className="mr-4">{icon}</div>
          {title}
          <div className="flex-1" />
          {status}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-row items-end">
        <div className="flex flex-col">
          <div className="text-2xl font-bold">{subtitle}</div>
          <div className="text-sm text-muted-foreground">
            {desc}
          </div>
        </div>
        <div className="flex-1" />
        {actionArea}
      </CardContent>
    </Card>
  );
}
