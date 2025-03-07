import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Unlink } from "lucide-react";
import React from "react";

export default function EnergyCard({
  title,
  subtitle,
  desc,
  icon,
  actionArea,
  status,
  disabled = false,
  disabledHint,
}: {
  title: string;
  subtitle: string;
  desc?: string | React.ReactNode;
  icon: React.ReactNode;
  actionArea?: React.ReactNode;
  status?: React.ReactNode;
  disabled?: boolean;
  disabledHint?: string;
}) {
  return (
    <Card className="col-span-full md:col-span-2">
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
          <div className="text-2xl font-bold">{disabled ? disabledHint : subtitle}</div>
          <div className="text-sm text-muted-foreground">{!disabled && desc}</div>
        </div>
        <div className="flex-1" />
        {!disabled && actionArea}
      </CardContent>
    </Card>
  );
}
