import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { energyUnit } from "@/constants/routing";

export default function EnergyCard({
  title,
  subtitle,
  delta,
  icon,
}: {
  title: string;
  subtitle: string;
  delta?: number;
  icon: React.ReactNode;
}) {
  return (
    <Card className="flex flex-row items-center col-span-2">
      <div>
        <CardHeader className="flex flex-row space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{subtitle}</div>
          {delta === undefined ? null : (
            <p className="text-xs text-muted-foreground">
              {delta >= 0 ? "+" : ""}
              {delta}
              {energyUnit} from last hour
            </p>
          )}
        </CardContent>
      </div>
      <div className="flex-1" />
      <div className="h-16 w-16 mr-4">{icon}</div>
    </Card>
  );
}
