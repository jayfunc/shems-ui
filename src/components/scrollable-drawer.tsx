import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import React from "react";
import { ScrollArea } from "./ui/scroll-area";
import { Button } from "./ui/button";

export default function CenterDrawer({
  trigger,
  title,
  desc,
  content,
  stretchToWidth = false,
}: {
  trigger?: React.ReactNode;
  title: string;
  desc?: string;
  content: React.ReactNode;
  stretchToWidth?: boolean;
}) {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        {trigger ?? <Button variant="outline">More</Button>}
      </DrawerTrigger>
      <DrawerContent className={stretchToWidth ? "" : "left-1/3 right-1/3"}>
        <DrawerHeader>
          <DrawerTitle>{title}</DrawerTitle>
          <DrawerDescription>{desc}</DrawerDescription>
        </DrawerHeader>
        <ScrollArea>{content}</ScrollArea>
      </DrawerContent>
    </Drawer>
  );
}
