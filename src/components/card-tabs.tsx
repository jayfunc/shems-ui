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
  tabKeys,
  defaultTabKeyIndex = 0,
  tabLabels,
  tabContents,
}: {
  titles: string[] | string;
  descs?: string[] | string;
  tabKeys: string[];
  defaultTabKeyIndex?: number;
  tabLabels: string[];
  tabContents: React.ReactNode[];
}) {
  return (
    <Tabs defaultValue={tabKeys[defaultTabKeyIndex]} className="col-span-full">
      <Card>
        <CardHeader>
          <CardTitle className="flex flex-row">
            {tabKeys.map((key, index) => (
              <TabsContent
                key={key}
                value={key}
                className="flex flex-col gap-2"
              >
                {typeof titles === "string" ? titles : titles[index]}
                <CardDescription className="font-normal">
                  {typeof descs === "string" ? descs : descs?.at(index)}
                </CardDescription>
              </TabsContent>
            ))}
            <div className="flex-1" />
            <TabsList className="flex flex-col h-27 md:flex-row md:h-full">
              {tabKeys.map((key, index) => (
                <TabsTrigger key={key} value={key}>
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
