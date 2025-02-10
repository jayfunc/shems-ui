"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toTitleCase, insertSpaces } from "@/extensions/string";
import Appl, { AppliancePriority, ApplianceType } from "@/models/appl";
import ApiService from "@/services/api";
import { useState, useEffect } from "react";

export default function Detail({ applId }: { applId: number }) {
  const [appl, setAppl] = useState<Appl>();

  useEffect(() => {
    ApiService.getAppl(applId).then((res) => {
      setAppl(res.data);
    });
  }, []);

  return appl ? (
    <Card className="lg:col-span-full">
      <div className="flex flex-row place-items-center ">
        <CardHeader>
          <CardTitle>
            {appl.name}
            <Badge variant="outline" className="ml-2">
              {toTitleCase(insertSpaces(ApplianceType[appl.applianceType]))}
            </Badge>
            <Badge variant="outline" className="ml-2">
              {toTitleCase(insertSpaces(AppliancePriority[appl.priority]))}
            </Badge>
          </CardTitle>
        </CardHeader>
      </div>
    </Card>
  ) : null;
}
