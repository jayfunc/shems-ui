import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import React from "react";
import { ScrollArea } from "./ui/scroll-area";
import { Button } from "./ui/button";

export default function CenterDrawer({
	trigger,
	title,
	desc,
	content,
}: {
	trigger?: React.ReactNode;
	title: string;
	desc?: string;
	content: React.ReactNode;
}) {
	return (
		<Drawer>
			<DrawerTrigger>
				{trigger ??
					<Button variant="outline">
						More
					</Button>}
			</DrawerTrigger>
			<DrawerContent className="left-1/3 right-1/3">
				<DrawerHeader>
					<DrawerTitle>{title}</DrawerTitle>
					<DrawerDescription>
						{desc}
					</DrawerDescription>
				</DrawerHeader>
				<ScrollArea>
					{content}
				</ScrollArea>
				<DrawerFooter>
					<DrawerClose>
						<Button className="w-full" variant="secondary">Close</Button>
					</DrawerClose>
				</DrawerFooter>
			</DrawerContent>
		</Drawer>
	);
}