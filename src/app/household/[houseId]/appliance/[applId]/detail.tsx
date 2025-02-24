"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import formatText from "@/extensions/string";
import Appl, {
  AppliancePriority,
  ApplianceStatus,
  ApplianceType,
} from "@/models/appl";
import ApiService from "@/services/api";
import useSWR from "swr";

export default function Detail({ applId }: { applId: number }) {
  const { data } = useSWR<Appl>(ApiService.buildGetApplUri(applId));

  return (
    <Card className="lg:col-span-full">
      <CardHeader>
        <CardTitle className="flex flex-row items-center">
          {formatText(data?.name ?? "-")}
          <Badge variant="outline" className="ml-2">
            {formatText(
              data === undefined ? "-" : ApplianceType[data.applianceType],
            )}
          </Badge>
          <Badge variant="outline" className="ml-2">
            {formatText(
              data === undefined ? "-" : AppliancePriority[data.priority],
            )}
          </Badge>
          <div className="flex-1" />
          <Badge
            variant={
              data?.status === ApplianceStatus.On ? "default" : "outline"
            }
          >
            {formatText(
              data === undefined ? "-" : ApplianceStatus[data.status],
            )}
          </Badge>
        </CardTitle>
      </CardHeader>
    </Card>
  );
}
