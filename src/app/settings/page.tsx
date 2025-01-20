"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch";
import { motion } from "framer-motion";
import React from "react";
import SettingsService from "../services/settings";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

export default function AgentSystem() {
	const [isDarkMode, setDarkMode] = React.useState(SettingsService.getDarkMode());
	const [isNotif, setNotif] = React.useState(SettingsService.getNotif());

	function toggleDarkMode() {
		const curVal: boolean = !isDarkMode;
		SettingsService.setDarkMode(curVal);
		setDarkMode(curVal);
	}

	function toggleNotif() {
		const curVal: boolean = !isNotif;
		SettingsService.setNotif(curVal);
		setNotif(curVal);
	}

	function sendNotif() {
		toast({
			title: "I'm a notification",
			description: "It's working!\nIt's " + new Date().toLocaleDateString() + " today.",
		});
	}

	return (
		<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col gap-4">
			<Card className="grid gap-4">
				<CardContent>
					<CardHeader className="pl-0 mt-2">
						<CardTitle>Behaviors</CardTitle>
					</CardHeader>
					<Card className="flex flex-row place-content-between place-items-center">
						<CardHeader>
							<CardTitle className="text-xl">Notification</CardTitle>
							<CardDescription>Alerts and notifications</CardDescription>
						</CardHeader>
						<Switch className="mr-6" onCheckedChange={toggleNotif} checked={isNotif} />
					</Card>
					<CardHeader className="pl-0 mt-2">
						<CardTitle>Appearance</CardTitle>
					</CardHeader>
					<Card className="flex flex-row place-content-between place-items-center">
						<CardHeader>
							<CardTitle className="text-xl">Dark mode</CardTitle>
						</CardHeader>
						<Switch className="mr-6" onCheckedChange={toggleDarkMode} checked={isDarkMode} />
					</Card>
				</CardContent>
			</Card>
			<Card className="grid gap-4">
				<CardHeader>
					<CardTitle>Test</CardTitle>
					<CardDescription>[Only for development]</CardDescription>
				</CardHeader>
				<CardContent className="flex flex-row gap-4">
					<Button onClick={sendNotif}>Send notification</Button>
					<Button disabled>Other experimental feature</Button>
				</CardContent>
			</Card>
			<Card className="grid gap-4">
				<CardHeader>
					<CardTitle>About</CardTitle>
					<CardDescription>About this project</CardDescription>
				</CardHeader>
				<CardContent>
					A project for the course "Agile Software Development" at Lakehead University.
				</CardContent>
			</Card>
		</motion.div>
	)
}

