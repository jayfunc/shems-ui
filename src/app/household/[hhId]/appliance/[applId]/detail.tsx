"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { autoRefreshInterval } from "@/constants/constants";
import formatText from "@/extensions/string";
import Appl, { AppliancePriority, ApplianceStatus, ApplianceType } from "@/models/appl";
import ApiService from "@/services/api";
import { useState, useEffect } from "react";

export default function Detail({ applId }: { applId: number }) {
  const [appl, setAppl] = useState<Appl>();

  useEffect(() => {
    const fetchData = async () => {
      ApiService.getAppl(applId).then((res) => {
        setAppl(res.data);
      });
    };

    fetchData();

    const interval = setInterval(async () => {
      await fetchData();
    }, autoRefreshInterval);

    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="lg:col-span-full">
      <CardHeader>
        <CardTitle className="flex flex-row items-center">
          {formatText(appl?.name ?? '-')}
          <Badge variant="outline" className="ml-2">
            {formatText(appl === undefined ? '-' : ApplianceType[appl.applianceType])}
          </Badge>
          <Badge variant="outline" className="ml-2">
            {formatText(appl === undefined ? '-' : AppliancePriority[appl.priority])}
          </Badge>
          <div className="flex-1" />
          <Badge variant={appl?.status === ApplianceStatus.On ? 'default' : 'outline'}>
            {formatText(appl === undefined ? '-' : ApplianceStatus[appl.status])}
          </Badge>
        </CardTitle>
      </CardHeader>
    </Card>
  );
}
