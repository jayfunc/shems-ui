"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import ApiService from "@/services/api";
import { motion } from "motion/react";

export default function Page() {
	const toast = useToast();

	function sendNormalSignal() {
		ApiService.postMainGridCfgNormalSignal().then((res) => {
			if (res.data) {
				toast.toast({
					title: "Success",
					description: "Normal signal sent",
				})
			} else {
				toast.toast({
					variant: "destructive",
					title: "Error",
					description: "Failed to send normal signal",
				})
			}
		});
	}

	function sendPeakShaveSignal() {
		ApiService.postMainGridCfgPeakShaveSignal().then((res) => {
			if (res.data) {
				toast.toast({
					title: "Success",
					description: "Peak shave signal sent",
				})
			} else {
				toast.toast({
					variant: "destructive",
					title: "Error",
					description: "Failed to send peak shave signal",
				})
			}
		});
	}

	return (
		<motion.div className="grid grid-cols-4 gap-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>

			<Card className="col-span-2">
				<CardHeader>
					<CardTitle>
						Main grid
					</CardTitle>
					<CardDescription>
						Control the main grid
					</CardDescription>
				</CardHeader>
				<CardContent className="flex flex-row gap-2">
					<Button onClick={sendNormalSignal}>
						Send normal signal
					</Button>
					<Button variant="destructive" onClick={sendPeakShaveSignal}>
						Send peak shave signal
					</Button>
				</CardContent>
			</Card>
		</motion.div >
	);
}