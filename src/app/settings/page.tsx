"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"

export default function AgentSystem() {
	return (
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
					<Switch className="mr-6" />
				</Card>
				<CardHeader className="pl-0 mt-2">
					<CardTitle>Appearance</CardTitle>
				</CardHeader>
				<Card className="flex flex-row place-content-between place-items-center">
					<CardHeader>
						<CardTitle className="text-xl">Dark mode</CardTitle>
					</CardHeader>
					<Switch className="mr-6" />
				</Card>
			</CardContent>
		</Card>
	)
}

