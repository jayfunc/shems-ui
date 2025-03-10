import React from "react";
import {
  Card,
  CardHeader,
  CardDescription,
  CardContent,
  CardTitle,
} from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

export default function CardTabs({
  titles,
  descs,
  defaultTabKeyIndex = 0,
  tabLabels,
  tabContents,
  className,
}: {
  titles: string[] | string | React.ReactNode[] | React.ReactNode;
  descs?: string[] | string | React.ReactNode[] | React.ReactNode;
  defaultTabKeyIndex?: number;
  tabLabels: string[];
  tabContents: React.ReactNode[];
  className?: string;
}) {
  const tabKeys = tabLabels.map((value, index) => `${index}`);
  return (
    <Tabs defaultValue={tabKeys[defaultTabKeyIndex]} className={className ?? `col-span-full`}>
      <Card>
        <CardHeader>
          <CardTitle className="flex flex-row">
            {tabKeys.map((key, index) => (
              <TabsContent
                key={key}
                value={key}
                className="flex flex-col gap-2"
              >
                {Array.isArray(titles) ? titles[index] : titles}
                <CardDescription className="font-normal">
                  {Array.isArray(descs) ? descs[index] : descs}
                </CardDescription>
              </TabsContent>
            ))}
            <div className="flex-1 mr-2" />
            <TabsList className="flex flex-col h-full md:flex-row">
              {tabKeys.map((key, index) => (
                <TabsTrigger key={key} value={key} className="w-full text-wrap md:text-nowrap">
                  {tabLabels[index]}
                </TabsTrigger>
              ))}
            </TabsList>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {tabKeys.map((key, index) => (
            <TabsContent key={key} value={key}>
              {tabContents[index]}
            </TabsContent>
          ))}
        </CardContent>
      </Card>
    </Tabs>
  );
}
