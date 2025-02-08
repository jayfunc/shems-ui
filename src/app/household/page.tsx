"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { routing } from "@/constants/routing";
import Hse from "@/models/hse";
import ApiService from "@/services/api";
import { ChevronDown } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page() {

	const [hses, setHses] = useState<Hse[]>([]);
	const [hse, setHse] = useState<Hse>();

	function onHHSelected(hse: Hse) {
		setHse(hse);
	}

	useEffect(() => {
		ApiService.getAllHses().then((res) => {
			setHses(res.data);
		});
	}, []);

	return (
		<motion.div className="min-h-screen bg-[url(/login-bg-light.png)] dark:bg-[url(/login-bg-dark.png)] place-content-center place-items-center"
			initial={{ opacity: 0 }} animate={{ opacity: 1 }} >
			<Card className="w-[400px]">
				<CardHeader>
					<CardTitle>Log in</CardTitle>
					<CardDescription>
						Log in to your household account
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-2">
					<div className="space-y-1 flex flex-col">
						<Label>Account</Label>
						<div className="flex flex-row">
							<Input value={hse?.householdName ?? 'Choose account'} disabled />
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button variant="outline"><ChevronDown /></Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent side="bottom" align="end" className="w-[351px]">
									{hses.map((value) => {
										return <DropdownMenuItem onClick={() => onHHSelected(value)} key={value.id}>{value.householdName}</DropdownMenuItem>;
									})}
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
					</div>
					<div className="space-y-1">
						<Label htmlFor="pwd" className="text-muted-foreground">Password</Label>
						<Input id="pwd" type="password" defaultValue="mockpassword" disabled />
					</div>
				</CardContent>
				<CardFooter>
					<Button disabled={hse === undefined}>
						<Link href={`/${routing.household}/${hse?.id}`}>Log in</Link>
					</Button>
				</CardFooter>
			</Card>
		</motion.div>
	);
}