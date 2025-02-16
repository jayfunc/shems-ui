import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
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
	stretchToWidth: boolean;
}) {
	return (
		<Drawer>
			<DrawerTrigger>
				{trigger ??
					<Button variant="outline">
						More
					</Button>}
			</DrawerTrigger>
			<DrawerContent className={stretchToWidth === true ? '' : 'left-1/3 right-1/3'}>
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